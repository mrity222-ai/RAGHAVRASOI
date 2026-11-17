'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import BetterFoodSection from '@/components/BetterFoodSection';
import CategoryGrid from '@/components/CategoryGrid';
import PromoStory from '@/components/PromoStory';
import PromoTrio from '@/components/PromoTrio';
import BestSeller from '@/components/BestSeller';
import CountdownDeal from '@/components/CountdownDeal';
import TriGridShowcase from '@/components/TriGridShowcase';
import Footer from '@/components/Footer';
import LivePurchaseToast from '@/components/LivePurchaseToast';
import ScrollToTop from '@/components/ScrollToTop';
import CartDrawer from '@/components/CartDrawer';
import QuickViewModal from '@/components/QuickViewModal';
import ItemCustomizeModal from '@/components/storefront/ItemCustomizeModal';
import StoreCartDrawer from '@/components/storefront/StoreCartDrawer';
import LiveTokenTrackerModal from '@/components/storefront/LiveTokenTrackerModal';

export default function HomePage() {
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);

  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* 1. Header Navigation Bar (Screenshot 1) */}
      <Header />

      {/* 2. Hero Section (Screenshot 1) */}
      <HeroSection />

      {/* 3. Better Food For More People (Brand Mission & Stats) */}
      <BetterFoodSection />

      {/* 4. Category Grid Showcase (Screenshot 2) */}
      <CategoryGrid />

      {/* 4. Split Promo Story Banner (Screenshot 3) */}
      <PromoStory />

      {/* 5. 3-Column Promo Banner Trio (Screenshot 4) */}
      <PromoTrio />

      {/* 6. Best Seller Product Carousel / Grid (Screenshot 5) */}
      <BestSeller onQuickView={(prod) => setQuickViewProduct(prod)} />

      {/* 7. Special Deal Countdown Banner (Screenshot 6) */}
      <CountdownDeal />

      {/* 8. Tri-Grid Collection Showcase (Screenshot 8) */}
      <TriGridShowcase />

      {/* 9. Complete Footer (Screenshot 7) */}
      <Footer />

      {/* Interactive Overlays & Micro-interactions */}
      <LivePurchaseToast />
      <ScrollToTop />
      <ItemCustomizeModal />
      <StoreCartDrawer />
      <LiveTokenTrackerModal />
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </main>
  );
}
