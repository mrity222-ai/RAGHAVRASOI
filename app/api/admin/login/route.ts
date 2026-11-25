import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPassword } from '@/lib/password';
import { ADMIN_COOKIE_NAME, createAdminSessionToken } from '@/lib/admin-auth';

export async function POST(request: Request) {
  try {
    const { login, password } = await request.json();

    if (!login || !password) {
      return NextResponse.json(
        { success: false, error: 'Login and password are required' },
        { status: 400 }
      );
    }

    const cleanLogin = login.trim();
    let staff = await prisma.staffUser.findUnique({
      where: { login: cleanLogin },
    });

    // Alias fallback between .com and .in
    if (!staff) {
      if (cleanLogin === 'admin@raghavrasoi.in') {
        staff = await prisma.staffUser.findUnique({ where: { login: 'admin@raghavrasoi.com' } });
      } else if (cleanLogin === 'admin@raghavrasoi.com') {
        staff = await prisma.staffUser.findUnique({ where: { login: 'admin@raghavrasoi.in' } });
      }
    }

    if (!staff || !verifyPassword(password, staff.password)) {
      return NextResponse.json(
        { success: false, error: 'Invalid login credentials' },
        { status: 401 }
      );
    }

    const permissions: string[] = JSON.parse(staff.permissions);
    const token = createAdminSessionToken({
      staffId: staff.id,
      login: staff.login,
      isOwner: staff.isOwner,
      permissions,
    });

    const response = NextResponse.json({
      success: true,
      data: {
        id: staff.id,
        name: staff.name,
        roleTitle: staff.roleTitle,
        login: staff.login,
        isOwner: staff.isOwner,
        permissions,
      },
    });

    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Error in staff login:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
