'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { User, Lock, ArrowRight, ShieldCheck, ChevronDown, Check } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState('admin@raghavrasoi.in');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDemoLogins, setShowDemoLogins] = useState(false);

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
        setError(data.error || 'Invalid credentials. Please verify your login and password.');
      }
    } catch (err) {
      console.error(err);
      setError('Login error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (l: string, p: string) => {
    setLogin(l);
    setPassword(p);
    setError('');
    setShowDemoLogins(false);
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] flex items-center justify-center p-3 sm:p-6 lg:p-8">
      {/* 2-Column Split Card matching Reference Screenshot */}
      <div className="w-full max-w-6xl bg-white rounded-[32px] sm:rounded-[40px] shadow-2xl overflow-hidden border border-slate-200/80 grid grid-cols-1 lg:grid-cols-12 min-h-[660px]">
        
        {/* ================= LEFT: LOGIN FORM ================= */}
        <div className="lg:col-span-5 xl:col-span-5 p-8 sm:p-12 flex flex-col justify-between bg-white z-10">
          
          <div>
            {/* 1. Brand Swirl Icon matching Screenshot */}
            <div className="mb-6 sm:mb-8 flex items-center justify-between">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#EA580C] to-[#F97316] p-2.5 flex items-center justify-center shadow-md shadow-orange-500/20">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-full h-full text-white transform -rotate-12"
                >
                  <path d="M12 2a10 10 0 1 0 10 10" />
                  <path d="M12 6a6 6 0 1 0 6 6" />
                  <path d="M12 10a2 2 0 1 0 2 2" />
                </svg>
              </div>

              {/* Back to Site link */}
              <Link
                href="/menu"
                className="text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors"
              >
                ← Back to Menu
              </Link>
            </div>

            {/* 2. Heading & Subtitle matching Screenshot */}
            <div className="space-y-2 mb-8">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-serif">
                Login form
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
                Raghav Rasoi Staff &amp; Kitchen Console. Enter your credentials to manage active dining and delivery orders.
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-6 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 animate-in fade-in">
                {error}
              </div>
            )}

            {/* 3. Login Inputs matching Screenshot */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Username Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-600 pl-1">
                  Username
                </label>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    required
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    placeholder="Enter username"
                    className="w-full pl-11 pr-4 py-3 rounded-full border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 transition-all bg-white"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-600 pl-1">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-11 pr-4 py-3 rounded-full border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 transition-all bg-white"
                  />
                </div>
              </div>

              {/* Forgot Password Link matching Screenshot */}
              <div className="pt-0.5 pl-1">
                <button
                  type="button"
                  onClick={() => alert('Please contact store owner at +91 88396-75538 to reset staff credentials.')}
                  className="text-xs font-bold text-[#EA580C] hover:text-[#C2410C] hover:underline transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button "Running order" matching Screenshot */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#EA580C] to-[#F97316] hover:from-[#C2410C] hover:to-[#EA580C] text-white font-black text-sm tracking-wide shadow-lg shadow-orange-500/25 active:scale-98 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  <span>{loading ? 'Authenticating...' : 'Running order'}</span>
                  {!loading && <ArrowRight size={16} />}
                </button>
              </div>

            </form>
          </div>

          {/* 4. Footer & Demo Helper */}
          <div className="mt-8 space-y-3">
            
            {/* Quick Demo Accounts Toggle */}
            <div className="pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowDemoLogins(!showDemoLogins)}
                className="w-full flex items-center justify-between text-left text-[11px] font-bold text-slate-500 hover:text-slate-800 transition-colors"
              >
                <span>🔑 Click to auto-fill staff / admin accounts</span>
                <ChevronDown
                  size={14}
                  className={`transform transition-transform ${showDemoLogins ? 'rotate-180' : ''}`}
                />
              </button>

              {showDemoLogins && (
                <div className="mt-2.5 space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-200 animate-in fade-in text-xs">
                  <button
                    type="button"
                    onClick={() => fillDemo('admin@raghavrasoi.in', 'admin123')}
                    className="w-full p-2 rounded-xl hover:bg-white text-left transition-colors flex items-center justify-between"
                  >
                    <div>
                      <p className="font-black text-slate-900">👑 Super Admin (Owner)</p>
                      <p className="text-[10px] text-slate-500">admin@raghavrasoi.in</p>
                    </div>
                    <span className="font-mono text-[10px] font-bold text-[#EA580C]">admin123</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillDemo('rahul.kitchen@raghavrasoi.in', 'staff123')}
                    className="w-full p-2 rounded-xl hover:bg-white text-left transition-colors flex items-center justify-between"
                  >
                    <div>
                      <p className="font-black text-slate-900">🍳 Rahul (Kitchen Staff)</p>
                      <p className="text-[10px] text-slate-500">rahul.kitchen@raghavrasoi.in</p>
                    </div>
                    <span className="font-mono text-[10px] font-bold text-[#EA580C]">staff123</span>
                  </button>
                </div>
              )}
            </div>

            {/* End user agreement matching Screenshot */}
            <p className="text-center text-xs text-slate-400 font-medium">
              End user agreement • Raghav Rasoi
            </p>
          </div>

        </div>

        {/* ================= RIGHT: FOOD PLATE PRESENTATION ================= */}
        <div className="hidden lg:block lg:col-span-7 xl:col-span-7 relative min-h-[660px] bg-slate-100 overflow-hidden">
          <Image
            src="/assets/banners/admin-login-food-plate.jpg"
            alt="Raghav Rasoi Gourmet Food Presentation"
            fill
            className="object-cover object-right"
            priority
          />

          {/* Subtle Overlay Badge on Food Side */}
          <div className="absolute bottom-6 right-6 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Raghav Rasoi • Authentic Kitchen</span>
          </div>
        </div>

      </div>
    </div>
  );
}
