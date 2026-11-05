'use client';

import React from 'react';
import { ShieldCheck, EyeOff, Sparkles, Scale, RefreshCw, Zap } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-slate-50 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-brand-600 font-extrabold text-xs uppercase tracking-widest">
            The RoamReady Difference
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">
            Engineered for Transit. Built to Last.
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Most luggage accessories break when dropped from 4 feet onto baggage carousels. Here is why frequent flyers trust RoamReady.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900">100% TSA Airport Certified</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Official TSA tumblers allow airport security personnel to inspect your baggage without clipping your locks or breaking your luggage zippers.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <EyeOff className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900">Privacy-First Baggage Tags</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Unlike generic tags that expose your phone number and home address to anyone at the carousel, our anodized aluminum sleeve conceals your sensitive data.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900">Heavy-Gauge Double Zippers</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our compression packing cubes feature reinforced SBS dual zippers and bar-tack stitching tested to withstand over 35 kg of cross-seam tension.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900">Cabin & Overhead Bin Compliant</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              All foldable duffels and packing cube dimensions strictly align with IATA cabin baggage limits for airlines including Indigo, Air India, Emirates, and British Airways.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900">Trolley Pass-Through Sleeve</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our 40L packable duffels slide effortlessly over your rolling suitcase handle so your secondary bag never slips off while you navigate terminals.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900">3-Year Free Replacement</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every lock, buckle, and compression seam is backed by our hassle-free 3-year replacement guarantee against transit defects.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
