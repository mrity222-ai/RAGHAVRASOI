'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  UtensilsCrossed, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ItemCustomizeModal from '@/components/storefront/ItemCustomizeModal';
import StoreCartDrawer from '@/components/storefront/StoreCartDrawer';
import LiveTokenTrackerModal from '@/components/storefront/LiveTokenTrackerModal';
import ScrollToTop from '@/components/ScrollToTop';

/* Realistic Torn Paper Edge Separator */
function TornPaperDivider({
  color = '#F7EFE1',
  flip = false,
}: {
  color?: string;
  flip?: boolean;
}) {
  return (
    <div
      className={`w-full overflow-hidden leading-none select-none pointer-events-none relative z-20 ${
        flip ? 'rotate-180 -mt-1' : '-mb-1'
      }`}
    >
      <svg
        viewBox="0 0 1440 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-6 sm:h-9"
        preserveAspectRatio="none"
      >
        <path
          d="M0 40H1440V16L1418 24L1390 12L1365 22L1338 14L1310 25L1282 17L1254 26L1224 15L1192 25L1164 16L1134 24L1106 17L1076 25L1044 15L1016 24L984 14L956 23L926 17L896 25L868 15L838 24L808 15L778 24L748 16L718 25L686 16L656 24L624 15L594 24L564 16L534 25L504 16L474 25L444 15L414 24L384 16L354 25L324 17L294 25L264 15L234 24L204 16L174 25L144 17L114 26L84 16L54 25L24 15L0 22V40Z"
          fill={color}
        />
      </svg>
    </div>
  );
}

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState<'reservation' | 'inquiry'>('reservation');

  // Reservation form state
  const [resForm, setResForm] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '19:00',
    guests: '2',
    notes: '',
  });
  const [resSubmitted, setResSubmitted] = useState(false);

  // Inquiry form state
  const [inqForm, setInqForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [inqSubmitted, setInqSubmitted] = useState(false);

  const googleMapsUrl = 'https://maps.app.goo.gl/9sfkM5RPRyqjpSAz6?g_st=aw';

  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resForm.name || !resForm.phone || !resForm.date) {
      alert('Please fill in your name, phone number, and reservation date.');
      return;
    }
    setResSubmitted(true);
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inqForm.name || !inqForm.email || !inqForm.message) {
      alert('Please fill in your name, email, and message.');
      return;
    }
    setInqSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-slate-800">
      {/* Universal Foodly Header */}
      <Header />

      <main className="flex-1">
        
        {/* ============================================================ */}
        {/* SECTION 1: HERO - "Contact Raghav Rasoi"                     */}
        {/* ============================================================ */}
        <section className="relative w-full min-h-[580px] sm:min-h-[660px] lg:min-h-[720px] bg-black text-white flex flex-col justify-between overflow-hidden">
          {/* Moody Authentic Indian Restaurant Ambience Background */}
          <Image
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=85"
            alt="Raghav Rasoi Welcoming Dining Ambiance"
            fill
            priority
            className="object-cover object-center filter brightness-[0.65] contrast-[1.1]"
          />

          {/* Deep Warm Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/45 to-black/90" />

          {/* Top Brand Logo / Tag */}
          <div className="relative z-10 pt-10 sm:pt-14 text-center">
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.35em] text-[#E0CEB5] uppercase block">
              RAGHAV RASOI
            </span>
          </div>

          {/* Center Main Headline Box */}
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center my-auto flex flex-col items-center">
            
            {/* "contact" in yellow cursive script font */}
            <span
              className="text-[#FBBF24] text-3xl sm:text-5xl lg:text-6xl font-serif italic tracking-wide -mb-3 sm:-mb-5 select-none drop-shadow-md"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              contact
            </span>

            {/* "Raghav Rasoi" in large crisp white serif */}
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-[95px] font-bold text-white tracking-tight leading-none drop-shadow-2xl">
              Raghav Rasoi
            </h1>

            {/* Subtitle */}
            <p className="text-white/90 text-xs sm:text-sm lg:text-base font-normal max-w-lg mx-auto mt-4 sm:mt-6 leading-relaxed drop-shadow">
              We look forward to welcoming you. Reserve a table, ask a question, or order catering for your special celebration in Gaur City 1, Greater Noida West.
            </p>

            {/* 3 Circular Action Buttons */}
            <div className="pt-8 sm:pt-10 flex items-center justify-center gap-4 sm:gap-6 relative">
              
              {/* 1. CALL US (Amber Solid Circle) */}
              <a
                href="tel:+918839675538"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#E5933A] hover:bg-[#D68128] text-slate-950 font-black text-[11px] sm:text-xs tracking-wider flex items-center justify-center text-center uppercase leading-tight shadow-2xl hover:scale-105 active:scale-95 transition-all"
              >
                CALL<br />US
              </a>

              {/* 2. GET DIRECTIONS (Outline Circle) */}
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-white/80 bg-black/40 backdrop-blur-sm hover:bg-white/20 text-white font-black text-[11px] sm:text-xs tracking-wider flex items-center justify-center text-center uppercase leading-tight shadow-2xl hover:scale-105 active:scale-95 transition-all"
              >
                GET<br />MAP
              </a>

              {/* 3. BOOK TABLE (Rust Red Solid Circle) with Handwritten Doodle */}
              <div className="relative">
                <a
                  href="#reservation-form"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#9E4029] hover:bg-[#873420] text-white font-black text-[11px] sm:text-xs tracking-wider flex items-center justify-center text-center uppercase leading-tight shadow-2xl hover:scale-105 active:scale-95 transition-all"
                >
                  BOOK<br />TABLE
                </a>

                {/* Hand-drawn yellow doodle arrow with "book here" */}
                <div className="absolute -top-6 -right-16 sm:-right-20 hidden sm:flex items-center gap-1 text-[#FBBF24] font-serif italic text-sm pointer-events-none select-none">
                  <span className="text-base">⤶</span>
                  <span>book here</span>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Paper Tear Transition */}
          <div className="relative z-10 w-full">
            <TornPaperDivider color="#F7EFE1" />
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 2: "Atithi Devo Bhava" & CONTACT INFO (Cream Section)*/}
        {/* ============================================================ */}
        <section className="w-full bg-[#F7EFE1] py-14 sm:py-20 relative overflow-hidden">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              
              {/* Left Column: Hospitality Story & Direct Contact Cards */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-serif italic text-[#A24A32] text-xl sm:text-2xl font-bold">
                      Atithi Devo Bhava
                    </span>
                    <span className="text-[#A24A32] text-lg select-none">☸</span>
                  </div>
                  <h2 className="font-serif text-3xl sm:text-5xl lg:text-[52px] font-bold text-slate-900 tracking-tight leading-tight mt-1">
                    Get in Touch with Us
                  </h2>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-xl font-normal">
                  At Raghav Rasoi, our guests always come first. Whether you would like to reserve a family dining table, organize a party, or arrange pure catering with traditional North Indian delicacies, our team is always at your service.
                </p>

                {/* 4 Rich Contact Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  
                  {/* Card 1: Restaurant Address */}
                  <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-4 border border-[#E9DEC9] shadow-xs flex items-start gap-3.5 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-xl bg-[#9E4029]/10 text-[#9E4029] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Restaurant Address
                      </h4>
                      <p className="text-xs text-slate-700 font-medium mt-1 leading-snug">
                        7th Avenue, Near Aarza Square - 2, Gaur City 1, Greater Noida West, UP 201009
                      </p>
                      <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-[#A24A32] font-bold hover:underline inline-flex items-center gap-1 mt-1.5"
                      >
                        <span>Open on Google Maps</span>
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>

                  {/* Card 2: Phone Number */}
                  <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-4 border border-[#E9DEC9] shadow-xs flex items-start gap-3.5 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-xl bg-[#E5933A]/15 text-[#D68128] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Phone size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Call Us Directly
                      </h4>
                      <p className="text-xs text-slate-700 font-medium mt-1 leading-snug">
                        +91 88396-75538
                      </p>
                      <a
                        href="tel:+918839675538"
                        className="text-[11px] text-[#A24A32] font-bold hover:underline inline-flex items-center gap-1 mt-1.5"
                      >
                        <span>Call Now</span>
                        <ArrowRight size={11} />
                      </a>
                    </div>
                  </div>

                  {/* Card 3: Email */}
                  <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-4 border border-[#E9DEC9] shadow-xs flex items-start gap-3.5 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-xl bg-slate-900/10 text-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Email Address
                      </h4>
                      <p className="text-xs text-slate-700 font-medium mt-1 leading-snug">
                        info@raghavrasoi.in
                      </p>
                      <a
                        href="mailto:info@raghavrasoi.in"
                        className="text-[11px] text-[#A24A32] font-bold hover:underline inline-flex items-center gap-1 mt-1.5"
                      >
                        <span>Send Email</span>
                        <ArrowRight size={11} />
                      </a>
                    </div>
                  </div>

                  {/* Card 4: Catering & Parties */}
                  <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-4 border border-[#E9DEC9] shadow-xs flex items-start gap-3.5 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-xl bg-[#9E4029]/10 text-[#9E4029] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <UtensilsCrossed size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Catering & Events
                      </h4>
                      <p className="text-xs text-slate-700 font-medium mt-1 leading-snug">
                        catering@raghavrasoi.in
                      </p>
                      <button
                        onClick={() => {
                          setActiveTab('inquiry');
                          const el = document.getElementById('reservation-form');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="text-[11px] text-[#A24A32] font-bold hover:underline inline-flex items-center gap-1 mt-1.5 text-left"
                      >
                        <span>Request Catering</span>
                        <ArrowRight size={11} />
                      </button>
                    </div>
                  </div>

                </div>

                {/* 6 Feature Badges with Terracotta Dots */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2.5 pt-3 text-[11px] sm:text-xs font-black tracking-wider text-slate-900 uppercase">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#A24A32]" />
                    <span>TABLE RESERVATIONS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#A24A32]" />
                    <span>OUTDOOR CATERING</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#A24A32]" />
                    <span>SELF PICKUP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#A24A32]" />
                    <span>CORPORATE PARTIES</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#A24A32]" />
                    <span>CUSTOM SPICE LEVELS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#A24A32]" />
                    <span>PROMPT SERVICE</span>
                  </div>
                </div>

              </div>

              {/* Right Column: Copper Handi Dish with Gold Stamp Badge */}
              <div className="lg:col-span-5 relative flex items-center justify-center">
                <div className="relative w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] rounded-full overflow-hidden shadow-2xl border-4 border-white/60">
                  <Image
                    src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=85"
                    alt="Authentic Dining Table Setup at Raghav Rasoi"
                    fill
                    className="object-cover object-center"
                  />
                </div>

                {/* Yellow Stamp Badge */}
                <div className="absolute -bottom-4 left-4 sm:left-8 bg-[#E5933A] text-slate-950 w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center text-center shadow-xl p-2 select-none border-2 border-white/40">
                  <span className="text-amber-950 text-xs sm:text-sm font-black tracking-widest">
                    ★★★★★
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider leading-tight mt-1">
                    100% GUEST SATISFACTION
                  </span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 3: RESERVATION & INQUIRY FORM (Dark Charcoal #181818)*/}
        {/* ============================================================ */}
        <section
          id="reservation-form"
          className="w-full bg-[#181818] text-white py-16 sm:py-24 relative overflow-hidden"
        >
          <div className="max-w-[1040px] mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header with Title and Doodles */}
            <div className="text-center mb-10 sm:mb-12">
              <span
                className="text-[#FBBF24] text-2xl sm:text-3xl font-serif italic block -mb-1"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                send a
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
                Message & Table Reservation
              </h2>
              <div className="flex items-center justify-center gap-2 text-[#FBBF24] font-serif italic text-sm mt-3 select-none">
                <span>we respond within 2 hours ⤳</span>
              </div>
            </div>

            {/* Tab Switcher */}
            <div className="flex items-center justify-center mb-10">
              <div className="inline-flex rounded-full bg-white/10 p-1.5 border border-white/15">
                <button
                  type="button"
                  onClick={() => setActiveTab('reservation')}
                  className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all ${
                    activeTab === 'reservation'
                      ? 'bg-[#E5933A] text-slate-950 shadow-md'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Table Reservation
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('inquiry')}
                  className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all ${
                    activeTab === 'inquiry'
                      ? 'bg-[#E5933A] text-slate-950 shadow-md'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  General Inquiry & Catering
                </button>
              </div>
            </div>

            {/* TAB 1: Table Reservation Form */}
            {activeTab === 'reservation' && (
              <div className="bg-[#212121] rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl">
                {resSubmitted ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                      <CheckCircle2 size={36} />
                    </div>
                    <h3 className="font-serif text-3xl font-bold text-white">
                      Thank You for Your Table Reservation!
                    </h3>
                    <p className="text-white/80 text-sm max-w-md mx-auto leading-relaxed">
                      We have received your table booking request for <strong>{resForm.guests} guests</strong> on <strong>{resForm.date} at {resForm.time}</strong>. Our host will confirm via SMS/call shortly.
                    </p>
                    <button
                      onClick={() => setResSubmitted(false)}
                      className="mt-6 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider"
                    >
                      Book Another Table
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleReservationSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-bold text-white/90 uppercase tracking-wider mb-2">
                          Your Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={resForm.name}
                          onChange={(e) => setResForm({ ...resForm, name: e.target.value })}
                          placeholder="e.g. Ramesh Sharma"
                          className="w-full bg-[#141414] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-hidden focus:border-[#E5933A]"
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-xs font-bold text-white/90 uppercase tracking-wider mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={resForm.phone}
                          onChange={(e) => setResForm({ ...resForm, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full bg-[#141414] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-hidden focus:border-[#E5933A]"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-xs font-bold text-white/90 uppercase tracking-wider mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={resForm.email}
                          onChange={(e) => setResForm({ ...resForm, email: e.target.value })}
                          placeholder="name@email.com"
                          className="w-full bg-[#141414] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-hidden focus:border-[#E5933A]"
                        />
                      </div>

                      {/* Date */}
                      <div>
                        <label className="block text-xs font-bold text-white/90 uppercase tracking-wider mb-2">
                          Reservation Date *
                        </label>
                        <input
                          type="date"
                          required
                          value={resForm.date}
                          onChange={(e) => setResForm({ ...resForm, date: e.target.value })}
                          className="w-full bg-[#141414] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-hidden focus:border-[#E5933A]"
                        />
                      </div>

                      {/* Time */}
                      <div>
                        <label className="block text-xs font-bold text-white/90 uppercase tracking-wider mb-2">
                          Preferred Time *
                        </label>
                        <select
                          value={resForm.time}
                          onChange={(e) => setResForm({ ...resForm, time: e.target.value })}
                          className="w-full bg-[#141414] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-hidden focus:border-[#E5933A]"
                        >
                          <option value="12:00">12:00 PM (Lunch)</option>
                          <option value="12:30">12:30 PM (Lunch)</option>
                          <option value="13:00">01:00 PM (Lunch)</option>
                          <option value="13:30">01:30 PM (Lunch)</option>
                          <option value="19:00">07:00 PM (Dinner)</option>
                          <option value="19:30">07:30 PM (Dinner)</option>
                          <option value="20:00">08:00 PM (Dinner)</option>
                          <option value="20:30">08:30 PM (Dinner)</option>
                          <option value="21:00">09:00 PM (Dinner)</option>
                          <option value="21:30">09:30 PM (Dinner)</option>
                        </select>
                      </div>

                      {/* Guests */}
                      <div>
                        <label className="block text-xs font-bold text-white/90 uppercase tracking-wider mb-2">
                          Number of Guests *
                        </label>
                        <select
                          value={resForm.guests}
                          onChange={(e) => setResForm({ ...resForm, guests: e.target.value })}
                          className="w-full bg-[#141414] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-hidden focus:border-[#E5933A]"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, '12+ Large Family Party'].map((num) => (
                            <option key={num} value={num}>
                              {num} {typeof num === 'number' && num > 1 ? 'Guests' : 'Guest'}
                            </option>
                          ))}
                        </select>
                      </div>

                    </div>

                    {/* Notes / Special Requests */}
                    <div>
                      <label className="block text-xs font-bold text-white/90 uppercase tracking-wider mb-2">
                        Special Requests (Dietary, High Chair, Birthday celebration)
                      </label>
                      <textarea
                        rows={3}
                        value={resForm.notes}
                        onChange={(e) => setResForm({ ...resForm, notes: e.target.value })}
                        placeholder="Please let us know if any guests have food allergies, preference for mild spice, or if you are celebrating a special occasion..."
                        className="w-full bg-[#141414] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-hidden focus:border-[#E5933A]"
                      />
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <p className="text-white/50 text-xs">
                        * Table bookings are confirmed by phone or SMS notification.
                      </p>
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#E5933A] hover:bg-[#D68128] text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        <span>CONFIRM TABLE BOOKING</span>
                        <span>➔</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* TAB 2: General Inquiry / Catering Form */}
            {activeTab === 'inquiry' && (
              <div className="bg-[#212121] rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl">
                {inqSubmitted ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                      <CheckCircle2 size={36} />
                    </div>
                    <h3 className="font-serif text-3xl font-bold text-white">
                      Thank You for Your Message!
                    </h3>
                    <p className="text-white/80 text-sm max-w-md mx-auto leading-relaxed">
                      We have received your inquiry and our manager will get back to you at <strong>{inqForm.email}</strong> promptly.
                    </p>
                    <button
                      onClick={() => setInqSubmitted(false)}
                      className="mt-6 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-bold text-white/90 uppercase tracking-wider mb-2">
                          Your Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={inqForm.name}
                          onChange={(e) => setInqForm({ ...inqForm, name: e.target.value })}
                          placeholder="Your full name"
                          className="w-full bg-[#141414] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-hidden focus:border-[#E5933A]"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-xs font-bold text-white/90 uppercase tracking-wider mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={inqForm.email}
                          onChange={(e) => setInqForm({ ...inqForm, email: e.target.value })}
                          placeholder="name@email.com"
                          className="w-full bg-[#141414] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-hidden focus:border-[#E5933A]"
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-xs font-bold text-white/90 uppercase tracking-wider mb-2">
                          Phone Number (Optional)
                        </label>
                        <input
                          type="tel"
                          value={inqForm.phone}
                          onChange={(e) => setInqForm({ ...inqForm, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full bg-[#141414] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-hidden focus:border-[#E5933A]"
                        />
                      </div>

                      {/* Subject */}
                      <div>
                        <label className="block text-xs font-bold text-white/90 uppercase tracking-wider mb-2">
                          Topic of Inquiry *
                        </label>
                        <select
                          value={inqForm.subject}
                          onChange={(e) => setInqForm({ ...inqForm, subject: e.target.value })}
                          className="w-full bg-[#141414] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-hidden focus:border-[#E5933A]"
                        >
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="Outdoor Catering & Weddings">Outdoor Catering & Weddings</option>
                          <option value="Corporate Bulk Meal Orders">Corporate Bulk Meal Orders</option>
                          <option value="Special Dietary Requirements">Special Dietary Requirements</option>
                          <option value="Guest Feedback & Praise">Guest Feedback & Praise</option>
                        </select>
                      </div>

                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-bold text-white/90 uppercase tracking-wider mb-2">
                        Your Message *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={inqForm.message}
                        onChange={(e) => setInqForm({ ...inqForm, message: e.target.value })}
                        placeholder="Tell us about your event, number of expected guests, or any questions you have..."
                        className="w-full bg-[#141414] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-hidden focus:border-[#E5933A]"
                      />
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#E5933A] hover:bg-[#D68128] text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        <span>SEND MESSAGE</span>
                        <span>➔</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 4: MAP & OPENING HOURS (Terracotta #A2442B)          */}
        {/* ============================================================ */}
        <section
          id="location-map"
          className="w-full bg-[#A2442B] text-white py-16 sm:py-24 relative overflow-hidden"
        >
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            
            {/* Top Sub-Section: Interactive Location Map Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Left Column: Location Info & Directions */}
              <div className="lg:col-span-5 space-y-4">
                <div>
                  <span
                    className="text-[#FDE68A] text-2xl sm:text-3xl font-serif italic block -mb-2"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    find our
                  </span>
                  <h2 className="font-serif text-5xl sm:text-6xl font-bold text-white tracking-tight leading-none">
                    Restaurant
                  </h2>
                </div>

                <p className="text-[#FDE68A] font-extrabold text-sm sm:text-base tracking-widest uppercase">
                  GAUR CITY 1 • GREATER NOIDA WEST
                </p>

                <p className="text-white text-xs sm:text-sm font-medium leading-relaxed max-w-md">
                  Raghav Rasoi is centrally located at 7th Avenue near Aarza Square - 2, Gaur City 1, Greater Noida West, offering convenient parking and easy access. We welcome you to experience authentic homestyle cooking!
                </p>

                <div className="space-y-2 pt-2 text-xs sm:text-sm text-white/90">
                  <div className="flex items-center gap-2.5">
                    <MapPin size={16} className="text-[#FDE68A] shrink-0" />
                    <span>7th Avenue, Near Aarza Square - 2, Gaur City 1, Greater Noida West, UP 201009</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone size={16} className="text-[#FDE68A] shrink-0" />
                    <span>+91 88396-75538</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock size={16} className="text-[#FDE68A] shrink-0" />
                    <span>Open all 7 days: 10:00 AM – 10:00 PM</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap gap-3">
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white text-slate-900 font-black text-xs uppercase tracking-wider shadow-xl hover:bg-[#FDE68A] transition-colors"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink size={14} />
                  </a>
                  <a
                    href="tel:+918839675538"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-white/80 bg-black/30 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/20 transition-colors"
                  >
                    <Phone size={13} />
                    <span>Call Now</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Embedded Stylized Map Card for Gaur City 1 */}
              <div className="lg:col-span-7">
                <div className="relative w-full h-[320px] sm:h-[400px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 bg-slate-900">
                  <iframe
                    title="Raghav Rasoi Google Map Location - Gaur City 1"
                    src="https://maps.google.com/maps?q=Gaur+City+1+Greater+Noida+West+Uttar+Pradesh&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: 'contrast(1.05) saturate(1.1)' }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  {/* Floating Action Pill over map */}
                  <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-black/85 backdrop-blur-md rounded-2xl p-3 border border-white/20 flex items-center justify-between sm:justify-start gap-3">
                    <div className="text-left">
                      <p className="text-[11px] font-bold text-[#FDE68A] uppercase tracking-wide">Raghav Rasoi</p>
                      <p className="text-[10px] text-white/80">Gaur City 1, Greater Noida West</p>
                    </div>
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs bg-[#E5933A] hover:bg-[#D68128] text-slate-950 font-black px-3 py-1.5 rounded-full inline-flex items-center gap-1 shrink-0"
                    >
                      <span>Directions</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Sub-Section: Open Every Day */}
            <div className="space-y-6 pt-4">
              <h3 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Open Every Day
              </h3>

              {/* Opening Hours Dark Charcoal Container */}
              <div className="rounded-2xl sm:rounded-3xl bg-[#141414] border border-white/10 px-6 sm:px-12 py-8 sm:py-10 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/15 gap-6 md:gap-0">
                  
                  {/* Column 1: MON-THU */}
                  <div className="text-center md:px-6">
                    <p className="text-[#FBBF24] font-extrabold text-xs sm:text-sm tracking-widest uppercase">
                      MON – THU
                    </p>
                    <p className="font-serif text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight mt-2">
                      10:00 AM – 10:00 PM
                    </p>
                  </div>

                  {/* Column 2: FRI-SUN */}
                  <div className="text-center md:px-6 pt-6 md:pt-0">
                    <p className="text-[#FBBF24] font-extrabold text-xs sm:text-sm tracking-widest uppercase">
                      FRI – SUN <span className="text-white/70 italic lowercase font-serif font-normal">(Today)</span>
                    </p>
                    <p className="font-serif text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight mt-2">
                      10:00 AM – 11:00 PM
                    </p>
                  </div>

                  {/* Column 3: LUNCH HOURS */}
                  <div className="text-center md:px-6 pt-6 md:pt-0">
                    <p className="text-[#FBBF24] font-extrabold text-xs sm:text-sm tracking-widest uppercase">
                      LUNCH HOURS
                    </p>
                    <p className="font-serif text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight mt-2">
                      12:00 PM – 04:00 PM
                    </p>
                  </div>

                </div>
              </div>
            </div>

          </div>

          {/* Bottom Torn Paper Transition to Footer */}
          <div className="relative z-10 w-full mt-14 sm:mt-20">
            <TornPaperDivider color="#FAF7F2" />
          </div>
        </section>

      </main>

      {/* Global Modals & Storefront Cart */}
      <ItemCustomizeModal />
      <StoreCartDrawer />
      <LiveTokenTrackerModal />
      <ScrollToTop />

      {/* Universal Foodly Footer */}
      <Footer />
    </div>
  );
}
