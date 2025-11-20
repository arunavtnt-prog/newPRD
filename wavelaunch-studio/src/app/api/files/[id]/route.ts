/**
 * File API Route
 *
 * Handles file operations (delete, update, etc.)
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { unlink } from "fs/promises";
import { join } from "path";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const fileId = params.id;

    // Fetch file record
    const file = await prisma.file.findUnique({
      where: { id: fileId },
      include: {
        project: {
          select: {
            id: true,
            projectName: true,
          },
        },
      },
    });

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Soft delete the file record
    await prisma.file.update({
      where: { id: fileId },
      data: { isDeleted: true },
    });

    // In production, this would delete from S3
    // For local development, delete the file from disk
    try {
      const filePath = join(
        process.cwd(),
        "public",
        "uploads",
        file.projectId,
        file.filename
      );
      await unlink(filePath);
    } catch (error) {
      // File might not exist, that's okay
      console.log("Could not delete file from disk:", error);
    }

    // Create activity log
    await prisma.activity.create({
      data: {
        projectId: file.projectId,
        userId: session.user.id,
        actionType: "FILE_UPLOADED", // We don't have FILE_DELETED in enum yet
        actionDescription: `Deleted file "${file.originalFilename}"`,
        metadata: JSON.stringify({
          filename: file.originalFilename,
          fileType: file.fileType,
          folder: file.folder,
        }),
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
