'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  X,
  ChevronLeft,
  MoreVertical,
  Star,
  Clock,
  Flame,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Share2,
} from 'lucide-react';
import { useOptionalStorefrontCart } from '@/context/StorefrontCartContext';
import { useCart } from '@/context/CartContext';

interface DishDetails {
  id: string;
  name: string;
  price: number;
  mrp?: number;
  image: string;
  desc: string;
  prepTime?: string;
  calories?: number;
  ingredients?: string;
  subCategory?: string;
}

interface MobileProductDetailsSheetProps {
  dish: DishDetails | null;
  onClose: () => void;
}

export default function MobileProductDetailsSheet({
  dish,
  onClose,
}: MobileProductDetailsSheetProps) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const storefrontCart = useOptionalStorefrontCart();
  const defaultCart = useCart();

  if (!dish) return null;

  const handleIncrement = () => setQty((prev) => prev + 1);
  const handleDecrement = () => setQty((prev) => (prev > 1 ? prev - 1 : 1));

  // Calculated macros based on dish
  const calories = dish.calories || 380;
  const carbs = Math.round(calories * 0.12);
  const protein = Math.round(calories * 0.05);
  const fat = Math.round(calories * 0.035);

  const handleAddToCart = () => {
    if (storefrontCart) {
      storefrontCart.addToCart({
        productId: dish.id,
        name: dish.name,
        qty: qty,
        size: 'Regular',
        addons: [],
        unitPrice: dish.price,
        image: dish.image,
      });
    }

    defaultCart.addToCart({
      id: dish.id,
      title: dish.name,
      price: dish.price,
      imageUrl: dish.image,
      quantity: qty,
    });

    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 1200);
  };

  const handleOrderNow = () => {
    handleAddToCart();
    if (storefrontCart) {
      storefrontCart.setIsCartOpen(true);
    } else {
      defaultCart.setIsCartOpen(true);
    }
    onClose();
  };

  const totalPrice = dish.price * qty;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Bottom Sheet matching Screen 2 */}
      <div className="relative w-full max-w-md bg-white rounded-t-[36px] sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-100 max-h-[92vh] flex flex-col animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200">
        
        {/* Top Navigation Bar matching Screen 2 */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-100 bg-white/95 backdrop-blur-sm sticky top-0 z-10">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors active:scale-95"
            aria-label="Back"
          >
            <ChevronLeft size={22} />
          </button>

          <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
            Product Details
          </h3>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors active:scale-95"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* Circular Hero Food Presentation matching Screen 2 */}
          <div className="flex justify-center py-2">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.15)] border-4 border-white bg-slate-100 ring-2 ring-amber-100">
              <Image
                src={dish.image}
                alt={dish.name}
                fill
                sizes="(max-width: 640px) 192px, 224px"
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Dish Title & Quantity Stepper */}
          <div className="flex items-start justify-between gap-4 pt-1">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block ring-2 ring-emerald-200" />
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                  Pure Vegetarian • राघव रसोई
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                {dish.name}
              </h2>
            </div>

            {/* Stepper matching Screen 2: [-] 1 [+] */}
            <div className="flex items-center gap-2.5 bg-slate-100/90 rounded-full p-1.5 shrink-0 border border-slate-200/60 shadow-2xs">
              <button
                type="button"
                onClick={handleDecrement}
                className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold transition-all active:scale-90 shadow-xs"
              >
                <Minus size={14} />
              </button>

              <span className="font-black text-slate-900 font-mono text-sm px-1.5 min-w-[20px] text-center">
                {qty}
              </span>

              <button
                type="button"
                onClick={handleIncrement}
                className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center text-white font-bold transition-all active:scale-90 shadow-xs"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* 4-Column Quick Stats Row matching Screen 2 */}
          <div className="grid grid-cols-4 divide-x divide-slate-100 bg-slate-50/80 rounded-2xl p-3 border border-slate-100 text-center text-xs">
            <div className="px-1">
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Rating</p>
              <p className="font-extrabold text-slate-900 mt-0.5 flex items-center justify-center gap-1">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                <span>4.8</span>
              </p>
            </div>

            <div className="px-1">
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Prep Time</p>
              <p className="font-extrabold text-slate-900 mt-0.5">
                {dish.prepTime ? dish.prepTime.split('-')[0] : '7 Min'}
              </p>
            </div>

            <div className="px-1">
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Cooking</p>
              <p className="font-extrabold text-slate-900 mt-0.5">10 Min</p>
            </div>

            <div className="px-1">
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Total Time</p>
              <p className="font-extrabold text-slate-900 mt-0.5">
                {dish.prepTime || '15-20 Min'}
              </p>
            </div>
          </div>

          {/* Description matching Screen 2 */}
          <div className="space-y-1.5">
            <h4 className="font-black text-sm text-slate-900">Description</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {dish.desc}
            </p>
            {dish.ingredients && (
              <p className="text-[11px] text-slate-400 italic pt-1">
                <span className="font-bold text-slate-600">Key Ingredients:</span> {dish.ingredients}
              </p>
            )}
          </div>

          {/* 4 Colorful Macro / Nutrition Pills matching Screen 2 */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            {/* 1. Carbs (Light Orange) */}
            <div className="bg-orange-50/80 border border-orange-200/80 rounded-2xl p-2.5 shadow-2xs">
              <p className="text-[10px] font-bold text-orange-700 uppercase">Carbs</p>
              <p className="font-black text-slate-900 mt-1 text-xs sm:text-sm font-mono">
                {carbs} <span className="text-[10px] font-medium text-slate-500">gram</span>
              </p>
            </div>

            {/* 2. Calories (Light Yellow) */}
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-2.5 shadow-2xs">
              <p className="text-[10px] font-bold text-amber-700 uppercase">Calories</p>
              <p className="font-black text-slate-900 mt-1 text-xs sm:text-sm font-mono">
                {calories} <span className="text-[10px] font-medium text-slate-500">kcal</span>
              </p>
            </div>

            {/* 3. Protein (Light Green) */}
            <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-2.5 shadow-2xs">
              <p className="text-[10px] font-bold text-emerald-700 uppercase">Protein</p>
              <p className="font-black text-slate-900 mt-1 text-xs sm:text-sm font-mono">
                {protein} <span className="text-[10px] font-medium text-slate-500">gram</span>
              </p>
            </div>

            {/* 4. Fat (Light Purple) */}
            <div className="bg-purple-50/80 border border-purple-200/80 rounded-2xl p-2.5 shadow-2xs">
              <p className="text-[10px] font-bold text-purple-700 uppercase">Fat</p>
              <p className="font-black text-slate-900 mt-1 text-xs sm:text-sm font-mono">
                {fat} <span className="text-[10px] font-medium text-slate-500">gram</span>
              </p>
            </div>
          </div>

        </div>

        {/* Sticky Bottom Action Bar matching Screen 2 */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-100 flex items-center justify-between gap-3 shadow-lg">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Price</p>
            <p className="font-black text-xl sm:text-2xl text-slate-900 font-mono">
              ₹ {totalPrice}
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-1 max-w-[240px] justify-end">
            {/* Round Green Cart Icon Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-95 shrink-0 ${
                added
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
              }`}
              title="Add to Cart"
            >
              <ShoppingBag size={18} />
            </button>

            {/* Big Green Pill Order Now Button */}
            <button
              type="button"
              onClick={handleOrderNow}
              className="flex-1 py-3.5 px-5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm tracking-wide shadow-lg shadow-emerald-700/25 transition-all active:scale-95 flex items-center justify-center text-center"
            >
              Order Now
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
