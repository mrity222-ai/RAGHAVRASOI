import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding restaurant database with Admin, Storefront Menu & Ranel dishes...');

  // Clean existing records
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.coupon.deleteMany({});
  await prisma.staffUser.deleteMany({});
  await prisma.storeSetting.deleteMany({});
  await prisma.deal.deleteMany({});
  await prisma.newsletterSubscriber.deleteMany({});

  // 1. Store Settings
  await prisma.storeSetting.create({
    data: {
      id: 1,
      name: 'Spice & Grill Express',
      address: 'MG Road, Hazratganj, Lucknow, UP 226001',
      isOpen: true,
      prepTimeMins: 15,
      gstPercent: 5.0,
      packagingCharge: 10.0,
      allowPayAtShop: true,
    },
  });
  console.log('Store settings seeded.');

  // 2. Staff Users (8 Granular Permissions)
  const allPermissions = [
    'kanban',
    'print_kot',
    'toggle_stock',
    'manage_menu',
    'manage_categories',
    'manage_coupons',
    'view_dashboard',
    'store_settings',
  ];

  await prisma.staffUser.createMany({
    data: [
      {
        id: 'staff-owner',
        name: 'Super Admin (Owner)',
        roleTitle: 'Store Owner',
        login: 'owner@spicegrill.in',
        password: 'admin123',
        isOwner: true,
        permissions: JSON.stringify(allPermissions),
      },
      {
        id: 'staff-rahul',
        name: 'Rahul - Kitchen Staff',
        roleTitle: 'Kitchen & Counter',
        login: 'rahul.kitchen@spicegrill.in',
        password: 'staff123',
        isOwner: false,
        permissions: JSON.stringify(['kanban', 'print_kot', 'toggle_stock']),
      },
      {
        id: 'staff-priya',
        name: 'Priya - Store Manager',
        roleTitle: 'Floor Manager',
        login: 'priya.mgr@spicegrill.in',
        password: 'manager123',
        isOwner: false,
        permissions: JSON.stringify([
          'kanban',
          'print_kot',
          'toggle_stock',
          'manage_menu',
          'manage_categories',
          'manage_coupons',
        ]),
      },
    ],
  });
  console.log('Staff accounts seeded.');

  // 3. Categories
  const categoriesData = [
    {
      id: 'cat-burgers',
      name: 'Burgers',
      slug: 'burgers',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
      imageUrl: '/assets/categories/fast-food.png',
      active: true,
      displayOrder: 1,
    },
    {
      id: 'cat-chinese',
      name: 'Chinese',
      slug: 'chinese',
      image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=400&q=80',
      imageUrl: '/assets/categories/combo.png',
      active: true,
      displayOrder: 2,
    },
    {
      id: 'cat-south',
      name: 'South Indian',
      slug: 'south-indian',
      image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=400&q=80',
      imageUrl: '/assets/categories/sandwich.png',
      active: true,
      displayOrder: 3,
    },
    {
      id: 'cat-combos',
      name: 'Combos',
      slug: 'combos',
      image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=400&q=80',
      imageUrl: '/assets/categories/burrito.png',
      active: true,
      displayOrder: 4,
    },
    {
      id: 'cat-beverages',
      name: 'Beverages',
      slug: 'beverages',
      image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=400&q=80',
      imageUrl: '/assets/categories/snacks.png',
      active: true,
      displayOrder: 5,
    },
    {
      id: 'cat-chicken',
      name: 'Chicken',
      slug: 'chicken',
      image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=400&q=80',
      imageUrl: '/assets/categories/chicken.png',
      active: true,
      displayOrder: 6,
    },
  ];

  for (const cat of categoriesData) {
    await prisma.category.create({ data: cat });
  }
  console.log('Categories seeded.');

  // 4. Products (Dishes)
  const productsData = [
    {
      id: 'dish-1',
      name: 'Maharaja Paneer Tikka Burger',
      title: 'Maharaja Paneer Tikka Burger',
      slug: 'maharaja-paneer-burger',
      categoryId: 'cat-burgers',
      veg: true,
      bestseller: true,
      isBestSeller: true,
      customizable: true,
      inStock: true,
      mrp: 189,
      price: 149,
      compareAtPrice: 189,
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
      imageUrl: '/assets/categories/fast-food.png',
      desc: 'Char-grilled spiced cottage cheese patty with melted cheddar, crisp lettuce & mint tandoori sauce.',
      description: 'Char-grilled spiced cottage cheese patty with melted cheddar, crisp lettuce & mint tandoori sauce.',
      isSale: true,
    },
    {
      id: 'dish-2',
      name: 'Double Crispy Chicken Smash Burger',
      title: 'Double Crispy Chicken Smash Burger',
      slug: 'double-crispy-chicken-burger',
      categoryId: 'cat-burgers',
      veg: false,
      bestseller: true,
      isBestSeller: true,
      customizable: true,
      inStock: true,
      mrp: 229,
      price: 189,
      compareAtPrice: 229,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
      imageUrl: '/assets/products/spice-zone-burger.png',
      desc: 'Two golden-fried crunchy chicken fillets layered with jalapeños and smoky chipotle mayo.',
      description: 'Two golden-fried crunchy chicken fillets layered with jalapeños and smoky chipotle mayo.',
      isSale: true,
    },
    {
      id: 'dish-3',
      name: 'Wok-Tossed Schezwan Hakka Noodles',
      title: 'Wok-Tossed Schezwan Hakka Noodles',
      slug: 'wok-schezwan-hakka-noodles',
      categoryId: 'cat-chinese',
      veg: true,
      bestseller: true,
      isBestSeller: true,
      customizable: true,
      inStock: true,
      mrp: 199,
      price: 165,
      compareAtPrice: 199,
      image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80',
      imageUrl: '/assets/products/flame-box.png',
      desc: 'Street-style smoky noodles tossed with bell peppers, spring onions & fiery house Schezwan.',
      description: 'Street-style smoky noodles tossed with bell peppers, spring onions & fiery house Schezwan.',
      isSale: true,
    },
    {
      id: 'dish-4',
      name: 'Crispy Chilli Paneer Dry (8 Pcs)',
      title: 'Crispy Chilli Paneer Dry (8 Pcs)',
      slug: 'crispy-chilli-paneer-dry',
      categoryId: 'cat-chinese',
      veg: true,
      bestseller: false,
      customizable: false,
      inStock: false,
      mrp: 240,
      price: 195,
      compareAtPrice: 240,
      image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80',
      imageUrl: '/assets/products/flame-box.png',
      desc: 'Wok-seared paneer cubes glazed with dark soy, crushed garlic & diced capsicum.',
      description: 'Wok-seared paneer cubes glazed with dark soy, crushed garlic & diced capsicum.',
    },
    {
      id: 'dish-5',
      name: 'Ghee Roast Mysore Masala Dosa',
      title: 'Ghee Roast Mysore Masala Dosa',
      slug: 'ghee-roast-mysore-masala-dosa',
      categoryId: 'cat-south',
      veg: true,
      bestseller: true,
      isBestSeller: true,
      customizable: true,
      inStock: true,
      mrp: 165,
      price: 135,
      compareAtPrice: 165,
      image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80',
      imageUrl: '/assets/categories/sandwich.png',
      desc: 'Crisp golden dosa layered with spicy garlic chutney, masala potato, drumstick sambar & 2 chutneys.',
      description: 'Crisp golden dosa layered with spicy garlic chutney, masala potato, drumstick sambar & 2 chutneys.',
    },
    {
      id: 'dish-6',
      name: 'Burger + Fries + Cold Coffee Meal',
      title: 'Burger + Fries + Cold Coffee Meal',
      slug: 'burger-fries-cold-coffee-combo',
      categoryId: 'cat-combos',
      veg: true,
      bestseller: true,
      isBestSeller: true,
      customizable: false,
      inStock: true,
      mrp: 320,
      price: 249,
      compareAtPrice: 320,
      image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=600&q=80',
      imageUrl: '/assets/categories/combo.png',
      desc: 'Complete self-pickup combo: 1 Paneer Tikka Burger + Peri-Peri Fries + Thick Cold Coffee.',
      description: 'Complete self-pickup combo: 1 Paneer Tikka Burger + Peri-Peri Fries + Thick Cold Coffee.',
      isSale: true,
    },
    {
      id: 'dish-7',
      name: 'Chicken Triple Schezwan Fried Rice',
      title: 'Chicken Triple Schezwan Fried Rice',
      slug: 'chicken-triple-schezwan-fried-rice',
      categoryId: 'cat-chinese',
      veg: false,
      bestseller: false,
      customizable: true,
      inStock: true,
      mrp: 280,
      price: 235,
      compareAtPrice: 280,
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80',
      imageUrl: '/assets/categories/burrito.png',
      desc: 'Spicy Schezwan rice & crispy noodles served with rich chicken Manchurian gravy.',
      description: 'Spicy Schezwan rice & crispy noodles served with rich chicken Manchurian gravy.',
    },
    {
      id: 'dish-8',
      name: 'Thick Belgian Chocolate Cold Coffee',
      title: 'Thick Belgian Chocolate Cold Coffee',
      slug: 'belgian-chocolate-cold-coffee',
      categoryId: 'cat-beverages',
      veg: true,
      bestseller: false,
      customizable: false,
      inStock: true,
      mrp: 140,
      price: 110,
      compareAtPrice: 140,
      image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
      imageUrl: '/assets/categories/snacks.png',
      desc: 'Rich blended espresso frappe topped with Belgian dark chocolate drizzle.',
      description: 'Rich blended espresso frappe topped with Belgian dark chocolate drizzle.',
    },
    // Ranel dishes
    {
      id: 'ranel-1',
      name: 'Flame Box',
      title: 'Flame Box',
      slug: 'flame-box',
      categoryId: 'cat-chicken',
      veg: false,
      bestseller: true,
      isBestSeller: true,
      customizable: true,
      inStock: true,
      mrp: 70.0,
      price: 60.0,
      compareAtPrice: 70.0,
      image: '/assets/products/flame-box.png',
      imageUrl: '/assets/products/flame-box.png',
      desc: 'Slow-roasted chicken bowl garnished with mint yogurt and saffron rice.',
      description: 'Slow-roasted chicken bowl garnished with mint yogurt and saffron rice.',
      isSale: true,
    },
    {
      id: 'ranel-2',
      name: 'Urban Bite',
      title: 'Urban Bite',
      slug: 'urban-bite',
      categoryId: 'cat-burgers',
      veg: false,
      bestseller: true,
      isBestSeller: true,
      customizable: true,
      inStock: true,
      mrp: 70.0,
      price: 60.0,
      compareAtPrice: 70.0,
      image: '/assets/products/urban-bite.png',
      imageUrl: '/assets/products/urban-bite.png',
      desc: 'Prime char-grilled sirloin steak served with rosemary glaze and chili salsa.',
      description: 'Prime char-grilled sirloin steak served with rosemary glaze and chili salsa.',
      colors: JSON.stringify(['#000000', '#F5A623', '#8B4513']),
      isSale: true,
    },
    {
      id: 'ranel-3',
      name: 'Spice Zone Burger',
      title: 'Spice Zone',
      slug: 'spice-zone-burger',
      categoryId: 'cat-burgers',
      veg: false,
      bestseller: true,
      isBestSeller: true,
      customizable: true,
      inStock: true,
      mrp: 70.0,
      price: 60.0,
      compareAtPrice: 70.0,
      image: '/assets/products/spice-zone-burger.png',
      imageUrl: '/assets/products/spice-zone-burger.png',
      desc: 'Signature beef burger topped with crispy bacon and farm-fresh fried egg.',
      description: 'Signature beef burger topped with crispy bacon and farm-fresh fried egg.',
      isSale: true,
    },
    {
      id: 'ranel-4',
      name: 'Spice Zone Hotdog',
      title: 'Spice Zone',
      slug: 'spice-zone-hotdog',
      categoryId: 'cat-combos',
      veg: false,
      bestseller: true,
      isBestSeller: true,
      customizable: true,
      inStock: true,
      mrp: 80.0,
      price: 70.0,
      compareAtPrice: 80.0,
      image: '/assets/products/spice-zone-hotdog.png',
      imageUrl: '/assets/products/spice-zone-hotdog.png',
      desc: 'Gourmet pork frankfurter dressed with melted cheddar and jalapeño relish.',
      description: 'Gourmet pork frankfurter dressed with melted cheddar and jalapeño relish.',
      isSale: true,
    },
  ];

  for (const prod of productsData) {
    await prisma.product.create({ data: prod });
  }
  console.log('Products seeded.');

  // 5. Coupons
  await prisma.coupon.createMany({
    data: [
      {
        id: 'cpn-1',
        code: 'PICKUP20',
        type: 'PERCENT',
        value: 20,
        minOrder: 249,
        maxDiscount: 100,
        desc: '20% OFF up to ₹100 on Self-Pickup orders above ₹249',
        active: true,
      },
      {
        id: 'cpn-2',
        code: 'FLAT50',
        type: 'FLAT',
        value: 50,
        minOrder: 199,
        maxDiscount: 50,
        desc: 'Flat ₹50 Instant Discount on orders above ₹199',
        active: true,
      },
    ],
  });
  console.log('Coupons seeded.');

  // 6. Orders
  const sampleOrders = [
    {
      id: 'ORD-105',
      status: 'PREPARING',
      customerName: 'Aarav Sharma',
      customerPhone: '9876543210',
      isGuest: false,
      pickupTime: 'Pick Up Now (15m)',
      paymentStatus: 'PAID',
      couponCode: 'PICKUP20',
      discountAmount: 60,
      itemTotal: 298,
      gstAmount: 12,
      packagingCharge: 10,
      grandTotal: 260,
      items: [
        {
          productId: 'dish-1',
          name: 'Maharaja Paneer Tikka Burger',
          qty: 2,
          size: 'Regular',
          addons: JSON.stringify([]),
          note: 'Less spicy',
          unitPrice: 149,
          lineTotal: 298,
        },
      ],
    },
    {
      id: 'ORD-106',
      status: 'PENDING',
      customerName: 'Sneha Tiwari',
      customerPhone: '9123456789',
      isGuest: true,
      pickupTime: 'Pick Up Now (15m)',
      paymentStatus: 'PAY_AT_SHOP',
      couponCode: null,
      discountAmount: 0,
      itemTotal: 300,
      gstAmount: 15,
      packagingCharge: 10,
      grandTotal: 325,
      items: [
        {
          productId: 'dish-3',
          name: 'Wok-Tossed Schezwan Hakka Noodles',
          qty: 1,
          size: 'Full Plate',
          addons: JSON.stringify([]),
          note: 'Pack extra forks',
          unitPrice: 165,
          lineTotal: 165,
        },
        {
          productId: 'dish-5',
          name: 'Ghee Roast Mysore Masala Dosa',
          qty: 1,
          size: 'Regular',
          addons: JSON.stringify([]),
          note: '',
          unitPrice: 135,
          lineTotal: 135,
        },
      ],
    },
    {
      id: 'ORD-107',
      status: 'PENDING',
      customerName: 'Vikram Singh',
      customerPhone: '9988776655',
      isGuest: true,
      pickupTime: 'In 30 mins',
      paymentStatus: 'PAID',
      couponCode: 'FLAT50',
      discountAmount: 50,
      itemTotal: 249,
      gstAmount: 10,
      packagingCharge: 10,
      grandTotal: 219,
      items: [
        {
          productId: 'dish-6',
          name: 'Burger + Fries + Cold Coffee Meal',
          qty: 1,
          size: 'Regular',
          addons: JSON.stringify([]),
          note: '',
          unitPrice: 249,
          lineTotal: 249,
        },
      ],
    },
    {
      id: 'ORD-104',
      status: 'READY',
      customerName: 'Ananya Verma',
      customerPhone: '9839011223',
      isGuest: false,
      pickupTime: 'Ready at Counter #1',
      paymentStatus: 'PAID',
      couponCode: null,
      discountAmount: 0,
      itemTotal: 220,
      gstAmount: 11,
      packagingCharge: 10,
      grandTotal: 241,
      items: [
        {
          productId: 'dish-8',
          name: 'Thick Belgian Chocolate Cold Coffee',
          qty: 2,
          size: 'Regular',
          addons: JSON.stringify([]),
          note: '',
          unitPrice: 110,
          lineTotal: 220,
        },
      ],
    },
  ];

  for (const ord of sampleOrders) {
    const { items, ...orderData } = ord;
    await prisma.order.create({
      data: {
        ...orderData,
        items: {
          create: items,
        },
      },
    });
  }
  console.log('Orders seeded.');

  // 7. Deal for Landing page
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 44);
  targetDate.setHours(targetDate.getHours() + 17);
  targetDate.setMinutes(targetDate.getMinutes() + 21);
  targetDate.setSeconds(targetDate.getSeconds() + 56);

  await prisma.deal.create({
    data: {
      title: 'QUESADILLA WITH TOMATOES',
      subtitle:
        'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto',
      targetDate: targetDate,
      buttonText: 'ORDER NOW',
      imageUrl: '/assets/banners/burger-split-left.png',
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
