'use client';

import React from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

export default function TriGridShowcase() {
  const { addToCart } = useCart();

  return (
    <section className="w-full bg-white py-6 border-b border-[#E8E2D5]">
      <div className="max-w-[1440px] mx-auto px-2 sm:px-4 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          
          {/* Left Column: 2 Stacked Tiles */}
          <div className="flex flex-col gap-3 sm:gap-4">
            
            {/* Top Tile: Super Delicious */}
            <div className="relative w-full h-[220px] sm:h-[235px] rounded-sm overflow-hidden group shadow-sm">
              <Image
                src="/assets/banners/tri-super-delicious.png"
                alt="Super Delicious Burger"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="bg-white/80 backdrop-blur-md px-6 py-4 rounded-sm flex flex-col items-center text-center shadow-lg border border-white/60 max-w-[260px] w-full">
                  <h3 className="font-heading text-sm sm:text-base font-extrabold text-black tracking-wider uppercase">
                    SUPER DELICIOUS
                  </h3>
                  <button
                    onClick={() =>
                      addToCart({
                        id: 501,
                        title: 'Super Delicious Burger',
                        price: 22.00,
                        imageUrl: '/assets/banners/tri-super-delicious.png',
                      })
                    }
                    className="mt-2.5 bg-black hover:bg-[#222] text-white text-[10px] font-bold tracking-[0.18em] px-5 py-2 rounded-full uppercase shadow transition-all transform active:scale-95"
                  >
                    ORDER NOW
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Tile: Delicious Cheese Pizza */}
            <div className="relative w-full h-[220px] sm:h-[235px] rounded-sm overflow-hidden group shadow-sm">
              <Image
                src="/assets/banners/tri-delicious-pizza.png"
                alt="Delicious Cheese Pizza"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="bg-white/80 backdrop-blur-md px-6 py-4 rounded-sm flex flex-col items-center text-center shadow-lg border border-white/60 max-w-[260px] w-full">
                  <h3 className="font-heading text-sm sm:text-base font-extrabold text-black tracking-wider uppercase">
                    DELICIOUS CHEESE PIZZA
                  </h3>
                  <button
                    onClick={() =>
                      addToCart({
                        id: 502,
                        title: 'Delicious Cheese Pizza',
                        price: 25.00,
                        imageUrl: '/assets/banners/tri-delicious-pizza.png',
                      })
                    }
                    className="mt-2.5 bg-black hover:bg-[#222] text-white text-[10px] font-bold tracking-[0.18em] px-5 py-2 rounded-full uppercase shadow transition-all transform active:scale-95"
                  >
                    ORDER NOW
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Tall Feature Tile */}
          <div className="relative w-full h-[320px] sm:h-[485px] rounded-sm overflow-hidden group shadow-sm">
            <Image
              src="/assets/banners/tri-special-dish.png"
              alt="Today's Special Dish"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="bg-white/80 backdrop-blur-md px-8 py-5 rounded-sm flex flex-col items-center text-center shadow-lg border border-white/60 max-w-[280px] w-full">
                <h3 className="font-heading text-base sm:text-lg font-extrabold text-black tracking-wider uppercase">
                  TODAY&apos;S SPECIAL DISH
                </h3>
                <button
                  onClick={() =>
                    addToCart({
                      id: 503,
                      title: "Today's Special Flame Grill Patty",
                      price: 29.00,
                      imageUrl: '/assets/banners/tri-special-dish.png',
                    })
                  }
                  className="mt-3 bg-black hover:bg-[#222] text-white text-[10px] font-bold tracking-[0.18em] px-6 py-2.5 rounded-full uppercase shadow transition-all transform active:scale-95"
                >
                  ORDER NOW
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
