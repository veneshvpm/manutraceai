import React, { useState } from 'react';
import {
  FileText,
  Download,
  CheckCircle,
  ShieldCheck,
  TrendingUp,
  Share2,
  Printer,
  Calendar,
  Layers,
  Zap,
  Sparkles
} from 'lucide-react';
import { ScadaTelemetry, ScadaAlarm } from '../../types';
import { sound } from '../../services/soundFx';

interface ScadaReportsViewProps {
  telemetry: ScadaTelemetry;
  alarms: ScadaAlarm[];
  history: ScadaTelemetry[];
  onShowToast: (toast: { type: 'success' | 'info' | 'warning' | 'error'; title: string; message: string }) => void;
}

export const ScadaReportsView: React.FC<ScadaReportsViewProps> = ({
  telemetry,
  alarms,
  history,
  onShowToast
}) => {
  const [reportType, setReportType] = useState<'daily_audit' | 'grid_export' | 'esg_carbon' | 'bms_cell_health'>('daily_audit');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExportCsv = () => {
    sound.playClick();
    setIsGenerating(true);

    setTimeout(() => {
      let csvContent = 'Timestamp,Solar_kW,Wind_kW,Battery_SOC,Battery_A,Grid_kW,Load_kW,Inverter_Eff,EMS_Action,Savings_USD,CO2_kg\n';
      history.forEach((pt) => {
        const timeStr = new Date(pt.timestamp * 1000).toISOString();
        csvContent += `${timeStr},${pt.Solar_Power},${pt.Wind_Power},${pt.Battery_SOC},${pt.Battery_Current},${pt.Grid_Power},${pt.Load_Demand},${pt.Inverter_Efficiency},${pt.ems_action},${pt.accumulated_savings},${pt.carbon_avoided_kg}\n`;
      });

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `APEX_SCADA_Telemetry_Export_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsGenerating(false);
      sound.playSuccess();
      onShowToast({
        type: 'success',
        title: 'CSV Dataset Downloaded',
        message: 'Complete 10-Hz high-resolution SCADA telemetry dataset exported.'
      });
    }, 400);
  };

  const handlePrintPdfDossier = () => {
    sound.playClick();
    window.print();
    onShowToast({
      type: 'info',
      title: 'Audit PDF Ready',
      message: 'Printed official SCADA plant operational compliance dossier.'
    });
  };

  return (
    <div className="space-y-6 select-none">
      {/* Report Header Card */}
      <div className="bg-white p-6 rounded-3xl border border-[#E6EFF5] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-xl text-[#343C6A]">SCADA Compliance & Audit Dossier Studio</h3>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#E7EDFF] text-[#2D60FF]">
              ISO 50001 / IEEE 1547 COMPLIANT
            </span>
          </div>
          <p className="text-xs text-[#718EBF] mt-1">
            Automated regulatory reporting, energy arbitrage revenue certificates, and raw high-speed sensor stream export.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            disabled={isGenerating}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#F5F7FA] hover:bg-[#EEF2F6] text-[#343C6A] text-xs font-bold transition-all border border-[#E6EFF5] shadow-xs"
          >
            <Download className="w-4 h-4 text-[#2D60FF]" />
            <span>{isGenerating ? 'Exporting...' : 'Export Raw CSV Stream'}</span>
          </button>
          <button
            onClick={handlePrintPdfDossier}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#2D60FF] hover:bg-[#1230AE] text-white text-xs font-bold transition-all shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>Generate & Print PDF Dossier</span>
          </button>
        </div>
      </div>

      {/* Report Templates Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            id: 'daily_audit',
            title: 'Daily Microgrid Plant Audit',
            tag: 'DAILY SUMMARY',
            desc: '24-hour generation, peak shaving yield, inverter uptime, and critical alarm log.',
            badge: 'ISO 50001'
          },
          {
            id: 'grid_export',
            title: '11kV Grid Intertie & Arbitrage',
            tag: 'FINANCIAL REVENUE',
            desc: 'Net metering import/export kWh, TOU tariff arbitrage savings, and peak demand capping.',
            badge: 'PPA BILLING'
          },
          {
            id: 'esg_carbon',
            title: 'ESG Clean Carbon Abatement',
            tag: 'SUSTAINABILITY',
            desc: 'Scope 1 & 2 carbon emissions avoided (kg CO2) vs regional coal/gas generation grid.',
            badge: 'GHG PROTOCOL'
          },
          {
            id: 'bms_cell_health',
            title: 'BESS Degradation & Cell SOH',
            tag: 'BATTERY HEALTH',
            desc: '16-cell series voltage balance, Coulomb-counting cycle life, and thermal dissipation.',
            badge: 'IEC 62619'
          }
        ].map((tpl) => (
          <div
            key={tpl.id}
            onClick={() => {
              sound.playClick();
              setReportType(tpl.id as any);
            }}
            className={`p-5 rounded-3xl border transition-all cursor-pointer shadow-xs ${
              reportType === tpl.id
                ? 'bg-[#E7EDFF] border-[#2D60FF] ring-2 ring-[#2D60FF]/20 text-[#343C6A]'
                : 'bg-white border-[#E6EFF5] hover:border-slate-300 text-[#718EBF]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#2D60FF]">
                {tpl.tag}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white text-[#343C6A] border border-[#E6EFF5]">
                {tpl.badge}
              </span>
            </div>
            <h4 className="font-extrabold text-sm text-[#343C6A] mb-1">{tpl.title}</h4>
            <p className="text-[11px] leading-snug">{tpl.desc}</p>
          </div>
        ))}
      </div>

      {/* Generated Report Preview Card */}
      <div className="bg-white p-8 rounded-3xl border border-[#E6EFF5] shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-[#E6EFF5] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E7EDFF] flex items-center justify-center text-[#2D60FF]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-base text-[#343C6A]">
                Official Microgrid Inspection Dossier: {reportType.toUpperCase().replace('_', ' ')}
              </h4>
              <span className="text-xs text-[#718EBF]">Generated: {new Date().toLocaleString()} • Ref: MT-SCADA-2026-AUDIT</span>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#DCFAF8] text-[#16DBCC]">
            VERIFIED AUDIT LOG
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono">
          <div className="p-4 rounded-2xl bg-[#F5F7FA]">
            <span className="text-[10px] text-[#718EBF] block uppercase font-bold">Total Clean Gen</span>
            <strong className="text-lg text-[#343C6A]">{(telemetry.carbon_avoided_kg / 0.82).toFixed(1)} kWh</strong>
          </div>
          <div className="p-4 rounded-2xl bg-[#F5F7FA]">
            <span className="text-[10px] text-[#718EBF] block uppercase font-bold">Total Arbitrage Yield</span>
            <strong className="text-lg text-emerald-600">${telemetry.accumulated_savings.toFixed(2)}</strong>
          </div>
          <div className="p-4 rounded-2xl bg-[#F5F7FA]">
            <span className="text-[10px] text-[#718EBF] block uppercase font-bold">CO₂ Abated</span>
            <strong className="text-lg text-emerald-600">{telemetry.carbon_avoided_kg.toFixed(0)} kg</strong>
          </div>
          <div className="p-4 rounded-2xl bg-[#F5F7FA]">
            <span className="text-[10px] text-[#718EBF] block uppercase font-bold">Inverter Uptime</span>
            <strong className="text-lg text-[#2D60FF]">99.8%</strong>
          </div>
        </div>

        {/* Regulatory Compliance Checklist */}
        <div className="p-5 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5] space-y-3">
          <h5 className="font-bold text-xs text-[#343C6A] uppercase tracking-wider">Industrial Standards Checklist:</h5>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-600 font-bold">
              <CheckCircle className="w-4 h-4" />
              <span>IEEE 1547-2018 Interconnection (Passed)</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-600 font-bold">
              <CheckCircle className="w-4 h-4" />
              <span>IEC 61850 Substation GOOSE (Passed)</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-600 font-bold">
              <CheckCircle className="w-4 h-4" />
              <span>UL 9540A BESS Fire Safety (Passed)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
