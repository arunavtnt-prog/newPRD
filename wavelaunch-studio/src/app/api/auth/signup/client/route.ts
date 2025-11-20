/**
 * Client Signup API Route
 * Handles new client registration
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, phoneNumber, companyName, password } = body;

    // Validation
    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with CLIENT role
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        phoneNumber: phoneNumber || null,
        companyName: companyName || null,
        password: hashedPassword,
        role: "CLIENT",
        isActive: true,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: "USER_REGISTERED",
        entity: "USER",
        entityId: user.id,
        details: {
          userRole: "CLIENT",
          fullName: user.fullName,
          email: user.email,
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Client signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
