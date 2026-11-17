'use client';

import React from 'react';
import { X, Printer } from 'lucide-react';

interface ThermalReceiptModalProps {
  order: any | null;
  type: 'KOT' | 'BILL';
  onClose: () => void;
  storeName: string;
}

export default function ThermalReceiptModal({
  order,
  type,
  onClose,
  storeName,
}: ThermalReceiptModalProps) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xs w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase">
            {type === 'KOT' ? `Kitchen Order Ticket (KOT)` : `Tax Invoice Bill`}
          </span>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={16} />
          </button>
        </div>

        {/* Thermal Paper Simulation */}
        <div className="p-4 font-mono text-xs text-slate-800 space-y-2.5 max-h-[65vh] overflow-y-auto bg-white">
          <div className="text-center border-b border-dashed border-slate-300 pb-2">
            <p className="font-bold text-sm tracking-wide">{storeName}</p>
            <p className="text-[10px] text-slate-500">
              Token: <strong className="text-slate-900">#{order.id}</strong> • {order.pickupTime}
            </p>
            <p className="text-[9px] text-slate-400">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="text-[11px]">
            <p>
              Customer: <strong>{order.customerName}</strong>
            </p>
            <p className="text-slate-500">{order.customerPhone}</p>
          </div>

          <div className="border-y border-dashed border-slate-300 py-2 space-y-1">
            {order.items?.map((i: any, idx: number) => (
              <div key={idx} className="flex justify-between items-start text-[11px]">
                <div>
                  <span>
                    {i.qty}× {i.name}
                  </span>
                  {i.size && <span className="text-[10px] text-slate-400"> ({i.size})</span>}
                  {i.note && (
                    <p className="text-[10px] text-amber-700 italic">Note: {i.note}</p>
                  )}
                </div>
                <span className="font-bold">₹{i.lineTotal || i.unitPrice * i.qty}</span>
              </div>
            ))}
          </div>

          {type === 'BILL' ? (
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>₹{order.itemTotal}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Discount ({order.couponCode || 'Promo'})</span>
                  <span>-₹{order.discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>GST Tax</span>
                <span>₹{order.gstAmount}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Packaging</span>
                <span>₹{order.packagingCharge}</span>
              </div>
              <div className="flex justify-between font-bold text-sm border-t border-slate-300 pt-1.5 text-slate-900">
                <span>GRAND TOTAL</span>
                <span>₹{order.grandTotal}</span>
              </div>
              <div className="pt-1 text-[10px] text-slate-500 flex justify-between">
                <span>Payment Mode:</span>
                <span className="font-bold uppercase text-slate-800">
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-center text-[10px] text-slate-400 font-bold tracking-widest pt-2">
              *** KITCHEN COPY • COUNTER #1 ***
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-100"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
          >
            <Printer size={13} />
            <span>Print</span>
          </button>
        </div>

      </div>
    </div>
  );
}
