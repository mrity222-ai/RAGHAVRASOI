'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

export default function CountdownDeal() {
  const { addToCart } = useCart();

  // Target 44 days, 17 hours, 21 minutes, 56 seconds (from screenshot 6)
  const [timeLeft, setTimeLeft] = useState({
    days: 44,
    hours: 17,
    minutes: 21,
    seconds: 56,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section id="deal" className="relative w-full bg-[#FAF5EC] overflow-hidden py-10 lg:py-16 border-b border-[#E8E2D5]">
      
      {/* Symmetrical Burger Halves on Left & Right Margins (from Screenshot 6) */}
      <div className="absolute left-0 top-0 bottom-0 w-28 sm:w-44 md:w-60 lg:w-72 pointer-events-none select-none z-0">
        <Image
          src="/assets/banners/burger-split-left.png"
          alt="Burger slice left"
          fill
          className="object-contain object-left"
        />
      </div>

      <div className="absolute right-0 top-0 bottom-0 w-28 sm:w-44 md:w-60 lg:w-72 pointer-events-none select-none z-0">
        <Image
          src="/assets/banners/burger-split-right.png"
          alt="Burger slice right"
          fill
          className="object-contain object-right"
        />
      </div>

      {/* Center Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center">
        
        {/* Title */}
        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tight uppercase">
          RAGHAV RASOI SHAHI THALI FEAST
        </h2>

        {/* Subtitle */}
        <p className="mt-4 text-xs sm:text-[13px] text-[#666666] leading-relaxed max-w-lg font-normal">
          Indulge in our signature royal spread featuring Shahi Paneer, overnight Dal Makhani, 2 Butter Naans, Jeera Rice, Boondi Raita, Salad &amp; Gulab Jamun at a special promotional offer!
        </p>

        {/* 4 Red Circular Countdown Counters (matching screenshot 6) */}
        <div className="flex items-center justify-center space-x-4 sm:space-x-7 mt-8">
          
          {/* Days */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#DE2323] flex items-center justify-center shadow-md">
              <span className="font-heading text-lg sm:text-xl font-bold text-white leading-none">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.14em] text-[#555] uppercase mt-2">
              DAYS
            </span>
          </div>

          {/* Hours */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#DE2323] flex items-center justify-center shadow-md">
              <span className="font-heading text-lg sm:text-xl font-bold text-white leading-none">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.14em] text-[#555] uppercase mt-2">
              HOURS
            </span>
          </div>

          {/* Minutes */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#DE2323] flex items-center justify-center shadow-md">
              <span className="font-heading text-lg sm:text-xl font-bold text-white leading-none">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.14em] text-[#555] uppercase mt-2">
              MINS
            </span>
          </div>

          {/* Seconds */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#DE2323] flex items-center justify-center shadow-md">
              <span className="font-heading text-lg sm:text-xl font-bold text-white leading-none">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.14em] text-[#555] uppercase mt-2">
              SECS
            </span>
          </div>

        </div>

        {/* CTA Button */}
        <button
          onClick={() =>
            addToCart({
              id: 401,
              title: 'Raghav Rasoi Shahi Thali Feast',
              price: 249,
              imageUrl: '/assets/products/flame-box.png',
            })
          }
          className="mt-8 bg-black hover:bg-[#222222] text-white text-[11px] font-bold tracking-[0.18em] px-8 py-3 rounded-full uppercase shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          ORDER NOW • ₹249
        </button>

      </div>
    </section>
  );
}
