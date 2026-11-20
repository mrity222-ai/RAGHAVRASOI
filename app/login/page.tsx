'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Mail, Lock, KeyRound, ArrowRight, CheckCircle2, AlertCircle, Smartphone } from 'lucide-react';
import { useCustomerAuth } from '@/context/CustomerAuthContext';

export default function CustomerLoginPage() {
  const router = useRouter();
  const { login } = useCustomerAuth();

  // Tab: 'password' | 'otp'
  const [authMethod, setAuthMethod] = useState<'password' | 'otp'>('password');

  // Password Login state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // OTP Login state
  const [otpEmail, setOtpEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 1. Password Login Handler
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!loginIdentifier.trim() || !password.trim()) {
      setError('कृपया ईमेल/मोबाइल और पासवर्ड दोनों भरें।');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          login: loginIdentifier.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (data.success && data.user) {
        setSuccessMsg(`स्वागत है, ${data.user.name}! लॉगिन सफल रहा।`);
        login(data.user);
        setTimeout(() => {
          router.push('/menu');
        }, 1000);
      } else {
        setError(data.error || 'अमान्य क्रेडेंशियल्स। कृपया दोबारा जांचें।');
      }
    } catch (err) {
      console.error(err);
      setError('लॉगिन करने में त्रुटि आई। कृपया पुनः प्रयास करें।');
    } finally {
      setLoading(false);
    }
  };

  // 2. Send OTP Handler
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setDevOtpHint(null);

    if (!otpEmail.trim()) {
      setError('कृपया अपना पंजीकृत ईमेल दर्ज करें।');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: otpEmail.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        setOtpSent(true);
        if (data.devOtp) {
          setDevOtpHint(data.devOtp);
        }
        setSuccessMsg(`ओटीपी कोड ${otpEmail} पर भेज दिया गया है।`);
      } else {
        setError(data.error || 'ओटीपी भेजने में विफल। क्या आपका खाता बना हुआ है?');
      }
    } catch (err) {
      console.error(err);
      setError('ओटीपी भेजने में त्रुटि आई।');
    } finally {
      setLoading(false);
    }
  };

  // 3. Verify OTP Handler
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!otpCode.trim()) {
      setError('कृपया 6 अंकों का ओटीपी कोड दर्ज करें।');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: otpEmail.trim(),
          otp: otpCode.trim(),
        }),
      });

      const data = await res.json();

      if (data.success && data.user) {
        setSuccessMsg(`ओटीपी सत्यापित! स्वागत है ${data.user.name}।`);
        login(data.user);
        setTimeout(() => {
          router.push('/menu');
        }, 1000);
      } else {
        setError(data.error || 'गलत ओटीपी। कृपया दोबारा सही कोड दर्ज करें।');
      }
    } catch (err) {
      console.error(err);
      setError('ओटीपी सत्यापन में त्रुटि आई।');
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
          ग्राहक लॉगिन • पासवर्ड या ईमेल ओटीपी द्वारा तुरंत प्रवेश करें
        </p>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-100">
        
        {/* Toggle Login Method Tabs */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl mb-6 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setAuthMethod('password');
              setError('');
              setSuccessMsg('');
            }}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              authMethod === 'password'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Lock size={14} />
            <span>Login with Password</span>
          </button>
          
          <button
            type="button"
            onClick={() => {
              setAuthMethod('otp');
              setError('');
              setSuccessMsg('');
            }}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              authMethod === 'otp'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <KeyRound size={14} />
            <span>Login with OTP</span>
          </button>
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

        {/* TAB 1: Password Login */}
        {authMethod === 'password' && (
          <form onSubmit={handlePasswordLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                ईमेल या मोबाइल नंबर (Email / Mobile)
              </label>
              <div className="relative">
                <Smartphone size={15} className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="e.g. 9876543210 or ramesh@example.com"
                  className="w-full pl-9 pr-3.5 py-3 rounded-xl border border-slate-200 text-slate-900 font-medium focus:outline-none focus:border-[#FBBF24] focus:ring-2 focus:ring-[#FBBF24]/30"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                पासवर्ड (Password)
              </label>
              <div className="relative">
                <Lock size={15} className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-3 rounded-xl border border-slate-200 text-slate-900 font-medium focus:outline-none focus:border-[#FBBF24] focus:ring-2 focus:ring-[#FBBF24]/30"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-xl bg-[#FBBF24] hover:bg-[#F59E0B] text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-60"
            >
              <span>{loading ? 'सत्यापित हो रहा है...' : 'लॉगिन करें (Sign In)'}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* TAB 2: Email OTP Login */}
        {authMethod === 'otp' && (
          <div className="space-y-4 text-xs">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    पंजीकृत ईमेल पता (Registered Email)
                  </label>
                  <div className="relative">
                    <Mail size={15} className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={otpEmail}
                      onChange={(e) => setOtpEmail(e.target.value)}
                      placeholder="e.g. ramesh@example.com"
                      className="w-full pl-9 pr-3.5 py-3 rounded-xl border border-slate-200 text-slate-900 font-medium focus:outline-none focus:border-[#FBBF24] focus:ring-2 focus:ring-[#FBBF24]/30"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5">
                    हम आपके इस ईमेल पर 6 अंकों का सुरक्षित ओटीपी कोड भेजेंगे।
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-[#FBBF24] hover:bg-[#F59E0B] text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-60"
                >
                  <span>{loading ? 'ओटीपी भेजा जा रहा है...' : 'ओटीपी भेजें (Send OTP)'}</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block font-bold text-slate-700">
                      6 अंकों का ओटीपी दर्ज करें (Enter OTP)
                    </label>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-[11px] text-[#B45309] font-bold hover:underline"
                    >
                      ईमेल बदलें
                    </button>
                  </div>

                  <div className="relative">
                    <KeyRound size={15} className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 123456"
                      className="w-full pl-9 pr-3.5 py-3 rounded-xl border border-slate-200 text-slate-900 font-mono font-bold tracking-widest text-center text-lg focus:outline-none focus:border-[#FBBF24] focus:ring-2 focus:ring-[#FBBF24]/30"
                    />
                  </div>

                  {/* Dev / Quick Fill Helper */}
                  {devOtpHint && (
                    <div className="mt-2.5 p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-900">
                        🔑 Demo OTP Code: <span className="font-mono text-base font-black text-[#B45309]">{devOtpHint}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setOtpCode(devOtpHint)}
                        className="text-[10px] bg-[#FBBF24] text-slate-950 px-2 py-1 rounded-lg font-bold hover:bg-[#F59E0B]"
                      >
                        Auto-Fill
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-[#FBBF24] hover:bg-[#F59E0B] text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-60"
                >
                  <span>{loading ? 'सत्यापित हो रहा है...' : 'ओटीपी सत्यापित कर लॉगिन करें'}</span>
                  <CheckCircle2 size={16} />
                </button>
              </form>
            )}
          </div>
        )}

        {/* Create account link */}
        <div className="pt-6 mt-6 border-t border-slate-100 text-center space-y-3">
          <p className="text-xs text-slate-600 font-medium">
            खाता नहीं है?{' '}
            <Link href="/register" className="font-extrabold text-[#B45309] hover:underline">
              नया खाता बनाएं (Register)
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
