'use client';

import React from 'react';
import Image from 'next/image';

export default function BetterFoodSection() {
  return (
    <section className="relative w-full bg-white overflow-hidden py-12 sm:py-20 lg:py-24 min-h-[420px] sm:min-h-[480px] lg:min-h-[520px] flex items-center justify-center select-none border-b border-slate-100">
      
      {/* Background Whimsical Pink Doodle Curves */}
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
      {/* DESKTOP ONLY FLOATING FLANKS (Hidden on Mobile to Prevent Overlap) */}
      {/* ============================================================ */}

      {/* 1. Gourmet Burger (Desktop Left Flank) */}
      <div className="hidden md:block absolute md:left-4 lg:left-12 xl:left-20 top-1/2 -translate-y-1/2 z-10 md:w-44 lg:w-56 xl:w-64 transition-transform duration-500 hover:scale-105 pointer-events-none">
        <Image
          src="/assets/better-food/burger.png"
          alt="Gourmet Smash Burger"
          width={240}
          height={240}
          className="w-full h-auto drop-shadow-[0_15px_30px_rgba(0,0,0,0.12)] -rotate-6"
          priority
        />
      </div>

      {/* 2. Small Tomato Slice (Desktop Lower Left) */}
      <div className="hidden md:block absolute md:left-20 lg:left-28 bottom-8 lg:bottom-12 z-10 w-7 lg:w-9 pointer-events-none">
        <Image
          src="/assets/better-food/tomato.png"
          alt="Fresh Tomato Slice"
          width={40}
          height={40}
          className="w-full h-auto drop-shadow-md -rotate-12"
        />
      </div>

      {/* 3. Fresh Basil Leaf (Desktop Upper Left) */}
      <div className="hidden md:block absolute md:left-36 lg:left-48 top-8 lg:top-12 z-10 w-6 lg:w-8 pointer-events-none">
        <Image
          src="/assets/better-food/leaf.png"
          alt="Fresh Basil Leaf"
          width={35}
          height={35}
          className="w-full h-auto drop-shadow-sm rotate-12"
        />
      </div>

      {/* 4. Steamed Momos Basket (Desktop Top Right) */}
      <div className="hidden md:block absolute md:right-6 lg:right-12 xl:right-20 top-4 sm:top-6 lg:top-8 z-10 md:w-36 lg:w-48 xl:w-52 transition-transform duration-500 hover:scale-105 pointer-events-none">
        <Image
          src="/assets/better-food/momos.png"
          alt="Steamed Momos in Bamboo Basket"
          width={200}
          height={200}
          className="w-full h-auto drop-shadow-[0_15px_30px_rgba(0,0,0,0.12)] -rotate-12"
          priority
        />
      </div>

      {/* 5. Small Tomato Slice (Desktop Center Right) */}
      <div className="hidden md:block absolute md:right-20 lg:right-28 top-1/2 -translate-y-1/2 z-10 w-7 lg:w-8 pointer-events-none">
        <Image
          src="/assets/better-food/tomato.png"
          alt="Fresh Tomato Slice"
          width={35}
          height={35}
          className="w-full h-auto drop-shadow-md rotate-45"
        />
      </div>

      {/* 6. Crispy Pizza Slice (Desktop Bottom Right) */}
      <div className="hidden md:block absolute md:right-6 lg:right-10 xl:right-16 bottom-4 sm:bottom-6 lg:bottom-8 z-10 md:w-36 lg:w-48 xl:w-52 transition-transform duration-500 hover:scale-105 pointer-events-none">
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
      {/* CENTER CONTENT: 100% Clear, Clean & Legible on All Screens */}
      {/* ============================================================ */}
      <div className="relative z-20 w-full max-w-xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center justify-center my-auto">
        
        {/* Main Headline in Bold Coral Red */}
        <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-[46px] font-black text-[#E53935] leading-tight tracking-tight">
          Authentic Taste,<br />
          Handcrafted Everyday
        </h2>

        {/* Subtitle Description with Official Address */}
        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-md mx-auto mt-3 sm:mt-4">
          Serving <span className="font-bold text-slate-900">Gundardehi, Chhattisgarh</span> with pure desi ghee preparations, traditional clay tandoor, hand-ground spices, and heartfelt Indian hospitality.
        </p>

        {/* ============================================================ */}
        {/* MOBILE FOOD SHOWCASE (Visible Only on Mobile - ZERO Overlap!) */}
        {/* ============================================================ */}
        <div className="md:hidden mt-6 flex items-center justify-center gap-3 sm:gap-4 w-full px-2">
          
          {/* Mobile Item 1: Burger */}
          <div className="flex flex-col items-center">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-amber-50/80 border border-amber-200/80 p-2 flex items-center justify-center shadow-xs">
              <Image
                src="/assets/better-food/burger.png"
                alt="Burger"
                width={70}
                height={70}
                className="w-full h-auto object-contain drop-shadow-sm -rotate-6"
              />
            </div>
            <span className="text-[10px] font-bold text-slate-700 mt-1.5">Fresh Bites</span>
          </div>

          {/* Mobile Item 2: Momos */}
          <div className="flex flex-col items-center">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-orange-50/80 border border-orange-200/80 p-2 flex items-center justify-center shadow-xs">
              <Image
                src="/assets/better-food/momos.png"
                alt="Momos"
                width={70}
                height={70}
                className="w-full h-auto object-contain drop-shadow-sm -rotate-12"
              />
            </div>
            <span className="text-[10px] font-bold text-slate-700 mt-1.5">Hot Momos</span>
          </div>

          {/* Mobile Item 3: Pizza */}
          <div className="flex flex-col items-center">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-rose-50/80 border border-rose-200/80 p-2 flex items-center justify-center shadow-xs">
              <Image
                src="/assets/better-food/pizza.png"
                alt="Pizza"
                width={70}
                height={70}
                className="w-full h-auto object-contain drop-shadow-sm -rotate-12"
              />
            </div>
            <span className="text-[10px] font-bold text-slate-700 mt-1.5">Crisp Crust</span>
          </div>

        </div>

      </div>

    </section>
  );
}
