import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Email address is required to send OTP' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user exists
    const user = await prisma.customerUser.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'No account found with this email. Please create an account first.',
        },
        { status: 404 }
      );
    }

    // Generate 6-digit numeric OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes validity

    await prisma.customerUser.update({
      where: { id: user.id },
      data: {
        otpCode: otp,
        otpExpiresAt: expiresAt,
      },
    });

    // In a production server, here we would call an Email service (e.g. Resend, Sendgrid, SES).
    // We provide devOtp in the response so the user can easily see and verify it immediately.
    return NextResponse.json({
      success: true,
      message: `OTP sent successfully to ${cleanEmail}`,
      devOtp: otp, // surfaced for immediate testing and verification
      expiresInMins: 10,
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send OTP. Please try again.' },
      { status: 500 }
    );
  }
}
