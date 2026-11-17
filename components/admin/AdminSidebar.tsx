'use client';

import React from 'react';
import Link from 'next/link';
import {
  Utensils,
  TableProperties,
  BarChart3,
  Sandwich,
  FolderOpen,
  Ticket,
  Users2,
  Settings,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAdminAuth, ALL_PERMISSIONS } from '@/context/AdminAuthContext';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingCount: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  pendingCount,
  mobileOpen,
  onCloseMobile,
}: AdminSidebarProps) {
  const { currentStaff, hasPerm } = useAdminAuth();

  const navItems = [
    {
      id: 'kanban',
      label: 'Live Orders (Kanban)',
      icon: TableProperties,
      show: hasPerm('kanban'),
      badge: pendingCount,
    },
    {
      id: 'dashboard',
      label: 'Sales Dashboard',
      icon: BarChart3,
      show: hasPerm('view_dashboard'),
    },
    {
      id: 'menu',
      label: hasPerm('manage_menu') ? 'Menu & Pricing' : 'Quick Stock Toggle',
      icon: Sandwich,
      show: hasPerm('manage_menu') || hasPerm('toggle_stock'),
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: FolderOpen,
      show: hasPerm('manage_categories'),
    },
    {
      id: 'coupons',
      label: 'Coupon Generator',
      icon: Ticket,
      show: hasPerm('manage_coupons'),
    },
    {
      id: 'staff',
      label: 'Staff & Permissions',
      icon: Users2,
      show: hasPerm('store_settings'),
    },
    {
      id: 'settings',
      label: 'Store Settings',
      icon: Settings,
      show: hasPerm('store_settings'),
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transform transition-transform duration-200 lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Header */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#E5203A] text-white flex items-center justify-center shadow-xs">
                <Utensils size={18} />
              </div>
              <div>
                <h2 className="font-black text-slate-900 text-sm leading-tight">Admin Console</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F766E]">
                  RBAC Store Manager
                </span>
              </div>
            </div>
            <button onClick={onCloseMobile} className="lg:hidden text-slate-400 hover:text-slate-700">
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems
              .filter((n) => n.show)
              .map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                      isActive
                        ? 'bg-[#E5203A] text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          isActive ? 'bg-white text-[#E5203A]' : 'bg-rose-100 text-[#E5203A]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
          </nav>
        </div>

        {/* Footer: Assigned Permissions Summary & Storefront Link */}
        <div className="p-4 border-t border-slate-200 space-y-3">
          {currentStaff && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-1.5">
              <p className="text-[11px] font-extrabold text-slate-900">
                Assigned Permissions ({currentStaff.permissions.length}/8)
              </p>
              <div className="flex flex-wrap gap-1 pt-1">
                {currentStaff.permissions.map((pk) => {
                  const meta = ALL_PERMISSIONS.find((x) => x.key === pk);
                  return (
                    <span
                      key={pk}
                      className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[9px] font-bold text-slate-600"
                    >
                      {meta ? meta.label : pk}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          <Link
            href="/menu"
            target="_blank"
            className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
          >
            <span>Open Customer Storefront</span>
            <ExternalLink size={12} />
          </Link>
        </div>

      </aside>
    </>
  );
}
