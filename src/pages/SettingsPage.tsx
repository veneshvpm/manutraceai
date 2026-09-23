import React, { useState } from 'react';
import {
  Settings,
  Factory,
  Cpu,
  ShieldCheck,
  Save,
  CheckCircle2,
  Sliders,
  Database,
  Terminal,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INDUSTRIES } from '../data/industries';
import { IndustryType } from '../types';

export const SettingsPage: React.FC = () => {
  const { currentIndustry, setIndustry, industryConfig } = useApp();
  const [savedNotice, setSavedNotice] = useState(false);

  // Configurable thresholds
  const [tempThreshold, setTempThreshold] = useState(180);
  const [vibrationThreshold, setVibrationThreshold] = useState(3.0);
  const [defectEscapesAutoQuarantine, setDefectEscapesAutoQuarantine] = useState(true);
  const [mlEndpoint, setMlEndpoint] = useState('https://ai.manutrace.internal/v1/infer/spc-anomaly');

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E2D4A] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan uppercase tracking-widest mb-1">
            <Settings className="w-4 h-4" />
            <span>Universal Architecture & Platform Governance</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            System Configuration & Universal Schemas
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Customize multi-industry nomenclature, SPC statistical limits, and ML inference endpoints
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan text-white text-xs font-bold uppercase tracking-wider hover:opacity-95 shadow-glow-cyan transition-all"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{savedNotice ? 'Settings Saved!' : 'Save Configuration'}</span>
        </button>
      </div>

      {savedNotice && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Configuration applied to active session and edge daemons.</span>
        </div>
      )}

      {/* Grid of Configuration Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Universal Industry Sector Switcher & Dynamic Nomenclature */}
        <div className="p-6 rounded-2xl bg-[#0F1626] border border-[#1E2D4A] shadow-card-dark space-y-5">
          <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-3">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Factory className="w-4 h-4 text-cyan" />
              Universal Sector Schema
            </h3>
            <span className="text-xs font-mono text-cyan">Multi-Tenant</span>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-mono uppercase text-slate-400 block">
              Active Industry Context:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(Object.keys(INDUSTRIES) as IndustryType[]).map(indKey => {
                const isSelected = currentIndustry === indKey;
                return (
                  <button
                    key={indKey}
                    onClick={() => setIndustry(indKey)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-cyan/15 border-cyan text-cyan font-bold shadow-glow-cyan/20'
                        : 'bg-[#131D31] border-[#1E2D4A] text-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <span className="text-xs block">{INDUSTRIES[indKey].name}</span>
                    <span className="text-[10px] text-slate-400 font-mono font-normal">
                      Focus: {INDUSTRIES[indKey].sampleFocus.slice(0, 32)}...
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Nomenclature Preview */}
          <div className="pt-2 border-t border-[#1E2D4A]/60 space-y-2">
            <span className="text-xs font-mono uppercase text-slate-400 block">
              Dynamic Vocabulary Mapping ({industryConfig.name.split(' ')[0]}):
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 rounded bg-[#131D31] border border-[#1E2D4A]">
                <span className="text-[10px] text-slate-500 block">Product Entity:</span>
                <span className="text-cyan font-bold">{industryConfig.terminology.productLabel}</span>
              </div>
              <div className="p-2 rounded bg-[#131D31] border border-[#1E2D4A]">
                <span className="text-[10px] text-slate-500 block">Batch Entity:</span>
                <span className="text-cyan font-bold">{industryConfig.terminology.batchLabel}</span>
              </div>
              <div className="p-2 rounded bg-[#131D31] border border-[#1E2D4A]">
                <span className="text-[10px] text-slate-500 block">Material Entity:</span>
                <span className="text-cyan font-bold">{industryConfig.terminology.materialLabel}</span>
              </div>
              <div className="p-2 rounded bg-[#131D31] border border-[#1E2D4A]">
                <span className="text-[10px] text-slate-500 block">Process Unit:</span>
                <span className="text-cyan font-bold">{industryConfig.terminology.processLabel}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Statistical Process Control (SPC) & Edge Guardrails */}
        <div className="p-6 rounded-2xl bg-[#0F1626] border border-[#1E2D4A] shadow-card-dark space-y-5">
          <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-3">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              SPC Statistical Guardrails & Thresholds
            </h3>
            <span className="text-xs font-mono text-amber-400">Automated Quarantine</span>
          </div>

          <div className="space-y-4 text-xs font-mono">
            {/* Nominal Temp */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-300">Nominal Process Temperature:</span>
                <span className="text-cyan font-bold">{tempThreshold}°C</span>
              </div>
              <input
                type="range"
                min="160"
                max="200"
                value={tempThreshold}
                onChange={e => setTempThreshold(Number(e.target.value))}
                className="w-full accent-cyan h-2 bg-[#131D31] rounded-lg"
              />
            </div>

            {/* Vibration Threshold */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-300">Max Allowable Spindle Vibration:</span>
                <span className="text-amber-400 font-bold">{vibrationThreshold} mm/s</span>
              </div>
              <input
                type="range"
                min="1.5"
                max="5.0"
                step="0.1"
                value={vibrationThreshold}
                onChange={e => setVibrationThreshold(Number(e.target.value))}
                className="w-full accent-amber-400 h-2 bg-[#131D31] rounded-lg"
              />
            </div>

            {/* Auto-quarantine Toggle */}
            <div className="p-3 rounded-xl bg-[#131D31] border border-[#1E2D4A] flex items-center justify-between">
              <div>
                <span className="text-slate-200 font-bold block">
                  Automatic Batch Quarantine
                </span>
                <span className="text-[10px] text-slate-400 font-sans">
                  Hold downstream shipments when AI anomaly confidence &gt; 90%
                </span>
              </div>
              <button
                onClick={() => setDefectEscapesAutoQuarantine(!defectEscapesAutoQuarantine)}
                className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                  defectEscapesAutoQuarantine ? 'bg-cyan' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                    defectEscapesAutoQuarantine ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Machine Learning / Python REST API Endpoint */}
          <div className="pt-2 border-t border-[#1E2D4A]/60 space-y-2">
            <span className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan" />
              Machine Learning Backend Integration:
            </span>
            <input
              type="text"
              value={mlEndpoint}
              onChange={e => setMlEndpoint(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#131D31] border border-[#1E2D4A] text-xs font-mono text-cyan focus:outline-none focus:border-cyan"
            />
            <p className="text-[10px] text-slate-500 font-mono">
              Heuristic fallback active. Plug external FastAPI / ONNX / TorchServe URL for deep neural weights.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
