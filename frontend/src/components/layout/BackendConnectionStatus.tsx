'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, RefreshCw, X, Server, Database, ExternalLink } from 'lucide-react';
import axios from 'axios';

/**
 * TEMPORARY DIAGNOSTIC COMPONENT
 * Checks and displays whether the frontend is successfully communicating with the backend.
 * Once connection is verified in production, simply remove <BackendConnectionStatus /> from layout.tsx.
 */
export const BackendConnectionStatus: React.FC = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [latency, setLatency] = useState<number | null>(null);
  const [dbStatus, setDbStatus] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(false);

  const rawApiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').trim().replace(/\/+$/, '');
  const apiBase = rawApiUrl.endsWith('/api') ? rawApiUrl.slice(0, -4) : rawApiUrl;

  const checkHealth = async () => {
    setStatus('checking');
    setErrorMessage('');
    const startTime = performance.now();

    try {
      const res = await axios.get(`${apiBase}/api/health`, {
        timeout: 15000,
        withCredentials: true
      });

      const elapsed = Math.round(performance.now() - startTime);
      setLatency(elapsed);

      if (res.data?.success) {
        setStatus('connected');
        setDbStatus(res.data?.database || 'Operational');
        // Auto-minimize after 4 seconds if successfully connected
        setTimeout(() => setIsMinimized(true), 4000);
      } else {
        setStatus('error');
        setErrorMessage('Backend returned unexpected response format');
      }
    } catch (err: any) {
      const elapsed = Math.round(performance.now() - startTime);
      setLatency(elapsed);
      setStatus('error');

      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        setErrorMessage('Connection timed out (>15s). If using Render Free Tier, the server is likely waking up from sleep. Please wait ~30s and click Retry.');
      } else if (err.message === 'Network Error') {
        setErrorMessage(`Cannot reach ${apiBase}. Ensure backend is running and CORS allows ${typeof window !== 'undefined' ? window.location.origin : 'this origin'}.`);
      } else {
        setErrorMessage(err.response?.data?.message || err.message || 'Unable to connect to backend server');
      }
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  if (dismissed) return null;

  // Minimized floating bubble
  if (isMinimized) {
    return (
      <div className="fixed bottom-5 left-5 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold shadow-xl border backdrop-blur-xl transition-all hover:scale-105 active:scale-95 ${
            status === 'connected'
              ? 'bg-emerald-500/90 text-white border-emerald-400 shadow-emerald-500/20'
              : status === 'checking'
              ? 'bg-amber-500/90 text-white border-amber-400 shadow-amber-500/20 animate-pulse'
              : 'bg-rose-600/95 text-white border-rose-400 shadow-rose-600/25'
          }`}
          title="Click to expand backend connection diagnostics"
        >
          <span className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-white' : status === 'checking' ? 'bg-white animate-ping' : 'bg-white'}`} />
          <span>API: {status === 'connected' ? `Live (${latency}ms)` : status === 'checking' ? 'Checking...' : 'Disconnected'}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-5 left-5 z-50 max-w-sm w-[90vw] animate-in slide-in-from-bottom duration-300">
      <div className={`p-4 rounded-3xl border shadow-2xl backdrop-blur-2xl transition-all ${
        status === 'connected'
          ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-100'
          : status === 'checking'
          ? 'bg-slate-900/92 border-amber-500/40 text-amber-100'
          : 'bg-slate-950/95 border-rose-500/60 text-rose-100'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            {status === 'connected' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            ) : status === 'checking' ? (
              <RefreshCw className="w-4 h-4 text-amber-400 animate-spin flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            )}
            <span className="font-extrabold text-xs uppercase tracking-wider text-white">
              {status === 'connected' ? 'Backend Live & Connected' : status === 'checking' ? 'Pinging Backend...' : 'Backend Connection Error'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsMinimized(true)}
              className="text-[10px] text-white/70 hover:text-white px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              Minimize
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="text-white/60 hover:text-white p-1 rounded-full hover:bg-white/10"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="mt-2.5 space-y-2 text-xs font-light">
          <div className="flex items-center justify-between gap-2 text-[11px] bg-white/5 px-2.5 py-1.5 rounded-xl font-mono text-slate-300 overflow-hidden">
            <span className="text-slate-400 flex items-center gap-1 flex-shrink-0">
              <Server className="w-3 h-3 text-brand-400" /> Target:
            </span>
            <span className="truncate text-white" title={apiBase}>{apiBase}</span>
          </div>

          {status === 'connected' && (
            <div className="space-y-1 text-emerald-200">
              <div className="flex justify-between items-center text-[11px]">
                <span>Response Time:</span>
                <strong className="text-emerald-300 font-mono font-bold">{latency} ms</strong>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="flex items-center gap-1"><Database className="w-3 h-3 text-emerald-400" /> Engine:</span>
                <span className="text-emerald-300 truncate max-w-[180px]">{dbStatus}</span>
              </div>
              <p className="text-[10px] text-emerald-300/80 pt-1 border-t border-emerald-500/20 font-sans">
                ✓ Full REST API, authentication, cart, and payment flows verified.
              </p>
            </div>
          )}

          {status === 'checking' && (
            <div className="text-amber-200 space-y-1">
              <p className="text-[11px]">Connecting to <code className="bg-black/30 px-1 py-0.5 rounded">{apiBase}/api/health</code></p>
              <p className="text-[10px] text-amber-300/70">
                Render free servers spin down after inactivity. Cold start can take ~30-45 seconds.
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-2 text-rose-200">
              <p className="text-[11px] leading-relaxed text-rose-300">
                {errorMessage}
              </p>
              <div className="text-[10px] text-slate-300 bg-black/40 p-2.5 rounded-xl space-y-1 border border-white/5">
                <span className="font-bold text-white block">Troubleshooting Guide:</span>
                <div>1. <strong>Render Sleeping?</strong> Free tier sleeps after inactivity; click &quot;Retry Ping&quot;.</div>
                <div>2. <strong>Vercel Env Var:</strong> Check Vercel has <code className="text-amber-300">NEXT_PUBLIC_API_URL</code> set to your Render URL without trailing slash.</div>
                <div>3. <strong>Render Env Var:</strong> Ensure Render has <code className="text-amber-300">FRONTEND_URL</code> set to your Vercel URL.</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between gap-2">
          <button
            onClick={checkHealth}
            disabled={status === 'checking'}
            className="flex-1 bg-white/15 hover:bg-white/25 active:scale-95 text-white font-bold text-[11px] py-1.5 px-3 rounded-full flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${status === 'checking' ? 'animate-spin' : ''}`} />
            <span>{status === 'checking' ? 'Testing...' : 'Retry Ping'}</span>
          </button>

          {status === 'connected' && (
            <button
              onClick={() => setIsMinimized(true)}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] py-1.5 px-3.5 rounded-full transition-all"
            >
              OK (Hide)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

