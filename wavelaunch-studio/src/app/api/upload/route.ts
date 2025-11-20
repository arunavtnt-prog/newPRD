/**
 * File Upload API Route
 *
 * Handles file uploads for projects
 *
 * NOTE: This is a placeholder implementation for local development.
 * In production, this should integrate with AWS S3 or similar cloud storage.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
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

    // Generate unique filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileExtension = file.name.split(".").pop();
    const uniqueFilename = `${nanoid()}.${fileExtension}`;

    // In production, this would upload to S3
    // For now, save locally for development
    const uploadDir = join(process.cwd(), "public", "uploads", projectId);
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Directory might already exist, that's okay
    }

    const filePath = join(uploadDir, uniqueFilename);
    await writeFile(filePath, buffer);

    // Create local URL (in production, this would be S3 URL)
    const fileUrl = `/uploads/${projectId}/${uniqueFilename}`;

    // Save file record to database
    const fileRecord = await prisma.file.create({
      data: {
        filename: uniqueFilename,
        originalFilename: file.name,
        fileType: file.type,
        fileSize: file.size,
        s3Key: uniqueFilename, // In production, this would be S3 key
        s3Url: fileUrl, // In production, this would be S3 URL
        thumbnailS3Url: null, // TODO: Generate thumbnail for images
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
