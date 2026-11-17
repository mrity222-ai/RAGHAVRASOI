'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, Heart, MoreHorizontal, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface ProductItem {
  id: number;
  title: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  imageUrl: string;
  isSale: boolean;
  isBestSeller: boolean;
  colors?: string[];
  description?: string;
}

export default function BestSeller({ onQuickView }: { onQuickView?: (product: ProductItem) => void }) {
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState<Record<number, string>>({});
  const [products, setProducts] = useState<ProductItem[]>([
    {
      id: 1,
      title: 'Flame Box',
      slug: 'flame-box',
      price: 60.00,
      compareAtPrice: 70.00,
      imageUrl: '/assets/products/flame-box.png',
      isSale: true,
      isBestSeller: true,
      description: 'Slow-roasted chicken bowl garnished with mint yogurt and saffron rice.',
    },
    {
      id: 2,
      title: 'Urban Bite',
      slug: 'urban-bite',
      price: 60.00,
      compareAtPrice: 70.00,
      imageUrl: '/assets/products/urban-bite.png',
      isSale: true,
      isBestSeller: true,
      colors: ['#000000', '#F5A623', '#8B4513'],
      description: 'Prime char-grilled sirloin steak served with rosemary glaze and chili salsa.',
    },
    {
      id: 3,
      title: 'Spice Zone',
      slug: 'spice-zone-burger',
      price: 60.00,
      compareAtPrice: 70.00,
      imageUrl: '/assets/products/spice-zone-burger.png',
      isSale: true,
      isBestSeller: true,
      description: 'Signature grass-fed beef burger topped with crispy bacon and farm-fresh fried egg.',
    },
    {
      id: 4,
      title: 'Spice Zone',
      slug: 'spice-zone-hotdog',
      price: 70.00,
      compareAtPrice: 80.00,
      imageUrl: '/assets/products/spice-zone-hotdog.png',
      isSale: true,
      isBestSeller: true,
      description: 'Gourmet pork frankfurter nestled in soft brioche, dressed with melted cheddar and jalapeño relish.',
    },
  ]);

  useEffect(() => {
    fetch('/api/products?best_seller=true')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          setProducts(data.data);
        }
      })
      .catch((err) => console.log('Using fallback for products', err));
  }, []);

  return (
    <section id="best-seller" className="w-full bg-white py-12 lg:py-16 border-b border-[#E8E2D5]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-black tracking-[0.14em] uppercase">
            BEST SELLER
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#777777] font-normal tracking-wide">
            Folor sit amet, consectetur adipiscing elit
          </p>
          {/* Salmon / Pink Accent Line from screenshot 5 */}
          <div className="w-12 h-[2px] bg-[#E57373] mt-3"></div>
        </div>

        {/* 4-Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col items-center bg-white p-4 relative rounded-sm transition-all duration-300"
            >
              {/* Corner Sale Ribbon */}
              {product.isSale && (
                <div className="corner-ribbon">
                  <span className="corner-ribbon-text">Sale</span>
                </div>
              )}

              {/* Product Image Area */}
              <div className="relative w-full h-[220px] sm:h-[240px] bg-[#FBFBFA] flex items-center justify-center p-4 overflow-hidden rounded-sm">
                <Link href={`/product/${product.slug || product.id}`} className="block relative w-full h-full cursor-pointer">
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    className="object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                {/* Floating Action Pill on hover (from screenshot 5 Urban Bite) */}
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex items-center space-x-1 bg-white/95 backdrop-blur-sm border border-[#E5E0D5] px-2 py-1 rounded-full shadow-md opacity-90 sm:opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    onClick={() => onQuickView && onQuickView(product)}
                    className="p-1.5 hover:text-ranel-red text-black transition-colors rounded-full"
                    title="Quick Details"
                  >
                    <MoreHorizontal size={14} />
                  </button>
                  <button
                    onClick={() => onQuickView && onQuickView(product)}
                    className="p-1.5 hover:text-ranel-red text-black transition-colors rounded-full"
                    title="Zoom View"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    className="p-1.5 hover:text-ranel-red text-black transition-colors rounded-full"
                    title="Add to Wishlist"
                  >
                    <Heart size={14} />
                  </button>
                  <button
                    onClick={() =>
                      addToCart({
                        id: product.id,
                        title: product.title,
                        price: product.price,
                        imageUrl: product.imageUrl,
                        color: selectedColor[product.id],
                      })
                    }
                    className="p-1.5 hover:text-ranel-red text-black transition-colors rounded-full"
                    title="Add to Cart"
                  >
                    <ShoppingCart size={14} />
                  </button>
                </div>
              </div>

              {/* Color Swatches (if available, e.g. Urban Bite in Screenshot 5) */}
              {product.colors && product.colors.length > 0 && (
                <div className="flex items-center space-x-1.5 mt-3">
                  {product.colors.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() =>
                        setSelectedColor((prev) => ({ ...prev, [product.id]: color }))
                      }
                      style={{ backgroundColor: color }}
                      className={`w-3.5 h-3.5 rounded-full border transition-all ${
                        selectedColor[product.id] === color
                          ? 'ring-2 ring-offset-1 ring-black scale-110'
                          : 'border-gray-300'
                      }`}
                      aria-label={`Color option ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Product Title */}
              <Link href={`/product/${product.slug || product.id}`}>
                <h3 className="font-heading text-sm font-bold text-black tracking-wider text-center mt-3 uppercase hover:text-ranel-red transition-colors">
                  {product.title}
                </h3>
              </Link>

              {/* Price with Discount */}
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-ranel-red font-bold text-xs sm:text-[13px]">
                  ${product.price.toFixed(2)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-[#888888] line-through text-xs font-normal">
                    ${product.compareAtPrice.toFixed(2)}
                  </span>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
