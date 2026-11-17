import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const deals = await prisma.deal.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: deals });
  } catch (error) {
    console.error('Error fetching deals:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch deals' }, { status: 500 });
  }
}
