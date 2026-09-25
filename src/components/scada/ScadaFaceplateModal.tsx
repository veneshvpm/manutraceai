import React, { useState } from 'react';
import {
  Gauge,
  Power,
  Sliders,
  Terminal,
  Activity,
  CheckCircle,
  AlertTriangle,
  X,
  Zap,
  Sun,
  Wind,
  Battery,
  Cpu,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { ScadaTelemetry } from '../../types';
import { sound } from '../../services/soundFx';

export type ScadaAssetType = 'solar' | 'wind' | 'battery' | 'inverter' | 'grid' | 'load';

interface ScadaFaceplateModalProps {
  asset: ScadaAssetType | null;
  telemetry: ScadaTelemetry;
  onClose: () => void;
  onToggleBreaker?: (asset: ScadaAssetType, state: boolean) => void;
  onUpdateSetpoint?: (asset: ScadaAssetType, key: string, val: number) => void;
  userRole?: string;
}

export const ScadaFaceplateModal: React.FC<ScadaFaceplateModalProps> = ({
  asset,
  telemetry,
  onClose,
  onToggleBreaker,
  onUpdateSetpoint,
  userRole = 'engineer'
}) => {
  if (!asset) return null;

  const [activeTab, setActiveTab] = useState<'telemetry' | 'controls' | 'registers' | 'diagnostics'>('telemetry');
  const [breakerClosed, setBreakerClosed] = useState(true);
  const [powerSetpoint, setPowerSetpoint] = useState<number>(100);
  const [voltageSetpoint, setVoltageSetpoint] = useState<number>(415);

  const getAssetDetails = () => {
    switch (asset) {
      case 'solar':
        return {
          name: 'Solar PV Array (Bay 01)',
          tag: 'PV-GEN-01',
          substation: 'Feeder Bay 01',
          icon: Sun,
          color: 'text-amber-500',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-400',
          power: `${telemetry.Solar_Power} kW`,
          voltage: `${telemetry.Solar_Voltage} V DC`,
          current: `${telemetry.Solar_Current} A DC`,
          temp: `${telemetry.Solar_Temperature} °C`,
          efficiency: '99.4% (MPPT)',
          protocol: 'MQTT / Modbus TCP (Unit 1)',
          rating: '35 kW Peak Bifacial'
        };
      case 'wind':
        return {
          name: 'Direct-Drive Wind Turbine #01',
          tag: 'WTG-GEN-01',
          substation: 'Feeder Bay 02',
          icon: Wind,
          color: 'text-cyan-500',
          bgColor: 'bg-cyan-50',
          borderColor: 'border-cyan-400',
          power: `${telemetry.Wind_Power} kW`,
          voltage: '415 V 3-Phase AC',
          current: `${((telemetry.Wind_Power * 1000) / (415 * 1.732 * 0.95)).toFixed(1)} A AC`,
          temp: '52.4 °C (Generator)',
          efficiency: '96.2%',
          protocol: 'OPC-UA / CAN Bus 2.0B',
          rating: '25 kW PMSG 12m/s'
        };
      case 'battery':
        return {
          name: 'BESS Lithium Iron Phosphate Storage',
          tag: 'BESS-RACK-01',
          substation: 'DC Bus 480V',
          icon: Battery,
          color: 'text-emerald-500',
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-400',
          power: `${Math.abs(telemetry.Battery_Current * telemetry.Battery_Voltage / 1000).toFixed(1)} kW`,
          voltage: `${telemetry.Battery_Voltage} V DC`,
          current: `${telemetry.Battery_Current} A (${telemetry.Battery_Current < 0 ? 'Charging' : 'Discharging'})`,
          temp: `${telemetry.Battery_Temperature} °C`,
          efficiency: `${telemetry.Battery_SOH}% SOH`,
          protocol: 'CAN 2.0B / Direct BMS RS-485',
          rating: '100 kWh / 50 kW PCS'
        };
      case 'inverter':
        return {
          name: 'PCS 3-Phase Bidirectional Inverter',
          tag: 'PCS-INV-01',
          substation: 'Central Inverter Room',
          icon: Cpu,
          color: 'text-blue-500',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-400',
          power: `${telemetry.Inverter_Output_Power} kW`,
          voltage: '415 V AC / 520 V DC',
          current: `${((telemetry.Inverter_Output_Power * 1000) / (415 * 1.732)).toFixed(1)} A`,
          temp: `${telemetry.Inverter_Temp} °C (IGBT)`,
          efficiency: `${telemetry.Inverter_Efficiency}%`,
          protocol: 'Modbus TCP (Port 502) / IEC 61850',
          rating: '100 kW 4-Quadrant Bidirectional'
        };
      case 'grid':
        return {
          name: '11kV Utility Intertie Substation',
          tag: 'SUB-11KV-01',
          substation: 'Main Grid Feeder',
          icon: Zap,
          color: 'text-purple-500',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-400',
          power: `${telemetry.Grid_Power > 0 ? `+${telemetry.Grid_Power}` : telemetry.Grid_Power} kW (${telemetry.Grid_Power > 0 ? 'Import' : 'Export'})`,
          voltage: `${(telemetry.Grid_Voltage / 1000).toFixed(2)} kV AC`,
          current: `${((Math.abs(telemetry.Grid_Power) * 1000) / (11000 * 1.732)).toFixed(2)} A`,
          temp: '41.2 °C (Transformer Oil)',
          efficiency: `${telemetry.Grid_Frequency} Hz (cos φ ${telemetry.Grid_PowerFactor})`,
          protocol: 'IEC 61850 GOOSE / DNP3',
          rating: '500 kVA 11kV/415V Step-Down'
        };
      case 'load':
      default:
        return {
          name: 'Factory Critical Manufacturing Demand',
          tag: 'LOAD-PLANT-01',
          substation: 'Low Voltage 415V Bus',
          icon: Layers,
          color: 'text-indigo-500',
          bgColor: 'bg-indigo-50',
          borderColor: 'border-indigo-400',
          power: `${telemetry.Load_Demand} kW`,
          voltage: '415 V 3-Phase AC',
          current: `${telemetry.Load_Current} A`,
          temp: '32.1 °C (MCC Panel)',
          efficiency: `Load Shedding: L${telemetry.load_shedding_level}`,
          protocol: 'Modbus TCP Power Meter 01',
          rating: '75 kW Peak Factory Load'
        };
    }
  };

  const details = getAssetDetails();
  const Icon = details.icon;

  const handleToggleBreaker = () => {
    sound.playClick();
    const next = !breakerClosed;
    setBreakerClosed(next);
    if (onToggleBreaker) {
      onToggleBreaker(asset, next);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in select-none">
      <div className="bg-white rounded-3xl border border-[#E6EFF5] max-w-2xl w-full p-6 shadow-2xl space-y-5 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#E6EFF5] pb-4">
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-2xl ${details.bgColor} flex items-center justify-center ${details.color} shadow-xs`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg text-[#343C6A]">{details.name}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#F5F7FA] text-[#2D60FF] border border-[#E6EFF5]">
                  {details.tag}
                </span>
              </div>
              <p className="text-xs text-[#718EBF] mt-0.5">
                Substation: <strong>{details.substation}</strong> • Rating: <strong>{details.rating}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-[#F5F7FA] text-[#718EBF] hover:text-[#343C6A] hover:bg-[#EEF2F6] flex items-center justify-center text-lg font-bold transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-[#E6EFF5] pb-2">
          {[
            { id: 'telemetry', label: 'Live Telemetry', icon: Activity },
            { id: 'controls', label: 'Manual Controls & Breakers', icon: Sliders },
            { id: 'registers', label: 'PLC Modbus Registers', icon: Terminal },
            { id: 'diagnostics', label: 'SIL-2 Safety & Health', icon: ShieldCheck }
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playClick();
                  setActiveTab(tab.id as any);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#2D60FF] text-white shadow-xs'
                    : 'text-[#718EBF] hover:bg-[#F5F7FA] hover:text-[#343C6A]'
                }`}
              >
                <TabIcon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Live Telemetry */}
        {activeTab === 'telemetry' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
              <div className="p-3.5 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5]">
                <span className="text-[10px] text-[#718EBF] font-bold block uppercase">Active Power</span>
                <strong className="text-base font-extrabold text-[#343C6A]">{details.power}</strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5]">
                <span className="text-[10px] text-[#718EBF] font-bold block uppercase">Terminal Voltage</span>
                <strong className="text-base font-extrabold text-[#343C6A]">{details.voltage}</strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5]">
                <span className="text-[10px] text-[#718EBF] font-bold block uppercase">Line Current</span>
                <strong className="text-base font-extrabold text-[#343C6A]">{details.current}</strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5]">
                <span className="text-[10px] text-[#718EBF] font-bold block uppercase">Operating Temp</span>
                <strong className="text-base font-extrabold text-[#343C6A]">{details.temp}</strong>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5] text-xs font-mono space-y-2 text-[#343C6A]">
              <div className="flex justify-between">
                <span className="text-[#718EBF]">Operational Status:</span>
                <span className="text-[#16DBCC] font-extrabold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#16DBCC] animate-ping" />
                  ONLINE / NOMINAL
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#718EBF]">Efficiency / Performance Metric:</span>
                <strong className="text-[#2D60FF]">{details.efficiency}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#718EBF]">Communication Binding:</span>
                <strong>{details.protocol}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Manual Controls & Setpoints */}
        {activeTab === 'controls' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5] flex items-center justify-between">
              <div>
                <strong className="text-sm text-[#343C6A] block">Hardware Contactor / Circuit Breaker</strong>
                <span className="text-xs text-[#718EBF]">Manual physical disconnect for emergency isolation</span>
              </div>
              <button
                onClick={handleToggleBreaker}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 ${
                  breakerClosed
                    ? 'bg-[#DCFAF8] text-[#16DBCC] border border-[#16DBCC]/30 hover:bg-[#c9f5f2]'
                    : 'bg-[#FFEBEF] text-[#FE5C73] border border-[#FE5C73]/30 hover:bg-[#ffd9e0]'
                }`}
              >
                <Power className="w-4 h-4" />
                <span>{breakerClosed ? 'CLOSED (ARMED)' : 'TRIPPED (OPEN)'}</span>
              </button>
            </div>

            <div className="space-y-3 p-4 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5] text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#343C6A]">Power Curtailment / Throttle Setpoint:</span>
                <span className="font-mono font-extrabold text-[#2D60FF]">{powerSetpoint}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={powerSetpoint}
                onChange={(e) => setPowerSetpoint(Number(e.target.value))}
                className="w-full h-2 bg-[#E6EFF5] rounded-lg appearance-none cursor-pointer accent-[#2D60FF]"
              />
              <div className="flex justify-between text-[10px] text-[#718EBF] font-mono">
                <span>0% (Standby)</span>
                <span>50%</span>
                <span>100% (Full Capacity)</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: PLC Modbus Registers */}
        {activeTab === 'registers' && (
          <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 text-slate-200 font-mono text-xs space-y-2 max-h-60 overflow-y-auto">
            <div className="flex justify-between border-b border-slate-800 pb-1 text-slate-400 text-[11px]">
              <span>Register Address</span>
              <span>Variable</span>
              <span>Value</span>
            </div>
            <div className="flex justify-between"><span>40001 (Holding Reg)</span><span>Asset_Active_Power</span><strong className="text-emerald-400">{details.power}</strong></div>
            <div className="flex justify-between"><span>40002 (Holding Reg)</span><span>Asset_Terminal_Voltage</span><strong className="text-emerald-400">{details.voltage}</strong></div>
            <div className="flex justify-between"><span>40003 (Holding Reg)</span><span>Asset_Line_Current</span><strong className="text-emerald-400">{details.current}</strong></div>
            <div className="flex justify-between"><span>40004 (Holding Reg)</span><span>Asset_Internal_Temp</span><strong className="text-emerald-400">{details.temp}</strong></div>
            <div className="flex justify-between"><span>00001 (Coil)</span><span>Main_Breaker_Status</span><strong className="text-blue-400">{breakerClosed ? '1 (CLOSED)' : '0 (OPEN)'}</strong></div>
          </div>
        )}

        {/* Tab 4: SIL-2 Safety & Diagnostics */}
        {activeTab === 'diagnostics' && (
          <div className="p-4 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5] text-xs space-y-3">
            <div className="flex items-center gap-2 text-emerald-600 font-bold">
              <CheckCircle className="w-5 h-5" />
              <span>IEC 61508 SIL-2 Functional Safety Loop: HEALTHY</span>
            </div>
            <p className="text-[#718EBF] leading-relaxed">
              Watchdog heartbeat ping active every 50ms. High-voltage interlocks and arc-flash suppression contactors armed and synchronized with master substation relay.
            </p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-[#E6EFF5]">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2.5 rounded-2xl bg-[#2D60FF] text-white text-xs font-bold hover:bg-[#1230AE] transition-colors shadow-xs"
          >
            Done / Close Faceplate
          </button>
        </div>
      </div>
    </div>
  );
};
