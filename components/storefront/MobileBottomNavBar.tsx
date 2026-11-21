'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, UtensilsCrossed, ShoppingBag, Receipt, User } from 'lucide-react';
import { useOptionalStorefrontCart } from '@/context/StorefrontCartContext';
import { useCart } from '@/context/CartContext';
import { useCustomerAuth } from '@/context/CustomerAuthContext';

export default function MobileBottomNavBar() {
  const pathname = usePathname();
  const storefrontCart = useOptionalStorefrontCart();
  const defaultCart = useCart();
  const { isLoggedIn, user } = useCustomerAuth();

  // Hide on admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const totalCount = storefrontCart
    ? storefrontCart.cart.reduce((sum, item) => sum + item.qty, 0)
    : defaultCart.totalCount;

  const handleOpenCart = () => {
    if (storefrontCart) {
      storefrontCart.setIsCartOpen(true);
    } else {
      defaultCart.setIsCartOpen(true);
    }
  };

  const handleOpenOrders = () => {
    if (storefrontCart && storefrontCart.activeTrackingToken) {
      storefrontCart.setIsTrackingOpen(true);
    } else {
      window.location.href = '/track';
    }
  };

  const isHome = pathname === '/';
  const isMenu = pathname === '/menu';

  return (
    <div className="fixed bottom-4 left-3 right-3 sm:left-6 sm:right-6 z-40 lg:hidden max-w-md mx-auto">
      <nav className="bg-white/95 backdrop-blur-md rounded-full px-3 py-2 border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.15)] flex items-center justify-between text-xs font-bold">
        
        {/* 1. Home Button matching Screen 1 Active Pill */}
        <Link
          href="/"
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full transition-all ${
            isHome
              ? 'bg-[#15803d] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Home size={16} />
          {isHome && <span className="text-[11px] font-black uppercase tracking-wider">Home</span>}
        </Link>

        {/* 2. Menu Button */}
        <Link
          href="/menu"
          className={`flex items-center gap-1.5 px-3 py-2 rounded-full transition-all ${
            isMenu
              ? 'bg-[#15803d] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UtensilsCrossed size={16} />
          {isMenu && <span className="text-[11px] font-black uppercase tracking-wider">Menu</span>}
        </Link>

        {/* 3. Cart Button with Live Badge */}
        <button
          onClick={handleOpenCart}
          className="relative p-2.5 rounded-full text-slate-700 hover:text-black transition-colors"
          aria-label="Open Cart"
        >
          <ShoppingBag size={18} />
          {totalCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#FBBF24] text-slate-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
              {totalCount}
            </span>
          )}
        </button>

        {/* 4. Orders / Tracking Button */}
        <button
          onClick={handleOpenOrders}
          className="p-2.5 rounded-full text-slate-700 hover:text-black transition-colors"
          aria-label="Track Orders"
          title="Track Orders"
        >
          <Receipt size={18} />
        </button>

        {/* 5. User Profile Button */}
        <Link
          href={isLoggedIn ? '/menu' : '/login'}
          className="p-2 rounded-full text-slate-700 hover:text-black transition-colors flex items-center justify-center"
          title={isLoggedIn ? user?.name : 'Customer Login'}
        >
          {isLoggedIn && user ? (
            <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] flex items-center justify-center ring-1 ring-amber-300">
              {user.name.charAt(0).toUpperCase()}
            </div>
          ) : (
            <User size={18} />
          )}
        </Link>

      </nav>
    </div>
  );
}
