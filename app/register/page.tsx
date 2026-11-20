'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { User, Phone, Mail, Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCustomerAuth } from '@/context/CustomerAuthContext';

export default function CustomerRegisterPage() {
  const router = useRouter();
  const { login } = useCustomerAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!name.trim() || !phone.trim() || !email.trim() || !password.trim()) {
      setError('कृपया सभी फ़ील्ड (नाम, मोबाइल, ईमेल, पासवर्ड) भरें।');
      return;
    }

    if (password.length < 6) {
      setError('पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (data.success && data.user) {
        setSuccessMsg('खाता सफलतापूर्वक बनाया गया! स्वागत है राघव रसोई में...');
        login(data.user);
        setTimeout(() => {
          router.push('/menu');
        }, 1200);
      } else {
        setError(data.error || 'खाता बनाने में समस्या आई। कृपया पुनः प्रयास करें।');
      }
    } catch (err) {
      console.error(err);
      setError('सर्वर से संपर्क नहीं हो पाया। कृपया इंटरनेट कनेक्शन जांचें।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFDF9] via-amber-50/40 to-orange-50/30 flex flex-col justify-center items-center p-4 sm:p-6 text-slate-900">
      
      {/* Brand Header */}
      <div className="text-center mb-6 max-w-sm">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-2 hover:opacity-90 transition-opacity">
          <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-amber-300 shadow-md">
            <Image
              src="/raghav_rasoi_logo.jpg"
              alt="राघव रसोई Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="text-left">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
              राघव रसोई
            </h1>
            <span className="text-[10px] tracking-widest text-[#B45309] font-bold uppercase">
              Taste of Tradition
            </span>
          </div>
        </Link>
        <p className="text-xs text-slate-600 font-medium">
          नया ग्राहक खाता बनाएं • स्वादिष्ट भोजन का आनंद लें
        </p>
      </div>

      {/* Main Form Card */}
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-100">
        
        <div className="mb-6">
          <h2 className="text-xl font-black text-slate-900">Create Customer Account</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            अपना नाम, मोबाइल नंबर, ईमेल और पासवर्ड दर्ज करें।
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4 text-xs">
          
          {/* Full Name */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              आपका पूरा नाम (Full Name) *
            </label>
            <div className="relative">
              <User size={15} className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full pl-9 pr-3.5 py-3 rounded-xl border border-slate-200 text-slate-900 font-medium focus:outline-none focus:border-[#FBBF24] focus:ring-2 focus:ring-[#FBBF24]/30"
              />
            </div>
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              मोबाइल नंबर (Mobile Number) *
            </label>
            <div className="relative">
              <Phone size={15} className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full pl-9 pr-3.5 py-3 rounded-xl border border-slate-200 text-slate-900 font-medium focus:outline-none focus:border-[#FBBF24] focus:ring-2 focus:ring-[#FBBF24]/30"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              ईमेल पता (Email Address) *
            </label>
            <div className="relative">
              <Mail size={15} className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. ramesh@example.com"
                className="w-full pl-9 pr-3.5 py-3 rounded-xl border border-slate-200 text-slate-900 font-medium focus:outline-none focus:border-[#FBBF24] focus:ring-2 focus:ring-[#FBBF24]/30"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              सुरक्षित पासवर्ड (Password) *
            </label>
            <div className="relative">
              <Lock size={15} className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="न्यूनतम 6 अक्षर (Min 6 chars)"
                className="w-full pl-9 pr-3.5 py-3 rounded-xl border border-slate-200 text-slate-900 font-medium focus:outline-none focus:border-[#FBBF24] focus:ring-2 focus:ring-[#FBBF24]/30"
              />
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-xl bg-[#FBBF24] hover:bg-[#F59E0B] text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-60"
          >
            <span>{loading ? 'खाता बन रहा है...' : 'खाता बनाएं (Create Account)'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Existing user link */}
        <div className="pt-6 mt-6 border-t border-slate-100 text-center space-y-3">
          <p className="text-xs text-slate-600 font-medium">
            पहले से खाता है?{' '}
            <Link href="/login" className="font-extrabold text-[#B45309] hover:underline">
              यहाँ लॉगिन करें (Sign In)
            </Link>
          </p>

          <Link
            href="/menu"
            className="inline-block text-[11px] text-slate-400 hover:text-slate-700 font-semibold"
          >
            ← राघव रसोई मेनू पर लौटें
          </Link>
        </div>

      </div>
    </div>
  );
}
