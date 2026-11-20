import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';

    const where = activeOnly ? { active: true } : {};
    const categories = await prisma.category.findMany({
      where,
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { displayOrder: 'asc' },
    });

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, image, active } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: 'Category name is required' }, { status: 400 });
    }

    const created = await prisma.category.create({
      data: {
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
        image: image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
        imageUrl: image,
        active: active !== undefined ? active : true,
      },
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ success: false, error: 'Failed to create category' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, image, active } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Category ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (image !== undefined) {
      updateData.image = image;
      updateData.imageUrl = image;
    }
    if (active !== undefined) updateData.active = active;

    const updated = await prisma.category.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ success: false, error: 'Failed to update category' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, active } = await request.json();

    if (!id || active === undefined) {
      return NextResponse.json({ success: false, error: 'Category ID and active status are required' }, { status: 400 });
    }

    const updated = await prisma.category.update({
      where: { id },
      data: { active },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error toggling category visibility:', error);
    return NextResponse.json({ success: false, error: 'Failed to toggle visibility' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Category ID is required' }, { status: 400 });
    }

    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });

    if (!category) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    // Delete any products associated with this category
    await prisma.product.deleteMany({
      where: { categoryId: id },
    });

    // Delete the category
    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: `Category "${category.name}" and all its dishes deleted successfully`,
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete category' }, { status: 500 });
  }
}
