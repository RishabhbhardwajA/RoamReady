'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Compass, Lock, Mail, ArrowRight, Sparkles, AlertCircle, CheckCircle2, Copy } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginDemoCustomer } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const ok = await login(email, password);
      if (ok) {
        router.push('/account');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoCustomer = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginDemoCustomer();
      router.push('/account');
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('traveler@roamready.com');
    setPassword('TravelGear2026!');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group mb-2">
            <div className="w-10 h-10 rounded-xl bg-obsidian-950 flex items-center justify-center text-amber-accent shadow-md">
              <Compass className="w-5 h-5 text-amber-accent" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              ROAM<span className="text-brand-600">READY</span>
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900">Welcome Back, Flyer</h1>
          <p className="text-xs text-slate-500">Sign in to manage your luggage orders, addresses, and flight kits.</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Fake / Demo Login Credentials Box */}
        <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100/60 border border-amber-200 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-amber-900 text-[11px] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Demo Customer Credentials</span>
            </div>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="text-[10px] font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 bg-amber-200/60 hover:bg-amber-200 px-2 py-0.5 rounded-lg transition-colors"
            >
              {copied ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Filled!' : 'Fill Form'}</span>
            </button>
          </div>

          <div className="bg-white/80 rounded-xl p-2.5 space-y-1 font-mono text-[11px] text-slate-700 border border-amber-200/60">
            <div className="flex justify-between">
              <span className="text-slate-400">Email:</span>
              <span className="font-bold text-slate-900 select-all">traveler@roamready.com</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Password:</span>
              <span className="font-bold text-slate-900 select-all">TravelGear2026!</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDemoCustomer}
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-obsidian-950 font-extrabold text-xs py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-98"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1-Click Instant Sign In as Customer</span>
          </button>
        </div>

        {/* Regular Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-100 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-100 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-500 text-white font-extrabold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm shadow-md transition-all active:scale-98"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          New to RoamReady?{' '}
          <Link href="/auth/register" className="text-brand-600 font-bold hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
