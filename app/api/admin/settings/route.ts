import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/admin-auth';

export async function GET() {
  try {
    let settings = await prisma.storeSetting.findUnique({
      where: { id: 1 },
    });

    if (!settings) {
      settings = await prisma.storeSetting.create({
        data: { id: 1 },
      });
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching store settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { errorResponse } = await requireAdminAuth();
  if (errorResponse) return errorResponse;

  try {
    const body = await request.json();
    const { name, address, isOpen, prepTimeMins, gstPercent, packagingCharge, allowPayAtShop } = body;

    const updated = await prisma.storeSetting.upsert({
      where: { id: 1 },
      update: {
        ...(name !== undefined && { name }),
        ...(address !== undefined && { address }),
        ...(isOpen !== undefined && { isOpen }),
        ...(prepTimeMins !== undefined && { prepTimeMins: Number(prepTimeMins) }),
        ...(gstPercent !== undefined && { gstPercent: Number(gstPercent) }),
        ...(packagingCharge !== undefined && { packagingCharge: Number(packagingCharge) }),
        ...(allowPayAtShop !== undefined && { allowPayAtShop }),
      },
      create: {
        id: 1,
        name: name || 'Raghav Rasoi',
        address: address || 'Gunderdehi Town Rd, Gundardehi, Chainganj, Chhattisgarh 491223',
        isOpen: isOpen !== undefined ? isOpen : true,
        prepTimeMins: Number(prepTimeMins) || 15,
        gstPercent: Number(gstPercent) || 5.0,
        packagingCharge: Number(packagingCharge) || 10.0,
        allowPayAtShop: allowPayAtShop !== undefined ? allowPayAtShop : true,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating store settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 });
  }
}
