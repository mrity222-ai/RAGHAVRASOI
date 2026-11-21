'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  X,
  Check,
  UtensilsCrossed,
  Package,
  Clock,
  MapPin,
  Search,
  ExternalLink,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { useStorefrontCart } from '@/context/StorefrontCartContext';

export default function LiveTokenTrackerModal() {
  const { isTrackingOpen, setIsTrackingOpen, activeTrackingToken, setActiveTrackingToken } =
    useStorefrontCart();

  const [searchInput, setSearchInput] = useState('');
  const [currentOrder, setCurrentOrder] = useState<any | null>(null);
  const [queuePosition, setQueuePosition] = useState(0);
  const [estimatedMins, setEstimatedMins] = useState(12);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchTrackData = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/orders/track?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (data.success && data.data) {
        setCurrentOrder(data.data.order);
        setQueuePosition(data.data.queuePosition || 0);
        setEstimatedMins(data.data.estimatedMins || 12);
        setActiveTrackingToken(data.data.order.id);
      } else {
        setErrorMsg(data.error || 'Order not found');
      }
    } catch (e) {
      console.error(e);
      setErrorMsg('Failed to fetch order status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isTrackingOpen) {
      const initialQuery = activeTrackingToken || '';
      if (initialQuery) {
        setSearchInput(initialQuery);
        fetchTrackData(initialQuery);
      } else {
        // Fallback to latest order
        fetch('/api/orders')
          .then((r) => r.json())
          .then((d) => {
            if (d.success && d.data && d.data.length > 0) {
              const latest = d.data[0];
              setSearchInput(latest.id);
              fetchTrackData(latest.id);
            }
          })
          .catch(() => {});
      }
    }
  }, [isTrackingOpen, activeTrackingToken]);

  // Live poll every 5s if active
  useEffect(() => {
    if (!isTrackingOpen || !currentOrder?.id) return;
    if (currentOrder.status === 'COMPLETED' || currentOrder.status === 'REJECTED') return;

    const interval = setInterval(() => {
      fetchTrackData(currentOrder.id);
    }, 5000);

    return () => clearInterval(interval);
  }, [isTrackingOpen, currentOrder?.id, currentOrder?.status]);

  if (!isTrackingOpen) return null;

  const order = currentOrder || {
    id: activeTrackingToken || 'ORD-NEW',
    status: 'PREPARING',
    customerName: 'Guest Customer',
    orderType: 'IN_TABLE',
    tableNo: 'Table 4',
    paymentMethod: 'CASH_IN_COUNTER',
    pickupTime: 'Serve at Table',
    grandTotal: 250,
    items: [],
  };

  const isInTable = order.orderType === 'IN_TABLE' || !!order.tableNo;

  const rankMap: Record<string, number> = {
    PENDING: 1,
    PREPARING: 2,
    READY: 3,
    COMPLETED: 4,
  };
  const curRank = rankMap[order.status] || 1;

  const steps = [
    {
      r: 1,
      title: 'Order Received & Confirmed',
      sub: 'Order sent to the kitchen & confirmed by staff',
    },
    {
      r: 2,
      title: 'Kitchen Preparing Your Meal',
      sub: 'Chef is preparing your dishes fresh & hot',
    },
    {
      r: 3,
      title: isInTable ? 'Food Ready & Being Served' : 'Parcel Ready at Billing Counter',
      sub: isInTable
        ? `Server is bringing food to ${order.tableNo || 'your table'}`
        : 'Order packed in sealed container, ready at counter',
    },
    {
      r: 4,
      title: isInTable ? 'Served at Table' : 'Order Picked Up / Completed',
      sub: 'Order completed. Enjoy your delicious food!',
    },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrackData(searchInput);
  };

  const whatsappUrl = order?.customerPhone
    ? `https://api.whatsapp.com/send?phone=91${(order.customerPhone || '').replace(/\D/g, '').slice(-10)}&text=${encodeURIComponent(
        `नमस्ते! राघव रसोई में मेरा ऑर्डर #${order.id} है। लाइव स्टेटस: http://localhost:3000/track?id=${order.id}`
      )}`
    : '';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[92vh] flex flex-col">
        
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <span className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Live Kitchen Order Tracker
          </span>
          <button
            onClick={() => setIsTrackingOpen(false)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          
          {/* Quick Search Input */}
          <form onSubmit={handleSearchSubmit} className="flex gap-1.5">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Order ID (e.g. ORD-1234) or Mobile"
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:border-[#B45309] focus:bg-white transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !searchInput.trim()}
              className="px-3.5 py-2 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white font-black text-xs transition-colors shrink-0 disabled:opacity-50"
            >
              {loading ? '...' : 'Track'}
            </button>
          </form>

          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-1.5">
              <AlertCircle size={14} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Hero Order Card */}
          <div className="bg-slate-900 text-white rounded-3xl p-5 text-center space-y-3 shadow-md">
            <div className="flex items-center justify-center gap-2">
              {isInTable ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-[11px] uppercase tracking-wider border border-amber-500/30">
                  <UtensilsCrossed size={12} /> {order.tableNo || 'Table Service'}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 font-extrabold text-[11px] uppercase tracking-wider border border-blue-500/30">
                  <Package size={12} /> Parcel Takeaway
                </span>
              )}

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 text-slate-200 font-bold text-[11px]">
                {order.paymentMethod === 'ONLINE' ? 'Online Paid' : 'Pay at Counter'}
              </span>
            </div>

            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300">
                Unique Order Number
              </p>
              <h2 className="font-mono font-black text-3xl text-amber-400 mt-0.5">
                #{order.id}
              </h2>
            </div>

            {/* Kitchen Queue Status */}
            <div className="bg-white/10 p-2.5 rounded-2xl flex items-center justify-between text-xs px-3">
              <span className="text-slate-300 text-[11px]">Kitchen Queue:</span>
              <span className="font-bold text-amber-300">
                {order.status === 'COMPLETED'
                  ? 'Completed'
                  : order.status === 'READY'
                  ? 'Food Ready!'
                  : queuePosition === 0
                  ? '🍳 Cooking Now'
                  : `🍳 ${queuePosition} orders ahead`}
              </span>
            </div>

            <p className="text-xs text-slate-300">
              Customer: <strong className="text-white">{order.customerName}</strong>
              {order.customerPhone ? ` • +91 ${order.customerPhone}` : ''}
            </p>
          </div>

          {/* 4-Step Timeline */}
          {order.status === 'REJECTED' ? (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-center text-xs font-bold text-rose-700">
              Order Cancelled or Rejected by Store
            </div>
          ) : (
            <div className="space-y-3 px-1 pt-1">
              {steps.map((st, idx) => {
                const done = curRank > st.r || (order.status === 'COMPLETED' && st.r === 4);
                const active = curRank === st.r && order.status !== 'COMPLETED';

                return (
                  <div key={st.r} className="flex items-start gap-3 relative">
                    {idx < steps.length - 1 && (
                      <div
                        className={`w-0.5 h-8 absolute left-3.5 top-7 ${
                          done ? 'bg-emerald-500' : 'bg-slate-200'
                        }`}
                      />
                    )}

                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 relative transition-all ${
                        done
                          ? 'bg-emerald-600 text-white'
                          : active
                          ? 'bg-[#B45309] text-white ring-4 ring-[#B45309]/20'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {done ? <Check size={14} /> : st.r}
                    </div>

                    <div className="flex-1 pb-2">
                      <p
                        className={`text-xs font-black ${
                          done
                            ? 'text-emerald-800'
                            : active
                            ? 'text-slate-900 font-extrabold'
                            : 'text-slate-400'
                        }`}
                      >
                        {st.title}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{st.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quick Action Footer */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-extrabold text-xs shadow-xs"
              >
                <span>📲 Open in WhatsApp</span>
              </a>
            )}

            <Link
              href={`/track?id=${order.id}`}
              onClick={() => setIsTrackingOpen(false)}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#B45309] hover:underline"
            >
              <span>Full Screen View</span>
              <ExternalLink size={12} />
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
