'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Sparkles, Truck, ChevronRight } from 'lucide-react';

const announcements = [
  { text: 'FREE Air Express Shipping across India on all orders over ₹999', icon: Truck },
  { text: 'Use code WELCOME10 for 10% off your first travel essentials order', icon: Sparkles },
  { text: 'Airport Security Ready: Official 3 & 4-Dial TSA Locks with 3-Year Warranty', icon: ShieldCheck }
];

export const AnnouncementBar: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const current = announcements[currentIndex];
  const IconComponent = current.icon;

  return (
    <div className="bg-obsidian-950 text-slate-200 text-xs py-2 px-4 border-b border-slate-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1 flex items-center justify-center gap-2">
          <IconComponent className="w-3.5 h-3.5 text-amber-accent animate-pulse" />
          <span className="font-medium tracking-wide">{current.text}</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-slate-400">
          <Link href="/finder" className="hover:text-amber-accent transition-colors flex items-center gap-1 font-medium">
            Pack Finder <ChevronRight className="w-3 h-3" />
          </Link>
          <span className="text-slate-700">|</span>
          <Link href="/account/orders" className="hover:text-white transition-colors">
            Track Order
          </Link>
        </div>
      </div>
    </div>
  );
};

