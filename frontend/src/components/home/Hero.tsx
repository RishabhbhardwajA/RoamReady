'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Sparkles, Compass, CheckCircle2, Star } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-obsidian-950 to-slate-900 text-white pt-12 pb-20 md:py-24">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-amber-accent/10 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-obsidian-800/80 border border-slate-700/80 px-3.5 py-1.5 rounded-full text-xs font-semibold text-amber-accent shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE NEW STANDARD IN TRAVEL ACCESSORIES</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Zero Hassle. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-blue-300 to-amber-accent">
                Airport-Security Ready.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Engineered luggage accessories, zinc-alloy TSA combination locks, and modular compression packing systems built to survive heavy transit impacts and save 60% suitcase volume.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/products"
                className="w-full sm:w-auto bg-brand-600 hover:bg-brand-500 text-white font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-brand-500/25 transition-all flex items-center justify-center gap-2 text-sm md:text-base group"
              >
                <span>Shop All Essentials</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/kits"
                className="w-full sm:w-auto bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-white font-bold px-7 py-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <span>Explore Travel Kits</span>
                <span className="bg-amber-accent/20 text-amber-accent text-xs px-2 py-0.5 rounded-full">Save 25%</span>
              </Link>
            </div>

            {/* Micro social proof stats */}
            <div className="pt-8 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <div className="font-extrabold text-xl sm:text-2xl text-white">15,000+</div>
                <div className="text-xs text-slate-400">Flights Secured</div>
              </div>
              <div>
                <div className="font-extrabold text-xl sm:text-2xl text-amber-accent flex items-center justify-center lg:justify-start gap-1">
                  <span>4.9</span>
                  <Star className="w-4 h-4 fill-amber-accent text-amber-accent" />
                </div>
                <div className="text-xs text-slate-400">1,200+ Verified Reviews</div>
              </div>
              <div>
                <div className="font-extrabold text-xl sm:text-2xl text-white">100%</div>
                <div className="text-xs text-slate-400">TSA Airport Certified</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Graphic */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Card */}
              <div className="relative bg-gradient-to-tr from-slate-800/90 to-obsidian-900/90 border border-slate-700/80 rounded-3xl p-4 shadow-2xl backdrop-blur-md">
                <img
                  src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=900&auto=format&fit=crop&q=80"
                  alt="RoamReady Travel Gear Essentials"
                  className="w-full h-80 sm:h-96 object-cover rounded-2xl"
                />

                {/* Floating Feature Badge 1: TSA Certified */}
                <div className="absolute top-8 left-8 bg-obsidian-950/90 backdrop-blur-md border border-slate-700 p-3 rounded-2xl shadow-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-600/20 text-brand-400 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">TSA Master Compliant</div>
                    <div className="text-[10px] text-slate-400">Hassle-Free Airport Inspection</div>
                  </div>
                </div>

                {/* Floating Feature Badge 2: Space Saver */}
                <div className="absolute bottom-8 right-8 bg-obsidian-950/90 backdrop-blur-md border border-slate-700 p-3 rounded-2xl shadow-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-accent/20 text-amber-accent flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">60% Volume Saved</div>
                    <div className="text-[10px] text-slate-400">Dual-Zipper Compression</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
