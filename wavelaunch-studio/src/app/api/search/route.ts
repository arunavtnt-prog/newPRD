/**
 * Global Search API Route
 *
 * Searches across projects, files, approvals, and users
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");
    const type = searchParams.get("type"); // all, projects, files, approvals, users

    if (!query || query.length < 2) {
      return NextResponse.json(
        { error: "Search query must be at least 2 characters" },
        { status: 400 }
      );
    }

    const searchQuery = query.toLowerCase();
    const isAdmin = session.user.role === "ADMIN" || session.user.role === "TEAM_MEMBER";

    // Build results object
    const searchResults: any = {
      projects: [],
      files: [],
      approvals: [],
      users: [],
    };

    // Search Projects
    if (!type || type === "all" || type === "projects") {
      const projectsWhere: any = {
        OR: [
          { projectName: { contains: searchQuery, mode: "insensitive" } },
          { creatorName: { contains: searchQuery, mode: "insensitive" } },
          { category: { contains: searchQuery, mode: "insensitive" } },
        ],
      };

      // Non-admins only see their assigned projects
      if (!isAdmin) {
        projectsWhere.AND = {
          projectUsers: {
            some: {
              userId: session.user.id,
            },
          },
        };
      }

      searchResults.projects = await prisma.project.findMany({
        where: projectsWhere,
        select: {
          id: true,
          projectName: true,
          creatorName: true,
          category: true,
          status: true,
          expectedLaunchDate: true,
          leadStrategist: {
            select: {
              id: true,
              fullName: true,
            },
          },
        },
        take: 10,
        orderBy: { updatedAt: "desc" },
      });
    }

    // Search Files
    if (!type || type === "all" || type === "files") {
      const filesWhere: any = {
        isDeleted: false,
        OR: [
          { originalFilename: { contains: searchQuery, mode: "insensitive" } },
          { folder: { contains: searchQuery, mode: "insensitive" } },
        ],
      };

      // Non-admins only see files from their projects
      if (!isAdmin) {
        filesWhere.AND = {
          project: {
            projectUsers: {
              some: {
                userId: session.user.id,
              },
            },
          },
        };
      }

      searchResults.files = await prisma.file.findMany({
        where: filesWhere,
        select: {
          id: true,
          originalFilename: true,
          fileType: true,
          fileSize: true,
          folder: true,
          downloadUrl: true,
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
        take: 10,
        orderBy: { createdAt: "desc" },
      });
    }

    // Search Approvals
    if (!type || type === "all" || type === "approvals") {
      const approvalsWhere: any = {
        OR: [
          { message: { contains: searchQuery, mode: "insensitive" } },
        ],
      };

      // Non-admins only see approvals from their projects
      if (!isAdmin) {
        approvalsWhere.AND = {
          project: {
            projectUsers: {
              some: {
                userId: session.user.id,
              },
            },
          },
        };
      }

      searchResults.approvals = await prisma.approval.findMany({
        where: approvalsWhere,
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
              reviewer: {
                select: {
                  fullName: true,
                },
              },
            },
          },
        },
        take: 10,
        orderBy: { createdAt: "desc" },
      });
    }

    // Search Users (Admin only)
    if (isAdmin && (!type || type === "all" || type === "users")) {
      searchResults.users = await prisma.user.findMany({
        where: {
          OR: [
            { fullName: { contains: searchQuery, mode: "insensitive" } },
            { email: { contains: searchQuery, mode: "insensitive" } },
          ],
          isActive: true,
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          avatarUrl: true,
        },
        take: 10,
      });
    }

    // Calculate total results
    const totalResults =
      searchResults.projects.length +
      searchResults.files.length +
      searchResults.approvals.length +
      searchResults.users.length;

    // Return in expected format
    return NextResponse.json({
      results: searchResults,
      totalResults,
    }, { status: 200 });
  } catch (error) {
    console.error("Error in global search:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
