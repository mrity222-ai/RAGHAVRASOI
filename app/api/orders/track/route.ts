import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get('q') || searchParams.get('id') || searchParams.get('token') || '').trim();

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Please enter an Order ID or 10-digit Mobile Number' },
        { status: 400 }
      );
    }

    const cleanDigits = query.replace(/\D/g, '');
    const isPhoneNumber = cleanDigits.length >= 10;

    if (isPhoneNumber) {
      const phoneToMatch = cleanDigits.slice(-10);
      const orders = await prisma.order.findMany({
        where: {
          customerPhone: {
            contains: phoneToMatch,
          },
        },
        orderBy: { createdAt: 'desc' },
        include: { items: true },
        take: 10,
      });

      if (!orders.length) {
        return NextResponse.json(
          { success: false, error: `No orders found for mobile number ${phoneToMatch}` },
          { status: 404 }
        );
      }

      // Compute queue position for the latest active order
      const primaryOrder = orders[0];
      const queuePosition = await calculateQueuePosition(primaryOrder);
      const estimatedMins = Math.max(7, (queuePosition + 1) * 7);

      return NextResponse.json({
        success: true,
        data: {
          order: {
            ...primaryOrder,
            items: primaryOrder.items.map(parseItemAddons),
          },
          orders: orders.map((o) => ({
            ...o,
            items: o.items.map(parseItemAddons),
          })),
          queuePosition,
          estimatedMins,
        },
      });
    }

    // Otherwise, match by Order ID
    // Support either "ORD-1234" or bare digits "1234"
    const orderIdCandidate = query.toUpperCase().startsWith('ORD-') ? query.toUpperCase() : `ORD-${query}`;

    let order = await prisma.order.findUnique({
      where: { id: query.toUpperCase() },
      include: { items: true },
    });

    if (!order) {
      order = await prisma.order.findUnique({
        where: { id: orderIdCandidate },
        include: { items: true },
      });
    }

    if (!order) {
      return NextResponse.json(
        { success: false, error: `Order #${query} not found. Please check the order number.` },
        { status: 404 }
      );
    }

    const queuePosition = await calculateQueuePosition(order);
    const estimatedMins = Math.max(7, (queuePosition + 1) * 7);

    return NextResponse.json({
      success: true,
      data: {
        order: {
          ...order,
          items: order.items.map(parseItemAddons),
        },
        orders: [
          {
            ...order,
            items: order.items.map(parseItemAddons),
          },
        ],
        queuePosition,
        estimatedMins,
      },
    });
  } catch (error) {
    console.error('Error tracking order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track order' },
      { status: 500 }
    );
  }
}

async function calculateQueuePosition(order: any): Promise<number> {
  if (order.status === 'READY' || order.status === 'COMPLETED' || order.status === 'REJECTED') {
    return 0;
  }

  // Count active orders created before this order that are still in PENDING or PREPARING
  const countAhead = await prisma.order.count({
    where: {
      status: { in: ['PENDING', 'PREPARING'] },
      createdAt: { lt: order.createdAt },
    },
  });

  return countAhead;
}

function parseItemAddons(item: any) {
  return {
    ...item,
    addons: item.addons ? (typeof item.addons === 'string' ? JSON.parse(item.addons) : item.addons) : [],
  };
}
