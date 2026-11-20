'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import BetterFoodSection from '@/components/BetterFoodSection';
import CategoryGrid from '@/components/CategoryGrid';
import BestSeller from '@/components/BestSeller';
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

      {/* Section 1: Top Hero Banner (Authentic Indian Kitchen · Gaur City 1) */}
      <HeroSection />

      {/* Section 2: Heritage & Pure Quality Highlight (Pure Desi Ghee, Clay Tandoor, Hand-Ground Spices) */}
      <BetterFoodSection />

      {/* Section 3: Our Categories (हमारी कैटेगरी - Live Dynamic Grid) */}
      <CategoryGrid />

      {/* Section 4: Our Products / Best Sellers (हमारे जो प्रोडक्ट हैं - with Admin Controlled SALE Badge & INR ₹) */}
      <BestSeller onQuickView={(prod) => setQuickViewProduct(prod)} />

      {/* Section 5: Promotional Shahi Thali Feast Banner (बैनर वाला रहेगा - Live Countdown Deal) */}
      <CountdownDeal />

      {/* Section 6: Order Now & Traditional Taste Showcase (नॉर्मल ऑर्डर नाउ) */}
      <PromoStory />

      {/* Footer */}
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
