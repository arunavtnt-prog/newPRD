/**
 * Register/Signup API Route
 *
 * Creates a new user account and sends email verification
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { emailService } from '@/lib/email/email-service';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, role, companyName } = await request.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Generate email verification token
    const verificationToken = randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        fullName: fullName || 'User',
        role: role || 'CREATOR', // Default to CREATOR for new signups
        companyName: companyName || null,
        emailVerified: false,
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires,
      },
    });

    // Create verification URL
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${verificationToken}`;

    // Send verification email
    const emailSent = await emailService.sendTemplateEmail({
      to: user.email,
      template: 'emailVerification',
      subject: 'Verify Your Email - WaveLaunch Studio',
      data: {
        recipientName: user.fullName,
        actionUrl: verificationUrl,
        expiresIn: '24 hours',
      },
    });

    // Send welcome email (optional, after verification)
    if (emailSent) {
      await emailService.sendTemplateEmail({
        to: user.email,
        template: 'welcomeEmail',
        subject: 'Welcome to WaveLaunch Studio!',
        data: {
          recipientName: user.fullName,
          actionUrl: `${baseUrl}/auth/v2/login`,
        },
      });
    }

    return NextResponse.json(
      {
        message: 'Account created successfully. Please check your email to verify your account.',
        userId: user.id,
        email: user.email,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in registration:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration. Please try again.' },
      { status: 500 }
    );
  }
}
