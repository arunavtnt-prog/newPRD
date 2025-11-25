/**
 * Brand Assets Download API Route
 *
 * Creates a ZIP file of all brand assets and uploads to Google Drive
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { uploadToGoogleDrive } from '@/lib/google-drive';
import JSZip from 'jszip';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const projectId = params.id;

    // Fetch project with all brand assets
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        discovery: true,
        colorPalettes: {
          where: { isApproved: true },
        },
        typography: true,
        files: {
          where: {
            folder: {
              in: ['BRAND', 'GENERATED_LOGOS', 'GENERATED_TEMPLATES'],
            },
            isDeleted: false,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Create ZIP file
    const zip = new JSZip();

    // Add README file
    const readmeContent = `${project.projectName} - Brand Assets Package

Generated: ${new Date().toISOString()}

This package contains all approved brand assets for ${project.projectName}.

Contents:
- Brand Guidelines (PDF)
- Logo Files
- Color Palettes
- Typography Specifications
- Brand Assets

For questions, contact your WaveLaunch strategist.
`;

    zip.file('README.txt', readmeContent);

    // Add discovery/brand strategy document
    if (project.discovery) {
      const brandStrategy = `${project.projectName} - Brand Strategy

BRAND VISION
${project.discovery.brandVision}

BRAND MISSION
${project.discovery.brandMission}

CORE VALUES
${project.discovery.brandValues}

BRAND PERSONALITY
${project.discovery.brandPersonality}

TONE OF VOICE
${project.discovery.toneOfVoice}

AESTHETIC DIRECTION
${project.discovery.aestheticDirection}

TARGET AUDIENCE
- Age Range: ${project.discovery.targetAgeRange}
- Gender: ${project.discovery.targetGender}
- Income Level: ${project.discovery.targetIncome}
- Location: ${project.discovery.targetLocation}

DIFFERENTIATORS
${project.discovery.productDifferentiators}

DIFFERENTIATION STRATEGY
${project.discovery.differentiationStrategy}
`;

      zip.file('Brand_Strategy.txt', brandStrategy);
    }

    // Add color palette JSON
    if (project.colorPalettes.length > 0) {
      const colorsFolder = zip.folder('Color_Palettes');
      project.colorPalettes.forEach((palette, index) => {
        const colorData = {
          name: palette.name,
          primaryColor: palette.primaryColor,
          secondaryColor: palette.secondaryColor,
          accentColor: palette.accentColor,
          neutralLight: palette.neutralLight,
          neutralDark: palette.neutralDark,
          backgroundColor: palette.backgroundColor,
          textColor: palette.textColor,
        };

        colorsFolder?.file(
          `palette_${index + 1}_${palette.name.replace(/\s+/g, '_')}.json`,
          JSON.stringify(colorData, null, 2)
        );

        // Create HTML color swatch preview
        const swatchHTML = `
<!DOCTYPE html>
<html>
<head>
  <title>${palette.name} - Color Palette</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      padding: 40px;
      background: #f5f5f5;
    }
    h1 { margin-bottom: 30px; }
    .colors { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 20px; }
    .color-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .color-swatch {
      height: 120px;
      width: 100%;
    }
    .color-info {
      padding: 15px;
    }
    .color-name {
      font-weight: 600;
      font-size: 14px;
      margin-bottom: 5px;
    }
    .color-value {
      font-family: monospace;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <h1>${palette.name}</h1>
  <div class="colors">
    ${palette.primaryColor ? `<div class="color-card"><div class="color-swatch" style="background: ${palette.primaryColor}"></div><div class="color-info"><div class="color-name">Primary</div><div class="color-value">${palette.primaryColor}</div></div></div>` : ''}
    ${palette.secondaryColor ? `<div class="color-card"><div class="color-swatch" style="background: ${palette.secondaryColor}"></div><div class="color-info"><div class="color-name">Secondary</div><div class="color-value">${palette.secondaryColor}</div></div></div>` : ''}
    ${palette.accentColor ? `<div class="color-card"><div class="color-swatch" style="background: ${palette.accentColor}"></div><div class="color-info"><div class="color-name">Accent</div><div class="color-value">${palette.accentColor}</div></div></div>` : ''}
    ${palette.neutralLight ? `<div class="color-card"><div class="color-swatch" style="background: ${palette.neutralLight}"></div><div class="color-info"><div class="color-name">Neutral Light</div><div class="color-value">${palette.neutralLight}</div></div></div>` : ''}
    ${palette.neutralDark ? `<div class="color-card"><div class="color-swatch" style="background: ${palette.neutralDark}"></div><div class="color-info"><div class="color-name">Neutral Dark</div><div class="color-value">${palette.neutralDark}</div></div></div>` : ''}
  </div>
</body>
</html>
        `;

        colorsFolder?.file(
          `palette_${index + 1}_${palette.name.replace(/\s+/g, '_')}_preview.html`,
          swatchHTML
        );
      });
    }

    // Add typography specifications
    if (project.typography) {
      const typographyData = {
        name: project.typography.name,
        primaryFont: {
          family: project.typography.primaryFontFamily,
          weights: JSON.parse(project.typography.primaryFontWeights || '[]'),
          source: project.typography.primaryFontSource,
        },
        secondaryFont: {
          family: project.typography.secondaryFontFamily,
          weights: JSON.parse(project.typography.secondaryFontWeights || '[]'),
          source: project.typography.secondaryFontSource,
        },
        accentFont: project.typography.accentFontFamily
          ? {
              family: project.typography.accentFontFamily,
              weights: JSON.parse(
                project.typography.accentFontWeights || '[]'
              ),
              source: project.typography.accentFontSource,
            }
          : null,
        usage: {
          headingScale: project.typography.headingScale,
          bodySize: project.typography.bodySize,
          notes: project.typography.notes,
        },
      };

      zip.file('Typography/typography.json', JSON.stringify(typographyData, null, 2));
    }

    // Add brand asset files
    // Note: We're creating a manifest of files rather than downloading them
    // In a production environment, you would fetch the actual files from their URLs
    if (project.files.length > 0) {
      const filesManifest = project.files.map((file) => ({
        filename: file.originalFilename,
        type: file.fileType,
        size: file.fileSize,
        folder: file.folder,
        url: file.s3Url,
        uploadedAt: file.createdAt,
      }));

      zip.file(
        'Brand_Assets/files_manifest.json',
        JSON.stringify(filesManifest, null, 2)
      );

      // Add instructions for downloading files
      const downloadInstructions = `Brand Asset Files

The following files are available for this project:

${project.files
  .map(
    (file, index) =>
      `${index + 1}. ${file.originalFilename}
   Type: ${file.fileType}
   Size: ${(file.fileSize / 1024).toFixed(2)} KB
   Download: ${file.s3Url}
`
  )
  .join('\n')}

NOTE: Files are stored securely. Use the URLs above to download individual files.
If you need direct access to all files, contact your WaveLaunch strategist.
`;

      zip.file('Brand_Assets/DOWNLOAD_INSTRUCTIONS.txt', downloadInstructions);
    }

    // Generate ZIP file
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    // Upload to Google Drive
    const timestamp = new Date().toISOString().split('T')[0];
    const zipFileName = `${project.projectName.replace(/\s+/g, '_')}_Brand_Assets_${timestamp}.zip`;

    const uploadResult = await uploadToGoogleDrive(zipBuffer, zipFileName, {
      folder: 'brand-assets',
      makePublic: false,
      mimeType: 'application/zip',
    });

    // Save file record to database
    const fileRecord = await prisma.file.create({
      data: {
        filename: zipFileName,
        originalFilename: zipFileName,
        fileType: 'application/zip',
        fileSize: zipBuffer.length,
        s3Key: uploadResult.id,
        s3Url: uploadResult.downloadUrl,
        thumbnailS3Url: null,
        projectId: projectId,
        folder: 'BRAND',
        uploadedById: session.user.id,
        category: 'BRAND_ASSETS_PACKAGE',
        tags: JSON.stringify(['brand-assets', 'zip', 'package']),
      },
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        projectId: projectId,
        userId: session.user.id,
        actionType: 'FILE_UPLOADED',
        actionDescription: `Downloaded brand assets package: "${zipFileName}"`,
        metadata: JSON.stringify({
          filename: zipFileName,
          fileType: 'application/zip',
          fileSize: zipBuffer.length,
          assetsIncluded: {
            colorPalettes: project.colorPalettes.length,
            typography: project.typography ? 1 : 0,
            files: project.files.length,
            discovery: project.discovery ? 1 : 0,
          },
        }),
      },
    });

    return NextResponse.json(
      {
        message: 'Brand assets package created successfully',
        file: {
          id: fileRecord.id,
          filename: fileRecord.filename,
          downloadUrl: uploadResult.downloadUrl,
          webViewLink: uploadResult.webViewLink,
          fileSize: fileRecord.fileSize,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating brand assets package:', error);
    return NextResponse.json(
      {
        error: 'Failed to create brand assets package',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
