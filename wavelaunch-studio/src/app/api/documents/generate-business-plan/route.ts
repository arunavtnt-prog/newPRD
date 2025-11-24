/**
 * Business Plan Generation API Route
 *
 * Generates a branded business plan PDF from project Discovery data
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { renderToBuffer } from '@react-pdf/renderer';
import { BusinessPlanDocument } from '@/lib/pdf/business-plan-template';
import { uploadToGoogleDrive } from '@/lib/google-drive';
import React from 'react';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins and team members can generate business plans
    if (session.user.role === 'CREATOR') {
      return NextResponse.json(
        { error: 'Only admins can generate business plans' },
        { status: 403 }
      );
    }

    const { projectId } = await request.json();

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Fetch project with discovery data
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        discovery: true,
        leadStrategist: {
          select: {
            fullName: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (!project.discovery) {
      return NextResponse.json(
        { error: 'Project discovery data not found. Complete the Discovery phase first.' },
        { status: 400 }
      );
    }

    // Prepare data for PDF template
    const businessPlanData = {
      projectName: project.projectName,
      creatorName: project.creatorName,
      category: project.category,
      startDate: project.startDate.toISOString(),
      expectedLaunchDate: project.expectedLaunchDate.toISOString(),

      brandVision: project.discovery.brandVision,
      brandMission: project.discovery.brandMission,
      brandValues: project.discovery.brandValues,
      brandPersonality: project.discovery.brandPersonality,

      productCategory: project.discovery.productCategory,
      productDescription: project.discovery.productDescription,
      productDifferentiators: project.discovery.productDifferentiators,
      pricePoint: project.discovery.pricePoint,

      targetAgeRange: project.discovery.targetAgeRange,
      targetGender: project.discovery.targetGender,
      targetIncome: project.discovery.targetIncome,
      targetLocation: project.discovery.targetLocation,
      audiencePainPoints: project.discovery.audiencePainPoints,
      audienceAspirations: project.discovery.audienceAspirations,

      toneOfVoice: project.discovery.toneOfVoice,
      aestheticDirection: project.discovery.aestheticDirection,

      inspirationBrands: project.discovery.inspirationBrands,
      competitorBrands: project.discovery.competitorBrands,
      differentiationStrategy: project.discovery.differentiationStrategy,

      contentPillars: project.discovery.contentPillars,
      socialMediaFocus: project.discovery.socialMediaFocus,
      launchGoals: project.discovery.launchGoals,

      colorPreferences: project.discovery.colorPreferences || undefined,
      mustHaveElements: project.discovery.mustHaveElements || undefined,
      additionalNotes: project.discovery.additionalNotes || undefined,
    };

    // Generate PDF
    const pdfBuffer = await renderToBuffer(
      React.createElement(BusinessPlanDocument, { data: businessPlanData })
    );

    // Upload to Google Drive
    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = `${project.projectName.replace(/\s+/g, '_')}_Business_Plan_${timestamp}.pdf`;

    const uploadResult = await uploadToGoogleDrive(
      Buffer.from(pdfBuffer),
      fileName,
      {
        folder: 'business-plans',
        makePublic: false, // Keep private for client confidentiality
        mimeType: 'application/pdf',
      }
    );

    // Save file record to database
    const fileRecord = await prisma.file.create({
      data: {
        filename: fileName,
        originalFilename: fileName,
        fileType: 'application/pdf',
        fileSize: pdfBuffer.byteLength,
        s3Key: uploadResult.id,
        s3Url: uploadResult.downloadUrl,
        thumbnailS3Url: null,
        projectId: projectId,
        folder: 'GENERATED_TEMPLATES',
        uploadedById: session.user.id,
        category: 'BUSINESS_PLAN',
        tags: JSON.stringify(['business-plan', 'ai-generated', 'template']),
      },
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        projectId: projectId,
        userId: session.user.id,
        actionType: 'FILE_UPLOADED',
        actionDescription: `Generated business plan PDF: "${fileName}"`,
        metadata: JSON.stringify({
          filename: fileName,
          fileType: 'application/pdf',
          fileSize: pdfBuffer.byteLength,
          category: 'BUSINESS_PLAN',
          generatedBy: 'AI',
        }),
      },
    });

    return NextResponse.json(
      {
        message: 'Business plan generated successfully',
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
    console.error('Error generating business plan:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate business plan',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
