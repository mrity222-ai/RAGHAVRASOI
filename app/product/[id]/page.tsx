'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import ItemCustomizeModal from '@/components/storefront/ItemCustomizeModal';
import StoreCartDrawer from '@/components/storefront/StoreCartDrawer';
import LiveTokenTrackerModal from '@/components/storefront/LiveTokenTrackerModal';
import { useStorefrontCart } from '@/context/StorefrontCartContext';
import {
  ChevronRight,
  Clock,
  Flame,
  Star,
  Heart,
  Plus,
  Minus,
  Info,
  Check,
  ShoppingBag,
  Sparkles,
  Utensils,
  Share2,
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const { addToCart, setIsCartOpen, setCustomizeDish } = useStorefrontCart();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Portion size selection
  const [selectedPortion, setSelectedPortion] = useState<{ label: string; extra: number }>({
    label: 'Regular',
    extra: 0,
  });

  // Spice level selection (Mild, Medium, Hot)
  const [spiceLevel, setSpiceLevel] = useState<'Mild' | 'Medium' | 'Hot'>('Medium');

  // Quantity
  const [quantity, setQuantity] = useState(1);

  // Wishlist toggle
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Active Tab: Description | Nutritional Info | Delivery Info | Reviews
  const [activeTab, setActiveTab] = useState<'desc' | 'nutrition' | 'delivery' | 'reviews'>('desc');

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    fetch(`/api/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setProduct(data.data);
          setSelectedPortion({ label: 'Regular', extra: 0 });
          setActiveImageIndex(0);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF9F5]">
        <Header />
        <div className="flex-1 flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-[#C83818] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-bold text-slate-500">Loading recipe details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF9F5]">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center py-24 text-center px-4">
          <Utensils size={48} className="text-slate-300 mb-3" />
          <h2 className="text-2xl font-black text-slate-900">Dish Not Found</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            We couldn&apos;t find this dish. It might have been updated or removed from the menu.
          </p>
          <Link
            href="/menu"
            className="mt-5 px-6 py-3 rounded-full bg-[#C83818] text-white font-extrabold text-xs shadow-md hover:bg-[#A82A0F] transition-colors"
          >
            Explore Menu
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Portion options
  const portionOptions = [
    { label: 'Regular', extra: 0 },
    { label: 'Large (+$2)', extra: 2 },
    { label: 'Family (+$6)', extra: 6 },
  ];

  const currentUnitPrice = product.price + selectedPortion.extra;
  const currentTotalPrice = (currentUnitPrice * quantity).toFixed(2);
  const currentStrikethrough = product.mrp
    ? (product.mrp + selectedPortion.extra).toFixed(2)
    : (currentUnitPrice * 1.25).toFixed(2);

  const images = product.galleryImages || [product.image];

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: `${product.name} (${selectedPortion.label}, ${spiceLevel} Spice)`,
      qty: quantity,
      size: selectedPortion.label,
      addons: [`Spice Level: ${spiceLevel}`],
      unitPrice: currentUnitPrice,
      image: product.image,
    });
    setIsCartOpen(true);
  };

  const handleOrderNowSkipCart = () => {
    addToCart({
      productId: product.id,
      name: `${product.name} (${selectedPortion.label}, ${spiceLevel} Spice)`,
      qty: quantity,
      size: selectedPortion.label,
      addons: [`Spice Level: ${spiceLevel}`],
      unitPrice: currentUnitPrice,
      image: product.image,
    });
    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-slate-800 antialiased font-sans">
      <Header />

      {/* 1. Breadcrumbs */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <nav className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <ChevronRight size={12} className="text-slate-400" />
          <Link href="/categories" className="hover:text-black transition-colors">Categories</Link>
          <ChevronRight size={12} className="text-slate-400" />
          {product.category && (
            <>
              <Link
                href={`/categories/${product.category.slug || product.category.id.replace('cat-', '')}`}
                className="hover:text-black transition-colors"
              >
                {product.category.name}
              </Link>
              <ChevronRight size={12} className="text-slate-400" />
            </>
          )}
          {product.subCategory && (
            <>
              <Link
                href={`/categories/${product.category?.slug || 'menu'}?subCategory=${encodeURIComponent(product.subCategory)}`}
                className="text-[#EA580C] font-semibold hover:underline"
              >
                {product.subCategory}
              </Link>
              <ChevronRight size={12} className="text-slate-400" />
            </>
          )}
          <span className="font-bold text-slate-900 truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
        </nav>
      </div>

      {/* 2. Top Product Hero Section (Exact Match to Screenshot) */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* Left Column: Big Main Image + Row of Small Thumbnails Below */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Main Big Food Image Container */}
            <div className="relative w-full aspect-square rounded-3xl bg-[#EFECE6] flex items-center justify-center p-8 sm:p-12 overflow-hidden shadow-xs transition-all">
              <Image
                src={images[activeImageIndex] || product.image}
                alt={product.name}
                fill
                priority
                className="object-contain p-6 transform hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Row of Small Thumbnails Underneath (Chhote Chhote Images) */}
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pt-1">
              {images.map((imgUrl: string, idx: number) => {
                const isActive = activeImageIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-[#EFECE6] p-2 flex items-center justify-center shrink-0 transition-all border-2 ${
                      isActive
                        ? 'border-[#C83818] ring-2 ring-[#C83818]/25 scale-105 shadow-sm'
                        : 'border-transparent hover:border-slate-300 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={imgUrl}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                  </button>
                );
              })}
            </div>

          </div>

          {/* Right Column: Title, Rating, Price, Portions, Spice, Quantity, Add to Cart */}
          <div className="lg:col-span-6 space-y-5">
            
            {/* Category & Badge */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500">
                {product.category?.name || 'Cuisine'}
                {product.subCategory ? ` • ${product.subCategory}` : ''} • Bestseller
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Rating & Reviews + Prep Time */}
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <div className="flex items-center text-amber-500">
                  <Star size={14} fill="#F59E0B" />
                  <Star size={14} fill="#F59E0B" />
                  <Star size={14} fill="#F59E0B" />
                  <Star size={14} fill="#F59E0B" />
                  <Star size={14} fill="#F59E0B" />
                </div>
                <span>4.8</span>
                <span className="text-slate-500 font-normal">(412 reviews)</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1 text-slate-600 font-medium">
                <Clock size={13} className="text-slate-500" />
                <span>12-15 min prep</span>
              </div>
            </div>

            {/* Price & Discount Pill */}
            <div className="flex items-center gap-3 pt-1">
              <span className="font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
                ${currentUnitPrice.toFixed(2)}
              </span>
              <span className="text-base text-slate-400 line-through font-medium">
                ${currentStrikethrough}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#C83818] text-white">
                18% OFF
              </span>
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
              {product.desc || product.description || 'Double smashed beef patty, melted cheddar, crisp iceberg lettuce, pickles and our house burger sauce on a toasted brioche bun.'}
            </p>

            {/* Portion Size Selection */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-extrabold text-slate-900">
                Portion Size
              </label>
              <div className="flex flex-wrap gap-2.5">
                {portionOptions.map((opt) => {
                  const isSelected = selectedPortion.label === opt.label;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => setSelectedPortion(opt)}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-[#C83818] text-white shadow-xs'
                          : 'bg-white border border-slate-300 text-slate-700 hover:border-slate-400'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Spice Level Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-slate-900">
                Spice Level
              </label>
              <div className="flex flex-wrap gap-2.5">
                {(['Mild', 'Medium', 'Hot'] as const).map((lvl) => {
                  const isSelected = spiceLevel === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSpiceLevel(lvl)}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-[#C83818] text-white shadow-xs'
                          : 'bg-white border border-slate-300 text-slate-700 hover:border-slate-400'
                      }`}
                    >
                      {lvl}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector + Add to Cart + Heart Wishlist Button */}
            <div className="pt-2 flex items-center gap-3">
              {/* Quantity [- 1 +] */}
              <div className="inline-flex items-center bg-white border border-slate-300 rounded-full px-2 py-1.5 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded-full hover:bg-slate-100 text-slate-700 font-black text-sm flex items-center justify-center transition-colors"
                >
                  <Minus size={13} />
                </button>
                <span className="w-8 text-center font-bold text-xs text-slate-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 rounded-full hover:bg-slate-100 text-slate-700 font-black text-sm flex items-center justify-center transition-colors"
                >
                  <Plus size={13} />
                </button>
              </div>

              {/* Big Red/Rust Add to Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-6 rounded-full bg-[#C83818] hover:bg-[#A82A0F] text-white font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-98 text-center"
              >
                Add to Cart ${currentTotalPrice}
              </button>

              {/* Wishlist Heart Button */}
              <button
                type="button"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`w-11 h-11 rounded-full border flex items-center justify-center transition-colors ${
                  isWishlisted
                    ? 'border-rose-400 bg-rose-50 text-[#C83818]'
                    : 'border-slate-300 bg-white hover:border-slate-400 text-slate-600'
                }`}
                title="Save to Wishlist"
              >
                <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Order Now - Skip the Cart Button */}
            <div>
              <button
                type="button"
                onClick={handleOrderNowSkipCart}
                className="w-full py-3 px-5 rounded-full border border-slate-800 bg-transparent hover:bg-slate-900 hover:text-white text-slate-900 font-extrabold text-xs tracking-wide transition-all shadow-2xs"
              >
                Order Now • Skip the Cart
              </button>
            </div>

            {/* Delivery Info Subtext */}
            <div className="pt-2 space-y-1 text-[11px] text-slate-500">
              <p className="flex items-center gap-1.5">
                <Info size={13} className="text-slate-400 shrink-0" />
                <span>Delivered in 25-30 min • Free delivery over $25</span>
              </p>
              <p className="text-slate-400 pl-4.5">
                Freshly prepared: cancellations accepted within 2 min of ordering
              </p>
            </div>

          </div>

        </div>

        {/* 3. Tabs Section: Description | Nutritional Info | Delivery Info | Reviews (412) */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-6">
          
          {/* Tab Navigation Strip */}
          <div className="flex items-center gap-8 border-b border-slate-200 overflow-x-auto no-scrollbar text-xs sm:text-sm font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('desc')}
              className={`pb-3 transition-colors relative whitespace-nowrap ${
                activeTab === 'desc'
                  ? 'text-slate-900 font-extrabold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Description
              {activeTab === 'desc' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C83818]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('nutrition')}
              className={`pb-3 transition-colors relative whitespace-nowrap ${
                activeTab === 'nutrition'
                  ? 'text-slate-900 font-extrabold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Nutritional Info
              {activeTab === 'nutrition' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C83818]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('delivery')}
              className={`pb-3 transition-colors relative whitespace-nowrap ${
                activeTab === 'delivery'
                  ? 'text-slate-900 font-extrabold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Delivery Info
              {activeTab === 'delivery' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C83818]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 transition-colors relative whitespace-nowrap ${
                activeTab === 'reviews'
                  ? 'text-slate-900 font-extrabold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Reviews (412)
              {activeTab === 'reviews' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C83818]" />
              )}
            </button>
          </div>

          {/* Active Tab: Description */}
          {activeTab === 'desc' && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  About this dish
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed max-w-4xl">
                  {product.story || `Our Cheesy Beef Burger starts with two smashed beef patties, seared for a deep caramelized crust, then layered with melted cheddar, crisp iceberg lettuce, pickles and a tangy house burger sauce — all stacked on a lightly toasted brioche bun. Made fresh per order in our kitchen, never frozen or pre-assembled.`}
                </p>
              </div>

              {/* 4 Clean Metric Cards Matching Screenshot */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-slate-200/80">
                  <p className="text-[10px] font-bold uppercase text-slate-500">Calories</p>
                  <p className="font-extrabold text-sm sm:text-base text-slate-900 mt-0.5">
                    {product.calories || 620} kcal
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-slate-200/80">
                  <p className="text-[10px] font-bold uppercase text-slate-500">Prep Time</p>
                  <p className="font-extrabold text-sm sm:text-base text-slate-900 mt-0.5">
                    {product.prepTime || '12-15 min'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-slate-200/80">
                  <p className="text-[10px] font-bold uppercase text-slate-500">Serves</p>
                  <p className="font-extrabold text-sm sm:text-base text-slate-900 mt-0.5">
                    {product.serves || '1 person'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-slate-200/80">
                  <p className="text-[10px] font-bold uppercase text-slate-500">Spice</p>
                  <p className="font-extrabold text-sm sm:text-base text-slate-900 mt-0.5">
                    {product.spice || 'Customizable'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Active Tab: Nutritional Info */}
          {activeTab === 'nutrition' && (
            <div className="space-y-4 animate-in fade-in text-xs sm:text-sm">
              <h3 className="font-extrabold text-slate-900">Nutritional Facts (Per Serving)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[11px] text-slate-500">Protein</p>
                  <p className="font-bold text-slate-900 text-sm">34g</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[11px] text-slate-500">Carbohydrates</p>
                  <p className="font-bold text-slate-900 text-sm">48g</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[11px] text-slate-500">Total Fat</p>
                  <p className="font-bold text-slate-900 text-sm">28g</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[11px] text-slate-500">Sodium</p>
                  <p className="font-bold text-slate-900 text-sm">890mg</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                Allergen Note: Contains dairy, gluten, and eggs. Prepared in a facility handling sesame seeds.
              </p>
            </div>
          )}

          {/* Active Tab: Delivery Info */}
          {activeTab === 'delivery' && (
            <div className="space-y-3 animate-in fade-in text-xs sm:text-sm text-slate-600">
              <h3 className="font-extrabold text-slate-900">Fulfillment &amp; Kitchen Information</h3>
              <p>• <strong>Table Service:</strong> Enter your Table number in the cart and our waitstaff will deliver your meal hot to your seat within 12-15 minutes.</p>
              <p>• <strong>Doorstep Delivery:</strong> Packed in thermal heat-sealed boxes to maintain crunch and temperature. Dispatched via priority express courier.</p>
            </div>
          )}

          {/* Active Tab: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-3 animate-in fade-in text-xs sm:text-sm text-slate-600">
              <p>412 Verified customer reviews available below in the Customer Reviews section.</p>
            </div>
          )}

        </section>

        {/* 4. Customer Reviews Section (Exact Match to Screenshot) */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Customer Reviews
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Rating Summary Card */}
            <div className="lg:col-span-4 space-y-4">
              <div>
                <span className="font-black text-5xl text-slate-900">4.8</span>
                <div className="flex items-center text-amber-500 gap-1 my-1.5">
                  <Star size={16} fill="#F59E0B" />
                  <Star size={16} fill="#F59E0B" />
                  <Star size={16} fill="#F59E0B" />
                  <Star size={16} fill="#F59E0B" />
                  <Star size={16} fill="#F59E0B" />
                </div>
                <p className="text-xs text-slate-500">Based on 412 reviews</p>
              </div>

              {/* Star Breakdown Bars */}
              <div className="space-y-1.5 text-xs text-slate-600 max-w-xs">
                {[
                  { star: 5, pct: '75%' },
                  { star: 4, pct: '18%' },
                  { star: 3, pct: '5%' },
                  { star: 2, pct: '1%' },
                  { star: 1, pct: '1%' },
                ].map((b) => (
                  <div key={b.star} className="flex items-center gap-2.5">
                    <span className="w-2.5 font-bold">{b.star}</span>
                    <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-[#C83818] rounded-full"
                        style={{ width: b.pct }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Individual Reviews List */}
            <div className="lg:col-span-8 space-y-5 divide-y divide-slate-100">
              {(product.reviews || [
                {
                  name: 'Sarah M.',
                  rating: 5,
                  comment: "Best cheeseburger I've had in town — arrived hot, patty was juicy.",
                },
                {
                  name: 'James K.',
                  rating: 5,
                  comment: 'Great portion size, and the spice level options are a nice touch.',
                },
                {
                  name: 'Aisha R.',
                  rating: 4,
                  comment: "Really good, would've liked a slightly more sauce but still great.",
                },
              ]).map((rev: any, idx: number) => (
                <div key={idx} className={idx > 0 ? 'pt-4 space-y-1.5' : 'space-y-1.5'}>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-amber-500">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} size={12} fill="#F59E0B" />
                      ))}
                    </div>
                    <span className="font-extrabold text-xs text-slate-900">{rev.name}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* 5. "You Might Also Like" Section (Exact Match to Screenshot) */}
        <section className="space-y-6 pt-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              You Might Also Like
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Popular pairings with this dish
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(product.relatedProducts || []).map((item: any) => (
              <div
                key={item.id}
                className="group bg-white rounded-3xl p-5 border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Image Area with Top Right Wishlist Heart */}
                  <div className="relative aspect-square rounded-2xl bg-[#EFECE6] flex items-center justify-center p-6 overflow-hidden mb-4">
                    <Link href={`/product/${item.id}`} className="relative w-full h-full block">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                    <button
                      type="button"
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-500 hover:text-[#C83818] flex items-center justify-center shadow-2xs transition-colors"
                      title="Favorite"
                    >
                      <Heart size={14} />
                    </button>
                  </div>

                  {/* Title & Description */}
                  <Link href={`/product/${item.id}`}>
                    <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-[#C83818] transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                    {item.desc || item.description || 'Crispy & freshly prepared'}
                  </p>

                  {/* Rating & Prep Time */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-600 mt-2">
                    <span className="flex items-center gap-1 font-bold text-slate-800">
                      <Star size={11} fill="#F59E0B" className="text-amber-500" />
                      <span>{item.rating || 4.9}</span>
                      <span className="text-slate-400 font-normal">({item.reviewsCount || 189})</span>
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock size={11} />
                      <span>{item.prepTime || '10-12 min'}</span>
                    </span>
                  </div>
                </div>

                {/* Price & Round [+] Add Button */}
                <div className="pt-4 flex items-center justify-between border-t border-slate-100 mt-4">
                  <span className="font-extrabold text-base text-slate-900">
                    ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      addToCart({
                        productId: item.id,
                        name: item.name,
                        qty: 1,
                        size: 'Regular',
                        addons: [],
                        unitPrice: item.price,
                        image: item.image,
                      });
                      setIsCartOpen(true);
                    }}
                    className="w-8 h-8 rounded-full bg-[#C83818] hover:bg-[#A82A0F] text-white flex items-center justify-center shadow-xs transition-transform active:scale-90"
                    title="Add to Cart"
                  >
                    <Plus size={16} strokeWidth={2.5} />
                  </button>
                </div>

              </div>
            ))}
          </div>
        </section>

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
