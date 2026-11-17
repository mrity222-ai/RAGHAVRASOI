'use client';

import React from 'react';
import { Download } from 'lucide-react';

interface SalesDashboardProps {
  orders: any[];
  activeCouponsCount: number;
}

export default function SalesDashboard({ orders, activeCouponsCount }: SalesDashboardProps) {
  const valid = orders.filter((o) => o.status !== 'REJECTED');
  const totalRevenue = valid.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
  const completedCount = valid.filter((o) => o.status === 'COMPLETED').length;

  const handleExportCSV = () => {
    const headers = ['Token', 'Customer', 'Phone', 'Payment', 'Total', 'Status', 'Date'];
    const rows = orders.map((o) => [
      o.id,
      `"${o.customerName}"`,
      o.customerPhone,
      o.paymentStatus,
      o.grandTotal,
      o.status,
      new Date(o.createdAt).toLocaleString(),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pickup_orders_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-black text-slate-900">Sales &amp; Revenue Dashboard</h2>
        <p className="text-xs text-slate-500">Real-time financial and self-pickup performance summary.</p>
      </div>

      {/* 4 KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <p className="text-[11px] font-bold uppercase text-slate-400">Today&apos;s Gross Sales</p>
          <p className="font-mono font-black text-2xl text-slate-900 mt-1">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <p className="text-[11px] font-bold uppercase text-slate-400">Total Pickup Orders</p>
          <p className="font-mono font-black text-2xl text-slate-900 mt-1">{valid.length}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <p className="text-[11px] font-bold uppercase text-slate-400">Handed Over</p>
          <p className="font-mono font-black text-2xl text-[#0F766E] mt-1">{completedCount}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <p className="text-[11px] font-bold uppercase text-slate-400">Active Promo Codes</p>
          <p className="font-mono font-black text-2xl text-[#E5203A] mt-1">{activeCouponsCount}</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-slate-900">Recent &amp; Completed Orders Log</h3>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase text-slate-500">
                <th className="py-3 px-4">Token</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Coupon</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-extrabold text-slate-900">#{o.id}</td>
                  <td className="py-3 px-4 font-bold text-slate-800">{o.customerName}</td>
                  <td className="py-3 px-4 text-slate-600">
                    {o.items?.map((i: any) => `${i.qty}× ${i.name}`).join(', ')}
                  </td>
                  <td className="py-3 px-4 font-mono text-teal-700 font-bold">{o.couponCode || '—'}</td>
                  <td className="py-3 px-4 font-bold text-slate-700">{o.paymentStatus}</td>
                  <td className="py-3 px-4 font-mono font-extrabold text-slate-900">₹{o.grandTotal}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        o.status === 'READY'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : o.status === 'PREPARING'
                          ? 'bg-teal-50 text-[#0F766E] border border-teal-200'
                          : o.status === 'COMPLETED'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
