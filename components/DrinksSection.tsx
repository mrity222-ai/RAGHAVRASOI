'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Check, Clock, Star, Plus } from 'lucide-react';
import { useOptionalStorefrontCart } from '@/context/StorefrontCartContext';
import { useCart } from '@/context/CartContext';
import MobileProductDetailsSheet from '@/components/storefront/MobileProductDetailsSheet';

interface DrinkItem {
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
}

export default function DrinksSection() {
  const [drinks, setDrinks] = useState<DrinkItem[]>([]);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const [selectedDrink, setSelectedDrink] = useState<DrinkItem | null>(null);

  const storefrontCart = useOptionalStorefrontCart();
  const defaultCart = useCart();

  useEffect(() => {
    fetch('/api/menu/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          // Filter for drinks and beverages (tea-coffee or beverages-desserts)
          const drinkItems = data.data
            .filter(
              (p: any) =>
                p.categoryId === 'cat-tea-coffee' ||
                p.categoryId === 'cat-beverages-desserts' ||
                p.subCategory === 'Beverages' ||
                p.subCategory === 'Tea' ||
                p.subCategory === 'Coffee'
            )
            .slice(0, 4)
            .map((p: any) => ({
              id: p.id,
              name: p.name || p.title,
              slug: p.slug,
              price: p.price,
              mrp: p.mrp || p.compareAtPrice,
              image: p.image || p.imageUrl,
              desc: p.desc || p.description,
              prepTime: p.prepTime || '5 Mins',
              calories: p.calories || 120,
              ingredients: p.ingredients,
              subCategory: p.subCategory,
            }));

          setDrinks(drinkItems);
        }
      })
      .catch((err) => console.log('Error fetching drinks:', err));
  }, []);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddToCart = (drink: DrinkItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (storefrontCart) {
      storefrontCart.addToCart({
        productId: drink.id,
        name: drink.name,
        qty: 1,
        size: 'Regular',
        addons: [],
        unitPrice: drink.price,
        image: drink.image,
      });
    }

    defaultCart.addToCart({
      id: drink.id,
      title: drink.name,
      price: drink.price,
      imageUrl: drink.image,
      quantity: 1,
    });

    setAddedItem(drink.id);
    setTimeout(() => {
      setAddedItem(null);
    }, 1500);
  };

  return (
    <section id="drinks" className="w-full bg-[#FAF8F5]/50 py-8 sm:py-14 border-b border-slate-100">
      <div className="max-w-[1440px] mx-auto px-3.5 sm:px-6 lg:px-12">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-5 sm:mb-8"
        >
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
              Drinks
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Chilled lassi, signature kulhad chai, cafe cold coffee &amp; mojito
            </p>
          </div>

          <Link
            href="/menu?category=cat-beverages-desserts"
            className="text-xs sm:text-sm font-extrabold text-[#B45309] hover:text-[#92400E] flex items-center gap-1 group shrink-0"
          >
            <span>See all</span>
            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </motion.div>

        {/* 2-Column on Mobile, 4-Column on Desktop matching Screen 1 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {drinks.map((drink, index) => {
            const isFav = !!favorites[drink.id];
            const isJustAdded = addedItem === drink.id;

            return (
              <motion.div
                key={drink.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                onClick={() => setSelectedDrink(drink)}
                className="bg-white rounded-3xl p-3 sm:p-4 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  {/* Drink Image with Time Badge & Heart Button matching Screen 1 */}
                  <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden mb-2.5 sm:mb-3 bg-slate-100">
                    <Image
                      src={drink.image}
                      alt={drink.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Top-Left Prep Time Badge matching Screen 1 */}
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/55 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-bold flex items-center gap-1 shadow-xs">
                      <Clock size={10} className="text-amber-300" />
                      <span>{drink.prepTime ? drink.prepTime.split(' ')[0] + ' Mins' : '5 Mins'}</span>
                    </div>

                    {/* Top-Right Heart Button matching Screen 1 */}
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(drink.id, e)}
                      aria-label="Add to wishlist"
                      className="absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white transition-all active:scale-90"
                    >
                      <Heart
                        size={13}
                        className={isFav ? 'fill-rose-500 text-rose-500' : 'text-white'}
                      />
                    </button>
                  </div>

                  {/* Drink Title */}
                  <h3 className="font-black text-slate-900 text-xs sm:text-base leading-snug line-clamp-1 group-hover:text-[#B45309] transition-colors">
                    {drink.name}
                  </h3>

                  {/* Rating & Reviews row matching Screen 1: ⭐ 4.9 (850+ Reviews) */}
                  <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-500 font-medium mt-1">
                    <Star size={11} className="fill-amber-400 text-amber-400 shrink-0" />
                    <span className="font-bold text-slate-800">4.9</span>
                    <span className="text-slate-400 truncate">(850+ Reviews)</span>
                  </div>

                  {/* Desktop Only 2-line Description */}
                  <p className="hidden sm:block text-xs text-slate-500 font-medium line-clamp-2 mt-1.5 leading-relaxed">
                    {drink.desc}
                  </p>
                </div>

                {/* Bottom Row: Price and Yellow "Add to cart" CTA */}
                <div className="flex items-center justify-between mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-slate-50">
                  <span className="font-black text-slate-900 text-xs sm:text-base font-mono">
                    Rs. {drink.price}
                  </span>

                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.92 }}
                    onClick={(e) => handleAddToCart(drink, e)}
                    className={`font-black text-[11px] sm:text-xs px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-xs transition-all flex items-center gap-1 ${
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
                  </motion.button>
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Screen 2: Mobile Product Details Sheet */}
      {selectedDrink && (
        <MobileProductDetailsSheet
          dish={selectedDrink}
          onClose={() => setSelectedDrink(null)}
        />
      )}
    </section>
  );
}
