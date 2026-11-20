'use client';

import React from 'react';
import Image from 'next/image';

export default function BetterFoodSection() {
  return (
    <section className="relative w-full bg-white overflow-hidden py-16 sm:py-24 lg:py-28 min-h-[460px] sm:min-h-[500px] lg:min-h-[540px] flex items-center justify-center select-none border-b border-slate-100">
      
      {/* Background Whimsical Pink Doodle Curves matching Reference Image */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1440 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M-50 160 C 180 80, 240 40, 280 180 C 320 320, 180 440, 100 380 C 20 320, 80 160, 260 220 C 440 280, 560 120, 720 180 C 880 240, 960 480, 1100 420 C 1240 360, 1340 180, 1480 80"
          stroke="#FCA5A5"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.45"
        />
        <path
          d="M980 120 C 1050 200, 1150 480, 1120 520 C 1090 560, 1070 380, 1260 300 C 1380 240, 1420 160, 1500 120"
          stroke="#FCA5A5"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.35"
        />
      </svg>

      {/* ============================================================ */}
      {/* LEFT FLANK: Burger, Lower Tomato, Top Mint Leaf */}
      {/* (Anchored to Far Left Edge with Zero Center Overlap) */}
      {/* ============================================================ */}

      {/* 1. Gourmet Cheeseburger (Vertically centered on the far left) */}
      <div className="absolute -left-3 sm:left-4 md:left-8 lg:left-12 xl:left-20 top-1/2 -translate-y-1/2 z-10 w-24 sm:w-40 md:w-48 lg:w-56 xl:w-64 transition-transform duration-500 hover:scale-105 pointer-events-none">
        <Image
          src="/assets/better-food/burger.png"
          alt="Gourmet Smash Burger"
          width={240}
          height={240}
          className="w-full h-auto drop-shadow-[0_15px_30px_rgba(0,0,0,0.12)] -rotate-6"
          priority
        />
      </div>

      {/* 2. Small Tomato Slice (Safely below burger on lower left) */}
      <div className="absolute left-6 sm:left-12 md:left-20 lg:left-28 bottom-4 sm:bottom-8 lg:bottom-12 z-10 w-5 sm:w-7 lg:w-9 pointer-events-none">
        <Image
          src="/assets/better-food/tomato.png"
          alt="Fresh Tomato Slice"
          width={40}
          height={40}
          className="w-full h-auto drop-shadow-md -rotate-12"
        />
      </div>

      {/* 3. Fresh Mint/Basil Leaf (Safely above burger on upper left) */}
      <div className="absolute left-14 sm:left-24 md:left-36 lg:left-48 top-4 sm:top-8 lg:top-12 z-10 w-5 sm:w-6 lg:w-8 pointer-events-none">
        <Image
          src="/assets/better-food/leaf.png"
          alt="Fresh Basil Leaf"
          width={35}
          height={35}
          className="w-full h-auto drop-shadow-sm rotate-12"
        />
      </div>

      {/* ============================================================ */}
      {/* RIGHT FLANK: Momos (Top), Pizza (Bottom), Tomato (Center) */}
      {/* (Momos at Top & Pizza at Bottom — Can Never Overlap!) */}
      {/* ============================================================ */}

      {/* 4. Steamed Momos Basket (Anchored to Top Right) */}
      <div className="absolute -right-2 sm:right-4 md:right-8 lg:right-12 xl:right-20 top-3 sm:top-6 lg:top-8 z-10 w-22 sm:w-36 md:w-40 lg:w-48 xl:w-52 transition-transform duration-500 hover:scale-105 pointer-events-none">
        <Image
          src="/assets/better-food/momos.png"
          alt="Steamed Momos in Bamboo Basket"
          width={200}
          height={200}
          className="w-full h-auto drop-shadow-[0_15px_30px_rgba(0,0,0,0.12)] -rotate-12"
          priority
        />
      </div>

      {/* 5. Small Tomato Slice (Centered vertically on right flank) */}
      <div className="absolute right-8 sm:right-14 md:right-20 lg:right-28 top-1/2 -translate-y-1/2 z-10 w-5 sm:w-7 lg:w-8 pointer-events-none">
        <Image
          src="/assets/better-food/tomato.png"
          alt="Fresh Tomato Slice"
          width={35}
          height={35}
          className="w-full h-auto drop-shadow-md rotate-45"
        />
      </div>

      {/* 6. Crispy Pizza Slice (Anchored to Bottom Right) */}
      <div className="absolute -right-2 sm:right-4 md:right-8 lg:right-10 xl:right-16 bottom-3 sm:bottom-6 lg:bottom-8 z-10 w-22 sm:w-36 md:w-40 lg:w-48 xl:w-52 transition-transform duration-500 hover:scale-105 pointer-events-none">
        <Image
          src="/assets/better-food/pizza.png"
          alt="Crispy Pizza Slice with Olives"
          width={200}
          height={200}
          className="w-full h-auto drop-shadow-[0_15px_30px_rgba(0,0,0,0.12)] -rotate-12"
          priority
        />
      </div>

      {/* ============================================================ */}
      {/* CENTER CONTENT: Perfectly Clear & Isolated in the Middle */}
      {/* ============================================================ */}
      <div className="relative z-20 max-w-[270px] sm:max-w-md lg:max-w-xl mx-auto px-4 text-center flex flex-col items-center justify-center my-auto">
        
        {/* Main Headline in Coral Red */}
        <h2 className="text-3xl sm:text-5xl lg:text-[46px] font-bold text-[#E53935] leading-[1.12] tracking-tight">
          Authentic Taste,<br />
          Handcrafted Everyday
        </h2>

        {/* Subtitle Description */}
        <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-[280px] sm:max-w-lg mx-auto mt-4">
          Serving Gaur City 1 with pure desi ghee preparations, traditional clay tandoor, hand-ground spices, and heartfelt Indian hospitality.
        </p>
      </div>

    </section>
  );
}
