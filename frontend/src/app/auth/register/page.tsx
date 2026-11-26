'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, User, Phone, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { BrandLogo } from '@/components/ui/BrandLogo';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordTooShort = password.length > 0 && password.length < 8;
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const ok = await register(name, email, password, phone);
      if (ok) {
        router.push('/account');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 group mb-2">
            <BrandLogo size={40} className="rounded-xl shadow-md group-hover:scale-105 transition-transform" />
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              ROAM<span className="text-brand-600">READY</span>
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900">Join the Traveler Club</h1>
          <p className="text-xs text-slate-500">Create an account to unlock order tracking and 3-year gear warranty.</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g. Vikramaditya Sen"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-100 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-100 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Phone (Optional)</label>
            <div className="relative">
              <input
                type="tel"
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-100 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Password (min 8 characters)</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-slate-100 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 ${
                  passwordTooShort ? 'ring-2 ring-red-400 focus:ring-red-400' : 'focus:ring-brand-500'
                }`}
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            {passwordTooShort && (
              <p className="text-[11px] text-red-500 mt-1 font-medium">Password must be at least 8 characters</p>
            )}
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full bg-slate-100 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 ${
                  passwordsMismatch ? 'ring-2 ring-red-400 focus:ring-red-400' : passwordsMatch ? 'ring-2 ring-emerald-400 focus:ring-emerald-400' : 'focus:ring-brand-500'
                }`}
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              {passwordsMatch && (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3 top-1/2 -translate-y-1/2" />
              )}
            </div>
            {passwordsMismatch && (
              <p className="text-[11px] text-red-500 mt-1 font-medium">Passwords do not match</p>
            )}
            {passwordsMatch && (
              <p className="text-[11px] text-emerald-600 mt-1 font-medium">Passwords match ✓</p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || passwordTooShort || passwordsMismatch}
              className="w-full bg-brand-600 hover:bg-brand-500 text-white font-extrabold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm shadow-md transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{loading ? 'Creating Account...' : 'Create RoamReady Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-brand-600 font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
