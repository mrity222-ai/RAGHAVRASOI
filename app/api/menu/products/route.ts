import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const veg = searchParams.get('veg');
    const bestseller = searchParams.get('bestseller');
    const q = searchParams.get('q');
    const sort = searchParams.get('sort');

    const where: any = {};
    if (categoryId && categoryId !== 'ALL') {
      where.categoryId = categoryId;
    }
    if (veg === 'true') {
      where.veg = true;
    } else if (veg === 'false') {
      where.veg = false;
    }
    if (bestseller === 'true') {
      where.bestseller = true;
    }
    if (q) {
      where.OR = [
        { name: { contains: q } },
        { desc: { contains: q } },
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'PRICE_ASC') orderBy = { price: 'asc' };
    if (sort === 'PRICE_DESC') orderBy = { price: 'desc' };

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy,
    });

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching menu products:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      categoryId,
      subCategory,
      mrp,
      price,
      image,
      gallery,
      desc,
      story,
      ingredients,
      calories,
      prepTime,
      veg,
      bestseller,
      customizable,
      isSale,
    } = body;

    if (!name || !categoryId || price === undefined) {
      return NextResponse.json({ success: false, error: 'Missing required dish fields' }, { status: 400 });
    }

    let galleryStr: string | null = null;
    if (gallery) {
      galleryStr = Array.isArray(gallery) ? JSON.stringify(gallery) : String(gallery);
    }

    const created = await prisma.product.create({
      data: {
        name,
        title: name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
        categoryId,
        subCategory: subCategory || null,
        mrp: Number(mrp) || Number(price),
        price: Number(price),
        compareAtPrice: Number(mrp) || Number(price),
        image: image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
        imageUrl: image,
        gallery: galleryStr,
        desc: desc || '',
        description: desc || '',
        story: story || null,
        ingredients: ingredients || null,
        calories: calories ? Number(calories) : 380,
        prepTime: prepTime || '15-20 mins',
        veg: veg !== undefined ? veg : true,
        bestseller: !!bestseller,
        isBestSeller: !!bestseller,
        customizable: customizable !== undefined ? customizable : true,
        isSale: isSale !== undefined ? isSale : Number(mrp) > Number(price),
        inStock: true,
      },
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    console.error('Error creating dish:', error);
    return NextResponse.json({ success: false, error: 'Failed to create dish' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      name,
      categoryId,
      subCategory,
      mrp,
      price,
      image,
      gallery,
      desc,
      story,
      ingredients,
      calories,
      prepTime,
      veg,
      bestseller,
      customizable,
      isSale,
    } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Dish ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (name !== undefined) {
      updateData.name = name;
      updateData.title = name;
    }
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (subCategory !== undefined) updateData.subCategory = subCategory;
    if (mrp !== undefined) {
      updateData.mrp = Number(mrp);
      updateData.compareAtPrice = Number(mrp);
    }
    if (price !== undefined) updateData.price = Number(price);
    if (image !== undefined) {
      updateData.image = image;
      updateData.imageUrl = image;
    }
    if (gallery !== undefined) {
      updateData.gallery = Array.isArray(gallery) ? JSON.stringify(gallery) : String(gallery);
    }
    if (desc !== undefined) {
      updateData.desc = desc;
      updateData.description = desc;
    }
    if (story !== undefined) updateData.story = story;
    if (ingredients !== undefined) updateData.ingredients = ingredients;
    if (calories !== undefined) updateData.calories = calories ? Number(calories) : null;
    if (prepTime !== undefined) updateData.prepTime = prepTime;
    if (veg !== undefined) updateData.veg = veg;
    if (bestseller !== undefined) {
      updateData.bestseller = bestseller;
      updateData.isBestSeller = bestseller;
    }
    if (customizable !== undefined) updateData.customizable = customizable;
    if (isSale !== undefined) {
      updateData.isSale = isSale;
    } else if (mrp !== undefined && price !== undefined) {
      updateData.isSale = Number(mrp) > Number(price);
    }

    const updated = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating dish:', error);
    return NextResponse.json({ success: false, error: 'Failed to update dish' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, inStock, price, isSale, bestseller } = await request.json();

    if (!id) {
      return NextResponse.json({ success: false, error: 'Dish ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (inStock !== undefined) updateData.inStock = inStock;
    if (price !== undefined) updateData.price = Number(price);
    if (isSale !== undefined) updateData.isSale = isSale;
    if (bestseller !== undefined) {
      updateData.bestseller = bestseller;
      updateData.isBestSeller = bestseller;
    }

    const updated = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error toggling dish stock/price/sale:', error);
    return NextResponse.json({ success: false, error: 'Failed to update dish' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Dish ID is required' }, { status: 400 });
    }

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Dish deleted' });
  } catch (error) {
    console.error('Error deleting dish:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete dish' }, { status: 500 });
  }
}
