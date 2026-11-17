import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { login, password } = await request.json();

    if (!login || !password) {
      return NextResponse.json(
        { success: false, error: 'Login and password are required' },
        { status: 400 }
      );
    }

    const staff = await prisma.staffUser.findUnique({
      where: { login: login.trim() },
    });

    if (!staff || staff.password !== password) {
      return NextResponse.json(
        { success: false, error: 'Invalid login credentials' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: staff.id,
        name: staff.name,
        roleTitle: staff.roleTitle,
        login: staff.login,
        isOwner: staff.isOwner,
        permissions: JSON.parse(staff.permissions),
      },
    });
  } catch (error) {
    console.error('Error in staff login:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
