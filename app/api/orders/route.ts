import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (token) {
      const order = await prisma.order.findUnique({
        where: { id: token },
        include: { items: true },
      });
      if (!order) {
        return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        data: {
          ...order,
          items: order.items.map((i) => ({
            ...i,
            addons: i.addons ? JSON.parse(i.addons) : [],
          })),
        },
      });
    }

    const orders = await prisma.order.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      isGuest,
      orderType,
      tableNo,
      deliveryAddress,
      paymentMethod,
      pickupTime,
      paymentStatus,
      couponCode,
      discountAmount,
      itemTotal,
      gstAmount,
      packagingCharge,
      grandTotal,
      items,
    } = body;

    if (!items || !items.length) {
      return NextResponse.json({ success: false, error: 'Cart is empty' }, { status: 400 });
    }

    // Generate guaranteed unique Token ID
    let token = '';
    while (!token) {
      const candidate = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      const existing = await prisma.order.findUnique({ where: { id: candidate } });
      if (!existing) {
        token = candidate;
      }
    }

    const order = await prisma.order.create({
      data: {
        id: token,
        status: 'PENDING',
        customerName: customerName || 'Customer',
        customerPhone: customerPhone || '9876543210',
        customerEmail: customerEmail || null,
        isGuest: isGuest !== undefined ? isGuest : true,
        orderType: orderType || 'IN_TABLE',
        tableNo: tableNo || (orderType === 'IN_TABLE' ? 'Table 1' : null),
        deliveryAddress: deliveryAddress || null,
        paymentMethod: paymentMethod || (orderType === 'DELIVER' ? 'CASH_ON_DELIVERY' : 'CASH_IN_COUNTER'),
        pickupTime: pickupTime || (orderType === 'IN_TABLE' ? `Serve at ${tableNo || 'Table'}` : 'Delivery in 25-30m'),
        paymentStatus: paymentStatus || 'PENDING',
        couponCode: couponCode || null,
        discountAmount: Number(discountAmount) || 0,
        itemTotal: Number(itemTotal) || Number(grandTotal),
        gstAmount: Number(gstAmount) || 0,
        packagingCharge: Number(packagingCharge) || 0,
        grandTotal: Number(grandTotal),
        items: {
          create: items.map((item: any) => ({
            productId: typeof item.id === 'string' ? item.id : (item.productId || null),
            name: item.title || item.name,
            qty: item.quantity || item.qty || 1,
            size: item.size || 'Regular',
            addons: item.addons ? JSON.stringify(item.addons) : JSON.stringify([]),
            note: item.note || null,
            unitPrice: item.price || item.unitPrice,
            lineTotal: (item.price || item.unitPrice) * (item.quantity || item.qty || 1),
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully',
      data: order,
    });
  } catch (error) {
    console.error('Error placing order:', error);
    return NextResponse.json({ success: false, error: 'Failed to place order' }, { status: 500 });
  }
}
