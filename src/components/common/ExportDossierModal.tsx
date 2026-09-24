import React, { useState } from 'react';
import {
  FileText,
  X,
  Printer,
  Copy,
  Check,
  Download,
  ShieldCheck,
  QrCode,
  Building2,
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { sound } from '../../services/soundFx';

export const ExportDossierModal: React.FC = () => {
  const {
    isExportDossierOpen,
    setIsExportDossierOpen,
    selectedBatchId,
    batches,
    products,
    machines,
    rawMaterials,
    industryConfig,
    showToast
  } = useApp();

  const [copied, setCopied] = useState(false);

  if (!isExportDossierOpen) return null;

  const currentBatch = batches.find(b => b.id === selectedBatchId) || batches[0];
  const currentProduct = products.find(p => p.batchId === currentBatch.id) || products[0];
  const currentMachine = machines.find(m => m.id === currentBatch.machineId) || machines[0];
  const currentMaterial = rawMaterials.find(r => r.industry === currentBatch.industry) || rawMaterials[0];

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  const handleCopyJSON = () => {
    const reportData = {
      standard: 'ISO 9001:2015 & EU Digital Product Passport (DPP)',
      facility: industryConfig.name,
      exportTimestamp: new Date().toISOString(),
      batchId: currentBatch.id,
      productName: currentBatch.productName,
      productionLine: currentBatch.productionLine,
      qualityPassRate: `${currentBatch.passRate}%`,
      anomalyDetected: currentBatch.anomalyDetected,
      telemetry: currentBatch.telemetry,
      rawMaterial: {
        id: currentMaterial.id,
        name: currentMaterial.name,
        supplier: currentMaterial.supplierName,
        purityScore: `${currentMaterial.purityScore}%`
      },
      machine: {
        id: currentMachine.id,
        name: currentMachine.name,
        utilization: `${currentMachine.utilization}%`
      },
      digitalSignature: `SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069`
    };

    navigator.clipboard.writeText(JSON.stringify(reportData, null, 2));
    setCopied(true);
    showToast({
      type: 'success',
      title: 'Dossier JSON Copied',
      message: 'Complete audit payload copied to clipboard.'
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={() => setIsExportDossierOpen(false)}
    >
      <div
        className="w-full max-w-4xl bg-white border border-[#E6EFF5] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.22)] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Controls Header */}
        <div className="p-4 border-b border-[#E6EFF5] bg-[#F5F7FA] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5 text-xs font-bold text-[#343C6A]">
            <FileText className="w-4 h-4 text-[#2D60FF]" />
            <span>Digital Product Passport & Compliance Audit Dossier</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#EEF2F6] text-[#343C6A] text-xs font-bold border border-[#E6EFF5] transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied JSON' : 'Copy JSON'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#2D60FF] hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={() => setIsExportDossierOpen(false)}
              className="p-1.5 rounded-full text-[#718EBF] hover:text-[#343C6A] hover:bg-[#EEF2F6]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 overflow-y-auto space-y-6 flex-1 bg-white print:p-0">
          {/* Official Letterhead */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b-2 border-[#343C6A] gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#2D60FF] flex items-center justify-center text-white font-black text-sm">
                  MT
                </div>
                <h1 className="text-xl font-black text-[#343C6A] tracking-tight uppercase">
                  MANUTRACE INDUSTRIAL PASSPORT
                </h1>
              </div>
              <p className="text-xs text-[#718EBF] mt-1 font-medium">
                ISO 9001:2015 & EU DPP Compliant Batch Certificate
              </p>
            </div>

            <div className="text-right text-xs">
              <span className="font-mono font-bold text-[#343C6A] block">
                LOT #{currentBatch.id}
              </span>
              <span className="text-[#718EBF] block mt-0.5">
                Issued: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-[#E1F8EC] text-[#10B981] font-bold text-[10px]">
                OFFICIAL AUDIT COPY
              </span>
            </div>
          </div>

          {/* Section 1: Executive Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5]">
            <div>
              <span className="text-[10px] text-[#718EBF] uppercase font-bold block">Production Facility</span>
              <span className="text-xs font-bold text-[#343C6A] mt-0.5 block">{industryConfig.name}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#718EBF] uppercase font-bold block">Assigned Line</span>
              <span className="text-xs font-bold text-[#343C6A] mt-0.5 block">{currentBatch.productionLine}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#718EBF] uppercase font-bold block">Quality FPY Rate</span>
              <span className={`text-xs font-bold font-mono mt-0.5 block ${currentBatch.passRate > 90 ? 'text-[#10B981]' : 'text-[#FE5C73]'}`}>
                {currentBatch.passRate}%
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#718EBF] uppercase font-bold block">Integrity Seal</span>
              <span className="text-xs font-bold font-mono text-[#2D60FF] mt-0.5 block">0x7F8...9069</span>
            </div>
          </div>

          {/* Section 2: Complete Lifecycle Genealogy */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-[#343C6A] mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2D60FF]" />
              <span>7-Stage Lifecycle Verification Chain</span>
            </h3>

            <div className="border border-[#E6EFF5] rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#F5F7FA] border-b border-[#E6EFF5] text-[#718EBF] font-semibold">
                  <tr>
                    <th className="p-3">Stage</th>
                    <th className="p-3">Entity / Station</th>
                    <th className="p-3">Recorded Parameters</th>
                    <th className="p-3">Audit Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6EFF5] text-[#343C6A]">
                  <tr>
                    <td className="p-3 font-semibold">1. Raw Material</td>
                    <td className="p-3">{currentMaterial.name} ({currentMaterial.id})</td>
                    <td className="p-3 font-mono">Purity: {currentMaterial.purityScore}%</td>
                    <td className="p-3 text-[#10B981] font-bold">VERIFIED</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">2. Supplier</td>
                    <td className="p-3">{currentMaterial.supplierName}</td>
                    <td className="p-3 font-mono">Rating: 92% (Tier-1)</td>
                    <td className="p-3 text-[#10B981] font-bold">VERIFIED</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">3. Machine Cell</td>
                    <td className="p-3">{currentMachine.name} ({currentMachine.id})</td>
                    <td className="p-3 font-mono">Temp: {currentBatch.telemetry.temperature}°C</td>
                    <td className={`p-3 font-bold ${currentBatch.anomalyDetected ? 'text-[#FE5C73]' : 'text-[#10B981]'}`}>
                      {currentBatch.anomalyDetected ? 'FLAGGED EXCURSION' : 'NOMINAL'}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">4. Assembly</td>
                    <td className="p-3">{currentBatch.productName}</td>
                    <td className="p-3 font-mono">Cycle: 18.2 min</td>
                    <td className="p-3 text-[#10B981] font-bold">COMPLETED</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">5. QA Gateway</td>
                    <td className="p-3">Station Q-04 Eddy Current</td>
                    <td className="p-3 font-mono">Pass Rate: {currentBatch.passRate}%</td>
                    <td className={`p-3 font-bold ${currentBatch.passRate > 90 ? 'text-[#10B981]' : 'text-[#FE5C73]'}`}>
                      {currentBatch.passRate > 90 ? 'PASSED' : 'HOLD MANDATED'}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">6. Packaging</td>
                    <td className="p-3">Barcoded Palletizing</td>
                    <td className="p-3 font-mono">QR Sealed & Anchored</td>
                    <td className="p-3 text-[#10B981] font-bold">LOCKED</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">7. Dispatch</td>
                    <td className="p-3">Logistics Dock Line 04</td>
                    <td className="p-3 font-mono">Tracking Active</td>
                    <td className="p-3 text-[#2D60FF] font-bold">IN WAREHOUSE</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Sensor Envelope & Telemetry Log */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-[#E6EFF5] bg-white space-y-2">
              <h4 className="text-xs font-bold text-[#343C6A] flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#2D60FF]" />
                <span>Machine Sensor Envelope</span>
              </h4>
              <div className="space-y-1.5 text-xs text-[#718EBF]">
                <div className="flex justify-between">
                  <span>Chamber Temperature:</span>
                  <strong className="text-[#343C6A] font-mono">{currentBatch.telemetry.temperature}°C (Nominal: 180°C)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Hydraulic Pressure:</span>
                  <strong className="text-[#343C6A] font-mono">{currentBatch.telemetry.pressure} bar (Nominal: 5.0 bar)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Spindle Vibration:</span>
                  <strong className="text-[#343C6A] font-mono">{currentMachine.telemetry?.vibration || 2.1} mm/s (Limit: 3.8)</strong>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-[#E6EFF5] bg-white space-y-2">
              <h4 className="text-xs font-bold text-[#343C6A] flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Supplier Certification</span>
              </h4>
              <div className="space-y-1.5 text-xs text-[#718EBF]">
                <div className="flex justify-between">
                  <span>Material Lot:</span>
                  <strong className="text-[#343C6A] font-mono">{currentMaterial.id}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Mill Test Report:</span>
                  <strong className="text-[#343C6A] font-mono">MTR-2026-0922</strong>
                </div>
                <div className="flex justify-between">
                  <span>Carbon Footprint:</span>
                  <strong className="text-[#343C6A] font-mono">0.84 kg CO2e / unit</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Sign-off & Blockchain Seal */}
          <div className="pt-4 border-t border-[#E6EFF5] flex flex-col sm:flex-row items-center justify-between text-xs text-[#718EBF] gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#F5F7FA] border border-[#E6EFF5] flex items-center justify-center text-[#2D60FF]">
                <QrCode className="w-7 h-7" />
              </div>
              <div>
                <span className="font-mono text-[10px] text-[#343C6A] font-bold block">
                  DIGITAL PRODUCT PASSPORT QR #PRD-10021
                </span>
                <span className="text-[10px] text-[#718EBF]">
                  Cryptographically signed by ManuTrace AI Security Daemon
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[#718EBF] block">Authorized Plant Sign-off</span>
              <span className="text-xs font-bold text-[#343C6A] block mt-0.5">Dr. Marcus Vance (Plant Director)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
