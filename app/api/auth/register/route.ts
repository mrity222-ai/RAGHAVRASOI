import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password.trim()).digest('hex');
}

export async function POST(request: Request) {
  try {
    const { name, phone, email, password } = await request.json();

    if (!name?.trim() || !phone?.trim() || !email?.trim() || !password?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Name, phone number, email, and password are required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    // Check if email already registered
    const existing = await prisma.customerUser.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists. Please log in.' },
        { status: 409 }
      );
    }

    const hashedPassword = hashPassword(password);

    const user = await prisma.customerUser.create({
      data: {
        name: name.trim(),
        phone: cleanPhone,
        email: cleanEmail,
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Account created successfully! Welcome to Raghav Rasoi.',
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Customer registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create account. Please try again.' },
      { status: 500 }
    );
  }
}
