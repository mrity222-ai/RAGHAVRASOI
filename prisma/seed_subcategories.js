import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding rich sub-categories and dishes...');

  // 1. Update existing dishes with appropriate subCategory
  await prisma.product.updateMany({
    where: { name: { contains: 'Noodles' } },
    data: { subCategory: 'Noodles & Chowmein' }
  });

  await prisma.product.updateMany({
    where: { name: { contains: 'Fried Rice' } },
    data: { subCategory: 'Fried Rice' }
  });

  await prisma.product.updateMany({
    where: { name: { contains: 'Paneer Dry' } },
    data: { subCategory: 'Starters & Dry' }
  });

  await prisma.product.updateMany({
    where: { name: { contains: 'Dosa' } },
    data: { subCategory: 'Dosas' }
  });

  await prisma.product.updateMany({
    where: { categoryId: 'cat-burgers' },
    data: { subCategory: 'Smash Burgers' }
  });

  await prisma.product.updateMany({
    where: { categoryId: 'cat-combos' },
    data: { subCategory: 'Value Meals' }
  });

  await prisma.product.updateMany({
    where: { categoryId: 'cat-beverages' },
    data: { subCategory: 'Cold Coffees & Shakes' }
  });

  await prisma.product.updateMany({
    where: { categoryId: 'cat-chicken' },
    data: { subCategory: 'Fried Chicken' }
  });

  // 2. Define rich Chinese Dishes with Sub-Categories
  const chineseDishes = [
    {
      id: 'zh-noodle-2',
      name: 'Veg Chilli Garlic Hakka Noodles',
      slug: 'veg-chilli-garlic-noodles',
      categoryId: 'cat-chinese',
      subCategory: 'Noodles & Chowmein',
      price: 189,
      mrp: 239,
      veg: true,
      bestseller: true,
      image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80',
      calories: 420,
      prepTime: '12-15 min',
      story: 'Wok-tossed fresh eggless noodles with shredded cabbage, bell peppers, fresh garlic, and spicy red chilli sauce.',
      ingredients: 'Hakka noodles, bell peppers, cabbage, spring onion, burnt garlic, soy & chilli sauce'
    },
    {
      id: 'zh-noodle-3',
      name: 'Singapore Style Spicy Rice Noodles',
      slug: 'singapore-spicy-rice-noodles',
      categoryId: 'cat-chinese',
      subCategory: 'Noodles & Chowmein',
      price: 219,
      mrp: 269,
      veg: true,
      bestseller: false,
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
      calories: 390,
      prepTime: '15 min',
      story: 'Thin rice vermicelli stir-fried with fragrant Madras curry powder, crisp vegetables, and dark sesame oil.',
      ingredients: 'Rice vermicelli, curry blend, sesame oil, bell peppers, carrots, spring onions'
    },
    {
      id: 'zh-rice-2',
      name: 'Burnt Garlic Vegetable Fried Rice',
      slug: 'burnt-garlic-veg-fried-rice',
      categoryId: 'cat-chinese',
      subCategory: 'Fried Rice',
      price: 199,
      mrp: 249,
      veg: true,
      bestseller: true,
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80',
      calories: 410,
      prepTime: '12-15 min',
      story: 'Fragrant basmati rice tossed on a raging wok with golden toasted garlic chips, crunchy beans, and house seasoning.',
      ingredients: 'Basmati rice, burnt garlic flakes, french beans, carrots, scallions, light soy'
    },
    {
      id: 'zh-starter-2',
      name: 'Crispy Honey Chilli Potato',
      slug: 'crispy-honey-chilli-potato',
      categoryId: 'cat-chinese',
      subCategory: 'Starters & Dry',
      price: 179,
      mrp: 219,
      veg: true,
      bestseller: true,
      image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80',
      calories: 360,
      prepTime: '10-12 min',
      story: 'Crispy twice-fried potato fingers glazed in a sticky sweet honey-chilli sauce and topped with toasted sesame seeds.',
      ingredients: 'Potato fingers, honey, red chilli paste, toasted sesame, spring onion greens'
    },
    {
      id: 'zh-starter-3',
      name: 'Crispy Chilli Chicken Dry',
      slug: 'crispy-chilli-chicken-dry',
      categoryId: 'cat-chinese',
      subCategory: 'Starters & Dry',
      price: 249,
      mrp: 299,
      veg: false,
      bestseller: true,
      image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=600&q=80',
      calories: 480,
      prepTime: '15 min',
      story: 'Tender chicken cubes marinated in egg white, tossed in a fiery wok with green chillies, ginger, and scallions.',
      ingredients: 'Boneless chicken cubes, dark soy, green chillies, garlic, onion petals, capsicum'
    },
    {
      id: 'zh-gravy-1',
      name: 'Veg Manchurian Gravy Bowl',
      slug: 'veg-manchurian-gravy-bowl',
      categoryId: 'cat-chinese',
      subCategory: 'Gravies & Curries',
      price: 189,
      mrp: 239,
      veg: true,
      bestseller: false,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      calories: 340,
      prepTime: '15 min',
      story: 'Steamed vegetable dumplings simmered in a dark, glossy, garlicky Manchurian gravy with chopped ginger and spring onions.',
      ingredients: 'Cabbage & carrot dumplings, dark soy sauce, coriander roots, garlic, ginger'
    },
    {
      id: 'zh-momo-1',
      name: 'Steamed Veg Darjeeling Momos (6 Pcs)',
      slug: 'steamed-veg-darjeeling-momos',
      categoryId: 'cat-chinese',
      subCategory: 'Momos & Dimsums',
      price: 139,
      mrp: 179,
      veg: true,
      bestseller: true,
      image: 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?auto=format&fit=crop&w=600&q=80',
      calories: 260,
      prepTime: '10 min',
      story: 'Authentic Darjeeling-style thin flour wrappers stuffed with seasoned cabbage, onion, and herbs, served with fiery red chutney.',
      ingredients: 'Flour wrapper, shredded cabbage, onions, ginger, fiery red chilli dip, mayonnaise'
    },
    {
      id: 'zh-momo-2',
      name: 'Kurkure Crispy Paneer Momos (6 Pcs)',
      slug: 'kurkure-crispy-paneer-momos',
      categoryId: 'cat-chinese',
      subCategory: 'Momos & Dimsums',
      price: 169,
      mrp: 209,
      veg: true,
      bestseller: true,
      image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=600&q=80',
      calories: 390,
      prepTime: '12-14 min',
      story: 'Paneer stuffed momos coated in crunchy cornflakes crust and fried until golden and shatteringly crisp.',
      ingredients: 'Spiced paneer filling, cornflakes crust, peri peri masala, mint dip'
    }
  ];

  // 3. Define rich South Indian Dishes with Sub-Categories
  const southIndianDishes = [
    {
      id: 'si-dosa-2',
      name: 'Paper Butter Plain Dosa (Golden Crisp)',
      slug: 'paper-butter-plain-dosa',
      categoryId: 'cat-south',
      subCategory: 'Dosas',
      price: 149,
      mrp: 189,
      veg: true,
      bestseller: false,
      image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80',
      calories: 310,
      prepTime: '10 min',
      story: 'Ultra-thin, golden crisp fermented rice and lentil crepe smeared with fresh Amul butter, served with 3 chutneys and hot sambar.',
      ingredients: 'Fermented dosa batter, pure butter, toor dal sambar, coconut chutney, tomato chutney'
    },
    {
      id: 'si-dosa-3',
      name: 'Cheese Burst Chilli Garlic Dosa',
      slug: 'cheese-burst-chilli-garlic-dosa',
      categoryId: 'cat-south',
      subCategory: 'Dosas',
      price: 209,
      mrp: 259,
      veg: true,
      bestseller: true,
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
      calories: 460,
      prepTime: '12 min',
      story: 'Crisp dosa slathered with spicy garlic chutney, topped with shredded mozzarella and processed cheese that melts into a gooey feast.',
      ingredients: 'Dosa batter, mozzarella cheese, spicy garlic red chutney, green chillies, butter'
    },
    {
      id: 'si-idli-1',
      name: 'Steamed Button Sambar Idli (14 Pcs)',
      slug: 'steamed-button-sambar-idli',
      categoryId: 'cat-south',
      subCategory: 'Idli & Vada',
      price: 129,
      mrp: 169,
      veg: true,
      bestseller: true,
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
      calories: 240,
      prepTime: '8 min',
      story: '14 bite-sized fluffy steamed rice cakes submerged in a piping hot bowl of aromatic drumstick sambar and drizzled with pure ghee.',
      ingredients: 'Steamed rice & urad dal idli, drumstick sambar, ghee, curry leaves, coriander'
    },
    {
      id: 'si-idli-2',
      name: 'Crispy Medu Vada with Sambar (2 Pcs)',
      slug: 'crispy-medu-vada-sambar',
      categoryId: 'cat-south',
      subCategory: 'Idli & Vada',
      price: 119,
      mrp: 149,
      veg: true,
      bestseller: true,
      image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80',
      calories: 320,
      prepTime: '10 min',
      story: 'Golden crispy lentil fritters studded with crushed black pepper, fresh ginger, and curry leaves. Crispy outside, pillowy inside.',
      ingredients: 'Urad dal, peppercorns, ginger, fresh coconut, curry leaves, hing'
    },
    {
      id: 'si-uthappam-1',
      name: 'Onion Tomato Masala Uthappam',
      slug: 'onion-tomato-masala-uthappam',
      categoryId: 'cat-south',
      subCategory: 'Uthappam',
      price: 169,
      mrp: 209,
      veg: true,
      bestseller: false,
      image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80',
      calories: 360,
      prepTime: '12 min',
      story: 'Thick, fluffy fermented pancake crowned with finely chopped juicy tomatoes, crunchy red onions, green chillies, and podi masala.',
      ingredients: 'Uthappam batter, onions, tomatoes, green chillies, ghee, gunpowder podi'
    },
    {
      id: 'si-thali-1',
      name: 'South Indian Royal Feast Thali',
      slug: 'south-indian-royal-thali',
      categoryId: 'cat-south',
      subCategory: 'Meals & Thali',
      price: 279,
      mrp: 349,
      veg: true,
      bestseller: true,
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
      calories: 680,
      prepTime: '15 min',
      story: 'A majestic spread: Steamed basmati rice, Sambar, Rasam, Avial, Poriyal, Curd, Malabar Parotta, Appalam, and Sweet Payasam.',
      ingredients: 'Basmati rice, sambar, tomato rasam, coconut avial, curd, pickle, payasam, appalam'
    },
    {
      id: 'si-drink-1',
      name: 'Kumbakonam Degree Filter Coffee (Hot)',
      slug: 'kumbakonam-degree-filter-coffee',
      categoryId: 'cat-south',
      subCategory: 'Filter Coffee & Drinks',
      price: 69,
      mrp: 89,
      veg: true,
      bestseller: true,
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
      calories: 120,
      prepTime: '5 min',
      story: 'Authentic chicory-infused decoction brewed in brass filters, frothed with full-cream cows milk into a foaming traditional dabarah.',
      ingredients: 'South Indian dark roast coffee decoction, full-cream milk, jaggery/sugar'
    }
  ];

  // Upsert all Chinese dishes
  for (const dish of chineseDishes) {
    await prisma.product.upsert({
      where: { id: dish.id },
      update: dish,
      create: dish
    });
  }

  // Upsert all South Indian dishes
  for (const dish of southIndianDishes) {
    await prisma.product.upsert({
      where: { id: dish.id },
      update: dish,
      create: dish
    });
  }

  console.log('Seeded Chinese & South Indian sub-categories successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
