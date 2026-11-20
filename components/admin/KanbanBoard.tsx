'use client';

import React, { useState } from 'react';
import { Search, Flame, ShoppingBag } from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';

interface KanbanBoardProps {
  orders: any[];
  onUpdateStatus: (id: string, status: string) => void;
  onOpenReceipt: (order: any, type: 'KOT' | 'BILL') => void;
}

export default function KanbanBoard({ orders, onUpdateStatus, onOpenReceipt }: KanbanBoardProps) {
  const [search, setSearch] = useState('');
  const { hasPerm } = useAdminAuth();
  const canPrint = hasPerm('print_kot');

  const filtered = orders.filter((o) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return o.id?.toLowerCase().includes(q) || o.customerName?.toLowerCase().includes(q);
  });

  const pendingList = filtered.filter((o) => o.status === 'PENDING');
  const preparingList = filtered.filter((o) => o.status === 'PREPARING');
  const readyList = filtered.filter((o) => o.status === 'READY');

  return (
    <div className="space-y-4">
      
      {/* Header & Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-900">Live Self-Pickup Order Kanban</h2>
          <p className="text-xs text-slate-500">
            Accept, cook, print KOT, and mark orders ready for counter pickup.
          </p>
        </div>
        <div className="relative">
          <Search size={14} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search #ORD or Customer..."
            className="pl-8 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#E5203A] w-64"
          />
        </div>
      </div>

      {/* 3-Column Kanban Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        
        {/* 1. Pending (New Orders) */}
        <section className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3.5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-amber-200">
            <h3 className="font-extrabold text-amber-950 text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <span>Pending (New Orders)</span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white font-extrabold text-xs">
              {pendingList.length}
            </span>
          </div>

          <div className="space-y-3 min-h-[220px]">
            {!pendingList.length ? (
              <div className="border-2 border-dashed border-amber-200 rounded-2xl p-8 text-center text-xs font-semibold text-amber-700/60">
                No orders in Pending
              </div>
            ) : (
              pendingList.map((o) => (
                <div
                  key={o.id}
                  className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm space-y-2.5 animate-in fade-in"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono font-black text-sm text-slate-900">#{o.id}</span>
                      {o.orderType === 'IN_TABLE' || o.tableNo ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] shadow-2xs border border-amber-500">
                          🍽️ {o.tableNo ? `TABLE: ${o.tableNo}` : 'IN TABLE'}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 font-extrabold text-[10px]">
                          🛵 Deliver
                        </span>
                      )}
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold text-[10px]">
                        {o.paymentMethod === 'CASH_ON_DELIVERY' ? 'COD' : o.paymentMethod === 'CASH_IN_COUNTER' ? 'Pay Counter' : 'Online'}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-[#0F766E] bg-teal-50 px-2 py-0.5 rounded-lg">
                      {o.pickupTime}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <p className="font-extrabold text-slate-900">{o.customerName}</p>
                      <p className="font-mono text-[11px] text-slate-500">{o.customerPhone}</p>
                    </div>
                    <div className="text-right">
                      {o.paymentStatus === 'PAID' ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold text-[10px]">
                          PAID • UPI
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-orange-50 text-orange-700 border border-orange-200 font-extrabold text-[10px]">
                          PAY AT SHOP
                        </span>
                      )}
                      <p className="font-mono font-black text-sm text-slate-900 mt-1">
                        ₹{o.grandTotal}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs bg-slate-50 p-2.5 rounded-xl">
                    {o.items?.map((item: any, idx: number) => (
                      <div key={idx}>
                        <p className="font-bold text-slate-800">
                          <span className="font-mono">{item.qty}×</span> {item.name} ({item.size})
                        </p>
                        {item.note && (
                          <p className="text-[10px] font-bold text-amber-700">Note: {item.note}</p>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-5 gap-2 pt-3 mt-3 border-t border-slate-100">
                    <button
                      onClick={() => onUpdateStatus(o.id, 'REJECTED')}
                      className="col-span-2 py-2 rounded-xl bg-rose-50 border border-rose-200 text-[#E5203A] font-extrabold text-xs hover:bg-rose-100 transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => onUpdateStatus(o.id, 'PREPARING')}
                      className="col-span-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-xs transition-colors"
                    >
                      Accept &amp; Cook
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* 2. Preparing in Kitchen */}
        <section className="bg-teal-50/60 border border-teal-200 rounded-2xl p-3.5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-teal-200">
            <h3 className="font-extrabold text-teal-950 text-sm flex items-center gap-2">
              <Flame size={16} className="text-[#0F766E]" />
              <span>Preparing in Kitchen</span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-[#0F766E] text-white font-extrabold text-xs">
              {preparingList.length}
            </span>
          </div>

          <div className="space-y-3 min-h-[220px]">
            {!preparingList.length ? (
              <div className="border-2 border-dashed border-teal-200 rounded-2xl p-8 text-center text-xs font-semibold text-teal-700/60">
                No orders in Preparing
              </div>
            ) : (
              preparingList.map((o) => (
                <div
                  key={o.id}
                  className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm space-y-2.5 animate-in fade-in"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono font-black text-sm text-slate-900">#{o.id}</span>
                      {o.orderType === 'IN_TABLE' || o.tableNo ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] shadow-2xs border border-amber-500">
                          🍽️ {o.tableNo ? `TABLE: ${o.tableNo}` : 'IN TABLE'}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 font-extrabold text-[10px]">
                          🛵 Deliver
                        </span>
                      )}
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold text-[10px]">
                        {o.paymentMethod === 'CASH_ON_DELIVERY' ? 'COD' : o.paymentMethod === 'CASH_IN_COUNTER' ? 'Pay Counter' : 'Online'}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-[#0F766E] bg-teal-50 px-2 py-0.5 rounded-lg">
                      {o.pickupTime}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <p className="font-extrabold text-slate-900">{o.customerName}</p>
                      <p className="font-mono text-[11px] text-slate-500">{o.customerPhone}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-black text-sm text-slate-900">
                        ₹{o.grandTotal}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs bg-slate-50 p-2.5 rounded-xl">
                    {o.items?.map((item: any, idx: number) => (
                      <div key={idx}>
                        <p className="font-bold text-slate-800">
                          <span className="font-mono">{item.qty}×</span> {item.name} ({item.size})
                        </p>
                        {item.note && (
                          <p className="text-[10px] font-bold text-amber-700">Note: {item.note}</p>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-5 gap-2 pt-3 mt-3 border-t border-slate-100">
                    {canPrint && (
                      <button
                        onClick={() => onOpenReceipt(o, 'KOT')}
                        className="col-span-2 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs transition-colors"
                      >
                        Print KOT
                      </button>
                    )}
                    <button
                      onClick={() => onUpdateStatus(o.id, 'READY')}
                      className={`${
                        canPrint ? 'col-span-3' : 'col-span-5'
                      } py-2 rounded-xl bg-[#0F766E] hover:bg-teal-800 text-white font-extrabold text-xs shadow-xs transition-colors`}
                    >
                      Mark Ready
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* 3. Ready for Pickup */}
        <section className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-emerald-200">
            <h3 className="font-extrabold text-emerald-950 text-sm flex items-center gap-2">
              <ShoppingBag size={16} className="text-emerald-600" />
              <span>Ready for Pickup</span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-extrabold text-xs">
              {readyList.length}
            </span>
          </div>

          <div className="space-y-3 min-h-[220px]">
            {!readyList.length ? (
              <div className="border-2 border-dashed border-emerald-200 rounded-2xl p-8 text-center text-xs font-semibold text-emerald-700/60">
                No orders Ready
              </div>
            ) : (
              readyList.map((o) => (
                <div
                  key={o.id}
                  className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm space-y-2.5 animate-in fade-in"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono font-black text-sm text-slate-900">#{o.id}</span>
                      {o.orderType === 'IN_TABLE' || o.tableNo ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] shadow-2xs border border-amber-500">
                          🍽️ {o.tableNo ? `TABLE: ${o.tableNo}` : 'IN TABLE'}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 font-extrabold text-[10px]">
                          🛵 Deliver
                        </span>
                      )}
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold text-[10px]">
                        {o.paymentMethod === 'CASH_ON_DELIVERY' ? 'COD' : o.paymentMethod === 'CASH_IN_COUNTER' ? 'Pay Counter' : 'Online'}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                      Counter #1
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <p className="font-extrabold text-slate-900">{o.customerName}</p>
                      <p className="font-mono text-[11px] text-slate-500">{o.customerPhone}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-black text-sm text-slate-900">
                        ₹{o.grandTotal}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs bg-slate-50 p-2.5 rounded-xl">
                    {o.items?.map((item: any, idx: number) => (
                      <div key={idx}>
                        <p className="font-bold text-slate-800">
                          <span className="font-mono">{item.qty}×</span> {item.name} ({item.size})
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-5 gap-2 pt-3 mt-3 border-t border-slate-100">
                    {canPrint && (
                      <button
                        onClick={() => onOpenReceipt(o, 'BILL')}
                        className="col-span-2 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs transition-colors"
                      >
                        View Bill
                      </button>
                    )}
                    <button
                      onClick={() => onUpdateStatus(o.id, 'COMPLETED')}
                      className={`${
                        canPrint ? 'col-span-3' : 'col-span-5'
                      } py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs transition-colors`}
                    >
                      Handed Over
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
