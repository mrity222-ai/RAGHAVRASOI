'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User, ShoppingBag, Menu, X, Receipt, LogOut, ShieldCheck, UserPlus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useOptionalStorefrontCart } from '@/context/StorefrontCartContext';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import FoodlyLogo from '@/components/FoodlyLogo';

interface HeaderProps {
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
}

export default function Header({ searchQuery, setSearchQuery }: HeaderProps) {
  const defaultCart = useCart();
  const storefrontCart = useOptionalStorefrontCart();
  const { user, isLoggedIn, logout } = useCustomerAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Live item count: comes from StorefrontCart if on /menu or product page, else defaultCart
  const totalCount = storefrontCart
    ? storefrontCart.cart.reduce((sum, item) => sum + item.qty, 0)
    : defaultCart.totalCount;

  const handleCartClick = () => {
    if (storefrontCart) {
      storefrontCart.setIsCartOpen(true);
    } else {
      defaultCart.setIsCartOpen(true);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 h-20 flex items-center justify-between">
        
        {/* Left: Brand Logo (Foodly KITECHN) matching Screenshot */}
        <div className="flex-shrink-0">
          <FoodlyLogo size="md" href="/" />
        </div>

        {/* Center: Desktop Navigation Menu matching Screenshot */}
        <nav className="hidden lg:flex items-center space-x-7 xl:space-x-9 text-[15px] font-medium text-slate-500">
          <Link
            href="/"
            className="hover:text-slate-900 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/menu"
            className="text-slate-950 font-bold hover:text-black transition-colors"
          >
            Menu
          </Link>
          <Link
            href="/categories"
            className="hover:text-slate-900 transition-colors"
          >
            Categories
          </Link>
          <Link
            href="/about"
            className="hover:text-slate-900 transition-colors"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="hover:text-slate-900 transition-colors"
          >
            Contact
          </Link>
          <Link
            href="/track"
            className="text-[#B45309] font-bold hover:text-[#92400E] transition-colors"
          >
            Track Order
          </Link>
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-amber-950 bg-amber-100 hover:bg-amber-200 border border-amber-300 transition-all shadow-2xs"
            title="Restaurant Staff & Kitchen Console"
          >
            <ShieldCheck size={13} className="text-[#B45309]" />
            <span>रेस्टोरेंट लॉगिन</span>
          </Link>
        </nav>

        {/* Right: Controls matching Screenshot (Search, User, Cart, Order Now) */}
        <div className="flex items-center space-x-2 sm:space-x-3 text-slate-800">
          {/* Customer Profile / Sign In */}
          {isLoggedIn && user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-slate-900 transition-colors"
                title={`Logged in as ${user.name}`}
              >
                <div className="w-6 h-6 rounded-full bg-[#FBBF24] text-slate-950 font-bold text-xs flex items-center justify-center">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-bold hidden md:inline truncate max-w-[100px]">
                  {user.name.split(' ')[0]}
                </span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="pb-2.5 mb-2 border-b border-slate-100">
                    <p className="text-xs font-black text-slate-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-500 font-mono truncate">{user.phone}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut size={14} />
                    <span>लॉगआउट करें (Sign Out)</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              {/* Desktop Direct Login & Register Options */}
              <div className="hidden md:flex items-center gap-1.5 mr-1">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:text-black hover:bg-slate-100 transition-colors"
                >
                  लॉगिन
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-1.5 rounded-full text-xs font-extrabold text-[#92400E] bg-amber-100 hover:bg-amber-200 border border-amber-300 transition-colors shadow-2xs"
                >
                  खाता बनाएं
                </Link>
              </div>

              {/* Mobile User Icon */}
              <Link
                href="/login"
                className="md:hidden w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-800 hover:text-black transition-colors"
                aria-label="Customer Login"
                title="Customer Login / Register"
              >
                <User size={21} strokeWidth={2.1} />
              </Link>
            </div>
          )}

          {/* Shopping Bag Button with Yellow/Gold Badge */}
          <button
            onClick={handleCartClick}
            className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-800 hover:text-black transition-colors relative"
            aria-label="Shopping Cart"
            title="Open Cart"
          >
            <ShoppingBag size={21} strokeWidth={2.1} />
            <span className="absolute -top-0.5 -right-0.5 bg-[#FBBF24] text-slate-950 font-black text-[11px] min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center shadow-xs">
              {totalCount}
            </span>
          </button>

          {/* Big "Order Now" Amber Pill CTA Button */}
          <Link
            href="/menu"
            className="hidden sm:inline-flex items-center justify-center bg-[#FBBF24] hover:bg-[#F59E0B] text-slate-950 font-extrabold text-[14.5px] px-6 sm:px-7 py-2.5 sm:py-3 rounded-full shadow-xs hover:shadow-md transition-all active:scale-95 ml-1 select-none"
          >
            Order Now
          </Link>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-800 hover:text-black"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 px-6 py-5 flex flex-col space-y-3.5 text-sm font-semibold shadow-lg animate-in slide-in-from-top-3">
          <div className="pb-2 border-b border-slate-100">
            <FoodlyLogo size="sm" href="/" />
          </div>
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 border-b border-slate-100 text-slate-800 hover:text-black"
          >
            Home
          </Link>
          <Link
            href="/menu"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 border-b border-slate-100 text-[#A81B1B] font-extrabold flex items-center justify-between"
          >
            <span>Menu</span>
            <span className="text-[10px] bg-[#FBBF24] text-slate-900 font-black px-2 py-0.5 rounded-full">POPULAR</span>
          </Link>
          <Link
            href="/categories"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 border-b border-slate-100 text-slate-800 hover:text-black"
          >
            Categories
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 border-b border-slate-100 text-slate-800 hover:text-black"
          >
            About
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 border-b border-slate-100 text-slate-800 hover:text-black"
          >
            Contact
          </Link>
          <Link
            href="/track"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 border-b border-slate-100 text-[#B45309] font-black hover:text-[#92400E] flex items-center justify-between"
          >
            <span>Track Order Status</span>
            <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">Live</span>
          </Link>

          {/* Restaurant Login Link for Staff in Mobile Drawer */}
          <Link
            href="/admin/login"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2.5 px-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 font-bold text-xs flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#B45309]" />
              <span>रेस्टोरेंट लॉगिन (Staff & Admin)</span>
            </span>
            <span className="text-[10px] bg-amber-200 px-2 py-0.5 rounded-full font-black text-amber-900">Portal</span>
          </Link>

          {isLoggedIn && user ? (
            <div className="py-2 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-slate-900">👤 {user.name}</p>
                <p className="text-[10px] text-slate-500 font-mono">{user.phone}</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="text-xs font-bold text-rose-600 hover:underline"
              >
                लॉगआउट
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-center font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <User size={14} />
                <span>लॉगिन</span>
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-xl bg-[#FBBF24] hover:bg-[#F59E0B] text-slate-950 text-center font-black text-xs shadow-xs flex items-center justify-center gap-1.5"
              >
                <UserPlus size={14} />
                <span>खाता बनाएं</span>
              </Link>
            </div>
          )}

          {storefrontCart && storefrontCart.activeTrackingToken && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                storefrontCart.setIsTrackingOpen(true);
              }}
              className="py-2 text-left text-[#0F766E] flex items-center gap-2 border-b border-slate-100 font-extrabold"
            >
              <Receipt size={16} />
              <span>Track Live Order #{storefrontCart.activeTrackingToken}</span>
            </button>
          )}

          <div className="pt-2">
            <Link
              href="/menu"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-full bg-[#FBBF24] hover:bg-[#F59E0B] text-slate-950 font-black text-center flex items-center justify-center shadow-xs"
            >
              Order Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
