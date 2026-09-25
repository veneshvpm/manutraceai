import React, { useState } from 'react';
import {
  Layers,
  Cpu,
  Zap,
  Boxes,
  ShieldCheck,
  Sliders,
  FileText,
  BrainCircuit,
  Target,
  ChevronDown,
  Check,
  Sparkles
} from 'lucide-react';
import { useApp, PRESET_SCENARIOS } from '../../context/AppContext';
import { sound } from '../../services/soundFx';

export const ContextualBreadcrumbBar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentIndustry,
    industryConfig,
    batches,
    machines,
    selectedBatchId,
    setSelectedBatchId,
    selectedMachineId,
    setSelectedMachineId,
    setIsCopilotOpen,
    setIsScenarioModalOpen,
    setIsExportDossierOpen,
    showToast
  } = useApp();

  const [isBatchPickerOpen, setIsBatchPickerOpen] = useState(false);
  const [isMachinePickerOpen, setIsMachinePickerOpen] = useState(false);

  const getModuleTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        return 'Overview Dashboard';
      case 'dataset':
        return 'Industrial Dataset Studio';
      case 'passport':
        return 'Digital Product Passport';
      case 'products':
        return 'Products & Lots Directory';
      case 'traceability':
        return 'Forward Genealogy Trace';
      case 'reverse-trace':
        return 'Backward / Reverse Trace';
      case 'ai-intelligence':
        return 'AI Anomaly Intelligence';
      case 'rca':
        return 'Root Cause Diagnostics';
      case 'impact':
        return 'Impact & Blast Radius';
      case 'simulator':
        return 'Digital Twin Simulator';
      case 'quality':
        return 'Quality Inspection Gateways';
      case 'suppliers':
        return 'Supplier Scorecard Matrix';
      case 'machines':
        return 'Machine Fleet Telemetry';
      case 'scada':
        return 'Microgrid SCADA & EMS';
      case 'human-security':
        return 'Human Security & Worker Safety HSE';
      case 'analytics':
        return 'Executive Analytics';
      case 'reports':
        return 'Compliance & Audit Reports';
      case 'settings':
        return 'Plant Configuration';
      default:
        return 'Manufacturing Operations';
    }
  };

  const activeBatch = batches.find(b => b.id === selectedBatchId) || batches[0];
  const activeMachine = machines.find(m => m.id === selectedMachineId) || machines[0];

  return (
    <div className="bg-white border-b border-[#E6EFF5] px-8 py-2.5 flex items-center justify-between gap-4 text-xs select-none sticky top-20 z-10 shadow-xs">
      {/* Left: Breadcrumbs & Fast Switchers */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-[#718EBF] font-medium">
          <span className="font-semibold text-[#343C6A]">{industryConfig.name.split(' ')[0]}</span>
          <span>/</span>
          <span className="text-[#2D60FF] font-bold">{getModuleTitle(activeTab)}</span>
        </div>

        <div className="h-4 w-px bg-[#E6EFF5] hidden sm:block" />

        {/* Fast Batch Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsBatchPickerOpen(!isBatchPickerOpen);
              setIsMachinePickerOpen(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F7FA] hover:bg-[#EEF2F6] text-[#343C6A] font-bold border border-[#E6EFF5] transition-colors"
            title="Switch Active Production Lot"
          >
            <Layers className="w-3.5 h-3.5 text-[#2D60FF]" />
            <span className="font-mono">{selectedBatchId}</span>
            {activeBatch?.anomalyDetected && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#FE5C73] animate-pulse" />
            )}
            <ChevronDown className="w-3 h-3 text-[#718EBF]" />
          </button>

          {isBatchPickerOpen && (
            <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-white border border-[#E6EFF5] shadow-[0_10px_30px_rgba(0,0,0,0.12)] p-2 z-50 animate-fade-in">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#718EBF] border-b border-[#E6EFF5]">
                Switch Active Batch ({batches.length} lots)
              </div>
              <div className="max-h-60 overflow-y-auto mt-1 space-y-1">
                {batches.map(b => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setSelectedBatchId(b.id);
                      setIsBatchPickerOpen(false);
                      sound.playClick();
                      showToast({
                        type: b.anomalyDetected ? 'warning' : 'info',
                        title: `Active Batch: ${b.id}`,
                        message: `${b.productName} (${b.passRate}% pass rate).`
                      });
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                      selectedBatchId === b.id
                        ? 'bg-[#E7EDFF] text-[#2D60FF] font-bold'
                        : 'hover:bg-[#F5F7FA] text-[#343C6A]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold">{b.id}</span>
                        {b.anomalyDetected ? (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#FFEBEF] text-[#FE5C73]">
                            Flagged
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#E1F8EC] text-[#10B981]">
                            {b.passRate}% Pass
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#718EBF] truncate max-w-[190px]">
                        {b.productName}
                      </p>
                    </div>
                    {selectedBatchId === b.id && <Check className="w-3.5 h-3.5 text-[#2D60FF]" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Fast Machine Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsMachinePickerOpen(!isMachinePickerOpen);
              setIsBatchPickerOpen(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F7FA] hover:bg-[#EEF2F6] text-[#343C6A] font-bold border border-[#E6EFF5] transition-colors"
            title="Switch Active Machine"
          >
            <Cpu className="w-3.5 h-3.5 text-[#FFBB38]" />
            <span className="font-mono">{selectedMachineId}</span>
            <ChevronDown className="w-3 h-3 text-[#718EBF]" />
          </button>

          {isMachinePickerOpen && (
            <div className="absolute left-0 mt-2 w-64 rounded-2xl bg-white border border-[#E6EFF5] shadow-[0_10px_30px_rgba(0,0,0,0.12)] p-2 z-50 animate-fade-in">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#718EBF] border-b border-[#E6EFF5]">
                Switch Active Machine
              </div>
              <div className="max-h-60 overflow-y-auto mt-1 space-y-1">
                {machines.map(m => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedMachineId(m.id);
                      setIsMachinePickerOpen(false);
                      sound.playClick();
                      showToast({
                        type: 'info',
                        title: `Active Machine: ${m.id}`,
                        message: `${m.name} (${m.line}).`
                      });
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                      selectedMachineId === m.id
                        ? 'bg-[#FFF5D9] text-[#FFBB38] font-bold'
                        : 'hover:bg-[#F5F7FA] text-[#343C6A]'
                    }`}
                  >
                    <div>
                      <span className="font-mono text-xs font-bold">{m.id}</span>
                      <p className="text-[11px] text-[#718EBF] truncate">{m.name}</p>
                    </div>
                    {selectedMachineId === m.id && <Check className="w-3.5 h-3.5 text-[#FFBB38]" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Quick Action Hub Speed-Dial */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => {
            sound.playClick();
            setIsScenarioModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF5D9] text-[#FFBB38] hover:bg-[#ffecc0] font-bold text-xs transition-colors shadow-xs"
          title="Launch 1-Click Preset Demonstration Scenarios"
        >
          <Target className="w-3.5 h-3.5" />
          <span>Preset Scenarios</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('rca');
          }}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-xs transition-colors ${
            activeTab === 'rca'
              ? 'bg-[#2D60FF] text-white shadow-xs'
              : 'bg-[#F5F7FA] text-[#343C6A] hover:bg-[#E7EDFF] hover:text-[#2D60FF]'
          }`}
          title="Jump to Root Cause Diagnostics"
        >
          <Zap className="w-3.5 h-3.5 text-[#FE5C73]" />
          <span>RCA</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('reverse-trace');
          }}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-xs transition-colors ${
            activeTab === 'reverse-trace'
              ? 'bg-[#16DBCC] text-white shadow-xs'
              : 'bg-[#F5F7FA] text-[#343C6A] hover:bg-[#DCFAF8] hover:text-[#16DBCC]'
          }`}
          title="Jump to Reverse Blast Radius"
        >
          <Boxes className="w-3.5 h-3.5 text-[#16DBCC]" />
          <span>Reverse Trace</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('passport');
          }}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-xs transition-colors ${
            activeTab === 'passport'
              ? 'bg-[#2D60FF] text-white shadow-xs'
              : 'bg-[#F5F7FA] text-[#343C6A] hover:bg-[#E7EDFF] hover:text-[#2D60FF]'
          }`}
          title="Jump to Digital Product Passport"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#2D60FF]" />
          <span>Passport</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('simulator');
          }}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-xs transition-colors ${
            activeTab === 'simulator'
              ? 'bg-[#FFBB38] text-white shadow-xs'
              : 'bg-[#F5F7FA] text-[#343C6A] hover:bg-[#FFF5D9] hover:text-[#FFBB38]'
          }`}
          title="Jump to What-If Process Simulator"
        >
          <Sliders className="w-3.5 h-3.5 text-[#FFBB38]" />
          <span>Simulator</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setIsExportDossierOpen(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F7FA] hover:bg-[#EEF2F6] text-[#343C6A] hover:text-[#2D60FF] font-bold text-xs border border-[#E6EFF5] transition-colors"
          title="Export / Print Batch Audit Dossier (Ctrl+E)"
        >
          <FileText className="w-3.5 h-3.5 text-[#718EBF]" />
          <span className="hidden sm:inline">Export Audit PDF</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setIsCopilotOpen(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#2D60FF] to-[#1230AE] text-white font-bold text-xs shadow-xs hover:opacity-95 transition-all"
          title="Launch AI Manufacturing Copilot (Ctrl+J)"
        >
          <BrainCircuit className="w-3.5 h-3.5 text-white animate-spin" style={{ animationDuration: '8s' }} />
          <span>Ask AI</span>
        </button>
      </div>
    </div>
  );
};
