'use client';

import React, { useState, useEffect } from 'react';
import { Tag } from 'lucide-react';
import { useStorefrontCart } from '@/context/StorefrontCartContext';

export default function CouponStrip() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const { applyCouponCode, setIsCartOpen } = useStorefrontCart();

  useEffect(() => {
    fetch('/api/coupons?active=true')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setCoupons(data.data);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  if (!coupons.length) return null;

  const handleApply = async (code: string) => {
    await applyCouponCode(code);
    setIsCartOpen(true);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
          <Tag size={16} className="text-[#E5203A]" />
          <span>Active Pickup Offers & Promo Codes</span>
        </h3>
        <span className="text-[11px] font-semibold text-slate-500">
          Click any coupon to copy & apply in cart
        </span>
      </div>

      <div className="flex items-stretch gap-3.5 overflow-x-auto no-scrollbar pb-1">
        {coupons.map((c) => {
          const badgeText = c.type === 'PERCENT' ? `${c.value}% OFF` : `FLAT ₹${c.value} OFF`;
          return (
            <div
              key={c.id}
              className="min-w-[270px] sm:min-w-[300px] bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm flex items-center justify-between gap-3 shrink-0 hover:border-[#0F766E] transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-xs px-2 py-0.5 rounded-md bg-teal-50 text-[#0F766E] border border-teal-200 border-dashed">
                    {c.code}
                  </span>
                  <span className="text-[11px] font-extrabold text-[#E5203A]">{badgeText}</span>
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-1">{c.desc}</p>
                <p className="text-[10px] font-semibold text-slate-400">Min order ₹{c.minOrder}</p>
              </div>

              <button
                onClick={() => handleApply(c.code)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-[#E5203A] text-white font-extrabold text-[11px] transition-colors shrink-0"
              >
                Apply
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
