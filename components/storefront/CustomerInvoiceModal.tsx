'use client';

import React from 'react';
import Image from 'next/image';
import { X, Printer, Clock, UtensilsCrossed, Bike, CheckCircle2, MapPin, Receipt, Share2 } from 'lucide-react';
import { useStorefrontCart } from '@/context/StorefrontCartContext';

function parseAddons(addons: any): string[] {
  if (!addons) return [];
  if (Array.isArray(addons)) return addons;
  if (typeof addons === 'string') {
    try {
      const parsed = JSON.parse(addons);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

export default function CustomerInvoiceModal() {
  const {
    isInvoiceOpen,
    setIsInvoiceOpen,
    completedOrder,
    setIsTrackingOpen,
    setActiveTrackingToken,
    settings,
  } = useStorefrontCart();

  if (!isInvoiceOpen || !completedOrder) return null;

  const order = completedOrder;
  const isInTable = order.orderType === 'IN_TABLE' || !!order.tableNo;
  const items = order.items || [];

  const handlePrint = () => {
    window.print();
  };

  const handleOpenTracker = () => {
    setActiveTrackingToken(order.id);
    setIsInvoiceOpen(false);
    setIsTrackingOpen(true);
  };

  const whatsappUrl =
    order.whatsappUrl ||
    `https://api.whatsapp.com/send?phone=91${(order.customerPhone || '').replace(/\D/g, '').slice(-10)}&text=${encodeURIComponent(
      `नमस्ते! राघव रसोई में मेरा ऑर्डर #${order.id} सफलतापूर्वक प्राप्त हो गया है। कुल राशि: ₹${order.grandTotal}। लाइव ट्रैकिंग लिंक: http://localhost:3000/track?id=${order.id}`
    )}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 print:p-0 print:bg-white">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[92vh] flex flex-col print:border-none print:shadow-none print:max-w-full print:rounded-none">
        
        {/* Modal Top Bar (Hidden on print) */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <Receipt size={16} className="text-[#E5203A]" />
            <span className="text-xs font-black uppercase tracking-wider">
              Official Dining Invoice &amp; Order Receipt
            </span>
          </div>
          <button
            onClick={() => setIsInvoiceOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Invoice Printable Sheet */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-slate-800 text-xs">
          
          {/* 1. Restaurant Header */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="relative w-14 h-14 shrink-0">
                <Image
                  src="/assets/logo/raghav-rasoi-logo-transparent.png"
                  alt="Raghav Rasoi"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 font-serif leading-tight">
                  राघव रसोई • RAGHAV RASOI
                </h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  Pure Veg • Breakfast &amp; Thali Junction
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  7th Avenue, Near Aarza Square - 2, Greater Noida West
                </p>
                <p className="text-[10px] text-slate-400">
                  Tel: +91 88396-75538 • GSTIN: 09AABCR1234F1Z5
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-black text-[10px] border border-emerald-200">
                ✓ ORDER CONFIRMED
              </span>
              <p className="font-mono font-black text-sm text-slate-900 mt-1">
                #{order.id}
              </p>
              <p className="text-[10px] text-slate-400">
                {new Date().toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>

          {/* 2. Highlighted Table Delivery Notice */}
          <div className={`p-4 rounded-2xl border-2 text-center space-y-1 ${
            isInTable
              ? 'bg-amber-50/70 border-amber-300 text-amber-950'
              : 'bg-blue-50/70 border-blue-300 text-blue-950'
          }`}>
            <div className="flex items-center justify-center gap-2">
              {isInTable ? (
                <>
                  <UtensilsCrossed size={18} className="text-[#E5203A]" />
                  <span className="text-sm sm:text-base font-black tracking-wide">
                    DELIVERY TO: {order.tableNo ? order.tableNo.toUpperCase() : 'TABLE SERVICE'}
                  </span>
                </>
              ) : (
                <>
                  <Bike size={18} className="text-blue-600" />
                  <span className="text-sm sm:text-base font-black tracking-wide">
                    DOORSTEP HOME DELIVERY
                  </span>
                </>
              )}
            </div>
            <p className="text-[11px] font-medium opacity-90">
              {isInTable
                ? 'Our waitstaff will serve your freshly prepared order directly to this table!'
                : `Delivery Address: ${order.deliveryAddress || 'Saved Customer Address'}`}
            </p>
          </div>

          {/* 3. Customer Info Strip */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px]">
            <div>
              <span className="text-slate-400 font-bold block text-[10px] uppercase">
                Customer Name:
              </span>
              <span className="font-extrabold text-slate-900">{order.customerName || 'Guest Dining'}</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold block text-[10px] uppercase">
                Contact Phone:
              </span>
              <span className="font-mono font-bold text-slate-900">{order.customerPhone || '—'}</span>
            </div>
          </div>

          {/* 4. Itemized Bill Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-[10px] font-extrabold uppercase text-slate-600">
                  <th className="py-2.5 px-3">Item</th>
                  <th className="py-2.5 px-2 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Rate</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((it: any, idx: number) => {
                  const rate = it.unitPrice || it.price || 0;
                  const qty = it.qty || it.quantity || 1;
                  const itemAmount = rate * qty;
                  return (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3">
                        <p className="font-extrabold text-slate-900">{it.name || it.title}</p>
                        {it.size && (() => {
                          const addonList = parseAddons(it.addons);
                          return (
                            <p className="text-[10px] text-slate-500">
                              Portion: {it.size} {addonList.length ? `• ${addonList.join(', ')}` : ''}
                            </p>
                          );
                        })()}
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono font-bold text-slate-700">
                        {qty}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-500">
                        ₹{rate}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-black text-slate-900">
                        ₹{itemAmount}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 5. Financial Calculation Breakdown */}
          <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-200 font-medium">
            <div className="flex justify-between text-slate-600">
              <span>Item Subtotal</span>
              <span className="font-mono font-bold">₹{order.itemTotal}</span>
            </div>

            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Coupon Discount {order.couponCode ? `(${order.couponCode})` : ''}</span>
                <span className="font-mono">-₹{order.discountAmount}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600">
              <span>GST (5%)</span>
              <span className="font-mono">₹{order.gstAmount || Math.round(order.itemTotal * 0.05)}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Table / Packaging Charge</span>
              <span className="font-mono">{isInTable ? '₹0 (Waived for Table)' : `₹${order.packagingCharge || 10}`}</span>
            </div>

            <div className="pt-2 border-t border-slate-300 flex justify-between items-center text-sm font-black text-slate-900">
              <span>Grand Total</span>
              <span className="text-base text-[#E5203A] font-mono">₹{order.grandTotal}</span>
            </div>

            <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
              <span>Payment Mode:</span>
              <span className="font-bold uppercase text-slate-700">
                {order.paymentMethod === 'CASH_IN_COUNTER'
                  ? 'Cash / UPI at Counter'
                  : order.paymentMethod === 'CASH_ON_DELIVERY'
                  ? 'Cash on Delivery'
                  : 'Online Payment'}
              </span>
            </div>
          </div>

          {/* 6. Authentic Hospitality Footer */}
          <div className="text-center pt-2 space-y-1">
            <p className="font-extrabold text-slate-800 text-[11px]">
              Thank you for dining at Raghav Rasoi!
            </p>
            <p className="text-[10px] text-slate-400">
              Pure Vegetarian &amp; Authentic Flavours • Serving Fresh Everyday
            </p>
          </div>

        </div>

        {/* Modal Footer (Hidden on print) */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5 shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 font-extrabold text-xs text-slate-700 hover:bg-white transition-colors"
            >
              <Printer size={14} />
              <span>Print</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-extrabold text-xs shadow-xs transition-colors"
            >
              <span>📲 Send on WhatsApp</span>
            </a>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenTracker}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white font-extrabold text-xs shadow-sm transition-colors"
            >
              <Clock size={14} />
              <span>Track Live Status</span>
            </button>
            <button
              onClick={() => setIsInvoiceOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
