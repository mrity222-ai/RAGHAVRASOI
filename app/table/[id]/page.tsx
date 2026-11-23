'use client';

import React, { useState, useEffect, use, Suspense } from 'react';
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
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  RefreshCw,
  Search,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import CategoryCarousel from '@/components/storefront/CategoryCarousel';
import MenuFilterToolbar from '@/components/storefront/MenuFilterToolbar';
import ProductCatalogGrid from '@/components/storefront/ProductCatalogGrid';
import ItemCustomizeModal from '@/components/storefront/ItemCustomizeModal';
import StoreCartDrawer from '@/components/storefront/StoreCartDrawer';
import CustomerInvoiceModal from '@/components/storefront/CustomerInvoiceModal';
import LiveTokenTrackerModal from '@/components/storefront/LiveTokenTrackerModal';
import MemberAccountModal from '@/components/storefront/MemberAccountModal';
import { StorefrontCartProvider, useStorefrontCart } from '@/context/StorefrontCartContext';

interface TablePageProps {
  params: Promise<{ id: string }>;
}

function TableLandingPageInner({ params }: TablePageProps) {
  const resolvedParams = use(params);
  const rawId = decodeURIComponent(resolvedParams.id || '').trim();

  const { cart, totals, setIsCartOpen, setTableNo, setOrderType, tableNo } = useStorefrontCart();

  const [tableData, setTableData] = useState<any>(null);
  const [tableNotFound, setTableNotFound] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);

  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDiet, setSelectedDiet] = useState('ALL');
  const [sortMode, setSortMode] = useState('DEFAULT');

  // 1. Verify Table in Database
  useEffect(() => {
    if (!rawId) {
      setTableNotFound(true);
      setTableLoading(false);
      return;
    }

    setTableLoading(true);
    fetch(`/api/table/${encodeURIComponent(rawId)}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setTableData(json.data);
          setTableNotFound(false);
          // Lock table in storefront cart context
          setTableNo(json.data.name);
          setOrderType('IN_TABLE');
          try {
            localStorage.setItem('raghav_active_table', json.data.name);
          } catch {}
        } else {
          setTableNotFound(true);
        }
      })
      .catch((err) => {
        console.error('Error verifying table:', err);
        setTableNotFound(true);
      })
      .finally(() => {
        setTableLoading(false);
      });
  }, [rawId, setTableNo, setOrderType]);

  // 2. Fetch Menu Products
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

  // ================= SCENARIO A: TABLE LOADING =================
  if (tableLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
          <p className="text-sm font-bold text-slate-600">Verifying Table &amp; Loading Raghav Rasoi Menu...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // ================= SCENARIO B: TABLE NOT FOUND / DELETED =================
  if (tableNotFound || !tableData) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
        <Header />
        <div className="flex-1 max-w-xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-md">
            <AlertTriangle size={38} />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
              Table Unavailable
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-serif">
              यह टेबल उपलब्ध नहीं है या हटा दी गई है
            </h1>
            <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              टेबल <strong>&ldquo;{rawId}&rdquo;</strong> सिस्टम में सक्रिय नहीं है। कृपया किसी अन्य टेबल का क्यूआर स्कैन करें या हमारे डिजिटल मेनू से सीधे ऑर्डर करें।
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Link
              href="/menu"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#B45309] hover:bg-[#92400E] text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <UtensilsCrossed size={16} />
              <span>Browse Full Menu</span>
            </Link>

            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs border border-slate-200 transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ================= SCENARIO C: TABLE EXISTS & ACTIVE =================
  const isOccupied = tableData.status === 'OCCUPIED';

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 pb-20 lg:pb-0">
      
      {/* 1. Universal Ranel Header (100% same-to-same with homepage & menu) */}
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* 2. Hero Table QR Welcome Banner matching Screenshot & Brand */}
      <section className="w-full bg-gradient-to-r from-slate-950 via-amber-950 to-slate-900 text-white py-6 sm:py-8 px-4 sm:px-6 shadow-md border-b border-amber-500/20">
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
              You are ordering directly for <strong className="text-amber-300 font-extrabold">{tableData.name}</strong> ({tableData.seats} Seats). Your food will be handcrafted fresh and served right to your table!
            </p>
          </div>

          {/* Active Table Status & Quick Cart CTA */}
          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                {isOccupied ? (
                  <span className="inline-flex items-center gap-1 text-[10px] uppercase font-black text-amber-300 bg-amber-500/30 px-2 py-0.5 rounded-full">
                    <Clock size={10} /> Occupied
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] uppercase font-black text-emerald-300 bg-emerald-500/30 px-2 py-0.5 rounded-full">
                    <CheckCircle2 size={10} /> Available
                  </span>
                )}
              </div>
              <p className="font-mono font-black text-xl text-amber-300">
                {tableData.name}
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

      {/* 3. Occupied Warning Banner if table currently has running orders */}
      {isOccupied && tableData.activeOrder && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-amber-900 font-bold">
            <div className="flex items-center gap-2">
              <Clock size={15} className="text-amber-600 animate-pulse" />
              <span>
                इस टेबल पर सक्रिय ऑर्डर चालू है (Token #{tableData.activeOrder}). आप अतिरिक्त डिशेज़ भी ऑर्डर कर सकते हैं।
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. What's on your mind? Visual Category Carousel */}
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

        {/* 2-Column Mobile & 4-Column Desktop Grid matching Screen 1 */}
        <ProductCatalogGrid products={filteredProducts} />
      </main>

      {/* Floating Bottom Cart Bar for Mobile */}
      {totalQty > 0 && (
        <div className="sm:hidden fixed bottom-4 left-4 right-4 z-40">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-[#B45309] hover:bg-[#92400E] text-white rounded-2xl px-4 py-3.5 shadow-2xl flex items-center justify-between font-black text-xs active:scale-98 transition-all border border-amber-600/30"
          >
            <span className="flex items-center gap-1.5">
              <UtensilsCrossed size={14} className="text-amber-300" />
              <span>{tableData.name} • {totalQty} {totalQty > 1 ? 'ITEMS' : 'ITEM'}</span>
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

      {/* Interactive Overlays & Modals */}
      <ScrollToTop />
      <ItemCustomizeModal />
      <StoreCartDrawer />
      <CustomerInvoiceModal />
      <LiveTokenTrackerModal />
      <MemberAccountModal />

    </div>
  );
}

export default function TableLandingPage({ params }: TablePageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
          <div className="w-10 h-10 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
        </div>
      }
    >
      <StorefrontCartProvider>
        <TableLandingPageInner params={params} />
      </StorefrontCartProvider>
    </Suspense>
  );
}
