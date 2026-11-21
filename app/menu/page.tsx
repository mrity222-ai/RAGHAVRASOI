'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { StorefrontCartProvider, useStorefrontCart } from '@/context/StorefrontCartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import HeroPickupBanner from '@/components/storefront/HeroPickupBanner';
import CategoryCarousel from '@/components/storefront/CategoryCarousel';
import MenuFilterToolbar from '@/components/storefront/MenuFilterToolbar';
import ProductCatalogGrid from '@/components/storefront/ProductCatalogGrid';
import ItemCustomizeModal from '@/components/storefront/ItemCustomizeModal';
import StoreCartDrawer from '@/components/storefront/StoreCartDrawer';
import CustomerInvoiceModal from '@/components/storefront/CustomerInvoiceModal';
import LiveTokenTrackerModal from '@/components/storefront/LiveTokenTrackerModal';
import MemberAccountModal from '@/components/storefront/MemberAccountModal';
import { ChevronRight } from 'lucide-react';

function MenuStorefrontContent() {
  const searchParams = useSearchParams();
  const tableQuery = searchParams.get('table');

  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDiet, setSelectedDiet] = useState('ALL');
  const [sortMode, setSortMode] = useState('DEFAULT');
  const { cart, totals, setIsCartOpen, settings, setTableNo, setOrderType, tableNo } = useStorefrontCart();

  useEffect(() => {
    if (tableQuery) {
      const formatted = tableQuery.toLowerCase().startsWith('table')
        ? tableQuery.charAt(0).toUpperCase() + tableQuery.slice(1)
        : `Table ${tableQuery}`;
      setTableNo(formatted);
      setOrderType('IN_TABLE');
      try {
        localStorage.setItem('raghav_active_table', formatted);
      } catch {}
    }
  }, [tableQuery, setTableNo, setOrderType]);

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

  // Filter & Sort
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
    <div className="min-h-screen flex flex-col bg-white text-slate-800 pb-20 lg:pb-0">
      
      {/* 1. Universal Ranel Header (100% same-to-same with homepage) */}
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* 2. Hero Banner & Self-Pickup Notice */}
      <HeroPickupBanner />

      {/* 3. What's on your mind? Visual Category Carousel */}
      <CategoryCarousel
        selectedCategory={selectedCategory}
        onSelectCategory={(id) => setSelectedCategory(id)}
      />

      {/* 5. Menu Catalog Grid & Filters */}
      <main id="menu-catalog" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        <MenuFilterToolbar
          selectedDiet={selectedDiet}
          onSelectDiet={(diet) => setSelectedDiet(diet)}
          count={filteredProducts.length}
          sortMode={sortMode}
          onSelectSort={(sort) => setSortMode(sort)}
        />

        <ProductCatalogGrid products={filteredProducts} />
      </main>

      {/* Floating Bottom Cart Bar for Mobile (positioned above floating nav bar) */}
      {totalQty > 0 && (
        <div className="sm:hidden fixed bottom-20 left-4 right-4 z-30">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-[#E5203A] text-white rounded-2xl px-4 py-3.5 shadow-xl flex items-center justify-between font-extrabold text-xs active:scale-98"
          >
            <span>
              {totalQty} ITEM{totalQty > 1 ? 'S' : ''} • ₹{totals.grandTotal}
            </span>
            <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-xl">
              View Cart <ChevronRight size={14} />
            </span>
          </button>
        </div>
      )}

      {/* Modals & Overlays */}
      <ItemCustomizeModal />
      <StoreCartDrawer />
      <CustomerInvoiceModal />
      <LiveTokenTrackerModal />
      <MemberAccountModal />
      <ScrollToTop />

      {/* 6. Universal Ranel Footer (100% same-to-same with homepage) */}
      <Footer />

    </div>
  );
}

export default function StorefrontMenuPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <MenuStorefrontContent />
    </Suspense>
  );
}
