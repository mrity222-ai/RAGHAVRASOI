import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { active: true },
      include: {
        products: {
          select: {
            id: true,
            subCategory: true,
          },
        },
      },
      orderBy: { displayOrder: 'asc' },
    });

    const enriched = categories.map((cat) => {
      const distinctSubCats = Array.from(
        new Set(
          cat.products
            .map((p) => p.subCategory)
            .filter((s): s is string => Boolean(s))
        )
      );

      return {
        id: cat.id,
        name: cat.name,
        slug: cat.slug || cat.id.replace('cat-', ''),
        image: cat.image,
        imageUrl: cat.imageUrl || cat.image,
        productCount: cat.products.length,
        subCategories: distinctSubCats,
      };
    });

    return NextResponse.json({ success: true, data: enriched });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
