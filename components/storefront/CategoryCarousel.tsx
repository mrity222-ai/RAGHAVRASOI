'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryCarouselProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

export default function CategoryCarousel({
  selectedCategory,
  onSelectCategory,
}: CategoryCarouselProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    fetch('/api/menu/categories?active=true')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setCategories(data.data);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const allItems = [
    {
      id: 'ALL',
      name: 'All Dishes',
      image:
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
    },
    ...categories,
  ];

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
  }, [allItems.length]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 340;
    const offset = direction === 'left' ? -scrollAmount : scrollAmount;
    scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    setTimeout(updateScrollState, 350);
  };

  return (
    <section className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
      {/* Header with Title, Subtitle and Top Nav Arrows */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl sm:text-[28px] font-bold text-slate-900 tracking-tight">
            What&apos;s on your mind?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
            Tap a category to filter freshly prepared self-pickup dishes
          </p>
        </div>

        {/* Top-Right Round Arrow Controls & View All Link */}
        <div className="flex items-center gap-3">
          <Link
            href="/categories"
            className="text-xs font-bold text-[#EA580C] hover:text-[#C2410C] hover:underline"
          >
            All Categories ➔
          </Link>
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            className={`w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-800 transition-all ${
              canScrollLeft
                ? 'hover:bg-slate-200 active:scale-95 cursor-pointer text-slate-900'
                : 'opacity-30 cursor-not-allowed text-slate-400'
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft size={18} strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            className={`w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-800 transition-all ${
              canScrollRight
                ? 'hover:bg-slate-200 active:scale-95 cursor-pointer text-slate-900'
                : 'opacity-30 cursor-not-allowed text-slate-400'
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight size={18} strokeWidth={2.5} />
          </button>
          </div>
        </div>
      </div>

      {/* Relative Carousel Row matching Reference Screenshot */}
      <div className="relative">
        {/* Left Floating Chevron (shown on desktop when scrolled) */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => handleScroll('left')}
            className="hidden md:flex absolute -left-3 top-1/2 -translate-y-8 z-20 w-10 h-10 rounded-full bg-white shadow-xl border border-slate-200/80 items-center justify-center text-slate-800 hover:text-black hover:scale-110 active:scale-95 transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>
        )}

        {/* Scrollable Container with Smooth Touch & Mouse */}
        <div
          ref={scrollContainerRef}
          onScroll={updateScrollState}
          className="flex items-start gap-5 sm:gap-8 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {allItems.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className="group flex flex-col items-center shrink-0 focus:outline-none select-none cursor-pointer w-28 sm:w-36"
              >
                {/* Circular Dish Image matching Screenshot */}
                <div
                  className={`relative w-28 h-28 sm:w-36 sm:h-36 shrink-0 aspect-square rounded-full overflow-hidden transition-all duration-300 ${
                    isActive
                      ? 'ring-4 ring-[#EA580C] ring-offset-2 shadow-xl scale-105'
                      : 'border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.08)] group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.16)] group-hover:scale-105'
                  }`}
                >
                  <Image
                    src={
                      cat.image ||
                      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80'
                    }
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 112px, 144px"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Clean Centered Category Name */}
                <span
                  className={`text-center mt-3 sm:mt-3.5 text-xs sm:text-[15px] tracking-tight leading-snug transition-colors ${
                    isActive
                      ? 'font-black text-[#EA580C]'
                      : 'font-semibold text-slate-800 group-hover:text-black'
                  }`}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Floating Chevron matching Screenshot */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => handleScroll('right')}
            className="hidden md:flex absolute -right-3 top-1/2 -translate-y-8 z-20 w-10 h-10 rounded-full bg-white shadow-xl border border-slate-200/80 items-center justify-center text-slate-800 hover:text-black hover:scale-110 active:scale-95 transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} strokeWidth={2.5} />
          </button>
        )}
      </div>
    </section>
  );
}
