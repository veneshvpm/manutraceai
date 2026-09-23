import React, { useState } from 'react';
import {
  SearchCode,
  Sparkles,
  GitBranch,
  Thermometer,
  Activity,
  Boxes,
  Clock,
  User,
  AlertOctagon,
  ArrowRight,
  Sliders,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { analyzeRootCause } from '../services/aiEngine';

export const RcaPage: React.FC = () => {
  const { selectedBatchId, setActiveTab } = useApp();
  const [selectedFactorIndex, setSelectedFactorIndex] = useState<number>(0);

  const rcaData = analyzeRootCause('Defect rate increased by 8.4%', selectedBatchId || 'B-1042');
  const factorIcons = [Thermometer, Activity, Boxes, Clock, User];

  return (
    <div className="p-8 space-y-7 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#343C6A] tracking-tight flex items-center gap-3">
            <span>Root Cause Analysis (RCA)</span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#E7EDFF] text-[#2D60FF]">
              AI DECOMPOSED
            </span>
          </h1>
          <p className="text-xs text-[#718EBF] mt-1 font-medium">
            Inferential regression linking inline telemetry, material hardness variances, and defect rates
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('simulator')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2D60FF] hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-[0_4px_12px_rgba(45,96,255,0.35)]"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Test Fix in Simulator</span>
          </button>
        </div>
      </div>

      {/* Problem Banner & AI Finding */}
      <div className="p-6 rounded-3xl bg-white border border-[#E6EFF5] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs uppercase text-[#FE5C73] font-bold">
            <AlertOctagon className="w-4 h-4 text-[#FE5C73]" />
            <span>INVESTIGATED PHENOMENON: {rcaData.problem}</span>
          </div>
          <span className="text-xs text-[#718EBF]">
            Target Batch: <span className="text-[#2D60FF] font-bold">{selectedBatchId || 'B-1042'}</span> (Line 04)
          </span>
        </div>

        {/* AI Key Finding Box */}
        <div className="p-5 rounded-2xl bg-[#E7EDFF] border border-[#2D60FF]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#2D60FF] text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-bold text-[#343C6A] leading-tight">
                "AI identified <span className="text-[#2D60FF] underline decoration-[#2D60FF]">Temperature Deviation</span> as the strongest potential contributing factor."
              </div>
              <p className="text-xs text-[#718EBF] mt-1">
                Correlation Confidence: <span className="text-[#2D60FF] font-bold font-mono">91%</span> • Machine M04 thermal sensor recorded +4.2°C sustained creep over setpoint for 35 minutes.
              </p>
            </div>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-white text-right flex-shrink-0 shadow-xs">
            <span className="text-[10px] uppercase text-[#718EBF] font-bold block">Impact Weight</span>
            <span className="text-2xl font-black text-[#2D60FF] font-mono">42%</span>
          </div>
        </div>

        {/* Decision Support Non-dogmatic Disclaimer */}
        <div className="p-3.5 rounded-2xl bg-[#F5F7FA] text-[11px] text-[#718EBF] flex items-center gap-2.5">
          <Info className="w-4 h-4 text-[#2D60FF] flex-shrink-0" />
          <span>
            {rcaData.disclaimer}
          </span>
        </div>
      </div>

      {/* Main Analysis Body: Visual Cause Tree + Percentage Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Col: Visual Hierarchical Cause Tree */}
        <div className="p-6 rounded-3xl bg-white border border-[#E6EFF5] shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-[#E6EFF5] pb-3">
              <h3 className="font-bold text-sm text-[#343C6A] flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-[#2D60FF]" />
                Visual Cause Tree Diagram
              </h3>
              <span className="text-xs font-semibold text-[#718EBF]">Ishikawa Multi-Factor</span>
            </div>

            {/* Tree Graphical Representation */}
            <div className="p-5 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5] space-y-3.5 text-xs">
              {/* Root Problem Node */}
              <div className="p-3.5 rounded-2xl bg-[#FFEBEF] border border-[#FE5C73]/40 text-[#FE5C73] font-bold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 text-[#FE5C73]" />
                  <span>DEFECT RATE SPIKE (+8.4%)</span>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#FE5C73] text-white font-black">
                  ROOT
                </span>
              </div>

              {/* Branch Connectors & Factor Nodes */}
              <div className="pl-6 border-l-2 border-[#2D60FF]/30 space-y-3 ml-4 py-1">
                {rcaData.factors.map((factor: any, idx: number) => {
                  const Icon = factorIcons[idx] || Sparkles;
                  const isSelected = idx === selectedFactorIndex;

                  return (
                    <div
                      key={factor.factor}
                      onClick={() => setSelectedFactorIndex(idx)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 flex items-center justify-between group ${
                        isSelected
                          ? 'bg-[#E7EDFF] border-[#2D60FF] text-[#343C6A] shadow-xs'
                          : 'bg-white border-[#E6EFF5] text-[#343C6A] hover:bg-[#F5F7FA]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-xl ${
                            isSelected ? 'bg-[#2D60FF] text-white' : 'bg-[#F5F7FA] text-[#718EBF]'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold block">{factor.factor}</span>
                          <span className="text-[11px] text-[#718EBF] line-clamp-1">
                            {factor.telemetryEvidence.split(':')[0]}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-mono text-base font-black text-[#2D60FF]">
                          {factor.percentage}%
                        </span>
                        <span className="text-[10px] text-[#718EBF] block">weight</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="text-xs text-[#718EBF]">
            Click any causal branch to reveal telemetry evidence & sensor trace
          </div>
        </div>

        {/* Right Col: Factor Percentages & Selected Evidence */}
        <div className="p-6 rounded-3xl bg-white border border-[#E6EFF5] shadow-sm flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between border-b border-[#E6EFF5] pb-3 mb-4">
              <h3 className="font-bold text-sm text-[#343C6A]">
                Contributing Factor Distribution
              </h3>
              <span className="text-xs font-bold text-[#2D60FF] bg-[#E7EDFF] px-3 py-1 rounded-full">
                100% Budget
              </span>
            </div>

            {/* Percentage Bars */}
            <div className="space-y-4">
              {rcaData.factors.map((f: any, i: number) => (
                <div
                  key={f.factor}
                  onClick={() => setSelectedFactorIndex(i)}
                  className="space-y-1.5 cursor-pointer group"
                >
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-[#343C6A] group-hover:text-[#2D60FF] transition-colors">
                      {f.factor}
                    </span>
                    <span className="font-mono font-bold text-[#2D60FF]">
                      {f.percentage}%
                    </span>
                  </div>

                  <div className="w-full h-3 bg-[#F5F7FA] rounded-full overflow-hidden border border-[#E6EFF5]">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        i === 0
                          ? 'bg-[#2D60FF]'
                          : i === 1
                          ? 'bg-[#16DBCC]'
                          : i === 2
                          ? 'bg-[#FFBB38]'
                          : 'bg-[#C5D3E8]'
                      }`}
                      style={{ width: `${f.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Factor Detailed Evidence Panel */}
            <div className="mt-6 p-4 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5] space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-[#2D60FF]">
                <span>EVIDENCE: {rcaData.factors[selectedFactorIndex].factor}</span>
                <span>Confidence: {rcaData.factors[selectedFactorIndex].confidence}%</span>
              </div>
              <p className="text-xs text-[#343C6A] leading-relaxed">
                {rcaData.factors[selectedFactorIndex].description}
              </p>
              <div className="p-3 rounded-xl bg-white border border-[#E6EFF5] text-xs font-mono text-[#343C6A]">
                <span className="text-[10px] text-[#718EBF] block uppercase font-sans font-bold">Telemetry Data Log:</span>
                {rcaData.factors[selectedFactorIndex].telemetryEvidence}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#E6EFF5]">
            <span className="text-xs text-[#718EBF]">
              Action: Run parameter sensitivity test
            </span>
            <button
              onClick={() => setActiveTab('simulator')}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#2D60FF] text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs"
            >
              <span>Open Simulator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
