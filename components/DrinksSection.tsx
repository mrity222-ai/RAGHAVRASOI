'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { useOptionalStorefrontCart } from '@/context/StorefrontCartContext';
import { useCart } from '@/context/CartContext';

interface DrinkItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  mrp?: number;
  image: string;
  desc: string;
}

export default function DrinksSection() {
  const [drinks, setDrinks] = useState<DrinkItem[]>([]);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [addedItem, setAddedItem] = useState<string | null>(null);

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

    // 1. Add to Storefront Cart if available
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
      storefrontCart.setIsCartOpen(true);
    }

    // 2. Add to Default Cart Context for sync
    defaultCart.addToCart({
      id: drink.id,
      title: drink.name,
      price: drink.price,
      imageUrl: drink.image,
      quantity: 1,
    });

    // Visual feedback
    setAddedItem(drink.id);
    setTimeout(() => {
      setAddedItem(null);
    }, 1500);
  };

  return (
    <section id="drinks" className="w-full bg-[#FAF8F5]/50 py-12 sm:py-16 border-b border-slate-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Drinks
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5">
              Traditional lassi, special kulhad chai, cafe cold coffee &amp; sparkling coolers
            </p>
          </div>

          <Link
            href="/menu?category=cat-beverages-desserts"
            className="text-xs sm:text-sm font-extrabold text-[#B45309] hover:text-[#92400E] flex items-center gap-1 group self-start sm:self-auto"
          >
            <span>View All Drinks</span>
            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* 4-Column Card Grid matching Screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {drinks.map((drink) => {
            const isFav = !!favorites[drink.id];
            const isJustAdded = addedItem === drink.id;

            return (
              <div
                key={drink.id}
                className="bg-white rounded-3xl p-4 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.05)] hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Drink Image with Floating Heart Button */}
                  <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden mb-4 bg-slate-100">
                    <Image
                      src={drink.image}
                      alt={drink.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Heart (Favorite) Button */}
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(drink.id, e)}
                      aria-label="Add to wishlist"
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 flex items-center justify-center text-white transition-all active:scale-90"
                    >
                      <Heart
                        size={15}
                        className={isFav ? 'fill-rose-500 text-rose-500' : 'text-white'}
                      />
                    </button>
                  </div>

                  {/* Drink Title */}
                  <h3 className="font-black text-slate-900 text-base leading-snug line-clamp-1 group-hover:text-[#B45309] transition-colors">
                    {drink.name}
                  </h3>

                  {/* Drink Description (2 Lines) */}
                  <p className="text-xs text-slate-500 font-medium line-clamp-2 mt-1.5 leading-relaxed">
                    {drink.desc}
                  </p>
                </div>

                {/* Bottom Row: Price and Yellow "Add to cart" CTA */}
                <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-50">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-black text-slate-900 text-base sm:text-lg font-mono">
                      Rs. {drink.price}
                    </span>
                    {drink.mrp && drink.mrp > drink.price && (
                      <span className="text-xs text-slate-400 font-mono line-through">
                        Rs. {drink.mrp}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleAddToCart(drink, e)}
                    className={`font-black text-xs px-4 py-2.5 rounded-full shadow-xs transition-all flex items-center gap-1.5 active:scale-95 ${
                      isJustAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#FBBF24] hover:bg-[#F59E0B] text-slate-950 hover:shadow-md'
                    }`}
                  >
                    {isJustAdded ? (
                      <>
                        <Check size={14} />
                        <span>Added!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={13} />
                        <span>Add to cart</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
