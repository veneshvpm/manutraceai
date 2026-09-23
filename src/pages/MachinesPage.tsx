import React, { useState } from 'react';
import {
  Cpu,
  Search,
  Activity,
  AlertTriangle,
  Thermometer,
  Gauge,
  Clock,
  Wrench,
  AlertOctagon
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Machine } from '../types';

export const MachinesPage: React.FC = () => {
  const {
    machines,
    selectedMachineId,
    setSelectedMachineId,
    triggerImpactAnalysisForMachine
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeMachine, setActiveMachine] = useState<Machine>(
    machines.find((m: Machine) => m.id === (selectedMachineId || 'M04')) || machines[0]
  );

  const filteredMachines = machines.filter(
    (m: Machine) =>
      m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.line.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 space-y-7 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#343C6A] tracking-tight">
            Machine Cells & Shop Floor Hardware
          </h1>
          <p className="text-xs text-[#718EBF] mt-1 font-medium">
            Live telemetry feeds, vibration FFT spectra, thermal envelopes, and maintenance schedules
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#718EBF] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search Machine ID, Name, Line..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-[#E6EFF5] text-xs font-medium text-[#343C6A] placeholder-[#8BA3CB] focus:outline-none focus:ring-2 focus:ring-[#2D60FF]/20 shadow-xs"
          />
        </div>
      </div>

      {/* Machine Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMachines.map((m: Machine) => {
          const isSelected = activeMachine.id === m.id;
          const isWarning = m.status === 'warning';
          const isMaintenance = m.status === 'maintenance';

          return (
            <div
              key={m.id}
              onClick={() => {
                setActiveMachine(m);
                setSelectedMachineId(m.id);
              }}
              className={`p-6 rounded-3xl border cursor-pointer transition-all duration-200 flex flex-col justify-between group ${
                isSelected
                  ? 'bg-white border-2 border-[#2D60FF] shadow-sm'
                  : isWarning
                  ? 'bg-white border border-[#FFBB38]/60 hover:border-[#FFBB38] shadow-sm'
                  : 'bg-white border border-[#E6EFF5] hover:border-[#DFEAF2] shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-sm font-black text-[#2D60FF]">{m.id}</span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                      isWarning
                        ? 'bg-[#FFF5D9] text-[#FEAA09]'
                        : isMaintenance
                        ? 'bg-[#E7EDFF] text-[#2D60FF]'
                        : 'bg-[#E1F8EC] text-[#10B981]'
                    }`}
                  >
                    {m.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#343C6A] leading-tight">{m.name}</h3>
                <p className="text-xs text-[#718EBF] mt-0.5">{m.line} • {m.type}</p>

                <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-[#E6EFF5] text-xs">
                  <div>
                    <span className="text-[10px] text-[#718EBF] uppercase font-bold block">Utilization</span>
                    <span className="text-[#343C6A] font-black text-sm">{m.utilization}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#718EBF] uppercase font-bold block">Last Maint</span>
                    <span className="text-[#718EBF]">{m.lastMaintenance}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E6EFF5] flex items-center justify-between text-xs">
                <span className="text-[#718EBF]">Risk: <strong className="text-[#343C6A]">{m.risk.toUpperCase()}</strong></span>
                <span className="text-[#2D60FF] font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Inspect →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Machine Telemetry Detailed Inspector */}
      {activeMachine && (
        <div className="p-6 rounded-3xl bg-white border border-[#E6EFF5] shadow-sm space-y-6 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E6EFF5] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#E7EDFF] text-[#2D60FF]">
                  {activeMachine.id}
                </span>
                <span className="text-xs text-[#718EBF] font-semibold">{activeMachine.line}</span>
              </div>
              <h2 className="text-xl font-extrabold text-[#343C6A] mt-1">
                {activeMachine.name} — Real-Time Telemetry Diagnostic
              </h2>
            </div>

            <button
              onClick={() => triggerImpactAnalysisForMachine(activeMachine.id)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FFEBEF] hover:bg-[#FFD9E0] text-[#FE5C73] text-xs font-bold transition-all"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Run Impact Analysis for {activeMachine.id}</span>
            </button>
          </div>

          {/* Telemetry Gauges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Temperature */}
            <div className="p-4 rounded-2xl bg-[#FFF5D9] border border-[#FFBB38]/40">
              <span className="text-[10px] uppercase font-bold text-[#FEAA09] flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5" /> Temperature
              </span>
              <div className="text-2xl font-black text-[#FEAA09] font-mono mt-1">
                {activeMachine.telemetry.temperature}°C
              </div>
              <span className="text-[11px] text-[#718EBF] block mt-0.5">
                Setpoint: 180°C (+2°C)
              </span>
            </div>

            {/* Vibration */}
            <div className="p-4 rounded-2xl bg-[#FFEBEF] border border-[#FE5C73]/40">
              <span className="text-[10px] uppercase font-bold text-[#FE5C73] flex items-center gap-1">
                <Activity className="w-3.5 h-3.5" /> Vibration
              </span>
              <div className="text-2xl font-black text-[#FE5C73] font-mono mt-1">
                {activeMachine.telemetry.vibration || 3.4} mm/s
              </div>
              <span className="text-[11px] text-[#718EBF] block mt-0.5">
                Threshold: &lt; 2.5 mm/s
              </span>
            </div>

            {/* Pressure */}
            <div className="p-4 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5]">
              <span className="text-[10px] uppercase font-bold text-[#2D60FF] flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5" /> Pressure
              </span>
              <div className="text-2xl font-black text-[#2D60FF] font-mono mt-1">
                {activeMachine.telemetry.pressure} bar
              </div>
              <span className="text-[11px] text-[#718EBF] block mt-0.5">
                Nominal 5.0 ± 0.3 bar
              </span>
            </div>

            {/* Operating Hours */}
            <div className="p-4 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5]">
              <span className="text-[10px] uppercase font-bold text-[#718EBF] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Run Hours
              </span>
              <div className="text-2xl font-black text-[#343C6A] font-mono mt-1">
                {activeMachine.operatingHours} hrs
              </div>
              <span className="text-[11px] text-[#718EBF] block mt-0.5">
                Lifetime Run Hours
              </span>
            </div>

            {/* Maintenance History */}
            <div className="p-4 rounded-2xl bg-[#E1F8EC] border border-[#10B981]/30">
              <span className="text-[10px] uppercase font-bold text-[#10B981] flex items-center gap-1">
                <Wrench className="w-3.5 h-3.5" /> Maintenance
              </span>
              <div className="text-sm font-bold text-[#10B981] mt-2">
                {activeMachine.lastMaintenance}
              </div>
              <span className="text-[11px] text-[#718EBF] block mt-1">
                Next: {activeMachine.nextMaintenance}
              </span>
            </div>

            {/* Associated Defects */}
            <div className="p-4 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5]">
              <span className="text-[10px] uppercase font-bold text-[#FEAA09] flex items-center gap-1">
                <AlertOctagon className="w-3.5 h-3.5" /> Defects
              </span>
              <div className="text-2xl font-black text-[#343C6A] font-mono mt-1">
                {activeMachine.associatedDefects}
              </div>
              <span className="text-[11px] text-[#718EBF] block mt-0.5">
                Last 30 shifts
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
