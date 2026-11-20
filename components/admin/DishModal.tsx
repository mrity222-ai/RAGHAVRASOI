'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Upload, Link2, Trash2, Plus, Sparkles, Image as ImageIcon } from 'lucide-react';

interface DishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dishData: any) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  categories: any[];
  editingDish: any | null;
}

export default function DishModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  categories,
  editingDish,
}: DishModalProps) {
  // Tabs
  const [activeTab, setActiveTab] = useState<'basic' | 'pricing' | 'media' | 'details'>('basic');

  // Form State
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [mrp, setMrp] = useState(199);
  const [price, setPrice] = useState(149);
  const [desc, setDesc] = useState('');
  const [story, setStory] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [prepTime, setPrepTime] = useState('15-20 mins');
  const [calories, setCalories] = useState(380);

  // Main Image
  const [imagePreview, setImagePreview] = useState(
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80'
  );
  const [mainImageUrlInput, setMainImageUrlInput] = useState('');
  const [mainImageMode, setMainImageMode] = useState<'upload' | 'url'>('upload');

  // Gallery Thumbnails (2 to 4 small images)
  const [galleryImages, setGalleryImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=400&q=80',
  ]);

  // Flags
  const [veg, setVeg] = useState(true);
  const [bestseller, setBestseller] = useState(false);
  const [customizable, setCustomizable] = useState(true);
  const [isSale, setIsSale] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingDish) {
      setName(editingDish.name || editingDish.title || '');
      setCategoryId(editingDish.categoryId || (categories[0]?.id || ''));
      setSubCategory(editingDish.subCategory || '');
      setMrp(editingDish.mrp || editingDish.compareAtPrice || editingDish.price || 199);
      setPrice(editingDish.price || 149);
      setDesc(editingDish.desc || editingDish.description || '');
      setStory(editingDish.story || '');
      setIngredients(editingDish.ingredients || '');
      setPrepTime(editingDish.prepTime || '15-20 mins');
      setCalories(editingDish.calories || 380);

      const mainImg = editingDish.image || editingDish.imageUrl || '';
      setImagePreview(mainImg || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80');
      setMainImageUrlInput(mainImg.startsWith('http') ? mainImg : '');
      setMainImageMode(mainImg.startsWith('data:') ? 'upload' : 'url');

      if (editingDish.gallery) {
        try {
          const parsed = JSON.parse(editingDish.gallery);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setGalleryImages(parsed);
          }
        } catch (e) {
          // ignore parse error
        }
      }

      setVeg(editingDish.veg !== undefined ? editingDish.veg : true);
      setBestseller(!!(editingDish.bestseller || editingDish.isBestSeller));
      setCustomizable(editingDish.customizable !== undefined ? editingDish.customizable : true);
      setIsSale(editingDish.isSale !== undefined ? editingDish.isSale : (Number(editingDish.mrp) > Number(editingDish.price)));
    } else {
      setName('');
      setCategoryId(categories[0]?.id || '');
      setSubCategory('');
      setMrp(199);
      setPrice(149);
      setDesc('');
      setStory('');
      setIngredients('');
      setPrepTime('15-20 mins');
      setCalories(380);
      setImagePreview(
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80'
      );
      setMainImageUrlInput('');
      setMainImageMode('upload');
      setGalleryImages([
        'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=400&q=80',
      ]);
      setVeg(true);
      setBestseller(false);
      setCustomizable(true);
      setIsSale(true);
    }
    setActiveTab('basic');
  }, [editingDish, categories, isOpen]);

  if (!isOpen) return null;

  const discountPct = mrp > price && price > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0;

  const handleMainImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleGalleryImageFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const updated = [...galleryImages];
        updated[index] = event.target.result as string;
        setGalleryImages(updated);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryUrlChange = (index: number, url: string) => {
    const updated = [...galleryImages];
    updated[index] = url;
    setGalleryImages(updated);
  };

  const handleAddGallerySlot = () => {
    if (galleryImages.length >= 5) return;
    setGalleryImages([
      ...galleryImages,
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
    ]);
  };

  const handleRemoveGallerySlot = (index: number) => {
    if (galleryImages.length <= 1) return;
    setGalleryImages(galleryImages.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a dish name.');
      setActiveTab('basic');
      return;
    }

    setSaving(true);
    try {
      await onSave({
        id: editingDish?.id,
        name: name.trim(),
        categoryId: categoryId || categories[0]?.id,
        subCategory: subCategory.trim() || null,
        mrp: Number(mrp),
        price: Number(price),
        image: imagePreview,
        gallery: galleryImages.filter((img) => img.trim().length > 0),
        desc: desc.trim(),
        story: story.trim() || null,
        ingredients: ingredients.trim() || null,
        calories: Number(calories) || null,
        prepTime: prepTime.trim() || '15-20 mins',
        veg,
        bestseller,
        customizable,
        isSale: mrp > price || isSale,
      });
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error saving dish');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!editingDish || !onDelete) return;
    if (confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      try {
        await onDelete(editingDish.id);
        onClose();
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
              <span>{editingDish ? 'Edit Product & Recipe Details' : 'Add New Product to Menu'}</span>
              {discountPct > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold">
                  {discountPct}% OFF
                </span>
              )}
            </h3>
            <p className="text-[11px] text-slate-500">
              Raghav Rasoi Menu Management • Syncs directly with customer storefront
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white px-6 gap-2 text-xs font-bold overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`py-3 px-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'basic'
                ? 'border-[#E5203A] text-[#E5203A]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            1. Basic &amp; Category
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pricing')}
            className={`py-3 px-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'pricing'
                ? 'border-[#E5203A] text-[#E5203A]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            2. MRP &amp; Offer Price
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('media')}
            className={`py-3 px-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'media'
                ? 'border-[#E5203A] text-[#E5203A]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            3. Media Gallery (Main + Thumbnails)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`py-3 px-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'details'
                ? 'border-[#E5203A] text-[#E5203A]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            4. Story &amp; Ingredients
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          
          {/* TAB 1: BASIC & CATEGORY */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Product / Dish Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Special Maharaja Thali"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:border-[#E5203A]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Main Category *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold focus:outline-none focus:border-[#E5203A]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Sub-Category (Filter Pill)
                </label>
                <input
                  type="text"
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  placeholder="e.g. Thali Special, Starters & Dry, Main Course, Tandoor & Breads, Desserts"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-[#E5203A]"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Enables category pills on the customer menu and category pages.
                </p>
              </div>

              {/* Veg / Non-Veg & Badges */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="block font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">
                  Food Dietary &amp; Storefront Badges
                </span>
                <div className="flex flex-wrap items-center gap-5">
                  <label className="flex items-center gap-2 font-bold cursor-pointer text-slate-800">
                    <input
                      type="radio"
                      name="dish-veg"
                      checked={veg === true}
                      onChange={() => setVeg(true)}
                      className="accent-emerald-600 w-4 h-4"
                    />
                    <span>Pure Veg 🟢</span>
                  </label>
                  <label className="flex items-center gap-2 font-bold cursor-pointer text-slate-800">
                    <input
                      type="radio"
                      name="dish-veg"
                      checked={veg === false}
                      onChange={() => setVeg(false)}
                      className="accent-rose-600 w-4 h-4"
                    />
                    <span>Non-Veg 🔴</span>
                  </label>
                  <label className="flex items-center gap-2 font-bold cursor-pointer text-slate-800">
                    <input
                      type="checkbox"
                      checked={bestseller}
                      onChange={(e) => setBestseller(e.target.checked)}
                      className="accent-amber-500 w-4 h-4"
                    />
                    <span>Bestseller ⭐</span>
                  </label>
                  <label className="flex items-center gap-2 font-bold cursor-pointer text-slate-800">
                    <input
                      type="checkbox"
                      checked={customizable}
                      onChange={(e) => setCustomizable(e.target.checked)}
                      className="accent-[#0F766E] w-4 h-4"
                    />
                    <span>Portions / Add-on Modal</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Short Description (Menu Cards) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Freshly prepared with authentic hand-ground spices and organic ingredients..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#E5203A]"
                />
              </div>
            </div>
          )}

          {/* TAB 2: PRICING & OFFER */}
          {activeTab === 'pricing' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
                <h4 className="font-extrabold text-amber-900 text-xs flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-600" />
                  <span>Offer &amp; Discount Pricing System</span>
                </h4>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  Set the original MRP (e.g. ₹100) and your discounted selling price (e.g. ₹70). The customer storefront will automatically show <span className="line-through text-slate-500">₹100</span> alongside <span className="font-bold text-emerald-700">₹70</span> and display an attractive discount badge!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Original MRP (₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono font-bold text-slate-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="1"
                      required
                      value={mrp}
                      onChange={(e) => setMrp(Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 font-mono font-bold text-slate-700 focus:outline-none focus:border-[#E5203A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Offer / Selling Price (₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono font-bold text-[#E5203A]">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="1"
                      required
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl border-2 border-[#E5203A]/40 font-mono font-extrabold text-slate-900 focus:outline-none focus:border-[#E5203A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Customer Savings</label>
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                    {discountPct > 0 ? (
                      <span className="font-black text-emerald-700 text-xs">
                        {discountPct}% OFF • Save ₹{mrp - price}
                      </span>
                    ) : (
                      <span className="font-bold text-slate-500 text-xs">Regular Price (No Discount)</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Offer Card Live Preview */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="block font-extrabold text-slate-900 text-xs">
                  Live Customer Pricing Preview
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-black text-slate-900">₹{price}</span>
                  {mrp > price && (
                    <span className="text-sm font-semibold text-slate-400 line-through">
                      ₹{mrp}
                    </span>
                  )}
                  {discountPct > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E5203A] text-white font-extrabold text-[11px] shadow-2xs">
                      {discountPct}% OFF
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MEDIA GALLERY (MAIN HERO + THUMBNAILS) */}
          {activeTab === 'media' && (
            <div className="space-y-4">
              {/* Primary Large Image */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-xs">
                    1. Main Product Large Photo (Hero Display)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setMainImageMode('upload')}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-extrabold border transition-all ${
                        mainImageMode === 'upload'
                          ? 'bg-[#E5203A] text-white border-[#E5203A]'
                          : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      <Upload size={10} />
                      <span>Upload File</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMainImageMode('url')}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-extrabold border transition-all ${
                        mainImageMode === 'url'
                          ? 'bg-[#E5203A] text-white border-[#E5203A]'
                          : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      <Link2 size={10} />
                      <span>Image URL</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-300 shrink-0 bg-white shadow-2xs">
                    <Image src={imagePreview} alt="Hero Preview" fill className="object-cover" />
                  </div>
                  <div className="flex-1 space-y-2">
                    {mainImageMode === 'upload' ? (
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleMainImageFileChange}
                          className="block w-full text-[11px] text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#E5203A] file:text-white cursor-pointer"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">
                          Upload high-res PNG/JPG for the main dish view.
                        </p>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="url"
                          value={mainImageUrlInput}
                          onChange={(e) => {
                            setMainImageUrlInput(e.target.value);
                            if (e.target.value.trim()) setImagePreview(e.target.value.trim());
                          }}
                          placeholder="https://images.unsplash.com/photo-..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-[#E5203A]"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. Additional Gallery Thumbnails (Small Images row on /product/[id]) */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-slate-900 text-xs">
                      2. Additional Gallery Thumbnails (Product Page Row)
                    </span>
                    <p className="text-[10px] text-slate-500">
                      Customers click these small thumbnails on the product page to see different angles or serving styles.
                    </p>
                  </div>
                  {galleryImages.length < 5 && (
                    <button
                      type="button"
                      onClick={handleAddGallerySlot}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-200 hover:bg-slate-300 font-extrabold text-[10px] text-slate-700 transition-colors"
                    >
                      <Plus size={12} />
                      <span>Add Thumbnail</span>
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {galleryImages.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs"
                    >
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                        <Image src={imgUrl} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-700 text-[11px]">
                            Thumbnail {idx + 1}
                          </span>
                          {galleryImages.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveGallerySlot(idx)}
                              className="text-rose-500 hover:text-rose-700 p-0.5"
                              title="Remove"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                        <input
                          type="url"
                          value={imgUrl}
                          onChange={(e) => handleGalleryUrlChange(idx, e.target.value)}
                          placeholder="Thumbnail image URL..."
                          className="w-full px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] font-mono focus:outline-none focus:border-[#E5203A]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: STORY, INGREDIENTS & PREP */}
          {activeTab === 'details' && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Chef Story / Recipe Origin (&quot;About this Recipe&quot; tab on Product page)
                </label>
                <textarea
                  rows={3}
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  placeholder="Crafted according to age-old Awadhi tradition with hand-pounded spices, slow-simmered in copper degs to bring out authentic North Indian aromas..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#E5203A]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Key Ingredients &amp; Preparation (Comma separated)
                </label>
                <textarea
                  rows={2}
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  placeholder="Fresh Malai Paneer, Pure Desi Ghee, Kasuri Methi, Shahi Jeera, Green Cardamom, Fresh Cream"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#E5203A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estimated Preparation Time</label>
                  <input
                    type="text"
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                    placeholder="e.g. 15-20 mins"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:border-[#E5203A]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Calories (approx kcal)</label>
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(Number(e.target.value))}
                    placeholder="380"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono focus:outline-none focus:border-[#E5203A]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            {editingDish && onDelete ? (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 font-bold transition-colors"
              >
                <Trash2 size={13} />
                <span>Delete Dish</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex gap-2">
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
                className="px-6 py-2 rounded-xl bg-[#E5203A] hover:bg-[#C8172E] text-white font-extrabold shadow-sm transition-colors"
              >
                {saving ? 'Saving...' : editingDish ? 'Update Dish' : 'Add to Menu'}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
