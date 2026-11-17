import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bestSeller = searchParams.get('best_seller');
    const isSale = searchParams.get('is_sale');

    const whereClause: any = {};
    if (bestSeller === 'true') {
      whereClause.isBestSeller = true;
    }
    if (isSale === 'true') {
      whereClause.isSale = true;
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: true,
      },
      orderBy: { id: 'asc' },
    });

    const parsedProducts = products.map((prod) => ({
      ...prod,
      colors: prod.colors ? JSON.parse(prod.colors) : [],
    }));

    return NextResponse.json({ success: true, data: parsedProducts });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}
