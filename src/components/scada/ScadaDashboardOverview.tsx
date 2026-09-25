import React from 'react';
import {
  Zap,
  Sun,
  Wind,
  Battery,
  Cpu,
  Activity,
  AlertTriangle,
  TrendingUp,
  Radio,
  CheckCircle,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Power,
  Clock,
  Sparkles,
  RefreshCw,
  Gauge
} from 'lucide-react';
import { ScadaTelemetry, ScadaAlarm } from '../../types';
import { EmsMode } from '../../services/scadaEngine';
import { sound } from '../../services/soundFx';

interface ScadaDashboardOverviewProps {
  telemetry: ScadaTelemetry;
  alarms: ScadaAlarm[];
  history: ScadaTelemetry[];
  emsMode: EmsMode;
  onSelectTab: (tab: any) => void;
  onSelectAsset: (asset: any) => void;
  onAckAlarm: (id: string) => void;
  onRepairAlarm: (id: string) => void;
}

export const ScadaDashboardOverview: React.FC<ScadaDashboardOverviewProps> = ({
  telemetry,
  alarms,
  history,
  emsMode,
  onSelectTab,
  onSelectAsset,
  onAckAlarm,
  onRepairAlarm
}) => {
  const totalRenewableKw = telemetry.Solar_Power + telemetry.Wind_Power;
  const netGridKw = telemetry.Grid_Power;
  const isExporting = netGridKw < 0;
  const activeAlarms = alarms.filter(a => a.status === 'ACTIVE');

  // Chart scaling
  const maxKw = Math.max(
    ...history.map(h => Math.max(h.Solar_Power + h.Wind_Power, h.Load_Demand)),
    50
  ) + 10;

  return (
    <div className="space-y-6 select-none animate-fade-in">
      {/* ── Top 4 Key Metric KPI Tiles ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Clean Generation Inflow */}
        <div
          onClick={() => onSelectTab('renewables')}
          className="bg-white p-5 rounded-3xl border border-[#E6EFF5] hover:border-amber-300 transition-all cursor-pointer shadow-sm group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 group-hover:scale-105 transition-transform">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#718EBF] block">Renewable Inflow</span>
                <span className="text-xs font-extrabold text-[#343C6A]">Solar & Wind Fleet</span>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#718EBF] group-hover:text-amber-500 transition-colors" />
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-black text-[#343C6A] font-mono">{totalRenewableKw.toFixed(1)} <span className="text-sm font-bold text-[#718EBF]">kW</span></h3>
            <span className="text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">
              PV: {telemetry.Solar_Power}kW | WTG: {telemetry.Wind_Power}kW
            </span>
          </div>
        </div>

        {/* Metric 2: Industrial Factory Demand */}
        <div
          onClick={() => onSelectTab('sld')}
          className="bg-white p-5 rounded-3xl border border-[#E6EFF5] hover:border-purple-300 transition-all cursor-pointer shadow-sm group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-500 group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#718EBF] block">Plant Active Load</span>
                <span className="text-xs font-extrabold text-[#343C6A]">Tier 1 Cleanroom & CNC</span>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#718EBF] group-hover:text-purple-500 transition-colors" />
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-black text-purple-600 font-mono">{telemetry.Load_Demand.toFixed(1)} <span className="text-sm font-bold text-[#718EBF]">kW</span></h3>
            <span className="text-xs font-bold text-purple-500 bg-purple-50 px-2 py-0.5 rounded-full">
              {telemetry.Load_Current} A @ 415V
            </span>
          </div>
        </div>

        {/* Metric 3: BESS Storage State */}
        <div
          onClick={() => onSelectTab('battery')}
          className="bg-white p-5 rounded-3xl border border-[#E6EFF5] hover:border-emerald-300 transition-all cursor-pointer shadow-sm group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 group-hover:scale-105 transition-transform">
                <Battery className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#718EBF] block">BESS Storage State</span>
                <span className="text-xs font-extrabold text-[#343C6A]">100 kWh Pack (16-Cell)</span>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#718EBF] group-hover:text-emerald-500 transition-colors" />
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-black text-emerald-600 font-mono">{telemetry.Battery_SOC}% <span className="text-sm font-bold text-[#718EBF]">SOC</span></h3>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              telemetry.Battery_Current < 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
            }`}>
              {telemetry.Battery_Current < 0 ? `Charging (${telemetry.Battery_Current}A)` : `Discharging (+${telemetry.Battery_Current}A)`}
            </span>
          </div>
        </div>

        {/* Metric 4: Grid Substation Exchange */}
        <div
          onClick={() => onSelectTab('sld')}
          className="bg-white p-5 rounded-3xl border border-[#E6EFF5] hover:border-blue-300 transition-all cursor-pointer shadow-sm group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#718EBF] block">11kV Grid Intertie</span>
                <span className="text-xs font-extrabold text-[#343C6A]">Substation Synchronization</span>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#718EBF] group-hover:text-blue-500 transition-colors" />
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className={`text-2xl font-black font-mono ${isExporting ? 'text-[#16DBCC]' : 'text-amber-500'}`}>
              {isExporting ? `${netGridKw} kW` : `+${netGridKw} kW`}
            </h3>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              isExporting ? 'bg-[#DCFAF8] text-[#16DBCC]' : 'bg-[#FFF5D9] text-[#FFBB38]'
            }`}>
              {isExporting ? 'SURPLUS EXPORT' : 'UTILITY IMPORT'}
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Middle Section: Rolling Real-Time Waveform + Live Power Balance ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Rolling Telemetry Waveform */}
        <div className="lg:col-span-2 bg-[#0F172A] p-6 rounded-3xl border border-slate-800 shadow-xl text-white space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
              <div>
                <h4 className="font-extrabold text-sm font-mono text-slate-200">
                  Live Microgrid Power Balance Waveform (Rolling Past 20 Ticks)
                </h4>
                <span className="text-[10px] text-slate-400">1000ms sampling interval • Synced with mathematical physics model</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Solar</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Wind</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-400" /> Load</span>
            </div>
          </div>

          {/* Real-time Rolling Waveform Bars / Area */}
          <div className="h-56 flex items-end gap-1.5 pt-4 px-2">
            {history.slice(-20).map((pt, idx) => {
              const solarHeight = (pt.Solar_Power / maxKw) * 100;
              const windHeight = (pt.Wind_Power / maxKw) * 100;
              const loadHeight = (pt.Load_Demand / maxKw) * 100;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  <div className="absolute -top-12 bg-slate-900 border border-slate-700 text-white p-1.5 rounded-lg text-[9px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                    <div>Solar: {pt.Solar_Power} kW | Wind: {pt.Wind_Power} kW</div>
                    <div>Demand: {pt.Load_Demand} kW | SOC: {pt.Battery_SOC}%</div>
                  </div>

                  <div className="w-full flex items-end justify-center gap-0.5 h-full">
                    <div className="w-1/3 bg-amber-400/90 rounded-t-xs" style={{ height: `${solarHeight}%` }} />
                    <div className="w-1/3 bg-cyan-400/90 rounded-t-xs" style={{ height: `${windHeight}%` }} />
                    <div className="w-1/3 bg-purple-400/90 rounded-t-xs" style={{ height: `${loadHeight}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-800">
            <span>T - 20s</span>
            <span>T - 10s</span>
            <span>LIVE NOW (T-0)</span>
          </div>
        </div>

        {/* Right 1 Col: Quick Asset Trigger Cards & Breakers */}
        <div className="bg-white p-6 rounded-3xl border border-[#E6EFF5] shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#E6EFF5] pb-3 mb-3">
              <h4 className="font-extrabold text-sm text-[#343C6A]">Hardware Faceplate Jump Deck</h4>
              <span className="text-[10px] font-mono text-[#718EBF]">Click to open PLC faceplate</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'solar', name: 'Solar Array', kw: `${telemetry.Solar_Power} kW`, icon: Sun, color: 'text-amber-500 bg-amber-50' },
                { id: 'wind', name: 'Wind Turbine', kw: `${telemetry.Wind_Power} kW`, icon: Wind, color: 'text-cyan-500 bg-cyan-50' },
                { id: 'battery', name: 'BESS Rack', kw: `${telemetry.Battery_SOC}% SOC`, icon: Battery, color: 'text-emerald-500 bg-emerald-50' },
                { id: 'inverter', name: 'PCS Inverter', kw: `${telemetry.Inverter_Efficiency}% Eff`, icon: Cpu, color: 'text-blue-500 bg-blue-50' },
                { id: 'load', name: 'Plant Demand', kw: `${telemetry.Load_Demand} kW`, icon: Layers, color: 'text-purple-500 bg-purple-50' },
                { id: 'grid', name: '11kV Grid', kw: `${(telemetry.Grid_Voltage / 1000).toFixed(1)} kV`, icon: Zap, color: 'text-indigo-500 bg-indigo-50' }
              ].map((asset) => {
                const AssetIcon = asset.icon;
                return (
                  <button
                    key={asset.id}
                    onClick={() => {
                      sound.playClick();
                      onSelectAsset(asset.id);
                    }}
                    className="p-3 rounded-2xl border border-[#E6EFF5] hover:border-[#2D60FF] bg-[#F5F7FA] hover:bg-white text-left transition-all group shadow-xs"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${asset.color}`}>
                        <AssetIcon className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-[#343C6A] truncate">{asset.name}</span>
                    </div>
                    <span className="text-[11px] font-mono text-[#718EBF] block">{asset.kw}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#E7EDFF] border border-[#2D60FF]/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#2D60FF] font-bold">
              <Sparkles className="w-4 h-4" />
              <span>EMS Active Strategy:</span>
            </div>
            <strong className="text-[#2D60FF] font-extrabold">{emsMode.replace('_', ' ')}</strong>
          </div>
        </div>
      </div>

      {/* ── Active Alarms & AI Fault Diagnostics Live Ticker ── */}
      <div className="bg-white p-6 rounded-3xl border border-[#E6EFF5] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-[#FE5C73]">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-[#343C6A]">Active SCADA Alarms & AI Remediation</h4>
              <span className="text-[11px] text-[#718EBF]">{activeAlarms.length} Active Alarms in Substation Buffer</span>
            </div>
          </div>
          <button
            onClick={() => onSelectTab('alarms')}
            className="text-xs font-bold text-[#2D60FF] hover:underline"
          >
            View Full Alarms Matrix & Advisor →
          </button>
        </div>

        {activeAlarms.length === 0 ? (
          <div className="p-4 rounded-2xl bg-[#F5F7FA] text-center text-xs text-[#718EBF]">
            All SCADA assets, inverters, and contactors operating within normal limits.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeAlarms.slice(0, 2).map((alarm) => (
              <div
                key={alarm.id}
                className="p-4 rounded-2xl bg-[#FFEBEF]/50 border border-[#FE5C73]/30 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#FE5C73] text-white uppercase">
                      {alarm.severity}
                    </span>
                    <strong className="font-mono text-[#343C6A]">{alarm.fault_code}</strong>
                  </div>
                  <p className="font-bold text-[#343C6A] line-clamp-1">{alarm.message}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onAckAlarm(alarm.id)}
                    className="px-2.5 py-1.5 rounded-xl bg-white text-[#2D60FF] font-bold text-[11px] border border-[#E6EFF5] hover:bg-[#E7EDFF]"
                  >
                    ACK
                  </button>
                  <button
                    onClick={() => onRepairAlarm(alarm.id)}
                    className="px-2.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-500 shadow-xs"
                  >
                    Auto-Repair
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
