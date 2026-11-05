import Link from 'next/link';
import { Compass, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="bg-slate-50 min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
          <Compass className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900">404</h1>
        <h2 className="text-base font-bold text-slate-800">You seem to have strayed off-route</h2>
        <p className="text-xs text-slate-500">
          The travel gear page or flight essential you are looking for has been moved or does not exist.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs px-6 py-3 rounded-full transition-colors shadow-sm"
          >
            <span>Return to Terminal (Home)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
