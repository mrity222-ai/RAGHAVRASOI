'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useStorefrontCart } from '@/context/StorefrontCartContext';

interface ProductCatalogGridProps {
  products: any[];
}

export default function ProductCatalogGrid({ products }: ProductCatalogGridProps) {
  const { cart, addToCart, updateQty, setCustomizeDish, settings } = useStorefrontCart();

  if (!products.length) {
    return (
      <div className="bg-slate-50 rounded-3xl p-10 text-center border border-slate-200">
        <p className="text-3xl mb-2">🍽️</p>
        <h4 className="font-extrabold text-base text-slate-900">No matching dishes found</h4>
        <p className="text-xs text-slate-500 mt-1">Try resetting your dietary filter or searching another dish.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {products.map((dish) => {
        const discountPct =
          dish.mrp && dish.mrp > dish.price
            ? Math.round(((dish.mrp - dish.price) / dish.mrp) * 100)
            : 0;

        const cartItemsForDish = cart.filter((c) => c.productId === dish.id);
        const inCartQty = cartItemsForDish.reduce((sum, item) => sum + item.qty, 0);

        const handleAdd = () => {
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
          }
        };

        const handleDecrement = () => {
          const firstIndex = cart.findIndex((c) => c.productId === dish.id);
          if (firstIndex > -1) {
            updateQty(firstIndex, -1);
          }
        };

        return (
          <article
            key={dish.id}
            className={`bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between ${
              !dish.inStock ? 'grayscale opacity-75' : ''
            }`}
          >
            <div>
              {/* Dish Image & Top Badges */}
              <Link href={`/product/${dish.id}`} className="block relative h-44 bg-slate-100 overflow-hidden group/img">
                <Image
                  src={dish.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80'}
                  alt={dish.name}
                  fill
                  className="object-cover group-hover/img:scale-105 transition-transform duration-300"
                />

                <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                  {dish.veg ? (
                    <span className="w-4 h-4 rounded-xs border border-emerald-600 bg-white flex items-center justify-center shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    </span>
                  ) : (
                    <span className="w-4 h-4 rounded-xs border border-rose-600 bg-white flex items-center justify-center shadow-xs">
                      <span className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[7px] border-b-rose-600" />
                    </span>
                  )}

                  {dish.bestseller && (
                    <span className="px-2 py-0.5 rounded-lg bg-amber-400 text-slate-950 font-extrabold text-[10px] shadow-xs">
                      ⭐ Bestseller
                    </span>
                  )}
                </div>

                {discountPct > 0 && (
                  <span className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-lg bg-[#0F766E] text-white font-extrabold text-[10px] shadow-sm z-10">
                    {discountPct}% OFF
                  </span>
                )}
              </Link>

              {/* Dish Body */}
              <div className="p-4 pb-2">
                <Link href={`/product/${dish.id}`}>
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug line-clamp-1 hover:text-[#E5203A] transition-colors">
                    {dish.name}
                  </h4>
                </Link>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                  {dish.desc || dish.description}
                </p>
              </div>
            </div>

            {/* Price & Add Button Footer */}
            <div className="px-4 pb-4 pt-2 flex items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-black text-base text-slate-900">
                    ₹{dish.price}
                  </span>
                  {dish.mrp && dish.mrp > dish.price && (
                    <span className="font-mono text-xs text-slate-400 line-through">
                      ₹{dish.mrp}
                    </span>
                  )}
                </div>
                {dish.customizable ? (
                  <span className="text-[10px] font-semibold text-[#0F766E]">Customizable</span>
                ) : (
                  <span className="text-[10px] text-slate-400">Standard Portion</span>
                )}
              </div>

              <div>
                {!dish.inStock ? (
                  <span className="px-3.5 py-2 rounded-xl bg-slate-200 text-slate-500 font-extrabold text-xs uppercase">
                    Sold Out
                  </span>
                ) : inCartQty > 0 ? (
                  <div className="inline-flex items-center bg-[#E5203A] text-white rounded-xl shadow-sm overflow-hidden">
                    <button
                      onClick={handleDecrement}
                      className="px-3 py-1.5 font-black text-xs hover:bg-[#C8172E] transition-colors"
                    >
                      −
                    </button>
                    <span className="px-2.5 font-mono font-extrabold text-xs">{inCartQty}</span>
                    <button
                      onClick={handleAdd}
                      className="px-3 py-1.5 font-black text-xs hover:bg-[#C8172E] transition-colors"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleAdd}
                    className="px-4 py-2 rounded-xl bg-white border-2 border-[#E5203A] text-[#E5203A] hover:bg-[#E5203A] hover:text-white font-extrabold text-xs transition-all shadow-xs"
                  >
                    + ADD
                  </button>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
