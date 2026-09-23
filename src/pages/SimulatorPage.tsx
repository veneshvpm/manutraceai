import React, { useState } from 'react';
import {
  Sliders,
  Play,
  RotateCcw,
  Thermometer,
  Gauge,
  Clock,
  Zap,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { runWhatIfSimulation } from '../services/aiEngine';
import { WhatIfSimulationParams, Supplier } from '../types';
import { sound } from '../services/soundFx';

export const SimulatorPage: React.FC = () => {
  const { suppliers } = useApp();

  const [params, setParams] = useState<WhatIfSimulationParams>({
    temperature: 185,
    pressure: 5.2,
    processingTime: 20.4,
    machineSpeed: 1420,
    supplierId: 'SUP-001',
    productionLine: 'Line 04'
  });

  const [isSimulating, setIsSimulating] = useState(false);
  const [isStressTesting, setIsStressTesting] = useState(false);
  const [result, setResult] = useState(() => runWhatIfSimulation(params));

  const handleRunSimulation = () => {
    sound.playClick();
    setIsSimulating(true);
    setTimeout(() => {
      setResult(runWhatIfSimulation(params));
      setIsSimulating(false);
      sound.playSuccess();
    }, 450);
  };

  const handleRunStressTest = () => {
    setIsStressTesting(true);
    let step = 170;
    const interval = setInterval(() => {
      step += 3;
      sound.playTelemetryPacket();
      const nextParams = { ...params, temperature: step };
      setParams(nextParams);
      setResult(runWhatIfSimulation(nextParams));

      if (step >= 195) {
        clearInterval(interval);
        setIsStressTesting(false);
        sound.playAlert();
      }
    }, 250);
  };

  const handleResetToBaseline = () => {
    sound.playClick();
    const baseline = {
      temperature: 180,
      pressure: 5.0,
      processingTime: 18.0,
      machineSpeed: 1200,
      supplierId: 'SUP-001',
      productionLine: 'Line 04'
    };
    setParams(baseline);
    setResult(runWhatIfSimulation(baseline));
  };

  const applyPreset = (name: 'nominal' | 'speed' | 'eco' | 'stress') => {
    let p: WhatIfSimulationParams;
    if (name === 'nominal') {
      p = { temperature: 180, pressure: 5.0, processingTime: 18.0, machineSpeed: 1200, supplierId: 'SUP-001', productionLine: 'Line 04' };
    } else if (name === 'speed') {
      p = { temperature: 188, pressure: 5.6, processingTime: 14.5, machineSpeed: 1650, supplierId: 'SUP-001', productionLine: 'Line 04' };
    } else if (name === 'eco') {
      p = { temperature: 175, pressure: 4.8, processingTime: 19.5, machineSpeed: 1050, supplierId: 'SUP-002', productionLine: 'Line 02' };
    } else {
      p = { temperature: 185, pressure: 5.2, processingTime: 20.4, machineSpeed: 1420, supplierId: 'SUP-001', productionLine: 'Line 04' };
    }
    setParams(p);
    setResult(runWhatIfSimulation(p));
  };

  return (
    <div className="p-8 space-y-7 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#343C6A] tracking-tight">
            "What happens if we change the process?"
          </h1>
          <p className="text-xs text-[#718EBF] mt-1 font-medium">
            Simulate parameter shifts across thermal, pressure, and kinetic envelopes before applying to shop floor hardware
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleRunStressTest}
            disabled={isStressTesting}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all ${
              isStressTesting
                ? 'bg-[#FE5C73] text-white animate-pulse'
                : 'bg-[#FFEBEF] text-[#FE5C73] hover:bg-[#FFD9E0]'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${isStressTesting ? 'animate-bounce' : ''}`} />
            <span>{isStressTesting ? 'Sweeping Thermal Limits...' : 'Auto Stress Test'}</span>
          </button>

          <button
            onClick={handleResetToBaseline}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-[#F5F7FA] text-[#343C6A] border border-[#E6EFF5] text-xs font-bold transition-colors shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Baseline</span>
          </button>

          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2D60FF] hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-[0_4px_12px_rgba(45,96,255,0.35)]"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Simulating...' : 'Run Simulation'}</span>
          </button>
        </div>
      </div>

      {/* Preset Quick-Buttons */}
      <div className="flex items-center gap-2.5 flex-wrap text-xs">
        <span className="text-[#718EBF] font-semibold mr-1">
          Scenario Presets:
        </span>
        <button
          onClick={() => applyPreset('stress')}
          className="px-4 py-2 rounded-full bg-[#FFF5D9] text-[#FEAA09] font-bold hover:bg-[#FFEEC2] transition-colors"
        >
          Temp Creep (+5°C / 185°C)
        </button>
        <button
          onClick={() => applyPreset('nominal')}
          className="px-4 py-2 rounded-full bg-white text-[#343C6A] border border-[#E6EFF5] font-semibold hover:bg-[#F5F7FA] transition-colors shadow-xs"
        >
          Nominal Baseline (180°C)
        </button>
        <button
          onClick={() => applyPreset('speed')}
          className="px-4 py-2 rounded-full bg-white text-[#343C6A] border border-[#E6EFF5] font-semibold hover:bg-[#F5F7FA] transition-colors shadow-xs"
        >
          High-Feed Overclock
        </button>
        <button
          onClick={() => applyPreset('eco')}
          className="px-4 py-2 rounded-full bg-white text-[#343C6A] border border-[#E6EFF5] font-semibold hover:bg-[#F5F7FA] transition-colors shadow-xs"
        >
          Eco-Thermal Low Power
        </button>
      </div>

      {/* Main Simulator Workspace: Left Controls, Right Predicted Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-[#E6EFF5] shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-[#E6EFF5] pb-4">
            <h3 className="font-bold text-sm text-[#343C6A] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#2D60FF]" />
              Adjust Process Parameters
            </h3>
            <span className="text-xs text-[#718EBF]">Interactive Sliders</span>
          </div>

          {/* Sliders */}
          <div className="space-y-4">
            {/* Temperature */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-[#343C6A] font-semibold flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-[#FEAA09]" />
                  Chamber Temperature
                </span>
                <span className="font-mono font-bold text-[#2D60FF] text-sm">
                  {params.temperature}°C
                  <span className="text-[#718EBF] font-normal text-xs ml-1">
                    (Base: 180°C)
                  </span>
                </span>
              </div>
              <input
                type="range"
                min="165"
                max="205"
                step="1"
                value={params.temperature}
                onChange={e => setParams({ ...params, temperature: Number(e.target.value) })}
                className="w-full accent-[#2D60FF] h-2 bg-[#F5F7FA] rounded-full cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#718EBF]">
                <span>165°C</span>
                <span>Optimal: 180°C</span>
                <span>205°C (Critical)</span>
              </div>
            </div>

            {/* Hydraulic Pressure */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-[#343C6A] font-semibold flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-[#16DBCC]" />
                  Hydraulic / Injection Pressure
                </span>
                <span className="font-mono font-bold text-[#2D60FF] text-sm">
                  {params.pressure} bar
                  <span className="text-[#718EBF] font-normal text-xs ml-1">
                    (Base: 5.0 bar)
                  </span>
                </span>
              </div>
              <input
                type="range"
                min="3.5"
                max="6.5"
                step="0.1"
                value={params.pressure}
                onChange={e => setParams({ ...params, pressure: Number(e.target.value) })}
                className="w-full accent-[#2D60FF] h-2 bg-[#F5F7FA] rounded-full cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#718EBF]">
                <span>3.5 bar</span>
                <span>Nominal: 5.0 bar</span>
                <span>6.5 bar</span>
              </div>
            </div>

            {/* Processing Time */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-[#343C6A] font-semibold flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#2D60FF]" />
                  Processing Cycle Time
                </span>
                <span className="font-mono font-bold text-[#2D60FF] text-sm">
                  {params.processingTime} min
                  <span className="text-[#718EBF] font-normal text-xs ml-1">
                    (Base: 18.0 min)
                  </span>
                </span>
              </div>
              <input
                type="range"
                min="12.0"
                max="26.0"
                step="0.2"
                value={params.processingTime}
                onChange={e => setParams({ ...params, processingTime: Number(e.target.value) })}
                className="w-full accent-[#2D60FF] h-2 bg-[#F5F7FA] rounded-full cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#718EBF]">
                <span>12.0 min</span>
                <span>Nominal: 18.0 min</span>
                <span>26.0 min</span>
              </div>
            </div>

            {/* Machine Speed */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-[#343C6A] font-semibold flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#FEAA09]" />
                  Machine Spindle Speed
                </span>
                <span className="font-mono font-bold text-[#2D60FF] text-sm">
                  {params.machineSpeed} RPM
                  <span className="text-[#718EBF] font-normal text-xs ml-1">
                    (Base: 1200 RPM)
                  </span>
                </span>
              </div>
              <input
                type="range"
                min="800"
                max="1800"
                step="20"
                value={params.machineSpeed}
                onChange={e => setParams({ ...params, machineSpeed: Number(e.target.value) })}
                className="w-full accent-[#2D60FF] h-2 bg-[#F5F7FA] rounded-full cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#718EBF]">
                <span>800 RPM</span>
                <span>1200 RPM</span>
                <span>1800 RPM</span>
              </div>
            </div>

            {/* Dropdowns */}
            <div className="grid grid-cols-2 gap-3.5 pt-2">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#718EBF] uppercase">
                  Raw Material Supplier
                </label>
                <select
                  value={params.supplierId}
                  onChange={e => setParams({ ...params, supplierId: e.target.value })}
                  className="w-full px-3 py-2 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5] text-xs font-semibold text-[#343C6A] focus:outline-none"
                >
                  {suppliers.map((s: Supplier) => (
                    <option key={s.id} value={s.id}>
                      {s.name.split(' ')[0]} ({s.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#718EBF] uppercase">
                  Target Production Line
                </label>
                <select
                  value={params.productionLine}
                  onChange={e => setParams({ ...params, productionLine: e.target.value })}
                  className="w-full px-3 py-2 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5] text-xs font-semibold text-[#343C6A] focus:outline-none"
                >
                  <option value="Line 01">Line 01 (Heavy Cell)</option>
                  <option value="Line 02">Line 02 (Grinding)</option>
                  <option value="Line 03">Line 03 (Heat Treat)</option>
                  <option value="Line 04">Line 04 (5-Axis CNC)</option>
                  <option value="Line 05">Line 05 (Electronics)</option>
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="w-full py-3 rounded-full bg-[#2D60FF] hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider shadow-[0_4px_12px_rgba(45,96,255,0.35)] transition-all flex items-center justify-center gap-2"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Simulating...' : 'Run Simulation'}</span>
          </button>
        </div>

        {/* Results Column (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-[#E6EFF5] shadow-sm space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#E6EFF5] pb-4 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#2D60FF]">
                  Predictive Comparison Engine
                </span>
                <h3 className="font-bold text-base text-[#343C6A]">
                  CURRENT PROCESS vs SIMULATED PROCESS
                </h3>
              </div>

              <span
                className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                  result.riskRating === 'high'
                    ? 'bg-[#FFEBEF] text-[#FE5C73]'
                    : result.riskRating === 'medium'
                    ? 'bg-[#FFF5D9] text-[#FFBB38]'
                    : 'bg-[#E1F8EC] text-[#10B981]'
                }`}
              >
                Projected Risk: {result.riskRating}
              </span>
            </div>

            {/* Side-by-Side Comparison Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Quality Risk Delta */}
              <div className="p-4 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5] space-y-1">
                <span className="text-[11px] font-bold text-[#718EBF] uppercase block">
                  Quality Risk
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-[#343C6A] font-mono">
                    {result.simulated.qualityRisk}%
                  </span>
                  <span
                    className={`text-xs font-bold font-mono ${
                      result.deltas.qualityRiskDelta > 0
                        ? 'text-[#FE5C73]'
                        : 'text-[#10B981]'
                    }`}
                  >
                    {result.deltas.qualityRiskDelta > 0 ? '+' : ''}
                    {result.deltas.qualityRiskDelta}%
                  </span>
                </div>
                <span className="text-[11px] text-[#718EBF] block">
                  Current: {result.current.qualityRisk}%
                </span>
              </div>

              {/* Defect Risk Delta */}
              <div className="p-4 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5] space-y-1">
                <span className="text-[11px] font-bold text-[#718EBF] uppercase block">
                  Defect Risk
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-[#FEAA09] font-mono">
                    {result.simulated.defectRisk}%
                  </span>
                  <span
                    className={`text-xs font-bold font-mono ${
                      result.deltas.defectRiskDelta > 0
                        ? 'text-[#FE5C73]'
                        : 'text-[#10B981]'
                    }`}
                  >
                    {result.deltas.defectRiskDelta > 0 ? '+' : ''}
                    {result.deltas.defectRiskDelta}%
                  </span>
                </div>
                <span className="text-[11px] text-[#718EBF] block">
                  Current: {result.current.defectRisk}%
                </span>
              </div>

              {/* Energy Consumption Delta */}
              <div className="p-4 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5] space-y-1">
                <span className="text-[11px] font-bold text-[#718EBF] uppercase block">
                  Energy Consumption
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-[#2D60FF] font-mono">
                    {result.simulated.energyConsumption}
                  </span>
                  <span
                    className={`text-xs font-bold font-mono ${
                      result.deltas.energyDelta > 0
                        ? 'text-[#FEAA09]'
                        : 'text-[#10B981]'
                    }`}
                  >
                    {result.deltas.energyDelta > 0 ? '+' : ''}
                    {result.deltas.energyDelta}%
                  </span>
                </div>
                <span className="text-[11px] text-[#718EBF] block">
                  Current: {result.current.energyConsumption} kWh/lot
                </span>
              </div>
            </div>

            {/* DYNAMIC SPC GAUSSIAN RESPONSE WAVEFORM */}
            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E6EFF5] space-y-2 mt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#343C6A] font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#2D60FF] animate-pulse" />
                  DYNAMIC PROCESS BELL CURVE DRIFT
                </span>
                <span className="text-[#718EBF]">
                  Mean Shift: <span className="text-[#2D60FF] font-bold font-mono">{(params.temperature - 180 > 0 ? '+' : '') + (params.temperature - 180)}°C</span>
                </span>
              </div>

              <div className="h-28 w-full relative">
                <svg viewBox="0 0 500 110" className="w-full h-full">
                  {/* Grid Lines */}
                  <line x1="20" y1="90" x2="480" y2="90" stroke="#E6EFF5" />
                  <line x1="250" y1="10" x2="250" y2="90" stroke="#2D60FF" strokeDasharray="3 3" opacity="0.4" />

                  {/* Nominal Bell Curve */}
                  <path
                    d="M 50 90 Q 200 90 230 45 Q 250 15 270 45 Q 300 90 450 90"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                    opacity="0.6"
                  />

                  {/* Dynamic Shifted Simulated Curve based on temperature */}
                  {(() => {
                    const shift = (params.temperature - 180) * 5;
                    const peakX = 250 + shift;
                    const peakY = Math.max(12, 20 + Math.abs(shift) * 0.5);
                    const color = params.temperature > 184 ? '#FE5C73' : params.temperature > 181 ? '#FFBB38' : '#2D60FF';
                    return (
                      <g>
                        <path
                          d={`M 50 90 Q ${peakX - 50} 90 ${peakX - 20} ${peakY + 30} Q ${peakX} ${peakY} ${peakX + 20} ${peakY + 30} Q ${peakX + 50} 90 450 90`}
                          fill="none"
                          stroke={color}
                          strokeWidth="2.5"
                        />
                        <circle cx={peakX} cy={peakY} r="4" fill={color} />
                        <text x={peakX} y={peakY - 6} fill={color} fontSize="9" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">
                          {params.temperature}°C (Simulated)
                        </text>
                      </g>
                    );
                  })()}

                  <text x="250" y="104" fill="#718EBF" fontSize="9" textAnchor="middle">
                    Nominal 180°C Setpoint
                  </text>
                  <text x="50" y="104" fill="#8BA3CB" fontSize="8">-3σ</text>
                  <text x="450" y="104" fill="#8BA3CB" fontSize="8">+3σ</text>
                </svg>
              </div>
            </div>

            {/* Recommendations & Engineering Insights */}
            <div className="mt-5 space-y-2">
              <span className="text-[11px] font-bold uppercase text-[#718EBF] tracking-wider block">
                AI Engineering Insights & Warnings:
              </span>
              <div className="space-y-2">
                {result.recommendations.map((rec: string, i: number) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-[#FFF5D9] border border-[#FFBB38]/40 text-xs text-[#343C6A] flex items-start gap-3"
                  >
                    <AlertTriangle className="w-4 h-4 text-[#FEAA09] flex-shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Simulated Disclaimer Banner */}
          <div className="p-3.5 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5] text-[11px] text-[#718EBF] flex items-center gap-2.5 mt-4">
            <Info className="w-4 h-4 text-[#2D60FF] flex-shrink-0" />
            <span className="leading-relaxed">
              <span className="font-bold text-[#2D60FF] uppercase">Simulated / Predicted Values:</span> Computed using historical training baselines & empirical correlation models. Values do not represent guaranteed real-world outcomes without live calibration.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
