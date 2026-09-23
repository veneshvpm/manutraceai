import React from 'react';
import {
  Layers,
  Package,
  CheckCircle2,
  AlertOctagon,
  ShieldCheck,
  Flame,
  Activity,
  TrendingUp,
  Cpu,
  ArrowUpRight,
  ExternalLink,
  Sliders,
  Sparkles,
  GitFork,
  Radio,
  Send,
  Boxes,
  QrCode
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DashboardPage: React.FC = () => {
  const {
    industryConfig,
    setActiveTab,
    setSelectedBatchId,
    setSelectedProductId,
    setSelectedMachineId,
    setIsPassportModalOpen
  } = useApp();

  const handleInspectBatch = (batchId: string) => {
    setSelectedBatchId(batchId);
    setSelectedProductId('PRD-10021');
    setActiveTab('passport');
  };

  const handleInspectMachine = (machineId: string) => {
    setSelectedMachineId(machineId);
    setActiveTab('machines');
  };

  const handleInspectMaterial = (_materialId: string) => {
    setActiveTab('reverse-trace');
  };

  return (
    <div className="p-8 space-y-7 max-w-7xl mx-auto">
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#343C6A] tracking-tight">
            Manufacturing Overview
          </h1>
          <p className="text-xs text-[#718EBF] mt-1 font-medium">
            Facility: <span className="text-[#343C6A] font-semibold">{industryConfig.name}</span> • Line 01–06 Telemetry Synchronized
          </p>
        </div>

        {/* Action Pills */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleInspectBatch('B-1042')}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFEBEF] text-[#FE5C73] hover:bg-[#FFD9E0] text-xs font-bold transition-all"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Anomaly Batch B-1042</span>
          </button>
          <button
            onClick={() => setIsPassportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#2D60FF] hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-[0_4px_12px_rgba(45,96,255,0.3)]"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Digital Passport QR</span>
          </button>
        </div>
      </div>

      {/* Row 1: BankDash "My Cards" (Key Passports) + "Recent Incidents" */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: My Cards (Manufacturing Batches / Passports) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#343C6A]">Key Passports & Active Batches</h2>
            <button
              onClick={() => setActiveTab('products')}
              className="text-xs font-bold text-[#343C6A] hover:text-[#2D60FF] transition-colors"
            >
              See All Batches
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Card 1: BankDash Gradient Royal Blue Hero Card */}
            <div className="relative p-6 rounded-3xl bg-gradient-to-tr from-[#2D60FF] via-[#1F4BFF] to-[#0A25C9] text-white shadow-[0_10px_25px_rgba(45,96,255,0.3)] flex flex-col justify-between h-56 overflow-hidden">
              {/* Background ambient watermarks */}
              <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-white/5 pointer-events-none" />
              <div className="absolute right-12 top-6 w-12 h-9 rounded-md border-2 border-white/30 flex items-center justify-center pointer-events-none">
                <div className="w-7 h-5 rounded-sm bg-white/20 grid grid-cols-2 gap-0.5 p-0.5">
                  <div className="bg-white/40 rounded-[1px]" />
                  <div className="bg-white/40 rounded-[1px]" />
                  <div className="bg-white/40 rounded-[1px]" />
                  <div className="bg-white/40 rounded-[1px]" />
                </div>
              </div>

              <div>
                <span className="text-xs text-white/75 font-medium tracking-wide">Primary Tracked Lot</span>
                <div className="text-2xl font-black font-mono tracking-tight mt-1">Batch B-1042</div>
                <div className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FE5C73] text-white text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  Thermal Deviation Flagged
                </div>
              </div>

              <div className="flex items-end justify-between z-10">
                <div>
                  <div className="text-[10px] uppercase text-white/70 tracking-wider">ASSIGNED LINE / MACHINE</div>
                  <div className="text-xs font-bold font-mono text-white">Line 04 • Machine M04</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-white/70 tracking-wider">STAMP</div>
                  <div className="text-xs font-bold font-mono text-white">16:45 UTC</div>
                </div>
                <button
                  onClick={() => handleInspectBatch('B-1042')}
                  className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-colors"
                >
                  View Passport
                </button>
              </div>
            </div>

            {/* Card 2: BankDash Clean White Hero Card */}
            <div className="relative p-6 rounded-3xl bg-white border border-[#E6EFF5] text-[#343C6A] shadow-sm flex flex-col justify-between h-56 overflow-hidden">
              <div className="absolute right-12 top-6 w-12 h-9 rounded-md border-2 border-[#DFEAF2] flex items-center justify-center pointer-events-none">
                <div className="w-7 h-5 rounded-sm bg-[#F5F7FA] grid grid-cols-2 gap-0.5 p-0.5">
                  <div className="bg-[#718EBF]/30 rounded-[1px]" />
                  <div className="bg-[#718EBF]/30 rounded-[1px]" />
                  <div className="bg-[#718EBF]/30 rounded-[1px]" />
                  <div className="bg-[#718EBF]/30 rounded-[1px]" />
                </div>
              </div>

              <div>
                <span className="text-xs text-[#718EBF] font-medium tracking-wide">Certified Benchmark Lot</span>
                <div className="text-2xl font-black font-mono tracking-tight text-[#343C6A] mt-1">Batch B-1041</div>
                <div className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E1F8EC] text-[#10B981] text-[10px] font-bold">
                  <CheckCircle2 className="w-3 h-3" />
                  Pass 99.4% FPY
                </div>
              </div>

              <div className="flex items-end justify-between z-10">
                <div>
                  <div className="text-[10px] uppercase text-[#718EBF] tracking-wider">ASSIGNED LINE</div>
                  <div className="text-xs font-bold font-mono text-[#343C6A]">Line 02 • High Precision</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-[#718EBF] tracking-wider">STATUS</div>
                  <div className="text-xs font-bold font-mono text-[#10B981]">Released</div>
                </div>
                <button
                  onClick={() => handleInspectBatch('B-1041')}
                  className="px-3 py-1.5 rounded-xl bg-[#F5F7FA] hover:bg-[#EEF2F6] text-[#343C6A] text-xs font-bold border border-[#E6EFF5] transition-colors"
                >
                  Verify QR
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Recent Incident Stream (styled like Recent Transactions in BankDash) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#343C6A]">Recent Telemetry Incidents</h2>
            <button
              onClick={() => setActiveTab('impact')}
              className="text-xs font-bold text-[#343C6A] hover:text-[#2D60FF] transition-colors"
            >
              Analyze
            </button>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-[#E6EFF5] shadow-sm space-y-4">
            {/* Item 1: Yellow/Amber Circular Avatar */}
            <div className="flex items-center justify-between group cursor-pointer" onClick={() => handleInspectBatch('B-1042')}>
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF5D9] text-[#FFBB38] flex items-center justify-center flex-shrink-0">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#343C6A] group-hover:text-[#2D60FF] transition-colors">
                    Thermal Spike in B-1042
                  </h4>
                  <p className="text-xs text-[#718EBF]">Machine M04 • 182°C sustained</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#FE5C73] block">+8.4% Defect</span>
                <span className="text-[10px] text-[#718EBF]">16:45 UTC</span>
              </div>
            </div>

            {/* Item 2: Blue Circular Avatar */}
            <div className="flex items-center justify-between group cursor-pointer" onClick={() => handleInspectMaterial('RM-7821')}>
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#E7EDFF] text-[#2D60FF] flex items-center justify-center flex-shrink-0">
                  <Boxes className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#343C6A] group-hover:text-[#2D60FF] transition-colors">
                    RM-7821 Hardness Drift
                  </h4>
                  <p className="text-xs text-[#718EBF]">Global Materials Ltd • Lot #991</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#FFBB38] block">+3.8% Hardness</span>
                <span className="text-[10px] text-[#718EBF]">14:20 UTC</span>
              </div>
            </div>

            {/* Item 3: Cyan Circular Avatar */}
            <div className="flex items-center justify-between group cursor-pointer" onClick={() => handleInspectMachine('M04')}>
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#DCFAF8] text-[#16DBCC] flex items-center justify-center flex-shrink-0">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#343C6A] group-hover:text-[#2D60FF] transition-colors">
                    Spindle Vibration Alert
                  </h4>
                  <p className="text-xs text-[#718EBF]">Machine M04 • 3.4 mm/s RMS</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#2D60FF] block">Service Due</span>
                <span className="text-[10px] text-[#718EBF]">11:05 UTC</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: BankDash KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-3xl bg-white border border-[#E6EFF5] shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FFF5D9] text-[#FFBB38] flex items-center justify-center flex-shrink-0">
            <Layers className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-[#718EBF] font-medium block">Active Batches</span>
            <div className="text-2xl font-black text-[#343C6A] font-mono mt-0.5">24 Lots</div>
            <span className="text-[11px] font-semibold text-[#10B981]">+3 lots added today</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#E6EFF5] shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#E7EDFF] text-[#2D60FF] flex items-center justify-center flex-shrink-0">
            <Package className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-[#718EBF] font-medium block">Units Manufactured</span>
            <div className="text-2xl font-black text-[#343C6A] font-mono mt-0.5">18,426</div>
            <span className="text-[11px] font-semibold text-[#10B981]">+1,240 vs target</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#E6EFF5] shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#DCFAF8] text-[#16DBCC] flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-[#718EBF] font-medium block">Quality Pass Rate</span>
            <div className="text-2xl font-black text-[#343C6A] font-mono mt-0.5">96.8%</div>
            <span className="text-[11px] font-semibold text-[#10B981]">+0.4% First-Pass Yield</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#E6EFF5] shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FFE0EB] text-[#FF82AC] flex items-center justify-center flex-shrink-0">
            <Flame className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-[#718EBF] font-medium block">Quarantined Lots</span>
            <div className="text-2xl font-black text-[#343C6A] font-mono mt-0.5">4 Batches</div>
            <span className="text-[11px] font-semibold text-[#FE5C73]">B-1042 under quarantine</span>
          </div>
        </div>
      </div>

      {/* Row 3: Weekly Activity (Double Bar Chart) + Manufacturing Health Score (Donut Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#343C6A]">Weekly Production Activity</h2>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-2 text-[#718EBF]">
                <span className="w-3 h-3 rounded-full bg-[#16DBCC]" /> Target Units
              </span>
              <span className="flex items-center gap-2 text-[#718EBF]">
                <span className="w-3 h-3 rounded-full bg-[#2D60FF]" /> Completed Units
              </span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#E6EFF5] shadow-sm">
            {/* Clean SVG double-bar chart matching BankDash style */}
            <div className="h-64 w-full">
              <svg viewBox="0 0 600 240" className="w-full h-full">
                {/* Horizontal Grid lines */}
                {[40, 90, 140, 190].map((y, idx) => (
                  <g key={idx}>
                    <line x1="45" y1={y} x2="570" y2={y} stroke="#F2F5F8" strokeWidth="1.5" />
                    <text x="35" y={y + 4} fill="#8BA3CB" fontSize="10" textAnchor="end" fontFamily="sans-serif">
                      {500 - idx * 125}
                    </text>
                  </g>
                ))}

                {/* Day bars */}
                {[
                  { day: 'Sat', target: 280, completed: 340, x: 75 },
                  { day: 'Sun', target: 180, completed: 210, x: 150 },
                  { day: 'Mon', target: 360, completed: 420, x: 225 },
                  { day: 'Tue', target: 310, completed: 370, x: 300 },
                  { day: 'Wed', target: 220, completed: 290, x: 375 },
                  { day: 'Thu', target: 390, completed: 480, x: 450, alert: true },
                  { day: 'Fri', target: 340, completed: 390, x: 525 }
                ].map((item, idx) => {
                  const targetH = (item.target / 500) * 150;
                  const completedH = (item.completed / 500) * 150;
                  const baseY = 190;

                  return (
                    <g key={idx}>
                      {/* Target Bar (Cyan #16DBCC) */}
                      <rect
                        x={item.x - 14}
                        y={baseY - targetH}
                        width="11"
                        height={targetH}
                        rx="5.5"
                        fill="#16DBCC"
                      />
                      {/* Completed Bar (Royal Blue #2D60FF) */}
                      <rect
                        x={item.x}
                        y={baseY - completedH}
                        width="11"
                        height={completedH}
                        rx="5.5"
                        fill="#2D60FF"
                      />

                      {/* Day Label */}
                      <text
                        x={item.x - 3}
                        y="215"
                        fill="#718EBF"
                        fontSize="11"
                        fontWeight="500"
                        textAnchor="middle"
                        fontFamily="sans-serif"
                      >
                        {item.day}
                      </text>

                      {/* Thu Spike / Anomaly Callout */}
                      {item.alert && (
                        <g>
                          <circle cx={item.x + 5} cy={baseY - completedH - 8} r="4" fill="#FE5C73" />
                          <rect x={item.x - 45} y={baseY - completedH - 30} width="100" height="18" rx="9" fill="#343C6A" />
                          <text x={item.x + 5} y={baseY - completedH - 18} fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle">
                            B-1042 Spike
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>

        {/* Manufacturing Health Score (Donut Chart like BankDash "Expense Statistics") */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#343C6A]">Manufacturing Health</h2>
            <span className="text-xs font-bold text-[#10B981] bg-[#E1F8EC] px-3 py-1 rounded-full">
              Score: 87/100
            </span>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#E6EFF5] shadow-sm flex flex-col items-center justify-between min-h-[320px]">
            <div className="relative w-48 h-48 my-2">
              {/* Multi-segmented Pie/Donut Chart */}
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {/* Navy Slice (Process 92%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="transparent"
                  stroke="#343C6A"
                  strokeWidth="14"
                  strokeDasharray="219.9"
                  strokeDashoffset="70"
                />
                {/* Royal Blue Slice (Quality 96.8%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="transparent"
                  stroke="#2D60FF"
                  strokeWidth="14"
                  strokeDasharray="219.9"
                  strokeDashoffset="130"
                />
                {/* Orange/Amber Slice (Supply 82%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="transparent"
                  stroke="#FFBB38"
                  strokeWidth="14"
                  strokeDasharray="219.9"
                  strokeDashoffset="175"
                />
                {/* Coral Red Slice (Machine Alert 78%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="transparent"
                  stroke="#FE5C73"
                  strokeWidth="14"
                  strokeDasharray="219.9"
                  strokeDashoffset="200"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black text-[#343C6A] font-mono leading-none">87%</span>
                <span className="text-[11px] text-[#718EBF] font-medium mt-1">Aggregated</span>
              </div>
            </div>

            {/* Legend tags */}
            <div className="grid grid-cols-2 gap-3 w-full pt-4 border-t border-[#E6EFF5]">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-[#343C6A]" />
                <span className="text-[#718EBF]">Process: <strong className="text-[#343C6A]">92%</strong></span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2D60FF]" />
                <span className="text-[#718EBF]">Quality: <strong className="text-[#343C6A]">96.8%</strong></span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFBB38]" />
                <span className="text-[#718EBF]">Supply: <strong className="text-[#343C6A]">82%</strong></span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FE5C73]" />
                <span className="text-[#718EBF]">Machine: <strong className="text-[#FE5C73]">78%</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Quick Dispatch & Traceability Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Batch Quarantine / Action Trigger */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-[#343C6A]">Quick Containment & Action</h2>
          <div className="p-6 rounded-3xl bg-white border border-[#E6EFF5] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#2D60FF] to-[#1230AE] text-white flex items-center justify-center font-bold text-sm shadow-md">
                QA
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#343C6A]">Contain Batch B-1042 Blast Radius</h4>
                <p className="text-xs text-[#718EBF]">Quarantine 486 finished assemblies across Line 04 and warehouse dock</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('impact')}
                className="px-5 py-2.5 rounded-full bg-[#FFEBEF] hover:bg-[#FFD9E0] text-[#FE5C73] text-xs font-bold transition-all"
              >
                Inspect Blast Radius
              </button>
              <button
                onClick={() => setActiveTab('simulator')}
                className="px-6 py-2.5 rounded-full bg-[#2D60FF] hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-[0_4px_12px_rgba(45,96,255,0.35)]"
              >
                Simulate Rework
              </button>
            </div>
          </div>
        </div>

        {/* Universal Geneology Shortcut */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[#343C6A]">Traceability Flows</h2>
          <div className="p-6 rounded-3xl bg-white border border-[#E6EFF5] shadow-sm flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-[#343C6A]">Forward Genealogy</h4>
              <p className="text-xs text-[#718EBF]">Supplier to customer handoff</p>
            </div>
            <button
              onClick={() => setActiveTab('traceability')}
              className="p-3 rounded-2xl bg-[#F5F7FA] hover:bg-[#EEF2F6] text-[#2D60FF] transition-colors"
            >
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
