'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  image?: string;
  imageUrl?: string;
}

export default function CategoryGrid() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Fetch dynamic categories from DB
  useEffect(() => {
    fetch('/api/menu/categories?active=true')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          setCategories(data.data);
        }
      })
      .catch((err) => console.log('Error fetching categories:', err));
  }, []);

  const updateScrollState = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    updateScrollState();
    window.addEventListener('resize', updateScrollState);
    return () => window.removeEventListener('resize', updateScrollState);
  }, [categories]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 300;
    const offset = direction === 'left' ? -scrollAmount : scrollAmount;
    scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    setTimeout(updateScrollState, 350);
  };

  return (
    <section id="categories" className="w-full bg-[#FAF8F5]/60 py-10 sm:py-14 border-b border-slate-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Section Header matching Screenshot */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
              Our Food Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Explore authentic Raghav Rasoi specialties handcrafted daily
            </p>
          </div>

          {/* Navigation Scroll Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 flex items-center justify-center transition-all ${
                canScrollLeft
                  ? 'bg-white text-slate-800 hover:bg-slate-50 shadow-xs hover:shadow-sm active:scale-95'
                  : 'bg-slate-100 text-slate-300 cursor-not-allowed'
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 flex items-center justify-center transition-all ${
                canScrollRight
                  ? 'bg-white text-slate-800 hover:bg-slate-50 shadow-xs hover:shadow-sm active:scale-95'
                  : 'bg-slate-100 text-slate-300 cursor-not-allowed'
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Categories Horizontal Carousel matching Screenshot */}
        <div
          ref={scrollContainerRef}
          onScroll={updateScrollState}
          className="flex items-center gap-4 sm:gap-6 overflow-x-auto scrollbar-none pb-4 pt-1 px-1 scroll-smooth"
        >
          {categories.map((cat) => {
            const imageSrc =
              cat.image ||
              cat.imageUrl ||
              'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80';

            return (
              <Link
                href={`/menu?category=${cat.id}`}
                key={cat.id}
                className="group shrink-0 w-32 sm:w-40 bg-white rounded-3xl p-3.5 sm:p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer select-none"
              >
                {/* Round Category Dish Image */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden relative mb-3 shadow-xs border-2 border-amber-100/60 group-hover:border-amber-300 transition-colors">
                  <Image
                    src={imageSrc}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 80px, 96px"
                    className="object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Category Name */}
                <h3 className="font-bold text-xs sm:text-[13px] text-slate-800 group-hover:text-[#B45309] transition-colors leading-snug line-clamp-1">
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
