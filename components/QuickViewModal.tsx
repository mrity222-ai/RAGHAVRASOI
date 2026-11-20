'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, ShoppingBag, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface QuickViewProps {
  product: {
    id: number;
    title: string;
    price: number;
    compareAtPrice?: number;
    imageUrl: string;
    description?: string;
    colors?: string[];
  } | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewProps) {
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product?.colors?.[0]
  );
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal Content */}
      <div className="relative bg-white max-w-2xl w-full rounded-sm shadow-2xl overflow-hidden border border-[#ECE5D8] z-10 animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#888] hover:text-black p-1 transition-colors z-20"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="relative h-[280px] md:h-full bg-[#FAF5EC] flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-[#EAE3D3]">
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              className="object-contain p-6"
            />
          </div>

          {/* Details */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-1 text-amber-500 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
                <span className="text-xs text-[#777] ml-2">(4.9/5 Reviews)</span>
              </div>

              <h2 className="font-heading text-2xl font-bold text-black tracking-wide uppercase">
                {product.title}
              </h2>

              <div className="flex items-center space-x-2 mt-2">
                <span className="text-ranel-red font-bold text-lg">
                  ₹{product.price}
                </span>
                {product.compareAtPrice && (
                  <span className="text-[#888] line-through text-sm">
                    ₹{product.compareAtPrice}
                  </span>
                )}
              </div>

              <p className="mt-4 text-xs text-[#666] leading-relaxed">
                {product.description ||
                  'Freshly prepared with premium natural ingredients, authentic spices, and cooked to perfection for a memorable dining experience.'}
              </p>

              {/* Color swatches if any */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-4">
                  <span className="text-[11px] font-bold text-black uppercase tracking-wider block mb-1.5">
                    Select Flavor / Style:
                  </span>
                  <div className="flex items-center space-x-2">
                    {product.colors.map((c, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedColor(c)}
                        style={{ backgroundColor: c }}
                        className={`w-5 h-5 rounded-full border transition-all ${
                          selectedColor === c
                            ? 'ring-2 ring-offset-2 ring-black scale-110'
                            : 'border-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mt-5 flex items-center space-x-3">
                <span className="text-[11px] font-bold text-black uppercase tracking-wider">
                  Quantity:
                </span>
                <div className="flex items-center border border-[#CCC] rounded-sm">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-2.5 py-1 text-sm hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-2.5 py-1 text-sm hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Add to Cart CTA */}
            <div className="mt-6 pt-4 border-t border-[#EAE3D3]">
              <button
                onClick={() => {
                  addToCart({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    imageUrl: product.imageUrl,
                    quantity: quantity,
                    color: selectedColor,
                  });
                  onClose();
                }}
                className="w-full bg-black hover:bg-[#222] text-white text-xs font-bold tracking-[0.16em] py-3.5 rounded-full uppercase shadow-md flex items-center justify-center space-x-2 transition-all transform active:scale-98"
              >
                <ShoppingBag size={15} />
                <span>ADD TO CART</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
