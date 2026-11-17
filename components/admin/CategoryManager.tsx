'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Plus, X } from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';

interface CategoryManagerProps {
  categories: any[];
  products: any[];
  onRefresh: () => Promise<void>;
}

export default function CategoryManager({
  categories,
  products,
  onRefresh,
}: CategoryManagerProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [catName, setCatName] = useState('');
  const [catImagePreview, setCatImagePreview] = useState(
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80'
  );
  const [catActive, setCatActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const { hasPerm } = useAdminAuth();

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setCatName('');
    setCatImagePreview(
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80'
    );
    setCatActive(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (c: any) => {
    setEditingCategory(c);
    setCatName(c.name);
    setCatImagePreview(c.image || c.imageUrl || '');
    setCatActive(c.active);
    setModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) setCatImagePreview(ev.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleToggleVisibility = async (id: string, current: boolean) => {
    try {
      await fetch('/api/menu/categories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, active: !current }),
      });
      await onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    setSaving(true);
    try {
      if (editingCategory) {
        await fetch('/api/menu/categories', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingCategory.id,
            name: catName.trim(),
            image: catImagePreview,
            active: catActive,
          }),
        });
      } else {
        await fetch('/api/menu/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: catName.trim(),
            image: catImagePreview,
            active: catActive,
          }),
        });
      }
      setModalOpen(false);
      await onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-900">
            Categories &amp; Storefront Thumbnails
          </h2>
          <p className="text-xs text-slate-500">
            Upload custom category photos that appear in the &quot;What&apos;s on your mind?&quot; carousel.
          </p>
        </div>

        {hasPerm('manage_categories') && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F766E] hover:bg-teal-800 text-white font-extrabold text-xs shadow-xs transition-colors"
          >
            <Plus size={15} />
            <span>Add New Category</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((cat) => {
          const count = products.filter((p) => p.categoryId === cat.id).length;
          return (
            <div
              key={cat.id}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border border-slate-200 shrink-0">
                  <Image
                    src={cat.image || cat.imageUrl || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80'}
                    alt={cat.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="font-extrabold text-sm text-slate-900 truncate">{cat.name}</h4>
                  <p className="text-[11px] text-slate-500">{count} dishes</p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <button
                  onClick={() => handleToggleVisibility(cat.id, cat.active)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold border transition-colors ${
                    cat.active
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                      : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {cat.active ? 'Visible' : 'Hidden'}
                </button>

                {hasPerm('manage_categories') && (
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-base">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 border border-dashed border-slate-300">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
                  <Image src={catImagePreview} alt="Preview" fill className="object-cover" />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="block font-extrabold text-slate-800">
                    Upload Category Thumbnail
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-[11px] text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#0F766E] file:text-white cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="e.g. Momos & Wraps"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:border-[#0F766E]"
                />
              </div>

              <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={catActive}
                  onChange={(e) => setCatActive(e.target.checked)}
                  className="accent-[#0F766E] w-4 h-4"
                />
                <span>Visible on Customer Storefront</span>
              </label>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#0F766E] hover:bg-teal-800 text-white font-extrabold transition-colors"
                >
                  {saving ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
