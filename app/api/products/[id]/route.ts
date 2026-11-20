import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Search by ID or slug
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { id },
          { slug: id },
        ],
      },
      include: {
        category: true,
      },
    });

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    // Recommended / Related Add-on Products (Fries, Cooler, Onion Rings, Shake)
    let relatedProducts = await prisma.product.findMany({
      where: {
        id: { not: product.id },
        inStock: true,
      },
      take: 4,
      include: {
        category: true,
      },
    });

    // Fallback complementary items matching restaurant menu if database has fewer than 4 items
    const samplePairings = [
      {
        id: 'dish-fries',
        name: 'Masala French Fries',
        desc: 'Crispy potato fries tossed in chatpata peri-peri spice',
        price: 99,
        rating: 4.9,
        reviewsCount: 189,
        prepTime: '10-12 min',
        image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=500&q=80',
        veg: true,
      },
      {
        id: 'dish-coldbrew',
        name: 'Kesariya Sweet Lassi',
        desc: 'Thick churned Punjabi curd infused with saffron & dry fruits',
        price: 79,
        rating: 4.9,
        reviewsCount: 98,
        prepTime: '5-8 min',
        image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=500&q=80',
        veg: true,
      },
      {
        id: 'dish-rings',
        name: 'Crispy Onion Bhajiya',
        desc: 'Crispy gram-flour onion fritters served with mint chutney',
        price: 89,
        rating: 4.5,
        reviewsCount: 152,
        prepTime: '8-10 min',
        image: 'https://images.unsplash.com/photo-1639024471287-0351860db52e?auto=format&fit=crop&w=500&q=80',
        veg: true,
      },
      {
        id: 'dish-shake',
        name: 'Gulab Jamun (2 Pcs)',
        desc: 'Warm khoya dumplings steeped in rose cardamom syrup',
        price: 69,
        rating: 4.9,
        reviewsCount: 210,
        prepTime: '5-8 min',
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=500&q=80',
        veg: true,
      },
    ];

    if (!relatedProducts || relatedProducts.length < 4) {
      relatedProducts = [
        ...relatedProducts,
        ...samplePairings.slice(relatedProducts.length),
      ] as any;
    } else {
      relatedProducts = relatedProducts.map((p, idx) => ({
        ...p,
        rating: samplePairings[idx]?.rating || 4.8,
        reviewsCount: samplePairings[idx]?.reviewsCount || 120,
        prepTime: samplePairings[idx]?.prepTime || '10-12 min',
      }));
    }

    // High-Resolution Gallery Images
    let galleryImages: string[] = [];
    if (product.gallery) {
      try {
        const parsed = JSON.parse(product.gallery);
        if (Array.isArray(parsed) && parsed.length > 0) {
          galleryImages = parsed;
        }
      } catch (e) {
        galleryImages = [];
      }
    }

    if (!galleryImages || galleryImages.length === 0) {
      galleryImages = [
        product.image,
        'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
      ];
    } else if (!galleryImages.includes(product.image)) {
      galleryImages = [product.image, ...galleryImages];
    }

    const story =
      product.story ||
      `Prepared fresh per order at Raghav Rasoi in Gaur City 1, Greater Noida West using authentic culinary heritage, slow-cooked whole spices, and farm-fresh ingredients to deliver genuine Indian aromas and timeless flavours.`;

    const ingredients =
      product.ingredients ||
      'Farm-fresh produce, authentic Raghav Rasoi house-blended garam masala, pure ghee/cold-pressed oil, fresh green herbs, aromatic whole spices.';

    const reviews = [
      {
        name: 'Sarah M.',
        rating: 5,
        comment: "Best cheeseburger I've had in town — arrived piping hot, patty was amazingly juicy and tender.",
        date: '2 days ago',
      },
      {
        name: 'James K.',
        rating: 5,
        comment: 'Great portion size, and the spice level options are a really nice touch! Highly recommended.',
        date: '1 week ago',
      },
      {
        name: 'Aisha R.',
        rating: 4,
        comment: "Really good, fresh ingredients and perfectly toasted brioche. Would've liked slightly more sauce but still 5-star quality.",
        date: '2 weeks ago',
      },
    ];

    return NextResponse.json({
      success: true,
      data: {
        ...product,
        galleryImages,
        story,
        ingredients,
        relatedProducts,
        reviews,
        reviewsCount: 412,
        rating: 4.8,
        prepTime: product.prepTime || '12-15 min',
        calories: product.calories || 620,
        serves: '1 person',
        spice: 'Customizable',
      },
    });
  } catch (error) {
    console.error('Error fetching single product:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
