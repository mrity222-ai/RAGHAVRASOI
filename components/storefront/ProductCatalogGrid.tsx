'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Heart, Clock, Star, Plus, Check } from 'lucide-react';
import { useStorefrontCart } from '@/context/StorefrontCartContext';
import { useCart } from '@/context/CartContext';
import MobileProductDetailsSheet from '@/components/storefront/MobileProductDetailsSheet';

interface ProductCatalogGridProps {
  products: any[];
}

export default function ProductCatalogGrid({ products }: ProductCatalogGridProps) {
  const { cart, addToCart, updateQty, setCustomizeDish, settings } = useStorefrontCart();
  const defaultCart = useCart();
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [selectedDish, setSelectedDish] = useState<any | null>(null);

  if (!products.length) {
    return (
      <div className="bg-slate-50 rounded-3xl p-10 text-center border border-slate-200">
        <p className="text-3xl mb-2">🍽️</p>
        <h4 className="font-extrabold text-base text-slate-900">No matching dishes found</h4>
        <p className="text-xs text-slate-500 mt-1">Try resetting your dietary filter or searching another dish.</p>
      </div>
    );
  }

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      {/* 2-Column on Mobile, 3-4 Column on Tablet & Desktop matching Screen 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
        {products.map((dish) => {
          const discountPct =
            dish.mrp && dish.mrp > dish.price
              ? Math.round(((dish.mrp - dish.price) / dish.mrp) * 100)
              : 0;

          const cartItemsForDish = cart.filter((c) => c.productId === dish.id);
          const inCartQty = cartItemsForDish.reduce((sum, item) => sum + item.qty, 0);
          const isFav = !!favorites[dish.id];

          const handleAdd = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();

            if (!settings.isOpen) {
              alert('Store is currently closed for pickup orders.');
              return;
            }
            if (dish.customizable) {
              setCustomizeDish(dish);
            } else {
              addToCart({
                productId: dish.id,
                name: dish.name,
                qty: 1,
                size: 'Regular',
                addons: [],
                unitPrice: dish.price,
                image: dish.image,
              });

              defaultCart.addToCart({
                id: dish.id,
                title: dish.name,
                price: dish.price,
                imageUrl: dish.image,
                quantity: 1,
              });
            }
          };

          const handleDecrement = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            const firstIndex = cart.findIndex((c) => c.productId === dish.id);
            if (firstIndex > -1) {
              updateQty(firstIndex, -1);
            }
          };

          return (
            <article
              key={dish.id}
              onClick={() => setSelectedDish(dish)}
              className={`bg-white rounded-3xl p-3 sm:p-4 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer select-none group ${
                !dish.inStock ? 'grayscale opacity-75' : ''
              }`}
            >
              <div>
                {/* Dish Image with Prep Time & Heart Wishlist matching Screen 1 */}
                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden mb-2.5 sm:mb-3 bg-slate-100">
                  <Image
                    src={dish.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80'}
                    alt={dish.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Top-Left Prep Time Badge matching Screen 1 */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/55 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-bold flex items-center gap-1 shadow-xs z-10">
                    <Clock size={10} className="text-amber-300" />
                    <span>{dish.prepTime ? dish.prepTime.split(' ')[0] + ' Mins' : '15 Mins'}</span>
                  </div>

                  {/* Top-Right Heart Button matching Screen 1 */}
                  <button
                    type="button"
                    onClick={(e) => toggleFavorite(dish.id, e)}
                    aria-label="Add to wishlist"
                    className="absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white transition-all active:scale-90 z-10"
                  >
                    <Heart
                      size={13}
                      className={isFav ? 'fill-rose-500 text-rose-500' : 'text-white'}
                    />
                  </button>

                  {/* Veg Indicator or Discount at bottom of image */}
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 z-10">
                    {dish.veg ? (
                      <span className="w-3.5 h-3.5 rounded-xs border border-emerald-600 bg-white/95 flex items-center justify-center shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      </span>
                    ) : null}

                    {discountPct > 0 && (
                      <span className="px-1.5 py-0.5 rounded-md bg-[#0F766E] text-white font-black text-[9px] shadow-xs">
                        {discountPct}% OFF
                      </span>
                    )}
                  </div>
                </div>

                {/* Dish Title */}
                <h4 className="font-black text-slate-900 text-xs sm:text-base leading-snug line-clamp-1 group-hover:text-[#B45309] transition-colors">
                  {dish.name}
                </h4>

                {/* Rating & Reviews row matching Screen 1: ⭐ 4.8 (1.2k+ Reviews) */}
                <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-500 font-medium mt-1">
                  <Star size={11} className="fill-amber-400 text-amber-400 shrink-0" />
                  <span className="font-bold text-slate-800">4.8</span>
                  <span className="text-slate-400 truncate">(1.2k+ Reviews)</span>
                </div>

                {/* Description for Tablet/Desktop */}
                <p className="hidden sm:block text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                  {dish.desc || dish.description}
                </p>
              </div>

              {/* Price & Add CTA Footer matching Screen 1 */}
              <div className="flex items-center justify-between mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-slate-50">
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-mono font-black text-xs sm:text-base text-slate-900">
                      Rs. {dish.price}
                    </span>
                    {dish.mrp && dish.mrp > dish.price && (
                      <span className="font-mono text-[10px] sm:text-xs text-slate-400 line-through">
                        ₹{dish.mrp}
                      </span>
                    )}
                  </div>
                  {dish.customizable && (
                    <span className="text-[9px] font-bold text-[#0F766E] block sm:hidden">Custom</span>
                  )}
                </div>

                <div>
                  {!dish.inStock ? (
                    <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-500 font-extrabold text-[10px] uppercase">
                      Sold Out
                    </span>
                  ) : inCartQty > 0 ? (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center bg-[#15803d] text-white rounded-full shadow-xs overflow-hidden"
                    >
                      <button
                        onClick={handleDecrement}
                        className="px-2.5 py-1 font-black text-xs hover:bg-[#166534] transition-colors"
                      >
                        −
                      </button>
                      <span className="px-1.5 font-mono font-extrabold text-xs">{inCartQty}</span>
                      <button
                        onClick={handleAdd}
                        className="px-2.5 py-1 font-black text-xs hover:bg-[#166534] transition-colors"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleAdd}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#FBBF24] hover:bg-[#F59E0B] text-slate-950 font-black text-[11px] sm:text-xs transition-all shadow-xs flex items-center gap-1 active:scale-95"
                    >
                      <Plus size={12} />
                      <span>Add</span>
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Screen 2: Mobile Product Details Bottom Sheet */}
      {selectedDish && (
        <MobileProductDetailsSheet
          dish={selectedDish}
          onClose={() => setSelectedDish(null)}
        />
      )}
    </>
  );
}
