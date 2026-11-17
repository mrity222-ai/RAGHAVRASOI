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
  Calendar, 
  Users, 
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

/* Realistic Torn Paper Edge Separator (Matching About Us) */
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
    time: '18:00',
    guests: '2',
    notes: '',
  });
  const [resSubmitted, setResSubmitted] = useState(false);

  // Inquiry form state
  const [inqForm, setInqForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Allmän Fråga',
    message: '',
  });
  const [inqSubmitted, setInqSubmitted] = useState(false);

  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resForm.name || !resForm.phone || !resForm.date) {
      alert('Vänligen fyll i namn, telefon och datum.');
      return;
    }
    setResSubmitted(true);
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inqForm.name || !inqForm.email || !inqForm.message) {
      alert('Vänligen fyll i namn, e-post och meddelande.');
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
        {/* SECTION 1: HERO - "kontakta oss" (Matching About Us Hero)   */}
        {/* ============================================================ */}
        <section className="relative w-full min-h-[580px] sm:min-h-[660px] lg:min-h-[720px] bg-black text-white flex flex-col justify-between overflow-hidden">
          {/* Moody Authentic Indian Restaurant Ambience Background */}
          <Image
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=85"
            alt="Masala Haveli Welcoming Dining Ambiance"
            fill
            priority
            className="object-cover object-center filter brightness-[0.65] contrast-[1.1]"
          />

          {/* Deep Warm Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/45 to-black/90" />

          {/* Top Brand Logo / Tag */}
          <div className="relative z-10 pt-10 sm:pt-14 text-center">
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.35em] text-[#E0CEB5] uppercase block">
              MASALA HAVELI
            </span>
          </div>

          {/* Center Main Headline Box */}
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center my-auto flex flex-col items-center">
            
            {/* "kontakta" in yellow cursive script font */}
            <span
              className="text-[#FBBF24] text-3xl sm:text-5xl lg:text-6xl font-serif italic tracking-wide -mb-3 sm:-mb-5 select-none drop-shadow-md"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              kontakta
            </span>

            {/* "oss" in large crisp white serif */}
            <h1 className="font-serif text-6xl sm:text-8xl lg:text-[110px] font-bold text-white tracking-tight leading-none drop-shadow-2xl">
              oss
            </h1>

            {/* Subtitle */}
            <p className="text-white/90 text-xs sm:text-sm lg:text-base font-normal max-w-lg mx-auto mt-4 sm:mt-6 leading-relaxed drop-shadow">
              Vi ser fram emot att välkomna dig till Masala Haveli. Boka bord, ställ en fråga eller beställ catering för ditt speciella tillfälle.
            </p>

            {/* 3 Circular Buttons in a Row (Matching About Us) */}
            <div className="pt-8 sm:pt-10 flex items-center justify-center gap-4 sm:gap-6 relative">
              
              {/* 1. RING OSS (Amber Solid Circle) */}
              <a
                href="tel:+4613123456"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#E5933A] hover:bg-[#D68128] text-slate-950 font-black text-[11px] sm:text-xs tracking-wider flex items-center justify-center text-center uppercase leading-tight shadow-2xl hover:scale-105 active:scale-95 transition-all"
              >
                RING<br />OSS
              </a>

              {/* 2. HITTA HIT (Outline Circle) */}
              <a
                href="#location-map"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-white/80 bg-black/40 backdrop-blur-sm hover:bg-white/20 text-white font-black text-[11px] sm:text-xs tracking-wider flex items-center justify-center text-center uppercase leading-tight shadow-2xl hover:scale-105 active:scale-95 transition-all"
              >
                HITTA<br />HIT
              </a>

              {/* 3. BOKA BORD (Rust Red Solid Circle) with Handwritten Doodle */}
              <div className="relative">
                <a
                  href="#reservation-form"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#9E4029] hover:bg-[#873420] text-white font-black text-[11px] sm:text-xs tracking-wider flex items-center justify-center text-center uppercase leading-tight shadow-2xl hover:scale-105 active:scale-95 transition-all"
                >
                  BOKA<br />BORD
                </a>

                {/* Hand-drawn yellow doodle arrow with "boka här" */}
                <div className="absolute -top-6 -right-16 sm:-right-20 hidden sm:flex items-center gap-1 text-[#FBBF24] font-serif italic text-sm pointer-events-none select-none">
                  <span className="text-base">⤶</span>
                  <span>boka här</span>
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
                    Hör av dig till oss
                  </h2>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-xl font-normal">
                  På Masala Haveli sätter vi alltid gästen i centrum. Oavsett om du vill boka ett bord för kvällen, planera en stor familjemiddag eller boka catering med autentiska indiska smaker finns vi här för dig.
                </p>

                {/* 4 Rich Contact Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  
                  {/* Card 1: Besöksadress */}
                  <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-4 border border-[#E9DEC9] shadow-xs flex items-start gap-3.5 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-xl bg-[#9E4029]/10 text-[#9E4029] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Besöksadress
                      </h4>
                      <p className="text-xs text-slate-700 font-medium mt-1 leading-snug">
                        Ågatan 41, 582 22 Linköping
                      </p>
                      <a
                        href="#location-map"
                        className="text-[11px] text-[#A24A32] font-bold hover:underline inline-flex items-center gap-1 mt-1.5"
                      >
                        <span>Se på karta</span>
                        <ArrowRight size={11} />
                      </a>
                    </div>
                  </div>

                  {/* Card 2: Telefon */}
                  <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-4 border border-[#E9DEC9] shadow-xs flex items-start gap-3.5 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-xl bg-[#E5933A]/15 text-[#D68128] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Phone size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Telefon
                      </h4>
                      <p className="text-xs text-slate-700 font-medium mt-1 leading-snug">
                        013-12 34 56
                      </p>
                      <a
                        href="tel:+4613123456"
                        className="text-[11px] text-[#A24A32] font-bold hover:underline inline-flex items-center gap-1 mt-1.5"
                      >
                        <span>Ring direkt</span>
                        <ArrowRight size={11} />
                      </a>
                    </div>
                  </div>

                  {/* Card 3: E-post */}
                  <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-4 border border-[#E9DEC9] shadow-xs flex items-start gap-3.5 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-xl bg-slate-900/10 text-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        E-post
                      </h4>
                      <p className="text-xs text-slate-700 font-medium mt-1 leading-snug">
                        info@masalahaveli.se
                      </p>
                      <a
                        href="mailto:info@masalahaveli.se"
                        className="text-[11px] text-[#A24A32] font-bold hover:underline inline-flex items-center gap-1 mt-1.5"
                      >
                        <span>Skicka e-post</span>
                        <ArrowRight size={11} />
                      </a>
                    </div>
                  </div>

                  {/* Card 4: Catering & Event */}
                  <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-4 border border-[#E9DEC9] shadow-xs flex items-start gap-3.5 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-xl bg-[#9E4029]/10 text-[#9E4029] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <UtensilsCrossed size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Catering & Fester
                      </h4>
                      <p className="text-xs text-slate-700 font-medium mt-1 leading-snug">
                        catering@masalahaveli.se
                      </p>
                      <button
                        onClick={() => {
                          setActiveTab('inquiry');
                          const el = document.getElementById('reservation-form');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="text-[11px] text-[#A24A32] font-bold hover:underline inline-flex items-center gap-1 mt-1.5 text-left"
                      >
                        <span>Gör förfrågan</span>
                        <ArrowRight size={11} />
                      </button>
                    </div>
                  </div>

                </div>

                {/* 6 Feature Badges with Terracotta Dots (Matching About Us) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2.5 pt-3 text-[11px] sm:text-xs font-black tracking-wider text-slate-900 uppercase">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#A24A32]" />
                    <span>BORDSBOKNING</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#A24A32]" />
                    <span>CATERING</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#A24A32]" />
                    <span>TAKE AWAY</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#A24A32]" />
                    <span>FÖRETAGSEVENT</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#A24A32]" />
                    <span>ALLERGIANPASSAT</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#A24A32]" />
                    <span>SNABB SERVICE</span>
                  </div>
                </div>

              </div>

              {/* Right Column: Copper Handi Dish with Gold Stamp Badge */}
              <div className="lg:col-span-5 relative flex items-center justify-center">
                <div className="relative w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] rounded-full overflow-hidden shadow-2xl border-4 border-white/60">
                  <Image
                    src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=85"
                    alt="Authentic Dining Table Setup at Masala Haveli"
                    fill
                    className="object-cover object-center"
                  />
                </div>

                {/* Yellow Stamp Badge (Matching About Us) */}
                <div className="absolute -bottom-4 left-4 sm:left-8 bg-[#E5933A] text-slate-950 w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center text-center shadow-xl p-2 select-none border-2 border-white/40">
                  <span className="text-amber-950 text-xs sm:text-sm font-black tracking-widest">
                    ★★★★★
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider leading-tight mt-1">
                    100% GÄSTNÖJDHET
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
                skicka ett
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
                Meddelande & Bordsbokning
              </h2>
              <div className="flex items-center justify-center gap-2 text-[#FBBF24] font-serif italic text-sm mt-3 select-none">
                <span>vi svarar snabbt inom 2 timmar ⤳</span>
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
                  Bordsbokning
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
                  Allmän Fråga / Catering
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
                      Tack för din bordsbokning!
                    </h3>
                    <p className="text-white/80 text-sm max-w-md mx-auto leading-relaxed">
                      Vi har tagit emot din bokningsförfrågan för <strong>{resForm.guests} personer</strong> den <strong>{resForm.date} kl. {resForm.time}</strong>. Vi skickar en bekräftelse via SMS/telefon inom kort.
                    </p>
                    <button
                      onClick={() => setResSubmitted(false)}
                      className="mt-6 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider"
                    >
                      Boka ytterligare ett bord
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleReservationSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-bold text-white/90 uppercase tracking-wider mb-2">
                          Ditt Namn *
                        </label>
                        <input
                          type="text"
                          required
                          value={resForm.name}
                          onChange={(e) => setResForm({ ...resForm, name: e.target.value })}
                          placeholder="T.ex. Johan Andersson"
                          className="w-full bg-[#141414] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-hidden focus:border-[#E5933A]"
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-xs font-bold text-white/90 uppercase tracking-wider mb-2">
                          Telefonnummer *
                        </label>
                        <input
                          type="tel"
                          required
                          value={resForm.phone}
                          onChange={(e) => setResForm({ ...resForm, phone: e.target.value })}
                          placeholder="070-123 45 67"
                          className="w-full bg-[#141414] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-hidden focus:border-[#E5933A]"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-xs font-bold text-white/90 uppercase tracking-wider mb-2">
                          E-postadress
                        </label>
                        <input
                          type="email"
                          value={resForm.email}
                          onChange={(e) => setResForm({ ...resForm, email: e.target.value })}
                          placeholder="namn@epost.se"
                          className="w-full bg-[#141414] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-hidden focus:border-[#E5933A]"
                        />
                      </div>

                      {/* Date */}
                      <div>
                        <label className="block text-xs font-bold text-white/90 uppercase tracking-wider mb-2">
                          Datum *
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
                          Tid *
                        </label>
                        <select
                          value={resForm.time}
                          onChange={(e) => setResForm({ ...resForm, time: e.target.value })}
                          className="w-full bg-[#141414] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-hidden focus:border-[#E5933A]"
                        >
                          <option value="11:30">11:30 (Lunch)</option>
                          <option value="12:00">12:00 (Lunch)</option>
                          <option value="12:30">12:30 (Lunch)</option>
                          <option value="13:00">13:00 (Lunch)</option>
                          <option value="17:00">17:00 (Middag)</option>
                          <option value="17:30">17:30 (Middag)</option>
                          <option value="18:00">18:00 (Middag)</option>
                          <option value="18:30">18:30 (Middag)</option>
                          <option value="19:00">19:00 (Middag)</option>
                          <option value="19:30">19:30 (Middag)</option>
                          <option value="20:00">20:00 (Middag)</option>
                          <option value="20:30">20:30 (Middag)</option>
                        </select>
                      </div>

                      {/* Guests */}
                      <div>
                        <label className="block text-xs font-bold text-white/90 uppercase tracking-wider mb-2">
                          Antal Personer *
                        </label>
                        <select
                          value={resForm.guests}
                          onChange={(e) => setResForm({ ...resForm, guests: e.target.value })}
                          className="w-full bg-[#141414] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-hidden focus:border-[#E5933A]"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, '12+ Större sällskap'].map((num) => (
                            <option key={num} value={num}>
                              {num} {typeof num === 'number' && num > 1 ? 'personer' : 'person'}
                            </option>
                          ))}
                        </select>
                      </div>

                    </div>

                    {/* Notes / Special Requests */}
                    <div>
                      <label className="block text-xs font-bold text-white/90 uppercase tracking-wider mb-2">
                        Speciella önskemål (Allergier, barnstol, firande)
                      </label>
                      <textarea
                        rows={3}
                        value={resForm.notes}
                        onChange={(e) => setResForm({ ...resForm, notes: e.target.value })}
                        placeholder="Berätta gärna om någon i sällskapet har allergier, önskar veganskt eller om ni firar födelsedag..."
                        className="w-full bg-[#141414] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-hidden focus:border-[#E5933A]"
                      />
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <p className="text-white/50 text-xs">
                        * Bordsbokningen är preliminär tills du fått bekräftelse via telefon eller SMS.
                      </p>
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#E5933A] hover:bg-[#D68128] text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        <span>SKICKA BORDSBOKNING</span>
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
                      Tack för ditt meddelande!
                    </h3>
                    <p className="text-white/80 text-sm max-w-md mx-auto leading-relaxed">
                      Vi har tagit emot ditt meddelande och återkommer till dig på <strong>{inqForm.email}</strong> så snart som möjligt.
                    </p>
                    <button
                      onClick={() => setInqSubmitted(false)}
                      className="mt-6 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider"
                    >
                      Skicka ett nytt meddelande
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-bold text-white/90 uppercase tracking-wider mb-2">
                          Ditt Namn *
                        </label>
                        <input
                          type="text"
                          required
                          value={inqForm.name}
                          onChange={(e) => setInqForm({ ...inqForm, name: e.target.value })}
                          placeholder="Förnamn och efternamn"
                          className="w-full bg-[#141414] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-hidden focus:border-[#E5933A]"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-xs font-bold text-white/90 uppercase tracking-wider mb-2">
                          E-postadress *
                        </label>
                        <input
                          type="email"
                          required
                          value={inqForm.email}
                          onChange={(e) => setInqForm({ ...inqForm, email: e.target.value })}
                          placeholder="namn@epost.se"
                          className="w-full bg-[#141414] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-hidden focus:border-[#E5933A]"
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-xs font-bold text-white/90 uppercase tracking-wider mb-2">
                          Telefonnummer (Valfritt)
                        </label>
                        <input
                          type="tel"
                          value={inqForm.phone}
                          onChange={(e) => setInqForm({ ...inqForm, phone: e.target.value })}
                          placeholder="070-123 45 67"
                          className="w-full bg-[#141414] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-hidden focus:border-[#E5933A]"
                        />
                      </div>

                      {/* Subject */}
                      <div>
                        <label className="block text-xs font-bold text-white/90 uppercase tracking-wider mb-2">
                          Vad gäller ärendet? *
                        </label>
                        <select
                          value={inqForm.subject}
                          onChange={(e) => setInqForm({ ...inqForm, subject: e.target.value })}
                          className="w-full bg-[#141414] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-hidden focus:border-[#E5933A]"
                        >
                          <option value="Allmän Fråga">Allmän Fråga</option>
                          <option value="Catering & Bröllop">Catering & Bröllop</option>
                          <option value="Företagsevent">Företagsevent & Gruppbokning</option>
                          <option value="Allergier & Specialkost">Allergier & Specialkost</option>
                          <option value="Feedback & Beröm">Feedback & Synpunkter</option>
                        </select>
                      </div>

                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-bold text-white/90 uppercase tracking-wider mb-2">
                        Ditt Meddelande *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={inqForm.message}
                        onChange={(e) => setInqForm({ ...inqForm, message: e.target.value })}
                        placeholder="Skriv dina frågor eller information om ditt planerade event här..."
                        className="w-full bg-[#141414] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-hidden focus:border-[#E5933A]"
                      />
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#E5933A] hover:bg-[#D68128] text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        <span>SKICKA MEDDELANDE</span>
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
                    hitta till
                  </span>
                  <h2 className="font-serif text-5xl sm:text-6xl font-bold text-white tracking-tight leading-none">
                    Haveli
                  </h2>
                </div>

                <p className="text-[#FDE68A] font-extrabold text-sm sm:text-base tracking-widest uppercase">
                  MITT PÅ ÅGATAN I LINKÖPING
                </p>

                <p className="text-white text-xs sm:text-sm font-medium leading-relaxed max-w-md">
                  Masala Haveli ligger centralt på Ågatan med bekväm tillgång till kollektivtrafik och närliggande parkeringshus. Varmt välkommen in på en smakresa!
                </p>

                <div className="space-y-2 pt-2 text-xs sm:text-sm text-white/90">
                  <div className="flex items-center gap-2.5">
                    <MapPin size={16} className="text-[#FDE68A]" />
                    <span>Ågatan 41, 582 22 Linköping</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock size={16} className="text-[#FDE68A]" />
                    <span>Öppet alla dagar i veckan</span>
                  </div>
                </div>

                <div className="pt-4">
                  <a
                    href="https://maps.google.com/?q=Ågatan+41,+582+22+Linköping"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white text-slate-900 font-black text-xs uppercase tracking-wider shadow-xl hover:bg-[#FDE68A] transition-colors"
                  >
                    <span>Öppna i Google Maps</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>

              {/* Right Column: Embedded Stylized Map Card */}
              <div className="lg:col-span-7">
                <div className="relative w-full h-[320px] sm:h-[400px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 bg-slate-900">
                  <iframe
                    title="Masala Haveli Location Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2091.2462828693245!2d15.621256777328127!3d58.41088497428807!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46596e382098d63d%3A0xb35a519894e33917!2s%C3%85gatan%2041%2C%20582%2022%20Link%C3%B6ping%2C%20Sweden!5e0!3m2!1sen!2sse!4v1715000000000!5m2!1sen!2sse"
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: 'contrast(1.05) saturate(1.1)' }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>

            </div>

            {/* Bottom Sub-Section: Öppet varje dag (Matching About Us 100%) */}
            <div className="space-y-6 pt-4">
              <h3 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Öppet varje dag
              </h3>

              {/* Opening Hours Dark Charcoal Container */}
              <div className="rounded-2xl sm:rounded-3xl bg-[#141414] border border-white/10 px-6 sm:px-12 py-8 sm:py-10 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/15 gap-6 md:gap-0">
                  
                  {/* Column 1: SÖN-TORS */}
                  <div className="text-center md:px-6">
                    <p className="text-[#FBBF24] font-extrabold text-xs sm:text-sm tracking-widest uppercase">
                      SÖN-TORS
                    </p>
                    <p className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mt-2">
                      11.30-21.00
                    </p>
                  </div>

                  {/* Column 2: FRE-LÖR i dag */}
                  <div className="text-center md:px-6 pt-6 md:pt-0">
                    <p className="text-[#FBBF24] font-extrabold text-xs sm:text-sm tracking-widest uppercase">
                      FRE-LÖR <span className="text-white/70 italic lowercase font-serif font-normal">i dag</span>
                    </p>
                    <p className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mt-2">
                      11.30-22.00
                    </p>
                  </div>

                  {/* Column 3: LUNCH MÅN-FRE */}
                  <div className="text-center md:px-6 pt-6 md:pt-0">
                    <p className="text-[#FBBF24] font-extrabold text-xs sm:text-sm tracking-widest uppercase">
                      LUNCH MÅN-FRE
                    </p>
                    <p className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mt-2">
                      11.30-14.00
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
