import React, { useState } from 'react';
import {
  ShieldCheck,
  QrCode,
  Download,
  Boxes,
  Building2,
  Cpu,
  Factory,
  CheckCircle2,
  PackageCheck,
  Truck,
  AlertTriangle,
  User,
  Thermometer,
  Gauge,
  Timer,
  SearchCode
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Batch, Product } from '../types';
import { DigitalTwinVisualizer } from '../components/common/DigitalTwinVisualizer';

export const PassportPage: React.FC = () => {
  const {
    selectedBatchId,
    selectedProductId,
    batches,
    products,
    openQrModal,
    triggerRcaForBatch
  } = useApp();

  const [activeStageId, setActiveStageId] = useState<string>('stage-4'); // Production / Machine
  const [downloadNotice, setDownloadNotice] = useState(false);

  // Find selected batch or fallback to B-1042
  const currentBatch = batches.find((b: Batch) => b.id === selectedBatchId) || batches[0];
  const currentProduct = products.find((p: Product) => p.id === selectedProductId) || products[0];

  const stages = [
    {
      id: 'stage-1',
      label: 'RAW MATERIAL',
      sub: 'RM-7821',
      icon: Boxes,
      status: 'verified',
      time: '10 Sep 2026',
      details: {
        'Material Batch': 'RM-7821',
        'Material Name': 'High-Tensile Steel Alloy 4140',
        'Purity Score': '98.4%',
        'Tensile Strength': '950 MPa',
        'Lot Acceptance': 'Passed ASTM A29'
      }
    },
    {
      id: 'stage-2',
      label: 'SUPPLIER',
      sub: 'Global Materials',
      icon: Building2,
      status: 'verified',
      time: '10 Sep 2026',
      details: {
        'Supplier ID': 'SUP-001',
        'Supplier Name': 'Global Materials Ltd.',
        'Quality Score': '94%',
        'Accreditation': 'IATF 16949 Certified',
        'Location': 'Munich, Germany'
      }
    },
    {
      id: 'stage-3',
      label: 'MACHINE',
      sub: 'M04 (5-Axis)',
      icon: Cpu,
      status: 'warning',
      time: '22 Sep 2026',
      details: {
        'Machine ID': 'M04',
        'Machine Type': '5-Axis CNC Milling Center',
        'Spindle Vibration': '3.4 mm/s (Warning)',
        'Coolant Pressure': '4.8 bar',
        'Last Maintenance': '18 Sep 2026'
      }
    },
    {
      id: 'stage-4',
      label: 'PRODUCTION',
      sub: 'Line 04 Active',
      icon: Factory,
      status: 'verified',
      time: '22 Sep 2026',
      details: {
        'Operator': 'OP-17 (Senior CNC Tech)',
        'Temperature': '182°C (Setpoint: 180°C)',
        'Pressure': '5.1 bar',
        'Processing Time': '20.4 min',
        'Feed Rate': '350 mm/min'
      }
    },
    {
      id: 'stage-5',
      label: 'QUALITY INSPECTION',
      sub: 'Passed CMM',
      icon: CheckCircle2,
      status: 'verified',
      time: '22 Sep 2026',
      details: {
        'Inspection Result': 'Passed (100% CMM Scan)',
        'Defects Count': '0 Detected',
        'Bore Tolerance': '±0.012 mm (Spec: ±0.025 mm)',
        'Surface Roughness': 'Ra 0.8 µm (Target: 0.6-0.9 µm)',
        'Inspector': 'Dave Miller (Lead QC)'
      }
    },
    {
      id: 'stage-6',
      label: 'PACKAGING',
      sub: 'Verified Sealed',
      icon: PackageCheck,
      status: 'verified',
      time: '22 Sep 2026',
      details: {
        'Packaging Status': 'Verified & Hermetically Sealed',
        'Barcode Serial': 'SN-2026-BC-00421',
        'Corrosion Barrier': 'VCI Active Film',
        'RFID Chip': 'EPC-96-A01B42'
      }
    },
    {
      id: 'stage-7',
      label: 'SHIPMENT',
      sub: 'SHP-22091',
      icon: Truck,
      status: 'verified',
      time: '22 Sep 2026',
      details: {
        'Shipment ID': 'SHP-22091',
        'Carrier': 'DHL Industrial Freight',
        'Destination': 'Stuttgart Assembly Plant (Bavaria Auto)',
        'Status': 'In-Transit (Waybill DHL-EX-99812401)',
        'Compliance Check': '100% Verified'
      }
    }
  ];

  const selectedStage = stages.find(s => s.id === activeStageId) || stages[3];

  const handleDownloadPassport = () => {
    setDownloadNotice(true);
    setTimeout(() => setDownloadNotice(false), 3000);
  };

  const handleOpenQr = () => {
    openQrModal({
      type: 'product',
      id: currentProduct.id,
      name: currentProduct.name,
      batchId: currentBatch.id,
      date: currentBatch.manufacturingDate,
      status: 'QUALITY VERIFIED'
    });
  };

  return (
    <div className="p-8 space-y-7 max-w-7xl mx-auto animate-fade-in">
      {/* Top Banner & Passport Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#343C6A] tracking-tight flex items-center gap-3">
            <span>Manufacturing Passport</span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#E1F8EC] text-[#10B981]">
              QUALITY VERIFIED
            </span>
          </h1>
          <p className="text-xs text-[#718EBF] mt-1">
            End-to-end digital twin uniting physical components, machine parameters, and supply chain custody
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleOpenQr}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#E7EDFF] hover:bg-[#D5E2FF] text-[#2D60FF] text-xs font-bold transition-all shadow-xs"
          >
            <QrCode className="w-4 h-4" />
            <span>Generate QR</span>
          </button>

          <button
            onClick={handleDownloadPassport}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2D60FF] hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-[0_4px_12px_rgba(45,96,255,0.35)]"
          >
            <Download className="w-4 h-4" />
            <span>{downloadNotice ? 'Passport Exported!' : 'Download Passport'}</span>
          </button>
        </div>
      </div>

      {/* Main Passport Identity Hero Card */}
      <div className="p-6 rounded-3xl bg-white border border-[#E6EFF5] shadow-sm relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          <div>
            <span className="text-[11px] font-semibold text-[#718EBF] uppercase tracking-wider block">
              Product Identifier
            </span>
            <h2 className="text-2xl font-black text-[#343C6A] font-mono mt-1">
              {currentProduct.id}
            </h2>
            <p className="text-xs font-bold text-[#2D60FF] mt-0.5">{currentProduct.name}</p>
            <span className="text-[11px] text-[#718EBF] font-mono">
              Serial: {currentProduct.serialNumber || 'SN-2026-BC-00421'}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-[#718EBF] uppercase tracking-wider block">
              Production Lot / Batch
            </span>
            <h2 className="text-2xl font-black text-[#2D60FF] font-mono mt-1">
              {currentBatch.id}
            </h2>
            <p className="text-xs text-[#718EBF] mt-0.5">
              Line: <span className="font-semibold text-[#343C6A]">{currentBatch.productionLine}</span>
            </p>
            <span className="text-[11px] text-[#718EBF]">
              Mfg Date: {currentBatch.manufacturingDate}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-[#718EBF] uppercase tracking-wider block">
              Passport Verification Status
            </span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E1F8EC] text-[#10B981] text-xs font-bold mt-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>QUALITY VERIFIED</span>
            </div>
            <p className="text-[11px] text-[#718EBF] mt-1 font-medium">
              Traceability Coverage: 100%
            </p>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-[#718EBF] uppercase tracking-wider block">
              Regulatory Compliance
            </span>
            <p className="text-xs font-bold text-[#343C6A] mt-1">
              {currentProduct.certification}
            </p>
            <span className="text-[11px] text-[#718EBF] font-mono block mt-0.5">
              Hash: 0x9E7F...3B4A-10021
            </span>
          </div>
        </div>

        {/* Live Highlight Alert Banner if B-1042 has temperature anomaly */}
        {currentBatch.anomalyDetected && (
          <div className="mt-5 p-4 rounded-2xl bg-[#FFF5D9] border border-[#FFBB38]/40 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-[#FEAA09] flex-shrink-0" />
              <p className="text-xs text-[#343C6A]">
                <span className="font-bold">Machine Event Logged:</span> {currentBatch.anomalyNotes}
              </p>
            </div>
            <button
              onClick={() => triggerRcaForBatch(currentBatch.id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-[#FFF5D9] text-[#FEAA09] border border-[#FFBB38]/60 text-xs font-bold transition-colors flex-shrink-0 shadow-xs"
            >
              <SearchCode className="w-3.5 h-3.5" />
              <span>Run AI Root Cause</span>
            </button>
          </div>
        )}
      </div>

      {/* 7-STAGE INTERACTIVE LIFECYCLE TIMELINE */}
      <div className="p-6 rounded-3xl bg-white border border-[#E6EFF5] shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#343C6A]">
              Complete 7-Stage Product Lifecycle Timeline
            </h3>
            <p className="text-xs text-[#718EBF] mt-0.5">
              Click any lifecycle milestone to inspect physical telemetry, operator signatures, and verification hashes
            </p>
          </div>
          <span className="text-xs font-bold text-[#2D60FF] bg-[#E7EDFF] px-3 py-1 rounded-full">
            Chain-of-Custody
          </span>
        </div>

        {/* Timeline Bar with clickable milestones */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            const isSelected = stage.id === activeStageId;
            const isWarning = stage.status === 'warning';

            return (
              <button
                key={stage.id}
                onClick={() => setActiveStageId(stage.id)}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 relative group ${
                  isSelected
                    ? 'bg-[#E7EDFF] border-[#2D60FF] shadow-xs'
                    : isWarning
                    ? 'bg-[#FFF5D9] border-[#FFBB38]/60 hover:border-[#FFBB38]'
                    : 'bg-[#F5F7FA] border-[#E6EFF5] hover:bg-[#EEF2F6]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-[#718EBF]">
                      0{idx + 1}
                    </span>
                    <div
                      className={`p-1.5 rounded-xl ${
                        isSelected
                          ? 'bg-[#2D60FF] text-white'
                          : isWarning
                          ? 'bg-[#FFBB38] text-white'
                          : 'bg-white text-[#718EBF] group-hover:text-[#2D60FF]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#343C6A] line-clamp-1">
                    {stage.label}
                  </h4>
                  <p className="text-[10px] font-bold text-[#2D60FF] mt-0.5 line-clamp-1">
                    {stage.sub}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-black/5 flex items-center justify-between text-[10px] text-[#718EBF]">
                  <span>{stage.time.split(' ')[0]}</span>
                  {isWarning ? (
                    <span className="text-[#FEAA09] font-bold">Alert</span>
                  ) : (
                    <span className="text-[#10B981] font-semibold">Verified</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Expanded Inspector Panel */}
        <div className="p-5 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5] mt-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-[#E6EFF5] pb-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white text-[#2D60FF] shadow-xs">
                {React.createElement(selectedStage.icon, { className: 'w-5 h-5' })}
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#2D60FF] uppercase tracking-wider">
                  Stage Inspection Details
                </span>
                <h4 className="text-sm font-bold text-[#343C6A]">
                  {selectedStage.label} • <span className="text-[#2D60FF]">{selectedStage.sub}</span>
                </h4>
              </div>
            </div>

            <span className="text-xs font-semibold text-[#718EBF]">
              Timestamp: {selectedStage.time}
            </span>
          </div>

          {/* Key Parameters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {Object.entries(selectedStage.details).map(([key, val], i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-white border border-[#E6EFF5] flex flex-col justify-between shadow-xs"
              >
                <span className="text-[10px] font-bold text-[#718EBF] uppercase tracking-wider block">
                  {key}
                </span>
                <span className="text-xs font-bold text-[#343C6A] font-mono mt-1 break-words">
                  {val}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive 3D Digital Twin Component Visualizer */}
      <DigitalTwinVisualizer
        productId={currentProduct.id}
        batchId={currentBatch.id}
        machineId={currentBatch.machineId}
        currentTemp={currentBatch.telemetry.temperature}
      />

      {/* Primary Telemetry & Verification Grid */}
      <div className="p-6 rounded-3xl bg-white border border-[#E6EFF5] shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#E6EFF5] pb-3">
          <h3 className="font-bold text-sm text-[#343C6A]">
            Core Production Telemetry & Verification Manifest
          </h3>
          <span className="text-xs font-bold text-[#2D60FF] bg-[#E7EDFF] px-3 py-1 rounded-full">
            Verified Sensor Logs
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <div className="p-3.5 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5]">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#718EBF] uppercase">
              <Boxes className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Raw Material</span>
            </div>
            <span className="text-sm font-bold text-[#343C6A] mt-1 block">RM-7821</span>
            <span className="text-[11px] text-[#718EBF]">High-Tensile 4140</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5]">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#718EBF] uppercase">
              <Building2 className="w-3.5 h-3.5 text-[#2D60FF]" />
              <span>Supplier</span>
            </div>
            <span className="text-sm font-bold text-[#343C6A] mt-1 block truncate">Global Materials</span>
            <span className="text-[11px] text-[#718EBF]">SUP-001 • Munich</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5]">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#718EBF] uppercase">
              <Cpu className="w-3.5 h-3.5 text-[#FFBB38]" />
              <span>Machine</span>
            </div>
            <span className="text-sm font-bold text-[#343C6A] mt-1 block">M04</span>
            <span className="text-[11px] text-[#718EBF]">Line 04 5-Axis CNC</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5]">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#718EBF] uppercase">
              <User className="w-3.5 h-3.5 text-[#2D60FF]" />
              <span>Operator</span>
            </div>
            <span className="text-sm font-bold text-[#343C6A] mt-1 block">OP-17</span>
            <span className="text-[11px] text-[#718EBF]">Lead Certified Tech</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FFF5D9] border border-[#FFBB38]/40">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#FEAA09] uppercase">
              <Thermometer className="w-3.5 h-3.5 text-[#FEAA09]" />
              <span>Temperature</span>
            </div>
            <span className="text-sm font-bold text-[#FEAA09] mt-1 block">182°C</span>
            <span className="text-[11px] text-[#718EBF]">Set: 180°C (+2°C dev)</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5]">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#718EBF] uppercase">
              <Gauge className="w-3.5 h-3.5 text-[#16DBCC]" />
              <span>Pressure</span>
            </div>
            <span className="text-sm font-bold text-[#343C6A] mt-1 block">5.1 bar</span>
            <span className="text-[11px] text-[#718EBF]">Tolerance: ±0.3 bar</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5]">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#718EBF] uppercase">
              <Timer className="w-3.5 h-3.5 text-[#2D60FF]" />
              <span>Processing Time</span>
            </div>
            <span className="text-sm font-bold text-[#343C6A] mt-1 block">20.4 min</span>
            <span className="text-[11px] text-[#718EBF]">Nominal: 18.0 min</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#E1F8EC] border border-[#10B981]/30">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#10B981] uppercase">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Quality Result</span>
            </div>
            <span className="text-sm font-bold text-[#10B981] mt-1 block">Passed</span>
            <span className="text-[11px] text-[#718EBF]">100% CMM Validated</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5]">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#718EBF] uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2D60FF]" />
              <span>Defects</span>
            </div>
            <span className="text-sm font-bold text-[#343C6A] mt-1 block">0 Detected</span>
            <span className="text-[11px] text-[#718EBF]">Zero critical escapes</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5]">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#718EBF] uppercase">
              <PackageCheck className="w-3.5 h-3.5 text-[#FF82AC]" />
              <span>Packaging</span>
            </div>
            <span className="text-sm font-bold text-[#343C6A] mt-1 block">Verified</span>
            <span className="text-[11px] text-[#718EBF]">VCI Foil Barrier</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5] sm:col-span-2">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#718EBF] uppercase">
              <Truck className="w-3.5 h-3.5 text-[#2D60FF]" />
              <span>Shipment Reference</span>
            </div>
            <span className="text-sm font-bold text-[#2D60FF] mt-1 block">SHP-22091</span>
            <span className="text-[11px] text-[#718EBF]">
              DHL Freight • Dest: Stuttgart OEM Plant
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
