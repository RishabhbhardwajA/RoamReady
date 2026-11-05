'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Plane,
  Briefcase,
  Users,
  Backpack,
  ArrowRight,
  CheckCircle2,
  ShoppingBag,
  RefreshCw
} from 'lucide-react';
import { apiClient, formatINR } from '@/lib/api';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

export default function FinderPage() {
  const { addItem } = useCart();
  const [step, setStep] = useState(1);
  const [tripDuration, setTripDuration] = useState('weekend');
  const [travelStyle, setTravelStyle] = useState('leisure');
  const [baggageType, setBaggageType] = useState('cabin');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const res = await apiClient.post('/products/finder', {
        tripDuration,
        travelStyle,
        baggageType
      });
      if (res.data.success) {
        setResult(res.data.data);
        setStep(4);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => {
    setStep(1);
    setResult(null);
  };

  return (
    <div className="min-h-screen py-10 sm:py-16 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 bg-brand-100/80 backdrop-blur-md border border-brand-200/60 text-brand-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Pack Finder</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            Find Your Ideal Travel Gear Setup
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 font-light">
            Answer 3 quick questions about your upcoming trip to get an airport-ready accessory recommendation.
          </p>
        </div>

        {/* Quiz Container Card (Curvy Glass Panel) */}
        <div className="glass-panel rounded-4xl p-6 sm:p-10 border border-white/80 shadow-glass bg-white/80 backdrop-blur-xl">
          {/* Progress Indicators */}
          {step <= 3 && (
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200/50 text-xs">
              <span className="font-bold text-slate-400">Step {step} of 3</span>
              <div className="flex gap-2">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`h-2 rounded-full transition-all ${
                      s === step ? 'w-8 bg-brand-600' : s < step ? 'w-4 bg-emerald-500' : 'w-4 bg-slate-200/80'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* STEP 1: Trip Duration */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                1. How long is your upcoming journey?
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setTripDuration('weekend')}
                  className={`p-5 rounded-3xl border text-left transition-all ${
                    tripDuration === 'weekend'
                      ? 'border-brand-600 bg-brand-50/80 ring-2 ring-brand-500'
                      : 'border-slate-200/80 bg-white/70 hover:bg-white'
                  }`}
                >
                  <div className="text-2xl mb-2">⚡</div>
                  <div className="font-bold text-sm text-slate-900">Weekend Getaway</div>
                  <div className="text-xs text-slate-500 mt-1">1 to 3 Days</div>
                </button>
                <button
                  type="button"
                  onClick={() => setTripDuration('vacation')}
                  className={`p-5 rounded-3xl border text-left transition-all ${
                    tripDuration === 'vacation'
                      ? 'border-brand-600 bg-brand-50/80 ring-2 ring-brand-500'
                      : 'border-slate-200/80 bg-white/70 hover:bg-white'
                  }`}
                >
                  <div className="text-2xl mb-2">🏖️</div>
                  <div className="font-bold text-sm text-slate-900">Standard Vacation</div>
                  <div className="text-xs text-slate-500 mt-1">4 to 7 Days</div>
                </button>
                <button
                  type="button"
                  onClick={() => setTripDuration('international')}
                  className={`p-5 rounded-3xl border text-left transition-all ${
                    tripDuration === 'international'
                      ? 'border-brand-600 bg-brand-50/80 ring-2 ring-brand-500'
                      : 'border-slate-200/80 bg-white/70 hover:bg-white'
                  }`}
                >
                  <div className="text-2xl mb-2">✈️</div>
                  <div className="font-bold text-sm text-slate-900">Long Holiday / Flight</div>
                  <div className="text-xs text-slate-500 mt-1">8+ Days International</div>
                </button>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs px-7 py-3.5 rounded-full flex items-center gap-2 shadow-md transition-all active:scale-95 border border-white/20"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Travel Style */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                2. What is your primary travel mode?
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setTravelStyle('business')}
                  className={`p-5 rounded-2xl border text-left transition-all ${
                    travelStyle === 'business'
                      ? 'border-brand-600 bg-brand-50/60 ring-2 ring-brand-500'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Briefcase className="w-6 h-6 text-brand-600 mb-2" />
                  <div className="font-bold text-sm text-slate-900">Corporate & Business</div>
                  <div className="text-xs text-slate-500 mt-1">Need fast airport security & wrinkle-free suits</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTravelStyle('backpacking')}
                  className={`p-5 rounded-2xl border text-left transition-all ${
                    travelStyle === 'backpacking'
                      ? 'border-brand-600 bg-brand-50/60 ring-2 ring-brand-500'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Backpack className="w-6 h-6 text-emerald-600 mb-2" />
                  <div className="font-bold text-sm text-slate-900">Solo / Backpacker</div>
                  <div className="text-xs text-slate-500 mt-1">Maximum volume compression & ultralight gear</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTravelStyle('family')}
                  className={`p-5 rounded-2xl border text-left transition-all ${
                    travelStyle === 'family'
                      ? 'border-brand-600 bg-brand-50/60 ring-2 ring-brand-500'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Users className="w-6 h-6 text-amber-600 mb-2" />
                  <div className="font-bold text-sm text-slate-900">Family Holiday</div>
                  <div className="text-xs text-slate-500 mt-1">Multiple suitcases, privacy tags & straps</div>
                </button>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 px-4 py-2"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl flex items-center gap-2 transition-colors shadow-sm"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Baggage Type */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                3. What kind of luggage will you be using?
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setBaggageType('cabin')}
                  className={`p-5 rounded-2xl border text-left transition-all ${
                    baggageType === 'cabin'
                      ? 'border-brand-600 bg-brand-50/60 ring-2 ring-brand-500'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-2xl mb-2">🧳</div>
                  <div className="font-bold text-sm text-slate-900">Cabin Trolley Only</div>
                  <div className="text-xs text-slate-500 mt-1">20-22 inch bag to skip baggage claim</div>
                </button>

                <button
                  type="button"
                  onClick={() => setBaggageType('checkin')}
                  className={`p-5 rounded-2xl border text-left transition-all ${
                    baggageType === 'checkin'
                      ? 'border-brand-600 bg-brand-50/60 ring-2 ring-brand-500'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-2xl mb-2">📦</div>
                  <div className="font-bold text-sm text-slate-900">Large Check-in Baggage</div>
                  <div className="text-xs text-slate-500 mt-1">24-30 inch suitcases going into cargo hold</div>
                </button>

                <button
                  type="button"
                  onClick={() => setBaggageType('duffel')}
                  className={`p-5 rounded-2xl border text-left transition-all ${
                    baggageType === 'duffel'
                      ? 'border-brand-600 bg-brand-50/60 ring-2 ring-brand-500'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-2xl mb-2">🎒</div>
                  <div className="font-bold text-sm text-slate-900">Duffel / Weekender</div>
                  <div className="text-xs text-slate-500 mt-1">Flexible soft-shell bag</div>
                </button>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 px-4 py-2"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleCalculate}
                  disabled={loading}
                  className="bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl flex items-center gap-2 transition-colors shadow-md"
                >
                  {loading ? (
                    <span>Analyzing luggage requirements...</span>
                  ) : (
                    <>
                      <span>Generate Recommendations</span>
                      <Sparkles className="w-4 h-4 text-amber-accent" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* RESULTS: Recommendations */}
          {step === 4 && result && (
            <div className="space-y-8 animate-in zoom-in-95 duration-400">
              <div className="text-center p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <div className="inline-flex items-center gap-1.5 text-emerald-800 font-extrabold text-xs uppercase tracking-wider mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Curated Travel Match</span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                  Here is your tailored gear setup
                </h3>
                <p className="text-xs text-slate-600 mt-1">{result.packingTip}</p>
              </div>

              {/* Primary Recommendation */}
              {result.primaryRecommendation && (
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-6 items-center">
                  <img
                    src={result.primaryRecommendation.thumbnail}
                    alt={result.primaryRecommendation.title}
                    className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl border border-slate-200"
                  />
                  <div className="flex-1 space-y-1 text-center sm:text-left">
                    <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider">
                      Essential #1
                    </span>
                    <h4 className="font-bold text-sm sm:text-base text-slate-900">
                      {result.primaryRecommendation.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {result.primaryRecommendation.shortDescription}
                    </p>
                    <div className="font-extrabold text-base text-slate-900 pt-1">
                      {formatINR(result.primaryRecommendation.price)}
                    </div>
                  </div>
                  <button
                    onClick={() => addItem(result.primaryRecommendation, result.primaryRecommendation.variants[0], 1)}
                    className="w-full sm:w-auto bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Bag</span>
                  </button>
                </div>
              )}

              {/* Recommended Bundle */}
              {result.recommendedBundle && (
                <div className="p-6 bg-gradient-to-r from-obsidian-950 to-slate-900 text-white rounded-2xl border border-slate-700 flex flex-col sm:flex-row gap-6 items-center shadow-lg">
                  <img
                    src={result.recommendedBundle.thumbnail}
                    alt={result.recommendedBundle.title}
                    className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl border border-slate-700"
                  />
                  <div className="flex-1 space-y-1 text-center sm:text-left">
                    <span className="text-[10px] font-extrabold text-amber-accent uppercase tracking-wider">
                      Best Value Bundle (Save 28%)
                    </span>
                    <h4 className="font-bold text-sm sm:text-base text-white">
                      {result.recommendedBundle.title}
                    </h4>
                    <p className="text-xs text-slate-300 line-clamp-2">
                      {result.recommendedBundle.description}
                    </p>
                    <div className="flex items-baseline gap-2 pt-1 justify-center sm:justify-start">
                      <span className="font-extrabold text-lg text-white">
                        {formatINR(result.recommendedBundle.price)}
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        {formatINR(result.recommendedBundle.originalPrice)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => addItem(result.recommendedBundle, result.recommendedBundle.variants[0], 1)}
                    className="w-full sm:w-auto bg-amber-accent hover:bg-amber-400 text-obsidian-950 text-xs font-extrabold px-5 py-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Get Full Bundle</span>
                  </button>
                </div>
              )}

              <div className="flex justify-center pt-2">
                <button
                  onClick={handleRestart}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Start Quiz Again</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

