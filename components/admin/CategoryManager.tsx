'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Plus, X, Edit2, Trash2, Upload, Link2 } from 'lucide-react';
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
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url'>('upload');
  const [catActive, setCatActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const { hasPerm } = useAdminAuth();

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setCatName('');
    const defaultImg =
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80';
    setCatImagePreview(defaultImg);
    setImageUrlInput('');
    setImageInputMode('upload');
    setCatActive(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (c: any) => {
    setEditingCategory(c);
    setCatName(c.name);
    const img = c.image || c.imageUrl || '';
    setCatImagePreview(img);
    setImageUrlInput(img.startsWith('http') ? img : '');
    setImageInputMode(img.startsWith('data:') ? 'upload' : 'url');
    setCatActive(c.active);
    setModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setCatImagePreview(ev.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUrlChange = (val: string) => {
    setImageUrlInput(val);
    if (val.trim()) {
      setCatImagePreview(val.trim());
    }
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

  const handleDeleteCategory = async (cat: any) => {
    const count = products.filter((p) => p.categoryId === cat.id).length;
    const confirmMsg =
      count > 0
        ? `Warning: Category "${cat.name}" has ${count} associated dishes.\n\nDeleting this category will permanently delete all ${count} dishes as well. Are you sure?`
        : `Are you sure you want to delete category "${cat.name}"?`;

    if (!confirm(confirmMsg)) return;

    try {
      const res = await fetch(`/api/menu/categories?id=${cat.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) {
        alert(data.error || 'Failed to delete category');
        return;
      }
      setModalOpen(false);
      await onRefresh();
    } catch (err) {
      console.error(err);
      alert('Error deleting category');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    setSaving(true);
    try {
      const payload = {
        name: catName.trim(),
        image: catImagePreview,
        active: catActive,
      };

      if (editingCategory) {
        await fetch('/api/menu/categories', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingCategory.id,
            ...payload,
          }),
        });
      } else {
        await fetch('/api/menu/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      setModalOpen(false);
      await onRefresh();
    } catch (err) {
      console.error(err);
      alert('Error saving category');
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
            Manage menu categories, upload custom thumbnails, or remove unused categories.
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
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center justify-between gap-3 hover:shadow-xs transition-shadow"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                  <Image
                    src={
                      cat.image ||
                      cat.imageUrl ||
                      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80'
                    }
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
                  title="Toggle storefront visibility"
                >
                  {cat.active ? 'Visible' : 'Hidden'}
                </button>

                {hasPerm('manage_categories') && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                      title="Edit Category"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat)}
                      className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
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
              
              {/* Image Preview & Upload Mode Switch */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0 bg-slate-200">
                    <Image src={catImagePreview} alt="Preview" fill className="object-cover" />
                  </div>
                  <div>
                    <span className="block font-extrabold text-slate-900 text-xs">
                      Category Photo
                    </span>
                    <p className="text-[10px] text-slate-400">
                      Appears in the &quot;What&apos;s on your mind?&quot; carousel.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => setImageInputMode('upload')}
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-extrabold border transition-all ${
                          imageInputMode === 'upload'
                            ? 'bg-[#0F766E] text-white border-[#0F766E]'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Upload size={10} />
                        <span>Upload File</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageInputMode('url')}
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-extrabold border transition-all ${
                          imageInputMode === 'url'
                            ? 'bg-[#0F766E] text-white border-[#0F766E]'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Link2 size={10} />
                        <span>Image URL</span>
                      </button>
                    </div>
                  </div>
                </div>

                {imageInputMode === 'upload' ? (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-[11px] text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#0F766E] file:text-white cursor-pointer"
                    />
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      value={imageUrlInput}
                      onChange={(e) => handleUrlChange(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#0F766E]"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="e.g. Special Thali, Tandoor & Breads"
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

              <div className="pt-3 flex items-center justify-between border-t border-slate-100">
                {editingCategory ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(editingCategory)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 font-bold transition-colors"
                  >
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex gap-2">
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
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
