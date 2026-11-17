'use client';

import React, { useState } from 'react';
import { ShoppingBag, X, UtensilsCrossed, Bike, IndianRupee, Store, Check, MapPin, Receipt, ShieldCheck } from 'lucide-react';
import { useStorefrontCart } from '@/context/StorefrontCartContext';

export default function StoreCartDrawer() {
  const {
    cart,
    updateQty,
    removeFromCart,
    clearCart,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    totals,
    settings,
    isCartOpen,
    setIsCartOpen,
    setIsTrackingOpen,
    setActiveTrackingToken,
    loggedInMember,
    setLoggedInMember,
    orderType,
    setOrderType,
    tableNo,
    setTableNo,
    deliveryAddress,
    setDeliveryAddress,
    paymentMethod,
    setPaymentMethod,
  } = useStorefrontCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [checkoutMode, setCheckoutMode] = useState<'GUEST' | 'MEMBER'>('GUEST');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [memberPhoneInput, setMemberPhoneInput] = useState('9876543210');
  const [submitting, setSubmitting] = useState(false);

  if (!isCartOpen) return null;

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponError('');
    const res = await applyCouponCode(couponInput.trim());
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  const handleMemberQuickLogin = () => {
    if (memberPhoneInput.length < 10) {
      alert('Enter a valid 10-digit mobile number');
      return;
    }
    setLoggedInMember({ name: 'Rahul Verma', phone: memberPhoneInput });
  };

  const handleSubmitOrder = async () => {
    if (!settings.isOpen) {
      alert('Restaurant is currently closed for incoming orders.');
      return;
    }
    if (!cart.length) return;

    let customerName = '';
    let customerPhone = '';
    let isGuest = true;

    if (checkoutMode === 'MEMBER' && loggedInMember) {
      customerName = loggedInMember.name;
      customerPhone = loggedInMember.phone;
      isGuest = false;
    } else {
      customerName = guestName.trim();
      customerPhone = guestPhone.trim();
      if (!customerName || customerPhone.length < 10) {
        alert('Please enter your full Name and 10-digit Mobile Number.');
        return;
      }
    }

    // Validation for In Table vs Deliver
    if (orderType === 'IN_TABLE' && !tableNo.trim()) {
      alert('Please enter your Table Number to proceed.');
      return;
    }

    if (orderType === 'DELIVER' && !deliveryAddress.trim()) {
      alert('Please enter your complete Delivery Address.');
      return;
    }

    setSubmitting(true);
    try {
      const pickupTimeText =
        orderType === 'IN_TABLE'
          ? `Serve at ${tableNo}`
          : `Deliver in ${settings.prepTimeMins + 10} mins`;

      // Packaging charge is ₹10 for delivery, waived (₹0) for In Table dining
      const finalPackaging = orderType === 'IN_TABLE' ? 0 : totals.packagingCharge;
      const finalGrandTotal = totals.itemTotal - totals.discountAmount + totals.gstAmount + finalPackaging;

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          isGuest,
          orderType,
          tableNo: orderType === 'IN_TABLE' ? tableNo : null,
          deliveryAddress: orderType === 'DELIVER' ? deliveryAddress : null,
          paymentMethod,
          paymentStatus: 'PENDING',
          pickupTime: pickupTimeText,
          couponCode: appliedCoupon ? appliedCoupon.code : null,
          discountAmount: totals.discountAmount,
          itemTotal: totals.itemTotal,
          gstAmount: totals.gstAmount,
          packagingCharge: finalPackaging,
          grandTotal: finalGrandTotal,
          items: cart,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        clearCart();
        setActiveTrackingToken(data.data.id);
        setIsCartOpen(false);
        setIsTrackingOpen(true);
      } else {
        alert(data.error || 'Failed to place order');
      }
    } catch (e) {
      console.error(e);
      alert('Error placing order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const finalPackaging = orderType === 'IN_TABLE' ? 0 : totals.packagingCharge;
  const currentGrandTotal = totals.itemTotal - totals.discountAmount + totals.gstAmount + finalPackaging;

  const quickTables = ['Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5', 'Table 6', 'Table 7', 'Table 8'];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#E5203A] flex items-center justify-center font-bold">
              <ShoppingBag size={18} />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">Your Food Cart</h3>
              <p className="text-[11px] text-slate-500 font-semibold">{totalQty} {totalQty === 1 ? 'dish' : 'dishes'} selected</p>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!cart.length ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center text-2xl">
                <ShoppingBag size={32} />
              </div>
              <h4 className="font-black text-base text-slate-900">Your cart is empty</h4>
              <p className="text-xs text-slate-500">
                Browse our delicious burgers, pizza, Chinese noodles or snacks and customize with extra toppings to order!
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-[#E5203A] text-white font-extrabold text-xs"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <>
              {/* 1. Fulfillment Mode Switch: "In Table" vs "Deliver" */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-black uppercase tracking-wider text-slate-800">
                    Dining / Delivery Preference <span className="text-[#E5203A]">*</span>
                  </p>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {orderType === 'IN_TABLE' ? '🍽️ Dine-In' : '🛵 Doorstep Delivery'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  {/* Option 1: In Table */}
                  <button
                    type="button"
                    onClick={() => {
                      setOrderType('IN_TABLE');
                      setPaymentMethod('CASH_IN_COUNTER');
                    }}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
                      orderType === 'IN_TABLE'
                        ? 'bg-white border-[#E5203A] shadow-sm text-slate-900 ring-2 ring-[#E5203A]/20'
                        : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <UtensilsCrossed size={18} className={orderType === 'IN_TABLE' ? 'text-[#E5203A]' : 'text-slate-400'} />
                    <span>In Table</span>
                    <span className="text-[10px] font-normal text-slate-500">Serve at Table</span>
                  </button>

                  {/* Option 2: Deliver */}
                  <button
                    type="button"
                    onClick={() => {
                      setOrderType('DELIVER');
                      setPaymentMethod('CASH_ON_DELIVERY');
                    }}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
                      orderType === 'DELIVER'
                        ? 'bg-white border-[#E5203A] shadow-sm text-slate-900 ring-2 ring-[#E5203A]/20'
                        : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <Bike size={18} className={orderType === 'DELIVER' ? 'text-[#E5203A]' : 'text-slate-400'} />
                    <span>Deliver</span>
                    <span className="text-[10px] font-normal text-slate-500">Home Delivery</span>
                  </button>
                </div>

                {/* In Table: Table Number Input & Quick Chips */}
                {orderType === 'IN_TABLE' && (
                  <div className="space-y-2 pt-1 animate-in fade-in">
                    <label className="block text-[11px] font-extrabold text-slate-700">
                      Enter Your Table Number <span className="text-[#E5203A]">*</span>
                    </label>
                    <input
                      type="text"
                      value={tableNo}
                      onChange={(e) => setTableNo(e.target.value)}
                      placeholder="e.g. Table 4 or T-12"
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#E5203A] focus:ring-1 focus:ring-[#E5203A]"
                    />
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {quickTables.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTableNo(t)}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                            tableNo === t
                              ? 'bg-[#E5203A] text-white border-[#E5203A]'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-500 italic">
                      ✨ Our servers will bring your hot order directly to this table.
                    </p>
                  </div>
                )}

                {/* Deliver: Address Input */}
                {orderType === 'DELIVER' && (
                  <div className="space-y-2 pt-1 animate-in fade-in">
                    <label className="block text-[11px] font-extrabold text-slate-700">
                      Delivery Address &amp; Landmark <span className="text-[#E5203A]">*</span>
                    </label>
                    <textarea
                      rows={2}
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Flat/House No., Building Name, Street, Landmark..."
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#E5203A] focus:ring-1 focus:ring-[#E5203A]"
                    />
                    <p className="text-[10px] text-slate-500 italic">
                      🛵 Delivery packaging charge of ₹10 applies for doorstep delivery.
                    </p>
                  </div>
                )}
              </div>

              {/* 2. Items List */}
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 divide-y divide-slate-200/70">
                <p className="text-[11px] font-black uppercase tracking-wider text-slate-700 pb-2">
                  Order Items ({totalQty})
                </p>
                {cart.map((item, idx) => (
                  <div key={idx} className="py-2.5 first:pt-2 last:pb-0 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-extrabold text-xs text-slate-900">{item.name}</p>
                      <p className="text-[11px] text-slate-500">
                        <span className="font-semibold text-slate-700">{item.size}</span>
                        {item.addons?.length ? ' • ' + item.addons.join(', ') : ''}
                      </p>
                      {item.note && (
                        <p className="text-[10px] font-bold text-amber-700 mt-0.5">
                          Note: {item.note}
                        </p>
                      )}
                      <p className="font-mono font-extrabold text-xs text-slate-900 mt-1">
                        ₹{item.unitPrice * item.qty}
                        {item.qty > 1 && (
                          <span className="text-[10px] font-normal text-slate-500 ml-1">
                            (₹{item.unitPrice} each)
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="inline-flex items-center bg-white border border-slate-200 rounded-xl shrink-0 shadow-2xs">
                      <button
                        onClick={() => updateQty(idx, -1)}
                        className="px-2.5 py-1 font-black text-xs text-slate-700 hover:bg-slate-100 rounded-l-xl transition-colors"
                      >
                        −
                      </button>
                      <span className="px-2 font-mono font-extrabold text-xs">{item.qty}</span>
                      <button
                        onClick={() => updateQty(idx, 1)}
                        className="px-2.5 py-1 font-black text-xs text-slate-700 hover:bg-slate-100 rounded-r-xl transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* 3. Coupon Box */}
              <div className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-2">
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700">
                  Apply Promo / Coupon Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="e.g. FLAT50, WELCOME20"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 font-mono text-xs font-extrabold uppercase focus:outline-none focus:border-[#E5203A]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-[#E5203A] text-white font-extrabold text-xs transition-colors"
                  >
                    Apply
                  </button>
                </div>

                {appliedCoupon && (
                  <p className="text-[11px] font-bold text-emerald-600 flex items-center justify-between">
                    <span>
                      ✓ &quot;{appliedCoupon.code}&quot; applied (-₹{totals.discountAmount})
                    </span>
                    <button onClick={removeCoupon} className="text-rose-600 underline">
                      Remove
                    </button>
                  </p>
                )}
                {couponError && <p className="text-[11px] font-bold text-rose-600">{couponError}</p>}
              </div>

              {/* 4. Customer Contact Details */}
              <div className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-3">
                <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-xl text-xs font-extrabold">
                  <button
                    type="button"
                    onClick={() => setCheckoutMode('GUEST')}
                    className={`py-1.5 rounded-lg transition-all ${
                      checkoutMode === 'GUEST'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-500'
                    }`}
                  >
                    Guest Checkout
                  </button>
                  <button
                    type="button"
                    onClick={() => setCheckoutMode('MEMBER')}
                    className={`py-1.5 rounded-lg transition-all ${
                      checkoutMode === 'MEMBER'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-500'
                    }`}
                  >
                    Member Login
                  </button>
                </div>

                {checkoutMode === 'GUEST' ? (
                  <div className="space-y-2 text-xs">
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Your Full Name *"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:border-[#E5203A]"
                    />
                    <input
                      type="tel"
                      maxLength={10}
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="10-Digit Mobile Number *"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-semibold focus:outline-none focus:border-[#E5203A]"
                    />
                  </div>
                ) : loggedInMember ? (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-extrabold text-emerald-950">{loggedInMember.name}</p>
                      <p className="font-mono text-emerald-700">+91 {loggedInMember.phone}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLoggedInMember(null)}
                      className="text-rose-600 font-bold underline"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2 text-xs">
                    <input
                      type="tel"
                      maxLength={10}
                      value={memberPhoneInput}
                      onChange={(e) => setMemberPhoneInput(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold"
                    />
                    <button
                      type="button"
                      onClick={handleMemberQuickLogin}
                      className="px-3.5 py-2 rounded-xl bg-[#0F766E] text-white font-extrabold"
                    >
                      Verify OTP
                    </button>
                  </div>
                )}
              </div>

              {/* 5. Payment Options: "Cash in Counter" vs "Cash on Delivery" */}
              <div className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-2 text-xs">
                <p className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px]">
                  Select Payment Method <span className="text-[#E5203A]">*</span>
                </p>

                {/* Option 1: Cash in Counter */}
                <label
                  className={`flex items-start justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'CASH_IN_COUNTER'
                      ? 'border-[#E5203A] bg-rose-50/50 ring-1 ring-[#E5203A]'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <input
                      type="radio"
                      name="drawer-payment-mode"
                      value="CASH_IN_COUNTER"
                      checked={paymentMethod === 'CASH_IN_COUNTER'}
                      onChange={() => setPaymentMethod('CASH_IN_COUNTER')}
                      className="accent-[#E5203A] mt-0.5"
                    />
                    <div>
                      <p className="font-bold text-slate-900">Cash in Counter / Pay at Counter</p>
                      <p className="text-[10px] text-slate-500">Pay cash or UPI directly at the billing desk</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                    Popular
                  </span>
                </label>

                {/* Option 2: Cash on Delivery */}
                <label
                  className={`flex items-start justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'CASH_ON_DELIVERY'
                      ? 'border-[#E5203A] bg-rose-50/50 ring-1 ring-[#E5203A]'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <input
                      type="radio"
                      name="drawer-payment-mode"
                      value="CASH_ON_DELIVERY"
                      checked={paymentMethod === 'CASH_ON_DELIVERY'}
                      onChange={() => setPaymentMethod('CASH_ON_DELIVERY')}
                      className="accent-[#E5203A] mt-0.5"
                    />
                    <div>
                      <p className="font-bold text-slate-900">Cash on Delivery (COD)</p>
                      <p className="text-[10px] text-slate-500">Pay cash when order is delivered to your address</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    Doorstep
                  </span>
                </label>

                {/* Option 3: Online Pay / UPI */}
                <label
                  className={`flex items-start justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'ONLINE'
                      ? 'border-[#E5203A] bg-rose-50/50 ring-1 ring-[#E5203A]'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <input
                      type="radio"
                      name="drawer-payment-mode"
                      value="ONLINE"
                      checked={paymentMethod === 'ONLINE'}
                      onChange={() => setPaymentMethod('ONLINE')}
                      className="accent-[#E5203A] mt-0.5"
                    />
                    <div>
                      <p className="font-bold text-slate-900">Online Payment / UPI QR</p>
                      <p className="text-[10px] text-slate-500">GPay, PhonePe, Paytm or Debit/Credit Card</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Instant
                  </span>
                </label>
              </div>

              {/* 6. Complete Bill Breakdown */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Item Total</span>
                  <span className="font-mono font-bold">₹{totals.itemTotal}</span>
                </div>
                {totals.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Coupon Discount ({appliedCoupon?.code})</span>
                    <span className="font-mono">-₹{totals.discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>GST ({settings.gstPercent}%)</span>
                  <span className="font-mono font-bold">₹{totals.gstAmount}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Packaging Charge</span>
                  <span className="font-mono font-bold">
                    {orderType === 'IN_TABLE' ? (
                      <span className="text-emerald-700">₹0 (Waived for Dine-In)</span>
                    ) : (
                      `₹${finalPackaging}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>Grand Total</span>
                  <span className="font-mono text-[#E5203A]">₹{currentGrandTotal}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Drawer Sticky Footer CTA */}
        {cart.length > 0 && (
          <div className="p-4 bg-white border-t border-slate-200 shrink-0">
            <button
              onClick={handleSubmitOrder}
              disabled={submitting}
              className="w-full py-3.5 px-5 rounded-2xl bg-[#E5203A] hover:bg-[#C8172E] text-white font-extrabold text-sm shadow-lg flex items-center justify-between transition-all active:scale-98 disabled:opacity-50"
            >
              <span>
                {submitting
                  ? 'Placing Order...'
                  : orderType === 'IN_TABLE'
                  ? `Order for ${tableNo || 'Table'}`
                  : 'Place Delivery Order'}
              </span>
              <span className="font-mono">₹{currentGrandTotal}</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
