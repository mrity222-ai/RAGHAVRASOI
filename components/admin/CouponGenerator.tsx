'use client';

import React, { useState } from 'react';
import { Ticket, Wand2, Trash2 } from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';

interface CouponGeneratorProps {
  coupons: any[];
  onRefresh: () => Promise<void>;
}

export default function CouponGenerator({ coupons, onRefresh }: CouponGeneratorProps) {
  const [code, setCode] = useState('');
  const [type, setType] = useState('PERCENT');
  const [value, setValue] = useState<number | ''>(20);
  const [minOrder, setMinOrder] = useState<number | ''>(249);
  const [maxDiscount, setMaxDiscount] = useState<number | ''>(100);
  const [desc, setDesc] = useState('Get 20% OFF on Self-Pickup orders above ₹249');
  const [publishing, setPublishing] = useState(false);
  const { hasPerm } = useAdminAuth();

  const handleAutoGenerate = () => {
    const prefixes = ['SPICE', 'GRILL', 'YUMMY', 'FEAST', 'PICKUP'];
    const p = prefixes[Math.floor(Math.random() * prefixes.length)];
    const num = Math.floor(15 + Math.random() * 35);
    setCode(`${p}${num}`);
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || value === '') return;

    setPublishing(true);
    try {
      await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim(),
          type,
          value: Number(value),
          minOrder: Number(minOrder) || 0,
          maxDiscount: maxDiscount ? Number(maxDiscount) : null,
          desc: desc.trim(),
        }),
      });
      setCode('');
      setValue(20);
      setMinOrder(249);
      setMaxDiscount(100);
      setDesc('');
      await onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setPublishing(false);
    }
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    try {
      await fetch('/api/coupons', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, active: !current }),
      });
      await onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await fetch(`/api/coupons?id=${id}`, { method: 'DELETE' });
      await onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-black text-slate-900">Coupon Code Generator</h2>
        <p className="text-xs text-slate-500">
          Create promo codes that appear immediately on the Customer Storefront and deduct discounts at checkout.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Create Coupon Form */}
        {hasPerm('manage_coupons') && (
          <form
            onSubmit={handleCreateCoupon}
            className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4 text-xs"
          >
            <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2.5">
              Create Promo Coupon
            </h3>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Coupon Code *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. PICKUP25"
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 font-mono font-extrabold uppercase focus:outline-none focus:border-[#0F766E]"
                />
                <button
                  type="button"
                  onClick={handleAutoGenerate}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 transition-colors"
                >
                  <Wand2 size={13} />
                  <span>Auto</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Discount Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold focus:outline-none focus:border-[#0F766E]"
                >
                  <option value="PERCENT">Percentage (%)</option>
                  <option value="FLAT">Flat Amount (₹)</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Discount Value *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={value}
                  onChange={(e) => setValue(e.target.value ? Number(e.target.value) : '')}
                  placeholder="20"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold focus:outline-none focus:border-[#0F766E]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Min Order Value (₹) *</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={minOrder}
                  onChange={(e) => setMinOrder(e.target.value ? Number(e.target.value) : '')}
                  placeholder="249"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold focus:outline-none focus:border-[#0F766E]"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Max Discount Cap (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={maxDiscount}
                  onChange={(e) => setMaxDiscount(e.target.value ? Number(e.target.value) : '')}
                  placeholder="100"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono focus:outline-none focus:border-[#0F766E]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Offer Tagline *</label>
              <input
                type="text"
                required
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Get 20% OFF on Self-Pickup orders above ₹249"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0F766E]"
              />
            </div>

            <button
              type="submit"
              disabled={publishing}
              className="w-full py-3 rounded-xl bg-[#E5203A] hover:bg-[#C8172E] text-white font-extrabold text-xs shadow-xs transition-colors"
            >
              {publishing ? 'Publishing...' : 'Publish Coupon to Storefront'}
            </button>
          </form>
        )}

        {/* Active Coupons List */}
        <div className={`${hasPerm('manage_coupons') ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-3`}>
          <h3 className="font-extrabold text-sm text-slate-900">Active &amp; Saved Promo Codes</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {coupons.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-sm px-2.5 py-0.5 rounded-lg bg-teal-50 text-[#0F766E] border border-teal-200 border-dashed">
                      {c.code}
                    </span>
                    <button
                      onClick={() => handleToggleActive(c.id, c.active)}
                      className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold border transition-colors ${
                        c.active
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {c.active ? 'Active' : 'Paused'}
                    </button>
                  </div>

                  <p className="font-extrabold text-xs text-slate-900 mt-2">
                    {c.type === 'PERCENT'
                      ? `${c.value}% OFF (Max ₹${c.maxDiscount || c.value})`
                      : `Flat ₹${c.value} OFF`}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{c.desc}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                  <span>
                    Min Order: <strong>₹{c.minOrder}</strong>
                  </span>
                  {hasPerm('manage_coupons') && (
                    <button
                      onClick={() => handleDeleteCoupon(c.id)}
                      className="text-[#E5203A] font-bold hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
