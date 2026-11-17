import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const selectedSubCat = searchParams.get('subCategory');

    // Find category by slug or id
    const category = await prisma.category.findFirst({
      where: {
        OR: [
          { slug: slug },
          { id: slug },
          { id: `cat-${slug}` },
          { name: { equals: slug } },
        ],
      },
      include: {
        products: {
          orderBy: { price: 'asc' },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    // Compute distinct sub-categories with dish counts
    const subCatMap: Record<string, number> = {};
    category.products.forEach((p) => {
      const sub = p.subCategory || 'Specials';
      subCatMap[sub] = (subCatMap[sub] || 0) + 1;
    });

    const subCategories = Object.entries(subCatMap).map(([name, count]) => ({
      name,
      count,
    }));

    // Filter products if a specific subCategory is chosen
    const filteredProducts = selectedSubCat && selectedSubCat !== 'ALL'
      ? category.products.filter(
          (p) => (p.subCategory || 'Specials').toLowerCase() === selectedSubCat.toLowerCase()
        )
      : category.products;

    return NextResponse.json({
      success: true,
      data: {
        category: {
          id: category.id,
          name: category.name,
          slug: category.slug || category.id.replace('cat-', ''),
          image: category.image,
          totalCount: category.products.length,
        },
        subCategories,
        products: filteredProducts,
      },
    });
  } catch (error) {
    console.error('Error fetching category details:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch category details' },
      { status: 500 }
    );
  }
}
