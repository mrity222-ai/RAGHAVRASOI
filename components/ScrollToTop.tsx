'use client';

import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black hover:bg-[#252525] text-white flex items-center justify-center shadow-lg transition-all transform hover:-translate-y-1 active:translate-y-0"
      aria-label="Scroll to top"
    >
      <ChevronUp size={20} strokeWidth={2.5} />
    </button>
  );
}
