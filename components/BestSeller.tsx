'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, Heart, MoreHorizontal, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface ProductItem {
  id: string | number;
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
  const [selectedColor, setSelectedColor] = useState<Record<string | number, string>>({});
  const [products, setProducts] = useState<ProductItem[]>([
    {
      id: 1,
      title: 'Special Maharaja Thali',
      slug: 'special-maharaja-thali',
      price: 260.0,
      compareAtPrice: 320.0,
      imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
      isSale: true,
      isBestSeller: true,
      description: 'Royal Indian spread: Shahi Paneer, Dal Makhani, 2 Butter Naans, Pulao, Raita, Salad & Sweet.',
    },
    {
      id: 2,
      title: 'Dal Makhani Slow Cooked',
      slug: 'dal-makhani-slow-cooked',
      price: 180.0,
      compareAtPrice: 220.0,
      imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80',
      isSale: true,
      isBestSeller: true,
      description: 'Black lentils slow-cooked overnight with creamy butter, rich tomatoes, and hand-ground spices.',
    },
    {
      id: 3,
      title: 'Shahi Malai Paneer',
      slug: 'shahi-malai-paneer',
      price: 220.0,
      compareAtPrice: 260.0,
      imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80',
      isSale: false,
      isBestSeller: true,
      description: 'Velvety cottage cheese cubes gently cooked in a rich cashew, saffron, and cream gravy.',
    },
    {
      id: 4,
      title: 'Amritsari Kulcha with Chole',
      slug: 'amritsari-kulcha-with-chole',
      price: 140.0,
      compareAtPrice: 180.0,
      imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
      isSale: true,
      isBestSeller: true,
      description: 'Crisp layered tandoori kulcha stuffed with spiced potatoes, served with tangy Pindi chole.',
    },
  ]);

  useEffect(() => {
    fetch('/api/menu/products?bestseller=true')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          const mapped = data.data.slice(0, 4).map((p: any) => ({
            id: p.id,
            title: p.name || p.title,
            slug: p.slug || p.id,
            price: p.price,
            compareAtPrice: p.mrp || p.compareAtPrice,
            imageUrl: p.image || p.imageUrl || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
            isSale: p.isSale !== undefined ? p.isSale : (p.mrp > p.price),
            isBestSeller: p.bestseller || p.isBestSeller,
            description: p.desc || p.description,
          }));
          setProducts(mapped);
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
            RAGHAV RASOI BEST SELLERS
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#777777] font-normal tracking-wide">
            Hand-crafted authentic Indian delicacies prepared fresh daily in Gaur City 1
          </p>
          {/* Salmon / Pink Accent Line */}
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
                  ₹{product.price}
                </span>
                {product.compareAtPrice && (
                  <span className="text-[#888888] line-through text-xs font-normal">
                    ₹{product.compareAtPrice}
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
