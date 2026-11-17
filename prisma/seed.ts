import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Ranel restaurant database...');

  // 1. Clean existing records
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.deal.deleteMany({});
  await prisma.newsletterSubscriber.deleteMany({});

  // 2. Categories
  const categoriesData = [
    { name: 'FAST FOOD', slug: 'fast-food', image: '/assets/categories/fast-food.png', imageUrl: '/assets/categories/fast-food.png', displayOrder: 1 },
    { name: 'COMBO', slug: 'combo', image: '/assets/categories/combo.png', imageUrl: '/assets/categories/combo.png', displayOrder: 2 },
    { name: 'SANDWICH', slug: 'sandwich', image: '/assets/categories/sandwich.png', imageUrl: '/assets/categories/sandwich.png', displayOrder: 3 },
    { name: 'BURRITO', slug: 'burrito', image: '/assets/categories/burrito.png', imageUrl: '/assets/categories/burrito.png', displayOrder: 4 },
    { name: 'SNACKS', slug: 'snacks', image: '/assets/categories/snacks.png', imageUrl: '/assets/categories/snacks.png', displayOrder: 5 },
    { name: 'CHICKEN', slug: 'chicken', image: '/assets/categories/chicken.png', imageUrl: '/assets/categories/chicken.png', displayOrder: 6 },
  ];

  const createdCategories: Record<string, string> = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    createdCategories[cat.slug] = created.id;
  }
  console.log('Categories seeded.');

  // 3. Products
  const defaultCatId = Object.values(createdCategories)[0] || '';
  const productsData = [
    {
      name: 'Flame Box',
      title: 'Flame Box',
      slug: 'flame-box',
      price: 60.00,
      compareAtPrice: 70.00,
      image: '/assets/products/flame-box.png',
      imageUrl: '/assets/products/flame-box.png',
      categoryId: defaultCatId,
      isSale: true,
      isBestSeller: true,
      description: 'Slow-roasted chicken bowl garnished with mint yogurt and saffron rice.',
    },
    {
      name: 'Urban Bite',
      title: 'Urban Bite',
      slug: 'urban-bite',
      price: 60.00,
      compareAtPrice: 70.00,
      image: '/assets/products/urban-bite.png',
      imageUrl: '/assets/products/urban-bite.png',
      categoryId: defaultCatId,
      isSale: true,
      isBestSeller: true,
      colors: JSON.stringify(['#000000', '#F5A623', '#8B4513']),
      description: 'Prime char-grilled sirloin steak served with rosemary glaze and chili salsa.',
    },
    {
      name: 'Spice Zone Burger',
      title: 'Spice Zone',
      slug: 'spice-zone-burger',
      price: 60.00,
      compareAtPrice: 70.00,
      image: '/assets/products/spice-zone-burger.png',
      imageUrl: '/assets/products/spice-zone-burger.png',
      categoryId: defaultCatId,
      isSale: true,
      isBestSeller: true,
      description: 'Signature grass-fed beef burger topped with crispy bacon and farm-fresh fried egg.',
    },
    {
      name: 'Spice Zone Hotdog',
      title: 'Spice Zone',
      slug: 'spice-zone-hotdog',
      price: 70.00,
      compareAtPrice: 80.00,
      image: '/assets/products/spice-zone-hotdog.png',
      imageUrl: '/assets/products/spice-zone-hotdog.png',
      categoryId: defaultCatId,
      isSale: true,
      isBestSeller: true,
      description: 'Gourmet pork frankfurter nestled in soft brioche, dressed with melted cheddar and jalapeño relish.',
    },
  ];

  for (const prod of productsData) {
    await prisma.product.create({ data: prod });
  }
  console.log('Products seeded.');

  // 4. Deals
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 44);
  targetDate.setHours(targetDate.getHours() + 17);
  targetDate.setMinutes(targetDate.getMinutes() + 21);
  targetDate.setSeconds(targetDate.getSeconds() + 56);

  await prisma.deal.create({
    data: {
      title: 'QUESADILLA WITH TOMATOES',
      subtitle: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto',
      targetDate: targetDate,
      buttonText: 'ORDER NOW',
      imageUrl: '/assets/banners/burger-split-left.png',
    },
  });
  console.log('Deals seeded.');

  // 5. Sample Subscriber
  await prisma.newsletterSubscriber.create({
    data: {
      email: 'customer@domain.com',
    },
  });

  console.log('Ranel database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
