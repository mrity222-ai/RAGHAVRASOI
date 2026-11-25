import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateWhatsAppUrl, sendOrderEmailConfirmation } from '@/lib/notifications';
import { requireAdminAuth } from '@/lib/admin-auth';

const KNOWN_SIZE_EXTRAS: Record<string, number> = {
  'Full Plate': 70,
  'Large / Double': 60,
  Regular: 0,
  'Half Plate': 0,
};

const KNOWN_ADDON_PRICES: Record<string, number> = {
  'Extra Cheese Slice': 25,
  'Peri-Peri Fries Side': 60,
  'House Mint & Garlic Dip': 20,
};

function computeAddonsExtra(addons: unknown): number {
  if (!Array.isArray(addons)) return 0;
  return addons.reduce((sum: number, entry) => {
    if (typeof entry !== 'string') return sum;
    for (const [label, price] of Object.entries(KNOWN_ADDON_PRICES)) {
      if (entry.startsWith(label)) {
        return sum + price;
      }
    }
    return sum;
  }, 0);
}

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

    // Listing recent orders without a specific token is restricted to authenticated admins
    const { errorResponse } = await requireAdminAuth();
    if (errorResponse) return errorResponse;

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
      customerId,
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
      items,
    } = body;

    if (!items || !Array.isArray(items) || !items.length) {
      return NextResponse.json({ success: false, error: 'Cart is empty' }, { status: 400 });
    }

    // Associate with registered customer if available
    let resolvedCustomerId = customerId || null;
    let resolvedIsGuest = isGuest !== undefined ? isGuest : true;

    if (!resolvedCustomerId && customerEmail) {
      const existingCustomer = await prisma.customerUser.findUnique({
        where: { email: customerEmail.trim().toLowerCase() },
      });
      if (existingCustomer) {
        resolvedCustomerId = existingCustomer.id;
        resolvedIsGuest = false;
      }
    } else if (resolvedCustomerId) {
      resolvedIsGuest = false;
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

    // Fetch authoritative product prices & store settings from DB
    const candidateProductIds = items
      .map((item: any) => (typeof item.id === 'string' ? item.id : item.productId))
      .filter((id: any) => typeof id === 'string');

    const [validProducts, storeSettings] = await Promise.all([
      prisma.product.findMany({
        where: { id: { in: candidateProductIds } },
        select: { id: true, price: true, name: true },
      }),
      prisma.storeSetting.findUnique({ where: { id: 1 } }),
    ]);

    const productMap = new Map(validProducts.map((p) => [p.id, p]));
    const gstPercent = storeSettings?.gstPercent ?? 5.0;
    const basePackagingCharge = storeSettings?.packagingCharge ?? 10.0;

    // Build verified order items and calculate itemTotal on the server
    let verifiedItemTotal = 0;
    const verifiedItemsData = items.map((item: any) => {
      const rawId = typeof item.id === 'string' ? item.id : item.productId;
      const dbProduct = rawId ? productMap.get(rawId) : undefined;
      const qty = Math.max(1, Math.floor(Number(item.quantity || item.qty || 1)));
      const size = typeof item.size === 'string' && item.size.trim() ? item.size.trim() : 'Regular';
      const addonsArr = Array.isArray(item.addons) ? item.addons : [];

      let unitPrice: number;
      if (dbProduct) {
        const sizeExtra = KNOWN_SIZE_EXTRAS[size] ?? 0;
        const addonsExtra = computeAddonsExtra(addonsArr);
        unitPrice = dbProduct.price + sizeExtra + addonsExtra;
      } else {
        unitPrice = Math.max(0, Number(item.price || item.unitPrice) || 0);
      }

      const lineTotal = unitPrice * qty;
      verifiedItemTotal += lineTotal;

      return {
        productId: dbProduct ? dbProduct.id : null,
        name: dbProduct ? dbProduct.name : item.title || item.name || 'Dish',
        qty,
        size,
        addons: JSON.stringify(addonsArr),
        note: item.note || null,
        unitPrice,
        lineTotal,
      };
    });

    // Server-side Coupon verification & discount calculation
    let verifiedDiscount = 0;
    let appliedCouponCode: string | null = null;
    if (typeof couponCode === 'string' && couponCode.trim()) {
      const cleanCode = couponCode.trim().toUpperCase();
      const coupon = await prisma.coupon.findUnique({ where: { code: cleanCode } });
      if (coupon && coupon.active && verifiedItemTotal >= coupon.minOrder) {
        appliedCouponCode = coupon.code;
        if (coupon.type === 'PERCENT') {
          verifiedDiscount = Math.round((verifiedItemTotal * coupon.value) / 100);
          if (coupon.maxDiscount && verifiedDiscount > coupon.maxDiscount) {
            verifiedDiscount = coupon.maxDiscount;
          }
        } else {
          verifiedDiscount = coupon.value;
        }
        if (verifiedDiscount > verifiedItemTotal) {
          verifiedDiscount = verifiedItemTotal;
        }
      }
    }

    const discountedSubtotal = Math.max(0, verifiedItemTotal - verifiedDiscount);
    const verifiedGstAmount = Math.round((discountedSubtotal * gstPercent) / 100);
    const verifiedPackagingCharge = verifiedItemTotal > 0 ? basePackagingCharge : 0;
    const verifiedGrandTotal = discountedSubtotal + verifiedGstAmount + verifiedPackagingCharge;

    const order = await prisma.order.create({
      data: {
        id: token,
        status: 'PENDING',
        customerId: resolvedCustomerId,
        customerName: customerName || 'Customer',
        customerPhone: customerPhone || '9876543210',
        customerEmail: customerEmail || null,
        isGuest: resolvedIsGuest,
        orderType: orderType || 'IN_TABLE',
        tableNo: tableNo || (orderType === 'IN_TABLE' ? 'Table 1' : null),
        deliveryAddress: deliveryAddress || null,
        paymentMethod: paymentMethod || (orderType === 'DELIVER' ? 'CASH_ON_DELIVERY' : 'CASH_IN_COUNTER'),
        pickupTime: pickupTime || (orderType === 'IN_TABLE' ? `Serve at ${tableNo || 'Table'}` : 'Delivery in 25-30m'),
        paymentStatus: paymentStatus || 'PENDING',
        couponCode: appliedCouponCode,
        discountAmount: verifiedDiscount,
        itemTotal: verifiedItemTotal,
        gstAmount: verifiedGstAmount,
        packagingCharge: verifiedPackagingCharge,
        grandTotal: verifiedGrandTotal,
        items: {
          create: verifiedItemsData,
        },
      },
      include: {
        items: true,
      },
    });

    // If this is an IN_TABLE order, automatically mark the table as OCCUPIED
    if (order.orderType === 'IN_TABLE' && order.tableNo) {
      const candidateTableNo = order.tableNo.replace(/\s+/g, '-');
      try {
        const targetTable = await prisma.restaurantTable.findFirst({
          where: {
            OR: [
              { tableNo: order.tableNo },
              { tableNo: candidateTableNo },
              { name: order.tableNo },
            ],
          },
        });
        if (targetTable) {
          await prisma.restaurantTable.update({
            where: { id: targetTable.id },
            data: {
              status: 'OCCUPIED',
              activeOrder: token,
            },
          });
        }
      } catch (tableErr) {
        console.error('Non-blocking table status update error:', tableErr);
      }
    }

    // 1. Generate direct WhatsApp message link for customer
    const whatsappUrl = generateWhatsAppUrl(order);

    // 2. Dispatch optional email confirmation if customer provided email
    if (order.customerEmail) {
      sendOrderEmailConfirmation(order).catch((err) => {
        console.error('Non-blocking email confirmation error:', err);
      });
    }

    const safeOrder = {
      ...order,
      items: order.items.map((i) => {
        let parsedAddons: string[] = [];
        if (i.addons) {
          try {
            parsedAddons = typeof i.addons === 'string' ? JSON.parse(i.addons) : i.addons;
          } catch {
            parsedAddons = [];
          }
        }
        return {
          ...i,
          addons: Array.isArray(parsedAddons) ? parsedAddons : [],
        };
      }),
      whatsappUrl,
    };

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully',
      data: safeOrder,
    });
  } catch (error) {
    console.error('Error placing order:', error);
    return NextResponse.json({ success: false, error: 'Failed to place order' }, { status: 500 });
  }
}
