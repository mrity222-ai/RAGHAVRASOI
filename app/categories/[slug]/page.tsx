'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ChevronRight,
  Flame,
  Plus,
  Clock,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ItemCustomizeModal from '@/components/storefront/ItemCustomizeModal';
import StoreCartDrawer from '@/components/storefront/StoreCartDrawer';
import LiveTokenTrackerModal from '@/components/storefront/LiveTokenTrackerModal';
import ScrollToTop from '@/components/ScrollToTop';
import { useStorefrontCart } from '@/context/StorefrontCartContext';

interface ProductItem {
  id: string;
  name: string;
  slug?: string;
  price: number;
  mrp?: number;
  image: string;
  veg: boolean;
  bestseller: boolean;
  subCategory?: string;
  story?: string;
  calories?: number;
  prepTime?: string;
}

interface CategoryData {
  category: {
    id: string;
    name: string;
    slug: string;
    image: string;
    totalCount: number;
  };
  subCategories: {
    name: string;
    count: number;
  }[];
  products: ProductItem[];
}

export default function CategoryDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const { addToCart, setIsCartOpen, setCustomizeDish } = useStorefrontCart();

  const [data, setData] = useState<CategoryData | null>(null);
  const [activeSubCat, setActiveSubCat] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/categories/${slug}`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data) {
          setData(resData.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  const category = data?.category;
  const subCategories = data?.subCategories || [];
  const allProducts = data?.products || [];

  // Filter products by selected subCategory
  const displayedProducts =
    activeSubCat === 'ALL'
      ? allProducts
      : allProducts.filter(
          (p) =>
            (p.subCategory || 'Specials').toLowerCase() ===
            activeSubCat.toLowerCase()
        );

  const handleOpenCustomize = (product: ProductItem) => {
    setCustomizeDish({
      id: product.id,
      name: product.name,
      price: product.price,
      mrp: product.mrp || product.price,
      image: product.image,
      veg: product.veg,
      desc: product.story || '',
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-slate-800">
      <Header />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-12 py-6 space-y-6">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            Home
          </Link>
          <ChevronRight size={14} />
          <Link href="/categories" className="hover:text-slate-900 transition-colors">
            Categories
          </Link>
          <ChevronRight size={14} />
          <span className="text-slate-900 font-bold">
            {category?.name || slug}
          </span>
          {activeSubCat !== 'ALL' && (
            <>
              <ChevronRight size={14} />
              <span className="text-[#EA580C] font-extrabold">{activeSubCat}</span>
            </>
          )}
        </nav>

        {/* Cuisine Hero Banner */}
        {category && (
          <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white min-h-[220px] sm:min-h-[260px] flex items-center shadow-xl border border-slate-800">
            <Image
              src={category.image}
              alt={category.name}
              fill
              priority
              className="object-cover object-center filter brightness-[0.4] contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />

            <div className="relative z-10 p-6 sm:p-10 max-w-2xl space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EA580C] text-white font-black text-[10.5px] uppercase tracking-wider">
                <Sparkles size={12} /> CATERED CUISINE
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
                {category.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                Explore authentic {category.name} specialties prepared fresh in our kitchen per order. Select any sub-category below to narrow down your choices.
              </p>
              <div className="pt-2 flex items-center gap-4 text-xs font-bold text-amber-300">
                <span>{category.totalCount} Total Dishes</span>
                <span>•</span>
                <span>{subCategories.length} Sub-Categories</span>
              </div>
            </div>
          </div>
        )}

        {/* Sub-Category Filter Tabs Row */}
        <div className="sticky top-20 z-30 bg-[#FAF7F2]/95 backdrop-blur-md py-3 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-12 lg:px-12 border-b border-slate-200/70">
          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar scroll-smooth">
            {/* All Dishes Tab */}
            <button
              type="button"
              onClick={() => setActiveSubCat('ALL')}
              className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all shadow-xs flex items-center gap-1.5 ${
                activeSubCat === 'ALL'
                  ? 'bg-slate-950 text-white shadow-md scale-105'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80'
              }`}
            >
              <span>All Dishes</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                  activeSubCat === 'ALL' ? 'bg-[#EA580C] text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {allProducts.length}
              </span>
            </button>

            {/* Individual Sub-Category Tabs */}
            {subCategories.map((sub) => {
              const isSelected = activeSubCat.toLowerCase() === sub.name.toLowerCase();
              return (
                <button
                  key={sub.name}
                  type="button"
                  onClick={() => setActiveSubCat(sub.name)}
                  className={`shrink-0 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all shadow-xs flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#EA580C] text-white shadow-md scale-105'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80'
                  }`}
                >
                  <span>{sub.name}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                      isSelected ? 'bg-black/30 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {sub.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Food Items Catalog */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="h-80 rounded-3xl bg-slate-200/60 animate-pulse border border-slate-200"
              />
            ))}
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-slate-200/80 space-y-3">
            <p className="text-base font-bold text-slate-700">
              No dishes found under &quot;{activeSubCat}&quot;.
            </p>
            <button
              onClick={() => setActiveSubCat('ALL')}
              className="px-5 py-2 rounded-full bg-[#EA580C] text-white text-xs font-bold hover:bg-[#C2410C]"
            >
              Show All Dishes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2">
            {displayedProducts.map((dish) => (
              <div
                key={dish.id}
                className="group relative rounded-3xl overflow-hidden bg-white border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                {/* Visual Dish Image (Links to Recipe Detail) */}
                <Link
                  href={`/product/${dish.id}`}
                  className="relative aspect-square w-full overflow-hidden bg-slate-100 block"
                >
                  <Image
                    src={dish.image}
                    alt={dish.name}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Veg / Non-Veg Indicator */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm p-1.5 rounded-lg shadow-sm border border-slate-200 flex items-center justify-center">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        dish.veg ? 'bg-emerald-600' : 'bg-rose-600'
                      }`}
                    />
                  </div>

                  {/* Bestseller Badge */}
                  {dish.bestseller && (
                    <div className="absolute top-3 right-3 bg-[#EA580C] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                      <Flame size={11} fill="currentColor" />
                      <span>Popular</span>
                    </div>
                  )}

                  {/* Sub-Category Tag Badge */}
                  {dish.subCategory && (
                    <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-sm text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm">
                      {dish.subCategory}
                    </div>
                  )}
                </Link>

                {/* Content Box */}
                <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between space-y-3">
                  <div>
                    <Link
                      href={`/product/${dish.id}`}
                      className="block hover:text-[#EA580C] transition-colors"
                    >
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2">
                        {dish.name}
                      </h3>
                    </Link>

                    {dish.story && (
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                        {dish.story}
                      </p>
                    )}

                    {dish.prepTime && (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-semibold mt-2">
                        <Clock size={12} />
                        <span>Ready in {dish.prepTime}</span>
                      </div>
                    )}
                  </div>

                  {/* Pricing & Add To Cart Button */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-black text-base sm:text-lg text-slate-950">
                          ₹{dish.price}
                        </span>
                        {dish.mrp && dish.mrp > dish.price && (
                          <span className="text-xs text-slate-400 line-through">
                            ₹{dish.mrp}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-emerald-700 font-bold block">
                        Customizable
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenCustomize(dish)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#EA580C] hover:bg-[#C2410C] text-white font-black text-xs shadow-sm hover:shadow-md active:scale-95 transition-all"
                    >
                      <Plus size={14} strokeWidth={3} />
                      <span>ADD</span>
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* Global Modals */}
      <ItemCustomizeModal />
      <StoreCartDrawer />
      <LiveTokenTrackerModal />
      <ScrollToTop />
      <Footer />
    </div>
  );
}
