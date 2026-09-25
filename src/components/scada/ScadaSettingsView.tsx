import React, { useState } from 'react';
import {
  Settings,
  Save,
  RotateCcw,
  Sliders,
  CheckCircle,
  ShieldAlert,
  Battery,
  Zap,
  Cpu,
  Clock
} from 'lucide-react';
import { EmsMode } from '../../services/scadaEngine';
import { sound } from '../../services/soundFx';

interface ScadaSettingsViewProps {
  emsMode: EmsMode;
  onUpdateEmsMode: (mode: EmsMode) => void;
  onShowToast: (toast: { type: 'success' | 'info' | 'warning' | 'error'; title: string; message: string }) => void;
  userRole?: string;
}

export const ScadaSettingsView: React.FC<ScadaSettingsViewProps> = ({
  emsMode,
  onUpdateEmsMode,
  onShowToast,
  userRole = 'engineer'
}) => {
  const [minSoc, setMinSoc] = useState('20.0');
  const [maxSoc, setMaxSoc] = useState('100.0');
  const [peakStart, setPeakStart] = useState('14:00');
  const [peakEnd, setPeakEnd] = useState('20:00');
  const [peakRate, setPeakRate] = useState('0.18');
  const [offPeakRate, setOffPeakRate] = useState('0.05');
  const [exportEnabled, setExportEnabled] = useState(true);
  const [selectedMode, setSelectedMode] = useState<EmsMode>(emsMode);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSuccess();
    onUpdateEmsMode(selectedMode);
    onShowToast({
      type: 'success',
      title: 'Settings Saved',
      message: 'Updated master SCADA EMS dispatch and tariff setpoints in EEPROM memory.'
    });
  };

  const handleReset = () => {
    sound.playClick();
    setMinSoc('20.0');
    setMaxSoc('100.0');
    setPeakStart('14:00');
    setPeakEnd('20:00');
    setPeakRate('0.18');
    setOffPeakRate('0.05');
    setExportEnabled(true);
    setSelectedMode('AUTO_ECO');
    onShowToast({
      type: 'info',
      title: 'Settings Restored',
      message: 'Factory nominal defaults restored.'
    });
  };

  return (
    <div className="space-y-6 select-none animate-fade-in">
      <div className="bg-white p-6 rounded-3xl border border-[#E6EFF5] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-xl text-[#343C6A]">SCADA System Setpoints & Parameter Tuning</h3>
          <p className="text-xs text-[#718EBF] mt-1">
            Configure BESS operational depth of discharge, dynamic Time-of-Use tariff brackets, and grid export policy.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 rounded-2xl bg-[#F5F7FA] hover:bg-[#EEF2F6] text-[#718EBF] text-xs font-bold transition-colors"
          >
            Restore Defaults
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card: BESS & Battery Limits */}
        <div className="bg-white p-6 rounded-3xl border border-[#E6EFF5] shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-[#E6EFF5] pb-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
              <Battery className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-[#343C6A]">BESS Protection Setpoints</h4>
              <span className="text-xs text-[#718EBF]">Depth-of-Discharge (DoD) & Cycle Life Guard</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#718EBF] font-bold mb-1">Battery Min SOC (% Cutoff):</label>
              <input
                type="number"
                value={minSoc}
                onChange={(e) => setMinSoc(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-[#E6EFF5] bg-[#F5F7FA] font-mono text-sm focus:outline-none focus:border-[#2D60FF]"
              />
            </div>
            <div>
              <label className="block text-[#718EBF] font-bold mb-1">Battery Max SOC (% Ceiling):</label>
              <input
                type="number"
                value={maxSoc}
                onChange={(e) => setMaxSoc(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-[#E6EFF5] bg-[#F5F7FA] font-mono text-sm focus:outline-none focus:border-[#2D60FF]"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5] text-xs font-mono text-[#718EBF] space-y-1">
            <div className="flex justify-between"><span>Nominal Chemistry:</span><strong className="text-[#343C6A]">LFP (LiFePO4) 3.2V / Cell</strong></div>
            <div className="flex justify-between"><span>Pack Usable Capacity:</span><strong className="text-[#343C6A]">80 kWh (80% DoD)</strong></div>
            <div className="flex justify-between"><span>Thermal Safety Cutoff:</span><strong className="text-rose-500">55.0 °C</strong></div>
          </div>
        </div>

        {/* Right Card: TOU Tariff & Utility Policy */}
        <div className="bg-white p-6 rounded-3xl border border-[#E6EFF5] shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-[#E6EFF5] pb-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-[#343C6A]">Time-of-Use Tariff Arbitrage</h4>
              <span className="text-xs text-[#718EBF]">Utility Billing Schedule & Feed-in Tariffs</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#718EBF] font-bold mb-1">Peak Tariff Start Window:</label>
              <input
                type="text"
                value={peakStart}
                onChange={(e) => setPeakStart(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-[#E6EFF5] bg-[#F5F7FA] font-mono text-sm focus:outline-none focus:border-[#2D60FF]"
              />
            </div>
            <div>
              <label className="block text-[#718EBF] font-bold mb-1">Peak Tariff End Window:</label>
              <input
                type="text"
                value={peakEnd}
                onChange={(e) => setPeakEnd(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-[#E6EFF5] bg-[#F5F7FA] font-mono text-sm focus:outline-none focus:border-[#2D60FF]"
              />
            </div>
            <div>
              <label className="block text-[#718EBF] font-bold mb-1">Peak Rate ($/kWh):</label>
              <input
                type="number"
                step="0.01"
                value={peakRate}
                onChange={(e) => setPeakRate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-[#E6EFF5] bg-[#F5F7FA] font-mono text-sm focus:outline-none focus:border-[#2D60FF]"
              />
            </div>
            <div>
              <label className="block text-[#718EBF] font-bold mb-1">Off-Peak Rate ($/kWh):</label>
              <input
                type="number"
                step="0.01"
                value={offPeakRate}
                onChange={(e) => setOffPeakRate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-[#E6EFF5] bg-[#F5F7FA] font-mono text-sm focus:outline-none focus:border-[#2D60FF]"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5] flex items-center justify-between text-xs">
            <div>
              <strong className="text-[#343C6A] block">Grid Surplus Export Enabled</strong>
              <span className="text-[#718EBF]">Sell back clean excess generation to 11kV utility grid</span>
            </div>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setExportEnabled(!exportEnabled);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                exportEnabled ? 'bg-[#DCFAF8] text-[#16DBCC]' : 'bg-[#FFEBEF] text-[#FE5C73]'
              }`}
            >
              {exportEnabled ? 'ENABLED (ON)' : 'DISABLED (OFF)'}
            </button>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="lg:col-span-2 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-[#2D60FF] hover:bg-[#1230AE] text-white text-xs font-bold transition-all shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>Save & Deploy Setpoints to EEPROM</span>
          </button>
        </div>
      </form>
    </div>
  );
};
