'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import DishModal from './DishModal';

interface MenuPricingManagerProps {
  products: any[];
  categories: any[];
  onRefresh: () => Promise<void>;
}

export default function MenuPricingManager({
  products,
  categories,
  onRefresh,
}: MenuPricingManagerProps) {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('ALL');
  const [dishModalOpen, setDishModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<any | null>(null);

  const { hasPerm } = useAdminAuth();
  const canManageMenu = hasPerm('manage_menu');
  const canToggleStock = hasPerm('toggle_stock') || canManageMenu;

  const filtered = products.filter((p) => {
    if (catFilter !== 'ALL' && p.categoryId !== catFilter) return false;
    if (search.trim() && !p.name?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleInlinePriceChange = async (id: string, newPrice: string) => {
    const val = Number(newPrice);
    if (isNaN(val) || val <= 0) return;
    try {
      await fetch('/api/menu/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, price: val }),
      });
      await onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleStock = async (id: string, currentStock: boolean) => {
    try {
      await fetch('/api/menu/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, inStock: !currentStock }),
      });
      await onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteDish = async (id: string) => {
    if (!confirm('Are you sure you want to delete this dish?')) return;
    try {
      await fetch(`/api/menu/products?id=${id}`, { method: 'DELETE' });
      await onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveDish = async (dishData: any) => {
    try {
      if (dishData.id) {
        await fetch('/api/menu/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dishData),
        });
      } else {
        await fetch('/api/menu/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dishData),
        });
      }
      await onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-900">
            Menu, Image Upload &amp; Pricing Control
          </h2>
          <p className="text-xs text-slate-500">
            Upload dish photos, update MRP &amp; Selling prices inline, or toggle In-Stock / Sold Out.
          </p>
        </div>

        {canManageMenu && (
          <button
            onClick={() => {
              setEditingDish(null);
              setDishModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E5203A] hover:bg-[#C8172E] text-white font-extrabold text-xs shadow-xs transition-colors"
          >
            <Plus size={15} />
            <span>Add New Dish</span>
          </button>
        )}
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative">
          <Search size={14} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dish name..."
            className="pl-8 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium w-60 focus:outline-none focus:border-[#E5203A]"
          />
        </div>

        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#E5203A]"
        >
          <option value="ALL">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase text-slate-500">
                <th className="py-3 px-4">Dish &amp; Photo</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">MRP (₹)</th>
                <th className="py-3 px-4">Selling Price (₹)</th>
                <th className="py-3 px-4">Live Stock</th>
                {canManageMenu && <th className="py-3 px-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((d) => {
                const cat = categories.find((c) => c.id === d.categoryId);
                return (
                  <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                          <Image
                            src={d.image || d.imageUrl || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80'}
                            alt={d.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                            <span
                              className={`w-2.5 h-2.5 rounded-full ${
                                d.veg ? 'bg-emerald-600' : 'bg-rose-600'
                              }`}
                            />
                            <span>{d.name}</span>
                          </p>
                          <p className="text-[11px] text-slate-400 truncate max-w-xs">
                            {d.desc || d.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-700">{cat ? cat.name : '—'}</td>

                    <td className="py-3 px-4 font-mono text-slate-500">₹{d.mrp || d.price}</td>

                    <td className="py-3 px-4">
                      {canManageMenu ? (
                        <div className="inline-flex items-center gap-1">
                          <span className="font-mono font-bold">₹</span>
                          <input
                            type="number"
                            defaultValue={d.price}
                            onBlur={(e) => handleInlinePriceChange(d.id, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleInlinePriceChange(d.id, (e.target as any).value);
                              }
                            }}
                            className="w-20 px-2 py-1 rounded-lg border border-slate-200 font-mono font-extrabold text-slate-900 focus:border-[#E5203A] focus:outline-none"
                          />
                        </div>
                      ) : (
                        <span className="font-mono font-extrabold">₹{d.price}</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <button
                        disabled={!canToggleStock}
                        onClick={() => handleToggleStock(d.id, d.inStock)}
                        className={`px-3 py-1 rounded-xl font-extrabold text-[11px] border transition-colors ${
                          d.inStock
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-rose-50 border-rose-200 text-[#E5203A] hover:bg-rose-100'
                        } ${!canToggleStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {d.inStock ? '● In Stock' : '○ Sold Out'}
                      </button>
                    </td>

                    {canManageMenu && (
                      <td className="py-3 px-4 text-right space-x-1.5">
                        <button
                          onClick={() => {
                            setEditingDish(d);
                            setDishModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteDish(d.id)}
                          className="px-2.5 py-1 rounded-lg border border-rose-200 font-bold text-[#E5203A] hover:bg-rose-50 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dish Modal */}
      <DishModal
        isOpen={dishModalOpen}
        onClose={() => setDishModalOpen(false)}
        onSave={handleSaveDish}
        categories={categories}
        editingDish={editingDish}
      />
    </div>
  );
}
