'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Clock,
  UtensilsCrossed,
  CheckCircle2,
  Package,
  ArrowLeft,
  RefreshCw,
  Share2,
  Check,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('id') || searchParams.get('q') || searchParams.get('phone') || '';

  const [searchInput, setSearchInput] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultData, setResultData] = useState<any | null>(null);

  const fetchTrackData = async (queryToSearch: string) => {
    if (!queryToSearch.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/orders/track?q=${encodeURIComponent(queryToSearch.trim())}`);
      const data = await res.json();

      if (data.success && data.data) {
        setResultData(data.data);
      } else {
        setError(data.error || 'Order not found. Please verify your Order Number or Mobile Number.');
        setResultData(null);
      }
    } catch (err) {
      console.error(err);
      setError('Network error tracking order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      setSearchInput(initialQuery);
      fetchTrackData(initialQuery);
    }
  }, [initialQuery]);

  // Live Auto-Poll every 6 seconds if an active order is being tracked
  useEffect(() => {
    if (!resultData?.order) return;
    const currentStatus = resultData.order.status;
    if (currentStatus === 'COMPLETED' || currentStatus === 'REJECTED') return;

    const interval = setInterval(() => {
      fetchTrackData(resultData.order.id);
    }, 6000);

    return () => clearInterval(interval);
  }, [resultData?.order?.id, resultData?.order?.status]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrackData(searchInput);
  };

  const order = resultData?.order;
  const queuePosition = resultData?.queuePosition ?? 0;
  const estimatedMins = resultData?.estimatedMins ?? 12;

  const rankMap: Record<string, number> = {
    PENDING: 1,
    PREPARING: 2,
    READY: 3,
    COMPLETED: 4,
  };
  const curRank = order ? rankMap[order.status] || 1 : 1;
  const isInTable = order ? order.orderType === 'IN_TABLE' || !!order.tableNo : true;

  const steps = [
    {
      r: 1,
      title: 'Order Received & Confirmed',
      sub: 'Order confirmed and sent to Raghav Rasoi kitchen',
    },
    {
      r: 2,
      title: 'Kitchen Preparing Your Meal',
      sub: 'Chef is handcrafting your dishes fresh with pure desi ghee',
    },
    {
      r: 3,
      title: isInTable ? 'Food Ready & Being Served' : 'Parcel Ready at Counter',
      sub: isInTable
        ? `Server is bringing hot dishes to ${order?.tableNo || 'your table'}`
        : 'Your parcel is packed and ready for pickup at billing counter',
    },
    {
      r: 4,
      title: isInTable ? 'Served at Table' : 'Order Picked Up / Completed',
      sub: 'Order completed. Enjoy your delicious traditional meal!',
    },
  ];

  // Generate WhatsApp message share link
  const whatsappUrl = order
    ? `https://api.whatsapp.com/send?phone=91${(order.customerPhone || '').replace(/\D/g, '').slice(-10)}&text=${encodeURIComponent(
        `नमस्ते! राघव रसोई में मेरा ऑर्डर #${order.id} है। लाइव स्टेटस: ${window?.location?.origin || ''}/track?id=${order.id}`
      )}`
    : '';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]/60 text-slate-800">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/menu"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B45309] hover:underline"
          >
            <ArrowLeft size={14} /> Back to Menu
          </Link>

          <span className="text-xs font-bold text-slate-500">
            Raghav Rasoi Live Kitchen Tracker
          </span>
        </div>

        {/* Hero Search Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-extrabold border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Live Kitchen Order Tracking
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Track Your Food Order
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            Enter your <strong>Order ID (e.g. ORD-1234)</strong> or your <strong>10-digit Mobile Number</strong> to see live kitchen preparation, queue position, and table delivery status.
          </p>

          <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto flex gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="e.g. ORD-8492 or 9876543210"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-200 font-mono font-bold text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#B45309] focus:bg-white transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !searchInput.trim()}
              className="px-5 py-3 rounded-2xl bg-[#B45309] hover:bg-[#92400E] text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 shrink-0"
            >
              {loading ? 'Searching...' : 'Track'}
            </button>
          </form>

          {error && (
            <div className="max-w-md mx-auto p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2 text-left animate-in fade-in">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Live Order Display Card */}
        {order && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* 1. Kitchen Status & Queue Position Card */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-5 border border-slate-800">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-mono font-black text-2xl sm:text-3xl text-amber-400">
                    #{order.id}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isInTable ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-xs border border-amber-500/30">
                      <UtensilsCrossed size={14} /> {order.tableNo || 'Table Service'}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 font-extrabold text-xs border border-blue-500/30">
                      <Package size={14} /> Parcel Takeaway
                    </span>
                  )}

                  <span className="px-3 py-1 rounded-full bg-white/10 text-slate-200 font-bold text-xs">
                    {order.paymentMethod === 'ONLINE' ? 'Online Paid' : 'Pay at Counter'}
                  </span>
                </div>
              </div>

              {/* Kitchen Queue Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <p className="text-[10px] uppercase tracking-wider font-extrabold text-amber-300">
                    Kitchen Queue Status
                  </p>
                  <p className="text-sm font-black text-white">
                    {order.status === 'COMPLETED'
                      ? '✅ Order Served & Completed'
                      : order.status === 'READY'
                      ? '🍽️ Food Ready to Serve!'
                      : queuePosition === 0
                      ? '🍳 Cooking Now on Chef’s Stovetop'
                      : `🍳 ${queuePosition} ${queuePosition === 1 ? 'order' : 'orders'} ahead in kitchen queue`}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <p className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-300">
                    Estimated Time
                  </p>
                  <p className="text-sm font-black text-white flex items-center gap-1.5">
                    <Clock size={16} className="text-emerald-400" />
                    <span>
                      {order.status === 'COMPLETED'
                        ? 'Completed'
                        : order.status === 'READY'
                        ? 'Ready Now'
                        : `~${estimatedMins} Mins remaining`}
                    </span>
                  </p>
                </div>
              </div>

              {/* Customer & Destination Strip */}
              <div className="flex flex-wrap items-center justify-between text-xs text-slate-300 pt-1">
                <p>
                  Customer: <strong className="text-white">{order.customerName}</strong> • +91 {order.customerPhone}
                </p>
                <button
                  type="button"
                  onClick={() => fetchTrackData(order.id)}
                  className="inline-flex items-center gap-1 text-xs text-amber-300 hover:text-amber-200 font-bold"
                >
                  <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                  <span>Refresh Status</span>
                </button>
              </div>
            </div>

            {/* 2. Four-Step Timeline */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="font-black text-slate-900 text-base sm:text-lg">
                Preparation Progress
              </h3>

              <div className="space-y-4 pt-2">
                {steps.map((st, idx) => {
                  const done = curRank > st.r || (order.status === 'COMPLETED' && st.r === 4);
                  const active = curRank === st.r && order.status !== 'COMPLETED';

                  return (
                    <div key={st.r} className="flex items-start gap-4 relative">
                      {idx < steps.length - 1 && (
                        <div
                          className={`w-0.5 h-10 absolute left-4 top-8 ${
                            done ? 'bg-emerald-500' : 'bg-slate-200'
                          }`}
                        />
                      )}

                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 relative transition-all ${
                          done
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : active
                            ? 'bg-[#B45309] text-white ring-4 ring-[#B45309]/20'
                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                        }`}
                      >
                        {done ? <Check size={16} /> : st.r}
                      </div>

                      <div className="flex-1 pb-4">
                        <p
                          className={`text-sm font-black leading-snug ${
                            done
                              ? 'text-emerald-800'
                              : active
                              ? 'text-slate-900'
                              : 'text-slate-400'
                          }`}
                        >
                          {st.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">{st.sub}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Itemized Bill & Dishes Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-black text-slate-900 text-base">
                  Ordered Dishes ({order.items?.length || 0})
                </h3>
                <span className="font-mono font-black text-base text-[#B45309]">
                  ₹{order.grandTotal}
                </span>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {order.items?.map((it: any, i: number) => (
                  <div key={i} className="py-2.5 flex items-center justify-between">
                    <div>
                      <p className="font-extrabold text-slate-900">{it.name}</p>
                      <p className="text-slate-500 text-[11px]">
                        Portion: {it.size || 'Regular'} • Qty: {it.qty}
                      </p>
                    </div>
                    <span className="font-mono font-bold text-slate-900">
                      ₹{it.unitPrice * it.qty}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-extrabold text-xs shadow-sm transition-all"
                  >
                    <span>📲 Open Updates in WhatsApp</span>
                    <ExternalLink size={14} />
                  </a>
                )}

                <Link
                  href="/menu"
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-[#B45309] text-white font-extrabold text-xs transition-colors"
                >
                  Order More Food
                </Link>
              </div>
            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white text-slate-600 text-xs font-bold">
          Loading Tracker...
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
