import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  FileText,
  Printer,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  ShieldCheck,
  Building2,
  Cpu,
  AlertTriangle,
  ArrowRight,
  Eye
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ReportConfig {
  id: string;
  title: string;
  desc: string;
  icon: React.ElementType;
  lastGenerated: string;
  format: string;
  color: string;
}

export const ReportsPage: React.FC = () => {
  const { industryConfig } = useApp();
  const [selectedReport, setSelectedReport] = useState<string>('traceability');
  const [generating, setGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const reportTypes: ReportConfig[] = [
    {
      id: 'traceability',
      title: 'Manufacturing Traceability Report',
      desc: 'Complete digital pedigree connecting raw material heats, machining telemetry, and outbound logistics.',
      icon: ShieldCheck,
      lastGenerated: '22 Sep 2026 14:30',
      format: 'PDF / CSV',
      color: 'text-cyan'
    },
    {
      id: 'batch-quality',
      title: 'Batch Quality & Compliance Report',
      desc: 'First-pass yield, CMM metrology inspection logs, and ASIL-D / ISO 26262 audit sheets.',
      icon: Layers,
      lastGenerated: '22 Sep 2026 12:15',
      format: 'PDF / CSV',
      color: 'text-emerald-400'
    },
    {
      id: 'defect-analysis',
      title: 'Defect Root Cause & Pareto Report',
      desc: 'Decomposition of defect categories, thermal deviations, and toolpath chatter correlations.',
      icon: AlertTriangle,
      lastGenerated: '22 Sep 2026 11:00',
      format: 'PDF / CSV',
      color: 'text-purple-400'
    },
    {
      id: 'supplier',
      title: 'Tier-1 Supplier Quality Scorecard',
      desc: 'Incoming purity assays, certificate of analysis verification, and vendor defect PPM rankings.',
      icon: Building2,
      lastGenerated: '21 Sep 2026 18:00',
      format: 'PDF / CSV',
      color: 'text-blue-400'
    },
    {
      id: 'machine',
      title: 'Machinery OEE & Telemetry Health',
      desc: 'Continuous vibration harmonics, spindle operating hours, and preventative maintenance logs.',
      icon: Cpu,
      lastGenerated: '22 Sep 2026 09:30',
      format: 'PDF / CSV',
      color: 'text-amber-400'
    },
    {
      id: 'impact',
      title: 'Impact Analysis & Quarantine Audit',
      desc: 'Downstream blast-radius evaluation for machine temperature excursions and supplier lots.',
      icon: AlertTriangle,
      lastGenerated: '22 Sep 2026 13:45',
      format: 'PDF / CSV',
      color: 'text-red-400'
    }
  ];

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setDownloadSuccess('Report generated successfully.');
      setTimeout(() => setDownloadSuccess(null), 3000);
    }, 600);
  };

  const handleDownload = (format: 'PDF' | 'CSV') => {
    // Generate simulated downloadable file
    const content = `MANUTRACE AI ENTERPRISE MANUFACTURING REPORT\nType: ${selectedReport.toUpperCase()}\nFacility: ${industryConfig.name}\nDate: 2026-09-22\nStatus: VERIFIED\nCompliance: ISO 9001 / IATF 16949 / ASIL-D\n\nEntity,Lot,Status,PassRate,DefectPPM\nPRD-10021,B-1042,PASSED,96.8%,3200\nPRD-10022,B-1043,PASSED,95.4%,4600\nRM-7821,LOT-A4140,FLAGGED,98.4%,1800\nM04,Line-04,WARNING,82.0%,14-Incidents`;
    const blob = new Blob([content], { type: format === 'CSV' ? 'text/csv' : 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ManuTrace_${selectedReport}_${new Date().toISOString().slice(0, 10)}.${format.toLowerCase()}`;
    a.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess(`Downloaded ${format} document.`);
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E2D4A] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan uppercase tracking-widest mb-1">
            <FileSpreadsheet className="w-4 h-4" />
            <span>Industrial Compliance & Regulatory Document Engine</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Manufacturing Reports & Audits
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Export certified traceability dossiers, supplier scorecards, and defect impact analyses for regulatory compliance
          </p>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleDownload('CSV')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#131D31] hover:bg-[#18243C] text-slate-200 border border-[#1E2D4A] text-xs font-mono transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => handleDownload('PDF')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan text-white text-xs font-bold uppercase tracking-wider hover:opacity-95 shadow-glow-cyan transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Grid of Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportTypes.map(rep => {
          const Icon = rep.icon;
          const isSelected = selectedReport === rep.id;

          return (
            <div
              key={rep.id}
              onClick={() => setSelectedReport(rep.id)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between group ${
                isSelected
                  ? 'bg-[#18243C] border-cyan shadow-glow-cyan/25 scale-[1.01]'
                  : 'bg-[#0F1626] border-[#1E2D4A] hover:border-slate-400'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-xl bg-[#131D31] border border-[#1E2D4A] ${rep.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {rep.format}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white leading-tight">{rep.title}</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{rep.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1E2D4A]/60 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500 text-[10px]">Last: {rep.lastGenerated.split(' ')[0]}</span>
                <span className="text-cyan group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold">
                  Select →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Report Generator & Live Preview Studio */}
      <div className="p-6 rounded-2xl bg-[#0F1626] border border-[#1E2D4A] shadow-card-dark space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E2D4A] pb-3">
          <div>
            <span className="text-[10px] font-mono uppercase text-cyan font-bold">
              Report Generation Workspace
            </span>
            <h3 className="text-base font-bold text-white">
              {reportTypes.find(r => r.id === selectedReport)?.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-cyan text-slate-950 text-xs font-bold uppercase tracking-wider hover:bg-cyan-glow transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{generating ? 'Compiling Dossier...' : 'Generate Report'}</span>
            </button>
            <button
              onClick={() => handleDownload('PDF')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#131D31] hover:bg-[#18243C] text-slate-200 border border-[#1E2D4A] text-xs font-mono"
            >
              <Download className="w-3.5 h-3.5 text-cyan" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={() => handleDownload('CSV')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#131D31] hover:bg-[#18243C] text-slate-200 border border-[#1E2D4A] text-xs font-mono"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Live Document Preview Box */}
        <div className="p-5 rounded-xl bg-[#0B0F19] border border-[#1E2D4A] font-mono text-xs space-y-4">
          <div className="flex items-center justify-between text-slate-500 border-b border-[#1E2D4A]/60 pb-2">
            <span>DOCUMENT PREVIEW • SECURE REGULATORY EXPORT</span>
            <span>CLASSIFICATION: AUDIT READY</span>
          </div>

          <div className="space-y-1 text-slate-300">
            <div className="text-cyan font-bold text-sm">
              MANUTRACE AI — OFFICIAL TRACEABILITY & COMPLIANCE DOSSIER
            </div>
            <div>Facility: {industryConfig.name} (Plant 04)</div>
            <div>Standard: ISO 26262 ASIL-D / IATF 16949:2016 Compliant</div>
            <div>Target Batch: B-1042 (PRD-10021 series)</div>
            <div>Digital Verification Hash: 0x9E7F-77A1-4140-3B4A</div>
          </div>

          <div className="p-3 rounded-lg bg-[#131D31] border border-[#1E2D4A] text-slate-200">
            <p className="text-[11px] leading-relaxed">
              Summary: All raw material heat certifications (RM-7821), CNC machining dwell logs (M04), and inline 100% CMM coordinate verifications have been indexed and sealed into the cryptographically verifiable Digital Product Passport. Zero critical escapes recorded.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
