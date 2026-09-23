import React, { useState } from 'react';
import {
  Building2,
  Search,
  ExternalLink,
  Sparkles,
  MapPin
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Supplier } from '../types';

export const SuppliersPage: React.FC = () => {
  const {
    suppliers,
    selectedSupplierId,
    setSelectedSupplierId,
    setSelectedRawMaterialId,
    setActiveTab
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeSupplier, setActiveSupplier] = useState<Supplier | null>(
    suppliers.find((s: Supplier) => s.id === (selectedSupplierId || 'SUP-001')) || suppliers[0]
  );

  const filteredSuppliers = suppliers.filter(
    (s: Supplier) =>
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.material.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenReverseTrace = (materialCode: string) => {
    setSelectedRawMaterialId(materialCode);
    setActiveTab('reverse-trace');
  };

  return (
    <div className="p-8 space-y-7 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#343C6A] tracking-tight">
            Supplier Quality Management
          </h1>
          <p className="text-xs text-[#718EBF] mt-1 font-medium">
            Audit supplier reliability, incoming raw material consistency, and defect exposure matrices
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#718EBF] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search Supplier ID, Name, Material..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-[#E6EFF5] text-xs font-medium text-[#343C6A] placeholder-[#8BA3CB] focus:outline-none focus:ring-2 focus:ring-[#2D60FF]/20 shadow-xs"
          />
        </div>
      </div>

      {/* Main Layout: Supplier Table + Live Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Table Column (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-white border border-[#E6EFF5] overflow-hidden shadow-sm flex flex-col justify-between">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F7FA] text-[#718EBF] font-semibold uppercase tracking-wider border-b border-[#E6EFF5]">
                <tr>
                  <th className="py-4 px-4">Supplier ID</th>
                  <th className="py-4 px-4">Supplier Name</th>
                  <th className="py-4 px-4">Material</th>
                  <th className="py-4 px-4">Quality Score</th>
                  <th className="py-4 px-4">Defect Rate</th>
                  <th className="py-4 px-4">Active Batches</th>
                  <th className="py-4 px-4">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6EFF5]">
                {filteredSuppliers.map((sup: Supplier) => {
                  const isSelected = activeSupplier?.id === sup.id;
                  const isHigh = sup.risk === 'high';
                  const isMedium = sup.risk === 'medium';

                  return (
                    <tr
                      key={sup.id}
                      onClick={() => {
                        setActiveSupplier(sup);
                        setSelectedSupplierId(sup.id);
                      }}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#E7EDFF] font-bold' : 'hover:bg-[#F5F7FA]'
                      }`}
                    >
                      <td className="py-4 px-4 font-mono font-bold text-[#2D60FF]">{sup.id}</td>
                      <td className="py-4 px-4 text-[#343C6A] font-semibold">{sup.name}</td>
                      <td className="py-4 px-4 text-[#718EBF] truncate max-w-[140px]">
                        {sup.material}
                      </td>
                      <td className="py-4 px-4 font-mono text-[#10B981] font-bold">
                        {sup.qualityScore}%
                      </td>
                      <td className="py-4 px-4 font-mono text-[#343C6A]">{sup.defectRate}%</td>
                      <td className="py-4 px-4 font-mono text-[#718EBF]">{sup.activeBatches}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                            isHigh
                              ? 'bg-[#FFEBEF] text-[#FE5C73]'
                              : isMedium
                              ? 'bg-[#FFF5D9] text-[#FEAA09]'
                              : 'bg-[#E1F8EC] text-[#10B981]'
                          }`}
                        >
                          {sup.risk}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-[#E6EFF5] bg-[#F5F7FA] text-xs text-[#718EBF]">
            Click any supplier to review historical audits and AI risk index
          </div>
        </div>

        {/* Selected Supplier Detail Drawer (5 cols) */}
        {activeSupplier && (
          <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-[#E6EFF5] shadow-sm space-y-5 animate-fade-in flex flex-col justify-between">
            <div>
              {/* Drawer Top Header */}
              <div className="flex items-start justify-between border-b border-[#E6EFF5] pb-4 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#2D60FF]">
                      {activeSupplier.id}
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#E1F8EC] text-[#10B981]">
                      APPROVED
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#343C6A] mt-1">
                    {activeSupplier.name}
                  </h3>
                  <p className="text-xs text-[#718EBF] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#2D60FF]" />
                    <span>{activeSupplier.location}</span>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-[#718EBF] uppercase font-bold block">Quality Score</span>
                  <span className="text-3xl font-black text-[#10B981] font-mono">
                    {activeSupplier.qualityScore}%
                  </span>
                </div>
              </div>

              {/* Material Batches Provided */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase text-[#718EBF] block">
                  Material Batches In Circulation:
                </span>
                <div className="p-4 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5] space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[#2D60FF] font-bold">RM-7821</span>
                    <span className="text-[#FEAA09] font-bold text-[11px]">Hardness Deviation</span>
                  </div>
                  <p className="text-[#343C6A] text-xs">
                    {activeSupplier.material}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-black/5 text-xs">
                    <span className="text-[#718EBF]">Cert: {activeSupplier.certification}</span>
                    <button
                      onClick={() => handleOpenReverseTrace('RM-7821')}
                      className="text-[#2D60FF] font-bold hover:underline flex items-center gap-1"
                    >
                      <span>Reverse Trace</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* AI Supplier Risk Insights */}
              <div className="mt-4 p-4 rounded-2xl bg-[#E7EDFF] border border-[#2D60FF]/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#2D60FF] uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Supplier Risk Insights</span>
                </div>
                <p className="text-xs text-[#343C6A] leading-relaxed">
                  "Supplier maintains a 94% quality compliance rating. However, recent lot RM-7821 showed an unexpected +3.8% variance in tensile hardness, which correlated with Machine M04 thermal creep."
                </p>
                <div className="flex justify-between text-[11px] text-[#718EBF] pt-1 font-medium">
                  <span>Audit Cycle: Every 90 Days</span>
                  <span>Escalation Level: Low</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-[#E6EFF5] flex items-center justify-between text-xs">
              <span className="text-[#718EBF] font-mono">Contact: {activeSupplier.contactEmail}</span>
              <button
                onClick={() => handleOpenReverseTrace('RM-7821')}
                className="px-4 py-2 rounded-full bg-[#2D60FF] hover:bg-blue-700 text-white font-bold transition-all shadow-xs"
              >
                Inspect Associated Lots →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
