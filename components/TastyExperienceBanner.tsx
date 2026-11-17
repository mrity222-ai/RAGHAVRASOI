'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useOptionalStorefrontCart } from '@/context/StorefrontCartContext';

interface TastyExperienceBannerProps {
  className?: string;
  onBrowseMenuClick?: () => void;
  onReserveTableClick?: () => void;
}

export default function TastyExperienceBanner({
  className = '',
  onBrowseMenuClick,
  onReserveTableClick,
}: TastyExperienceBannerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const storefrontCart = useOptionalStorefrontCart();

  const handleReserveTable = () => {
    if (onReserveTableClick) {
      onReserveTableClick();
      return;
    }

    if (storefrontCart) {
      storefrontCart.setOrderType('IN_TABLE');
      storefrontCart.setIsCartOpen(true);
    } else {
      router.push('/menu?mode=table');
    }
  };

  const handleBrowseMenu = () => {
    if (onBrowseMenuClick) {
      onBrowseMenuClick();
      return;
    }

    if (pathname === '/menu') {
      const catalogEl = document.getElementById('menu-catalog');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    router.push('/menu#menu-catalog');
  };

  return (
    <section className={`w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 ${className}`}>
      <div className="relative rounded-3xl sm:rounded-[32px] overflow-hidden min-h-[380px] sm:min-h-[460px] lg:min-h-[480px] flex items-center justify-center text-center shadow-2xl border border-black/10 select-none">
        
        {/* Background Dining Atmosphere Image */}
        <Image
          src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=2000&q=85"
          alt="Enjoy A Tasty Experience at Foodly Kitchen"
          fill
          priority
          className="object-cover object-center filter brightness-[0.9]"
        />

        {/* Cinematic Translucent Dark Overlay matching Screenshot */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/60 to-black/55 backdrop-blur-[0.3px]" />

        {/* Center Content Box */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-8 py-10 flex flex-col items-center justify-center">
          
          {/* Orange WELCOME Tag */}
          <span className="text-[#EA580C] font-black text-xs sm:text-[13px] tracking-[0.24em] uppercase mb-1 drop-shadow-sm">
            WELCOME
          </span>

          {/* Elegant Serif Headline matching Screenshot */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-[54px] font-normal sm:font-medium text-white tracking-tight leading-tight mt-1 drop-shadow-md">
            Enjoy A Tasty Experience
          </h1>

          {/* Subtitle Description */}
          <p className="text-white/85 text-xs sm:text-sm lg:text-[14.5px] max-w-2xl mx-auto leading-relaxed mt-3 sm:mt-4 font-normal px-2">
            Enjoy a rich variety of dishes and aromatic coffee, selection of juices, aromatic teas and delicious desserts made by our Pastry Chef.
          </p>

          {/* Two Action Buttons (Side by Side) */}
          <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full sm:w-auto">
            
            {/* 1. RESERVE A TABLE (Orange Pill) */}
            <button
              type="button"
              onClick={handleReserveTable}
              className="w-full sm:w-auto inline-flex items-center justify-center bg-[#EA580C] hover:bg-[#C2410C] text-white font-black text-xs sm:text-[13px] tracking-[0.14em] uppercase px-8 sm:px-9 py-3.5 sm:py-4 rounded-full shadow-lg hover:shadow-orange-500/25 active:scale-95 transition-all"
            >
              RESERVE A TABLE
            </button>

            {/* 2. BROWSE MENU (Dark Glass Outline Pill) */}
            <button
              type="button"
              onClick={handleBrowseMenu}
              className="w-full sm:w-auto inline-flex items-center justify-center bg-black/40 hover:bg-white/10 border border-white/60 hover:border-white text-white font-black text-xs sm:text-[13px] tracking-[0.14em] uppercase px-8 sm:px-9 py-3.5 sm:py-4 rounded-full backdrop-blur-md shadow-lg active:scale-95 transition-all"
            >
              BROWSE MENU
            </button>
            
          </div>

        </div>

      </div>
    </section>
  );
}
