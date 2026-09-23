import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Package,
  Layers,
  Cpu,
  Boxes,
  Truck,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    products,
    batches,
    machines,
    suppliers,
    rawMaterials,
    shipments,
    setSelectedBatchId,
    setSelectedProductId,
    setSelectedMachineId,
    setSelectedRawMaterialId,
    setActiveTab
  } = useApp();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const q = query.trim().toLowerCase();

  const matchedBatches = batches.filter(
    b => b.id.toLowerCase().includes(q) || b.productName.toLowerCase().includes(q) || b.productionLine.toLowerCase().includes(q)
  );

  const matchedProducts = products.filter(
    p => p.id.toLowerCase().includes(q) || p.name.toLowerCase().includes(q) || p.batchId.toLowerCase().includes(q)
  );

  const matchedMachines = machines.filter(
    m => m.id.toLowerCase().includes(q) || m.name.toLowerCase().includes(q) || m.line.toLowerCase().includes(q)
  );

  const matchedMaterials = rawMaterials.filter(
    r => r.id.toLowerCase().includes(q) || r.name.toLowerCase().includes(q) || r.batchNumber.toLowerCase().includes(q)
  );

  const matchedShipments = shipments.filter(
    s => s.id.toLowerCase().includes(q) || s.batchId.toLowerCase().includes(q) || s.customerName.toLowerCase().includes(q)
  );

  const totalResults =
    matchedBatches.length +
    matchedProducts.length +
    matchedMachines.length +
    matchedMaterials.length +
    matchedShipments.length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
      onClick={() => setIsSearchOpen(false)}
    >
      <div
        className="w-full max-w-3xl bg-white border border-[#E6EFF5] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#E6EFF5] flex items-center gap-3 bg-white">
          <div className="w-10 h-10 rounded-full bg-[#F5F7FA] flex items-center justify-center text-[#718EBF]">
            <Search className="w-5 h-5 text-[#2D60FF]" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by Product ID, Batch ID, Machine, Supplier, Material... (e.g. B-1042, RM-7821, M04)"
            className="flex-1 bg-transparent text-sm font-medium text-[#343C6A] placeholder-[#8BA3CB] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs font-semibold text-[#718EBF] hover:text-[#343C6A] px-3 py-1 bg-[#F5F7FA] rounded-full"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-2 rounded-full text-[#718EBF] hover:text-[#343C6A] hover:bg-[#F5F7FA]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        {!query && (
          <div className="p-4 border-b border-[#E6EFF5] bg-[#F5F7FA]/60">
            <span className="text-[11px] font-semibold text-[#718EBF] uppercase tracking-wider block mb-2">
              Popular Demo Queries:
            </span>
            <div className="flex flex-wrap gap-2">
              {['B-1042', 'RM-7821', 'M04', 'PRD-10021', 'SUP-001', 'SHP-22091'].map(tag => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="px-3 py-1 rounded-full text-xs font-semibold font-mono bg-white text-[#2D60FF] hover:bg-[#E7EDFF] border border-[#E6EFF5] shadow-xs transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {query && totalResults === 0 ? (
            <div className="text-center py-12 text-[#718EBF]">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium text-[#343C6A]">No manufacturing records found for "{query}".</p>
              <p className="text-xs mt-1 text-[#718EBF]">Try searching for B-1042, M04, or RM-7821</p>
            </div>
          ) : null}

          {/* Batches Results */}
          {matchedBatches.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#718EBF] mb-2.5">
                <Layers className="w-4 h-4 text-[#2D60FF]" />
                <span>Production Batches ({matchedBatches.length})</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {matchedBatches.map(b => (
                  <div
                    key={b.id}
                    onClick={() => {
                      setSelectedBatchId(b.id);
                      setActiveTab('passport');
                      setIsSearchOpen(false);
                    }}
                    className="p-3.5 rounded-2xl bg-[#F5F7FA] hover:bg-[#EDF2F7] border border-[#E6EFF5] cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#2D60FF]">{b.id}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E1F8EC] text-[#10B981]">
                          {b.passRate}% Pass
                        </span>
                      </div>
                      <p className="text-xs font-bold text-[#343C6A] mt-0.5">{b.productName}</p>
                      <p className="text-[11px] text-[#718EBF] mt-0.5">
                        {b.productionLine} • Machine: {b.machineId}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#718EBF] group-hover:text-[#2D60FF] transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Products Results */}
          {matchedProducts.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#718EBF] mb-2.5">
                <Package className="w-4 h-4 text-[#2D60FF]" />
                <span>Manufactured Products ({matchedProducts.length})</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {matchedProducts.map(p => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedProductId(p.id);
                      setSelectedBatchId(p.batchId);
                      setActiveTab('passport');
                      setIsSearchOpen(false);
                    }}
                    className="p-3.5 rounded-2xl bg-[#F5F7FA] hover:bg-[#EDF2F7] border border-[#E6EFF5] cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#2D60FF]">{p.id}</span>
                        <span className="text-[10px] font-semibold text-[#718EBF]">Batch: {p.batchId}</span>
                      </div>
                      <p className="text-xs font-bold text-[#343C6A] mt-0.5">{p.name}</p>
                      <p className="text-[11px] text-[#718EBF] mt-0.5">
                        {p.productionLine} • {p.certification}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#718EBF] group-hover:text-[#2D60FF] transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Raw Materials Results */}
          {matchedMaterials.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#718EBF] mb-2.5">
                <Boxes className="w-4 h-4 text-[#10B981]" />
                <span>Raw Materials & Lots ({matchedMaterials.length})</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {matchedMaterials.map(rm => (
                  <div
                    key={rm.id}
                    onClick={() => {
                      setSelectedRawMaterialId(rm.id);
                      setActiveTab('reverse-trace');
                      setIsSearchOpen(false);
                    }}
                    className="p-3.5 rounded-2xl bg-[#F5F7FA] hover:bg-[#EDF2F7] border border-[#E6EFF5] cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#10B981]">{rm.id}</span>
                        <span className="text-[10px] text-[#718EBF]">{rm.supplierName}</span>
                      </div>
                      <p className="text-xs font-bold text-[#343C6A] mt-0.5">{rm.name}</p>
                      <p className="text-[11px] text-[#718EBF] mt-0.5">
                        Purity: {rm.purityScore}% • Status: {rm.status}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#718EBF] group-hover:text-[#10B981] transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Machines Results */}
          {matchedMachines.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#718EBF] mb-2.5">
                <Cpu className="w-4 h-4 text-[#FFBB38]" />
                <span>Machines & Cells ({matchedMachines.length})</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {matchedMachines.map(m => (
                  <div
                    key={m.id}
                    onClick={() => {
                      setSelectedMachineId(m.id);
                      setActiveTab('machines');
                      setIsSearchOpen(false);
                    }}
                    className="p-3.5 rounded-2xl bg-[#F5F7FA] hover:bg-[#EDF2F7] border border-[#E6EFF5] cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#FFBB38]">{m.id}</span>
                        <span className="text-[10px] text-[#718EBF]">{m.line}</span>
                      </div>
                      <p className="text-xs font-bold text-[#343C6A] mt-0.5">{m.name}</p>
                      <p className="text-[11px] text-[#718EBF] mt-0.5">
                        Status: {m.status.toUpperCase()} • Util: {m.utilization}%
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#718EBF] group-hover:text-[#FFBB38] transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shipments Results */}
          {matchedShipments.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#718EBF] mb-2.5">
                <Truck className="w-4 h-4 text-[#FF82AC]" />
                <span>Customer Shipments ({matchedShipments.length})</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {matchedShipments.map(s => (
                  <div
                    key={s.id}
                    onClick={() => {
                      setSelectedBatchId(s.batchId);
                      setActiveTab('passport');
                      setIsSearchOpen(false);
                    }}
                    className="p-3.5 rounded-2xl bg-[#F5F7FA] hover:bg-[#EDF2F7] border border-[#E6EFF5] cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#FF82AC]">{s.id}</span>
                        <span className="text-[10px] text-[#718EBF]">Batch: {s.batchId}</span>
                      </div>
                      <p className="text-xs font-bold text-[#343C6A] mt-0.5">{s.customerName}</p>
                      <p className="text-[11px] text-[#718EBF] mt-0.5">
                        Qty: {s.quantity} • Carrier: {s.carrier}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#718EBF] group-hover:text-[#FF82AC] transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="p-3.5 border-t border-[#E6EFF5] bg-[#F5F7FA] flex items-center justify-between text-xs text-[#718EBF]">
          <span>Tip: Jump directly into full passport or traceability graph on click</span>
          <span className="font-semibold">ESC to close</span>
        </div>
      </div>
    </div>
  );
};
