'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Check, Clock, Star, Plus } from 'lucide-react';
import { useOptionalStorefrontCart } from '@/context/StorefrontCartContext';
import { useCart } from '@/context/CartContext';
import MobileProductDetailsSheet from '@/components/storefront/MobileProductDetailsSheet';

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  mrp?: number;
  image: string;
  desc: string;
  prepTime?: string;
  calories?: number;
  ingredients?: string;
  subCategory?: string;
  isSale?: boolean;
}

export default function PopularFoodsSection() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const [selectedDish, setSelectedDish] = useState<ProductItem | null>(null);

  const storefrontCart = useOptionalStorefrontCart();
  const defaultCart = useCart();

  useEffect(() => {
    fetch('/api/menu/products?bestseller=true')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          // Take top 8 popular foods for 2 rows of 4
          const popularList = data.data.slice(0, 8).map((p: any) => ({
            id: p.id,
            name: p.name || p.title,
            slug: p.slug,
            price: p.price,
            mrp: p.mrp || p.compareAtPrice,
            image: p.image || p.imageUrl,
            desc: p.desc || p.description,
            prepTime: p.prepTime || '15 Mins',
            calories: p.calories || 380,
            ingredients: p.ingredients,
            subCategory: p.subCategory,
            isSale: p.isSale,
          }));
          setProducts(popularList);
        }
      })
      .catch((err) => console.log('Error fetching popular foods:', err));
  }, []);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddToCart = (dish: ProductItem, e: React.MouseEvent) => {
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

    setAddedItem(dish.id);
    setTimeout(() => {
      setAddedItem(null);
    }, 1500);
  };

  return (
    <section id="popular-foods" className="w-full bg-white py-8 sm:py-14 border-b border-slate-100">
      <div className="max-w-[1440px] mx-auto px-3.5 sm:px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="flex items-end justify-between mb-5 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
              Popular Dishes
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Handcrafted fresh daily with pure vegetarian ingredients
            </p>
          </div>

          <Link
            href="/menu"
            className="text-xs sm:text-sm font-extrabold text-[#B45309] hover:text-[#92400E] flex items-center gap-1 group shrink-0"
          >
            <span>See all</span>
            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* 2-Column on Mobile, 4-Column on Desktop matching Screen 1 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {products.map((dish) => {
            const isFav = !!favorites[dish.id];
            const isJustAdded = addedItem === dish.id;

            return (
              <div
                key={dish.id}
                onClick={() => setSelectedDish(dish)}
                className="bg-white rounded-3xl p-3 sm:p-4 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  {/* Image with Time Badge & Heart Button matching Screen 1 */}
                  <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden mb-2.5 sm:mb-3 bg-slate-100">
                    <Image
                      src={dish.image}
                      alt={dish.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Top-Left Prep Time Badge matching Screen 1 */}
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/55 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-bold flex items-center gap-1 shadow-xs">
                      <Clock size={10} className="text-amber-300" />
                      <span>{dish.prepTime ? dish.prepTime.split(' ')[0] + ' Mins' : '15 Mins'}</span>
                    </div>

                    {/* Top-Right Heart Button matching Screen 1 */}
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(dish.id, e)}
                      aria-label="Add to wishlist"
                      className="absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white transition-all active:scale-90"
                    >
                      <Heart
                        size={13}
                        className={isFav ? 'fill-rose-500 text-rose-500' : 'text-white'}
                      />
                    </button>
                  </div>

                  {/* Dish Title */}
                  <h3 className="font-black text-slate-900 text-xs sm:text-base leading-snug line-clamp-1 group-hover:text-[#B45309] transition-colors">
                    {dish.name}
                  </h3>

                  {/* Rating & Reviews row matching Screen 1: ⭐ 4.8 (1.2k+ Reviews) */}
                  <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-500 font-medium mt-1">
                    <Star size={11} className="fill-amber-400 text-amber-400 shrink-0" />
                    <span className="font-bold text-slate-800">4.8</span>
                    <span className="text-slate-400 truncate">(1.2k+ Reviews)</span>
                  </div>

                  {/* Desktop Only 2-line Description */}
                  <p className="hidden sm:block text-xs text-slate-500 font-medium line-clamp-2 mt-1.5 leading-relaxed">
                    {dish.desc}
                  </p>
                </div>

                {/* Bottom Row: Price and Yellow "Add to cart" CTA */}
                <div className="flex items-center justify-between mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-slate-50">
                  <span className="font-black text-slate-900 text-xs sm:text-base font-mono">
                    Rs. {dish.price}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => handleAddToCart(dish, e)}
                    className={`font-black text-[11px] sm:text-xs px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-xs transition-all flex items-center gap-1 active:scale-95 ${
                      isJustAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#FBBF24] hover:bg-[#F59E0B] text-slate-950 hover:shadow-xs'
                    }`}
                  >
                    {isJustAdded ? (
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
          })}
        </div>

      </div>

      {/* Screen 2: Mobile Product Details Sheet */}
      {selectedDish && (
        <MobileProductDetailsSheet
          dish={selectedDish}
          onClose={() => setSelectedDish(null)}
        />
      )}
    </section>
  );
}
