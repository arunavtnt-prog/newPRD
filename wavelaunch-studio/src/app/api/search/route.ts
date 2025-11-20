/**
 * Global Search API
 *
 * GET /api/search - Search across projects, users, files, and more
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim() || "";
    const type = searchParams.get("type"); // project, user, file, approval
    const status = searchParams.get("status");
    const assignedTo = searchParams.get("assignedTo");
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!query) {
      return NextResponse.json({ results: [] });
    }

    const results = {
      projects: [] as any[],
      users: [] as any[],
      files: [] as any[],
      approvals: [] as any[],
    };

    // Search projects
    if (!type || type === "project") {
      const projectWhere: any = {
        OR: [
          { projectName: { contains: query, mode: "insensitive" } },
          { creatorName: { contains: query, mode: "insensitive" } },
          { category: { contains: query, mode: "insensitive" } },
        ],
      };

      if (status) projectWhere.status = status;
      if (assignedTo) projectWhere.leadStrategistId = assignedTo;

      results.projects = await prisma.project.findMany({
        where: projectWhere,
        select: {
          id: true,
          projectName: true,
          creatorName: true,
          category: true,
          status: true,
          createdAt: true,
          leadStrategist: {
            select: {
              id: true,
              fullName: true,
            },
          },
        },
        take: limit,
        orderBy: { updatedAt: "desc" },
      });
    }

    // Search users
    if (!type || type === "user") {
      results.users = await prisma.user.findMany({
        where: {
          OR: [
            { fullName: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
            { department: { contains: query, mode: "insensitive" } },
            { jobTitle: { contains: query, mode: "insensitive" } },
          ],
          isActive: true,
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          department: true,
          jobTitle: true,
          avatarUrl: true,
        },
        take: limit,
      });
    }

    // Search files
    if (!type || type === "file") {
      results.files = await prisma.file.findMany({
        where: {
          OR: [
            { originalFilename: { contains: query, mode: "insensitive" } },
            { filename: { contains: query, mode: "insensitive" } },
          ],
          isDeleted: false,
        },
        select: {
          id: true,
          originalFilename: true,
          fileType: true,
          fileSize: true,
          folder: true,
          createdAt: true,
          project: {
            select: {
              id: true,
              projectName: true,
            },
          },
          uploadedBy: {
            select: {
              fullName: true,
            },
          },
        },
        take: limit,
        orderBy: { createdAt: "desc" },
      });
    }

    // Search approvals
    if (!type || type === "approval") {
      results.approvals = await prisma.approval.findMany({
        where: {
          OR: [
            { message: { contains: query, mode: "insensitive" } },
            {
              project: {
                projectName: { contains: query, mode: "insensitive" },
              },
            },
          ],
        },
        select: {
          id: true,
          message: true,
          status: true,
          dueDate: true,
          createdAt: true,
          project: {
            select: {
              id: true,
              projectName: true,
            },
          },
          reviewers: {
            select: {
              status: true,
            },
          },
        },
        take: limit,
        orderBy: { createdAt: "desc" },
      });
    }

    const totalResults =
      results.projects.length +
      results.users.length +
      results.files.length +
      results.approvals.length;

    return NextResponse.json({
      results,
      totalResults,
      query,
    });
  } catch (error) {
    console.error("Error searching:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
