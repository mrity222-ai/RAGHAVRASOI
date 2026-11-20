'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, clearCart, subtotal } = useCart();
  const [checkoutStatus, setCheckoutStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleCheckout = async () => {
    if (!cart.length) return;
    setCheckoutStatus('loading');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerEmail: 'guest@ranel.com',
          totalAmount: subtotal,
          items: cart,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCheckoutStatus('success');
        setTimeout(() => {
          clearCart();
          setCheckoutStatus('idle');
          setIsCartOpen(false);
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      setCheckoutStatus('idle');
    }
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-over panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#EAE4D7] flex items-center justify-between bg-[#FAF5EB]">
            <div className="flex items-center space-x-2">
              <ShoppingBag size={20} className="text-black" />
              <h2 className="font-heading text-lg font-bold text-black tracking-wider uppercase">
                YOUR CART ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-[#666] hover:text-black p-1 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-[#888]">
                <ShoppingBag size={48} strokeWidth={1} className="mb-3 text-[#BBB]" />
                <p className="font-heading text-base font-semibold text-black">YOUR CART IS EMPTY</p>
                <p className="text-xs text-[#777] mt-1">Add some delicious dishes from our menu!</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 border border-[#ECE6DB] p-3 rounded-sm bg-[#FCFAF7]"
                >
                  <div className="relative w-16 h-16 bg-white rounded-sm flex-shrink-0 overflow-hidden border border-[#E8E2D5]">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-contain p-1"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-heading text-xs font-bold text-black tracking-wide truncate">
                      {item.title}
                    </h4>
                    <p className="text-ranel-red font-bold text-xs mt-0.5">
                      ₹{item.price}
                    </p>

                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 rounded-full border border-[#CCC] flex items-center justify-center text-xs hover:bg-black hover:text-white transition-colors"
                      >
                        <Minus size={10} />
                      </button>
                      <span className="text-xs font-semibold px-1">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 rounded-full border border-[#CCC] flex items-center justify-center text-xs hover:bg-black hover:text-white transition-colors"
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-[#999] hover:text-ranel-red p-1 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {cart.length > 0 && (
            <div className="border-t border-[#EAE4D7] p-6 bg-[#FAF5EB] space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#666] font-medium">Subtotal</span>
                <span className="font-heading text-lg font-bold text-black">
                  ₹{subtotal}
                </span>
              </div>
              <p className="text-[11px] text-[#888]">Taxes and shipping calculated at checkout.</p>

              <button
                onClick={handleCheckout}
                disabled={checkoutStatus === 'loading'}
                className="w-full bg-black hover:bg-[#222] text-white text-xs font-bold tracking-[0.16em] py-3.5 rounded-full uppercase shadow-md flex items-center justify-center space-x-2 transition-all transform active:scale-98"
              >
                {checkoutStatus === 'loading' ? (
                  <span>PROCESSING...</span>
                ) : checkoutStatus === 'success' ? (
                  <>
                    <Check size={16} className="text-green-400" />
                    <span>ORDER COMPLETED!</span>
                  </>
                ) : (
                  <span>CHECKOUT NOW</span>
                )}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
