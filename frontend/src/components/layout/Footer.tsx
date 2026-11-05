'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Compass, ShieldCheck, Truck, RefreshCw, Mail, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-obsidian-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      {/* Trust Badges Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-slate-800/80 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center gap-2 p-5 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-sm hover:border-white/20 transition-all">
            <ShieldCheck className="w-8 h-8 text-amber-accent" />
            <span className="font-bold text-white text-sm">TSA Certified Gear</span>
            <span className="text-xs text-slate-400">Accepted by airport screeners worldwide</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-5 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-sm hover:border-white/20 transition-all">
            <Truck className="w-8 h-8 text-brand-400" />
            <span className="font-bold text-white text-sm">PAN-India Air Express</span>
            <span className="text-xs text-slate-400">Fast dispatch via BlueDart & Delhivery</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-5 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-sm hover:border-white/20 transition-all">
            <RefreshCw className="w-8 h-8 text-emerald-400" />
            <span className="font-bold text-white text-sm">3-Year Guarantee</span>
            <span className="text-xs text-slate-400">Zero zipper bursts & lock replacement</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-5 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-sm hover:border-white/20 transition-all">
            <Compass className="w-8 h-8 text-sky-400" />
            <span className="font-bold text-white text-sm">Travel Tested</span>
            <span className="text-xs text-slate-400">Engineered by frequent international flyers</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
        {/* Brand Column */}
        <div className="md:col-span-2 space-y-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-obsidian-800 border border-slate-700 flex items-center justify-center text-amber-accent">
              <Compass className="w-5 h-5 text-amber-accent" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              ROAM<span className="text-brand-500">READY</span>
            </span>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            RoamReady is India&apos;s specialized travel gear essentials brand. We build ultra-durable TSA combination locks, privacy luggage tags, compression cubes, and packable duffel bags engineered to survive airport baggage carousels.
          </p>
          <div className="pt-2 text-xs text-slate-500">
            Fulfillment Hub: Indiranagar 100ft Road, Bengaluru, Karnataka 560038
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Travel Essentials</h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li><Link href="/products?category=tsa-locks" className="hover:text-white transition-colors">TSA Combination Locks</Link></li>
            <li><Link href="/products?category=packing-cubes" className="hover:text-white transition-colors">Compression Packing Cubes</Link></li>
            <li><Link href="/products?category=foldable-duffels" className="hover:text-white transition-colors">Foldable Nylon Duffels</Link></li>
            <li><Link href="/products?category=baggage-straps" className="hover:text-white transition-colors">Heavy-Duty Baggage Straps</Link></li>
            <li><Link href="/products?category=luggage-tags" className="hover:text-white transition-colors">Privacy Aluminum Tags</Link></li>
            <li><Link href="/kits" className="hover:text-amber-accent transition-colors font-semibold">Ready-to-Fly Bundles</Link></li>
          </ul>
        </div>

        {/* Discovery & Guides */}
        <div>
          <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Smart Shopping</h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li><Link href="/finder" className="hover:text-white transition-colors">Smart Pack Finder</Link></li>
            <li><Link href="/compare" className="hover:text-white transition-colors">Gear Comparison Tool</Link></li>
            <li><Link href="/account/orders" className="hover:text-white transition-colors">Track BlueDart Order</Link></li>
            <li><Link href="/account" className="hover:text-white transition-colors">Manage Addresses</Link></li>
            <li><Link href="/admin" className="hover:text-amber-accent transition-colors">Store Admin Portal</Link></li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Traveler Club</h4>
          <p className="text-xs text-slate-400 mb-3">
            Join 25,000+ flyers. Get 10% off your first gear order and pack tips.
          </p>
          {subscribed ? (
            <div className="bg-emerald-950/60 border border-emerald-800 p-3 rounded-xl flex items-center gap-2 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Use code <strong className="text-white">WELCOME10</strong> at checkout!</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-obsidian-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Join
                </button>
              </div>
              <span className="text-[10px] text-slate-500 block">We respect your inbox. Zero spam.</span>
            </form>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          &copy; {new Date().getFullYear()} RoamReady Technologies Pvt. Ltd. All rights reserved.
        </div>
        <div className="flex gap-6">
          <Link href="/products" className="hover:text-slate-300">Privacy Policy</Link>
          <Link href="/products" className="hover:text-slate-300">Terms of Service</Link>
          <Link href="/products" className="hover:text-slate-300">Shipping & Return Rules</Link>
        </div>
      </div>
    </footer>
  );
};

