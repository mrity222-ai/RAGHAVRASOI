import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { sendOtpSms } from '@/lib/sms';

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

    // Send SMS OTP if user has a phone number and FAST2SMS_API_KEY is configured
    if (user.phone && process.env.FAST2SMS_API_KEY) {
      await sendOtpSms(user.phone, otp);
    }

    const isDev = process.env.NODE_ENV !== 'production';

    return NextResponse.json({
      success: true,
      message: `OTP sent successfully to ${cleanEmail}`,
      ...(isDev ? { devOtp: otp } : {}),
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
