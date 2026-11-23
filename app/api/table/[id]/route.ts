import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id: rawParam } = await params;
    const rawId = decodeURIComponent(rawParam || '').trim();

    if (!rawId) {
      return NextResponse.json(
        { success: false, notFound: true, error: 'Table identifier missing' },
        { status: 400 }
      );
    }

    // Support matching by:
    // 1. tableNo (e.g. "Table-1")
    // 2. name (e.g. "Table 1")
    // 3. raw number or suffix (e.g. "1" -> "Table-1" or "Table 1")
    // 4. database cuid id
    const cleaned = rawId.replace(/[-_]/g, ' ').trim();
    const candidateName = cleaned.toLowerCase().startsWith('table')
      ? cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
      : `Table ${cleaned}`;
    const candidateTableNo = candidateName.replace(/\s+/g, '-');

    const table = await prisma.restaurantTable.findFirst({
      where: {
        OR: [
          { id: rawId },
          { tableNo: rawId },
          { tableNo: candidateTableNo },
          { name: candidateName },
          { name: { equals: rawId } },
        ],
      },
    });

    if (!table) {
      return NextResponse.json(
        {
          success: false,
          notFound: true,
          error: `Table '${rawId}' is not available or has been removed by restaurant staff.`,
        },
        { status: 404 }
      );
    }

    // Check if the table's active order is still active
    let activeOrderDetails: any = null;
    let actualStatus = table.status;

    if (table.activeOrder) {
      const order = await prisma.order.findUnique({
        where: { id: table.activeOrder },
        select: { id: true, status: true, grandTotal: true, createdAt: true, customerName: true },
      });

      if (order && ['PENDING', 'PREPARING', 'READY'].includes(order.status)) {
        activeOrderDetails = order;
        actualStatus = 'OCCUPIED';
      } else {
        // Order finished, table is actually available
        actualStatus = 'AVAILABLE';
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: table.id,
        tableNo: table.tableNo,
        name: table.name,
        seats: table.seats,
        status: actualStatus,
        activeOrder: activeOrderDetails ? table.activeOrder : null,
        activeOrderDetails,
      },
    });
  } catch (error) {
    console.error('Error fetching table details:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch table details' },
      { status: 500 }
    );
  }
}
