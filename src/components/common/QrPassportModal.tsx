import React, { useState } from 'react';
import {
  X,
  QrCode,
  ShieldCheck,
  Download,
  CheckCircle2,
  Lock,
  Eye,
  Award,
  Printer,
  Camera,
  ScanLine
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { sound } from '../../services/soundFx';

export const QrPassportModal: React.FC = () => {
  const { isQrModalOpen, closeQrModal, qrTarget, industryConfig } = useApp();
  const [viewMode, setViewMode] = useState<'public' | 'internal' | 'scanner'>('public');
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanVerified, setScanVerified] = useState(false);

  if (!isQrModalOpen || !qrTarget) return null;

  const targetId = qrTarget.id || 'PRD-10021';
  const targetBatch = qrTarget.batchId || 'B-1042';
  const targetName = qrTarget.name || 'Brake Component Caliper Arm';

  const verificationHash = `0x9E7F...3B4A-${targetId.replace(/[^0-9]/g, '')}`;

  const handleDownload = () => {
    sound.playSuccess();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const handleTriggerScan = () => {
    sound.playScan();
    setIsScanning(true);
    setScanVerified(false);
    setTimeout(() => {
      setIsScanning(false);
      setScanVerified(true);
      sound.playSuccess();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-white border border-[#E6EFF5] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#E6EFF5] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#E7EDFF] text-[#2D60FF] flex items-center justify-center">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-[#343C6A]">
                  Digital Manufacturing Passport
                </h3>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#E1F8EC] text-[#10B981]">
                  VERIFIED
                </span>
              </div>
              <p className="text-xs text-[#718EBF]">
                Universal Asset ID: <span className="font-bold text-[#2D60FF]">{targetId}</span> • Lot: {targetBatch}
              </p>
            </div>
          </div>
          <button
            onClick={closeQrModal}
            className="p-2 rounded-full text-[#718EBF] hover:text-[#343C6A] hover:bg-[#F5F7FA] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Mode Switcher */}
        <div className="px-6 py-3 bg-[#F5F7FA] border-b border-[#E6EFF5] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                sound.playClick();
                setViewMode('public');
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                viewMode === 'public'
                  ? 'bg-[#2D60FF] text-white shadow-xs'
                  : 'text-[#718EBF] hover:text-[#343C6A] hover:bg-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Public View</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setViewMode('internal');
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                viewMode === 'internal'
                  ? 'bg-[#2D60FF] text-white shadow-xs'
                  : 'text-[#718EBF] hover:text-[#343C6A] hover:bg-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Factory Telemetry</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setViewMode('scanner');
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                viewMode === 'scanner'
                  ? 'bg-[#10B981] text-white shadow-xs'
                  : 'text-[#718EBF] hover:text-[#343C6A] hover:bg-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Scanner Simulator</span>
            </button>
          </div>

          <span className="text-xs text-[#718EBF]">
            {viewMode === 'public'
              ? 'Public audited view'
              : viewMode === 'internal'
              ? 'Confidential engineering mode'
              : 'Laser scanner simulation'}
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* QR Code & Identity Card */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-3xl bg-[#F5F7FA] border border-[#E6EFF5]">
            {/* High-contrast QR Code with BankDash subtle styling */}
            <div className="relative p-3.5 bg-white rounded-2xl shadow-sm border border-[#DFEAF2] flex-shrink-0 flex items-center justify-center">
              <svg
                viewBox="0 0 160 160"
                className="w-32 h-32 text-[#343C6A]"
                fill="currentColor"
              >
                {/* Corner Finder 1 */}
                <rect x="10" y="10" width="40" height="40" rx="6" fill="#343C6A" />
                <rect x="18" y="18" width="24" height="24" fill="#ffffff" />
                <rect x="24" y="24" width="12" height="12" fill="#2D60FF" />

                {/* Corner Finder 2 */}
                <rect x="110" y="10" width="40" height="40" rx="6" fill="#343C6A" />
                <rect x="118" y="18" width="24" height="24" fill="#ffffff" />
                <rect x="124" y="24" width="12" height="12" fill="#2D60FF" />

                {/* Corner Finder 3 */}
                <rect x="10" y="110" width="40" height="40" rx="6" fill="#343C6A" />
                <rect x="18" y="118" width="24" height="24" fill="#ffffff" />
                <rect x="24" y="124" width="12" height="12" fill="#2D60FF" />

                {/* QR Modules */}
                <circle cx="65" cy="20" r="4" fill="#343C6A" />
                <circle cx="80" cy="20" r="4" fill="#343C6A" />
                <circle cx="95" cy="20" r="4" fill="#343C6A" />
                <rect x="60" y="32" width="8" height="8" fill="#343C6A" />
                <rect x="76" y="32" width="8" height="8" fill="#343C6A" />
                <rect x="92" y="32" width="8" height="8" fill="#343C6A" />

                <rect x="20" y="65" width="8" height="8" fill="#343C6A" />
                <rect x="36" y="65" width="8" height="8" fill="#343C6A" />
                <rect x="52" y="65" width="8" height="8" fill="#343C6A" />
                <rect x="68" y="65" width="8" height="8" fill="#2D60FF" />
                <rect x="84" y="65" width="8" height="8" fill="#343C6A" />
                <rect x="100" y="65" width="8" height="8" fill="#343C6A" />
                <rect x="116" y="65" width="8" height="8" fill="#343C6A" />
                <rect x="132" y="65" width="8" height="8" fill="#343C6A" />

                <rect x="20" y="80" width="8" height="8" fill="#343C6A" />
                <rect x="36" y="80" width="8" height="8" fill="#343C6A" />
                <rect x="68" y="80" width="8" height="8" fill="#343C6A" />
                <rect x="84" y="80" width="8" height="8" fill="#2D60FF" />
                <rect x="116" y="80" width="8" height="8" fill="#343C6A" />
                <rect x="132" y="80" width="8" height="8" fill="#343C6A" />

                <rect x="20" y="95" width="8" height="8" fill="#343C6A" />
                <rect x="52" y="95" width="8" height="8" fill="#343C6A" />
                <rect x="68" y="95" width="8" height="8" fill="#343C6A" />
                <rect x="84" y="95" width="8" height="8" fill="#343C6A" />
                <rect x="100" y="95" width="8" height="8" fill="#2D60FF" />
                <rect x="132" y="95" width="8" height="8" fill="#343C6A" />

                <rect x="60" y="110" width="8" height="8" fill="#343C6A" />
                <rect x="76" y="110" width="8" height="8" fill="#343C6A" />
                <rect x="110" y="110" width="8" height="8" fill="#343C6A" />
                <rect x="126" y="110" width="8" height="8" fill="#343C6A" />
                <rect x="142" y="110" width="8" height="8" fill="#343C6A" />

                <rect x="60" y="126" width="8" height="8" fill="#343C6A" />
                <rect x="92" y="126" width="8" height="8" fill="#343C6A" />
                <rect x="110" y="126" width="8" height="8" fill="#2D60FF" />
                <rect x="126" y="126" width="8" height="8" fill="#343C6A" />

                <rect x="76" y="142" width="8" height="8" fill="#343C6A" />
                <rect x="92" y="142" width="8" height="8" fill="#343C6A" />
                <rect x="126" y="142" width="8" height="8" fill="#343C6A" />
                <rect x="142" y="142" width="8" height="8" fill="#343C6A" />
              </svg>
            </div>

            {/* Passport Identity Details */}
            <div className="flex-1 space-y-2 text-left">
              <span className="text-[11px] font-bold text-[#2D60FF] uppercase tracking-wider block">
                {industryConfig.name}
              </span>
              <h4 className="text-lg font-bold text-[#343C6A] leading-tight">{targetName}</h4>

              <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                <div>
                  <span className="text-[#718EBF] block text-[11px]">Product ID</span>
                  <span className="font-mono text-[#343C6A] font-bold">{targetId}</span>
                </div>
                <div>
                  <span className="text-[#718EBF] block text-[11px]">Production Batch</span>
                  <span className="font-mono text-[#343C6A] font-bold">{targetBatch}</span>
                </div>
                <div>
                  <span className="text-[#718EBF] block text-[11px]">Manufacturing Date</span>
                  <span className="text-[#343C6A] font-medium">22 Sep 2026</span>
                </div>
                <div>
                  <span className="text-[#718EBF] block text-[11px]">Traceability Status</span>
                  <span className="text-[#10B981] font-bold">100% Chain-of-Custody</span>
                </div>
              </div>
            </div>
          </div>

          {/* Public vs Internal vs Scanner Display Fields */}
          {viewMode === 'scanner' ? (
            <div className="relative p-6 rounded-3xl bg-[#F5F7FA] border border-[#E6EFF5] flex flex-col items-center justify-center min-h-[260px] overflow-hidden">
              {/* Corner Viewfinder Reticles */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#10B981]" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#10B981]" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#10B981]" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#10B981]" />

              {/* Sweeping Laser Line when scanning */}
              {isScanning && (
                <div
                  className="absolute left-0 right-0 h-1 bg-[#10B981] shadow-[0_0_15px_#10B981] animate-bounce pointer-events-none z-20"
                  style={{ animationDuration: '1.2s' }}
                />
              )}

              {/* Scanning status */}
              <div className="text-center space-y-3 z-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-[#10B981] text-xs font-bold border border-[#E6EFF5] shadow-xs">
                  <ScanLine className="w-4 h-4 animate-pulse" />
                  <span>
                    {isScanning
                      ? 'DECODING OPTICAL MATRIX...'
                      : scanVerified
                      ? 'PASSPORT SIGNATURE 100% VALIDATED'
                      : 'POINT SHOP FLOOR SCANNER AT QR'}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-[#343C6A]">
                  Target Asset: <span className="text-[#2D60FF]">{targetId}</span> (Lot: {targetBatch})
                </h4>

                {scanVerified && (
                  <div className="p-3.5 rounded-2xl bg-[#E1F8EC] border border-[#10B981]/30 text-[#10B981] text-xs font-semibold space-y-1">
                    <div className="flex items-center justify-center gap-2 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                      <span>OFFICIALLY VERIFIED ON SHOP FLOOR LEDGER</span>
                    </div>
                    <p className="text-[11px] text-[#343C6A]">
                      Hash Signature: {verificationHash} • Time: 2026-09-22T15:42:01Z
                    </p>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    onClick={handleTriggerScan}
                    disabled={isScanning}
                    className="px-6 py-2.5 rounded-full bg-[#10B981] hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 mx-auto"
                  >
                    <Camera className="w-4 h-4" />
                    <span>{isScanning ? 'Decoding...' : 'Trigger Laser Scanner Scan'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : viewMode === 'public' ? (
            <div className="p-5 rounded-3xl bg-white border border-[#E6EFF5] space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#2D60FF] uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Certified Public Passport Verification</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div className="p-3 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5]">
                  <span className="text-[11px] text-[#718EBF] block">Quality Status</span>
                  <span className="font-bold text-[#10B981] flex items-center gap-1.5 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Passed Factory QA Verification
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5]">
                  <span className="text-[11px] text-[#718EBF] block">Regulatory Compliance</span>
                  <span className="font-bold text-[#343C6A] mt-0.5 block">
                    ISO 26262 ASIL-D / IATF 16949
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5]">
                  <span className="text-[11px] text-[#718EBF] block">Digital Verification Hash</span>
                  <span className="font-mono text-xs font-bold text-[#2D60FF] mt-0.5 block truncate">
                    {verificationHash}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5]">
                  <span className="text-[11px] text-[#718EBF] block">Warranty & Authenticity</span>
                  <span className="font-bold text-[#343C6A] mt-0.5 block">
                    OEM Authentic • 5-Yr Guaranteed
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#E1F8EC] text-[11px] text-[#343C6A] flex items-center gap-2.5">
                <Award className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                <span>
                  Authorized Public Passport: Proprietary vendor margins and factory secret recipes are securely masked per enterprise IP policy.
                </span>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-3xl bg-white border border-[#E6EFF5] space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2D60FF]">
                <Lock className="w-4 h-4" />
                <span>Internal Manufacturing Telemetry (Confidential)</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5]">
                  <span className="text-[11px] text-[#718EBF] block">Peak Temp</span>
                  <span className="text-[#FE5C73] font-bold font-mono">182°C (M04 Alert)</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5]">
                  <span className="text-[11px] text-[#718EBF] block">Pressure</span>
                  <span className="text-[#2D60FF] font-bold font-mono">5.1 bar</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5]">
                  <span className="text-[11px] text-[#718EBF] block">Cycle Time</span>
                  <span className="text-[#343C6A] font-bold font-mono">20.4 min</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5]">
                  <span className="text-[11px] text-[#718EBF] block">Machine & Operator</span>
                  <span className="text-[#343C6A] font-bold font-mono">M04 / OP-17</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="p-5 border-t border-[#E6EFF5] bg-[#F5F7FA] flex items-center justify-between">
          <button
            onClick={closeQrModal}
            className="px-5 py-2.5 rounded-full text-xs font-bold text-[#718EBF] hover:text-[#343C6A] hover:bg-white"
          >
            Close
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold bg-white text-[#343C6A] border border-[#E6EFF5] hover:bg-[#EEF2F6]"
            >
              <Printer className="w-3.5 h-3.5 text-[#2D60FF]" />
              <span>Print Passport</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-[#2D60FF] hover:bg-blue-700 text-white shadow-[0_4px_12px_rgba(45,96,255,0.35)]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloadSuccess ? 'Downloaded!' : 'Download Passport (.PDF)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
