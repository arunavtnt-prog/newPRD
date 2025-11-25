/**
 * Social Media Template Generation API
 *
 * Generates social media templates (Instagram, Facebook, Twitter)
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { projectId, platform = "instagram" } = body;

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    // Get project
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { leadStrategistId: session.user.id },
          {
            projectUsers: {
              some: {
                userId: session.user.id,
              },
            },
          },
        ],
      },
      include: {
        discovery: true,
        colorPalettes: {
          where: { status: "APPROVED" },
          take: 1,
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found or access denied" },
        { status: 404 }
      );
    }

    // Generate templates
    const templates = await generateSocialMediaTemplates(
      project,
      platform,
      project.discovery,
      project.colorPalettes[0]
    );

    // Save templates as assets/files
    const savedTemplates = await Promise.all(
      templates.map(async (template, index) => {
        // Create file record
        const file = await prisma.file.create({
          data: {
            projectId: project.id,
            originalFilename: `${platform}-template-${index + 1}.png`,
            fileType: "image/png",
            fileSize: template.fileSize || 0,
            folder: "SocialTemplates",
            downloadUrl: template.url,
            uploadedById: session.user.id,
            isDeleted: false,
          },
        });

        // Create asset record
        const asset = await prisma.asset.create({
          data: {
            projectId: project.id,
            assetName: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Template ${index + 1}`,
            assetType: "SOCIAL_TEMPLATE",
            fileUrl: template.url,
            status: "PENDING_REVIEW",
          },
        });

        return { file, asset };
      })
    );

    // Create activity log
    await prisma.activity.create({
      data: {
        projectId: project.id,
        userId: session.user.id,
        activityType: "ASSET_GENERATED",
        description: `Generated ${savedTemplates.length} ${platform} template(s)`,
      },
    });

    return NextResponse.json({
      success: true,
      templates: savedTemplates.map((t) => ({
        id: t.asset.id,
        name: t.asset.assetName,
        url: t.asset.fileUrl,
        status: t.asset.status,
      })),
      message: `Generated ${savedTemplates.length} ${platform} templates successfully`,
    });
  } catch (error) {
    console.error("Error generating templates:", error);
    return NextResponse.json(
      { error: "Failed to generate templates" },
      { status: 500 }
    );
  }
}

async function generateSocialMediaTemplates(
  project: any,
  platform: string,
  discovery: any,
  colorPalette: any
): Promise<Array<{ url: string; fileSize?: number }>> {
  try {
    // In production, use Puppeteer, Canvas, or Fabric.js to generate templates
    // Example with Puppeteer:
    /*
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set dimensions based on platform
    const dimensions = {
      instagram: { width: 1080, height: 1080 },
      facebook: { width: 1200, height: 630 },
      twitter: { width: 1200, height: 675 },
    };

    await page.setViewport(dimensions[platform]);

    // Generate HTML template with brand colors and content
    const html = generateTemplateHTML(project, colorPalette);
    await page.setContent(html);

    // Take screenshot
    const screenshot = await page.screenshot({ type: 'png' });

    // Upload to S3 or storage
    const url = await uploadToStorage(screenshot);

    await browser.close();

    return [{ url, fileSize: screenshot.length }];
    */

    // Mock templates for development
    const brandName = project.projectName;
    const dimensions = {
      instagram: "1080x1080",
      facebook: "1200x630",
      twitter: "1200x675",
    };

    const dim = dimensions[platform as keyof typeof dimensions] || "1080x1080";

    return [
      {
        url: `https://via.placeholder.com/${dim}/667eea/ffffff?text=${encodeURIComponent(brandName)}+Post+1`,
        fileSize: 85000,
      },
      {
        url: `https://via.placeholder.com/${dim}/764ba2/ffffff?text=${encodeURIComponent(brandName)}+Post+2`,
        fileSize: 82000,
      },
      {
        url: `https://via.placeholder.com/${dim}/f093fb/ffffff?text=${encodeURIComponent(brandName)}+Post+3`,
        fileSize: 88000,
      },
    ];
  } catch (error) {
    console.error("Error generating social media templates:", error);
    throw new Error("Failed to generate templates");
  }
}

function generateTemplateHTML(project: any, colorPalette: any): string {
  // Generate HTML template with brand styling
  const primaryColor = colorPalette?.primaryColor || "#667eea";
  const secondaryColor = colorPalette?.secondaryColor || "#764ba2";

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 0;
            width: 1080px;
            height: 1080px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%);
            font-family: 'Arial', sans-serif;
          }
          .content {
            text-align: center;
            color: white;
            padding: 40px;
          }
          h1 {
            font-size: 72px;
            margin: 0 0 20px 0;
            font-weight: bold;
          }
          p {
            font-size: 32px;
            margin: 0;
          }
        </style>
      </head>
      <body>
        <div class="content">
          <h1>${project.projectName}</h1>
          <p>Social Media Template</p>
        </div>
      </body>
    </html>
  `;
}
