import React, { useState } from 'react';
import {
  Package,
  Search,
  QrCode,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';

export const ProductsPage: React.FC = () => {
  const {
    products,
    industryConfig,
    setSelectedProductId,
    setSelectedBatchId,
    setActiveTab,
    openQrModal
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [lineFilter, setLineFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');

  // Filtered list
  const filteredProducts = products.filter((p: Product) => {
    const matchesSearch =
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.batchId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.productionLine.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLine = lineFilter === 'all' || p.productionLine === lineFilter;
    const matchesStatus = statusFilter === 'all' || p.qualityStatus === statusFilter;
    const matchesRisk = riskFilter === 'all' || p.riskLevel === riskFilter;

    return matchesSearch && matchesLine && matchesStatus && matchesRisk;
  });

  const handleOpenPassport = (product: Product) => {
    setSelectedProductId(product.id);
    setSelectedBatchId(product.batchId);
    setActiveTab('passport');
  };

  const handleOpenQr = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    openQrModal({
      type: 'product',
      id: product.id,
      name: product.name,
      batchId: product.batchId,
      date: product.manufacturingDate,
      status: product.qualityStatus.toUpperCase()
    });
  };

  const uniqueLines: string[] = Array.from(new Set(products.map((p: Product) => p.productionLine)));

  return (
    <div className="p-8 space-y-7 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#343C6A] tracking-tight">
            Products & Production Batches
          </h1>
          <p className="text-xs text-[#718EBF] mt-1 font-medium">
            Browse and inspect verified digital passports for every manufactured unit ({filteredProducts.length} records)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-[#718EBF]">
            Sector Profile: <span className="text-[#2D60FF] font-bold">{industryConfig.sampleFocus.split(',')[0]}</span>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-white border border-[#E6EFF5] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#718EBF] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search Product ID, Name, Batch..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#F5F7FA] border-0 text-xs font-medium text-[#343C6A] placeholder-[#8BA3CB] focus:outline-none focus:ring-2 focus:ring-[#2D60FF]/20"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          {/* Line Filter */}
          <select
            value={lineFilter}
            onChange={e => setLineFilter(e.target.value)}
            className="px-4 py-2.5 rounded-full bg-[#F5F7FA] border border-[#E6EFF5] text-xs font-semibold text-[#343C6A] focus:outline-none"
          >
            <option value="all">All Production Lines</option>
            {uniqueLines.map((line: string) => (
              <option key={line} value={line}>
                {line}
              </option>
            ))}
          </select>

          {/* Quality Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-full bg-[#F5F7FA] border border-[#E6EFF5] text-xs font-semibold text-[#343C6A] focus:outline-none"
          >
            <option value="all">All Quality Statuses</option>
            <option value="passed">Passed</option>
            <option value="failed">Failed</option>
            <option value="rework">Rework</option>
          </select>

          {/* Risk Filter */}
          <select
            value={riskFilter}
            onChange={e => setRiskFilter(e.target.value)}
            className="px-4 py-2.5 rounded-full bg-[#F5F7FA] border border-[#E6EFF5] text-xs font-semibold text-[#343C6A] focus:outline-none"
          >
            <option value="all">All Risk Levels</option>
            <option value="low">Low Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="high">High Risk</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-3xl bg-white border border-[#E6EFF5] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            {/* Table Header */}
            <thead className="bg-[#F5F7FA] text-[#718EBF] font-semibold uppercase tracking-wider border-b border-[#E6EFF5]">
              <tr>
                <th className="py-4 px-5">Product ID</th>
                <th className="py-4 px-5">Product Name</th>
                <th className="py-4 px-5">Batch ID</th>
                <th className="py-4 px-5">Mfg Date</th>
                <th className="py-4 px-5">Line</th>
                <th className="py-4 px-5">Quality Status</th>
                <th className="py-4 px-5">Risk Level</th>
                <th className="py-4 px-5">Traceability</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-[#E6EFF5]">
              {filteredProducts.map((product: Product) => {
                const isMedium = product.riskLevel === 'medium';
                const isHigh = product.riskLevel === 'high';

                return (
                  <tr
                    key={product.id}
                    onClick={() => handleOpenPassport(product)}
                    className="hover:bg-[#F5F7FA] cursor-pointer transition-colors group"
                  >
                    {/* Product ID */}
                    <td className="py-4 px-5 font-mono font-bold text-[#2D60FF] group-hover:underline">
                      {product.id}
                    </td>

                    {/* Product Name */}
                    <td className="py-4 px-5 font-bold text-[#343C6A]">
                      <div>{product.name}</div>
                      <span className="text-[11px] text-[#718EBF] font-normal">{product.category}</span>
                    </td>

                    {/* Batch ID */}
                    <td className="py-4 px-5 font-mono text-[#343C6A]">
                      <span className="px-2.5 py-1 rounded-full bg-[#F5F7FA] border border-[#E6EFF5] font-semibold">
                        {product.batchId}
                      </span>
                    </td>

                    {/* Manufacturing Date */}
                    <td className="py-4 px-5 text-[#718EBF]">
                      {product.manufacturingDate}
                    </td>

                    {/* Production Line */}
                    <td className="py-4 px-5 font-medium text-[#343C6A]">
                      {product.productionLine}
                    </td>

                    {/* Quality Status */}
                    <td className="py-4 px-5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#E1F8EC] text-[#10B981]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {product.qualityStatus.toUpperCase()}
                      </span>
                    </td>

                    {/* Risk Level */}
                    <td className="py-4 px-5">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold uppercase ${
                          isHigh
                            ? 'bg-[#FFEBEF] text-[#FE5C73]'
                            : isMedium
                            ? 'bg-[#FFF5D9] text-[#FFBB38]'
                            : 'bg-[#E7EDFF] text-[#2D60FF]'
                        }`}
                      >
                        {isHigh ? (
                          <AlertOctagon className="w-3 h-3" />
                        ) : isMedium ? (
                          <AlertTriangle className="w-3 h-3" />
                        ) : null}
                        {product.riskLevel}
                      </span>
                    </td>

                    {/* Traceability */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-[#F5F7FA] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#2D60FF] rounded-full"
                            style={{ width: `${product.traceability}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] text-[#2D60FF] font-bold">
                          {product.traceability}%
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={e => handleOpenQr(e, product)}
                          className="p-2 rounded-full bg-[#F5F7FA] hover:bg-[#E7EDFF] text-[#718EBF] hover:text-[#2D60FF] transition-colors"
                          title="Generate QR Code"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenPassport(product)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#2D60FF] hover:bg-blue-700 text-white text-[11px] font-bold transition-colors shadow-xs"
                          title="View Digital Passport"
                        >
                          <span>Passport</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 border-t border-[#E6EFF5] bg-[#F5F7FA] flex items-center justify-between text-xs text-[#718EBF]">
          <span>Showing {filteredProducts.length} of {products.length} Products</span>
          <span>Click any row to open the complete Digital Manufacturing Passport</span>
        </div>
      </div>
    </div>
  );
};
