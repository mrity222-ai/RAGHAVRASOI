'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function PromoStory() {
  const { addToCart } = useCart();

  return (
    <section id="story" className="w-full bg-white py-8 lg:py-14 border-b border-[#E8E2D5]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center min-h-[380px]">
          
          {/* Left: Dark Chocolate Burger with 50% OFF Golden Badge */}
          <div className="relative w-full h-[320px] sm:h-[400px] lg:h-[440px] bg-[#2A150C] rounded-lg overflow-hidden flex items-center justify-center p-6 shadow-md">
            <div className="relative w-full h-full max-w-[420px] max-h-[380px]">
              <Image
                src="/assets/banners/burger-promo-50off.png"
                alt="We make the best burger"
                fill
                className="object-contain hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* 50% OFF Badge (Visual match to screenshot 3) */}
            <div className="absolute top-6 right-8 w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-[#D4AF37] bg-[#23120A] flex flex-col items-center justify-center shadow-lg transform rotate-[-8deg] hover:rotate-0 transition-transform">
              <span className="font-heading text-xs sm:text-sm font-bold text-[#FFD700] leading-none">50%</span>
              <span className="font-heading text-[10px] sm:text-xs font-semibold text-white tracking-widest leading-none mt-0.5">OFF</span>
            </div>
          </div>

          {/* Right: Typography and Explore All Button */}
          <div className="w-full flex flex-col justify-center px-6 sm:px-12 lg:px-16 mt-8 md:mt-0 text-left">
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-black leading-[1.08] tracking-tight">
              TRADITIONAL TASTE <br />
              COOKED WITH LOVE
            </h2>

            <p className="mt-5 text-xs sm:text-sm text-[#666666] leading-relaxed max-w-lg font-normal">
              At Raghav Rasoi in Gaur City 1, every recipe honors timeless Indian heritage. We slow-simmer our dal on gentle flames, bake tandoori breads in red-hot clay ovens, and use pure ingredients for flavours you will cherish with family and friends.
            </p>

            <div className="mt-8">
              <Link
                href="/menu"
                className="inline-flex items-center justify-center bg-black hover:bg-[#222222] text-white text-[11px] font-bold tracking-[0.18em] px-8 py-3 rounded-full uppercase shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                EXPLORE FULL MENU
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
