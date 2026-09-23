import React, { useState } from 'react';
import {
  BrainCircuit,
  Sparkles,
  SearchCode,
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
  Activity,
  RefreshCw,
  ArrowRight,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { detectAnomaly, calculateRisk } from '../services/aiEngine';
import { Batch, Machine } from '../types';

export const AiIntelligencePage: React.FC = () => {
  const {
    batches,
    machines,
    setActiveTab,
    triggerRcaForBatch
  } = useApp();

  const [isRecalculating, setIsRecalculating] = useState(false);

  const batchB1042 = batches.find((b: Batch) => b.id === 'B-1042') || batches[0];
  const machineM04 = machines.find((m: Machine) => m.id === 'M04') || machines[0];

  const anomaly = detectAnomaly(batchB1042, machineM04);
  const riskAnalysis = calculateRisk(batchB1042.telemetry, 94, 3.2);

  const handleRecalculate = () => {
    setIsRecalculating(true);
    setTimeout(() => setIsRecalculating(false), 800);
  };

  return (
    <div className="p-8 space-y-7 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#343C6A] tracking-tight flex items-center gap-3">
            <span>AI Intelligence Hub</span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#E1F8EC] text-[#10B981]">
              SPC 4.0 ACTIVE
            </span>
          </h1>
          <p className="text-xs text-[#718EBF] mt-1 font-medium">
            Automated statistical process control, neural anomaly classification, and predictive defect heuristics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRecalculate}
            disabled={isRecalculating}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-[#F5F7FA] text-[#343C6A] border border-[#E6EFF5] text-xs font-bold transition-colors shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#2D60FF] ${isRecalculating ? 'animate-spin' : ''}`} />
            <span>{isRecalculating ? 'Re-evaluating...' : 'Re-run SPC Models'}</span>
          </button>
        </div>
      </div>

      {/* FEATURED AI DECISION-SUPPORT HERO INSIGHT */}
      <div className="p-6 rounded-3xl bg-white border border-[#E6EFF5] shadow-sm space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs uppercase text-[#2D60FF] font-bold tracking-wider">
            <Sparkles className="w-4 h-4 text-[#2D60FF]" />
            <span>AI INSIGHT • HIGH PRIORITY ANOMALY CORRELATION</span>
          </div>
          <span className="text-xs text-[#718EBF]">
            Engine: Heuristic-SPC v4.2
          </span>
        </div>

        <div className="text-xl font-bold text-[#343C6A] leading-snug">
          "Temperature deviation detected in Machine M04 during Batch B-1042."
        </div>

        {/* 3 Metric Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-[#E7EDFF] border border-[#2D60FF]/20">
            <span className="text-[11px] font-semibold uppercase text-[#718EBF] block">
              Confidence Score
            </span>
            <div className="text-2xl font-black text-[#2D60FF] font-mono mt-0.5">
              91%
            </div>
            <span className="text-[11px] text-[#718EBF]">
              p-value &lt; 0.001 (High certainty)
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF5D9] border border-[#FFBB38]/30">
            <span className="text-[11px] font-semibold uppercase text-[#718EBF] block">
              Potential Impact
            </span>
            <div className="text-2xl font-black text-[#FEAA09] font-mono mt-0.5">
              Medium
            </div>
            <span className="text-[11px] text-[#718EBF]">
              3 Lots / 486 Units Exposed
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFEBEF] border border-[#FE5C73]/30">
            <span className="text-[11px] font-semibold uppercase text-[#718EBF] block">
              Predicted Defect Risk
            </span>
            <div className="text-2xl font-black text-[#FE5C73] font-mono mt-0.5">
              76%
            </div>
            <span className="text-[11px] text-[#718EBF]">
              Micro-porosity failure threshold
            </span>
          </div>
        </div>

        {/* Recommended Action Card */}
        <div className="p-4 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] uppercase text-[#2D60FF] font-bold block">
              AI Recommended Action
            </span>
            <p className="text-xs text-[#343C6A] mt-0.5 font-medium">
              Inspect the cooling system and validate the next production batch with non-destructive testing.
            </p>
          </div>

          <button
            onClick={() => triggerRcaForBatch('B-1042')}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#2D60FF] text-white font-bold text-xs uppercase tracking-wider hover:bg-blue-700 transition-colors shadow-xs flex-shrink-0"
          >
            <span>Investigate in RCA</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 5 Core Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* A. Anomaly Detection */}
        <div className="p-6 rounded-3xl bg-white border border-[#E6EFF5] shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase text-[#2D60FF]">
                SECTION A
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E7EDFF] text-[#2D60FF]">
                REAL-TIME
              </span>
            </div>
            <h3 className="font-bold text-sm text-[#343C6A] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#2D60FF]" />
              Anomaly Detection
            </h3>
            <p className="text-xs text-[#718EBF] mt-1">
              Statistical z-score outlier monitoring across CNC feed rates, spindle temperatures, and pressures.
            </p>

            <div className="mt-4 p-3.5 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#718EBF]">Current Z-Score:</span>
                <span className="text-[#FEAA09] font-bold font-mono">z = 2.48 (Elevated)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#718EBF]">Baseline 3-Sigma:</span>
                <span className="text-[#343C6A] font-semibold font-mono">±1.85 sigma</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('passport')}
            className="w-full py-2.5 text-center rounded-full bg-[#F5F7FA] hover:bg-[#EEF2F6] text-xs text-[#2D60FF] font-bold transition-colors"
          >
            View Telemetry Feed →
          </button>
        </div>

        {/* B. Defect Prediction */}
        <div className="p-6 rounded-3xl bg-white border border-[#E6EFF5] shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase text-[#FEAA09]">
                SECTION B
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF5D9] text-[#FEAA09]">
                PREDICTIVE
              </span>
            </div>
            <h3 className="font-bold text-sm text-[#343C6A] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#FEAA09]" />
              Defect Prediction
            </h3>
            <p className="text-xs text-[#718EBF] mt-1">
              Multi-variate regression correlating machine vibration harmonic spikes with bore concentricity failures.
            </p>

            <div className="mt-4 p-3.5 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#718EBF]">Forecasted Defect Spike:</span>
                <span className="text-[#FE5C73] font-bold font-mono">+8.4% without tuning</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#718EBF]">Mitigated Target:</span>
                <span className="text-[#10B981] font-bold font-mono">&lt; 1.2% PPM</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('simulator')}
            className="w-full py-2.5 text-center rounded-full bg-[#F5F7FA] hover:bg-[#EEF2F6] text-xs text-[#FEAA09] font-bold transition-colors"
          >
            Simulate Process Adjustments →
          </button>
        </div>

        {/* C. Root Cause Analysis */}
        <div className="p-6 rounded-3xl bg-white border border-[#E6EFF5] shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase text-[#2D60FF]">
                SECTION C
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E7EDFF] text-[#2D60FF]">
                DECOMPOSITION
              </span>
            </div>
            <h3 className="font-bold text-sm text-[#343C6A] flex items-center gap-2">
              <SearchCode className="w-4 h-4 text-[#2D60FF]" />
              Root Cause Analysis
            </h3>
            <p className="text-xs text-[#718EBF] mt-1">
              Hierarchical cause-tree decomposing defect mechanisms into temperature, mechanical, raw materials, and timing.
            </p>

            <div className="mt-4 p-3.5 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#718EBF]">Dominant Factor:</span>
                <span className="text-[#2D60FF] font-bold font-mono">Temperature Dev (42%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#718EBF]">Secondary Factor:</span>
                <span className="text-[#343C6A] font-medium font-mono">Machine Vibration (24%)</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('rca')}
            className="w-full py-2.5 text-center rounded-full bg-[#F5F7FA] hover:bg-[#EEF2F6] text-xs text-[#2D60FF] font-bold transition-colors"
          >
            Open Cause Tree →
          </button>
        </div>

        {/* D. Impact Analysis */}
        <div className="p-6 rounded-3xl bg-white border border-[#E6EFF5] shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase text-[#FE5C73]">
                SECTION D
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFEBEF] text-[#FE5C73]">
                BLAST RADIUS
              </span>
            </div>
            <h3 className="font-bold text-sm text-[#343C6A] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#FE5C73]" />
              Defect Impact Analysis
            </h3>
            <p className="text-xs text-[#718EBF] mt-1">
              Evaluate operational, logistics, and financial ripple caused by machine disruptions or defective lots.
            </p>

            <div className="mt-4 p-3.5 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#718EBF]">Exposed Shipments:</span>
                <span className="text-[#FE5C73] font-bold font-mono">7 Outbound Waybills</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#718EBF]">Quarantine Required:</span>
                <span className="text-[#FEAA09] font-medium font-mono">3 Batches (100% CMM)</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('impact')}
            className="w-full py-2.5 text-center rounded-full bg-[#F5F7FA] hover:bg-[#EEF2F6] text-xs text-[#FE5C73] font-bold transition-colors"
          >
            Open Impact Screen →
          </button>
        </div>

        {/* E. Manufacturing Risk Prediction */}
        <div className="p-6 rounded-3xl bg-white border border-[#E6EFF5] shadow-sm flex flex-col justify-between space-y-4 lg:col-span-2">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase text-[#10B981]">
                SECTION E
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E1F8EC] text-[#10B981]">
                MULTI-VARIATE
              </span>
            </div>
            <h3 className="font-bold text-sm text-[#343C6A] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              Manufacturing Risk Prediction Breakdown
            </h3>
            <p className="text-xs text-[#718EBF] mt-1">
              Continuous multi-factorial risk scoring calculated via `calculateRisk()`
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-4">
              <div className="p-3.5 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5]">
                <span className="text-[10px] text-[#718EBF] uppercase font-bold block">Thermal Risk</span>
                <span className="text-xl font-black text-[#FEAA09] font-mono mt-0.5 block">
                  {riskAnalysis.breakdown.thermalRisk}%
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5]">
                <span className="text-[10px] text-[#718EBF] uppercase font-bold block">Mechanical Risk</span>
                <span className="text-xl font-black text-[#2D60FF] font-mono mt-0.5 block">
                  {riskAnalysis.breakdown.mechanicalRisk}%
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5]">
                <span className="text-[10px] text-[#718EBF] uppercase font-bold block">Supplier Risk</span>
                <span className="text-xl font-black text-[#16DBCC] font-mono mt-0.5 block">
                  {riskAnalysis.breakdown.supplierRisk}%
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FFEBEF] border border-[#FE5C73]/30">
                <span className="text-[10px] text-[#FE5C73] uppercase font-bold block">Overall Risk</span>
                <span className="text-xl font-black text-[#FE5C73] font-mono mt-0.5 block">
                  {riskAnalysis.overallRiskScore}%
                </span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F5F7FA] text-[11px] text-[#718EBF] leading-relaxed flex items-center gap-2.5">
            <Info className="w-4 h-4 text-[#2D60FF] flex-shrink-0" />
            <span>
              Decision Support Notice: Statistical values are computed using industrial process control heuristics. Potential contributing factors are flagged for human operator validation.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
