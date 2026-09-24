import React from 'react';
import {
  Keyboard,
  X,
  Search,
  BrainCircuit,
  Sparkles,
  FileText,
  Volume2,
  Sliders,
  Target,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const KeyboardShortcutsModal: React.FC = () => {
  const { isShortcutsOpen, setIsShortcutsOpen } = useApp();

  if (!isShortcutsOpen) return null;

  const shortcutGroups = [
    {
      title: 'Global Navigation & Tools',
      items: [
        { key: 'Ctrl + K', desc: 'Open Universal Global Search & Jump to Lot/Machine' },
        { key: 'Ctrl + J', desc: 'Launch ManuTrace AI Copilot & Voice Query' },
        { key: 'Ctrl + D', desc: 'Start / Exit 5-Minute Guided Expo Story Tour' },
        { key: 'Ctrl + E', desc: 'Generate & Print ISO 9001 Batch Audit Dossier' },
        { key: '?', desc: 'Show this Keyboard Shortcuts & Productivity Guide' },
        { key: 'ESC', desc: 'Close active modal, drawer, or search overlay' }
      ]
    },
    {
      title: 'Quick Module Access',
      items: [
        { key: 'Header Pill', desc: '1-Click Industrial Sector Switcher (Automotive, Pharma, Food, etc.)' },
        { key: 'Top Ribbon', desc: 'Fast Lot Switcher & Machine Switcher from ANY tab' },
        { key: 'Preset Hub', desc: '1-Click Incident Scenario Simulation Matrix' },
        { key: 'Sound Icon', desc: 'Toggle Web Audio Industrial UI Synthesizer' }
      ]
    }
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
      onClick={() => setIsShortcutsOpen(false)}
    >
      <div
        className="w-full max-w-2xl bg-white border border-[#E6EFF5] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.18)] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#E6EFF5] bg-gradient-to-r from-[#2D60FF] to-[#1230AE] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center">
              <Keyboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                Keyboard Shortcuts & Productivity Hub
              </h3>
              <p className="text-xs text-white/80">
                Accelerate plant diagnostics and demonstration navigation
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsShortcutsOpen(false)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          {shortcutGroups.map((grp, gIdx) => (
            <div key={gIdx} className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#718EBF]">
                {grp.title}
              </h4>
              <div className="space-y-2">
                {grp.items.map((item, iIdx) => (
                  <div
                    key={iIdx}
                    className="flex items-center justify-between p-3 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5]"
                  >
                    <span className="text-xs text-[#343C6A] font-medium">{item.desc}</span>
                    <kbd className="px-3 py-1 rounded-xl bg-white border border-[#E6EFF5] text-xs font-mono font-bold text-[#2D60FF] shadow-xs">
                      {item.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E6EFF5] bg-[#F5F7FA] flex items-center justify-end">
          <button
            onClick={() => setIsShortcutsOpen(false)}
            className="px-5 py-2 rounded-full bg-[#2D60FF] hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
