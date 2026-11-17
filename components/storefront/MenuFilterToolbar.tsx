'use client';

import React from 'react';
import { Star } from 'lucide-react';

interface MenuFilterToolbarProps {
  selectedDiet: string;
  onSelectDiet: (diet: string) => void;
  count: number;
  sortMode: string;
  onSelectSort: (sort: string) => void;
}

export default function MenuFilterToolbar({
  selectedDiet,
  onSelectDiet,
  count,
  sortMode,
  onSelectSort,
}: MenuFilterToolbarProps) {
  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3">
      {/* Dietary & Tag Filter Chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => onSelectDiet('ALL')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
            selectedDiet === 'ALL'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          All Dishes
        </button>

        <button
          onClick={() => onSelectDiet('VEG')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            selectedDiet === 'VEG'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <span className="w-3 h-3 border border-emerald-600 flex items-center justify-center bg-white">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          </span>
          Pure Veg
        </button>

        <button
          onClick={() => onSelectDiet('NON_VEG')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            selectedDiet === 'NON_VEG'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <span className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[9px] border-b-rose-600" />
          Non-Veg
        </button>

        <button
          onClick={() => onSelectDiet('BESTSELLER')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            selectedDiet === 'BESTSELLER'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Star size={13} className="text-amber-500 fill-amber-500" />
          Bestsellers
        </button>
      </div>

      {/* Count & Price Sort Dropdown */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-slate-500">
          Showing {count} dish{count === 1 ? '' : 'es'}
        </span>
        <select
          value={sortMode}
          onChange={(e) => onSelectSort(e.target.value)}
          className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#E5203A]"
        >
          <option value="DEFAULT">Sort: Recommended</option>
          <option value="PRICE_ASC">Price: Low to High</option>
          <option value="PRICE_DESC">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
}
