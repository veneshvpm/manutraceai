import React, { useState } from 'react';
import {
  BarChart3,
  Calendar,
  TrendingUp,
  TrendingDown,
  Download,
  Filter,
  Layers,
  Cpu,
  Building2,
  Boxes,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AnalyticsPage: React.FC = () => {
  const [dateFilter, setDateFilter] = useState<'today' | '7d' | '30d' | '3m' | 'custom'>('7d');

  const dateOptions = [
    { id: 'today', label: 'Today' },
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '3m', label: '3 Months' },
    { id: 'custom', label: 'Custom' }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E2D4A] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan uppercase tracking-widest mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Industrial 4.0 Big Data Analytics Engine</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Advanced Manufacturing Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Multi-dimensional process metrics, machine OEE performance, defect PPM, and supplier quality matrices
          </p>
        </div>

        {/* Date Filters (from requirement 15) */}
        <div className="flex items-center gap-1.5 bg-[#0F1626] p-1.5 rounded-xl border border-[#1E2D4A]">
          <Calendar className="w-3.5 h-3.5 text-cyan ml-2 mr-1" />
          {dateOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => setDateFilter(opt.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                dateFilter === opt.id
                  ? 'bg-cyan/20 text-cyan border border-cyan/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top 4 KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
        <div className="p-4 rounded-xl bg-[#0F1626] border border-cyan/30">
          <span className="text-[10px] text-slate-400 uppercase">Overall OEE Index</span>
          <div className="text-2xl font-black text-cyan mt-1">89.4%</div>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
            <TrendingUp className="w-3 h-3" /> +1.8% vs last cycle
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#0F1626] border border-emerald-500/30">
          <span className="text-[10px] text-slate-400 uppercase">Quality First-Pass</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">96.8%</div>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
            <TrendingUp className="w-3 h-3" /> Target: &gt;95%
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#0F1626] border border-amber-500/30">
          <span className="text-[10px] text-slate-400 uppercase">Rework Rate</span>
          <div className="text-2xl font-black text-amber-400 mt-1">1.8%</div>
          <span className="text-[10px] text-slate-400 font-sans block mt-0.5">
            27 units total this week
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#0F1626] border border-[#1E2D4A]">
          <span className="text-[10px] text-slate-400 uppercase">Material Waste</span>
          <div className="text-2xl font-black text-slate-200 mt-1">0.42%</div>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
            <TrendingDown className="w-3 h-3" /> -0.15% scrap reduction
          </span>
        </div>
      </div>

      {/* Grid of Analytics Charts (Production Trend, Quality Trend, Defect Trend, OEE, etc.) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Production Trend & Output */}
        <div className="p-5 rounded-2xl bg-[#0F1626] border border-[#1E2D4A] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan" />
              Production Trend & Daily Yield
            </h3>
            <span className="text-xs font-mono text-cyan">Throughput</span>
          </div>

          <div className="h-52 w-full">
            <svg viewBox="0 0 500 180" className="w-full h-full">
              <line x1="30" y1="20" x2="480" y2="20" stroke="#1E2D4A" strokeDasharray="2 2" />
              <line x1="30" y1="70" x2="480" y2="70" stroke="#1E2D4A" strokeDasharray="2 2" />
              <line x1="30" y1="120" x2="480" y2="120" stroke="#1E2D4A" strokeDasharray="2 2" />
              <line x1="30" y1="160" x2="480" y2="160" stroke="#1E2D4A" />

              {/* Bar charts for 7 days */}
              {[
                { day: 'Mon', h: 100, val: '2,450' },
                { day: 'Tue', h: 120, val: '2,820' },
                { day: 'Wed', h: 135, val: '3,100' },
                { day: 'Thu', h: 110, val: '2,640' },
                { day: 'Fri', h: 145, val: '3,420' },
                { day: 'Sat', h: 90, val: '2,100' },
                { day: 'Sun', h: 75, val: '1,896' }
              ].map((b, i) => {
                const x = 50 + i * 62;
                return (
                  <g key={i}>
                    <rect
                      x={x}
                      y={160 - b.h}
                      width="34"
                      height={b.h}
                      rx="4"
                      fill="#06B6D4"
                      fillOpacity="0.85"
                    />
                    <text x={x + 17} y="174" fill="#64748B" fontSize="9" textAnchor="middle" fontFamily="monospace">
                      {b.day}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* 2. Machine Performance & OEE Breakdown */}
        <div className="p-5 rounded-2xl bg-[#0F1626] border border-[#1E2D4A] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-amber-400" />
              Machine Performance (OEE Matrix)
            </h3>
            <span className="text-xs font-mono text-slate-400">Availability / Speed</span>
          </div>

          <div className="space-y-3.5 pt-2">
            {[
              { label: 'Availability (Uptime vs Planned)', val: 94.2, color: 'bg-emerald-400' },
              { label: 'Performance (Cycle Speed Ratio)', val: 91.8, color: 'bg-cyan' },
              { label: 'Quality (Zero Defect Yield)', val: 96.8, color: 'bg-blue-400' },
              { label: 'Overall Equipment Effectiveness (OEE)', val: 89.4, color: 'bg-gradient-to-r from-blue-500 to-cyan' }
            ].map((m, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">{m.label}</span>
                  <span className="font-bold text-white">{m.val}%</span>
                </div>
                <div className="w-full h-2.5 bg-[#131D31] rounded-full overflow-hidden">
                  <div className={`h-full ${m.color} rounded-full`} style={{ width: `${m.val}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Batch Risk Distribution */}
        <div className="p-5 rounded-2xl bg-[#0F1626] border border-[#1E2D4A] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              Active Batches Risk Distribution
            </h3>
            <span className="text-xs font-mono text-cyan">24 Lots Active</span>
          </div>

          <div className="grid grid-cols-4 gap-3 text-center font-mono">
            <div className="p-3 rounded-xl bg-[#131D31] border border-emerald-500/30">
              <span className="text-[10px] text-slate-400 uppercase block">Low Risk</span>
              <span className="text-2xl font-black text-emerald-400 mt-1 block">16</span>
              <span className="text-[10px] text-slate-500 block">66.7%</span>
            </div>
            <div className="p-3 rounded-xl bg-[#131D31] border border-blue-500/30">
              <span className="text-[10px] text-slate-400 uppercase block">Medium</span>
              <span className="text-2xl font-black text-blue-400 mt-1 block">4</span>
              <span className="text-[10px] text-slate-500 block">16.7%</span>
            </div>
            <div className="p-3 rounded-xl bg-[#131D31] border border-amber-500/30">
              <span className="text-[10px] text-slate-400 uppercase block">High Risk</span>
              <span className="text-2xl font-black text-amber-400 mt-1 block">3</span>
              <span className="text-[10px] text-slate-500 block">12.5%</span>
            </div>
            <div className="p-3 rounded-xl bg-[#131D31] border border-red-500/30">
              <span className="text-[10px] text-slate-400 uppercase block">Critical</span>
              <span className="text-2xl font-black text-red-400 mt-1 block">1</span>
              <span className="text-[10px] text-slate-500 block">4.1%</span>
            </div>
          </div>
        </div>

        {/* 4. Supplier Quality Matrix */}
        <div className="p-5 rounded-2xl bg-[#0F1626] border border-[#1E2D4A] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan" />
              Supplier Quality & Reliability Matrix
            </h3>
            <span className="text-xs font-mono text-slate-400">8 Tier-1 Suppliers</span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            {[
              { name: 'Global Materials Ltd. (SUP-001)', score: 94, defect: 1.8 },
              { name: 'Apex Precision Castings (SUP-002)', score: 91, defect: 2.4 },
              { name: 'Silicon NanoTech Foundry (SUP-004)', score: 98, defect: 0.6 },
              { name: 'Nordic Polymer & Resins (SUP-007)', score: 79, defect: 5.2 }
            ].map((sup, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-[#131D31] border border-[#1E2D4A] flex items-center justify-between"
              >
                <span className="text-slate-200 truncate">{sup.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-emerald-400 font-bold">{sup.score}% QA</span>
                  <span className="text-slate-400 text-[11px]">{sup.defect}% Defect</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
