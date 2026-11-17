'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, UtensilsCrossed, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ItemCustomizeModal from '@/components/storefront/ItemCustomizeModal';
import StoreCartDrawer from '@/components/storefront/StoreCartDrawer';
import LiveTokenTrackerModal from '@/components/storefront/LiveTokenTrackerModal';
import ScrollToTop from '@/components/ScrollToTop';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
  subCategories: string[];
}

export default function CategoriesHubPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setCategories(data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-slate-800">
      <Header />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-12 py-8 space-y-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            Home
          </Link>
          <ChevronRight size={14} />
          <Link href="/menu" className="hover:text-slate-900 transition-colors">
            Menu
          </Link>
          <ChevronRight size={14} />
          <span className="text-slate-900 font-bold">Categories</span>
        </nav>

        {/* Hero Banner for Categories Hub */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-stone-900 to-black text-white p-8 sm:p-12 shadow-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EA580C] text-white font-extrabold text-[11px] uppercase tracking-wider">
              <UtensilsCrossed size={12} /> Culinary Collections
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Explore By Category & Cuisine
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              From sizzling Chinese woks to crisp South Indian dosas, gourmet burgers, and rich authentic curries — select any category below to discover its specialized sub-categories and dishes.
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <div className="px-5 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <p className="font-black text-2xl text-[#FBBF24]">{categories.length}</p>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Cuisines</p>
            </div>
            <div className="px-5 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <p className="font-black text-2xl text-[#EA580C]">100%</p>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Fresh Made</p>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-72 rounded-3xl bg-slate-200/60 animate-pulse border border-slate-200"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-2">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="group relative rounded-3xl overflow-hidden bg-white border border-slate-200/80 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                {/* Visual Category Photo */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                  {/* Badge: Item Count */}
                  <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-slate-900 font-extrabold text-[11px] px-3 py-1 rounded-full shadow-sm">
                    {cat.productCount} Dishes
                  </span>

                  {/* Category Name over Image */}
                  <div className="absolute bottom-4 left-5 right-5">
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight drop-shadow-md">
                      {cat.name}
                    </h2>
                  </div>
                </div>

                {/* Sub-Category Preview Tags & Action */}
                <div className="p-5 space-y-4 bg-white">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Included Sub-Categories
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.subCategories.length > 0 ? (
                        cat.subCategories.map((sub) => (
                          <span
                            key={sub}
                            className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold group-hover:bg-[#EA580C]/10 group-hover:text-[#EA580C] transition-colors"
                          >
                            {sub}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">Chef Specials</span>
                      )}
                    </div>
                  </div>

                  {/* Explore Button */}
                  <div className="pt-2 flex items-center justify-between text-xs sm:text-sm font-extrabold text-[#EA580C] border-t border-slate-100 group-hover:text-[#C2410C]">
                    <span>Explore Sub-Categories & Menu</span>
                    <ArrowRight size={16} className="transform group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </Link>
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
