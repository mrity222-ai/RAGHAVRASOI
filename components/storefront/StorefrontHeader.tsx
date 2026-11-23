'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Utensils, Search, Receipt, User, ShoppingBag, Shield, Clock } from 'lucide-react';
import { useStorefrontCart } from '@/context/StorefrontCartContext';

interface StorefrontHeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export default function StorefrontHeader({ searchQuery, setSearchQuery }: StorefrontHeaderProps) {
  const {
    settings,
    cart,
    setIsCartOpen,
    setIsTrackingOpen,
    setIsAccountOpen,
    activeTrackingToken,
    loggedInMember,
  } = useStorefrontCart();

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
        
        {/* Logo & Store Status */}
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="relative w-10 h-11 shrink-0">
              <Image
                src="/assets/logo/raghav-rasoi-logo-transparent.png"
                alt="राघव रसोई"
                fill
                sizes="44px"
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="font-serif font-black text-slate-900 text-base sm:text-lg tracking-tight leading-none" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                राघव रसोई
              </h1>
              <div className="mt-1 flex items-center gap-1.5">
                {settings.isOpen ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    OPEN • Self-Pickup in {settings.prepTimeMins} mins
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#E5203A] bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E5203A]" />
                    CURRENTLY CLOSED
                  </span>
                )}
              </div>
            </div>
          </Link>
        </div>

        {/* Global Live Search Bar */}
        <div className="order-3 md:order-2 w-full md:w-80 lg:w-96 relative">
          <Search size={14} className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dishes, burgers, noodles, dosa..."
            className="w-full pl-9 pr-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-[#E5203A] focus:ring-2 focus:ring-[#E5203A]/15 transition-all"
          />
        </div>

        {/* Actions (Track, Account, Cart, Admin Switcher) */}
        <div className="order-2 md:order-3 flex items-center gap-2 sm:gap-3">
          
          {/* Back to Landing Page Link */}
          <Link
            href="/"
            className="hidden lg:inline-flex text-xs font-bold text-slate-600 hover:text-[#E5203A] transition-colors mr-1"
          >
            Ranel Home
          </Link>

          {/* Track Order Live Token */}
          <button
            onClick={() => setIsTrackingOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-[#0F766E] font-extrabold text-xs transition-all"
          >
            {activeTrackingToken ? (
              <>
                <span className="w-2 h-2 rounded-full bg-[#0F766E] animate-ping" />
                <Receipt size={14} />
                <span>Track #{activeTrackingToken}</span>
              </>
            ) : (
              <>
                <Receipt size={14} />
                <span>Track Order</span>
              </>
            )}
          </button>

          {/* Member Login / Account */}
          <button
            onClick={() => setIsAccountOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
          >
            <User size={14} className="text-[#E5203A]" />
            <span>{loggedInMember ? loggedInMember.name.split(' ')[0] : 'Login'}</span>
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#E5203A] hover:bg-[#C8172E] text-white font-extrabold text-xs shadow-sm transition-all active:scale-95"
          >
            <ShoppingBag size={14} />
            <span className="hidden sm:inline">Cart</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white text-[#E5203A] font-mono font-black text-[11px]">
              {totalQty}
            </span>
          </button>

          {/* Admin Portal Shortcut */}
          <Link
            href="/admin"
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-sm transition-all"
            title="Go to Admin & Staff Console"
          >
            <Shield size={13} className="text-teal-400" />
            <span className="hidden sm:inline">Admin</span>
          </Link>

        </div>
      </div>

      {/* Closed store alert strip */}
      {!settings.isOpen && (
        <div className="bg-rose-50 border-t border-rose-200 px-4 py-2 text-center text-xs font-bold text-[#E5203A]">
          <Clock size={13} className="inline mr-1" />
          Store is currently closed for online pickup orders. You can browse the full menu and check offers!
        </div>
      )}
    </header>
  );
}
