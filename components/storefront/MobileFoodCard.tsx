'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Heart, Clock, Star, Plus, Check } from 'lucide-react';
import { useOptionalStorefrontCart } from '@/context/StorefrontCartContext';
import { useCart } from '@/context/CartContext';

interface DishItem {
  id: string;
  name: string;
  slug?: string;
  price: number;
  mrp?: number;
  image: string;
  desc: string;
  prepTime?: string;
  calories?: number;
  ingredients?: string;
  subCategory?: string;
}

interface MobileFoodCardProps {
  dish: DishItem;
  onOpenDetails: (dish: DishItem) => void;
}

export default function MobileFoodCard({ dish, onOpenDetails }: MobileFoodCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const storefrontCart = useOptionalStorefrontCart();
  const defaultCart = useCart();

  const handleToggleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite((prev) => !prev);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (storefrontCart) {
      storefrontCart.addToCart({
        productId: dish.id,
        name: dish.name,
        qty: 1,
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
      quantity: 1,
    });

    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
    }, 1200);
  };

  return (
    <div
      onClick={() => onOpenDetails(dish)}
      className="w-full bg-white rounded-3xl p-3 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer group select-none"
    >
      <div>
        {/* Image with Time Badge & Heart Button matching Screen 1 */}
        <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden mb-2.5 bg-slate-100">
          <Image
            src={dish.image}
            alt={dish.name}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-cover transform group-hover:scale-105 transition-transform duration-300"
          />

          {/* Top-Left Prep Time Badge matching Screen 1 */}
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
            <Clock size={10} className="text-amber-300" />
            <span>{dish.prepTime ? dish.prepTime.split(' ')[0] + ' Mins' : '15 Mins'}</span>
          </div>

          {/* Top-Right Heart Button matching Screen 1 */}
          <button
            type="button"
            onClick={handleToggleFav}
            aria-label="Wishlist"
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white transition-all active:scale-90"
          >
            <Heart
              size={13}
              className={isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'}
            />
          </button>
        </div>

        {/* Dish Title matching Screen 1 */}
        <h4 className="font-black text-slate-900 text-xs sm:text-sm line-clamp-1 leading-snug group-hover:text-[#B45309] transition-colors">
          {dish.name}
        </h4>

        {/* Rating Row matching Screen 1: ⭐ 4.8 (3k Reviews) */}
        <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium mt-1">
          <Star size={11} className="fill-amber-400 text-amber-400" />
          <span className="font-bold text-slate-800">4.8</span>
          <span className="text-[10px] text-slate-400">(1.2k+ Reviews)</span>
        </div>
      </div>

      {/* Bottom Row: Price & Yellow "Add" Button matching Screen 1 */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-50">
        <span className="font-black text-slate-900 text-xs sm:text-sm font-mono">
          Rs. {dish.price}
        </span>

        <button
          type="button"
          onClick={handleQuickAdd}
          className={`px-3 py-1.5 rounded-full text-[11px] font-black transition-all flex items-center gap-1 active:scale-95 shadow-2xs ${
            justAdded
              ? 'bg-emerald-600 text-white'
              : 'bg-[#FBBF24] hover:bg-[#F59E0B] text-slate-950 hover:shadow-xs'
          }`}
        >
          {justAdded ? (
            <>
              <Check size={12} />
              <span>Added</span>
            </>
          ) : (
            <>
              <Plus size={12} />
              <span>Add</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
