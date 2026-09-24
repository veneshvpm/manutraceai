import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  Database,
  Factory,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Download,
  FileText,
  Search,
  ArrowRight,
  Layers,
  Sparkles,
  ExternalLink,
  Code2,
  Table,
  Check,
  Package,
  Cpu,
  Building2,
  ShieldCheck,
  Boxes,
  HelpCircle,
  Play
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  DatasetTarget,
  DATASET_TARGETS,
  parseCSV,
  parseJSON,
  detectEntitySchema,
  normalizeDataset,
  downloadCSV,
  downloadJSON,
  SAMPLE_BATCHES_CSV,
  SAMPLE_DEFECTS_CSV,
  SAMPLE_MACHINES_CSV,
  SAMPLE_SUPPLIERS_CSV
} from '../services/datasetParser';

export const DatasetPage: React.FC = () => {
  const {
    batches,
    products,
    machines,
    suppliers,
    rawMaterials,
    inspections,
    defects,
    shipments,
    loadDataset,
    resetDatasetsToDefault,
    setActiveTab,
    setSelectedBatchId,
    setSelectedProductId,
    currentIndustry
  } = useApp();

  // Active view tab in this page
  const [activeView, setActiveView] = useState<'upload' | 'samples' | 'activeData'>('upload');

  // Upload state
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [rawText, setRawText] = useState<string>('');
  const [parsedRows, setParsedRows] = useState<Record<string, any>[]>([]);
  const [selectedTarget, setSelectedTarget] = useState<DatasetTarget>('batches');
  const [autoDetectedTarget, setAutoDetectedTarget] = useState<DatasetTarget | null>(null);
  const [loadMode, setLoadMode] = useState<'append' | 'replace'>('append');
  const [showTextInput, setShowTextInput] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string; target?: DatasetTarget } | null>(null);

  // Search & Pagination in Preview Table
  const [previewSearch, setPreviewSearch] = useState('');
  const [previewPage, setPreviewPage] = useState(1);
  const pageSize = 8;

  // Active Data Explorer tab state
  const [explorerTarget, setExplorerTarget] = useState<DatasetTarget>('batches');
  const [explorerSearch, setExplorerSearch] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle uploaded file
  const handleFileUpload = (file: File) => {
    if (!file) return;
    setFileName(file.name);
    setFileSize(`${(file.size / 1024).toFixed(1)} KB`);

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = (e.target?.result as string) || '';
      processRawContent(content, file.name.endsWith('.json') ? 'json' : 'csv');
    };
    reader.readAsText(file);
  };

  const processRawContent = (content: string, formatHint?: 'csv' | 'json') => {
    setRawText(content);
    let rows: Record<string, any>[] = [];

    try {
      if (formatHint === 'json' || content.trim().startsWith('[') || content.trim().startsWith('{')) {
        rows = parseJSON(content);
      } else {
        rows = parseCSV(content);
      }

      if (rows.length === 0) {
        setNotification({
          type: 'error',
          message: 'Unable to extract valid records from file. Please ensure correct CSV or JSON formatting.'
        });
        setParsedRows([]);
        return;
      }

      setParsedRows(rows);
      const detected = detectEntitySchema(rows);
      setAutoDetectedTarget(detected);
      setSelectedTarget(detected);
      setPreviewPage(1);
      setNotification({
        type: 'info',
        message: `Parsed ${rows.length} rows. Auto-detected entity schema: "${DATASET_TARGETS.find(t => t.id === detected)?.label}".`
      });
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: `Parsing error: ${err.message || 'Invalid format'}`
      });
      setParsedRows([]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Perform Load
  const handleExecuteLoad = () => {
    if (!parsedRows || parsedRows.length === 0) {
      setNotification({
        type: 'error',
        message: 'No parsed dataset to load. Please upload a CSV/JSON file first.'
      });
      return;
    }

    try {
      const normalized = normalizeDataset(parsedRows, selectedTarget, currentIndustry);
      const res = loadDataset(selectedTarget, normalized, loadMode);

      setNotification({
        type: 'success',
        message: `${res.message} You can now explore the new data across all ManuTrace analytics modules!`,
        target: selectedTarget
      });
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: `Failed to load dataset: ${err.message}`
      });
    }
  };

  // 1-Click Load Sample Dataset
  const handleLoadSample = (sampleType: DatasetTarget, sampleCsv: string) => {
    const rows = parseCSV(sampleCsv);
    const normalized = normalizeDataset(rows, sampleType, currentIndustry);
    loadDataset(sampleType, normalized, 'append');
    setNotification({
      type: 'success',
      message: `Loaded ${normalized.length} sample ${sampleType} records directly into active operational memory!`,
      target: sampleType
    });
  };

  // Target schema config
  const currentTargetMeta = DATASET_TARGETS.find(t => t.id === selectedTarget);

  // Filter preview rows
  const previewHeaders = parsedRows.length > 0 ? Object.keys(parsedRows[0]) : [];
  const filteredPreviewRows = parsedRows.filter(row => {
    if (!previewSearch) return true;
    return Object.values(row).some(val =>
      String(val).toLowerCase().includes(previewSearch.toLowerCase())
    );
  });
  const paginatedPreviewRows = filteredPreviewRows.slice(
    (previewPage - 1) * pageSize,
    previewPage * pageSize
  );
  const totalPreviewPages = Math.ceil(filteredPreviewRows.length / pageSize) || 1;

  // Active Data for Explorer
  const getActiveDataByTarget = (target: DatasetTarget): any[] => {
    switch (target) {
      case 'batches': return batches;
      case 'products': return products;
      case 'machines': return machines;
      case 'suppliers': return suppliers;
      case 'rawMaterials': return rawMaterials;
      case 'inspections': return inspections;
      case 'defects': return defects;
      case 'shipments': return shipments;
      default: return [];
    }
  };

  const activeExplorerData = getActiveDataByTarget(explorerTarget);
  const filteredExplorerData = activeExplorerData.filter(item => {
    if (!explorerSearch) return true;
    return Object.values(item).some(val => {
      if (typeof val === 'object') return false;
      return String(val).toLowerCase().includes(explorerSearch.toLowerCase());
    });
  });

  const getTargetIcon = (target: DatasetTarget) => {
    switch (target) {
      case 'batches': return Boxes;
      case 'products': return Package;
      case 'machines': return Cpu;
      case 'suppliers': return Building2;
      case 'rawMaterials': return Layers;
      case 'inspections': return CheckCircle2;
      case 'defects': return AlertTriangle;
      case 'shipments': return ArrowRight;
    }
  };

  const navigateToTargetView = (target: DatasetTarget) => {
    switch (target) {
      case 'batches':
      case 'products':
        setActiveTab('products');
        break;
      case 'machines':
        setActiveTab('machines');
        break;
      case 'suppliers':
        setActiveTab('suppliers');
        break;
      case 'rawMaterials':
        setActiveTab('reverse-trace');
        break;
      case 'inspections':
      case 'defects':
        setActiveTab('quality');
        break;
      case 'shipments':
        setActiveTab('dashboard');
        break;
    }
  };

  return (
    <div className="p-8 space-y-7 max-w-7xl mx-auto animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#2D60FF] to-[#1230AE] p-2 flex items-center justify-center shadow-[0_4px_12px_rgba(45,96,255,0.35)]">
              <Factory className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-[#343C6A] tracking-tight">
                Dataset Studio & Universal Loader
              </h1>
              <p className="text-xs text-[#718EBF] mt-0.5 font-medium">
                Upload CSV or JSON files to load production records, sensor telemetry, and quality logs into real-time operational streams
              </p>
            </div>
          </div>
        </div>

        {/* Global Dataset Utilities */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => {
              if (window.confirm('Reset all batches, products, and machines to default factory state?')) {
                resetDatasetsToDefault();
                setNotification({
                  type: 'info',
                  message: 'Successfully reset all datasets to factory benchmark defaults.'
                });
              }
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#E6EFF5] bg-white hover:bg-[#F5F7FA] text-xs font-semibold text-[#718EBF] hover:text-[#343C6A] transition-colors shadow-xs"
            title="Reset to factory benchmark datasets"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>

          <button
            onClick={() => {
              downloadJSON(
                { batches, products, machines, suppliers, rawMaterials, inspections, defects, shipments },
                `manutrace_full_backup_${Date.now()}`
              );
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#2D60FF] hover:bg-[#204ecf] text-xs font-semibold text-white transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Export System Snapshot
          </button>
        </div>
      </div>

      {/* Dataset Health Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {[
          { label: 'Batches', count: batches.length, icon: Boxes, color: 'text-[#2D60FF]', bg: 'bg-[#E7EDFF]' },
          { label: 'Products', count: products.length, icon: Package, color: 'text-[#16DBCC]', bg: 'bg-[#DCFAF8]' },
          { label: 'Machines', count: machines.length, icon: Cpu, color: 'text-[#FFBB38]', bg: 'bg-[#FFF5D9]' },
          { label: 'Suppliers', count: suppliers.length, icon: Building2, color: 'text-[#FE5C73]', bg: 'bg-[#FFEBEF]' },
          { label: 'Materials', count: rawMaterials.length, icon: Layers, color: 'text-[#718EBF]', bg: 'bg-[#F5F7FA]' },
          { label: 'Inspections', count: inspections.length, icon: CheckCircle2, color: 'text-[#10B981]', bg: 'bg-[#E6F9F2]' },
          { label: 'Defects', count: defects.length, icon: AlertTriangle, color: 'text-[#FE5C73]', bg: 'bg-[#FFEBEF]' },
          { label: 'Shipments', count: shipments.length, icon: ArrowRight, color: 'text-[#2D60FF]', bg: 'bg-[#E7EDFF]' }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-white border border-[#E6EFF5] shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#718EBF]">{item.label}</span>
                <div className={`w-6 h-6 rounded-lg ${item.bg} flex items-center justify-center`}>
                  <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                </div>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-lg font-black text-[#343C6A]">{item.count}</span>
                <span className="text-[10px] text-[#718EBF] font-medium">loaded</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main View Mode Selector */}
      <div className="flex items-center gap-2 border-b border-[#E6EFF5] pb-1">
        <button
          onClick={() => setActiveView('upload')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeView === 'upload'
              ? 'bg-white text-[#2D60FF] border border-[#E6EFF5] shadow-xs'
              : 'text-[#718EBF] hover:text-[#343C6A]'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          Upload & Load Dataset
        </button>

        <button
          onClick={() => setActiveView('samples')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeView === 'samples'
              ? 'bg-white text-[#2D60FF] border border-[#E6EFF5] shadow-xs'
              : 'text-[#718EBF] hover:text-[#343C6A]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#FFBB38]" />
          Pre-built Industrial Samples (1-Click)
        </button>

        <button
          onClick={() => setActiveView('activeData')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeView === 'activeData'
              ? 'bg-white text-[#2D60FF] border border-[#E6EFF5] shadow-xs'
              : 'text-[#718EBF] hover:text-[#343C6A]'
          }`}
        >
          <Table className="w-4 h-4" />
          Active Records Explorer
        </button>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between gap-4 animate-fade-in ${
            notification.type === 'success'
              ? 'bg-[#E6F9F2] border-[#10B981]/30 text-[#0E7A53]'
              : notification.type === 'error'
              ? 'bg-[#FFEBEF] border-[#FE5C73]/30 text-[#D82A45]'
              : 'bg-[#E7EDFF] border-[#2D60FF]/30 text-[#1E45BF]'
          }`}
        >
          <div className="flex items-center gap-3">
            {notification.type === 'success' && <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-[#10B981]" />}
            {notification.type === 'error' && <AlertTriangle className="w-5 h-5 flex-shrink-0 text-[#FE5C73]" />}
            {notification.type === 'info' && <Sparkles className="w-5 h-5 flex-shrink-0 text-[#2D60FF]" />}
            <span className="text-xs font-semibold leading-relaxed">{notification.message}</span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {notification.target && (
              <button
                onClick={() => navigateToTargetView(notification.target!)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white shadow-xs text-xs font-bold text-[#2D60FF] hover:bg-[#F5F7FA] transition-colors"
              >
                <span>View In App</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => setNotification(null)}
              className="text-xs font-bold opacity-60 hover:opacity-100 px-2 py-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 1: UPLOAD & LOAD DATASET WORKSPACE                 */}
      {/* ======================================================== */}
      {activeView === 'upload' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Cols: Dropzone & Raw Text Editor */}
            <div className="lg:col-span-7 space-y-4">
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`p-8 rounded-3xl border-2 border-dashed transition-all text-center flex flex-col items-center justify-center gap-3 cursor-pointer bg-white ${
                  dragOver
                    ? 'border-[#2D60FF] bg-[#F4F7FE] scale-[1.01]'
                    : 'border-[#E6EFF5] hover:border-[#2D60FF]/50 hover:bg-[#FAFCFF]'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.json,.txt"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                />

                <div className="w-16 h-16 rounded-2xl bg-[#E7EDFF] flex items-center justify-center text-[#2D60FF] shadow-sm">
                  <UploadCloud className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#343C6A]">
                    Drag & Drop your Dataset file here
                  </h3>
                  <p className="text-xs text-[#718EBF] mt-1 font-medium">
                    Supports <span className="font-bold text-[#343C6A]">.CSV</span>, <span className="font-bold text-[#343C6A]">.JSON</span> manufacturing records, telemetry streams, and batch logs
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <span className="px-4 py-2 rounded-xl bg-[#F5F7FA] text-xs font-bold text-[#2D60FF] hover:bg-[#E7EDFF] transition-colors">
                    Browse Local File
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowTextInput(prev => !prev);
                    }}
                    className="px-4 py-2 rounded-xl border border-[#E6EFF5] text-xs font-semibold text-[#718EBF] hover:text-[#343C6A] hover:bg-[#F5F7FA] transition-colors"
                  >
                    {showTextInput ? 'Hide Text Area' : 'Paste Raw CSV / JSON'}
                  </button>
                </div>

                {fileName && (
                  <div className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E7EDFF] text-[#2D60FF] text-xs font-semibold">
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>{fileName}</span>
                    <span className="text-[10px] text-[#718EBF]">({fileSize})</span>
                  </div>
                )}
              </div>

              {/* Paste Raw Text area if toggled */}
              {showTextInput && (
                <div className="p-5 rounded-3xl bg-white border border-[#E6EFF5] shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#343C6A] flex items-center gap-1.5">
                      <Code2 className="w-4 h-4 text-[#2D60FF]" />
                      Direct CSV or JSON Text Input
                    </span>
                    <button
                      onClick={() => processRawContent(rawText)}
                      className="px-3 py-1.5 rounded-xl bg-[#2D60FF] text-white text-xs font-bold hover:bg-[#204ecf] transition-all"
                    >
                      Parse Input Text
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    placeholder="Paste CSV with headers, e.g.:&#10;id,productId,productName,quantity,passRate&#10;B-5001,PRD-10021,Brake Arm,350,98.5"
                    className="w-full p-3 font-mono text-xs text-[#343C6A] bg-[#F5F7FA] rounded-2xl border-0 focus:ring-2 focus:ring-[#2D60FF]/20 focus:outline-none resize-y"
                  />
                </div>
              )}
            </div>

            {/* Right 5 Cols: Destination Mapping & Loading Controls */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-[#E6EFF5] shadow-xs space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-[#343C6A] flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#2D60FF]" />
                    Dataset Destination & Schema
                  </h3>
                  {autoDetectedTarget && (
                    <span className="px-2.5 py-1 rounded-full bg-[#DCFAF8] text-[#16DBCC] text-[10px] font-bold">
                      Auto-detected
                    </span>
                  )}
                </div>

                {/* Target Entity Selector */}
                <div>
                  <label className="text-xs font-bold text-[#718EBF] block mb-1.5">
                    Target Entity in ManuTrace:
                  </label>
                  <select
                    value={selectedTarget}
                    onChange={(e) => setSelectedTarget(e.target.value as DatasetTarget)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#F5F7FA] border-0 text-xs font-bold text-[#343C6A] focus:ring-2 focus:ring-[#2D60FF]/20 focus:outline-none cursor-pointer"
                  >
                    {DATASET_TARGETS.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.label} ({t.id})
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-[#718EBF] mt-1.5 italic">
                    {currentTargetMeta?.description}
                  </p>
                </div>

                {/* Expected Fields pill tags */}
                <div>
                  <span className="text-[11px] font-bold text-[#718EBF] block mb-1.5">
                    Expected Core Fields:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentTargetMeta?.expectedFields.map(f => (
                      <span
                        key={f}
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          previewHeaders.some(h => h.toLowerCase() === f.toLowerCase())
                            ? 'bg-[#E6F9F2] text-[#10B981] font-bold'
                            : 'bg-[#F5F7FA] text-[#718EBF]'
                        }`}
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Mode: Append vs Replace */}
                <div>
                  <label className="text-xs font-bold text-[#718EBF] block mb-1.5">
                    Load Strategy:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setLoadMode('append')}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        loadMode === 'append'
                          ? 'border-[#2D60FF] bg-[#F4F7FE] text-[#2D60FF]'
                          : 'border-[#E6EFF5] text-[#718EBF] hover:bg-[#F5F7FA]'
                      }`}
                    >
                      <div className="font-bold text-xs">Append (Default)</div>
                      <div className="text-[10px] opacity-80 mt-0.5">Add to existing records</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLoadMode('replace')}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        loadMode === 'replace'
                          ? 'border-[#FE5C73] bg-[#FFEBEF] text-[#FE5C73]'
                          : 'border-[#E6EFF5] text-[#718EBF] hover:bg-[#F5F7FA]'
                      }`}
                    >
                      <div className="font-bold text-xs">Replace All</div>
                      <div className="text-[10px] opacity-80 mt-0.5">Overwrite existing entity</div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#E6EFF5] space-y-2">
                <button
                  type="button"
                  disabled={parsedRows.length === 0}
                  onClick={handleExecuteLoad}
                  className={`w-full py-3 px-4 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-md ${
                    parsedRows.length > 0
                      ? 'bg-gradient-to-r from-[#2D60FF] to-[#1230AE] hover:from-[#2552db] hover:to-[#0f2991] text-white cursor-pointer'
                      : 'bg-[#E6EFF5] text-[#8BA3CB] cursor-not-allowed'
                  }`}
                >
                  <Play className="w-4 h-4 fill-current" />
                  Load {parsedRows.length > 0 ? `${parsedRows.length} Rows` : 'Dataset'} into {currentTargetMeta?.label}
                </button>

                {parsedRows.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setParsedRows([]);
                      setFileName('');
                      setRawText('');
                    }}
                    className="w-full py-2 text-center text-xs font-semibold text-[#718EBF] hover:text-[#FE5C73] transition-colors"
                  >
                    Clear Parsed Data
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Preview Table */}
          {parsedRows.length > 0 && (
            <div className="p-6 rounded-3xl bg-white border border-[#E6EFF5] shadow-xs space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-extrabold text-[#343C6A]">
                    Parsed Dataset Preview ({filteredPreviewRows.length} rows)
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E7EDFF] text-[#2D60FF] text-[10px] font-bold">
                    {previewHeaders.length} columns detected
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Search within preview */}
                  <div className="relative w-64">
                    <Search className="w-3.5 h-3.5 text-[#718EBF] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={previewSearch}
                      onChange={(e) => {
                        setPreviewSearch(e.target.value);
                        setPreviewPage(1);
                      }}
                      placeholder="Search preview records..."
                      className="w-full pl-9 pr-3 py-1.5 rounded-full bg-[#F5F7FA] border-0 text-xs font-medium text-[#343C6A] placeholder-[#8BA3CB] focus:outline-none focus:ring-2 focus:ring-[#2D60FF]/20"
                    />
                  </div>
                </div>
              </div>

              {/* Table wrapper */}
              <div className="overflow-x-auto rounded-2xl border border-[#E6EFF5]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] border-b border-[#E6EFF5] text-[#718EBF] font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3 w-12 text-center">#</th>
                      {previewHeaders.map(header => (
                        <th key={header} className="p-3 whitespace-nowrap">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6EFF5] text-[#343C6A]">
                    {paginatedPreviewRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-[#F5F7FA] transition-colors font-medium">
                        <td className="p-3 text-center text-[#718EBF] font-mono text-[11px]">
                          {(previewPage - 1) * pageSize + idx + 1}
                        </td>
                        {previewHeaders.map(header => {
                          const val = row[header];
                          const isObj = typeof val === 'object' && val !== null;
                          return (
                            <td key={header} className="p-3 whitespace-nowrap text-xs">
                              {isObj ? (
                                <code className="text-[10px] bg-[#F5F7FA] px-1.5 py-0.5 rounded text-[#2D60FF]">
                                  {JSON.stringify(val)}
                                </code>
                              ) : (
                                String(val !== undefined ? val : '')
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-[#718EBF] font-medium">
                  Showing page {previewPage} of {totalPreviewPages}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    disabled={previewPage <= 1}
                    onClick={() => setPreviewPage(p => p - 1)}
                    className="px-3 py-1 rounded-xl border border-[#E6EFF5] text-xs font-semibold text-[#718EBF] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F5F7FA]"
                  >
                    Previous
                  </button>
                  <button
                    disabled={previewPage >= totalPreviewPages}
                    onClick={() => setPreviewPage(p => p + 1)}
                    className="px-3 py-1 rounded-xl border border-[#E6EFF5] text-xs font-semibold text-[#718EBF] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F5F7FA]"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 2: PRE-BUILT INDUSTRIAL SAMPLES                    */}
      {/* ======================================================== */}
      {activeView === 'samples' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#2D60FF]/10 via-[#16DBCC]/10 to-[#FFBB38]/10 border border-[#E6EFF5] flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-extrabold text-[#343C6A]">
                Ready-to-Test Industrial Benchmark Datasets
              </h2>
              <p className="text-xs text-[#718EBF] mt-1 font-medium">
                Want to test the load functionality instantly? Click <span className="font-bold text-[#2D60FF]">"Load into System"</span> on any dataset below to append verified manufacturing records into live operations.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                title: 'Automotive Precision Batches (B-3001 to B-3006)',
                target: 'batches' as DatasetTarget,
                csv: SAMPLE_BATCHES_CSV,
                icon: Boxes,
                badge: 'High Importance',
                badgeColor: 'bg-[#FFEBEF] text-[#FE5C73]',
                desc: 'Includes 6 production lots with spindle telemetry, thermal sensors, vibration indicators, and critical anomaly batch B-3003 (triggers AI Root Cause Analysis!).'
              },
              {
                title: 'Defects & Non-Conformance Log',
                target: 'defects' as DatasetTarget,
                csv: SAMPLE_DEFECTS_CSV,
                icon: AlertTriangle,
                badge: 'Quality Control',
                badgeColor: 'bg-[#FFF5D9] text-[#FFBB38]',
                desc: '5 incident entries detailing laser weld porosity, spindle runout, dimensional variances, and inspection stage timestamps.'
              },
              {
                title: 'Smart CNC Equipment Telemetry Stream',
                target: 'machines' as DatasetTarget,
                csv: SAMPLE_MACHINES_CSV,
                icon: Cpu,
                badge: 'Telemetry',
                badgeColor: 'bg-[#E7EDFF] text-[#2D60FF]',
                desc: '5 CNC machines & hydraulic presses (M11-M15) with utilization metrics, operating hours, speed RPM, and vibration sensors.'
              },
              {
                title: 'Global Tier-1 Precision Suppliers',
                target: 'suppliers' as DatasetTarget,
                csv: SAMPLE_SUPPLIERS_CSV,
                icon: Building2,
                badge: 'Supply Chain',
                badgeColor: 'bg-[#DCFAF8] text-[#16DBCC]',
                desc: '4 certified suppliers (ThyssenKrupp, Kobe Steel, Sandvik) with IATF 16949 audit compliance, defect percentages, and contact details.'
              }
            ].map((sample, idx) => {
              const Icon = sample.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-white border border-[#E6EFF5] shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-2xl bg-[#F5F7FA] flex items-center justify-center text-[#2D60FF]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${sample.badgeColor}`}>
                        {sample.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-extrabold text-[#343C6A]">{sample.title}</h3>
                      <p className="text-xs text-[#718EBF] mt-1 font-medium leading-relaxed">
                        {sample.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E6EFF5] flex items-center justify-between gap-3">
                    <button
                      onClick={() => downloadCSV(parseCSV(sample.csv), `sample_${sample.target}`)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E6EFF5] text-xs font-semibold text-[#718EBF] hover:text-[#343C6A] hover:bg-[#F5F7FA] transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download CSV Template
                    </button>

                    <button
                      onClick={() => handleLoadSample(sample.target, sample.csv)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2D60FF] hover:bg-[#204ecf] text-xs font-bold text-white shadow-xs transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Load into System
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 3: ACTIVE RECORDS EXPLORER                         */}
      {/* ======================================================== */}
      {activeView === 'activeData' && (
        <div className="p-6 rounded-3xl bg-white border border-[#E6EFF5] shadow-xs space-y-5 animate-fade-in">
          {/* Entity Tab Pills */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              {DATASET_TARGETS.map(t => {
                const Icon = getTargetIcon(t.id);
                const isActive = explorerTarget === t.id;
                const count = getActiveDataByTarget(t.id).length;
                return (
                  <button
                    key={t.id}
                    onClick={() => setExplorerTarget(t.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[#2D60FF] text-white shadow-sm'
                        : 'bg-[#F5F7FA] text-[#718EBF] hover:text-[#343C6A] hover:bg-[#EEF2F6]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-white text-[#718EBF]'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Export buttons for currently selected active entity */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => downloadCSV(activeExplorerData, `manutrace_${explorerTarget}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E6EFF5] text-xs font-semibold text-[#718EBF] hover:text-[#343C6A] hover:bg-[#F5F7FA] transition-colors"
                title="Export this entity to CSV"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
              <button
                onClick={() => downloadJSON(activeExplorerData, `manutrace_${explorerTarget}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E6EFF5] text-xs font-semibold text-[#718EBF] hover:text-[#343C6A] hover:bg-[#F5F7FA] transition-colors"
                title="Export this entity to JSON"
              >
                <Download className="w-3.5 h-3.5" />
                Export JSON
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-[#718EBF] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={explorerSearch}
              onChange={(e) => setExplorerSearch(e.target.value)}
              placeholder={`Search ${filteredExplorerData.length} active ${explorerTarget} records...`}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#F5F7FA] border-0 text-xs font-medium text-[#343C6A] placeholder-[#8BA3CB] focus:outline-none focus:ring-2 focus:ring-[#2D60FF]/20"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-[#E6EFF5]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E6EFF5] text-[#718EBF] font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3 w-12 text-center">#</th>
                  {activeExplorerData.length > 0 &&
                    Object.keys(activeExplorerData[0]).map(k => (
                      <th key={k} className="p-3 whitespace-nowrap">
                        {k}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6EFF5] text-[#343C6A]">
                {filteredExplorerData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#F5F7FA] transition-colors font-medium">
                    <td className="p-3 text-center text-[#718EBF] font-mono text-[11px]">
                      {idx + 1}
                    </td>
                    {Object.keys(activeExplorerData[0]).map(k => {
                      const val = row[k];
                      const isObj = typeof val === 'object' && val !== null;
                      return (
                        <td key={k} className="p-3 whitespace-nowrap text-xs">
                          {isObj ? (
                            <code className="text-[10px] bg-[#F5F7FA] px-1.5 py-0.5 rounded text-[#2D60FF]">
                              {JSON.stringify(val)}
                            </code>
                          ) : (
                            String(val !== undefined ? val : '')
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
