import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const customers = await prisma.customerUser.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
          include: {
            items: true,
          },
        },
      },
    });

    const data = customers.map((c) => {
      const totalOrders = c.orders.length;
      const lifetimeSpend = c.orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
      const lastOrder = c.orders[0] || null;

      return {
        id: c.id,
        name: c.name,
        phone: c.phone,
        email: c.email,
        createdAt: c.createdAt,
        totalOrders,
        lifetimeSpend,
        lastOrderDate: lastOrder ? lastOrder.createdAt : null,
        orders: c.orders.map((o) => ({
          id: o.id,
          status: o.status,
          orderType: o.orderType,
          tableNo: o.tableNo,
          grandTotal: o.grandTotal,
          paymentStatus: o.paymentStatus,
          paymentMethod: o.paymentMethod,
          createdAt: o.createdAt,
          itemsCount: o.items.length,
          items: o.items.map((i) => ({
            id: i.id,
            name: i.name,
            qty: i.qty,
            size: i.size,
            unitPrice: i.unitPrice,
            lineTotal: i.lineTotal,
          })),
        })),
      };
    });

    return NextResponse.json({
      success: true,
      totalCount: customers.length,
      data,
    });
  } catch (error) {
    console.error('Error fetching registered customers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch registered customers' },
      { status: 500 }
    );
  }
}
