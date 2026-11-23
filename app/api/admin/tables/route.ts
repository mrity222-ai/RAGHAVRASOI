import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Helper to normalize table identifier (e.g., "15" -> "Table-15", "Table 15" -> "Table-15")
function normalizeTableNo(input: string): { tableNo: string; name: string } {
  const trimmed = input.trim();
  const cleaned = trimmed.replace(/[-_]/g, ' ');
  let name = cleaned;
  if (!name.toLowerCase().startsWith('table')) {
    name = `Table ${name}`;
  } else {
    name = name.charAt(0).toUpperCase() + name.slice(1);
  }
  const tableNo = name.replace(/\s+/g, '-');
  return { tableNo, name };
}

// 1. GET: Fetch all tables with current status and active orders
export async function GET() {
  try {
    const tables = await prisma.restaurantTable.findMany({
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }],
    });

    // Check if any active orders exist to ensure live sync
    const activeOrderIds = tables
      .map((t) => t.activeOrder)
      .filter((id): id is string => typeof id === 'string' && id.length > 0);

    let activeOrdersMap: Record<string, any> = {};
    if (activeOrderIds.length > 0) {
      const orders = await prisma.order.findMany({
        where: { id: { in: activeOrderIds } },
        select: { id: true, status: true, grandTotal: true, createdAt: true, customerName: true },
      });
      orders.forEach((o) => {
        activeOrdersMap[o.id] = o;
      });
    }

    const enhancedTables = tables.map((t) => {
      const activeOrder = t.activeOrder ? activeOrdersMap[t.activeOrder] : null;
      // If the linked order was completed or rejected, auto-mark table as AVAILABLE
      const isActuallyOccupied =
        t.status === 'OCCUPIED' &&
        activeOrder &&
        ['PENDING', 'PREPARING', 'READY'].includes(activeOrder.status);

      return {
        ...t,
        status: t.status === 'OCCUPIED' && !isActuallyOccupied && activeOrder ? 'AVAILABLE' : t.status,
        activeOrderDetails: isActuallyOccupied ? activeOrder : null,
      };
    });

    return NextResponse.json({ success: true, data: enhancedTables });
  } catch (error) {
    console.error('Error fetching admin tables:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch tables' }, { status: 500 });
  }
}

// 2. POST: Add new table
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { rawName, seats } = body;

    if (!rawName || typeof rawName !== 'string' || !rawName.trim()) {
      return NextResponse.json({ success: false, error: 'Table name/number is required' }, { status: 400 });
    }

    const { tableNo, name } = normalizeTableNo(rawName);

    // Check if tableNo already exists
    const existing = await prisma.restaurantTable.findUnique({
      where: { tableNo },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: `Table '${name}' (${tableNo}) already exists!` },
        { status: 409 }
      );
    }

    const maxDisplay = await prisma.restaurantTable.findFirst({
      orderBy: { displayOrder: 'desc' },
      select: { displayOrder: true },
    });
    const nextOrder = (maxDisplay?.displayOrder || 0) + 1;

    const newTable = await prisma.restaurantTable.create({
      data: {
        tableNo,
        name,
        seats: Number(seats) || 4,
        status: 'AVAILABLE',
        displayOrder: nextOrder,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Table '${name}' added successfully`,
      data: newTable,
    });
  } catch (error) {
    console.error('Error creating table:', error);
    return NextResponse.json({ success: false, error: 'Failed to create table' }, { status: 500 });
  }
}

// 3. DELETE: Remove table permanently
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get('id');

    if (!id) {
      const body = await request.json().catch(() => ({}));
      id = body.id;
    }

    if (!id) {
      return NextResponse.json({ success: false, error: 'Table ID is required' }, { status: 400 });
    }

    const existing = await prisma.restaurantTable.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Table not found' }, { status: 404 });
    }

    await prisma.restaurantTable.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: `Table '${existing.name}' deleted successfully`,
    });
  } catch (error) {
    console.error('Error deleting table:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete table' }, { status: 500 });
  }
}

// 4. PATCH: Update table status or manual free/occupy
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, seats, name } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Table ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (status) {
      updateData.status = status;
      if (status === 'AVAILABLE') {
        updateData.activeOrder = null;
      }
    }
    if (seats !== undefined) {
      updateData.seats = Number(seats);
    }
    if (name) {
      updateData.name = name.trim();
    }

    const updated = await prisma.restaurantTable.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: `Table '${updated.name}' updated successfully`,
      data: updated,
    });
  } catch (error) {
    console.error('Error updating table:', error);
    return NextResponse.json({ success: false, error: 'Failed to update table' }, { status: 500 });
  }
}
