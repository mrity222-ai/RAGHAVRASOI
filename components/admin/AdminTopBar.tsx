'use client';

import React from 'react';
import { Bell, BellOff, Plus, Shield, LogOut, Power } from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';

interface AdminTopBarProps {
  isOpen: boolean;
  onToggleStoreOpen: () => void;
  onToggleMobileSidebar: () => void;
}

export default function AdminTopBar({
  isOpen,
  onToggleStoreOpen,
  onToggleMobileSidebar,
}: AdminTopBarProps) {
  const { currentStaff, allStaff, switchStaffAccount, hasPerm, soundOn, toggleSound, logout } =
    useAdminAuth();

  return (
    <header className="bg-white border-b border-slate-200 px-4 lg:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
      
      {/* Left: Hamburger & Active Staff Badge */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
          aria-label="Toggle Navigation"
        >
          <span className="text-base font-bold">☰</span>
        </button>

        {currentStaff && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-[#0F766E] text-xs font-extrabold">
            <Shield size={14} />
            <span>
              {currentStaff.name} • {currentStaff.roleTitle}
            </span>
          </div>
        )}

        {/* Quick Staff Account Switcher for testing */}
        <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1 text-xs">
          <span className="text-slate-500 font-semibold">Test Login:</span>
          <select
            value={currentStaff?.id || ''}
            onChange={(e) => switchStaffAccount(e.target.value)}
            className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
          >
            {allStaff.map((st) => (
              <option key={st.id} value={st.id}>
                {st.name} ({st.permissions.length} perms)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-2.5 flex-wrap">
        
        {/* Sound Chime Toggle */}
        <button
          onClick={toggleSound}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
        >
          {soundOn ? (
            <>
              <Bell size={14} className="text-amber-500" />
              <span>Sound ON</span>
            </>
          ) : (
            <>
              <BellOff size={14} className="text-slate-400" />
              <span>Muted</span>
            </>
          )}
        </button>

        {/* Master Store OPEN / CLOSED Switch */}
        <button
          onClick={onToggleStoreOpen}
          disabled={!hasPerm('store_settings')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border font-extrabold text-xs transition-all ${
            isOpen
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-rose-50 border-rose-300 text-rose-800'
          } ${!hasPerm('store_settings') ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={!hasPerm('store_settings') ? 'Requires store_settings permission' : ''}
        >
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-600'
            }`}
          />
          <span>{isOpen ? 'STORE OPEN' : 'STORE CLOSED'}</span>
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          title="Logout"
        >
          <LogOut size={16} />
        </button>

      </div>
    </header>
  );
}
