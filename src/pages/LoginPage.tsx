import React, { useState } from 'react';
import {
  Compass,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Factory,
  Cpu
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INDUSTRIES } from '../data/industries';
import { IndustryConfig, IndustryType } from '../types';

export const LoginPage: React.FC = () => {
  const { login, currentIndustry, setIndustry } = useApp();
  const [email, setEmail] = useState('demo.director@manutrace.internal');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedInd, setSelectedInd] = useState<IndustryType>(currentIndustry);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, false, selectedInd);
  };

  const handleDemoClick = () => {
    login('marcus.vance@manutrace.internal', true, selectedInd);
  };

  const industriesList = Object.values(INDUSTRIES);

  return (
    <div className="min-h-screen bg-[#070A11] text-slate-100 flex flex-col justify-between relative overflow-hidden selection:bg-cyan/30 selection:text-cyan">
      {/* Background Industrial Circuit Grid / Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-dark-900 to-[#070A11] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#06B6D4 1px, transparent 1px), linear-gradient(90deg, #06B6D4 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar Branding */}
      <header className="px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan to-blue-600 p-0.5 flex items-center justify-center shadow-glow-cyan/40">
            <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
              <Compass className="w-5 h-5 text-cyan" />
            </div>
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-wider text-white flex items-center gap-2">
              MANUTRACE <span className="text-cyan text-xs font-mono bg-cyan/10 px-2 py-0.5 rounded border border-cyan/30">AI</span>
            </h1>
            <span className="text-[11px] text-slate-400 font-mono tracking-tight uppercase">
              Universal Traceability & Impact Intelligence
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#131D31]/80 border border-[#1E2D4A] text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Industry 4.0 Platform v2.4</span>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 z-10">
        <div className="w-full max-w-md bg-[#0F1626]/90 backdrop-blur-xl border border-[#1E2D4A] rounded-2xl shadow-2xl p-8 space-y-6">
          {/* Header titles */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan/10 border border-cyan/30 text-cyan text-xs font-mono mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Universal Manufacturing Portal</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              MANUTRACE AI
            </h2>
            <p className="text-xs text-slate-300 italic font-sans max-w-xs mx-auto leading-relaxed">
              "Know every product. Trace every process. Predict every impact."
            </p>
          </div>

          {/* Industry / Factory Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Factory className="w-3.5 h-3.5 text-cyan" />
                Industry / Factory Configuration:
              </span>
            </label>
            <div className="relative">
              <select
                value={selectedInd}
                onChange={e => {
                  const val = e.target.value as IndustryType;
                  setSelectedInd(val);
                  setIndustry(val);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#131D31] border border-[#1E2D4A] text-xs text-slate-100 focus:outline-none focus:border-cyan transition-colors appearance-none cursor-pointer"
              >
                {industriesList.map((ind: IndustryConfig) => (
                  <option key={ind.id} value={ind.id} className="bg-[#0F1626] text-slate-200">
                    {ind.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                ▼
              </div>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                Work Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="operator@manufacturing.org"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#131D31] border border-[#1E2D4A] text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#131D31] border border-[#1E2D4A] text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan transition-colors"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-3">
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-[#131D31] hover:bg-[#18243C] border border-[#1E2D4A] hover:border-slate-400 text-sm font-semibold text-slate-200 transition-colors flex items-center justify-center gap-2"
              >
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              {/* DEMO LOGIN (Direct 1-Click Access) */}
              <button
                type="button"
                onClick={handleDemoClick}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-cyan text-white font-bold text-sm uppercase tracking-wider hover:opacity-95 shadow-glow-cyan flex items-center justify-center gap-2.5 transition-all transform active:scale-[0.99]"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Demo Login (Instant Access)</span>
              </button>
            </div>
          </form>

          {/* Bottom Security / Trust Badges */}
          <div className="pt-4 border-t border-[#1E2D4A]/60 flex items-center justify-around text-[11px] text-slate-400 font-mono">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan" />
              ISO 27001
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              SOC2 Type II
            </span>
            <span className="flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              Edge SPC 4.0
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 font-mono z-10">
        MANUTRACE AI Enterprise Platform • Universal Manufacturing Architecture • Confidential
      </footer>
    </div>
  );
};
