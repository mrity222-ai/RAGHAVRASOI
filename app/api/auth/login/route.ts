import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPassword } from '@/lib/password';

export async function POST(request: Request) {
  try {
    const { login, password } = await request.json();

    if (!login?.trim() || !password?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Email/Mobile and password are required' },
        { status: 400 }
      );
    }

    const cleanLogin = login.trim().toLowerCase();
    const cleanPass = password.trim();

    // Find customer by email or phone
    const user = await prisma.customerUser.findFirst({
      where: {
        OR: [
          { email: cleanLogin },
          { phone: login.trim() },
        ],
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'No account found with this email or mobile number.' },
        { status: 404 }
      );
    }

    // Verify password (scrypt, legacy sha256, or legacy plain text)
    if (!verifyPassword(cleanPass, user.password)) {
      return NextResponse.json(
        { success: false, error: 'Incorrect password. Please try again.' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Logged in successfully',
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Customer login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}
