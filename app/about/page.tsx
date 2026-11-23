'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ItemCustomizeModal from '@/components/storefront/ItemCustomizeModal';
import StoreCartDrawer from '@/components/storefront/StoreCartDrawer';
import LiveTokenTrackerModal from '@/components/storefront/LiveTokenTrackerModal';
import ScrollToTop from '@/components/ScrollToTop';

/* Realistic Torn Paper Edge Separator */
function TornPaperDivider({
  color = '#F7EFE1',
  flip = false,
}: {
  color?: string;
  flip?: boolean;
}) {
  return (
    <div
      className={`w-full overflow-hidden leading-none select-none pointer-events-none relative z-20 ${
        flip ? 'rotate-180 -mt-1' : '-mb-1'
      }`}
    >
      <svg
        viewBox="0 0 1440 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-6 sm:h-9"
        preserveAspectRatio="none"
      >
        <path
          d="M0 40H1440V16L1418 24L1390 12L1365 22L1338 14L1310 25L1282 17L1254 26L1224 15L1192 25L1164 16L1134 24L1106 17L1076 25L1044 15L1016 24L984 14L956 23L926 17L896 25L868 15L838 24L808 15L778 24L748 16L718 25L686 16L656 24L624 15L594 24L564 16L534 25L504 16L474 25L444 15L414 24L384 16L354 25L324 17L294 25L264 15L234 24L204 16L174 25L144 17L114 26L84 16L54 25L24 15L0 22V40Z"
          fill={color}
        />
      </svg>
    </div>
  );
}

export default function AboutPage() {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setCategories(data.data);
        }
      })
      .catch((err) => console.log('Categories fetch fallback', err));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-slate-800">
      {/* Universal Foodly Header */}
      <Header />

      <main className="flex-1">
        {/* ============================================================ */}
        {/* SECTION 1: HERO - "Taste of Tradition" (English Re-branded)  */}
        {/* ============================================================ */}
        <section className="relative w-full min-h-[580px] sm:min-h-[660px] lg:min-h-[720px] bg-black text-white flex flex-col justify-between overflow-hidden">
          {/* Rich Culinary Feast Background Photo */}
          <Image
            src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=2000&q=85"
            alt="Authentic Indian Cuisine Feast at Raghav Rasoi"
            fill
            priority
            className="object-cover object-center filter brightness-[0.7] contrast-[1.05]"
          />

          {/* Moody Warm Ambient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/45 to-black/90" />

          {/* Top Brand Logo / Tag */}
          <div className="relative z-10 pt-10 sm:pt-14 text-center">
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.35em] text-[#E0CEB5] uppercase block">
              RAGHAV RASOI
            </span>
          </div>

          {/* Center Main Headline Box */}
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center my-auto flex flex-col items-center">
            {/* "Taste of" in yellow cursive script font */}
            <span
              className="text-[#FBBF24] text-3xl sm:text-5xl lg:text-6xl font-serif italic tracking-wide -mb-3 sm:-mb-5 select-none drop-shadow-md"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Taste of
            </span>

            {/* "Tradition" in large crisp white serif */}
            <h1 className="font-serif text-6xl sm:text-8xl lg:text-[110px] font-bold text-white tracking-tight leading-none drop-shadow-2xl">
              Tradition
            </h1>

            {/* Subtitle */}
            <p className="text-white/90 text-xs sm:text-sm lg:text-base font-normal max-w-lg mx-auto mt-4 sm:mt-6 leading-relaxed drop-shadow">
              Pure flavors, authentic spices, thoughtful homestyle cooking, and warm hospitality. Located in Gunderdehi Town Rd, Gundardehi, Chainganj, Chhattisgarh 491223.
            </p>

            {/* 3 Circular Action Buttons */}
            <div className="pt-8 sm:pt-10 flex items-center justify-center gap-4 sm:gap-6 relative">
              {/* 1. VIEW MENU (Amber Solid Circle) */}
              <Link
                href="/menu"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#E5933A] hover:bg-[#D68128] text-slate-950 font-black text-[11px] sm:text-xs tracking-wider flex items-center justify-center text-center uppercase leading-tight shadow-2xl hover:scale-105 active:scale-95 transition-all"
              >
                VIEW<br />MENU
              </Link>

              {/* 2. FIND US (Outline Circle) */}
              <a
                href="#opening-hours"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-white/80 bg-black/40 backdrop-blur-sm hover:bg-white/20 text-white font-black text-[11px] sm:text-xs tracking-wider flex items-center justify-center text-center uppercase leading-tight shadow-2xl hover:scale-105 active:scale-95 transition-all"
              >
                FIND<br />US
              </a>

              {/* 3. BOOK A TABLE (Rust Red Solid Circle) with Handwritten Doodle */}
              <div className="relative">
                <Link
                  href="/contact#reservation-form"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#9E4029] hover:bg-[#873420] text-white font-black text-[11px] sm:text-xs tracking-wider flex items-center justify-center text-center uppercase leading-tight shadow-2xl hover:scale-105 active:scale-95 transition-all"
                >
                  BOOK<br />TABLE
                </Link>

                {/* Hand-drawn yellow doodle arrow with "book here" */}
                <div className="absolute -top-6 -right-16 sm:-right-20 hidden sm:flex items-center gap-1 text-[#FBBF24] font-serif italic text-sm pointer-events-none select-none">
                  <span className="text-base">⤶</span>
                  <span>book here</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Paper Tear Transition */}
          <div className="relative z-10 w-full">
            <TornPaperDivider color="#F7EFE1" />
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 2: "Atithi Devo Bhava - Guest is God" (Cream Section)*/}
        {/* ============================================================ */}
        <section className="w-full bg-[#F7EFE1] py-14 sm:py-20 relative overflow-hidden">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              
              {/* Left Column: Traditional Story & Philosophy */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-serif italic text-[#A24A32] text-xl sm:text-2xl font-bold">
                      Atithi Devo Bhava
                    </span>
                    {/* Small Mandala Motif */}
                    <span className="text-[#A24A32] text-lg select-none">☸</span>
                  </div>
                  <h2 className="font-serif text-3xl sm:text-5xl lg:text-[52px] font-bold text-slate-900 tracking-tight leading-tight mt-1">
                    Guest is God
                  </h2>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed max-w-xl font-normal">
                  <p>
                    Welcome to <strong>Raghav Rasoi</strong>, where authentic culinary tradition and heartfelt Indian hospitality unite. Our kitchen is an ode to generations of heirloom recipes, fragrant tandoori marinades, rich desi ghee gravies, and comforting daily meals.
                  </p>
                  <p>
                    Sharing food is at the heart of our culture. Every single meal is prepared fresh with pure ingredients, hand-pounded spices, and the unconditional warmth of home. At Raghav Rasoi, every guest is treated like family.
                  </p>
                </div>

                {/* 6 Feature Badges with Terracotta Dots */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2.5 pt-2 text-[11px] sm:text-xs font-black tracking-wider text-slate-900 uppercase">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#A24A32]" />
                    <span>FRESH INGREDIENTS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#A24A32]" />
                    <span>EXPERT MASTER CHEFS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#A24A32]" />
                    <span>100% PURE VEG OPTIONS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#A24A32]" />
                    <span>AUTHENTIC RECIPES</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#A24A32]" />
                    <span>CATERING & PARTIES</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#A24A32]" />
                    <span>FAST HOME DELIVERY</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Signature Curry Pan with Google Review Badge */}
              <div className="lg:col-span-5 relative flex items-center justify-center">
                <div className="relative w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] rounded-full overflow-hidden shadow-2xl border-4 border-white/60">
                  <Image
                    src="https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=85"
                    alt="Authentic Curry Kadai at Raghav Rasoi"
                    fill
                    className="object-cover object-center"
                  />
                </div>

                {/* Yellow Google Review Stamp Badge */}
                <div className="absolute -bottom-4 left-4 sm:left-8 bg-[#E5933A] text-slate-950 w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center text-center shadow-xl p-2 select-none border-2 border-white/40">
                  <span className="text-amber-950 text-xs sm:text-sm font-black tracking-widest">
                    ★★★★★
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider leading-tight mt-1">
                    TOP REVIEWS
                  </span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 3: "Our Signature Dishes" (English & INR)            */}
        {/* ============================================================ */}
        <section className="w-full bg-[#181818] text-white py-16 sm:py-24 relative overflow-hidden">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header with Title and Scroll Doodles */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-14 gap-4">
              <div>
                <span
                  className="text-[#FBBF24] text-2xl sm:text-3xl font-serif italic block -mb-1"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  our
                </span>
                <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
                  Signature Dishes
                </h2>
              </div>

              {/* Doodles and Navigation Arrows */}
              <div className="flex items-center gap-3">
                <span className="text-[#FBBF24] font-serif italic text-sm select-none hidden sm:inline-block">
                  scroll for more ⤳
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="w-10 h-10 rounded-full border border-white/30 hover:border-white text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                    aria-label="Previous dishes"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    className="w-10 h-10 rounded-full border border-white/30 hover:border-white text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                    aria-label="Next dishes"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>

            {/* 3 Arched / Dome Window Cards with INR Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              
              {/* Card 1: Paneer Butter Masala */}
              <div className="flex flex-col space-y-3 group">
                <div className="relative aspect-[4/5] w-full rounded-t-[100px] sm:rounded-t-[120px] rounded-b-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-xl">
                  <Image
                    src="https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=85"
                    alt="Paneer Butter Masala"
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex items-baseline justify-between pt-1">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white tracking-tight">
                    Paneer Butter Masala
                  </h3>
                  <span className="font-black text-sm sm:text-base text-[#E5933A] ml-2 shrink-0">
                    ₹260
                  </span>
                </div>
                <p className="text-xs sm:text-[13px] text-slate-400 font-normal leading-relaxed">
                  Rich, velvety cashew tomato gravy simmered with fresh cottage cheese and butter.
                </p>
              </div>

              {/* Card 2: Palak Paneer Special */}
              <div className="flex flex-col space-y-3 group">
                <div className="relative aspect-[4/5] w-full rounded-t-[100px] sm:rounded-t-[120px] rounded-b-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-xl">
                  <Image
                    src="https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=85"
                    alt="Palak Paneer Special"
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex items-baseline justify-between pt-1">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white tracking-tight">
                    Palak Paneer Special
                  </h3>
                  <span className="font-black text-sm sm:text-base text-[#E5933A] ml-2 shrink-0">
                    ₹220
                  </span>
                </div>
                <p className="text-xs sm:text-[13px] text-slate-400 font-normal leading-relaxed">
                  Farm-fresh spinach puree tempered with roasted garlic, cumin, paneer and cream.
                </p>
              </div>

              {/* Card 3: Tandoori Soya Chaap & Starters */}
              <div className="flex flex-col space-y-3 group">
                <div className="relative aspect-[4/5] w-full rounded-t-[100px] sm:rounded-t-[120px] rounded-b-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-xl">
                  <Image
                    src="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=85"
                    alt="Tandoori Soya Chaap"
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex items-baseline justify-between pt-1">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white tracking-tight">
                    Tandoori Soya Chaap
                  </h3>
                  <span className="font-black text-sm sm:text-base text-[#E5933A] ml-2 shrink-0">
                    ₹180
                  </span>
                </div>
                <p className="text-xs sm:text-[13px] text-slate-400 font-normal leading-relaxed">
                  Char-grilled in clay tandoor with spiced hung curd marinade and mint chutney.
                </p>
              </div>

            </div>

            {/* Bottom Row: CTA Button + Category Tags Strip */}
            <div className="pt-12 sm:pt-16 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-t border-white/10 mt-12">
              <Link
                href="/menu"
                className="inline-flex items-center justify-center gap-2 bg-[#E5933A] hover:bg-[#D68128] text-slate-950 font-black text-xs sm:text-[13px] tracking-wider uppercase px-7 sm:px-8 py-3.5 sm:py-4 rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all select-none self-start"
              >
                <span>EXPLORE COMPLETE MENU</span>
                <span>➔</span>
              </Link>

              {/* Dynamic Categories from Database / Admin */}
              <div className="flex flex-wrap gap-2 text-[10px] sm:text-[11px] font-bold tracking-[0.16em] text-slate-400 uppercase leading-relaxed max-w-2xl">
                {categories.length > 0 ? (
                  categories.map((c, i) => (
                    <span key={c.id}>
                      {c.name} {i < categories.length - 1 ? '•' : ''}
                    </span>
                  ))
                ) : (
                  <span>
                    MAIN COURSE • THALIS • TANDOORI BREADS • STARTERS • BIRYANI • CHINESE • SOUTH INDIAN • BEVERAGES
                  </span>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 4: "Daily Special Thali" & "Open Every Day" (INR)     */}
        {/* ============================================================ */}
        <section
          id="opening-hours"
          className="w-full bg-[#A2442B] text-white py-16 sm:py-24 relative overflow-hidden"
        >
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            
            {/* Top Sub-Section: Daily Special Thali */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Left Column: Thali details */}
              <div className="lg:col-span-7 space-y-4">
                <div>
                  <span
                    className="text-[#FDE68A] text-2xl sm:text-3xl font-serif italic block -mb-2"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    daily
                  </span>
                  <h2 className="font-serif text-5xl sm:text-7xl font-bold text-white tracking-tight leading-none">
                    Special Thali
                  </h2>
                </div>

                <p className="text-[#FDE68A] font-extrabold text-sm sm:text-base tracking-widest uppercase">
                  EVERYDAY 12:00 PM – 04:00 PM
                </p>

                <p className="text-white text-xs sm:text-sm font-medium leading-relaxed max-w-xl">
                  Choose your favorite two curries for just ₹140. Includes steamed basmati rice, 3 fresh butter rotis, dal tadka, salad, mixed pickle, and roasted papad.
                </p>

                {/* Dish Choices Pill Chips */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {[
                    'Paneer Butter Masala',
                    'Dal Makhani',
                    'Shahi Paneer',
                    'Mix Vegetable',
                    'Dal Tadka',
                    'Chole Masala',
                  ].map((dish) => (
                    <span
                      key={dish}
                      className="px-3.5 py-1.5 rounded-full bg-black/30 border border-white/20 text-white text-xs font-semibold shadow-xs"
                    >
                      {dish}
                    </span>
                  ))}
                </div>

                <p className="text-white/80 text-[11px] sm:text-xs leading-relaxed max-w-xl pt-2">
                  Cooked fresh daily with pure desi spices and fresh ingredients. Homestyle comfort food that satisfies every craving.
                </p>
              </div>

              {/* Right Column: Handi Pan with "DAILY THALI ₹140" Seal Badge */}
              <div className="lg:col-span-5 relative flex items-center justify-center">
                <div className="relative w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] rounded-full overflow-hidden shadow-2xl border-4 border-white/40">
                  <Image
                    src="https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=85"
                    alt="Special Thali at Raghav Rasoi"
                    fill
                    className="object-cover object-center"
                  />
                </div>

                {/* Circular Golden Stamp Badge */}
                <div className="absolute -top-3 left-4 sm:left-10 bg-[#E5933A] text-slate-950 w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center text-center shadow-2xl border-2 border-white/60 p-2 select-none">
                  <span className="text-[8.5px] font-black uppercase tracking-wider leading-none text-slate-900">
                    DAILY THALI • LUNCH
                  </span>
                  <span className="font-serif font-black text-xl sm:text-2xl text-slate-950 leading-tight mt-0.5">
                    ₹140
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-900">
                    ONLY
                  </span>
                </div>
              </div>

            </div>

            {/* Bottom Sub-Section: Open Every Day (Opening Hours) */}
            <div className="space-y-6 pt-4">
              <h3 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Open Every Day
              </h3>

              {/* Opening Hours Dark Charcoal Container */}
              <div className="rounded-2xl sm:rounded-3xl bg-[#141414] border border-white/10 px-6 sm:px-12 py-8 sm:py-10 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/15 gap-6 md:gap-0">
                  
                  {/* Column 1: MON-THU */}
                  <div className="text-center md:px-6">
                    <p className="text-[#FBBF24] font-extrabold text-xs sm:text-sm tracking-widest uppercase">
                      MON – THU
                    </p>
                    <p className="font-serif text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight mt-2">
                      10:00 AM – 10:00 PM
                    </p>
                  </div>

                  {/* Column 2: FRI-SUN */}
                  <div className="text-center md:px-6 pt-6 md:pt-0">
                    <p className="text-[#FBBF24] font-extrabold text-xs sm:text-sm tracking-widest uppercase">
                      FRI – SUN <span className="text-white/70 italic lowercase font-serif font-normal">(Today)</span>
                    </p>
                    <p className="font-serif text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight mt-2">
                      10:00 AM – 11:00 PM
                    </p>
                  </div>

                  {/* Column 3: LUNCH HOURS */}
                  <div className="text-center md:px-6 pt-6 md:pt-0">
                    <p className="text-[#FBBF24] font-extrabold text-xs sm:text-sm tracking-widest uppercase">
                      LUNCH HOURS
                    </p>
                    <p className="font-serif text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight mt-2">
                      12:00 PM – 04:00 PM
                    </p>
                  </div>

                </div>
              </div>
            </div>

          </div>

          {/* Bottom Torn Paper Transition to Footer */}
          <div className="relative z-10 w-full mt-14 sm:mt-20">
            <TornPaperDivider color="#FAF7F2" />
          </div>
        </section>

      </main>

      {/* Global Modals & Storefront Cart */}
      <ItemCustomizeModal />
      <StoreCartDrawer />
      <LiveTokenTrackerModal />
      <ScrollToTop />

      {/* Universal Foodly Footer */}
      <Footer />
    </div>
  );
}
