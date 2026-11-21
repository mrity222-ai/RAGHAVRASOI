'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  X,
  UtensilsCrossed,
  Package,
  Check,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Trash2,
  Phone,
  User,
  Mail,
  QrCode,
  Banknote,
  Receipt,
  Tag,
} from 'lucide-react';
import { useStorefrontCart } from '@/context/StorefrontCartContext';
import { useCustomerAuth } from '@/context/CustomerAuthContext';

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
    setIsInvoiceOpen,
    setCompletedOrder,
    setActiveTrackingToken,
    orderType,
    setOrderType,
    tableNo,
    setTableNo,
    paymentMethod,
    setPaymentMethod,
  } = useStorefrontCart();

  const customerAuth = useCustomerAuth();

  // Multi-step checkout state: 1 = Cart Items & Promo, 2 = Dining & Details, 3 = Payment
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3>(1);
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (customerAuth.user) {
      setGuestName(customerAuth.user.name || '');
      setGuestPhone(customerAuth.user.phone || '');
      setGuestEmail(customerAuth.user.email || '');
    }
  }, [customerAuth.user]);

  // Reset to Step 1 whenever drawer opens
  useEffect(() => {
    if (isCartOpen) {
      setCheckoutStep(1);
    }
  }, [isCartOpen]);

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

  const validateStep2 = () => {
    const name = customerAuth.user?.name || guestName.trim();
    const phone = customerAuth.user?.phone || guestPhone.trim();

    if (!name) {
      alert('कृपया अपना पूरा नाम दर्ज करें (Please enter your full Name)');
      return false;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      alert('कृपया 10-अंकों का वैध मोबाइल नंबर दर्ज करें (Please enter a valid 10-digit Mobile Number)');
      return false;
    }

    if (orderType === 'IN_TABLE' && !tableNo.trim()) {
      alert('कृपया टेबल नंबर दर्ज करें या चुनें (Please enter your Table Number)');
      return false;
    }

    return true;
  };

  const handleProceedToStep2 = () => {
    if (!cart.length) return;
    setCheckoutStep(2);
  };

  const handleProceedToStep3 = () => {
    if (validateStep2()) {
      setCheckoutStep(3);
    }
  };

  const handleSubmitOrder = async () => {
    if (!settings.isOpen) {
      alert('Restaurant is currently closed for incoming orders.');
      return;
    }
    if (!cart.length) return;
    if (!validateStep2()) return;

    let customerName = customerAuth.user?.name || guestName.trim();
    let customerPhone = customerAuth.user?.phone || guestPhone.trim();
    let customerEmail = customerAuth.user?.email || (guestEmail.trim() ? guestEmail.trim() : null);
    let customerId = customerAuth.user?.id || null;
    let isGuest = !customerAuth.user;

    setSubmitting(true);
    try {
      const pickupTimeText =
        orderType === 'IN_TABLE'
          ? `Serve at ${tableNo}`
          : `Parcel ready in ${settings.prepTimeMins || 15} mins`;

      // Packaging charge: ₹0 for Dine-In Table, ₹10 for Parcel Takeaway
      const finalPackaging = orderType === 'IN_TABLE' ? 0 : 10;
      const finalGrandTotal = totals.itemTotal - totals.discountAmount + totals.gstAmount + finalPackaging;

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          customerEmail,
          customerName,
          customerPhone,
          isGuest,
          orderType,
          tableNo: orderType === 'IN_TABLE' ? tableNo : null,
          deliveryAddress: orderType === 'TAKEAWAY' ? 'Parcel / Counter Pickup' : null,
          paymentMethod,
          paymentStatus: paymentMethod === 'ONLINE' ? 'PAID' : 'PENDING',
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
        setCompletedOrder(data.data);
        setIsCartOpen(false);
        setIsInvoiceOpen(true);
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

  const finalPackaging = orderType === 'IN_TABLE' ? 0 : 10;
  const currentGrandTotal = totals.itemTotal - totals.discountAmount + totals.gstAmount + finalPackaging;

  const quickTables = ['Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5', 'Table 6', 'Table 7', 'Table 8'];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header with Step Indicator */}
        <div className="px-5 py-3.5 border-b border-slate-200 bg-white shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#B45309] flex items-center justify-center font-bold">
                <ShoppingBag size={17} />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-sm sm:text-base leading-tight">
                  {checkoutStep === 1
                    ? 'Your Food Cart'
                    : checkoutStep === 2
                    ? 'Dining & Contact Info'
                    : 'Payment & Confirm'}
                </h3>
                <p className="text-[11px] text-slate-500 font-semibold">
                  Step {checkoutStep} of 3 • {totalQty} {totalQty === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* 3-Step Pill Progress Bar */}
          <div className="grid grid-cols-3 gap-1.5 mt-3 pt-2 border-t border-slate-100 text-[10px] font-black uppercase tracking-wider text-center">
            <div
              className={`py-1 rounded-lg transition-all ${
                checkoutStep >= 1
                  ? 'bg-amber-100 text-[#B45309] font-extrabold'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              1. Cart &amp; Promo
            </div>
            <div
              className={`py-1 rounded-lg transition-all ${
                checkoutStep >= 2
                  ? 'bg-amber-100 text-[#B45309] font-extrabold'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              2. Dining Details
            </div>
            <div
              className={`py-1 rounded-lg transition-all ${
                checkoutStep === 3
                  ? 'bg-emerald-100 text-emerald-800 font-extrabold'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              3. Pay &amp; Confirm
            </div>
          </div>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* Empty Cart View */}
          {!cart.length ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center text-2xl">
                <ShoppingBag size={32} />
              </div>
              <h4 className="font-black text-base text-slate-900">Your cart is empty</h4>
              <p className="text-xs text-slate-500">
                Explore authentic Raghav Rasoi thalis, dosas, snacks and cold drinks to order now!
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-[#B45309] text-white font-extrabold text-xs shadow-xs"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <>
              {/* ================= STEP 1: CART ITEMS & PROMO ================= */}
              {checkoutStep === 1 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  {/* Cart Items List */}
                  <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 divide-y divide-slate-200/70">
                    <p className="text-[11px] font-black uppercase tracking-wider text-slate-700 pb-2">
                      Selected Dishes ({totalQty})
                    </p>
                    {cart.map((item, idx) => (
                      <div key={idx} className="py-2.5 first:pt-2 last:pb-0 flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="font-black text-xs text-slate-900 leading-snug">{item.name}</p>
                          <p className="text-[11px] text-slate-500">
                            <span className="font-bold text-slate-700">{item.size || 'Regular'}</span>
                            {Array.isArray(item.addons) && item.addons.length > 0 ? ' • ' + item.addons.join(', ') : ''}
                          </p>
                          <p className="font-mono font-extrabold text-xs text-slate-900 mt-1">
                            Rs. {item.unitPrice * item.qty}
                            {item.qty > 1 && (
                              <span className="text-[10px] font-normal text-slate-500 ml-1">
                                (Rs. {item.unitPrice} each)
                              </span>
                            )}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
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

                          <button
                            onClick={() => removeFromCart(idx)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Coupon Code Section */}
                  <div className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-700">
                      <Tag size={13} className="text-[#B45309]" />
                      <span>Apply Promo / Coupon Code</span>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="e.g. WELCOME50, RAGHAV10"
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-200 font-mono text-xs font-black uppercase focus:outline-none focus:border-[#B45309]"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-[#B45309] text-white font-extrabold text-xs transition-colors"
                      >
                        Apply
                      </button>
                    </div>

                    {appliedCoupon && (
                      <p className="text-[11px] font-bold text-emerald-600 flex items-center justify-between pt-1">
                        <span>✓ &quot;{appliedCoupon.code}&quot; applied (-₹{totals.discountAmount})</span>
                        <button onClick={removeCoupon} className="text-rose-600 underline font-bold">
                          Remove
                        </button>
                      </p>
                    )}
                    {couponError && <p className="text-[11px] font-bold text-rose-600">{couponError}</p>}
                  </div>

                  {/* Quick Subtotal Breakdown */}
                  <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-1.5 text-xs font-medium">
                    <div className="flex justify-between text-slate-600">
                      <span>Item Total ({totalQty} dishes)</span>
                      <span className="font-mono font-bold">₹{totals.itemTotal}</span>
                    </div>
                    {totals.discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-bold">
                        <span>Coupon Discount ({appliedCoupon?.code})</span>
                        <span className="font-mono">-₹{totals.discountAmount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-600">
                      <span>GST (5%)</span>
                      <span className="font-mono">₹{totals.gstAmount}</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-slate-900 pt-1.5 border-t border-amber-200/60">
                      <span>Subtotal</span>
                      <span className="font-mono text-[#B45309]">
                        ₹{totals.itemTotal - totals.discountAmount + totals.gstAmount}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= STEP 2: DINING OPTION & CONTACT INFO ================= */}
              {checkoutStep === 2 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  {/* 1. Dining Type Selection (Table vs Parcel) */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black uppercase tracking-wider text-slate-800">
                        Choose Dining Option <span className="text-rose-600">*</span>
                      </p>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                        {orderType === 'IN_TABLE' ? '🍽️ Dine-In Service' : '🥡 Takeaway Parcel'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                      {/* Option A: In Table (Dine-In) */}
                      <button
                        type="button"
                        onClick={() => {
                          setOrderType('IN_TABLE');
                          setPaymentMethod('CASH_IN_COUNTER');
                        }}
                        className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
                          orderType === 'IN_TABLE'
                            ? 'bg-white border-[#B45309] shadow-sm text-slate-900 ring-2 ring-[#B45309]/20'
                            : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
                        }`}
                      >
                        <UtensilsCrossed size={20} className={orderType === 'IN_TABLE' ? 'text-[#B45309]' : 'text-slate-400'} />
                        <span className="font-black">In Table (Dine-In)</span>
                        <span className="text-[10px] font-semibold text-emerald-700">₹0 Packing Charge</span>
                      </button>

                      {/* Option B: Takeaway Parcel */}
                      <button
                        type="button"
                        onClick={() => {
                          setOrderType('TAKEAWAY');
                          setPaymentMethod('ONLINE');
                        }}
                        className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
                          orderType === 'TAKEAWAY'
                            ? 'bg-white border-[#B45309] shadow-sm text-slate-900 ring-2 ring-[#B45309]/20'
                            : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
                        }`}
                      >
                        <Package size={20} className={orderType === 'TAKEAWAY' ? 'text-[#B45309]' : 'text-slate-400'} />
                        <span className="font-black">Takeaway / Packing</span>
                        <span className="text-[10px] font-semibold text-amber-800">₹10 Parcel Box</span>
                      </button>
                    </div>

                    {/* In Table: Table Number Input & Quick Buttons */}
                    {orderType === 'IN_TABLE' && (
                      <div className="space-y-2 pt-1 bg-white p-3.5 rounded-xl border-2 border-amber-300/60 animate-in fade-in">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-black text-slate-900">
                            Enter Your Table Number <span className="text-rose-600">*</span>
                          </label>
                          <span className="text-[10px] font-extrabold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                            Required
                          </span>
                        </div>

                        <input
                          type="text"
                          required
                          value={tableNo}
                          onChange={(e) => setTableNo(e.target.value)}
                          placeholder="e.g. Table 4, T-12, Table 3"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-300 text-xs font-black text-slate-900 focus:outline-none focus:border-[#B45309] focus:bg-white"
                        />

                        {/* Quick Selection Buttons */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {quickTables.map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setTableNo(t)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                                tableNo === t
                                  ? 'bg-[#B45309] text-white border-[#B45309]'
                                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Takeaway: Packing Notice */}
                    {orderType === 'TAKEAWAY' && (
                      <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900 animate-in fade-in space-y-1">
                        <p className="font-bold">🥡 Hygienic Eco-Friendly Packaging</p>
                        <p className="text-[11px] text-amber-800">
                          Your order will be securely packed in leak-proof containers and ready for pickup at the counter. (₹10 packing charge applied).
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 2. Customer Contact Info (Name & Phone Mandatory, Email Optional) */}
                  <div className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <p className="font-black text-slate-900 uppercase tracking-wider text-[11px]">
                        Customer Details
                      </p>
                      <span className="text-[10px] text-slate-500 font-semibold">
                        For WhatsApp Order ID &amp; Updates
                      </span>
                    </div>

                    {customerAuth.isLoggedIn && customerAuth.user ? (
                      <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
                        <div>
                          <p className="font-black text-slate-900">{customerAuth.user.name}</p>
                          <p className="font-mono text-[11px] text-slate-600">
                            +91 {customerAuth.user.phone} {customerAuth.user.email ? `• ${customerAuth.user.email}` : ''}
                          </p>
                        </div>
                        <span className="text-[10px] bg-[#FBBF24] text-slate-950 font-black px-2 py-0.5 rounded-full">
                          Logged In
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {/* Name (Mandatory) */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Your Full Name <span className="text-rose-600">*</span>
                          </label>
                          <div className="relative">
                            <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="text"
                              required
                              value={guestName}
                              onChange={(e) => setGuestName(e.target.value)}
                              placeholder="e.g. Ramesh Kumar"
                              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 font-semibold text-xs focus:outline-none focus:border-[#B45309]"
                            />
                          </div>
                        </div>

                        {/* Mobile Number (Mandatory) */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            10-Digit Mobile Number <span className="text-rose-600">*</span>{' '}
                            <span className="text-[10px] font-normal text-emerald-700">(WhatsApp updates sent here)</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                              +91
                            </span>
                            <input
                              type="tel"
                              required
                              maxLength={10}
                              value={guestPhone}
                              onChange={(e) => setGuestPhone(e.target.value.replace(/\D/g, ''))}
                              placeholder="9876543210"
                              className="w-full pl-11 pr-3 py-2 rounded-xl border border-slate-200 font-mono font-bold text-xs focus:outline-none focus:border-[#B45309]"
                            />
                          </div>
                        </div>

                        {/* Email Address (Optional) */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-[11px] font-bold text-slate-700">
                              Email Address
                            </label>
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase bg-slate-100 px-1.5 py-0.5 rounded">
                              Optional
                            </span>
                          </div>
                          <div className="relative">
                            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="email"
                              value={guestEmail}
                              onChange={(e) => setGuestEmail(e.target.value)}
                              placeholder="Optional (for digital email invoice)"
                              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 font-medium text-xs focus:outline-none focus:border-[#B45309]"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ================= STEP 3: PAYMENT METHOD & CONFIRM ================= */}
              {checkoutStep === 3 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  {/* Payment Mode Selection */}
                  <div className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-2 text-xs">
                    <p className="font-black text-slate-800 uppercase tracking-wider text-[11px]">
                      Select Payment Mode <span className="text-rose-600">*</span>
                    </p>

                    {/* Option 1: Online Payment / UPI QR */}
                    <label
                      className={`flex items-start justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                        paymentMethod === 'ONLINE'
                          ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/20'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <input
                          type="radio"
                          name="checkout-payment-mode"
                          value="ONLINE"
                          checked={paymentMethod === 'ONLINE'}
                          onChange={() => setPaymentMethod('ONLINE')}
                          className="accent-emerald-600 mt-1"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <QrCode size={15} className="text-emerald-700" />
                            <p className="font-black text-slate-900">Online Payment / UPI QR</p>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Google Pay, PhonePe, Paytm, QR scan or Cards
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                        Fastest
                      </span>
                    </label>

                    {/* Option 2: Cash in Counter / Pay at Table */}
                    <label
                      className={`flex items-start justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                        paymentMethod === 'CASH_IN_COUNTER'
                          ? 'border-[#B45309] bg-amber-50/50 ring-2 ring-[#B45309]/20'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <input
                          type="radio"
                          name="checkout-payment-mode"
                          value="CASH_IN_COUNTER"
                          checked={paymentMethod === 'CASH_IN_COUNTER'}
                          onChange={() => setPaymentMethod('CASH_IN_COUNTER')}
                          className="accent-[#B45309] mt-1"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <Banknote size={15} className="text-[#B45309]" />
                            <p className="font-black text-slate-900">Cash in Counter / Pay at Table</p>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Pay cash or UPI directly to the waiter or cashier desk
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                        Counter
                      </span>
                    </label>
                  </div>

                  {/* Complete Bill Summary */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <p className="font-black uppercase tracking-wider text-slate-700 text-[11px] pb-1 border-b border-slate-200">
                      Final Bill Summary
                    </p>

                    <div className="flex justify-between text-slate-600">
                      <span>Item Total ({totalQty} dishes)</span>
                      <span className="font-mono font-bold">₹{totals.itemTotal}</span>
                    </div>

                    {totals.discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-bold">
                        <span>Coupon Discount ({appliedCoupon?.code})</span>
                        <span className="font-mono">-₹{totals.discountAmount}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-slate-600">
                      <span>GST (5%)</span>
                      <span className="font-mono font-bold">₹{totals.gstAmount}</span>
                    </div>

                    <div className="flex justify-between text-slate-600">
                      <span>Packaging / Parcel Charge</span>
                      <span className="font-mono font-bold">
                        {orderType === 'IN_TABLE' ? (
                          <span className="text-emerald-700">₹0 (Waived for Table)</span>
                        ) : (
                          '₹10'
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                      <span>Grand Total</span>
                      <span className="font-mono text-[#B45309] text-lg">₹{currentGrandTotal}</span>
                    </div>

                    {/* Summary Badges */}
                    <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Order Destination:</span>
                      <span className="font-bold text-slate-800">
                        {orderType === 'IN_TABLE' ? `🍽️ ${tableNo || 'Table'}` : '🥡 Takeaway Parcel'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

        </div>

        {/* Drawer Sticky Bottom Action Buttons */}
        {cart.length > 0 && (
          <div className="p-4 bg-white border-t border-slate-200 shrink-0">
            {checkoutStep === 1 && (
              <button
                type="button"
                onClick={handleProceedToStep2}
                className="w-full py-3.5 px-5 rounded-2xl bg-[#B45309] hover:bg-[#92400E] text-white font-extrabold text-sm shadow-md flex items-center justify-between transition-all active:scale-98"
              >
                <span>Next: Dining &amp; Details</span>
                <span className="flex items-center gap-1 font-mono">
                  ₹{totals.itemTotal - totals.discountAmount + totals.gstAmount} <ChevronRight size={16} />
                </span>
              </button>
            )}

            {checkoutStep === 2 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCheckoutStep(1)}
                  className="px-4 py-3.5 rounded-2xl border border-slate-300 font-extrabold text-xs text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1"
                >
                  <ChevronLeft size={16} /> Back
                </button>

                <button
                  type="button"
                  onClick={handleProceedToStep3}
                  className="flex-1 py-3.5 px-4 rounded-2xl bg-[#B45309] hover:bg-[#92400E] text-white font-extrabold text-sm shadow-md flex items-center justify-between transition-all active:scale-98"
                >
                  <span>Next: Payment</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}

            {checkoutStep === 3 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCheckoutStep(2)}
                  className="px-4 py-3.5 rounded-2xl border border-slate-300 font-extrabold text-xs text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1"
                >
                  <ChevronLeft size={16} /> Back
                </button>

                <button
                  type="button"
                  onClick={handleSubmitOrder}
                  disabled={submitting}
                  className="flex-1 py-3.5 px-5 rounded-2xl bg-[#15803d] hover:bg-[#166534] text-white font-black text-sm shadow-lg flex items-center justify-between transition-all active:scale-98 disabled:opacity-50"
                >
                  <span>{submitting ? 'Placing Order...' : 'Pay Now / Confirm'}</span>
                  <span className="font-mono text-amber-200">₹{currentGrandTotal}</span>
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
