'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { User, Lock, ChevronDown, Check, ArrowLeft } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState('admin@raghavrasoi.com');
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
        setError(data.error || 'Invalid credentials. Please verify your username and password.');
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
    <div className="min-h-screen w-full relative flex items-center justify-center lg:justify-start lg:pl-14 xl:pl-24 bg-[#EBE8E3] overflow-x-hidden p-4 sm:p-6 lg:p-8">
      
      {/* 1. Full-Bleed Restaurant Food Flat-Lay Background */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <Image
          src="/assets/banners/admin-login-clean-bg.jpg"
          alt="Raghav Rasoi Presentation Background"
          fill
          priority
          className="object-cover object-right md:object-center"
        />
        {/* Soft mobile overlay so card stands out clearly on smaller screens */}
        <div className="lg:hidden absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
      </div>

      {/* Floating Back to Menu Button */}
      <Link
        href="/menu"
        className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 text-xs font-bold shadow-md backdrop-blur-md transition-all hover:scale-105"
      >
        <ArrowLeft size={14} />
        <span>Back to Menu</span>
      </Link>

      {/* 2. Floating White Card matching Reference Screenshot Exactly */}
      <div className="relative z-10 w-full max-w-[420px] bg-white rounded-[32px] sm:rounded-[38px] shadow-2xl shadow-black/25 border border-slate-100/90 p-8 sm:p-10 flex flex-col justify-between my-auto animate-in fade-in zoom-in-95 duration-200">
        
        <div>
          {/* A. Orange Swirl Logo - Centered */}
          <div className="flex justify-center mb-5 sm:mb-6">
            <div className="w-12 h-12 relative drop-shadow-sm">
              <Image
                src="/assets/icons/login-swirl-logo.png"
                alt="Raghav Rasoi Brand Swirl"
                width={48}
                height={48}
                priority
                className="object-contain mx-auto"
              />
            </div>
          </div>

          {/* B. Heading & Subtitle - Centered */}
          <div className="text-center space-y-2 mb-7">
            <h1 className="text-2xl sm:text-[28px] font-black text-slate-900 tracking-tight font-sans">
              Login form
            </h1>
            <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-[290px] mx-auto">
              Raghav Rasoi Staff &amp; Kitchen Console. Enter credentials to manage active dining and delivery orders.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 animate-in fade-in">
              {error}
            </div>
          )}

          {/* C. Form Inputs */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-500 pl-3">
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
                  className="w-full pl-11 pr-4 py-3 rounded-full border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-300 placeholder:font-normal focus:outline-none focus:border-[#F95E08] focus:ring-2 focus:ring-[#F95E08]/20 transition-all bg-white"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-500 pl-3">
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
                  className="w-full pl-11 pr-4 py-3 rounded-full border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-300 placeholder:font-normal focus:outline-none focus:border-[#F95E08] focus:ring-2 focus:ring-[#F95E08]/20 transition-all bg-white"
                />
              </div>
            </div>

            {/* Forgot password? Link */}
            <div className="pt-0.5 pl-3">
              <button
                type="button"
                onClick={() => alert('Please contact store owner at +91 88396-75538 to reset staff credentials.')}
                className="text-xs font-semibold text-[#F95E08] hover:underline transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button "Running order" in Exact Orange */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-full bg-[#F95E08] hover:bg-[#E05206] text-white font-bold text-sm tracking-wide shadow-lg shadow-orange-500/25 active:scale-[0.99] transition-all disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{loading ? 'Authenticating...' : 'Running order'}</span>
              </button>
            </div>

          </form>
        </div>

        {/* D. Bottom Section: End user agreement & Demo logins */}
        <div className="mt-8 space-y-3">
          
          {/* Quick Demo Accounts Toggle */}
          <div className="pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowDemoLogins(!showDemoLogins)}
              className="w-full flex items-center justify-between text-left text-[11px] font-bold text-slate-400 hover:text-slate-700 transition-colors"
            >
              <span>🔑 Auto-fill demo staff accounts</span>
              <ChevronDown
                size={13}
                className={`transform transition-transform ${showDemoLogins ? 'rotate-180' : ''}`}
              />
            </button>

            {showDemoLogins && (
              <div className="mt-2.5 space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-200 animate-in fade-in text-xs">
                <button
                  type="button"
                  onClick={() => fillDemo('admin@raghavrasoi.com', 'admin123')}
                  className="w-full p-2 rounded-xl hover:bg-white text-left transition-colors flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-slate-900">👑 Super Admin (Owner)</p>
                    <p className="text-[10px] text-slate-500">admin@raghavrasoi.com</p>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-[#F95E08]">admin123</span>
                </button>

                <button
                  type="button"
                  onClick={() => fillDemo('rahul.kitchen@raghavrasoi.com', 'staff123')}
                  className="w-full p-2 rounded-xl hover:bg-white text-left transition-colors flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-slate-900">🍳 Rahul (Kitchen Staff)</p>
                    <p className="text-[10px] text-slate-500">rahul.kitchen@raghavrasoi.com</p>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-[#F95E08]">staff123</span>
                </button>
              </div>
            )}
          </div>

          {/* End user agreement matching Screenshot */}
          <p className="text-center text-xs text-slate-400 font-medium">
            End user agreement
          </p>
        </div>

      </div>

    </div>
  );
}
