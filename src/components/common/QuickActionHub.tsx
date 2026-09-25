import React, { useState } from 'react';
import {
  Sparkles,
  BrainCircuit,
  Target,
  Search,
  FileText,
  Keyboard,
  X,
  Zap,
  Play,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { sound } from '../../services/soundFx';

export const QuickActionHub: React.FC = () => {
  const {
    setIsCopilotOpen,
    setIsScenarioModalOpen,
    setIsSearchOpen,
    setIsExportDossierOpen,
    setIsShortcutsOpen,
    startDemoTour,
    isDemoTourActive,
    setActiveTab
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);

  // If the 17-step demo tour is active, collapse the floating hub to avoid overlapping tour controls
  if (isDemoTourActive) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end select-none">
      {/* Expanded Speed-Dial Menu */}
      {isOpen && (
        <div className="mb-3 flex flex-col items-end gap-2.5 animate-slide-in">
          <button
            onClick={() => {
              setIsOpen(false);
              sound.playClick();
              setIsCopilotOpen(true);
            }}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white hover:bg-[#E7EDFF] text-[#2D60FF] text-xs font-bold shadow-[0_4px_20px_rgba(45,96,255,0.2)] border border-[#2D60FF]/25 transition-all group"
          >
            <BrainCircuit className="w-4 h-4 text-[#2D60FF]" />
            <span>AI Copilot</span>
            <kbd className="text-[10px] text-[#718EBF] font-mono bg-[#F5F7FA] px-1.5 py-0.5 rounded border">
              Ctrl+J
            </kbd>
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              sound.playClick();
              setIsScenarioModalOpen(true);
            }}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white hover:bg-[#FFF5D9] text-[#FFBB38] text-xs font-bold shadow-[0_4px_20px_rgba(255,187,56,0.2)] border border-[#FFBB38]/25 transition-all group"
          >
            <Target className="w-4 h-4 text-[#FFBB38]" />
            <span className="text-[#343C6A]">1-Click Scenarios</span>
            <span className="text-[9px] bg-[#FFF5D9] text-[#FFBB38] px-1.5 py-0.5 rounded-full font-bold">
              4 PRESETS
            </span>
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              sound.playClick();
              setActiveTab('scada');
            }}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white hover:bg-[#FFEBEF] text-[#FE5C73] text-xs font-bold shadow-[0_4px_20px_rgba(254,92,115,0.2)] border border-[#FE5C73]/25 transition-all group"
          >
            <Zap className="w-4 h-4 text-[#FE5C73]" />
            <span>Microgrid SCADA & EMS</span>
            <span className="text-[9px] bg-[#FFEBEF] text-[#FE5C73] px-1.5 py-0.5 rounded-full font-bold">
              LIVE SLD
            </span>
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              sound.playClick();
              setActiveTab('human-security');
            }}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white hover:bg-[#E1F8EC] text-[#10B981] text-xs font-bold shadow-[0_4px_20px_rgba(16,185,129,0.2)] border border-[#10B981]/25 transition-all group"
          >
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            <span className="text-[#343C6A]">Human Security & HSE</span>
            <span className="text-[9px] bg-[#E1F8EC] text-[#10B981] px-1.5 py-0.5 rounded-full font-bold">
              OSHA/EHS
            </span>
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              sound.playSuccess();
              startDemoTour();
            }}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#2D60FF] to-[#1230AE] hover:opacity-95 text-white text-xs font-bold shadow-[0_4px_20px_rgba(45,96,255,0.35)] transition-all group"
          >
            <Sparkles className="w-4 h-4 text-white animate-spin" style={{ animationDuration: '6s' }} />
            <span>5-Min Expo Story Tour</span>
            <kbd className="text-[10px] text-white/80 font-mono bg-white/20 px-1.5 py-0.5 rounded">
              Ctrl+D
            </kbd>
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              sound.playClick();
              setIsExportDossierOpen(true);
            }}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white hover:bg-[#F5F7FA] text-[#343C6A] text-xs font-bold shadow-md border border-[#E6EFF5] transition-all"
          >
            <FileText className="w-4 h-4 text-[#718EBF]" />
            <span>Print Audit Dossier</span>
            <kbd className="text-[10px] text-[#718EBF] font-mono bg-[#F5F7FA] px-1.5 py-0.5 rounded border">
              Ctrl+E
            </kbd>
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              sound.playClick();
              setIsShortcutsOpen(true);
            }}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white hover:bg-[#F5F7FA] text-[#343C6A] text-xs font-bold shadow-md border border-[#E6EFF5] transition-all"
          >
            <Keyboard className="w-4 h-4 text-[#718EBF]" />
            <span>Keyboard Shortcuts</span>
            <kbd className="text-[10px] text-[#718EBF] font-mono bg-[#F5F7FA] px-1.5 py-0.5 rounded border">
              ?
            </kbd>
          </button>
        </div>
      )}

      {/* Floating Main Trigger Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          sound.playClick();
        }}
        className={`flex items-center gap-2.5 px-5 py-3 rounded-full font-extrabold text-xs shadow-[0_8px_30px_rgba(45,96,255,0.4)] transition-all transform hover:scale-105 active:scale-95 ${
          isOpen
            ? 'bg-[#343C6A] text-white ring-4 ring-[#343C6A]/20'
            : 'bg-gradient-to-r from-[#2D60FF] via-[#1F4BFF] to-[#1230AE] text-white ring-4 ring-[#2D60FF]/25'
        }`}
        title="ManuTrace Efficiency Speed-Dial"
      >
        {isOpen ? (
          <>
            <X className="w-4 h-4" />
            <span>Close Tools</span>
          </>
        ) : (
          <>
            <BrainCircuit className="w-4 h-4 animate-pulse" />
            <span>AI & Quick Tools</span>
            <span className="w-2 h-2 rounded-full bg-[#16DBCC] animate-ping" />
          </>
        )}
      </button>
    </div>
  );
};
