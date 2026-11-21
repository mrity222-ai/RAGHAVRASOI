'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import CategoryGrid from '@/components/CategoryGrid';
import PopularFoodsSection from '@/components/PopularFoodsSection';
import DrinksSection from '@/components/DrinksSection';
import BetterFoodSection from '@/components/BetterFoodSection';
import CountdownDeal from '@/components/CountdownDeal';
import PromoStory from '@/components/PromoStory';
import Footer from '@/components/Footer';
import LivePurchaseToast from '@/components/LivePurchaseToast';
import ScrollToTop from '@/components/ScrollToTop';
import QuickViewModal from '@/components/QuickViewModal';
import ItemCustomizeModal from '@/components/storefront/ItemCustomizeModal';
import StoreCartDrawer from '@/components/storefront/StoreCartDrawer';
import CustomerInvoiceModal from '@/components/storefront/CustomerInvoiceModal';
import LiveTokenTrackerModal from '@/components/storefront/LiveTokenTrackerModal';

export default function HomePage() {
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);

  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* Universal Raghav Rasoi Header Navigation */}
      <Header />

      {/* Section 1: Hero Section */}
      <HeroSection />

      {/* Section 2: Our Food Categories (Horizontal Category Carousel with Arrows) */}
      <CategoryGrid />

      {/* Section 3: Popular Foods (4-Column Grid with Image, Heart, Price & Add to cart) */}
      <PopularFoodsSection />

      {/* Section 4: Drinks (4-Column Grid with Image, Heart, Price & Add to cart) */}
      <DrinksSection />

      {/* Section 5: Heritage & Pure Quality Highlight (Pure Desi Ghee, Clay Tandoor, Hand-Ground Spices) */}
      <BetterFoodSection />

      {/* Section 6: Promotional Shahi Thali Feast Banner (Live Countdown Deal) */}
      <CountdownDeal />

      {/* Section 7: Order Now & Traditional Taste Showcase */}
      <PromoStory />

      {/* Section 8: Footer */}
      <Footer />

      {/* Interactive Overlays & Order Flow */}
      <LivePurchaseToast />
      <ScrollToTop />
      <ItemCustomizeModal />
      <StoreCartDrawer />
      <CustomerInvoiceModal />
      <LiveTokenTrackerModal />
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </main>
  );
}
