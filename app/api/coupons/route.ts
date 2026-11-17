import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';

    const where = activeOnly ? { active: true } : {};
    const coupons = await prisma.coupon.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: coupons });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch coupons' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, type, value, minOrder, maxDiscount, desc } = body;

    if (!code || !type || value === undefined) {
      return NextResponse.json({ success: false, error: 'Missing required coupon fields' }, { status: 400 });
    }

    const created = await prisma.coupon.create({
      data: {
        code: code.trim().toUpperCase(),
        type,
        value: Number(value),
        minOrder: Number(minOrder) || 0,
        maxDiscount: maxDiscount ? Number(maxDiscount) : null,
        desc: desc || `${value}${type === 'PERCENT' ? '% OFF' : ' FLAT OFF'} on your pickup order`,
        active: true,
      },
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    console.error('Error creating coupon:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ success: false, error: 'Coupon code already exists' }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Failed to create coupon' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, active } = await request.json();

    if (!id || active === undefined) {
      return NextResponse.json({ success: false, error: 'Coupon ID and active status are required' }, { status: 400 });
    }

    const updated = await prisma.coupon.update({
      where: { id },
      data: { active },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error toggling coupon status:', error);
    return NextResponse.json({ success: false, error: 'Failed to update coupon' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Coupon ID is required' }, { status: 400 });
    }

    await prisma.coupon.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Coupon deleted' });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete coupon' }, { status: 500 });
  }
}
