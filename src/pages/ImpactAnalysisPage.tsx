import React, { useState } from 'react';
import {
  AlertTriangle,
  Cpu,
  Layers,
  Package,
  CheckCircle2,
  ArrowDown,
  Sliders,
  AlertOctagon
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateImpact } from '../services/aiEngine';
import { RiskLevel } from '../types';

export const ImpactAnalysisPage: React.FC = () => {
  const { selectedMachineId, setActiveTab } = useApp();
  const [activeRiskLevel, setActiveRiskLevel] = useState<RiskLevel>('high');

  const machineId = selectedMachineId || 'M04';
  const impact = calculateImpact({
    sourceType: 'machine',
    sourceId: machineId,
    eventDurationMinutes: 35
  });

  const [holdIssued, setHoldIssued] = useState(false);

  return (
    <div className="p-8 space-y-7 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#343C6A] tracking-tight flex items-center gap-3">
            <span>Defect Impact Analysis</span>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                activeRiskLevel === 'critical'
                  ? 'bg-[#FE5C73] text-white'
                  : activeRiskLevel === 'high'
                  ? 'bg-[#FFEBEF] text-[#FE5C73]'
                  : activeRiskLevel === 'medium'
                  ? 'bg-[#FFF5D9] text-[#FFBB38]'
                  : 'bg-[#E1F8EC] text-[#10B981]'
              }`}
            >
              RISK: {activeRiskLevel.toUpperCase()}
            </span>
          </h1>
          <p className="text-xs text-[#718EBF] mt-1 font-medium">
            Cascading consequence tree evaluating downstream lots, product integrity, quality gate mandates, and customer exposure
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('simulator')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2D60FF] hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-[0_4px_12px_rgba(45,96,255,0.35)]"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Open Simulator</span>
          </button>
        </div>
      </div>

      {/* Primary Scenario Card */}
      <div className="p-6 rounded-3xl bg-white border border-[#E6EFF5] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FFEBEF] text-[#FE5C73] flex items-center justify-center flex-shrink-0">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#FFEBEF] text-[#FE5C73]">
                SCENARIO TRIGGER
              </span>
              <span className="text-xs text-[#718EBF]">
                Event Duration: 35 Minutes Sustained
              </span>
            </div>
            <h3 className="text-lg font-bold text-[#343C6A] mt-1">
              Machine <span className="text-[#FEAA09] font-mono">{machineId}</span> experienced abnormal temperature for 35 minutes.
            </h3>
            <p className="text-xs text-[#718EBF] mt-0.5">
              Temperature logged at 182°C (nominal setpoint 180°C ± 1.5°C). Immediate cascading ripple calculated below.
            </p>
          </div>
        </div>

        {/* Risk Level Selector */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-shrink-0">
          <span className="text-xs text-[#718EBF] font-semibold">Classification:</span>
          <div className="flex items-center gap-1.5 bg-[#F5F7FA] p-1 rounded-full border border-[#E6EFF5]">
            {(['low', 'medium', 'high', 'critical'] as const).map(lvl => (
              <button
                key={lvl}
                onClick={() => setActiveRiskLevel(lvl)}
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition-colors ${
                  activeRiskLevel === lvl
                    ? lvl === 'critical'
                      ? 'bg-[#FE5C73] text-white'
                      : lvl === 'high'
                      ? 'bg-[#FE5C73] text-white'
                      : lvl === 'medium'
                      ? 'bg-[#FFBB38] text-white'
                      : 'bg-[#10B981] text-white'
                    : 'text-[#718EBF] hover:text-[#343C6A]'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4 KEY METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-3xl bg-white border border-[#E6EFF5] shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#E7EDFF] text-[#2D60FF] flex items-center justify-center flex-shrink-0">
            <Layers className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-[#718EBF] font-medium block">
              Affected Batches
            </span>
            <div className="text-2xl font-black text-[#343C6A] font-mono mt-0.5">
              {impact.affectedBatchesCount} Lots
            </div>
            <p className="text-[11px] text-[#718EBF]">B-1042, B-1043, B-1045 on Line 04</p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#E6EFF5] shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FFF5D9] text-[#FFBB38] flex items-center justify-center flex-shrink-0">
            <Package className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-[#718EBF] font-medium block">
              Affected Products
            </span>
            <div className="text-2xl font-black text-[#FEAA09] font-mono mt-0.5">
              {impact.affectedProductsCount} Units
            </div>
            <p className="text-[11px] text-[#718EBF]">Brake Component series</p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#E6EFF5] shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#DCFAF8] text-[#16DBCC] flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-[#718EBF] font-medium block">
              Audits Required
            </span>
            <div className="text-2xl font-black text-[#16DBCC] font-mono mt-0.5">
              {impact.quarantineInspectionsRequired} Tests
            </div>
            <p className="text-[11px] text-[#718EBF]">Full CMM non-destructive scans</p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#E6EFF5] shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FFEBEF] text-[#FE5C73] flex items-center justify-center flex-shrink-0">
            <AlertOctagon className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-[#718EBF] font-medium block">
              Potential Rework Units
            </span>
            <div className="text-2xl font-black text-[#FE5C73] font-mono mt-0.5">
              {impact.potentialReworkUnits} Units
            </div>
            <p className="text-[11px] text-[#718EBF]">{impact.estimatedFinancialExposure}</p>
          </div>
        </div>
      </div>

      {/* INTERACTIVE IMPACT TREE */}
      <div className="p-6 rounded-3xl bg-white border border-[#E6EFF5] shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-[#E6EFF5] pb-4">
          <div>
            <h3 className="font-bold text-sm text-[#343C6A]">
              Cascading Interactive Impact Tree
            </h3>
            <p className="text-xs text-[#718EBF] mt-0.5">
              Machine Event → Production Batches → Products → Quality Results → Shipments
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setHoldIssued(!holdIssued)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                holdIssued
                  ? 'bg-[#E1F8EC] text-[#10B981]'
                  : 'bg-[#FFEBEF] text-[#FE5C73] hover:bg-[#FFD9E0]'
              }`}
            >
              {holdIssued ? 'Hold Notice Dispatched ✓' : 'Issue Immediate Hold'}
            </button>
          </div>
        </div>

        {/* Cascading Tree Nodes */}
        <div className="space-y-3">
          {impact.cascadingStages.map((stage: any, i: number) => (
            <div key={i} className="space-y-2">
              <div className="p-4 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5] hover:bg-[#EEF2F6] transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#E6EFF5] flex items-center justify-center font-bold text-xs text-[#2D60FF] shadow-xs">
                    0{i + 1}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#718EBF] block">
                      {stage.stage}
                    </span>
                    <h4 className="text-sm font-bold text-[#343C6A]">
                      {stage.entity}
                    </h4>
                    <p className="text-xs text-[#718EBF] mt-0.5">
                      {stage.note}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span className="text-xs text-[#718EBF]">
                    Volume: <span className="text-[#343C6A] font-bold">{stage.count}</span>
                  </span>
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full uppercase font-bold ${
                      stage.status === 'compromised'
                        ? 'bg-[#FFEBEF] text-[#FE5C73]'
                        : stage.status === 'quarantined'
                        ? 'bg-[#FFF5D9] text-[#FEAA09]'
                        : 'bg-[#E7EDFF] text-[#2D60FF]'
                    }`}
                  >
                    {stage.status}
                  </span>
                </div>
              </div>

              {/* Connecting arrow if not last */}
              {i < impact.cascadingStages.length - 1 && (
                <div className="flex justify-center -my-1">
                  <ArrowDown className="w-4 h-4 text-[#2D60FF]/50" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
