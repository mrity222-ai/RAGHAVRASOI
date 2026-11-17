'use client';

import React from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

export default function PromoTrio() {
  const { addToCart } = useCart();

  const banners = [
    {
      id: 301,
      image: '/assets/banners/promo-wrap.png',
      price: 20.00,
      title: 'FAST FOOD MEALS',
      alt: 'Fast Food Meals Wrap',
    },
    {
      id: 302,
      image: '/assets/banners/promo-pizza.png',
      price: 20.00,
      title: 'CHEESE PIZZA',
      alt: 'Cheese Pizza Splash',
    },
    {
      id: 303,
      image: '/assets/banners/promo-chicken.png',
      price: 20.00,
      title: 'FRIED CHICKEN',
      alt: 'Crispy Fried Chicken',
    },
  ];

  return (
    <section className="w-full bg-white py-4 border-b border-[#E8E2D5]">
      <div className="max-w-[1440px] mx-auto px-2 sm:px-4 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {banners.map((item) => (
            <div
              key={item.id}
              className="relative w-full h-[240px] sm:h-[280px] lg:h-[300px] overflow-hidden rounded-sm group cursor-pointer shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Background & Food Visual from screenshot 4 */}
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />

              {/* Overlay with order action */}
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors flex flex-col justify-end p-6">
                <button
                  onClick={() =>
                    addToCart({
                      id: item.id,
                      title: item.title,
                      price: item.price,
                      imageUrl: item.image,
                    })
                  }
                  className="w-fit bg-white hover:bg-[#F2ECE1] text-black text-[11px] font-bold tracking-[0.16em] px-6 py-2.5 rounded-full uppercase shadow-md transition-transform transform active:scale-95"
                >
                  ORDER NOW
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
