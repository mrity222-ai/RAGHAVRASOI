'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Utensils, Shield, ArrowRight, Lock, User } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState('owner@spicegrill.in');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: login.trim(), password: password.trim() }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        localStorage.setItem('ranel_admin_staff_id', data.data.id);
        router.push('/admin');
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      console.error(err);
      setError('Login error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoLogin: string, demoPass: string) => {
    setLogin(demoLogin);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-3xl bg-[#E5203A] text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-rose-950/50">
          <Utensils size={28} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Restaurant Admin &amp; Staff Console
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Role-Based Access Control • Live Kanban &amp; Store Management
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-6">
        
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Shield size={18} className="text-[#E5203A]" />
          <h2 className="font-black text-base text-slate-900">Sign in to your account</h2>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-[#E5203A]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Mobile or Email Login</label>
            <div className="relative">
              <User size={14} className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="e.g. owner@spicegrill.in"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 font-mono font-semibold focus:outline-none focus:border-[#E5203A]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock size={14} className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 font-mono font-semibold focus:outline-none focus:border-[#E5203A]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#E5203A] hover:bg-[#C8172E] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-98"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Admin Console'}</span>
            <ArrowRight size={14} />
          </button>
        </form>

        {/* Demo Accounts Quick-Select */}
        <div className="pt-2 border-t border-slate-100">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
            1-Click Demo Logins:
          </p>

          <div className="space-y-1.5 text-xs">
            <button
              type="button"
              onClick={() => fillDemoAccount('owner@spicegrill.in', 'admin123')}
              className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-[#E5203A] bg-slate-50 flex items-center justify-between text-left transition-colors"
            >
              <div>
                <p className="font-extrabold text-slate-900">👑 Super Admin (Owner)</p>
                <p className="text-[10px] text-slate-500">owner@spicegrill.in • All 8 permissions</p>
              </div>
              <span className="text-[10px] font-mono text-[#0F766E] font-bold">admin123</span>
            </button>

            <button
              type="button"
              onClick={() => fillDemoAccount('rahul.kitchen@spicegrill.in', 'staff123')}
              className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-[#E5203A] bg-slate-50 flex items-center justify-between text-left transition-colors"
            >
              <div>
                <p className="font-extrabold text-slate-900">🍳 Rahul (Kitchen Staff)</p>
                <p className="text-[10px] text-slate-500">rahul.kitchen@spicegrill.in • 3 permissions</p>
              </div>
              <span className="text-[10px] font-mono text-[#0F766E] font-bold">staff123</span>
            </button>

            <button
              type="button"
              onClick={() => fillDemoAccount('priya.mgr@spicegrill.in', 'manager123')}
              className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-[#E5203A] bg-slate-50 flex items-center justify-between text-left transition-colors"
            >
              <div>
                <p className="font-extrabold text-slate-900">📋 Priya (Store Manager)</p>
                <p className="text-[10px] text-slate-500">priya.mgr@spicegrill.in • 6 permissions</p>
              </div>
              <span className="text-[10px] font-mono text-[#0F766E] font-bold">manager123</span>
            </button>
          </div>
        </div>

        <div className="text-center pt-2">
          <Link href="/menu" className="text-xs text-slate-500 hover:text-black font-semibold">
            ← Back to Customer Storefront
          </Link>
        </div>

      </div>
    </div>
  );
}
