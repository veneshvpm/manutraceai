import React, { useState } from 'react';
import {
  GitFork,
  Search,
  Building2,
  Boxes,
  Layers,
  Cpu,
  Factory,
  CheckCircle2,
  Package,
  Truck,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sound } from '../services/soundFx';

export const TraceabilityPage: React.FC = () => {
  const {
    setSelectedBatchId,
    setSelectedProductId,
    setSelectedMachineId,
    setSelectedRawMaterialId,
    setActiveTab
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('B-1042');
  const [activeNode, setActiveNode] = useState<string>('batch');
  const [anomalyFilterActive, setAnomalyFilterActive] = useState<boolean>(false);

  const chainNodes = [
    {
      id: 'supplier',
      title: 'SUPPLIER',
      code: 'SUP-001',
      name: 'Global Materials Ltd.',
      icon: Building2,
      status: 'verified',
      meta: 'Munich, Germany • IATF 16949',
      details: {
        'Quality Score': '94%',
        'Defect Rate': '1.8%',
        'Material Specialization': 'High-Tensile Alloy 4140',
        'Compliance Certificate': 'ISO 9001:2015 Approved'
      }
    },
    {
      id: 'raw-material',
      title: 'RAW MATERIAL BATCH',
      code: 'RM-7821',
      name: 'High-Tensile Steel Alloy 4140',
      icon: Boxes,
      status: 'warning',
      meta: 'Lot: 2026-09-A4140 • Grade A+',
      details: {
        'Supplier Batch No': 'LOT-2026-09-A4140',
        'Purity Score': '98.4%',
        'Tensile Hardness': '214 HB (+3.8% variance)',
        'Status': 'Under Quality Review'
      }
    },
    {
      id: 'batch',
      title: 'PRODUCTION BATCH',
      code: 'B-1042',
      name: '486 Units Caliper Arms',
      icon: Layers,
      status: 'warning',
      meta: 'Line 04 • 22 Sep 2026',
      details: {
        'Pass Rate': '96.8%',
        'Defect Rate': '3.2%',
        'Chamber Temp': '182°C (Dev +2°C)',
        'Operator': 'OP-17 (Senior CNC Tech)'
      }
    },
    {
      id: 'machine',
      title: 'MACHINERY & CELL',
      code: 'M04',
      name: '5-Axis CNC Milling Center',
      icon: Cpu,
      status: 'warning',
      meta: 'Spindle: 1420 RPM • 82% Util',
      details: {
        'Spindle Vibration': '3.4 mm/s (Warning)',
        'Coolant Pressure': '5.1 bar',
        'Last Maintenance': '18 Sep 2026',
        'Firmware': 'Siemens Sinumerik ONE'
      }
    },
    {
      id: 'process',
      title: 'PRODUCTION PROCESS',
      code: 'PROC-CNC-4',
      name: 'High-Speed Contouring & Bore Milling',
      icon: Factory,
      status: 'verified',
      meta: 'Dwell: 20.4 min • Feed: 350 mm/m',
      details: {
        'Process Target': '18.0 min dwell',
        'Tolerance Window': '±0.025 mm',
        'Cutting Fluid': 'Synthetic Emulsion 8%',
        'Tool Wear Ratio': '68%'
      }
    },
    {
      id: 'quality',
      title: 'QUALITY INSPECTION',
      code: 'INS-901 / 902',
      name: 'Metrology Lab Station Q-04',
      icon: CheckCircle2,
      status: 'verified',
      meta: '100% CMM Probe • 0 Critical Defects',
      details: {
        'Result': 'Passed First Article Inspection',
        'Bore Flank': 'Within ±0.012 mm',
        'Surface Roughness': 'Ra 0.8 µm',
        'Auditor': 'Dave Miller (Lead QC)'
      }
    },
    {
      id: 'product',
      title: 'FINISHED PRODUCT',
      code: 'PRD-10021',
      name: 'Brake Component Caliper Arm',
      icon: Package,
      status: 'verified',
      meta: 'ASIL-D Compliant • Serial Tracked',
      details: {
        'Serial Number': 'SN-2026-BC-00421',
        'Certification': 'ISO 26262 ASIL-D',
        'Warranty Period': '5-Yr / 100,000 km',
        'QR Passport': 'Active & Cryptographically Signed'
      }
    },
    {
      id: 'shipment',
      title: 'CUSTOMER SHIPMENT',
      code: 'SHP-22091',
      name: 'DHL Industrial Freight Logistics',
      icon: Truck,
      status: 'verified',
      meta: 'Stuttgart OEM Assembly Plant',
      details: {
        'Dispatch Date': '22 Sep 2026 14:15',
        'Carrier Waybill': 'DHL-EX-99812401',
        'Quantity': '240 Units (Sub-lot 1)',
        'Delivery Status': 'In-Transit (Tracked)'
      }
    }
  ];

  const currentNodeInfo = chainNodes.find(n => n.id === activeNode) || chainNodes[2];

  const handleQuickSearch = (q: string) => {
    setSearchQuery(q);
  };

  const handleOpenNodeModule = (node: typeof chainNodes[0]) => {
    if (node.id === 'batch' || node.id === 'product') {
      setSelectedBatchId('B-1042');
      setSelectedProductId('PRD-10021');
      setActiveTab('passport');
    } else if (node.id === 'machine') {
      setSelectedMachineId('M04');
      setActiveTab('machines');
    } else if (node.id === 'supplier') {
      setActiveTab('suppliers');
    } else if (node.id === 'raw-material') {
      setSelectedRawMaterialId('RM-7821');
      setActiveTab('reverse-trace');
    } else if (node.id === 'quality') {
      setActiveTab('quality');
    }
  };

  return (
    <div className="p-8 space-y-7 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#343C6A] tracking-tight">
            Universal Traceability Flow
          </h1>
          <p className="text-xs text-[#718EBF] mt-1 font-medium">
            Unbroken physical and digital provenance from tier-1 raw materials to customer delivery
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSelectedRawMaterialId('RM-7821');
              setActiveTab('reverse-trace');
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E7EDFF] hover:bg-[#D5E2FF] text-[#2D60FF] text-xs font-bold transition-all shadow-xs"
          >
            <Boxes className="w-4 h-4" />
            <span>Switch to Reverse Trace</span>
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="p-4 rounded-3xl bg-white border border-[#E6EFF5] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#718EBF] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by Product ID, Batch ID, Raw Material ID, Machine ID, or Supplier ID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#F5F7FA] border-0 text-xs font-medium text-[#343C6A] placeholder-[#8BA3CB] focus:outline-none focus:ring-2 focus:ring-[#2D60FF]/20"
          />
        </div>

        {/* Quick query buttons */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-[#718EBF] font-semibold text-xs">Quick Traces:</span>
          {['B-1042', 'RM-7821', 'M04', 'PRD-10021', 'SUP-001'].map(id => (
            <button
              key={id}
              onClick={() => handleQuickSearch(id)}
              className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors ${
                searchQuery.toUpperCase() === id
                  ? 'bg-[#2D60FF] text-white border-[#2D60FF] shadow-xs'
                  : 'bg-[#F5F7FA] text-[#718EBF] border-[#E6EFF5] hover:text-[#343C6A]'
              }`}
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Traceability Flow Pipeline */}
      <div className="p-6 rounded-3xl bg-white border border-[#E6EFF5] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E6EFF5] pb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-[#2D60FF] animate-pulse shadow-[0_0_8px_rgba(45,96,255,0.5)]" />
            <span className="text-xs font-bold text-[#343C6A]">
              Active Lineage: <span className="text-[#2D60FF]">{searchQuery.toUpperCase() || 'B-1042'}</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sound.playClick();
                setAnomalyFilterActive(!anomalyFilterActive);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                anomalyFilterActive
                  ? 'bg-[#FFEBEF] text-[#FE5C73] border border-[#FE5C73]/40'
                  : 'bg-[#F5F7FA] text-[#718EBF] border border-[#E6EFF5] hover:text-[#343C6A]'
              }`}
            >
              {anomalyFilterActive ? 'Showing Flagged Nodes Only' : 'Filter Anomaly Path'}
            </button>

            <span className="text-xs text-[#10B981] font-bold hidden sm:inline bg-[#E1F8EC] px-3 py-1 rounded-full">
              100% Verified Chain • 8 Nodes
            </span>
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="relative h-2 w-full bg-[#F5F7FA] rounded-full overflow-hidden border border-[#E6EFF5]">
          <div
            className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-[#2D60FF] to-transparent shadow-[0_0_12px_rgba(45,96,255,0.4)] animate-[slideIn_2s_linear_infinite]"
            style={{ width: '25%' }}
          />
        </div>

        {/* Horizontal Visual Pipeline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {chainNodes
            .filter(node => (!anomalyFilterActive ? true : node.status === 'warning'))
            .map((node, idx) => {
              const Icon = node.icon;
              const isSelected = activeNode === node.id;
              const isWarning = node.status === 'warning';

              return (
                <div
                  key={node.id}
                  onClick={() => {
                    sound.playClick();
                    setActiveNode(node.id);
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 relative flex flex-col justify-between group ${
                    isSelected
                      ? 'bg-[#E7EDFF] border-[#2D60FF] shadow-xs'
                      : isWarning
                      ? 'bg-[#FFF5D9] border-[#FFBB38]/50 hover:border-[#FFBB38]'
                      : 'bg-[#F5F7FA] border-[#E6EFF5] hover:bg-[#EEF2F6]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold text-[#718EBF]">
                        NODE 0{idx + 1}
                      </span>
                      <div
                        className={`p-2 rounded-xl ${
                          isSelected
                            ? 'bg-[#2D60FF] text-white'
                            : isWarning
                            ? 'bg-[#FFBB38] text-white'
                            : 'bg-white text-[#718EBF] group-hover:text-[#2D60FF]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#718EBF] block">
                      {node.title}
                    </span>
                    <h4 className="text-sm font-black text-[#2D60FF] font-mono mt-0.5">
                      {node.code}
                    </h4>
                    <p className="text-xs font-bold text-[#343C6A] mt-1 line-clamp-1">
                      {node.name}
                    </p>
                    <p className="text-[11px] text-[#718EBF] mt-0.5 line-clamp-1">
                      {node.meta}
                    </p>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-black/5 flex items-center justify-between text-[11px]">
                    {isWarning ? (
                      <span className="text-[#FEAA09] font-bold flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#FEAA09] animate-ping" />
                        Thermal Flag
                      </span>
                    ) : (
                      <span className="text-[#10B981] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    )}

                    <span className="text-[#718EBF] font-semibold group-hover:text-[#2D60FF] transition-colors">
                      Inspect →
                    </span>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Detailed Inspector Drawer for Selected Node */}
        <div className="p-5 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5] animate-fade-in space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E6EFF5] pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-white text-[#2D60FF] shadow-xs">
                {React.createElement(currentNodeInfo.icon, { className: 'w-5 h-5' })}
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#2D60FF] uppercase tracking-wider">
                  Node Telemetry Inspector
                </span>
                <h3 className="text-base font-bold text-[#343C6A] flex items-center gap-2">
                  <span>{currentNodeInfo.name}</span>
                  <span className="text-xs font-bold text-[#2D60FF]">[{currentNodeInfo.code}]</span>
                </h3>
              </div>
            </div>

            <button
              onClick={() => handleOpenNodeModule(currentNodeInfo)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#2D60FF] hover:bg-blue-700 text-white text-xs font-bold transition-colors self-start sm:self-auto shadow-xs"
            >
              <span>Jump to Module</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Node Attribute Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {Object.entries(currentNodeInfo.details).map(([label, val], i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-white border border-[#E6EFF5] flex flex-col justify-between shadow-xs"
              >
                <span className="text-[10px] font-bold text-[#718EBF] uppercase tracking-wider">
                  {label}
                </span>
                <span className="text-xs font-bold text-[#343C6A] font-mono mt-1">
                  {val}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
