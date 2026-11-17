'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

export default function LivePurchaseToast() {
  const [visible, setVisible] = useState(false);
  const [dataIndex, setDataIndex] = useState(0);

  const purchaseFeed = [
    {
      location: 'Kyoto, Japan',
      product: 'Quick Wrap',
      image: '/assets/banners/quick-wrap-thumb.png',
      time: 'just now',
    },
    {
      location: 'New York, USA',
      product: 'Flame Box',
      image: '/assets/products/flame-box.png',
      time: '2 minutes ago',
    },
    {
      location: 'London, UK',
      product: 'Cheese Pizza',
      image: '/assets/banners/tri-delicious-pizza.png',
      time: '4 minutes ago',
    },
  ];

  useEffect(() => {
    // Show after 2.5s initially
    const initialTimer = setTimeout(() => {
      setVisible(true);
    }, 2500);

    // Rotate every 12s
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setDataIndex((prev) => (prev + 1) % purchaseFeed.length);
        setVisible(true);
      }, 1000);
    }, 12000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [purchaseFeed.length]);

  if (!visible) return null;

  const current = purchaseFeed[dataIndex];

  return (
    <div className="fixed bottom-6 left-6 z-50 bg-white/95 backdrop-blur-sm border border-[#E2DBD0] rounded-md shadow-xl p-2.5 sm:p-3 flex items-center space-x-3 max-w-[280px] sm:max-w-[320px] transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
      {/* Thumbnail */}
      <div className="relative w-11 h-11 bg-[#F9F6F0] rounded-sm flex-shrink-0 overflow-hidden border border-[#ECE5D8]">
        <Image
          src={current.image}
          alt={current.product}
          fill
          className="object-contain p-1"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-2">
        <p className="text-[10px] text-[#777777] leading-tight truncate">
          Someone in {current.location} bought
        </p>
        <p className="font-heading text-xs font-bold text-black tracking-wide leading-tight mt-0.5 truncate">
          {current.product}
        </p>
      </div>

      {/* Close button */}
      <button
        onClick={() => setVisible(false)}
        className="text-[#999999] hover:text-black p-1 transition-colors"
        aria-label="Close notification"
      >
        <X size={13} />
      </button>
    </div>
  );
}
