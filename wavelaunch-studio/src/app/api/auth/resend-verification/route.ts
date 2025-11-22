/**
 * Resend Email Verification API Route
 *
 * Sends a new verification email to the user
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { emailService } from '@/lib/email/email-service';
import { randomBytes } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      console.log(`Verification email requested for non-existent email: ${email}`);
      return NextResponse.json({
        message: 'If an account exists with this email, you will receive a verification link.',
      });
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json({
        message: 'Email is already verified',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      console.log(`Verification email requested for inactive user: ${email}`);
      return NextResponse.json({
        message: 'If an account exists with this email, you will receive a verification link.',
      });
    }

    // Generate new verification token
    const verificationToken = randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Save token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires,
      },
    });

    // Create verification URL
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${verificationToken}`;

    // Send email
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

    if (!emailSent) {
      console.error('Failed to send verification email to:', email);
      // Don't reveal to user that email failed
    }

    return NextResponse.json({
      message: 'If an account exists with this email, you will receive a verification link.',
    });
  } catch (error) {
    console.error('Error in resend verification:', error);
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
