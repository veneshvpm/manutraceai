import React from 'react';
import {
  Zap,
  Activity,
  ShieldCheck,
  AlertTriangle,
  Radio,
  CheckCircle,
  TrendingUp,
  Gauge,
  Power
} from 'lucide-react';
import { ScadaTelemetry } from '../../types';
import { sound } from '../../services/soundFx';

interface ScadaGridViewProps {
  telemetry: ScadaTelemetry;
  onToggleBreaker: (breaker: string, state: boolean) => void;
  gridBreakerClosed: boolean;
}

export const ScadaGridView: React.FC<ScadaGridViewProps> = ({
  telemetry,
  onToggleBreaker,
  gridBreakerClosed
}) => {
  const isIslanded = telemetry.Grid_Status === 0 || !gridBreakerClosed;
  const isExporting = telemetry.Grid_Power < 0;

  return (
    <div className="space-y-6 select-none animate-fade-in">
      {/* ── Substation Status Hero Card ── */}
      <div className="bg-white p-6 rounded-3xl border border-[#E6EFF5] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md ${
            isIslanded ? 'bg-gradient-to-br from-amber-500 to-orange-600' : 'bg-gradient-to-br from-[#2D60FF] to-[#1230AE]'
          }`}>
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-xl text-[#343C6A]">11kV Utility Intertie Substation</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                isIslanded ? 'bg-[#FFF5D9] text-[#FFBB38]' : 'bg-[#DCFAF8] text-[#16DBCC]'
              }`}>
                {isIslanded ? 'ISLANDED (OPEN BREAKER)' : 'GRID SYNCHRONIZED (50.0 Hz)'}
              </span>
            </div>
            <p className="text-xs text-[#718EBF] mt-1">
              Main Medium-Voltage step-down transformer (11kV/415V), bi-directional net metering & anti-islanding relay.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onToggleBreaker('grid', !gridBreakerClosed);
          }}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md flex items-center gap-2 ${
            gridBreakerClosed
              ? 'bg-rose-600 hover:bg-rose-700 text-white'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
        >
          <Power className="w-4 h-4" />
          <span>{gridBreakerClosed ? 'Open Grid Breaker (Force Island)' : 'Close Grid Breaker (Sync Grid)'}</span>
        </button>
      </div>

      {/* ── 4 Key Power Quality Metric Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono">
        <div className="p-4 rounded-3xl bg-white border border-[#E6EFF5] shadow-xs">
          <span className="text-[10px] text-[#718EBF] block uppercase font-bold">11kV Bus Voltage</span>
          <strong className="text-xl text-[#343C6A] block my-1">{telemetry.Grid_Voltage} V</strong>
          <span className="text-[11px] text-[#16DBCC] font-bold">Nominal (±0.4%)</span>
        </div>
        <div className="p-4 rounded-3xl bg-white border border-[#E6EFF5] shadow-xs">
          <span className="text-[10px] text-[#718EBF] block uppercase font-bold">Grid Frequency</span>
          <strong className="text-xl text-[#343C6A] block my-1">{telemetry.Grid_Frequency} Hz</strong>
          <span className="text-[11px] text-[#10B981] font-bold">Within 49.9 - 50.1 Hz</span>
        </div>
        <div className="p-4 rounded-3xl bg-white border border-[#E6EFF5] shadow-xs">
          <span className="text-[10px] text-[#718EBF] block uppercase font-bold">Net Active Exchange</span>
          <strong className={`text-xl block my-1 ${isExporting ? 'text-[#16DBCC]' : 'text-amber-500'}`}>
            {isExporting ? `${telemetry.Grid_Power} kW` : `+${telemetry.Grid_Power} kW`}
          </strong>
          <span className="text-[11px] text-[#718EBF] font-bold">{isExporting ? 'Surplus Exporting' : 'Utility Importing'}</span>
        </div>
        <div className="p-4 rounded-3xl bg-white border border-[#E6EFF5] shadow-xs">
          <span className="text-[10px] text-[#718EBF] block uppercase font-bold">Power Factor (cos φ)</span>
          <strong className="text-xl text-[#2D60FF] block my-1">{telemetry.Grid_PowerFactor}</strong>
          <span className="text-[11px] text-emerald-600 font-bold">Unity (High Efficiency)</span>
        </div>
      </div>

      {/* ── Substation Telemetry & Protection Relay Details ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card: Protection Relays */}
        <div className="bg-white p-6 rounded-3xl border border-[#E6EFF5] shadow-sm space-y-4">
          <h4 className="font-extrabold text-base text-[#343C6A]">Substation Protection Relays (ANSI Codes)</h4>
          <div className="space-y-2.5 text-xs font-mono">
            {[
              { code: 'ANSI 27 / 59', name: 'Under / Over Voltage Relay', val: `${telemetry.Grid_Voltage} V`, status: 'HEALTHY' },
              { code: 'ANSI 81O / 81U', name: 'Over / Under Frequency Relay', val: `${telemetry.Grid_Frequency} Hz`, status: 'HEALTHY' },
              { code: 'ANSI 50 / 51', name: 'Overcurrent Instantaneous & Timed', val: `${((Math.abs(telemetry.Grid_Power) * 1000) / (11000 * 1.732)).toFixed(2)} A`, status: 'HEALTHY' },
              { code: 'ANSI 78', name: 'Rate-of-Change of Frequency (ROCOF)', val: '0.02 Hz/s', status: 'HEALTHY' },
              { code: 'ANSI 25', name: 'Synchronism-Check Relay', val: 'Δθ = 1.2° (In-Phase)', status: 'ARMED' }
            ].map((relay, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5] flex items-center justify-between">
                <div>
                  <strong className="text-[#343C6A] block">{relay.name}</strong>
                  <span className="text-[10px] text-[#718EBF]">{relay.code} • Value: {relay.val}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DCFAF8] text-[#16DBCC]">
                  {relay.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Card: Transformer & Harmonics Diagnostics */}
        <div className="bg-white p-6 rounded-3xl border border-[#E6EFF5] shadow-sm space-y-4">
          <h4 className="font-extrabold text-base text-[#343C6A]">Power Quality & Harmonics Spectrum</h4>
          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5] space-y-2">
              <div className="flex justify-between font-mono">
                <span className="text-[#718EBF]">Total Harmonic Distortion (THD-V):</span>
                <strong className="text-[#10B981]">1.42% (Limit: 5.0% IEEE 519)</strong>
              </div>
              <div className="w-full bg-[#E6EFF5] h-2 rounded-full overflow-hidden">
                <div className="bg-[#10B981] h-full" style={{ width: '28%' }} />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5] space-y-2">
              <div className="flex justify-between font-mono">
                <span className="text-[#718EBF]">Current Harmonic Distortion (THD-I):</span>
                <strong className="text-[#2D60FF]">2.85% (Limit: 8.0% IEEE 519)</strong>
              </div>
              <div className="w-full bg-[#E6EFF5] h-2 rounded-full overflow-hidden">
                <div className="bg-[#2D60FF] h-full" style={{ width: '35%' }} />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5] text-xs font-mono space-y-1 text-[#718EBF]">
              <div className="flex justify-between"><span>Transformer Oil Temp:</span><strong className="text-[#343C6A]">41.2 °C</strong></div>
              <div className="flex justify-between"><span>Reactive Power (kVAR):</span><strong className="text-[#343C6A]">3.4 kVAR (Capacitive)</strong></div>
              <div className="flex justify-between"><span>Active Substation Protocol:</span><strong className="text-[#2D60FF]">IEC 61850 Edition 2</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
