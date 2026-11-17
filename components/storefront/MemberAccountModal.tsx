'use client';

import React, { useState, useEffect } from 'react';
import { X, User, RotateCcw } from 'lucide-react';
import { useStorefrontCart } from '@/context/StorefrontCartContext';

export default function MemberAccountModal() {
  const {
    isAccountOpen,
    setIsAccountOpen,
    loggedInMember,
    setLoggedInMember,
    addToCart,
    setIsCartOpen,
  } = useStorefrontCart();

  const [nameInput, setNameInput] = useState('Rahul Verma');
  const [phoneInput, setPhoneInput] = useState('9876543210');
  const [pastOrders, setPastOrders] = useState<any[]>([]);

  useEffect(() => {
    if (isAccountOpen) {
      fetch('/api/orders')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            setPastOrders(data.data.slice(0, 4));
          }
        })
        .catch((e) => console.error(e));
    }
  }, [isAccountOpen]);

  if (!isAccountOpen) return null;

  const handleLogin = () => {
    if (phoneInput.length < 10) {
      alert('Enter a valid 10-digit mobile number');
      return;
    }
    setLoggedInMember({ name: nameInput.trim() || 'Rahul Verma', phone: phoneInput.trim() });
  };

  const handleReorder = (order: any) => {
    if (order.items && order.items.length) {
      order.items.forEach((item: any) => {
        addToCart({
          productId: item.productId || 'dish-1',
          name: item.name,
          qty: item.qty || 1,
          size: item.size || 'Regular',
          addons: item.addons || [],
          note: item.note || '',
          unitPrice: item.unitPrice,
        });
      });
      setIsAccountOpen(false);
      setIsCartOpen(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-black text-slate-900 text-base">Customer Account & Reorder</h3>
          <button
            onClick={() => setIsAccountOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {!loggedInMember ? (
            <>
              <p className="text-xs text-slate-600">
                Sign in with your mobile number to view past self-pickup orders and reorder in 1 click.
              </p>
              <div className="space-y-3 text-xs">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:border-[#0F766E]"
                />
                <input
                  type="tel"
                  maxLength={10}
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="10-digit Mobile Number"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono font-semibold focus:outline-none focus:border-[#0F766E]"
                />
                <button
                  onClick={handleLogin}
                  className="w-full py-3 rounded-2xl bg-[#0F766E] hover:bg-teal-800 text-white font-extrabold transition-all"
                >
                  Login with OTP
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-teal-100 text-[#0F766E] flex items-center justify-center font-bold">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="font-black text-slate-900">{loggedInMember.name}</p>
                    <p className="font-mono text-slate-500">+91 {loggedInMember.phone}</p>
                  </div>
                </div>
                <button
                  onClick={() => setLoggedInMember(null)}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 text-[#E5203A] font-bold hover:bg-rose-100 transition-colors"
                >
                  Logout
                </button>
              </div>

              <div className="space-y-2.5">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                  Past Orders (1-Click Reorder)
                </h4>
                {pastOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-3 rounded-2xl border border-slate-200 flex items-center justify-between gap-2 text-xs hover:border-slate-300 transition-colors"
                  >
                    <div>
                      <p className="font-mono font-extrabold text-slate-900">
                        #{ord.id} • ₹{ord.grandTotal}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {ord.items?.map((i: any) => `${i.qty}× ${i.name}`).join(', ')}
                      </p>
                    </div>
                    <button
                      onClick={() => handleReorder(ord)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#E5203A] hover:bg-[#C8172E] text-white font-extrabold shrink-0 shadow-xs"
                    >
                      <RotateCcw size={12} />
                      <span>Reorder</span>
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
