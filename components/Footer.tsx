'use client';

import React from 'react';
import Link from 'next/link';
import FoodlyLogo from '@/components/FoodlyLogo';
import { useOptionalStorefrontCart } from '@/context/StorefrontCartContext';

function InstagramIcon({ size = 17 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

function TwitterIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Footer() {
  const storefrontCart = useOptionalStorefrontCart();

  const handleTrackOrder = () => {
    if (storefrontCart) {
      storefrontCart.setIsTrackingOpen(true);
    } else {
      window.location.href = '/menu';
    }
  };

  return (
    <footer className="w-full bg-[#FAF7F2] text-slate-800 pt-16 pb-12 border-t border-[#EFE9DF] transition-colors">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Main 5-Section Grid matching reference image */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12 pb-16">
          
          {/* Brand Column (Left - Spans 2 columns on lg screens) */}
          <div className="col-span-2 space-y-3.5">
            <FoodlyLogo size="md" href="/" />
            <p className="text-slate-600 text-[13px] leading-relaxed max-w-xs pt-1 font-medium">
              शुद्ध शाकाहारी • नास्ता एवं थाली जंक्शन<br />
              Taste of Tradition • Authentic Indian Flavors
            </p>
            <div className="pt-1 space-y-1 text-xs text-slate-500 font-semibold">
              <p className="flex items-center gap-1.5 text-slate-800 font-mono">
                <span>📞 +91 88396-75538</span>
              </p>
              <p className="text-[11px] text-slate-500 leading-tight">
                7th Avenue, Gaur City 1, Greater Noida West
              </p>
            </div>
          </div>

          {/* Column 1: Company */}
          <div className="space-y-3.5">
            <h4 className="font-bold text-slate-900 text-sm tracking-tight">
              Company
            </h4>
            <ul className="space-y-2.5 text-[13.5px] text-slate-500 font-medium">
              <li>
                <Link href="/about" className="hover:text-slate-900 transition-colors block">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-slate-900 transition-colors block">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/#deal" className="hover:text-slate-900 transition-colors block">
                  Press
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Explore */}
          <div className="space-y-3.5">
            <h4 className="font-bold text-slate-900 text-sm tracking-tight">
              Explore
            </h4>
            <ul className="space-y-2.5 text-[13.5px] text-slate-500 font-medium">
              <li>
                <Link href="/menu" className="hover:text-slate-900 transition-colors block">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-slate-900 transition-colors block">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/#best-seller" className="hover:text-slate-900 transition-colors block">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link href="/#deal" className="hover:text-slate-900 transition-colors block">
                  Offers
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="space-y-3.5">
            <h4 className="font-bold text-slate-900 text-sm tracking-tight">
              Support
            </h4>
            <ul className="space-y-2.5 text-[13.5px] text-slate-500 font-medium">
              <li>
                <Link href="/#deal" className="hover:text-slate-900 transition-colors block">
                  Help Center
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={handleTrackOrder}
                  className="hover:text-slate-900 transition-colors block text-left"
                >
                  Track Order
                </button>
              </li>
              <li>
                <Link href="/#deal" className="hover:text-slate-900 transition-colors block">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-slate-900 transition-colors block">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="space-y-3.5">
            <h4 className="font-bold text-slate-900 text-sm tracking-tight">
              Legal
            </h4>
            <ul className="space-y-2.5 text-[13.5px] text-slate-500 font-medium">
              <li>
                <Link href="/#deal" className="hover:text-slate-900 transition-colors block">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/#deal" className="hover:text-slate-900 transition-colors block">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/#deal" className="hover:text-slate-900 transition-colors block">
                  Cookie Settings
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Sub-Footer Bar matching reference image */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-[13px] text-slate-500 gap-4">
          <p className="select-none">
            © 2026 राघव रसोई (Raghav Rasoi). All rights reserved.
          </p>

          {/* 3 Circular White Pill Social Buttons (Instagram, Facebook, Twitter) */}
          <div className="flex items-center space-x-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full bg-white shadow-xs border border-slate-200/80 flex items-center justify-center text-slate-800 hover:text-black hover:shadow-sm hover:scale-105 transition-all"
            >
              <InstagramIcon size={17} />
            </a>

            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 rounded-full bg-white shadow-xs border border-slate-200/80 flex items-center justify-center text-slate-800 hover:text-black hover:shadow-sm hover:scale-105 transition-all"
            >
              <FacebookIcon size={17} />
            </a>

            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
              className="w-9 h-9 rounded-full bg-white shadow-xs border border-slate-200/80 flex items-center justify-center text-slate-800 hover:text-black hover:shadow-sm hover:scale-105 transition-all"
            >
              <TwitterIcon size={15} />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
