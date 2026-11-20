'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminAuthProvider, useAdminAuth } from '@/context/AdminAuthContext';
import AdminTopBar from '@/components/admin/AdminTopBar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import KanbanBoard from '@/components/admin/KanbanBoard';
import SalesDashboard from '@/components/admin/SalesDashboard';
import MenuPricingManager from '@/components/admin/MenuPricingManager';
import CategoryManager from '@/components/admin/CategoryManager';
import CouponGenerator from '@/components/admin/CouponGenerator';
import StaffRbacManager from '@/components/admin/StaffRbacManager';
import StoreSettingsPanel from '@/components/admin/StoreSettingsPanel';
import ThermalReceiptModal from '@/components/admin/ThermalReceiptModal';
import CustomerDirectory from '@/components/admin/CustomerDirectory';

function AdminConsoleContent() {
  const router = useRouter();
  const { currentStaff, hasPerm, playAlertChime, refreshStaff, authLoading } = useAdminAuth();

  const [activeTab, setActiveTab] = useState('kanban');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !currentStaff) {
      router.replace('/admin/login');
    }
  }, [authLoading, currentStaff, router]);

  // Data states
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [storeSettings, setStoreSettings] = useState<any>(null);

  // Receipt Modal state
  const [receiptModal, setReceiptModal] = useState<{
    open: boolean;
    order: any | null;
    type: 'KOT' | 'BILL';
  }>({
    open: false,
    order: null,
    type: 'KOT',
  });

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (data.success && data.data) {
        setOrders(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/menu/products');
      const data = await res.json();
      if (data.success && data.data) {
        setProducts(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/menu/categories');
      const data = await res.json();
      if (data.success && data.data) {
        setCategories(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCoupons = async () => {
    try {
      const res = await fetch('/api/coupons');
      const data = await res.json();
      if (data.success && data.data) {
        setCoupons(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.success && data.data) {
        setStoreSettings(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const refreshAll = async () => {
    await Promise.all([
      fetchOrders(),
      fetchProducts(),
      fetchCategories(),
      fetchCoupons(),
      fetchSettings(),
      refreshStaff(),
    ]);
  };

  useEffect(() => {
    refreshAll();
    const interval = setInterval(fetchOrders, 4000); // Live poll Kanban
    return () => clearInterval(interval);
  }, []);

  // Update order status on Kanban
  const handleUpdateOrderStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.success) {
        fetchOrders();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Simulate test customer order
  const handleSimulateOrder = async () => {
    const names = ['Kabir Malhotra', 'Divya Nair', 'Rohan Kapoor', 'Neha Joshi', 'Ankit Gupta'];
    const name = names[Math.floor(Math.random() * names.length)];

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          customerPhone: '9811223344',
          isGuest: true,
          pickupTime: `Pick Up Now (${storeSettings?.prepTimeMins || 15}m)`,
          paymentStatus: Math.random() > 0.4 ? 'PAID' : 'PAY_AT_SHOP',
          couponCode: null,
          discountAmount: 0,
          itemTotal: 298,
          gstAmount: 15,
          packagingCharge: 10,
          grandTotal: 323,
          items: [
            {
              id: 'dish-1',
              title: 'Maharaja Paneer Tikka Burger',
              quantity: 2,
              price: 149,
              size: 'Regular',
              addons: [],
              note: 'Extra tissues',
            },
          ],
        }),
      });

      const data = await res.json();
      if (data.success) {
        playAlertChime();
        await fetchOrders();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Toggle master store open/closed
  const handleToggleStoreOpen = async () => {
    if (!hasPerm('store_settings')) return;
    try {
      const nextOpen = !storeSettings?.isOpen;
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isOpen: nextOpen }),
      });
      fetchSettings();
    } catch (e) {
      console.error(e);
    }
  };

  const pendingCount = orders.filter((o) => o.status === 'PENDING').length;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white text-xs gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E5203A]"></div>
        <span className="font-semibold text-slate-400">Verifying Admin Access...</span>
      </div>
    );
  }

  if (!currentStaff) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800">
      
      {/* 1. Left Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingCount={pendingCount}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* 2. Main Right Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <AdminTopBar
          onSimulateOrder={handleSimulateOrder}
          isOpen={storeSettings?.isOpen ?? true}
          onToggleStoreOpen={handleToggleStoreOpen}
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        {/* Tab Panels */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {activeTab === 'kanban' && hasPerm('kanban') && (
            <KanbanBoard
              orders={orders}
              onUpdateStatus={handleUpdateOrderStatus}
              onOpenReceipt={(o, type) => setReceiptModal({ open: true, order: o, type })}
            />
          )}

          {activeTab === 'dashboard' && hasPerm('view_dashboard') && (
            <SalesDashboard
              orders={orders}
              activeCouponsCount={coupons.filter((c) => c.active).length}
            />
          )}

          {activeTab === 'customers' && (hasPerm('store_settings') || hasPerm('view_dashboard')) && (
            <CustomerDirectory />
          )}

          {activeTab === 'menu' && (hasPerm('manage_menu') || hasPerm('toggle_stock')) && (
            <MenuPricingManager
              products={products}
              categories={categories}
              onRefresh={fetchProducts}
            />
          )}

          {activeTab === 'categories' && hasPerm('manage_categories') && (
            <CategoryManager
              categories={categories}
              products={products}
              onRefresh={fetchCategories}
            />
          )}

          {activeTab === 'coupons' && hasPerm('manage_coupons') && (
            <CouponGenerator coupons={coupons} onRefresh={fetchCoupons} />
          )}

          {activeTab === 'staff' && hasPerm('store_settings') && (
            <StaffRbacManager onRefresh={refreshStaff} />
          )}

          {activeTab === 'settings' && hasPerm('store_settings') && (
            <StoreSettingsPanel settings={storeSettings} onRefresh={fetchSettings} />
          )}
        </main>

      </div>

      {/* Thermal Receipt & KOT Modal */}
      {receiptModal.open && (
        <ThermalReceiptModal
          order={receiptModal.order}
          type={receiptModal.type}
          onClose={() => setReceiptModal({ open: false, order: null, type: 'KOT' })}
          storeName={storeSettings?.name || 'राघव रसोई (Raghav Rasoi)'}
        />
      )}

    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminAuthProvider>
      <AdminConsoleContent />
    </AdminAuthProvider>
  );
}
