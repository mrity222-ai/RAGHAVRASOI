import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/admin-auth';

export async function GET(request: Request) {
  const { errorResponse } = await requireAdminAuth();
  if (errorResponse) return errorResponse;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const q = searchParams.get('q');

    const whereClause: any = {};
    if (status) {
      whereClause.status = status;
    }
    if (q) {
      whereClause.OR = [
        { id: { contains: q } },
        { customerName: { contains: q } },
        { customerPhone: { contains: q } },
      ];
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const parsedOrders = orders.map((o) => ({
      ...o,
      items: o.items.map((i) => ({
        ...i,
        addons: i.addons ? JSON.parse(i.addons) : [],
      })),
    }));

    return NextResponse.json({ success: true, data: parsedOrders });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const { errorResponse } = await requireAdminAuth();
  if (errorResponse) return errorResponse;

  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'Order ID and status are required' }, { status: 400 });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true },
    });

    // If order is completed or rejected, automatically free any occupied table
    if (status === 'COMPLETED' || status === 'REJECTED') {
      try {
        await prisma.restaurantTable.updateMany({
          where: { activeOrder: id },
          data: {
            status: 'AVAILABLE',
            activeOrder: null,
          },
        });
      } catch (tableErr) {
        console.error('Non-blocking table release error:', tableErr);
      }
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ success: false, error: 'Failed to update order status' }, { status: 500 });
  }
}
