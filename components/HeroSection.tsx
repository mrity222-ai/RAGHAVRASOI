'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, ArrowUpRight, X } from 'lucide-react';

export default function HeroSection() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <section className="relative w-full bg-[#FAF9F5] overflow-hidden py-10 sm:py-14 lg:py-16 px-4 sm:px-6 lg:px-12 xl:px-16 border-b border-stone-200/50">
      
      {/* Ambient background glow / subtle warm tone */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-25 mix-blend-multiply bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/seasonal-hero/hero-ambient-bg.jpg')" }}
      />
      
      {/* Main Container */}
      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
          
          {/* ======================================================== */}
          {/* 1. LEFT COLUMN: Tagline, Headline, Video Dish, Narrative */}
          {/* ======================================================== */}
          <div className="lg:col-span-4 flex flex-col justify-center z-10">
            
            {/* Main Headline */}
            <h1 className="normal-case font-playfair font-normal text-stone-900 tracking-tight leading-[1.08] text-4xl sm:text-5xl lg:text-[54px] xl:text-[62px] mb-6 sm:mb-8">
              Good food.<br />
              Rooted in<br />
              tradition.
            </h1>

            {/* Video Dish Card with Play Button */}
            <div 
              onClick={() => setIsVideoModalOpen(true)}
              className="relative w-full max-w-[280px] sm:max-w-[310px] aspect-[16/10] rounded-2xl overflow-hidden shadow-md border border-stone-200/80 bg-stone-100 group cursor-pointer"
            >
              <Image
                src="/assets/seasonal-hero/raghav-kitchen-specials.png"
                alt="Raghav Rasoi Indo-Chinese and snack specialties"
                fill
                sizes="(max-width: 640px) 280px, 310px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />
              
              {/* Subtle gradient vignette */}
              <div className="absolute inset-0 bg-black/15 group-hover:bg-black/25 transition-colors" />

              {/* Translucent Center Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-md flex items-center justify-center text-stone-800 shadow-md transition-transform duration-300 group-hover:scale-110">
                  <Play className="w-4 h-4 fill-stone-800 text-stone-800 ml-0.5" />
                </div>
              </div>
            </div>

            {/* Indian Kitchen Narrative */}
            <p className="text-xs sm:text-[13px] text-stone-600 font-sans leading-relaxed max-w-[280px] sm:max-w-[310px] mt-4 font-normal">
              A celebration of authentic recipes, heirloom spices, and genuine Indian hospitality from our family to yours.
            </p>
          </div>

          {/* ======================================================== */}
          {/* 2. CENTER COLUMN: Rotating Authentic Indian Thali & Badge */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 flex items-center justify-center relative py-3 sm:py-6 lg:py-0">
            <div className="relative w-[240px] h-[240px] sm:w-[340px] sm:h-[340px] lg:w-[420px] lg:h-[420px] xl:w-[470px] xl:h-[470px] flex items-center justify-center">
              
              {/* Continuous 360 Rotating Indian Thali */}
              <div className="relative w-full h-full drop-shadow-[0_20px_45px_rgba(0,0,0,0.18)] animate-[spin_50s_linear_infinite] will-change-transform">
                <Image
                  src="/assets/seasonal-hero/raghav-rotating-thali.png"
                  alt="राघव रसोई प्रामाणिक भारतीय थाली"
                  fill
                  sizes="(max-width: 640px) 240px, (max-width: 1024px) 340px, 470px"
                  className="object-contain"
                  priority
                />
              </div>

              {/* Floating Dark Green Season Seal Badge (Overlapping Bottom-Left of Plate) */}
              <div className="absolute -bottom-1 -left-1 sm:bottom-4 sm:left-4 lg:bottom-6 lg:left-4 z-20 w-18 h-18 sm:w-22 sm:h-22 lg:w-28 lg:h-28 rounded-full bg-[#18392B] text-white flex flex-col items-center justify-center shadow-xl border-2 sm:border-[3px] border-[#FAF9F5] select-none pointer-events-none">
                {/* 8-ray sun icon */}
                <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-emerald-200/90 mb-0.5 sm:mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" strokeDasharray="1.5 1.5" />
                </svg>
                {/* Text: FRESH FROM THE SEASON */}
                <span className="text-[7.5px] sm:text-[9.5px] font-medium tracking-[0.14em] text-[#E5F0E8] uppercase text-center leading-tight">
                  FRESH FROM<br />THE SEASON
                </span>
              </div>

            </div>
          </div>

          {/* ======================================================== */}
          {/* 3. RIGHT COLUMN: Raghav Deluxe Thali Card, Rating, CTA    */}
          {/* ======================================================== */}
          <div className="lg:col-span-3 flex flex-col items-center lg:items-end justify-between h-full z-10 pt-4 lg:pt-0">
            
            {/* Raghav Deluxe Thali Floating Dish Card */}
            <div className="bg-white rounded-2xl p-3 sm:p-3.5 shadow-xl border border-stone-100 max-w-[240px] sm:max-w-[260px] w-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              {/* Food Photo */}
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 mb-3">
                <Image
                  src="/assets/seasonal-hero/raghav-deluxe-thali.png"
                  alt="Raghav Deluxe Thali Meal Box"
                  fill
                  sizes="260px"
                  className="object-cover"
                />
              </div>

              {/* Dish Meta */}
              <h3 className="normal-case font-sans text-sm sm:text-[15px] font-bold text-stone-900 tracking-normal">
                Raghav Deluxe Thali
              </h3>
              <p className="text-xs text-amber-700 font-semibold mt-0.5">
                Traditional Indian Feast
              </p>
              <p className="text-[11px] text-stone-500 mt-1 leading-snug font-normal">
                Paneer, Dal Makhani, Pulao, Butter Roti &amp; Sweet
              </p>
            </div>

            {/* Rating Section */}
            <div className="mt-8 sm:mt-10 max-w-[240px] sm:max-w-[260px] w-full text-left">
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-semibold text-stone-900 tracking-normal font-sans">
                  Rating
                </span>
                <div className="flex items-center text-amber-500 text-sm tracking-widest">
                  ★★★★★
                </div>
              </div>
              <p className="text-xs text-stone-500 font-normal mt-1">
                Trusted Globally by Our Clients
              </p>
            </div>

            {/* CTA Button: Explore the menu */}
            <div className="mt-5 max-w-[240px] sm:max-w-[260px] w-full">
              <Link
                href="/menu"
                className="inline-flex items-center justify-between w-full bg-white hover:bg-stone-50 border border-stone-300 rounded-full py-2.5 px-5 shadow-sm transition-all group"
              >
                <span className="text-xs sm:text-sm font-medium text-stone-800">
                  Explore the menu
                </span>
                <span className="w-7 h-7 rounded-full bg-[#18392B] text-white flex items-center justify-center text-xs group-hover:scale-105 transition-transform">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>

          </div>

        </div>
      </div>

      {/* Optional Interactive Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
            <h4 className="font-playfair text-xl text-stone-900 normal-case mb-2">
              Behind The Kitchen
            </h4>
            <p className="text-xs text-stone-500 mb-4">
              Watch how our chefs prepare authentic homestyle delicacies with pure ingredients and traditional techniques.
            </p>
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black">
              <Image
                src="/assets/seasonal-hero/side-dish-video.png"
                alt="Kitchen video preview"
                fill
                className="object-cover opacity-80"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-white text-xs bg-black/60 px-4 py-2 rounded-full backdrop-blur-sm">
                  Raghav Rasoi Kitchen Experience
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
