import React, { useState } from 'react';
import {
  Boxes,
  AlertOctagon,
  Layers,
  Cpu,
  Package,
  Truck,
  ArrowDown,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RawMaterial } from '../types';
import { sound } from '../services/soundFx';

export const ReverseTracePage: React.FC = () => {
  const {
    rawMaterials,
    selectedRawMaterialId,
    setSelectedRawMaterialId,
    setActiveTab,
    setSelectedMachineId
  } = useApp();

  const [activeMaterialId, setActiveMaterialId] = useState(selectedRawMaterialId || 'RM-7821');
  const [quarantined, setQuarantined] = useState(false);
  const [isShockwaveActive, setIsShockwaveActive] = useState(false);

  const selectedMaterial =
    rawMaterials.find((rm: RawMaterial) => rm.id === activeMaterialId) || rawMaterials[0];

  const isTargetRM = activeMaterialId === 'RM-7821';

  const affectedBatches = isTargetRM
    ? [
        { id: 'B-1042', name: 'Brake Component Caliper Arm', line: 'Line 04', units: 486, risk: 'Medium' },
        { id: 'B-1043', name: 'Ventilated Disc Rotor 340mm', line: 'Line 04', units: 320, risk: 'Medium' },
        { id: 'B-1045', name: 'ABS Master Cylinder Body', line: 'Line 04', units: 280, risk: 'High' }
      ]
    : [
        { id: 'B-1044', name: 'EV Power Inverter Enclosure', line: 'Line 01', units: 600, risk: 'Low' }
      ];

  const affectedMachines = isTargetRM
    ? [
        { id: 'M04', name: '5-Axis CNC Milling Center', line: 'Line 04', status: 'Warning', temp: '182°C' },
        { id: 'M01', name: 'Hydraulic Press & Forging Cell', line: 'Line 01', status: 'Running', temp: '176°C' }
      ]
    : [
        { id: 'M01', name: 'Hydraulic Press & Forging Cell', line: 'Line 01', status: 'Running', temp: '176°C' }
      ];

  const affectedProductsCount = isTargetRM ? 486 : 140;
  const affectedShipmentsCount = isTargetRM ? 7 : 2;

  const handleRunImpactAnalysis = () => {
    sound.playClick();
    setSelectedMachineId('M04');
    setActiveTab('impact');
  };

  const handleQuarantineAll = () => {
    sound.playQuarantine();
    setQuarantined(true);
  };

  const handleTriggerShockwave = () => {
    sound.playQuarantine();
    setIsShockwaveActive(true);
    setQuarantined(true);
    setTimeout(() => {
      setIsShockwaveActive(false);
      sound.playSuccess();
    }, 2400);
  };

  return (
    <div className="p-8 space-y-7 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#343C6A] tracking-tight flex items-center gap-3">
            <span>Reverse Traceability</span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FFEBEF] text-[#FE5C73]">
              ROOT CONTAINMENT
            </span>
          </h1>
          <p className="text-xs text-[#718EBF] mt-1 font-medium">
            Isolate suspected defective raw materials and calculate instant downstream ripple across production, machines, and customer deliveries
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleTriggerShockwave}
            disabled={isShockwaveActive}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all ${
              isShockwaveActive
                ? 'bg-[#FE5C73] text-white animate-pulse'
                : 'bg-[#FFF5D9] text-[#FEAA09] hover:bg-[#FFEEC2]'
            }`}
          >
            <ShieldAlert className={`w-4 h-4 ${isShockwaveActive ? 'animate-spin' : ''}`} />
            <span>{isShockwaveActive ? 'Propagating Containment Wave...' : 'Simulate Blast Radius Shockwave'}</span>
          </button>

          <button
            onClick={handleRunImpactAnalysis}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2D60FF] hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-[0_4px_12px_rgba(45,96,255,0.35)]"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Run AI Impact Analysis</span>
          </button>
        </div>
      </div>

      {/* Defective Inflow Scenario Banner */}
      <div className="p-6 rounded-3xl bg-white border border-[#FFEBEF] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FFEBEF] text-[#FE5C73] flex items-center justify-center flex-shrink-0">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#FFEBEF] text-[#FE5C73]">
                DEFECT INVESTIGATION
              </span>
              <span className="text-xs text-[#718EBF]">
                Supplier: Global Materials Ltd. (SUP-001)
              </span>
            </div>
            <h3 className="text-lg font-bold text-[#343C6A] mt-1">
              Raw Material <span className="text-[#2D60FF] font-mono">{selectedMaterial.id}</span> has been flagged with hardness drift.
            </h3>
            <p className="text-xs text-[#718EBF] mt-0.5">
              Tensile hardness test exhibited +3.8% variance beyond allowable metallurgic tolerance (214 HB vs nominal 200 HB).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0 w-full md:w-auto">
          <select
            value={activeMaterialId}
            onChange={e => {
              setActiveMaterialId(e.target.value);
              setSelectedRawMaterialId(e.target.value);
            }}
            className="px-4 py-2 rounded-full bg-[#F5F7FA] border border-[#E6EFF5] text-xs font-semibold text-[#343C6A] focus:outline-none"
          >
            {rawMaterials.map((rm: RawMaterial) => (
              <option key={rm.id} value={rm.id}>
                {rm.id} - {rm.name.slice(0, 26)}
              </option>
            ))}
          </select>

          <button
            onClick={handleQuarantineAll}
            disabled={quarantined}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
              quarantined
                ? 'bg-[#E1F8EC] text-[#10B981]'
                : 'bg-[#FFEBEF] hover:bg-[#FFD9E0] text-[#FE5C73]'
            }`}
          >
            {quarantined ? 'Quarantined ✓' : 'Quarantine All'}
          </button>
        </div>
      </div>

      {/* IMPACT SUMMARY KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-white border border-[#E6EFF5] shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#E7EDFF] text-[#2D60FF] flex items-center justify-center flex-shrink-0">
            <Layers className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-[#718EBF] font-medium block">Affected Batches</span>
            <div className="text-2xl font-black text-[#343C6A] font-mono mt-0.5">{affectedBatches.length} Lots</div>
            <p className="text-[11px] text-[#718EBF]">B-1042, B-1043, B-1045 isolated</p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#E6EFF5] shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FFF5D9] text-[#FFBB38] flex items-center justify-center flex-shrink-0">
            <Package className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-[#718EBF] font-medium block">Affected Products</span>
            <div className="text-2xl font-black text-[#343C6A] font-mono mt-0.5">{affectedProductsCount} Units</div>
            <p className="text-[11px] text-[#718EBF]">Caliper arm & rotor assemblies</p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#E6EFF5] shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FFEBEF] text-[#FE5C73] flex items-center justify-center flex-shrink-0">
            <Truck className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-[#718EBF] font-medium block">Flagged Shipments</span>
            <div className="text-2xl font-black text-[#FE5C73] font-mono mt-0.5">{affectedShipmentsCount} Shipments</div>
            <p className="text-[11px] text-[#718EBF]">Distribution hold notice issued</p>
          </div>
        </div>
      </div>

      {/* INTERACTIVE DOWNSTREAM RIPPLE TREE */}
      <div className="p-6 rounded-3xl bg-white border border-[#E6EFF5] shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-[#E6EFF5] pb-4">
          <h3 className="font-bold text-sm text-[#343C6A]">
            Downstream Blast-Radius Tree Decomposition
          </h3>
          <span className="text-xs font-semibold text-[#2D60FF] bg-[#E7EDFF] px-3 py-1 rounded-full">
            Automated Provenance Traversal
          </span>
        </div>

        {/* Tree Step 1: Root Material */}
        <div className="relative p-5 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5] flex items-center justify-between overflow-hidden">
          {isShockwaveActive && (
            <div className="absolute inset-0 border-2 border-[#FE5C73] rounded-2xl animate-ping pointer-events-none opacity-50" />
          )}

          <div className="flex items-center gap-3.5 relative z-10">
            <div className="w-11 h-11 rounded-2xl bg-[#FFEBEF] text-[#FE5C73] flex items-center justify-center">
              <Boxes className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#FE5C73] uppercase tracking-wider">
                ROOT CONTAMINANT
              </span>
              <h4 className="text-sm font-bold text-[#343C6A]">
                {selectedMaterial.id} • {selectedMaterial.name}
              </h4>
              <p className="text-xs text-[#718EBF]">
                Supplier: {selectedMaterial.supplierName} • Lot: {selectedMaterial.batchNumber}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FFEBEF] text-[#FE5C73] relative z-10">
            {quarantined ? 'LOCKDOWN APPLIED' : 'SUSPECT MATERIAL'}
          </span>
        </div>

        {/* Connector Arrow */}
        <div className="flex justify-center -my-2">
          <ArrowDown className="w-5 h-5 text-[#2D60FF] animate-bounce" />
        </div>

        {/* Tree Step 2: Affected Production Batches */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase text-[#718EBF] px-1">
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#2D60FF]" />
              1. Downstream Production Batches ({affectedBatches.length})
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {affectedBatches.map(b => (
              <div
                key={b.id}
                className="p-4 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5] hover:bg-[#EEF2F6] transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-[#2D60FF]">{b.id}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      b.risk === 'High'
                        ? 'bg-[#FFEBEF] text-[#FE5C73]'
                        : 'bg-[#FFF5D9] text-[#FFBB38]'
                    }`}
                  >
                    {b.risk} Risk
                  </span>
                </div>
                <p className="text-xs font-bold text-[#343C6A]">{b.name}</p>
                <p className="text-[11px] text-[#718EBF] mt-1">
                  {b.line} • {b.units} Units Manufactured
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Connector Arrow */}
        <div className="flex justify-center -my-2">
          <ArrowDown className="w-5 h-5 text-[#2D60FF]" />
        </div>

        {/* Tree Step 3: Affected Machinery */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase text-[#718EBF] px-1">
            <span className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#FFBB38]" />
              2. Production Machinery Contaminated ({affectedMachines.length})
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {affectedMachines.map(m => (
              <div
                key={m.id}
                className="p-4 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5] flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#FFBB38]">{m.id}</span>
                    <span className="text-[10px] text-[#718EBF]">{m.line}</span>
                  </div>
                  <p className="text-xs font-bold text-[#343C6A] mt-0.5">{m.name}</p>
                  <p className="text-[11px] text-[#718EBF] mt-0.5">
                    Sensor: {m.temp} (Thermal pattern deviation flagged)
                  </p>
                </div>
                <span className="text-xs font-bold text-[#FFBB38] px-3 py-1 bg-[#FFF5D9] rounded-full">
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Connector Arrow */}
        <div className="flex justify-center -my-2">
          <ArrowDown className="w-5 h-5 text-[#2D60FF]" />
        </div>

        {/* Tree Step 4: Outbound Customer Shipments */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase text-[#718EBF] px-1">
            <span className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#FF82AC]" />
              3. Flagged Customer Shipments ({affectedShipmentsCount})
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-[#FFEBEF] border border-[#FE5C73]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-[#343C6A]">
                Waybills: SHP-22091, SHP-22092, SHP-22094, SHP-22098...
              </h4>
              <p className="text-[11px] text-[#718EBF] mt-0.5">
                Consignees: Bavaria Motor Works OEM (Stuttgart), North American Brake Systems, Brembo Turin
              </p>
            </div>
            <span className="text-xs font-bold text-[#FE5C73] px-3 py-1 rounded-full bg-white border border-[#FE5C73]/40 flex-shrink-0">
              RECALL HOLD ISSUED
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
