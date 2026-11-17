'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { useStorefrontCart } from '@/context/StorefrontCartContext';

export default function ItemCustomizeModal() {
  const { customizeDish, setCustomizeDish, addToCart, setIsCartOpen } = useStorefrontCart();
  const [selectedSize, setSelectedSize] = useState<{ label: string; extra: number }>({
    label: 'Regular',
    extra: 0,
  });
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [cookingNote, setCookingNote] = useState('');

  // Reset choices whenever a new dish is customized
  useEffect(() => {
    if (customizeDish) {
      const isChinese = customizeDish.categoryId === 'cat-chinese';
      setSelectedSize(isChinese ? { label: 'Half Plate', extra: 0 } : { label: 'Regular', extra: 0 });
      setSelectedAddons([]);
      setCookingNote('');
    }
  }, [customizeDish?.id]);

  if (!customizeDish) return null;

  const isChinese = customizeDish.categoryId === 'cat-chinese';
  const sizeOptions = isChinese
    ? [
        { label: 'Half Plate', extra: 0 },
        { label: 'Full Plate', extra: 70 },
      ]
    : [
        { label: 'Regular', extra: 0 },
        { label: 'Large / Double', extra: 60 },
      ];

  const addonOptions = [
    { label: 'Extra Cheese Slice', price: 25 },
    { label: 'Peri-Peri Fries Side', price: 60 },
    { label: 'House Mint & Garlic Dip', price: 20 },
  ];

  const addonsTotal = selectedAddons.reduce((sum, itemStr) => {
    const match = itemStr.match(/\+₹(\d+)/);
    return sum + (match ? Number(match[1]) : 0);
  }, 0);

  const finalUnitPrice = customizeDish.price + selectedSize.extra + addonsTotal;

  const handleToggleAddon = (item: { label: string; price: number }) => {
    const key = `${item.label} (+₹${item.price})`;
    if (selectedAddons.includes(key)) {
      setSelectedAddons(selectedAddons.filter((k) => k !== key));
    } else {
      setSelectedAddons([...selectedAddons, key]);
    }
  };

  const handleConfirm = () => {
    addToCart({
      productId: customizeDish.id,
      name: customizeDish.name,
      qty: 1,
      size: selectedSize.label,
      addons: selectedAddons,
      note: cookingNote.trim(),
      unitPrice: finalUnitPrice,
      image: customizeDish.image,
    });
    setCustomizeDish(null);
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
        
        {/* Top Image & Close */}
        <div className="relative h-44 bg-slate-100">
          <Image
            src={customizeDish.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80'}
            alt={customizeDish.name}
            fill
            className="object-cover"
          />
          <button
            onClick={() => setCustomizeDish(null)}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-slate-800 flex items-center justify-center shadow-md hover:bg-white z-10"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
          <div>
            <div className="mb-1">
              {customizeDish.veg ? (
                <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  🟢 Pure Veg
                </span>
              ) : (
                <span className="text-[10px] font-extrabold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                  🔴 Non-Veg
                </span>
              )}
            </div>
            <h3 className="font-black text-lg text-slate-900">{customizeDish.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{customizeDish.desc || customizeDish.description}</p>
          </div>

          {/* Size / Portion */}
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-2">
              Choose Portion / Size <span className="text-[#E5203A]">*</span>
            </p>
            <div className="space-y-2">
              {sizeOptions.map((s) => (
                <label
                  key={s.label}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 text-xs font-bold"
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="dish-size-opt"
                      checked={selectedSize.label === s.label}
                      onChange={() => setSelectedSize(s)}
                      className="accent-[#E5203A]"
                    />
                    <span>{s.label}</span>
                  </span>
                  <span className="font-mono text-slate-600">
                    {s.extra > 0 ? `+₹${s.extra}` : 'Included'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Add-ons */}
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-2">
              Extra Toppings & Add-ons
            </p>
            <div className="space-y-2">
              {addonOptions.map((a) => {
                const key = `${a.label} (+₹${a.price})`;
                const isChecked = selectedAddons.includes(key);
                return (
                  <label
                    key={a.label}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 text-xs font-bold"
                  >
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleAddon(a)}
                        className="accent-[#0F766E]"
                      />
                      <span>{a.label}</span>
                    </span>
                    <span className="font-mono text-slate-600">+₹{a.price}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Cooking Instructions */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-1.5">
              Cooking Instructions
            </label>
            <input
              type="text"
              value={cookingNote}
              onChange={(e) => setCookingNote(e.target.value)}
              placeholder="e.g. Less spicy, extra green chutney, no onion..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#E5203A]"
            />
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <button
            onClick={handleConfirm}
            className="w-full py-3.5 rounded-2xl bg-[#E5203A] hover:bg-[#C8172E] text-white font-extrabold text-sm shadow-md transition-all"
          >
            Add to Cart • ₹{finalUnitPrice}
          </button>
        </div>

      </div>
    </div>
  );
}
