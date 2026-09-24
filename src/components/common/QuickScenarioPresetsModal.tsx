import React, { useState } from 'react';
import {
  Target,
  X,
  Flame,
  Boxes,
  Cpu,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Play
} from 'lucide-react';
import { useApp, PRESET_SCENARIOS, PresetScenario } from '../../context/AppContext';
import { sound } from '../../services/soundFx';

export const QuickScenarioPresetsModal: React.FC = () => {
  const { isScenarioModalOpen, setIsScenarioModalOpen, applyPresetScenario } = useApp();
  const [filterCategory, setFilterCategory] = useState<string>('all');

  if (!isScenarioModalOpen) return null;

  const getScenarioIcon = (cat: string) => {
    switch (cat) {
      case 'critical':
        return <Flame className="w-6 h-6 text-[#FE5C73]" />;
      case 'warning':
        return <Boxes className="w-6 h-6 text-[#FFBB38]" />;
      case 'predictive':
        return <Cpu className="w-6 h-6 text-[#2D60FF]" />;
      case 'success':
        return <ShieldCheck className="w-6 h-6 text-[#10B981]" />;
      default:
        return <Target className="w-6 h-6 text-[#2D60FF]" />;
    }
  };

  const getBadgeStyle = (cat: string) => {
    switch (cat) {
      case 'critical':
        return 'bg-[#FFEBEF] text-[#FE5C73] border-[#FE5C73]/30';
      case 'warning':
        return 'bg-[#FFF5D9] text-[#FFBB38] border-[#FFBB38]/30';
      case 'predictive':
        return 'bg-[#E7EDFF] text-[#2D60FF] border-[#2D60FF]/30';
      case 'success':
        return 'bg-[#E1F8EC] text-[#10B981] border-[#10B981]/30';
      default:
        return 'bg-[#F5F7FA] text-[#718EBF] border-[#E6EFF5]';
    }
  };

  const filteredScenarios =
    filterCategory === 'all'
      ? PRESET_SCENARIOS
      : PRESET_SCENARIOS.filter(s => s.category === filterCategory);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
      onClick={() => setIsScenarioModalOpen(false)}
    >
      <div
        className="w-full max-w-4xl bg-white border border-[#E6EFF5] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.18)] overflow-hidden flex flex-col max-h-[88vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#E6EFF5] bg-gradient-to-r from-[#2D60FF] to-[#1230AE] text-white flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <Target className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-white tracking-tight">
                  1-Click Demonstration Scenarios
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#16DBCC] text-white text-[10px] font-black uppercase tracking-wider">
                  Expo Ready
                </span>
              </div>
              <p className="text-xs text-white/80 mt-0.5">
                Instant preset test cases for live demonstrations, judges review, and anomaly forensics
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsScenarioModalOpen(false)}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="px-6 py-3 bg-[#F5F7FA] border-b border-[#E6EFF5] flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'all', label: 'All Scenarios (4)' },
            { id: 'critical', label: 'Critical Incident RCA' },
            { id: 'warning', label: 'Supplier & Material Variance' },
            { id: 'predictive', label: 'Predictive SPC & Twin' },
            { id: 'success', label: 'Certified DPP Compliance' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setFilterCategory(cat.id);
                sound.playClick();
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors ${
                filterCategory === cat.id
                  ? 'bg-[#2D60FF] text-white shadow-xs'
                  : 'bg-white hover:bg-[#EEF2F6] text-[#718EBF] border border-[#E6EFF5]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Scenarios Grid */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredScenarios.map(sc => (
              <div
                key={sc.id}
                onClick={() => applyPresetScenario(sc.id)}
                className="p-5 rounded-3xl bg-[#F5F7FA] hover:bg-[#EEF2F6] border border-[#E6EFF5] hover:border-[#2D60FF]/40 cursor-pointer transition-all duration-200 flex flex-col justify-between group shadow-xs hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center">
                      {getScenarioIcon(sc.category)}
                    </div>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${getBadgeStyle(
                        sc.category
                      )}`}
                    >
                      {sc.badge}
                    </span>
                  </div>

                  <h4 className="text-sm font-extrabold text-[#343C6A] group-hover:text-[#2D60FF] transition-colors leading-snug">
                    {sc.title}
                  </h4>
                  <p className="text-xs text-[#718EBF] mt-1.5 leading-relaxed">
                    {sc.description}
                  </p>

                  {/* Highlights */}
                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    {sc.highlights.map((hl, hIdx) => (
                      <span
                        key={hIdx}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white text-[#343C6A] border border-[#E6EFF5]"
                      >
                        {hl}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-[#DFEAF2] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] font-mono text-[#718EBF]">
                    <span>Batch: <strong className="text-[#343C6A]">{sc.targetBatchId}</strong></span>
                    <span>•</span>
                    <span>Machine: <strong className="text-[#343C6A]">{sc.targetMachineId}</strong></span>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-[#2D60FF] group-hover:translate-x-1 transition-transform">
                    <span>Apply & Jump</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E6EFF5] bg-[#F5F7FA] flex items-center justify-between text-xs text-[#718EBF]">
          <span>Tip: You can also press <kbd className="px-2 py-0.5 bg-white border rounded font-mono font-bold text-[#343C6A]">Ctrl + D</kbd> to launch the full 17-step Expo tour</span>
          <button
            onClick={() => setIsScenarioModalOpen(false)}
            className="px-4 py-1.5 rounded-full bg-white text-[#343C6A] hover:bg-[#EEF2F6] font-bold border border-[#E6EFF5] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
