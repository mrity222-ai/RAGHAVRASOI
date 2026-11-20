import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const staff = await prisma.staffUser.findMany({
      orderBy: { createdAt: 'asc' },
    });

    const parsed = staff.map((s) => ({
      ...s,
      permissions: JSON.parse(s.permissions),
    }));

    return NextResponse.json({ success: true, data: parsed });
  } catch (error) {
    console.error('Error fetching staff list:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch staff' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, roleTitle, login, password, permissions } = body;

    if (!name || !roleTitle || !login || !permissions) {
      return NextResponse.json({ success: false, error: 'Missing required staff fields' }, { status: 400 });
    }

    const newStaff = await prisma.staffUser.create({
      data: {
        name,
        roleTitle,
        login: login.trim(),
        password: password || 'staff@123',
        isOwner: false,
        permissions: JSON.stringify(permissions),
      },
    });

    return NextResponse.json({
      success: true,
      data: { ...newStaff, permissions: JSON.parse(newStaff.permissions) },
    });
  } catch (error: any) {
    console.error('Error creating staff:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ success: false, error: 'Login email/mobile already exists' }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Failed to create staff' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, roleTitle, login, password, permissions } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Staff ID is required' }, { status: 400 });
    }

    const updateData: any = {
      name,
      roleTitle,
      login: login.trim(),
      permissions: JSON.stringify(permissions),
    };
    if (password) {
      updateData.password = password;
    }

    const updated = await prisma.staffUser.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: { ...updated, permissions: JSON.parse(updated.permissions) },
    });
  } catch (error) {
    console.error('Error updating staff:', error);
    return NextResponse.json({ success: false, error: 'Failed to update staff' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Staff ID is required' }, { status: 400 });
    }

    const target = await prisma.staffUser.findUnique({ where: { id } });
    if (!target) {
      return NextResponse.json({ success: false, error: 'Staff not found' }, { status: 404 });
    }
    if (target.isOwner) {
      return NextResponse.json({ success: false, error: 'Master/Owner account cannot be deleted' }, { status: 403 });
    }

    await prisma.staffUser.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Staff deleted' });
  } catch (error) {
    console.error('Error deleting staff:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete staff' }, { status: 500 });
  }
}
