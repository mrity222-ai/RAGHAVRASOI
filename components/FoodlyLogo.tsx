'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface FoodlyLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  showText?: boolean;
}

export default function FoodlyLogo({
  className = '',
  size = 'md',
  href = '/',
  showText = true,
}: FoodlyLogoProps) {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  // Dimension configurations
  const imageDims = isSm
    ? { h: 'h-10 sm:h-11', w: 'w-9 sm:w-10' }
    : isLg
    ? { h: 'h-16 sm:h-20', w: 'w-14 sm:w-16' }
    : { h: 'h-12 sm:h-14', w: 'w-10 sm:w-12' };

  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none group ${className}`}>
      {/* 1. Authentic Raghav Rasoi Emblem */}
      <div
        className={`relative ${imageDims.h} ${imageDims.w} flex-shrink-0 transition-transform duration-300 group-hover:scale-105 active:scale-95`}
      >
        <Image
          src="/assets/logo/raghav-rasoi-logo-transparent.png"
          alt="राघव रसोई - Taste of Tradition"
          fill
          unoptimized
          sizes="(max-width: 640px) 44px, 56px"
          className="object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.06)]"
          priority
        />
      </div>

      {/* 2. Brand Typography Lockup */}
      {showText && (
        <div className="flex flex-col text-left leading-none justify-center">
          <span
            className={`font-serif font-black text-[#A81B1B] tracking-tight transition-colors group-hover:text-[#8B1212] ${
              isSm
                ? 'text-lg'
                : isLg
                ? 'text-2xl sm:text-3xl'
                : 'text-xl sm:text-[23px]'
            }`}
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            राघव रसोई
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-4 h-[2px] bg-[#EA580C] rounded-full inline-block" />
            <span
              className={`font-bold tracking-[0.16em] text-[#C2410C] uppercase font-sans ${
                isSm ? 'text-[8.5px]' : 'text-[9.5px] sm:text-[10px]'
              }`}
            >
              Taste of Tradition
            </span>
          </div>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        aria-label="राघव रसोई - Taste of Tradition Homepage"
        className="inline-block focus:outline-hidden"
      >
        {content}
      </Link>
    );
  }

  return content;
}
