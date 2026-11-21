'use client';

import React, { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  UtensilsCrossed,
  ShoppingBag,
  Sparkles,
  QrCode,
  ShieldCheck,
  Clock,
  ChevronRight,
  Check,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryCarousel from '@/components/storefront/CategoryCarousel';
import MenuFilterToolbar from '@/components/storefront/MenuFilterToolbar';
import ProductCatalogGrid from '@/components/storefront/ProductCatalogGrid';
import ItemCustomizeModal from '@/components/storefront/ItemCustomizeModal';
import StoreCartDrawer from '@/components/storefront/StoreCartDrawer';
import CustomerInvoiceModal from '@/components/storefront/CustomerInvoiceModal';
import LiveTokenTrackerModal from '@/components/storefront/LiveTokenTrackerModal';
import { useStorefrontCart } from '@/context/StorefrontCartContext';

interface TablePageProps {
  params: Promise<{ id: string }>;
}

export default function TableLandingPage({ params }: TablePageProps) {
  const resolvedParams = use(params);
  const rawId = decodeURIComponent(resolvedParams.id || '');

  // Format table name cleanly, e.g. "4" -> "Table 4", "table-2" -> "Table 2", "VIP" -> "Table VIP"
  const formattedTable = (() => {
    if (!rawId) return 'Table 1';
    const cleaned = rawId.replace(/[-_]/g, ' ').trim();
    if (cleaned.toLowerCase().startsWith('table')) {
      return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    }
    return `Table ${cleaned}`;
  })();

  const { cart, totals, setIsCartOpen, setTableNo, setOrderType, tableNo } = useStorefrontCart();

  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDiet, setSelectedDiet] = useState('ALL');
  const [sortMode, setSortMode] = useState('DEFAULT');

  // Automatically lock table number and set orderType to IN_TABLE
  useEffect(() => {
    setTableNo(formattedTable);
    setOrderType('IN_TABLE');
    try {
      localStorage.setItem('raghav_active_table', formattedTable);
    } catch {}
  }, [formattedTable, setTableNo, setOrderType]);

  useEffect(() => {
    fetch('/api/menu/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setProducts(data.data);
        }
      })
      .catch((e) => console.error(e));
  }, []);

  // Filter & Sort Products
  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'ALL' && p.categoryId !== selectedCategory) return false;
    if (selectedDiet === 'VEG' && !p.veg) return false;
    if (selectedDiet === 'NON_VEG' && p.veg) return false;
    if (selectedDiet === 'BESTSELLER' && !p.bestseller) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name?.toLowerCase().includes(q);
      const matchDesc = p.desc?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q);
      if (!matchName && !matchDesc) return false;
    }
    return true;
  });

  if (sortMode === 'PRICE_ASC') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortMode === 'PRICE_DESC') {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]/50 text-slate-800 pb-24 lg:pb-0">
      
      {/* Universal Header */}
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Hero Table QR Welcome Banner */}
      <section className="w-full bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white py-6 sm:py-8 px-4 sm:px-6 shadow-md border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-xs">
              <UtensilsCrossed size={14} />
              <span>DINE-IN DIGITAL MENU</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-serif tracking-tight text-white">
              Welcome to <span className="text-amber-400">Raghav Rasoi</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              You are ordering directly from <strong className="text-amber-300 font-extrabold">{formattedTable}</strong>. Your food will be handcrafted fresh and served right to your table!
            </p>
          </div>

          {/* Active Table Badge & Quick Cart CTA */}
          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">
                Assigned Table
              </p>
              <p className="font-mono font-black text-xl text-amber-300 mt-0.5">
                {formattedTable}
              </p>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-3.5 rounded-2xl bg-[#B45309] hover:bg-[#92400E] text-white shadow-lg active:scale-95 transition-all flex items-center gap-2 font-bold text-xs"
            >
              <ShoppingBag size={18} />
              <span className="hidden sm:inline">View Cart</span>
              {totalQty > 0 && (
                <span className="bg-[#FBBF24] text-slate-950 font-black text-[11px] px-2 py-0.5 rounded-full">
                  {totalQty}
                </span>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Category Carousel */}
      <CategoryCarousel
        selectedCategory={selectedCategory}
        onSelectCategory={(id) => setSelectedCategory(id)}
      />

      {/* Main Catalog & Filter Toolbar */}
      <main id="menu-catalog" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        <MenuFilterToolbar
          selectedDiet={selectedDiet}
          onSelectDiet={(diet) => setSelectedDiet(diet)}
          count={filteredProducts.length}
          sortMode={sortMode}
          onSelectSort={(sort) => setSortMode(sort)}
        />

        {/* 2-Column Mobile & 4-Column Desktop Grid matching Screen 1 */}
        <ProductCatalogGrid products={filteredProducts} />
      </main>

      {/* Floating Bottom Cart Bar for Mobile */}
      {totalQty > 0 && (
        <div className="sm:hidden fixed bottom-20 left-4 right-4 z-30">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-[#B45309] text-white rounded-2xl px-4 py-3.5 shadow-xl flex items-center justify-between font-black text-xs active:scale-98"
          >
            <span className="flex items-center gap-1.5">
              <UtensilsCrossed size={14} className="text-amber-300" />
              <span>{formattedTable} • {totalQty} {totalQty > 1 ? 'ITEMS' : 'ITEM'}</span>
            </span>
            <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-xl">
              <span>View Cart (₹{totals.grandTotal})</span>
              <ChevronRight size={14} />
            </span>
          </button>
        </div>
      )}

      {/* Footer */}
      <Footer />

      {/* Modals & Overlays */}
      <ItemCustomizeModal />
      <StoreCartDrawer />
      <CustomerInvoiceModal />
      <LiveTokenTrackerModal />

    </div>
  );
}
