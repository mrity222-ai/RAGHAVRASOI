'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Upload } from 'lucide-react';

interface DishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dishData: any) => Promise<void>;
  categories: any[];
  editingDish: any | null;
}

export default function DishModal({
  isOpen,
  onClose,
  onSave,
  categories,
  editingDish,
}: DishModalProps) {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [mrp, setMrp] = useState(199);
  const [price, setPrice] = useState(149);
  const [desc, setDesc] = useState('');
  const [imagePreview, setImagePreview] = useState(
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80'
  );
  const [veg, setVeg] = useState(true);
  const [bestseller, setBestseller] = useState(false);
  const [customizable, setCustomizable] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingDish) {
      setName(editingDish.name || '');
      setCategoryId(editingDish.categoryId || (categories[0]?.id || ''));
      setMrp(editingDish.mrp || editingDish.price || 199);
      setPrice(editingDish.price || 149);
      setDesc(editingDish.desc || editingDish.description || '');
      setImagePreview(editingDish.image || editingDish.imageUrl || '');
      setVeg(editingDish.veg !== undefined ? editingDish.veg : true);
      setBestseller(!!editingDish.bestseller);
      setCustomizable(editingDish.customizable !== undefined ? editingDish.customizable : true);
    } else {
      setName('');
      setCategoryId(categories[0]?.id || '');
      setMrp(199);
      setPrice(149);
      setDesc('');
      setImagePreview(
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80'
      );
      setVeg(true);
      setBestseller(false);
      setCustomizable(true);
    }
  }, [editingDish, categories]);

  if (!isOpen) return null;

  const discountPct = mrp > price && price > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0;

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImagePreview(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    try {
      await onSave({
        id: editingDish?.id,
        name: name.trim(),
        categoryId: categoryId || categories[0]?.id,
        mrp: Number(mrp),
        price: Number(price),
        desc: desc.trim(),
        image: imagePreview,
        veg,
        bestseller,
        customizable,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-black text-slate-900 text-base">
            {editingDish ? 'Edit Dish & Pricing' : 'Add New Menu Dish'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs max-h-[80vh] overflow-y-auto">
          
          {/* Image Upload + Live Preview */}
          <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 border border-dashed border-slate-300">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-slate-200 shrink-0">
              <Image src={imagePreview} alt="Preview" fill className="object-cover" />
            </div>
            <div className="flex-1 space-y-1.5">
              <label className="block font-extrabold text-slate-800">Upload Dish Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="block w-full text-[11px] text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#E5203A] file:text-white hover:file:bg-[#C8172E] cursor-pointer"
              />
              <p className="text-[10px] text-slate-400">
                Supports JPG, PNG, WEBP. Updates storefront immediately.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Dish Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Tandoori Paneer Burger"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:border-[#E5203A]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Category *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-bold focus:outline-none focus:border-[#E5203A]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* MRP vs Selling Price + Auto Discount Badge */}
          <div className="grid grid-cols-3 gap-3 items-end">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Regular MRP (₹) *</label>
              <input
                type="number"
                min="1"
                required
                value={mrp}
                onChange={(e) => setMrp(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono focus:outline-none focus:border-[#E5203A]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Selling Price (₹) *</label>
              <input
                type="number"
                min="1"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold focus:outline-none focus:border-[#E5203A]"
              />
            </div>
            <div className="pb-1">
              <span className="inline-block w-full text-center py-2 px-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-extrabold text-[11px]">
                {discountPct > 0 ? `${discountPct}% OFF` : 'No Discount'}
              </span>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Short Description *</label>
            <input
              type="text"
              required
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Freshly prepared with signature house spices..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#E5203A]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-1">
            <label className="flex items-center gap-1.5 font-bold cursor-pointer">
              <input
                type="radio"
                name="dish-veg"
                checked={veg === true}
                onChange={() => setVeg(true)}
                className="accent-emerald-600"
              />
              <span>Pure Veg 🟢</span>
            </label>
            <label className="flex items-center gap-1.5 font-bold cursor-pointer">
              <input
                type="radio"
                name="dish-veg"
                checked={veg === false}
                onChange={() => setVeg(false)}
                className="accent-rose-600"
              />
              <span>Non-Veg 🔴</span>
            </label>
            <label className="flex items-center gap-1.5 font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={bestseller}
                onChange={(e) => setBestseller(e.target.checked)}
                className="accent-amber-500"
              />
              <span>Bestseller ⭐</span>
            </label>
            <label className="flex items-center gap-1.5 font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={customizable}
                onChange={(e) => setCustomizable(e.target.checked)}
                className="accent-[#0F766E]"
              />
              <span>Add-ons Modal</span>
            </label>
          </div>

          {/* Buttons */}
          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-[#E5203A] hover:bg-[#C8172E] text-white font-extrabold shadow-sm transition-colors"
            >
              {saving ? 'Saving...' : 'Save Dish'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
