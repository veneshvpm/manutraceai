import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertOctagon,
  Layers,
  Cpu,
  Building2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DefectCategory, Batch, QualityInspection } from '../types';

export const QualityPage: React.FC = () => {
  const { inspections, batches } = useApp();
  const [activeChartTab, setActiveChartTab] = useState<'category' | 'machine' | 'batch' | 'supplier'>('category');

  const categories: { cat: DefectCategory; count: number; pct: number; color: string }[] = [
    { cat: 'Temperature', count: 14, pct: 36, color: 'bg-[#FE5C73]' },
    { cat: 'Dimension', count: 9, pct: 23, color: 'bg-[#2D60FF]' },
    { cat: 'Surface', count: 6, pct: 15, color: 'bg-[#16DBCC]' },
    { cat: 'Material', count: 5, pct: 13, color: 'bg-[#FFBB38]' },
    { cat: 'Assembly', count: 3, pct: 8, color: 'bg-[#8BA3CB]' },
    { cat: 'Packaging', count: 1, pct: 3, color: 'bg-[#10B981]' },
    { cat: 'Other', count: 1, pct: 2, color: 'bg-[#C5D3E8]' }
  ];

  return (
    <div className="p-8 space-y-7 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#343C6A] tracking-tight">
            Quality Control & Defect Intelligence
          </h1>
          <p className="text-xs text-[#718EBF] mt-1 font-medium">
            Comprehensive audit tracking across physical parts, CMM coordinates, visual tolerances, and rework loops
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-[#10B981] bg-[#E1F8EC] px-3.5 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span>Inline CMM Stations: 100% Online</span>
        </div>
      </div>

      {/* 5 Quality Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
        {/* Total Inspections */}
        <div className="p-5 rounded-3xl bg-white border border-[#E6EFF5] shadow-sm">
          <span className="text-[11px] font-bold uppercase text-[#718EBF] block">Total Inspections</span>
          <div className="text-2xl font-black text-[#343C6A] font-mono mt-1">1,480</div>
          <span className="text-[11px] text-[#2D60FF] font-medium mt-0.5 block">100% CMM Audited</span>
        </div>

        {/* Passed */}
        <div className="p-5 rounded-3xl bg-white border border-[#E6EFF5] shadow-sm">
          <span className="text-[11px] font-bold uppercase text-[#718EBF] block">Passed</span>
          <div className="text-2xl font-black text-[#10B981] font-mono mt-1">1,432</div>
          <span className="text-[11px] text-[#10B981] font-medium mt-0.5 block">96.8% First-Pass Yield</span>
        </div>

        {/* Failed */}
        <div className="p-5 rounded-3xl bg-white border border-[#E6EFF5] shadow-sm">
          <span className="text-[11px] font-bold uppercase text-[#718EBF] block">Failed</span>
          <div className="text-2xl font-black text-[#FE5C73] font-mono mt-1">21</div>
          <span className="text-[11px] text-[#FE5C73] font-medium mt-0.5 block">1.4% Defect Escapes</span>
        </div>

        {/* Rework */}
        <div className="p-5 rounded-3xl bg-white border border-[#E6EFF5] shadow-sm">
          <span className="text-[11px] font-bold uppercase text-[#718EBF] block">Rework</span>
          <div className="text-2xl font-black text-[#FEAA09] font-mono mt-1">27</div>
          <span className="text-[11px] text-[#FEAA09] font-medium mt-0.5 block">Secondary Surface Pass</span>
        </div>

        {/* Scrapped */}
        <div className="p-5 rounded-3xl bg-white border border-[#E6EFF5] shadow-sm">
          <span className="text-[11px] font-bold uppercase text-[#718EBF] block">Scrapped</span>
          <div className="text-2xl font-black text-[#718EBF] font-mono mt-1">0</div>
          <span className="text-[11px] text-[#10B981] font-medium mt-0.5 block">Zero Scrap Target Met</span>
        </div>
      </div>

      {/* Defect Analytics & Breakdown Tabs */}
      <div className="p-6 rounded-3xl bg-white border border-[#E6EFF5] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6EFF5] pb-4">
          <div>
            <h3 className="font-bold text-sm text-[#343C6A]">
              Defect Distribution & Cross-Correlation Matrix
            </h3>
            <p className="text-xs text-[#718EBF] mt-0.5">
              Inspect root defects decomposed by category, machine cell, production batch, or tier-1 supplier
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1.5 bg-[#F5F7FA] p-1 rounded-full border border-[#E6EFF5]">
            {[
              { id: 'category', label: 'Defect Category' },
              { id: 'machine', label: 'By Machine' },
              { id: 'batch', label: 'By Batch' },
              { id: 'supplier', label: 'By Supplier' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveChartTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeChartTab === tab.id
                    ? 'bg-[#2D60FF] text-white shadow-xs'
                    : 'text-[#718EBF] hover:text-[#343C6A]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category View */}
        {activeChartTab === 'category' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase text-[#718EBF] block">
                Defect Incident Share by Category:
              </span>
              {categories.map(c => (
                <div key={c.cat} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-[#343C6A]">{c.cat}</span>
                    <span className="font-mono text-[#2D60FF] font-bold">
                      {c.count} incidents ({c.pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-[#F5F7FA] rounded-full overflow-hidden border border-[#E6EFF5]">
                    <div
                      className={`h-full ${c.color} rounded-full`}
                      style={{ width: `${c.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Category Ring Chart */}
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-[#F8FAFC] border border-[#E6EFF5]">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#E6EFF5" strokeWidth="12" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#FE5C73" strokeWidth="12" strokeDasharray="238.7" strokeDashoffset="152.7" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#2D60FF" strokeWidth="12" strokeDasharray="238.7" strokeDashoffset="183.8" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#16DBCC" strokeWidth="12" strokeDasharray="238.7" strokeDashoffset="202.9" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-black text-[#343C6A] font-mono leading-none">39</span>
                  <span className="text-[11px] text-[#718EBF] font-medium mt-1">Total Defects</span>
                </div>
              </div>
              <span className="text-xs text-[#718EBF] mt-4 text-center">
                Temperature & Dimension comprise 59% of all logged variations
              </span>
            </div>
          </div>
        )}

        {/* By Machine View */}
        {activeChartTab === 'machine' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in">
            {[
              { id: 'M04', name: '5-Axis CNC Milling Center', defects: 14, risk: 'Medium Risk' },
              { id: 'M01', name: 'Hydraulic Press & Forging Cell', defects: 3, risk: 'Low Risk' },
              { id: 'M02', name: 'Precision Surface Grinder', defects: 2, risk: 'Low Risk' },
              { id: 'M03', name: 'Induction Heat Treat Chamber', defects: 5, risk: 'Low Risk' },
              { id: 'M05', name: 'SMT Pick-and-Place Array', defects: 1, risk: 'Low Risk' },
              { id: 'M06', name: 'Aseptic Autoclave Unit', defects: 4, risk: 'Medium Risk' }
            ].map(m => (
              <div key={m.id} className="p-4 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#2D60FF]">{m.id}</span>
                  <span className="text-[11px] font-semibold text-[#718EBF]">{m.risk}</span>
                </div>
                <h4 className="text-xs font-bold text-[#343C6A]">{m.name}</h4>
                <div className="pt-2 border-t border-[#E6EFF5] flex justify-between text-xs">
                  <span className="text-[#718EBF]">Associated Defects:</span>
                  <span className="text-[#FEAA09] font-bold font-mono">{m.defects} units</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* By Batch View */}
        {activeChartTab === 'batch' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in">
            {batches.slice(0, 6).map((b: Batch) => (
              <div key={b.id} className="p-4 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#2D60FF]">{b.id}</span>
                  <span className="text-[11px] font-semibold text-[#718EBF]">{b.productionLine}</span>
                </div>
                <h4 className="text-xs font-bold text-[#343C6A] truncate">{b.productName}</h4>
                <div className="pt-2 border-t border-[#E6EFF5] flex justify-between text-xs">
                  <span className="text-[#718EBF]">Defect Rate:</span>
                  <span className="text-[#FE5C73] font-bold font-mono">{b.defectRate}%</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* By Supplier View */}
        {activeChartTab === 'supplier' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
            {[
              { id: 'SUP-001', name: 'Global Materials Ltd.', defects: 8, score: 94 },
              { id: 'SUP-002', name: 'Apex Castings', defects: 4, score: 91 },
              { id: 'SUP-003', name: 'Titanium Dynamics', defects: 7, score: 83 },
              { id: 'SUP-007', name: 'Nordic Polymer', defects: 9, score: 79 }
            ].map(s => (
              <div key={s.id} className="p-4 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5] space-y-2">
                <span className="font-mono text-xs font-bold text-[#2D60FF]">{s.id}</span>
                <h4 className="text-xs font-bold text-[#343C6A]">{s.name}</h4>
                <div className="pt-2 border-t border-[#E6EFF5] flex justify-between text-xs">
                  <span className="text-[#718EBF]">Quality Score:</span>
                  <span className="text-[#10B981] font-bold font-mono">{s.score}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inspections Table */}
      <div className="rounded-3xl bg-white border border-[#E6EFF5] overflow-hidden shadow-sm">
        <div className="p-5 border-b border-[#E6EFF5] flex items-center justify-between bg-white">
          <h3 className="font-bold text-sm text-[#343C6A]">
            Verified Inspection Station Logs
          </h3>
          <span className="text-xs font-bold text-[#2D60FF] bg-[#E7EDFF] px-3 py-1 rounded-full">Real-time Metrology</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F7FA] text-[#718EBF] font-semibold uppercase tracking-wider border-b border-[#E6EFF5]">
              <tr>
                <th className="py-3.5 px-5">Inspection ID</th>
                <th className="py-3.5 px-5">Batch ID</th>
                <th className="py-3.5 px-5">Stage</th>
                <th className="py-3.5 px-5">Result</th>
                <th className="py-3.5 px-5">Tolerance Variance</th>
                <th className="py-3.5 px-5">Inspector</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6EFF5]">
              {inspections.map((ins: QualityInspection) => (
                <tr key={ins.id} className="hover:bg-[#F5F7FA] transition-colors">
                  <td className="py-3.5 px-5 font-mono font-bold text-[#2D60FF]">{ins.id}</td>
                  <td className="py-3.5 px-5 font-mono text-[#343C6A] font-semibold">{ins.batchId}</td>
                  <td className="py-3.5 px-5 text-[#343C6A] font-medium">{ins.stage}</td>
                  <td className="py-3.5 px-5">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase ${
                        ins.result === 'passed'
                          ? 'bg-[#E1F8EC] text-[#10B981]'
                          : 'bg-[#FFEBEF] text-[#FE5C73]'
                      }`}
                    >
                      {ins.result}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 font-mono text-[#718EBF]">{ins.toleranceVariance}</td>
                  <td className="py-3.5 px-5 text-[#718EBF]">{ins.inspectorId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
