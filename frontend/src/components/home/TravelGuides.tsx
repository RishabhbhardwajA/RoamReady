'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, ArrowRight, Clock } from 'lucide-react';

const guides = [
  {
    title: 'The Ultimate TSA Lock Guide: Why Screeners Clip Non-TSA Locks',
    category: 'Airport Security',
    readTime: '4 min read',
    snippet: 'Learn why the US Transportation Security Administration and European authorities require TSA007/TSA002 master-keyed locks and how to prevent cut locks.',
    image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80',
    link: '/products?category=tsa-locks'
  },
  {
    title: 'How Compression Packing Cubes Save Up to 60% Suitcase Volume',
    category: 'Packing Science',
    readTime: '5 min read',
    snippet: 'Double-zipper compression physics: How expelling trapped air between fabric layers allows 10 days of clothing into an IATA-compliant 22-inch cabin bag.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    link: '/products?category=packing-cubes'
  },
  {
    title: 'Why Cross-Pattern Baggage Straps Prevent Carousel Spill Disasters',
    category: 'Luggage Protection',
    readTime: '3 min read',
    snippet: 'When luggage falls 4 feet onto high-speed conveyor systems, zipper tracks burst. An X-pattern heavy-duty POM buckle strap absorbs 90% of dynamic shock.',
    image: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=600&auto=format&fit=crop&q=80',
    link: '/products?category=baggage-straps'
  }
];

export const TravelGuides: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-brand-600 font-extrabold text-xs uppercase tracking-widest mb-1">
              <BookOpen className="w-4 h-4" />
              <span>Travel Knowledge & Guides</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900">
              Smart Travel & Packing Guides
            </h2>
          </div>
          <Link
            href="/products"
            className="mt-4 md:mt-0 text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
          >
            <span>Explore All Gear Guides</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {guides.map((g, idx) => (
            <article
              key={idx}
              className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={g.image}
                    alt={g.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-obsidian-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {g.category}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{g.readTime}</span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 hover:text-brand-600 transition-colors line-clamp-2">
                    {g.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                    {g.snippet}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2">
                <Link
                  href={g.link}
                  className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
                >
                  <span>Explore recommended gear</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
