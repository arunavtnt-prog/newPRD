/**
 * File Upload API Route
 *
 * Handles file uploads for projects with Cloudinary integration
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { uploadToCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const projectId = formData.get("projectId") as string;
    const folder = formData.get("folder") as string;
    const category = formData.get("category") as string | null;
    const tagsJson = formData.get("tags") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID required" },
        { status: 400 }
      );
    }

    // Verify project exists and user has access
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, projectName: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Validate file size (50MB max)
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 50MB limit" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'video/mp4',
      'video/quicktime',
      'video/x-msvideo',
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `File type ${file.type} is not supported` },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary (or fallback to local if not configured)
    let fileUrl: string;
    let publicId: string;
    let thumbnailUrl: string | null = null;

    if (isCloudinaryConfigured()) {
      try {
        const uploadResult = await uploadToCloudinary(buffer, {
          folder: `wavelaunch-studio/${projectId}/${folder || 'files'}`,
          resourceType: 'auto',
          publicId: `${nanoid()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
        });

        fileUrl = uploadResult.secureUrl;
        publicId = uploadResult.publicId;
        thumbnailUrl = uploadResult.thumbnailUrl || null;
      } catch (error) {
        console.error('Cloudinary upload failed:', error);
        return NextResponse.json(
          { error: 'Failed to upload file to cloud storage' },
          { status: 500 }
        );
      }
    } else {
      // Fallback: local storage for development
      console.warn('Cloudinary not configured, using local storage');
      const { writeFile, mkdir } = await import('fs/promises');
      const { join } = await import('path');

      const fileExtension = file.name.split(".").pop();
      const uniqueFilename = `${nanoid()}.${fileExtension}`;
      const uploadDir = join(process.cwd(), "public", "uploads", projectId);

      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (error) {
        // Directory might already exist
      }

      const filePath = join(uploadDir, uniqueFilename);
      await writeFile(filePath, buffer);

      fileUrl = `/uploads/${projectId}/${uniqueFilename}`;
      publicId = uniqueFilename;
    }

    // Save file record to database
    const fileRecord = await prisma.file.create({
      data: {
        filename: publicId,
        originalFilename: file.name,
        fileType: file.type,
        fileSize: file.size,
        s3Key: publicId,
        s3Url: fileUrl,
        thumbnailS3Url: thumbnailUrl,
        projectId: projectId,
        folder: (folder as any) || "CREATOR_UPLOADS",
        uploadedById: session.user.id,
        category: category,
        tags: tagsJson || "[]",
      },
      include: {
        uploadedBy: {
          select: {
            fullName: true,
          },
        },
      },
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        projectId: projectId,
        userId: session.user.id,
        actionType: "FILE_UPLOADED",
        actionDescription: `Uploaded file "${file.name}"`,
        metadata: JSON.stringify({
          filename: file.name,
          fileType: file.type,
          fileSize: file.size,
          folder: folder,
        }),
      },
    });

    return NextResponse.json(fileRecord, { status: 201 });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

// Configure for larger file uploads (10MB default)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};
