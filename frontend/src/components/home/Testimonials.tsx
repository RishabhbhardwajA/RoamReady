'use client';

import React from 'react';
import { Star, ShieldCheck, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Vikramaditya S.',
    role: 'Frequent Business Traveler',
    city: 'Bengaluru',
    rating: 5,
    title: 'Surviving Heathrow & JFK without a scratch',
    quote: 'The 4-digit TSA lock tumblers click with real precision. Airport security in London inspected my bag using their master key without breaking the lock. This is real travel engineering.',
    productName: 'AeroLock Pro 4-Digit TSA Lock'
  },
  {
    name: 'Rohan Deshmukh',
    role: 'Backpacker & Photographer',
    city: 'Pune',
    rating: 5,
    title: 'Fitted 10 days of winter clothes into a cabin bag',
    quote: 'The dual compression zippers are phenomenal. Usually zippers break when you pull hard, but these heavy-gauge SBS zippers glide easily under high tension. Saved me check-in fees!',
    productName: 'CompressPack Elite 6-Piece Set'
  },
  {
    name: 'Pooja Nair',
    role: 'Family Holiday Traveler',
    city: 'Kochi',
    rating: 5,
    title: 'Solves the privacy issue on luggage tags',
    quote: 'I hate having my mobile number and address exposed to hundreds of strangers at Delhi airport conveyor belts. The sliding aluminum shield is pure genius.',
    productName: 'PrivacyShield Aluminum Luggage Tag'
  }
];

export const Testimonials: React.FC = () => {
  return (
    <section className="py-16 md:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-brand-600 font-extrabold text-xs uppercase tracking-widest">
            Verified Customer Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">
            Trusted by Flyers Across 40+ Countries
          </h2>
          <p className="text-sm text-slate-500 mt-2 font-light">
            Real feedback from domestic commuters, international vacationers, and corporate consultants.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="glass-card rounded-4xl p-7 sm:p-8 flex flex-col justify-between border border-white/80 shadow-glass hover:shadow-glass-hover bg-white/75 backdrop-blur-xl"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-500">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-100/80 flex items-center justify-center">
                    <Quote className="w-4 h-4 text-slate-400" />
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{t.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mt-2 italic font-light">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/50 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1">
                    <span>{t.name}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {t.role} &bull; {t.city}
                  </div>
                </div>
                <span className="text-[10px] text-brand-700 bg-white/80 backdrop-blur-md border border-brand-200/60 font-bold px-3 py-1 rounded-full text-right max-w-[130px] truncate shadow-xs">
                  {t.productName}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

