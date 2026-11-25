'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface StaffUserType {
  id: string;
  name: string;
  roleTitle: string;
  login: string;
  isOwner: boolean;
  permissions: string[];
}

interface AdminAuthContextType {
  currentStaff: StaffUserType | null;
  setCurrentStaff: (staff: StaffUserType | null) => void;
  hasPerm: (permKey: string) => boolean;
  allStaff: StaffUserType[];
  refreshStaff: () => Promise<void>;
  switchStaffAccount: (staffId: string) => void;
  logout: () => void;
  soundOn: boolean;
  toggleSound: () => void;
  playAlertChime: () => void;
  authLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const ALL_PERMISSIONS = [
  { key: 'kanban', label: 'Live Orders Kanban', icon: 'fa-table-columns' },
  { key: 'print_kot', label: 'Print KOT & Bills', icon: 'fa-print' },
  { key: 'toggle_stock', label: 'Toggle Stock', icon: 'fa-toggle-on' },
  { key: 'manage_menu', label: 'Manage Menu & Pricing', icon: 'fa-burger' },
  { key: 'manage_categories', label: 'Manage Categories', icon: 'fa-folder-open' },
  { key: 'manage_coupons', label: 'Manage Coupons', icon: 'fa-ticket' },
  { key: 'view_dashboard', label: 'View Sales Dashboard', icon: 'fa-chart-line' },
  { key: 'store_settings', label: 'Store Settings & Staff', icon: 'fa-gear' },
];

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStaff, setCurrentStaff] = useState<StaffUserType | null>(null);
  const [allStaff, setAllStaff] = useState<StaffUserType[]>([]);
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Load staff list & active session
  const refreshStaff = async () => {
    try {
      const res = await fetch('/api/admin/staff');
      if (res.status === 401) {
        setAllStaff([]);
        setCurrentStaff(null);
        localStorage.removeItem('ranel_admin_staff_id');
        return;
      }
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        setAllStaff(data.data);
        const savedId = localStorage.getItem('ranel_admin_staff_id');
        if (savedId) {
          const found = data.data.find((s: StaffUserType) => s.id === savedId);
          if (found) {
            setCurrentStaff(found);
          } else {
            setCurrentStaff(null);
          }
        } else {
          setCurrentStaff(null);
        }
      }
    } catch (e) {
      console.error('Failed to fetch staff list:', e);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    refreshStaff();
  }, []);

  const switchStaffAccount = (staffId: string) => {
    const found = allStaff.find((s) => s.id === staffId);
    if (found) {
      setCurrentStaff(found);
      localStorage.setItem('ranel_admin_staff_id', found.id);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    }
    setCurrentStaff(null);
    localStorage.removeItem('ranel_admin_staff_id');
    window.location.href = '/admin/login';
  };

  const hasPerm = (permKey: string): boolean => {
    if (!currentStaff) return false;
    if (currentStaff.isOwner) return true;
    return currentStaff.permissions.includes(permKey);
  };

  const toggleSound = () => {
    setSoundOn((prev) => !prev);
  };

  const playAlertChime = () => {
    if (!soundOn) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      [659.25, 880].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.14);
        gain.gain.setValueAtTime(0.001, now + idx * 0.14);
        gain.gain.exponentialRampToValueAtTime(0.2, now + idx * 0.14 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.14 + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.14);
        osc.stop(now + idx * 0.14 + 0.55);
      });
    } catch (e) {
      console.log('Audio chime error:', e);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        currentStaff,
        setCurrentStaff,
        hasPerm,
        allStaff,
        refreshStaff,
        switchStaffAccount,
        logout,
        soundOn,
        toggleSound,
        playAlertChime,
        authLoading,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
