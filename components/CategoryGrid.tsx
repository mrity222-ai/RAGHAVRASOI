'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CategoryItem {
  id: string | number;
  name: string;
  slug: string;
  imageUrl?: string;
  image?: string;
}

export default function CategoryGrid() {
  const [categories, setCategories] = useState<CategoryItem[]>([
    { id: 'cat-burgers', name: 'FAST FOOD', slug: 'burgers', imageUrl: '/assets/categories/fast-food.png' },
    { id: 'cat-chinese', name: 'CHINESE', slug: 'chinese', imageUrl: '/assets/categories/combo.png' },
    { id: 'cat-south', name: 'SOUTH INDIAN', slug: 'south-indian', imageUrl: '/assets/categories/sandwich.png' },
    { id: 'cat-combos', name: 'COMBOS', slug: 'combos', imageUrl: '/assets/categories/burrito.png' },
    { id: 'cat-beverages', name: 'BEVERAGES', slug: 'beverages', imageUrl: '/assets/categories/snacks.png' },
    { id: 'cat-chicken', name: 'CHICKEN', slug: 'chicken', imageUrl: '/assets/categories/chicken.png' },
  ]);

  // Fetch from database API
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          setCategories(data.data);
        }
      })
      .catch((err) => console.log('Using local fallback for categories', err));
  }, []);

  return (
    <section id="categories" className="w-full bg-white py-4 border-b border-[#E8E2D5]">
      <div className="max-w-[1440px] mx-auto px-2 sm:px-4 lg:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 border-l border-t border-[#E8E2D5]">
          {categories.map((cat) => {
            const imageSrc =
              cat.imageUrl ||
              cat.image ||
              '/assets/categories/fast-food.png';

            return (
              <Link
                href={`/categories/${cat.slug || cat.id}`}
                key={cat.id}
                className="group flex flex-col items-center justify-between p-4 sm:p-5 border-r border-b border-[#E8E2D5] bg-white hover:shadow-sm transition-all duration-300 cursor-pointer"
              >
                {/* Product Category Food Image */}
                <div className="w-full h-[140px] sm:h-[160px] relative flex items-center justify-center overflow-hidden">
                  <Image
                    src={imageSrc}
                    alt={cat.name || 'Category'}
                    fill
                    sizes="(max-width: 640px) 140px, 160px"
                    className="object-contain p-2 transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Title at bottom center */}
                <h3 className="font-heading text-xs font-bold tracking-[0.14em] text-black text-center mt-3 uppercase group-hover:text-[#EA580C] transition-colors">
                  {cat.name}
                </h3>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
