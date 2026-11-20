'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface StoreCartItem {
  productId: string;
  name: string;
  qty: number;
  size: string;
  addons: string[];
  note?: string;
  unitPrice: number;
  image?: string;
}

export interface StoreSettingsType {
  name: string;
  address: string;
  isOpen: boolean;
  prepTimeMins: number;
  gstPercent: number;
  packagingCharge: number;
  allowPayAtShop: boolean;
}

interface StorefrontCartContextType {
  cart: StoreCartItem[];
  addToCart: (item: StoreCartItem) => void;
  updateQty: (index: number, delta: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  appliedCoupon: any;
  setAppliedCoupon: (coupon: any) => void;
  applyCouponCode: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  totals: {
    itemTotal: number;
    discountAmount: number;
    gstAmount: number;
    packagingCharge: number;
    grandTotal: number;
  };
  settings: StoreSettingsType;
  refreshSettings: () => Promise<void>;
  // Modals
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isTrackingOpen: boolean;
  setIsTrackingOpen: (open: boolean) => void;
  isInvoiceOpen: boolean;
  setIsInvoiceOpen: (open: boolean) => void;
  completedOrder: any | null;
  setCompletedOrder: (order: any | null) => void;
  isAccountOpen: boolean;
  setIsAccountOpen: (open: boolean) => void;
  customizeDish: any;
  setCustomizeDish: (dish: any) => void;
  activeTrackingToken: string;
  setActiveTrackingToken: (token: string) => void;
  loggedInMember: { name: string; phone: string } | null;
  setLoggedInMember: (member: { name: string; phone: string } | null) => void;
  // Fulfillment & Payment
  orderType: 'IN_TABLE' | 'DELIVER';
  setOrderType: (t: 'IN_TABLE' | 'DELIVER') => void;
  tableNo: string;
  setTableNo: (n: string) => void;
  deliveryAddress: string;
  setDeliveryAddress: (a: string) => void;
  paymentMethod: 'CASH_IN_COUNTER' | 'CASH_ON_DELIVERY' | 'ONLINE';
  setPaymentMethod: (p: 'CASH_IN_COUNTER' | 'CASH_ON_DELIVERY' | 'ONLINE') => void;
}

const StorefrontCartContext = createContext<StorefrontCartContextType | undefined>(undefined);

export const StorefrontCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<StoreCartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [customizeDish, setCustomizeDish] = useState<any>(null);
  const [activeTrackingToken, setActiveTrackingToken] = useState('ORD-105');
  const [loggedInMember, setLoggedInMember] = useState<{ name: string; phone: string } | null>(null);
  const [orderType, setOrderType] = useState<'IN_TABLE' | 'DELIVER'>('IN_TABLE');
  const [tableNo, setTableNo] = useState<string>('Table 4');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'CASH_IN_COUNTER' | 'CASH_ON_DELIVERY' | 'ONLINE'>('CASH_IN_COUNTER');

  const [settings, setSettings] = useState<StoreSettingsType>({
    name: 'Raghav Rasoi',
    address: '7th Avenue, Near Aarza Square - 2, Gaur City 1, Greater Noida West, UP 201009',
    isOpen: true,
    prepTimeMins: 15,
    gstPercent: 5.0,
    packagingCharge: 10.0,
    allowPayAtShop: true,
  });

  const refreshSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.success && data.data) {
        setSettings(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    refreshSettings();
    try {
      const saved = localStorage.getItem('spice_grill_cart');
      if (saved) setCart(JSON.parse(saved));
      const savedToken = localStorage.getItem('spice_grill_token');
      if (savedToken) setActiveTrackingToken(savedToken);
      const savedMember = localStorage.getItem('spice_grill_member');
      if (savedMember) setLoggedInMember(JSON.parse(savedMember));
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('spice_grill_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('spice_grill_token', activeTrackingToken);
    } catch (e) {}
  }, [activeTrackingToken]);

  useEffect(() => {
    try {
      if (loggedInMember) localStorage.setItem('spice_grill_member', JSON.stringify(loggedInMember));
      else localStorage.removeItem('spice_grill_member');
    } catch (e) {}
  }, [loggedInMember]);

  const addToCart = (item: StoreCartItem) => {
    setCart((prev) => {
      const matchIndex = prev.findIndex(
        (c) =>
          c.productId === item.productId &&
          c.size === item.size &&
          c.note === item.note &&
          JSON.stringify(c.addons.sort()) === JSON.stringify(item.addons.sort())
      );
      if (matchIndex > -1) {
        const copy = [...prev];
        copy[matchIndex].qty += item.qty;
        return copy;
      }
      return [...prev, item];
    });
  };

  const updateQty = (index: number, delta: number) => {
    setCart((prev) => {
      const copy = [...prev];
      if (!copy[index]) return prev;
      copy[index].qty += delta;
      if (copy[index].qty <= 0) {
        copy.splice(index, 1);
      }
      return copy;
    });
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, idx) => idx !== index));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCouponCode = async (code: string) => {
    try {
      const res = await fetch('/api/coupons?active=true');
      const data = await res.json();
      if (data.success && data.data) {
        const found = data.data.find(
          (c: any) => c.code.toUpperCase() === code.trim().toUpperCase() && c.active
        );
        if (!found) {
          return { success: false, message: 'Invalid or expired coupon code' };
        }
        const itemTotal = cart.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);
        if (itemTotal < found.minOrder) {
          return {
            success: false,
            message: `Minimum order of ₹${found.minOrder} required for this coupon`,
          };
        }
        setAppliedCoupon(found);
        return { success: true, message: `Coupon "${found.code}" applied!` };
      }
      return { success: false, message: 'Failed to validate coupon' };
    } catch (e) {
      return { success: false, message: 'Error checking coupon' };
    }
  };

  const removeCoupon = () => setAppliedCoupon(null);

  // Compute Bill totals
  const itemTotal = cart.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);
  let discountAmount = 0;
  if (appliedCoupon && itemTotal >= appliedCoupon.minOrder) {
    if (appliedCoupon.type === 'PERCENT') {
      discountAmount = Math.round((itemTotal * appliedCoupon.value) / 100);
      if (appliedCoupon.maxDiscount && discountAmount > appliedCoupon.maxDiscount) {
        discountAmount = appliedCoupon.maxDiscount;
      }
    } else {
      discountAmount = appliedCoupon.value;
    }
    if (discountAmount > itemTotal) discountAmount = itemTotal;
  }

  const discountedSubtotal = Math.max(0, itemTotal - discountAmount);
  const gstAmount = Math.round((discountedSubtotal * settings.gstPercent) / 100);
  const packagingCharge = itemTotal > 0 ? settings.packagingCharge : 0;
  const grandTotal = discountedSubtotal + gstAmount + packagingCharge;

  return (
    <StorefrontCartContext.Provider
      value={{
        cart,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        appliedCoupon,
        setAppliedCoupon,
        applyCouponCode,
        removeCoupon,
        totals: {
          itemTotal,
          discountAmount,
          gstAmount,
          packagingCharge,
          grandTotal,
        },
        settings,
        refreshSettings,
        isCartOpen,
        setIsCartOpen,
        isTrackingOpen,
        setIsTrackingOpen,
        isInvoiceOpen,
        setIsInvoiceOpen,
        completedOrder,
        setCompletedOrder,
        isAccountOpen,
        setIsAccountOpen,
        customizeDish,
        setCustomizeDish,
        activeTrackingToken,
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
      }}
    >
      {children}
    </StorefrontCartContext.Provider>
  );
};

export const useOptionalStorefrontCart = () => {
  return useContext(StorefrontCartContext);
};

export const useStorefrontCart = () => {
  const context = useContext(StorefrontCartContext);
  if (!context) {
    throw new Error('useStorefrontCart must be used within a StorefrontCartProvider');
  }
  return context;
};
