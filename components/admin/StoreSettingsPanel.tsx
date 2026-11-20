'use client';

import React, { useState, useEffect } from 'react';

interface StoreSettingsPanelProps {
  settings: any;
  onRefresh: () => Promise<void>;
}

export default function StoreSettingsPanel({ settings, onRefresh }: StoreSettingsPanelProps) {
  const [name, setName] = useState('');
  const [prepTimeMins, setPrepTimeMins] = useState(15);
  const [address, setAddress] = useState('');
  const [gstPercent, setGstPercent] = useState(5.0);
  const [packagingCharge, setPackagingCharge] = useState(10.0);
  const [allowPayAtShop, setAllowPayAtShop] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (settings) {
      setName(settings.name || 'Raghav Rasoi');
      setPrepTimeMins(settings.prepTimeMins || 15);
      setAddress(settings.address || '7th Avenue, Near Aarza Square - 2, Gaur City 1, Greater Noida West, UP 201009');
      setGstPercent(settings.gstPercent || 5.0);
      setPackagingCharge(settings.packagingCharge || 10.0);
      setAllowPayAtShop(settings.allowPayAtShop !== undefined ? settings.allowPayAtShop : true);
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          prepTimeMins: Number(prepTimeMins),
          address: address.trim(),
          gstPercent: Number(gstPercent),
          packagingCharge: Number(packagingCharge),
          allowPayAtShop,
        }),
      });
      await onRefresh();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-5">
      <div>
        <h2 className="text-lg font-black text-slate-900">
          Store, Tax &amp; Self-Pickup Configuration
        </h2>
        <p className="text-xs text-slate-500">
          Updates apply immediately to the Customer E-Commerce Storefront.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Restaurant Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:border-[#0F766E]"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Default Prep Time (Minutes)</label>
            <input
              type="number"
              min="5"
              max="90"
              required
              value={prepTimeMins}
              onChange={(e) => setPrepTimeMins(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono font-bold focus:outline-none focus:border-[#0F766E]"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Pickup Address</label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:border-[#0F766E]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">GST Tax (%)</label>
            <input
              type="number"
              min="0"
              max="28"
              step="0.5"
              required
              value={gstPercent}
              onChange={(e) => setGstPercent(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono font-bold focus:outline-none focus:border-[#0F766E]"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Packaging Fee (₹)</label>
            <input
              type="number"
              min="0"
              max="100"
              required
              value={packagingCharge}
              onChange={(e) => setPackagingCharge(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono font-bold focus:outline-none focus:border-[#0F766E]"
            />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div>
            <p className="font-extrabold text-slate-900">Enable &quot;Pay at Shop Counter&quot;</p>
            <p className="text-[11px] text-slate-500">Allow customers to pay cash/UPI when picking up</p>
          </div>
          <input
            type="checkbox"
            checked={allowPayAtShop}
            onChange={(e) => setAllowPayAtShop(e.target.checked)}
            className="w-4 h-4 accent-[#0F766E]"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-600">✓ Saved and synced!</span>
          )}
          <button
            type="submit"
            disabled={saving}
            className="ml-auto px-6 py-2.5 rounded-xl bg-[#0F766E] hover:bg-teal-800 text-white font-extrabold shadow-xs transition-colors"
          >
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </form>
    </div>
  );
}
