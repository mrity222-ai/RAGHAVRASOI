'use client';

import React, { useState, useEffect } from 'react';
import { X, Check, UtensilsCrossed, Bike, Clock, MapPin, Receipt, CheckCircle2 } from 'lucide-react';
import { useStorefrontCart } from '@/context/StorefrontCartContext';

export default function LiveTokenTrackerModal() {
  const { isTrackingOpen, setIsTrackingOpen, activeTrackingToken, setActiveTrackingToken, settings } =
    useStorefrontCart();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success && data.data) {
        setOrders(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isTrackingOpen) {
      fetchOrders();
      const interval = setInterval(fetchOrders, 3500); // Live poll every 3.5s
      return () => clearInterval(interval);
    }
  }, [isTrackingOpen]);

  if (!isTrackingOpen) return null;

  const currentOrder = orders.find((o) => o.id === activeTrackingToken) || orders[0] || {
    id: activeTrackingToken,
    status: 'PREPARING',
    customerName: 'Guest Customer',
    orderType: 'IN_TABLE',
    tableNo: 'Table 4',
    paymentMethod: 'CASH_IN_COUNTER',
    pickupTime: 'Serve at Table',
    grandTotal: 349,
    items: [],
  };

  const isInTable = currentOrder.orderType === 'IN_TABLE' || !!currentOrder.tableNo;

  const rankMap: Record<string, number> = {
    PENDING: 1,
    PREPARING: 2,
    READY: 3,
    COMPLETED: 4,
  };
  const curRank = rankMap[currentOrder.status] || 1;

  const steps = [
    {
      r: 1,
      title: 'Order Received & Confirmed',
      sub: 'Order sent to the kitchen & confirmed by staff',
    },
    {
      r: 2,
      title: 'Kitchen Preparing Your Meal',
      sub: 'Our chef is preparing your dishes fresh & hot',
    },
    {
      r: 3,
      title: isInTable ? 'Food Ready & Being Served' : 'Out for Doorstep Delivery',
      sub: isInTable
        ? `Server is bringing food to ${currentOrder.tableNo || 'your table'}`
        : `Rider is on the way to your delivery address`,
    },
    {
      r: 4,
      title: isInTable ? 'Served at Table' : 'Order Delivered',
      sub: 'Order completed. Enjoy your delicious food!',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-2">
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
        <div className="p-5 overflow-y-auto space-y-4">
          
          {/* Order ID Selector Tabs (if multiple orders exist) */}
          {orders.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {orders.slice(0, 5).map((o) => (
                <button
                  key={o.id}
                  onClick={() => setActiveTrackingToken(o.id)}
                  className={`px-3 py-1 rounded-xl font-mono text-xs font-extrabold transition-all shrink-0 ${
                    o.id === currentOrder.id
                      ? 'bg-[#E5203A] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  #{o.id} {o.tableNo ? `(${o.tableNo})` : ''}
                </button>
              ))}
            </div>
          )}

          {/* Hero Order Display Card */}
          <div className="bg-slate-900 text-white rounded-3xl p-5 text-center space-y-2 shadow-md">
            <div className="flex items-center justify-center gap-2">
              {isInTable ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-[11px] uppercase tracking-wider border border-amber-500/30">
                  <UtensilsCrossed size={12} /> {currentOrder.tableNo || 'Table Service'}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 font-extrabold text-[11px] uppercase tracking-wider border border-blue-500/30">
                  <Bike size={12} /> Doorstep Delivery
                </span>
              )}

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 text-slate-200 font-bold text-[11px]">
                {currentOrder.paymentMethod === 'CASH_ON_DELIVERY'
                  ? 'Cash on Delivery'
                  : currentOrder.paymentMethod === 'CASH_IN_COUNTER'
                  ? 'Cash in Counter'
                  : 'Online Paid'}
              </span>
            </div>

            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-teal-300">
                Unique Order Number
              </p>
              <h2 className="font-mono font-black text-4xl text-amber-400 mt-0.5">
                #{currentOrder.id}
              </h2>
            </div>

            <p className="text-xs text-slate-300">
              Customer: <strong className="text-white">{currentOrder.customerName}</strong>
            </p>

            {currentOrder.deliveryAddress && (
              <p className="text-[11px] text-slate-300 bg-white/5 p-2 rounded-xl flex items-center justify-center gap-1.5">
                <MapPin size={12} className="text-[#E5203A] shrink-0" />
                <span className="truncate">{currentOrder.deliveryAddress}</span>
              </p>
            )}
          </div>

          {/* 4-Step Live Progress Timeline */}
          {currentOrder.status === 'REJECTED' ? (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-center text-xs font-bold text-[#E5203A]">
              Order Cancelled or Rejected by Store
            </div>
          ) : (
            <div className="space-y-4 px-2 pt-2">
              {steps.map((st, idx) => {
                const done = curRank > st.r || (currentOrder.status === 'COMPLETED' && st.r === 4);
                const active = curRank === st.r && currentOrder.status !== 'COMPLETED';

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
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 relative transition-all ${
                        done
                          ? 'bg-emerald-500 text-white'
                          : active
                          ? 'bg-[#E5203A] text-white ring-4 ring-[#E5203A]/20'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {done ? <Check size={14} /> : st.r}
                    </div>

                    <div className="min-w-0">
                      <p
                        className={`text-xs font-extrabold ${
                          active
                            ? 'text-[#E5203A]'
                            : done
                            ? 'text-emerald-700'
                            : 'text-slate-400'
                        }`}
                      >
                        {st.title} {active && '• In Progress'}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{st.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Real-time sync note */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-[11px] text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span>
              Real-time Kitchen Sync: As soon as the kitchen staff changes order status in Admin, this screen updates instantly!
            </span>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-xs font-mono font-bold text-slate-700">
            Total: ₹{currentOrder.grandTotal}
          </span>
          <button
            onClick={() => setIsTrackingOpen(false)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-colors"
          >
            Close Tracker
          </button>
        </div>

      </div>
    </div>
  );
}
