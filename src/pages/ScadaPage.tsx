import React, { useState, useEffect } from 'react';
import {
  Zap,
  Sun,
  Wind,
  Battery,
  Cpu,
  Activity,
  AlertTriangle,
  Settings,
  Sliders,
  Terminal,
  TrendingUp,
  RefreshCw,
  Wifi,
  WifiOff,
  Database,
  ShieldAlert,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Lock,
  Unlock,
  Leaf,
  Clock,
  Sparkles,
  Flame,
  AlertCircle,
  Download,
  CheckCircle,
  ArrowRight,
  Info,
  Radio,
  Share2,
  Gauge,
  Layers,
  Power,
  FileSpreadsheet,
  BrainCircuit,
  FileText,
  LayoutDashboard
} from 'lucide-react';
import {
  scadaEngine,
  FAULT_KNOWLEDGE_BASE,
  EmsMode,
  ScadaSimulatorOverrides,
  HourlyForecastPoint
} from '../services/scadaEngine';
import {
  ScadaTelemetry,
  ScadaAlarm,
  ProtocolPacket,
  ModbusRegister,
  CellTelemetry,
  ScadaProtocolType
} from '../types';
import { useApp } from '../context/AppContext';
import { sound } from '../services/soundFx';

// Sub-components
import { ScadaDashboardOverview } from '../components/scada/ScadaDashboardOverview';
import { ScadaFaceplateModal, ScadaAssetType } from '../components/scada/ScadaFaceplateModal';
import { ScadaRoleAuthModal } from '../components/scada/ScadaRoleAuthModal';
import { ScadaReportsView } from '../components/scada/ScadaReportsView';
import { ScadaDatasetReplayView } from '../components/scada/ScadaDatasetReplayView';
import { ScadaForecastingView } from '../components/scada/ScadaForecastingView';
import { ScadaGridView } from '../components/scada/ScadaGridView';
import { ScadaSettingsView } from '../components/scada/ScadaSettingsView';

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOM SVG INDUSTRIAL DIAL GAUGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

interface DialGaugeProps {
  min: number;
  max: number;
  value: number;
  title: string;
  unit: string;
  warningThreshold?: number;
  dangerThreshold?: number;
}

const DialGauge: React.FC<DialGaugeProps> = ({
  min,
  max,
  value,
  title,
  unit,
  warningThreshold = 0.75,
  dangerThreshold = 0.90
}) => {
  const center = 75;
  const radius = 50;

  const t = Math.min(1, Math.max(0, (value - min) / (max - min || 1)));
  const angleDeg = 135 + t * 270;
  const angleRad = (angleDeg * Math.PI) / 180;

  const needleX = center + (radius - 12) * Math.cos(angleRad);
  const needleY = center + (radius - 12) * Math.sin(angleRad);

  const polarToCartesian = (cx: number, cy: number, r: number, angleInDegrees: number) => {
    const rad = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const drawArc = (cx: number, cy: number, r: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return ['M', start.x, start.y, 'A', r, r, 0, largeArcFlag, 0, end.x, end.y].join(' ');
  };

  const greenEnd = 135 + 270 * warningThreshold;
  const yellowEnd = 135 + 270 * dangerThreshold;

  const greenArc = drawArc(center, center, radius, 135, greenEnd);
  const yellowArc = drawArc(center, center, radius, greenEnd, yellowEnd);
  const redArc = drawArc(center, center, radius, yellowEnd, 405);

  return (
    <div className="flex flex-col items-center p-3 bg-white border border-[#E6EFF5] rounded-2xl shadow-sm w-36">
      <span className="text-[10px] uppercase font-bold text-[#718EBF] mb-1 text-center truncate w-full tracking-wide">
        {title}
      </span>
      <svg className="w-24 h-24" viewBox="0 0 150 150">
        <path d={drawArc(center, center, radius, 135, 405)} fill="none" stroke="#F0F4F8" strokeWidth="8" strokeLinecap="round" />
        <path d={greenArc} fill="none" stroke="#16DBCC" strokeWidth="8" strokeLinecap="round" />
        <path d={yellowArc} fill="none" stroke="#FFBB38" strokeWidth="8" />
        <path d={redArc} fill="none" stroke="#FE5C73" strokeWidth="8" strokeLinecap="round" />
        {[0, 0.25, 0.5, 0.75, 1.0].map((tick, idx) => {
          const a = 135 + tick * 270;
          const ra = (a * Math.PI) / 180;
          const x1 = center + (radius - 5) * Math.cos(ra);
          const y1 = center + (radius - 5) * Math.sin(ra);
          const x2 = center + (radius + 2) * Math.cos(ra);
          const y2 = center + (radius + 2) * Math.sin(ra);
          return <line key={idx} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#A0AEC0" strokeWidth="1.5" />;
        })}
        <circle cx={center} cy={center} r="6" fill="#2D60FF" />
        <line x1={center} y1={center} x2={needleX} y2={needleY} stroke="#2D60FF" strokeWidth="3" strokeLinecap="round" />
        <circle cx={center} cy={center} r="2.5" fill="#ffffff" />
      </svg>
      <div className="text-center mt-1 font-mono">
        <span className="text-sm font-extrabold text-[#343C6A]">{typeof value === 'number' ? value.toFixed(1) : value}</span>
        <span className="text-[10px] text-[#718EBF] ml-1 font-bold">{unit}</span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PHYSICAL DIGITAL ODOMETER COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const DigitalOdometer: React.FC<{ value: number; label: string; unit: string }> = ({ value, label, unit }) => {
  const valStr = Math.round(value * 10).toString().padStart(7, '0');
  const digits = valStr.split('');

  return (
    <div className="flex flex-col items-center p-3 bg-gradient-to-br from-[#1E293B] to-[#0F172A] rounded-2xl border border-slate-700 shadow-md text-white">
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">{label}</span>
      <div className="flex items-center gap-1 bg-black/60 p-1.5 rounded-xl border border-slate-800">
        {digits.map((digit, idx) => {
          const isDecimal = idx === digits.length - 1;
          return (
            <React.Fragment key={idx}>
              {isDecimal && <span className="text-emerald-400 font-bold text-sm">.</span>}
              <span
                className={`font-mono text-xs font-extrabold px-1.5 py-0.5 rounded shadow-inner ${
                  isDecimal
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : 'bg-slate-800 text-slate-100 border border-slate-700'
                }`}
              >
                {digit}
              </span>
            </React.Fragment>
          );
        })}
        <span className="text-[10px] font-bold text-emerald-400 ml-1.5">{unit}</span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SCADA PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export const ScadaPage: React.FC = () => {
  const { showToast } = useApp();

  // State
  const [telemetry, setTelemetry] = useState<ScadaTelemetry>(scadaEngine.getTelemetry());
  const [alarms, setAlarms] = useState<ScadaAlarm[]>(scadaEngine.getAlarms());
  const [history, setHistory] = useState<ScadaTelemetry[]>(scadaEngine.getHistory());
  const [packets, setPackets] = useState<ProtocolPacket[]>(scadaEngine.getProtocolPackets());
  const [cells, setCells] = useState<CellTelemetry[]>(scadaEngine.getCells());
  const [emsMode, setEmsMode] = useState<EmsMode>(scadaEngine.getEmsMode());
  const [forecast, setForecast] = useState<HourlyForecastPoint[]>(scadaEngine.get24HourForecast());

  // Security Role
  const [userRole, setUserRole] = useState<'admin' | 'engineer' | 'operator' | 'viewer'>('engineer');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // UI Navigation Tabs
  const [activeSubTab, setActiveSubTab] = useState<
    'dashboard' | 'sld' | 'battery' | 'renewables' | 'grid' | 'ems' | 'protocols' | 'alarms' | 'forecasting' | 'simulator' | 'replay' | 'reports' | 'settings'
  >('dashboard');

  const [protocolSubTab, setProtocolSubTab] = useState<ScadaProtocolType>('modbus');
  const [alarmFilter, setAlarmFilter] = useState<'ALL' | 'CRITICAL' | 'WARNING' | 'ACKNOWLEDGED'>('ALL');
  const [selectedAlarmId, setSelectedAlarmId] = useState<string | null>(null);

  // Asset Faceplate Modal
  const [selectedAsset, setSelectedAsset] = useState<ScadaAssetType | null>(null);

  // Simulator Overrides form states
  const [solarOverrideVal, setSolarOverrideVal] = useState<string>('');
  const [windOverrideVal, setWindOverrideVal] = useState<string>('');
  const [loadOverrideVal, setLoadOverrideVal] = useState<string>('');
  const [batterySocOverrideVal, setBatterySocOverrideVal] = useState<string>('');
  const [ambientTempOverrideVal, setAmbientTempOverrideVal] = useState<string>('26');
  const [cloudCoverOverrideVal, setCloudCoverOverrideVal] = useState<string>('0.15');

  const [solarBreaker, setSolarBreaker] = useState(true);
  const [windBreaker, setWindBreaker] = useState(true);
  const [batteryBreaker, setBatteryBreaker] = useState(true);
  const [gridBreaker, setGridBreaker] = useState(true);
  const [coolingFanAuto, setCoolingFanAuto] = useState<boolean | null>(null);

  // Auto-refresh loop (1000ms ticker)
  useEffect(() => {
    const timer = setInterval(() => {
      const updated = scadaEngine.tick(1.0);
      setTelemetry({ ...updated });
      setAlarms([...scadaEngine.getAlarms()]);
      setHistory([...scadaEngine.getHistory()]);
      setPackets([...scadaEngine.getProtocolPackets()]);
      setCells([...scadaEngine.getCells()]);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Update EMS mode handler
  const handleEmsModeChange = (mode: EmsMode) => {
    sound.playClick();
    scadaEngine.setEmsMode(mode);
    setEmsMode(mode);
    showToast({
      type: 'info',
      title: 'EMS Dispatch Reconfigured',
      message: `Energy Management System switched to ${mode.replace('_', ' ')} strategy.`
    });
  };

  // Alarm actions
  const handleAckAlarm = (id: string) => {
    sound.playClick();
    scadaEngine.acknowledgeAlarm(id);
    setAlarms([...scadaEngine.getAlarms()]);
    showToast({
      type: 'info',
      title: 'Alarm Acknowledged',
      message: `SCADA Alarm ${id} acknowledged by Operator.`
    });
  };

  const handleClearAlarm = (id: string) => {
    sound.playClick();
    scadaEngine.clearAlarm(id);
    setAlarms([...scadaEngine.getAlarms()]);
    showToast({
      type: 'success',
      title: 'Alarm Cleared',
      message: `Alarm log cleared from active SCADA buffer.`
    });
  };

  const handleRepairAlarm = (id: string) => {
    sound.playSuccess();
    scadaEngine.repairAlarm(id);
    setAlarms([...scadaEngine.getAlarms()]);
    showToast({
      type: 'success',
      title: 'Self-Repair Routine Executed',
      message: `AI Diagnostic remediation successfully resolved physical fault condition.`
    });
  };

  const handleApplyOverrides = () => {
    sound.playClick();
    scadaEngine.setOverrides({
      solarOverride: solarOverrideVal ? parseFloat(solarOverrideVal) : null,
      windOverride: windOverrideVal ? parseFloat(windOverrideVal) : null,
      loadOverride: loadOverrideVal ? parseFloat(loadOverrideVal) : null,
      batterySocOverride: batterySocOverrideVal ? parseFloat(batterySocOverrideVal) : null,
      ambientTempOverride: ambientTempOverrideVal ? parseFloat(ambientTempOverrideVal) : null,
      cloudCoverOverride: cloudCoverOverrideVal ? parseFloat(cloudCoverOverrideVal) : null,
      solarEnabled: solarBreaker,
      windEnabled: windBreaker,
      batteryEnabled: batteryBreaker,
      gridEnabled: gridBreaker,
      fanCoolingOverride: coolingFanAuto
    });
    showToast({
      type: 'success',
      title: 'Digital Twin Updated',
      message: 'Physical SCADA simulation parameters applied to microgrid runtime.'
    });
  };

  const handleResetOverrides = () => {
    sound.playClick();
    scadaEngine.resetOverrides();
    setSolarOverrideVal('');
    setWindOverrideVal('');
    setLoadOverrideVal('');
    setBatterySocOverrideVal('');
    setAmbientTempOverrideVal('26');
    setCloudCoverOverrideVal('0.15');
    setSolarBreaker(true);
    setWindBreaker(true);
    setBatteryBreaker(true);
    setGridBreaker(true);
    setCoolingFanAuto(null);
    showToast({
      type: 'info',
      title: 'Simulator Reset',
      message: 'Restored automatic physics simulation baseline.'
    });
  };

  const handleInjectFault = (code: string) => {
    sound.playAlert();
    const alm = scadaEngine.addAlarm(code);
    if (alm) {
      setAlarms([...scadaEngine.getAlarms()]);
      showToast({
        type: 'warning',
        title: `Fault Injected: ${code}`,
        message: alm.message
      });
    }
  };

  // Replay tick handler
  const handleReplayTick = (replayData: Partial<ScadaTelemetry>) => {
    setTelemetry((prev) => ({
      ...prev,
      ...replayData
    }));
  };

  // Filtered alarms
  const filteredAlarms = alarms.filter(a => {
    if (alarmFilter === 'CRITICAL') return a.severity === 'CRITICAL';
    if (alarmFilter === 'WARNING') return a.severity === 'WARNING';
    if (alarmFilter === 'ACKNOWLEDGED') return a.status === 'ACKNOWLEDGED';
    return true;
  });

  const activeCriticalAlarms = alarms.filter(a => a.severity === 'CRITICAL' && a.status === 'ACTIVE');
  const totalRenewableKw = telemetry.Solar_Power + telemetry.Wind_Power;
  const selfSufficiencyPct = Math.min(100, Math.round((totalRenewableKw / (telemetry.Load_Demand || 1)) * 100));

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto select-none">
      {/* ── Top Header Hero Banner ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E6EFF5] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2D60FF] to-[#1230AE] p-3 flex items-center justify-center text-white shadow-md">
            <Zap className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-[#343C6A]">APEX Microgrid SCADA & EMS Suite</h1>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#E7EDFF] text-[#2D60FF] border border-[#2D60FF]/20">
                v2.4 EMS OPERATING SYSTEM
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                telemetry.Grid_Status === 1 ? 'bg-[#DCFAF8] text-[#16DBCC]' : 'bg-[#FFF5D9] text-[#FFBB38]'
              }`}>
                <span className={`w-2 h-2 rounded-full ${telemetry.Grid_Status === 1 ? 'bg-[#16DBCC] animate-ping' : 'bg-[#FFBB38]'}`} />
                {telemetry.Grid_Status === 1 ? 'GRID-TIED (11kV)' : 'ISLANDED MICROGRID'}
              </span>
            </div>
            <p className="text-sm text-[#718EBF] mt-1">
              Industrial Power Conditioning, BESS 16-Cell Telemetry, Multi-Protocol SCADA Gateway, AI Fault Diagnostics & Historical Replay.
            </p>
          </div>
        </div>

        {/* Global Key Metrics Cluster & Role Security Indicator */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1 lg:pb-0">
          <button
            onClick={() => {
              sound.playClick();
              setIsAuthModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-2xl bg-[#F5F7FA] hover:bg-[#E7EDFF] border border-[#E6EFF5] flex items-center gap-2 text-xs font-bold text-[#343C6A] transition-colors"
            title="Click to Authorize or Switch SCADA Control Role"
          >
            <Lock className="w-3.5 h-3.5 text-[#2D60FF]" />
            <span className="text-[10px] uppercase text-[#718EBF]">Role:</span>
            <span className="text-[#2D60FF] uppercase">{userRole}</span>
          </button>
          <div className="px-4 py-2.5 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5] flex flex-col">
            <span className="text-[10px] uppercase font-bold text-[#718EBF]">Clean Energy Gen</span>
            <span className="text-base font-extrabold text-[#343C6A] font-mono">{telemetry.carbon_avoided_kg ? (telemetry.carbon_avoided_kg / 0.82).toFixed(0) : '1,420'} <span className="text-xs text-[#2D60FF]">kWh</span></span>
          </div>
          <div className="px-4 py-2.5 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5] flex flex-col">
            <span className="text-[10px] uppercase font-bold text-[#718EBF]">Arbitrage Savings</span>
            <span className="text-base font-extrabold text-[#16DBCC] font-mono">${telemetry.accumulated_savings.toFixed(2)}</span>
          </div>
          <div className="px-4 py-2.5 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5] flex flex-col">
            <span className="text-[10px] uppercase font-bold text-[#718EBF]">CO₂ Abated</span>
            <span className="text-base font-extrabold text-[#10B981] font-mono">{telemetry.carbon_avoided_kg.toFixed(0)} <span className="text-xs text-emerald-600">kg</span></span>
          </div>
        </div>
      </div>

      {/* ── Critical Alarms Warning Strip (if active) ── */}
      {activeCriticalAlarms.length > 0 && (
        <div className="bg-[#FFEBEF] border-2 border-[#FE5C73] rounded-2xl p-4 flex items-center justify-between shadow-sm animate-pulse">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-[#FE5C73] flex-shrink-0" />
            <div>
              <span className="text-xs font-black text-[#FE5C73] uppercase tracking-wider">CRITICAL SCADA ALARM ACTIVE:</span>
              <p className="text-sm font-bold text-[#343C6A]">{activeCriticalAlarms[0].message} ({activeCriticalAlarms[0].fault_code})</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveSubTab('alarms');
                setSelectedAlarmId(activeCriticalAlarms[0].id);
              }}
              className="px-4 py-2 rounded-xl bg-[#FE5C73] text-white text-xs font-bold hover:bg-[#e04f64] transition-colors shadow-sm"
            >
              Open AI Fault Advisor
            </button>
            <button
              onClick={() => handleRepairAlarm(activeCriticalAlarms[0].id)}
              className="px-4 py-2 rounded-xl bg-white border border-[#FE5C73] text-[#FE5C73] text-xs font-bold hover:bg-red-50 transition-colors"
            >
              Auto-Remediate
            </button>
          </div>
        </div>
      )}

      {/* ── Sub-Navigation Tabs Bar (All 13 SCADA Sub-Modules) ── */}
      <div className="flex items-center gap-2 overflow-x-auto bg-white p-2 rounded-2xl border border-[#E6EFF5] shadow-xs">
        {[
          { id: 'dashboard', label: 'SCADA Dashboard', icon: LayoutDashboard },
          { id: 'sld', label: 'Single-Line Diagram (SLD)', icon: Zap },
          { id: 'battery', label: 'BESS Battery & Cell Matrix', icon: Battery },
          { id: 'renewables', label: 'Renewables (Solar & Wind)', icon: Sun },
          { id: 'grid', label: '11kV Substation & Grid', icon: Zap },
          { id: 'ems', label: 'Smart EMS & Tariff Scheduler', icon: Cpu },
          { id: 'protocols', label: 'Protocol Gateway & Packets', icon: Terminal },
          { id: 'alarms', label: `Alarms Matrix (${alarms.filter(a => a.status === 'ACTIVE').length})`, icon: AlertTriangle, badge: alarms.filter(a => a.status === 'ACTIVE').length > 0 },
          { id: 'forecasting', label: '24h AI Forecasting (LSTM/XGB)', icon: BrainCircuit },
          { id: 'simulator', label: 'Digital Twin Hardware Simulator', icon: Sliders },
          { id: 'replay', label: 'Dataset Replay & CSV Stream', icon: Database },
          { id: 'reports', label: 'Compliance Reports & Export', icon: FileText },
          { id: 'settings', label: 'Plant Setpoints & Settings', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setActiveSubTab(tab.id as any);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[#2D60FF] text-white shadow-sm'
                  : 'text-[#718EBF] hover:text-[#343C6A] hover:bg-[#F5F7FA]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="w-2 h-2 rounded-full bg-[#FE5C73] animate-ping" />
              )}
            </button>
          );
        })}
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 0. MAIN OVERVIEW SCADA DASHBOARD VIEW                               */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeSubTab === 'dashboard' && (
        <ScadaDashboardOverview
          telemetry={telemetry}
          alarms={alarms}
          history={history}
          emsMode={emsMode}
          onSelectTab={setActiveSubTab}
          onSelectAsset={setSelectedAsset}
          onAckAlarm={handleAckAlarm}
          onRepairAlarm={handleRepairAlarm}
        />
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 1. SINGLE-LINE DIAGRAM (SLD) & LIVE TELEMETRY VIEW                  */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeSubTab === 'sld' && (
        <div className="space-y-6">
          {/* Live Industrial Gauges Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            <DialGauge min={10500} max={11500} value={telemetry.Grid_Voltage} title="11kV Substation Bus" unit="V" />
            <DialGauge min={49.0} max={51.0} value={telemetry.Grid_Frequency} title="Grid Frequency" unit="Hz" warningThreshold={0.8} />
            <DialGauge min={0} max={100} value={telemetry.Battery_SOC} title="BESS Battery SOC" unit="%" />
            <DialGauge min={90} max={100} value={telemetry.Inverter_Efficiency} title="PCS Inverter Eff." unit="%" />
            <DialGauge min={0.80} max={1.00} value={telemetry.Grid_PowerFactor} title="Grid Power Factor" unit="cos φ" />
            <div className="flex flex-col justify-between p-3 bg-white border border-[#E6EFF5] rounded-2xl shadow-sm">
              <span className="text-[10px] uppercase font-bold text-[#718EBF]">EMS Strategy</span>
              <div className="p-2 rounded-xl bg-[#E7EDFF] text-[#2D60FF] font-extrabold text-xs text-center">
                {emsMode.replace('_', ' ')}
              </div>
              <span className="text-[10px] text-[#718EBF] text-center">Tariff: ${telemetry.electricity_cost}/kWh</span>
            </div>
          </div>

          {/* Master Single-Line Diagram Interactive Canvas */}
          <div className="bg-[#0F172A] rounded-3xl p-6 border border-slate-800 shadow-xl text-white relative overflow-hidden">
            {/* Diagram Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-sm font-extrabold uppercase tracking-widest text-slate-300">
                  ⚡ 415V / 11kV Industrial Microgrid SLD
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                <span>Power Flow: <strong className="text-emerald-400 font-bold">{telemetry.ems_action}</strong></span>
                <span>•</span>
                <span>Active Feeders: <strong className="text-blue-400">4 / 4</strong></span>
              </div>
            </div>

            {/* Grid Layout of SLD Nodes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {/* Left Column: Generation Assets (Solar & Wind) */}
              <div className="space-y-4">
                <div className="text-[11px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-400" /> Renewable Generation Inflows
                </div>

                {/* Solar PV Node */}
                <div
                  onClick={() => setSelectedAsset('solar')}
                  className="p-4 rounded-2xl bg-slate-900/90 border-2 border-amber-500/40 hover:border-amber-400 transition-all cursor-pointer shadow-lg group hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Sun className="w-5 h-5 text-amber-400 group-hover:rotate-45 transition-transform" />
                      <span className="font-extrabold text-sm">Solar PV Array (Bay 01)</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      telemetry.Solar_Power > 0 ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {telemetry.Solar_Power > 0 ? 'GENERATING' : 'NIGHT/OFF'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                    <div>
                      <span className="text-slate-500 block text-[9px]">POWER</span>
                      <strong className="text-amber-400 text-sm">{telemetry.Solar_Power} kW</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px]">IRRADIANCE</span>
                      <strong className="text-slate-200">{telemetry.Solar_Irradiance} W/m²</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px]">DC VOLT</span>
                      <strong className="text-slate-200">{telemetry.Solar_Voltage} V</strong>
                    </div>
                  </div>
                </div>

                {/* Wind Turbine Node */}
                <div
                  onClick={() => setSelectedAsset('wind')}
                  className="p-4 rounded-2xl bg-slate-900/90 border-2 border-cyan-500/40 hover:border-cyan-400 transition-all cursor-pointer shadow-lg group hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Wind className="w-5 h-5 text-cyan-400 group-hover:spin transition-transform" />
                      <span className="font-extrabold text-sm">Wind Turbine #01</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      telemetry.Wind_Power > 0 ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {telemetry.Wind_Power > 0 ? 'ROTATING' : 'IDLE'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                    <div>
                      <span className="text-slate-500 block text-[9px]">POWER</span>
                      <strong className="text-cyan-400 text-sm">{telemetry.Wind_Power} kW</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px]">WIND SPEED</span>
                      <strong className="text-slate-200">{telemetry.Wind_Speed} m/s</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px]">ROTOR RPM</span>
                      <strong className="text-slate-200">{telemetry.Wind_RPM}</strong>
                    </div>
                  </div>
                </div>

                {/* BESS Storage Node */}
                <div
                  onClick={() => setSelectedAsset('battery')}
                  className="p-4 rounded-2xl bg-slate-900/90 border-2 border-emerald-500/40 hover:border-emerald-400 transition-all cursor-pointer shadow-lg group hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Battery className="w-5 h-5 text-emerald-400" />
                      <span className="font-extrabold text-sm">BESS Lithium Storage (100kWh)</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      telemetry.Battery_Current < 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-blue-500/20 text-blue-300'
                    }`}>
                      {telemetry.Battery_Current < 0 ? 'CHARGING' : telemetry.Battery_Current > 0 ? 'DISCHARGING' : 'STANDBY'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                    <div>
                      <span className="text-slate-500 block text-[9px]">SOC</span>
                      <strong className="text-emerald-400 text-sm">{telemetry.Battery_SOC}%</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px]">CURRENT</span>
                      <strong className="text-slate-200">{telemetry.Battery_Current} A</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px]">TEMP</span>
                      <strong className={`${telemetry.Battery_Temperature > 40 ? 'text-rose-400' : 'text-slate-200'}`}>{telemetry.Battery_Temperature}°C</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Center Column: Power Conditioning System (PCS) & Central Bus */}
              <div className="space-y-4 flex flex-col justify-center">
                <div className="text-[11px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-400" /> Central Microgrid Inverter & Bus
                </div>

                {/* Central Inverter Box */}
                <div
                  onClick={() => setSelectedAsset('inverter')}
                  className="p-5 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-blue-500/50 hover:border-blue-400 transition-all cursor-pointer shadow-2xl relative"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-6 h-6 text-blue-400" />
                      <div>
                        <h3 className="font-extrabold text-base text-white">PCS 3-Phase Inverter</h3>
                        <span className="text-[10px] text-slate-400">Bidirectional DC-AC 100 kW</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-blue-500/20 text-blue-300">
                      {telemetry.Inverter_Status}
                    </span>
                  </div>

                  {/* Animated Bus Visualizer */}
                  <div className="my-4 p-3 rounded-2xl bg-black/60 border border-slate-800 space-y-2">
                    <div className="flex justify-between text-xs font-mono text-slate-400">
                      <span>Total Inverter Output:</span>
                      <strong className="text-emerald-400 font-extrabold text-sm">{telemetry.Inverter_Output_Power} kW</strong>
                    </div>
                    <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 animate-pulse"
                        style={{ width: `${Math.min(100, (telemetry.Inverter_Output_Power / 100) * 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>Efficiency: {telemetry.Inverter_Efficiency}%</span>
                      <span>IGBT Temp: {telemetry.Inverter_Temp}°C</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
                    <div className="p-2 rounded-xl bg-slate-800/60">
                      <span className="text-slate-400 text-[9px] block">AC FREQUENCY</span>
                      <strong className="text-white">{telemetry.Grid_Frequency} Hz</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-800/60">
                      <span className="text-slate-400 text-[9px] block">POWER FACTOR</span>
                      <strong className="text-white">{telemetry.Grid_PowerFactor}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Outflows (Industrial Factory Load & Utility Grid) */}
              <div className="space-y-4">
                <div className="text-[11px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-400" /> Plant Loads & Grid Intertie
                </div>

                {/* Industrial Factory Load Node */}
                <div
                  onClick={() => setSelectedAsset('load')}
                  className="p-4 rounded-2xl bg-slate-900/90 border-2 border-purple-500/40 hover:border-purple-400 transition-all cursor-pointer shadow-lg group hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-purple-400" />
                      <span className="font-extrabold text-sm">Industrial Plant Demand</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300">
                      TIER 1 CRITICAL
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                    <div>
                      <span className="text-slate-500 block text-[9px]">DEMAND</span>
                      <strong className="text-purple-400 text-sm">{telemetry.Load_Demand} kW</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px]">CURRENT</span>
                      <strong className="text-slate-200">{telemetry.Load_Current} A</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px]">SHED STATUS</span>
                      <strong className="text-emerald-400">L{telemetry.load_shedding_level} (0kW)</strong>
                    </div>
                  </div>
                </div>

                {/* Utility 11kV Grid Intertie Node */}
                <div
                  onClick={() => setSelectedAsset('grid')}
                  className="p-4 rounded-2xl bg-slate-900/90 border-2 border-blue-500/40 hover:border-blue-400 transition-all cursor-pointer shadow-lg group hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-blue-400" />
                      <span className="font-extrabold text-sm">11kV Utility Substation</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      telemetry.Grid_Status === 1 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {telemetry.Grid_Status === 1 ? 'SYNCHRONIZED' : 'OPEN BREAKER'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                    <div>
                      <span className="text-slate-500 block text-[9px]">NET POWER</span>
                      <strong className={`${telemetry.Grid_Power > 0 ? 'text-amber-400' : 'text-emerald-400'} text-sm`}>
                        {telemetry.Grid_Power > 0 ? `+${telemetry.Grid_Power} kW` : `${telemetry.Grid_Power} kW`}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px]">FLOW TYPE</span>
                      <strong className="text-slate-200">{telemetry.Grid_Power > 0 ? 'IMPORT' : 'EXPORT'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px]">VOLTAGE</span>
                      <strong className="text-slate-200">{(telemetry.Grid_Voltage / 1000).toFixed(1)} kV</strong>
                    </div>
                  </div>
                </div>

                {/* Digital Odometer for Clean Energy Generation */}
                <DigitalOdometer
                  value={telemetry.carbon_avoided_kg ? (telemetry.carbon_avoided_kg / 0.82) : 1420}
                  label="Cumulative Clean kWh Generated"
                  unit="kWh"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 2. BESS BATTERY ENERGY STORAGE & CELL MATRIX VIEW                   */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeSubTab === 'battery' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-[#E6EFF5] shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-[#718EBF]">BESS Master State of Charge</span>
                <h2 className="text-3xl font-black text-[#343C6A] mt-1 font-mono">{telemetry.Battery_SOC}%</h2>
                <div className="w-full bg-[#E6EFF5] h-3 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-[#16DBCC] rounded-full" style={{ width: `${telemetry.Battery_SOC}%` }} />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[#E6EFF5] space-y-2 text-xs font-mono text-[#718EBF]">
                <div className="flex justify-between"><span>State of Health (SOH):</span><strong className="text-[#343C6A]">{telemetry.Battery_SOH}%</strong></div>
                <div className="flex justify-between"><span>Pack DC Voltage:</span><strong className="text-[#343C6A]">{telemetry.Battery_Voltage} V</strong></div>
                <div className="flex justify-between"><span>Charge/Discharge Current:</span><strong className="text-[#343C6A]">{telemetry.Battery_Current} A</strong></div>
                <div className="flex justify-between"><span>C-Rate:</span><strong className="text-[#343C6A]">{telemetry.Battery_C_Rate} C</strong></div>
                <div className="flex justify-between"><span>Full Lifetime Cycles:</span><strong className="text-[#343C6A]">{telemetry.Battery_Cycles}</strong></div>
              </div>
            </div>

            {/* 16-Cell Matrix Thermal and Voltage Map */}
            <div className="lg:col-span-3 bg-white p-6 rounded-3xl border border-[#E6EFF5] shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#343C6A]">16-Cell Series Thermal & Voltage Balancing Map</h3>
                  <p className="text-xs text-[#718EBF]">Continuous 10 Hz telemetry monitoring individual pouch cell drift & impedance.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      sound.playClick();
                      const next = coolingFanAuto === true ? false : true;
                      setCoolingFanAuto(next);
                      scadaEngine.setOverrides({ fanCoolingOverride: next });
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      coolingFanAuto === true ? 'bg-cyan-500 text-white' : 'bg-[#F5F7FA] text-[#718EBF]'
                    }`}
                  >
                    Fan Cooling: {coolingFanAuto === true ? 'FORCED ON' : coolingFanAuto === false ? 'FORCED OFF' : 'AUTO'}
                  </button>
                </div>
              </div>

              {/* 16-Cell Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                {cells.map((cell) => (
                  <div
                    key={cell.cellId}
                    className={`p-3 rounded-2xl border text-center font-mono transition-all ${
                      cell.temp > 40
                        ? 'bg-[#FFEBEF] border-[#FE5C73] text-[#FE5C73]'
                        : cell.balanceStatus === 'BALANCING'
                        ? 'bg-[#FFF5D9] border-[#FFBB38] text-[#343C6A]'
                        : 'bg-[#F5F7FA] border-[#E6EFF5] text-[#343C6A]'
                    }`}
                  >
                    <span className="text-[10px] font-bold text-[#718EBF] block">Cell #{cell.cellId}</span>
                    <strong className="text-sm font-extrabold block my-1">{cell.voltage} V</strong>
                    <span className="text-[11px] font-bold text-slate-500 block">{cell.temp}°C</span>
                    <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full mt-1 inline-block ${
                      cell.balanceStatus === 'BALANCED' ? 'bg-[#DCFAF8] text-[#16DBCC]' : 'bg-[#FFF5D9] text-[#FFBB38]'
                    }`}>
                      {cell.balanceStatus}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 3. RENEWABLES (SOLAR & WIND) FLEET VIEW                             */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeSubTab === 'renewables' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Solar Fleet Card */}
          <div className="bg-white p-6 rounded-3xl border border-[#E6EFF5] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E6EFF5] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
                  <Sun className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#343C6A]">Solar PV Generation Array</h3>
                  <span className="text-xs text-[#718EBF]">35 kW Peak Bifacial Silicon Monocrystalline</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#FFF5D9] text-[#FFBB38]">
                {telemetry.Solar_Power} kW
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center">
              <div className="p-3 rounded-2xl bg-[#F5F7FA]">
                <span className="text-[10px] text-[#718EBF] block">IRRADIANCE</span>
                <strong className="text-sm text-[#343C6A]">{telemetry.Solar_Irradiance} W/m²</strong>
              </div>
              <div className="p-3 rounded-2xl bg-[#F5F7FA]">
                <span className="text-[10px] text-[#718EBF] block">STRING VOLTAGE</span>
                <strong className="text-sm text-[#343C6A]">{telemetry.Solar_Voltage} V</strong>
              </div>
              <div className="p-3 rounded-2xl bg-[#F5F7FA]">
                <span className="text-[10px] text-[#718EBF] block">DC CURRENT</span>
                <strong className="text-sm text-[#343C6A]">{telemetry.Solar_Current} A</strong>
              </div>
              <div className="p-3 rounded-2xl bg-[#F5F7FA]">
                <span className="text-[10px] text-[#718EBF] block">MODULE TEMP</span>
                <strong className="text-sm text-[#343C6A]">{telemetry.Solar_Temperature}°C</strong>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5] text-xs text-[#718EBF] space-y-1">
              <div className="flex justify-between"><span>MPPT Algorithm:</span><strong className="text-[#343C6A]">Perturb & Observe (P&O) @ 100Hz</strong></div>
              <div className="flex justify-between"><span>Tracking Efficiency:</span><strong className="text-[#16DBCC]">99.4%</strong></div>
              <div className="flex justify-between"><span>Inverter Bay:</span><strong className="text-[#343C6A]">PCS-INV-01 (DC Bus Connected)</strong></div>
            </div>
          </div>

          {/* Wind Fleet Card */}
          <div className="bg-white p-6 rounded-3xl border border-[#E6EFF5] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E6EFF5] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-500">
                  <Wind className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#343C6A]">Direct-Drive Wind Turbine #01</h3>
                  <span className="text-xs text-[#718EBF]">25 kW Permanent Magnet Synchronous Generator</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-cyan-50 text-cyan-600">
                {telemetry.Wind_Power} kW
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center">
              <div className="p-3 rounded-2xl bg-[#F5F7FA]">
                <span className="text-[10px] text-[#718EBF] block">WIND SPEED</span>
                <strong className="text-sm text-[#343C6A]">{telemetry.Wind_Speed} m/s</strong>
              </div>
              <div className="p-3 rounded-2xl bg-[#F5F7FA]">
                <span className="text-[10px] text-[#718EBF] block">ROTOR SPEED</span>
                <strong className="text-sm text-[#343C6A]">{telemetry.Wind_RPM} RPM</strong>
              </div>
              <div className="p-3 rounded-2xl bg-[#F5F7FA]">
                <span className="text-[10px] text-[#718EBF] block">BLADE PITCH</span>
                <strong className="text-sm text-[#343C6A]">{telemetry.Wind_Pitch}°</strong>
              </div>
              <div className="p-3 rounded-2xl bg-[#F5F7FA]">
                <span className="text-[10px] text-[#718EBF] block">NACELLE VIB</span>
                <strong className="text-sm text-[#10B981]">1.8 mm/s</strong>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5] text-xs text-[#718EBF] space-y-1">
              <div className="flex justify-between"><span>Cut-in / Cut-out Speed:</span><strong className="text-[#343C6A]">3.0 m/s / 25.0 m/s</strong></div>
              <div className="flex justify-between"><span>Yaw Control Status:</span><strong className="text-[#16DBCC]">LOCKED (Facing 245° SW)</strong></div>
              <div className="flex justify-between"><span>Braking System:</span><strong className="text-[#343C6A]">Electromagnetic Regenerative</strong></div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 3B. 11kV SUBSTATION & GRID POWER QUALITY VIEW                      */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeSubTab === 'grid' && (
        <ScadaGridView
          telemetry={telemetry}
          onToggleBreaker={(breaker, state) => setGridBreaker(state)}
          gridBreakerClosed={gridBreaker}
        />
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 4. SMART EMS & TARIFF SCHEDULER VIEW                                */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeSubTab === 'ems' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Strategy Selector */}
          <div className="bg-white p-6 rounded-3xl border border-[#E6EFF5] shadow-sm space-y-4">
            <h3 className="font-bold text-base text-[#343C6A]">EMS Optimization Strategy</h3>
            <div className="space-y-2">
              {[
                { id: 'AUTO_ECO', title: 'Auto-Eco (Self-Consumption)', desc: 'Prioritizes solar/wind to factory load, charges BESS with surplus, exports excess.' },
                { id: 'PEAK_SHAVING', title: 'Peak Tariff Shaving', desc: 'Discharges BESS during peak tariff hours (14:00-20:00) to cap utility demand charges.' },
                { id: 'ISLANDED_EMERGENCY', title: 'Islanded Emergency Mode', desc: 'Forms standalone grid frequency 50Hz via BESS; sheds non-critical HVAC if needed.' },
                { id: 'GRID_SUPPORT', title: 'Grid Frequency Support (FFR)', desc: 'Provides fast frequency response synthetic inertia to regional 11kV corridor.' },
                { id: 'STORM_RESILIENCE', title: 'Storm Resilience Pre-Charge', desc: 'Charges BESS to 100% capacity from grid ahead of forecasted extreme weather.' }
              ].map((m) => (
                <div
                  key={m.id}
                  onClick={() => handleEmsModeChange(m.id as EmsMode)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    emsMode === m.id
                      ? 'bg-[#E7EDFF] border-[#2D60FF] text-[#343C6A]'
                      : 'bg-[#F5F7FA] border-[#E6EFF5] hover:bg-[#EEF2F6] text-[#718EBF]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-xs font-bold text-[#343C6A]">{m.title}</strong>
                    {emsMode === m.id && <CheckCircle className="w-4 h-4 text-[#2D60FF]" />}
                  </div>
                  <p className="text-[11px] leading-snug">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Time of Use (TOU) Tariff Schedule */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-[#E6EFF5] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-[#343C6A]">24-Hour TOU Dynamic Tariff & Load Forecast</h3>
                <p className="text-xs text-[#718EBF]">Hourly arbitrage schedule highlighting peak vs off-peak window.</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#DCFAF8] text-[#16DBCC]">
                Active Rate: ${telemetry.electricity_cost}/kWh
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="bg-[#F5F7FA] text-[#718EBF] text-left">
                    <th className="p-2.5 rounded-l-xl">Hour</th>
                    <th className="p-2.5">Load (kW)</th>
                    <th className="p-2.5">Solar (kW)</th>
                    <th className="p-2.5">Wind (kW)</th>
                    <th className="p-2.5">Total Clean (kW)</th>
                    <th className="p-2.5">Net Grid (kW)</th>
                    <th className="p-2.5 rounded-r-xl">Tariff Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6EFF5]">
                  {forecast.slice(0, 10).map((pt, idx) => (
                    <tr key={idx} className="hover:bg-[#F5F7FA]/50 transition-colors">
                      <td className="p-2.5 font-bold text-[#343C6A]">{pt.timeLabel}</td>
                      <td className="p-2.5 text-purple-600 font-bold">{pt.loadForecast}</td>
                      <td className="p-2.5 text-amber-500 font-bold">{pt.solarForecast}</td>
                      <td className="p-2.5 text-cyan-500 font-bold">{pt.windForecast}</td>
                      <td className="p-2.5 text-emerald-600 font-extrabold">{pt.totalRenewable}</td>
                      <td className="p-2.5 font-bold">{pt.netGridExpected > 0 ? `+${pt.netGridExpected}` : pt.netGridExpected}</td>
                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          pt.tariffRate > 0.10 ? 'bg-[#FFEBEF] text-[#FE5C73]' : 'bg-[#DCFAF8] text-[#16DBCC]'
                        }`}>
                          ${pt.tariffRate}/kWh
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 5. PROTOCOL GATEWAY & PACKET SNIFFER VIEW                           */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeSubTab === 'protocols' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-[#E6EFF5] pb-2">
            {[
              { id: 'modbus', label: 'Modbus TCP (Port 502)' },
              { id: 'can', label: 'CAN Bus 2.0B (29-bit Ext ID)' },
              { id: 'mqtt', label: 'MQTT Telemetry Broker' },
              { id: 'opcua', label: 'OPC-UA Node Hierarchy' },
              { id: 'iec61850', label: 'IEC 61850 GOOSE/SV' }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  sound.playClick();
                  setProtocolSubTab(p.id as ScadaProtocolType);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  protocolSubTab === p.id
                    ? 'bg-[#2D60FF] text-white shadow-sm'
                    : 'bg-white text-[#718EBF] hover:bg-[#F5F7FA] border border-[#E6EFF5]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {protocolSubTab === 'modbus' && (
            <div className="bg-white p-6 rounded-3xl border border-[#E6EFF5] shadow-sm">
              <h3 className="font-bold text-base text-[#343C6A] mb-4">Modbus TCP Holding Registers & Coils Mapping</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr className="bg-[#F5F7FA] text-[#718EBF] text-left">
                      <th className="p-3 rounded-l-xl">Register</th>
                      <th className="p-3">Variable Name</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Live Value</th>
                      <th className="p-3">Unit</th>
                      <th className="p-3">Access</th>
                      <th className="p-3 rounded-r-xl">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6EFF5]">
                    {scadaEngine.getModbusRegisterTable().map((reg) => (
                      <tr key={reg.address} className="hover:bg-[#F5F7FA]/50 transition-colors">
                        <td className="p-3 font-bold text-[#2D60FF]">400{reg.address < 10 ? `0${reg.address}` : reg.address}</td>
                        <td className="p-3 font-bold text-[#343C6A]">{reg.name}</td>
                        <td className="p-3 text-slate-500">{reg.type}</td>
                        <td className="p-3 font-extrabold text-emerald-600">{reg.value}</td>
                        <td className="p-3 text-slate-500">{reg.unit}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            reg.access === 'RW' ? 'bg-[#E7EDFF] text-[#2D60FF]' : 'bg-[#F5F7FA] text-[#718EBF]'
                          }`}>
                            {reg.access}
                          </span>
                        </td>
                        <td className="p-3 text-[#718EBF]">{reg.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Live Industrial Packet Stream Terminal */}
          <div className="bg-[#0F172A] p-6 rounded-3xl border border-slate-800 shadow-xl text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-emerald-400" />
                <span className="font-extrabold text-sm font-mono text-emerald-400">Live Multi-Protocol Packet Stream</span>
              </div>
              <span className="text-xs font-mono text-slate-400">Buffer Size: {packets.length} Frames</span>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto font-mono text-xs">
              {packets.map((pkt) => (
                <div key={pkt.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-slate-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-800 text-cyan-400">
                      {pkt.protocol}
                    </span>
                    <span className="text-slate-500 text-[10px]">{pkt.timestamp}</span>
                    <span className="text-slate-400 font-bold">{pkt.identifier}</span>
                  </div>
                  <div className="text-emerald-300 text-[11px] truncate max-w-xl">
                    {pkt.data}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 6. ALARMS MATRIX & AI FAULT DIAGNOSTICS VIEW                        */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeSubTab === 'alarms' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {['ALL', 'CRITICAL', 'WARNING', 'ACKNOWLEDGED'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setAlarmFilter(filter as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    alarmFilter === filter
                      ? 'bg-[#2D60FF] text-white shadow-sm'
                      : 'bg-white text-[#718EBF] border border-[#E6EFF5] hover:bg-[#F5F7FA]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleInjectFault('FLT-BESS-01')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FFEBEF] text-[#FE5C73] border border-[#FE5C73]/30 hover:bg-red-100 transition-colors"
              >
                + Inject BESS Fault
              </button>
              <button
                onClick={() => handleInjectFault('FLT-GRID-01')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FFF5D9] text-[#FFBB38] border border-[#FFBB38]/30 hover:bg-amber-100 transition-colors"
              >
                + Inject Grid Drop
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredAlarms.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-[#E6EFF5] text-[#718EBF]">
                <CheckCircle className="w-12 h-12 text-[#16DBCC] mx-auto mb-3" />
                <h4 className="text-base font-bold text-[#343C6A]">No Active SCADA Alarms</h4>
                <p className="text-xs">All microgrid components operating within normal nominal tolerances.</p>
              </div>
            ) : (
              filteredAlarms.map((alarm) => {
                const isExpanded = selectedAlarmId === alarm.id;
                const isCritical = alarm.severity === 'CRITICAL';
                return (
                  <div
                    key={alarm.id}
                    className={`bg-white rounded-3xl border transition-all overflow-hidden ${
                      isCritical ? 'border-[#FE5C73]/40 shadow-sm' : 'border-[#E6EFF5]'
                    }`}
                  >
                    <div
                      onClick={() => setSelectedAlarmId(isExpanded ? null : alarm.id)}
                      className="p-5 flex items-center justify-between cursor-pointer hover:bg-[#F5F7FA]/60 transition-colors"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs ${
                          isCritical ? 'bg-[#FFEBEF] text-[#FE5C73]' : 'bg-[#FFF5D9] text-[#FFBB38]'
                        }`}>
                          {alarm.severity === 'CRITICAL' ? <AlertTriangle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                              isCritical ? 'bg-[#FFEBEF] text-[#FE5C73]' : 'bg-[#FFF5D9] text-[#FFBB38]'
                            }`}>
                              {alarm.severity}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#F5F7FA] text-[#343C6A]">
                              {alarm.fault_code}
                            </span>
                            <span className="text-xs text-[#718EBF]">Source: <strong>{alarm.source}</strong></span>
                            <span className="text-xs text-[#718EBF]">• {new Date(alarm.timestamp * 1000).toLocaleTimeString()}</span>
                          </div>
                          <h4 className="font-bold text-sm text-[#343C6A]">{alarm.message}</h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        {alarm.status === 'ACTIVE' && (
                          <button
                            onClick={() => handleAckAlarm(alarm.id)}
                            className="px-3 py-1.5 rounded-xl bg-[#F5F7FA] hover:bg-[#E7EDFF] text-[#2D60FF] text-xs font-bold transition-colors"
                          >
                            ACK
                          </button>
                        )}
                        <button
                          onClick={() => handleRepairAlarm(alarm.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-xs"
                        >
                          Auto-Repair
                        </button>
                        <button
                          onClick={() => handleClearAlarm(alarm.id)}
                          className="px-3 py-1.5 rounded-xl bg-[#F5F7FA] hover:bg-[#FFEBEF] text-[#FE5C73] text-xs font-bold transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    {/* Expanded AI Fault Advisor Card */}
                    {isExpanded && (
                      <div className="bg-[#F5F7FA] p-6 border-t border-[#E6EFF5] space-y-4">
                        <div className="flex items-center gap-2 text-xs font-extrabold text-[#2D60FF] uppercase tracking-wider">
                          <Sparkles className="w-4 h-4" /> AI Root Cause Diagnostics & Remediation Guide
                        </div>

                        <div className="p-4 rounded-2xl bg-white border border-[#E6EFF5] text-xs space-y-2">
                          <strong className="text-[#343C6A] block text-sm">🔍 Root Cause:</strong>
                          <p className="text-[#718EBF] leading-relaxed">{alarm.root_cause}</p>
                        </div>

                        {alarm.repair_actions && (
                          <div className="p-4 rounded-2xl bg-white border border-[#E6EFF5] text-xs space-y-2">
                            <strong className="text-[#343C6A] block text-sm">🔧 Standard Operating Procedure (SOP):</strong>
                            <div className="space-y-1.5 text-[#343C6A]">
                              {alarm.repair_actions.map((act, idx) => (
                                <div key={idx} className="p-2 rounded-xl bg-[#F5F7FA] flex items-center gap-2">
                                  <span>{act}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {alarm.safety_warning && (
                          <div className="p-3.5 rounded-2xl bg-[#FFEBEF] border border-[#FE5C73]/30 text-xs text-[#FE5C73] font-bold flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                            <span>{alarm.safety_warning}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 7. 24-HOUR AI FORECASTING VIEW                                      */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeSubTab === 'forecasting' && (
        <ScadaForecastingView forecast={forecast} />
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 8. DIGITAL TWIN HARDWARE SIMULATOR VIEW                             */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeSubTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-[#E6EFF5] shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-[#E6EFF5] pb-4">
              <div>
                <h3 className="font-bold text-base text-[#343C6A]">Real-Time Physics Simulation Overrides</h3>
                <p className="text-xs text-[#718EBF]">Directly inject physical sensor parameters into the live mathematical model.</p>
              </div>
              <button
                onClick={handleResetOverrides}
                className="px-4 py-2 rounded-xl bg-[#F5F7FA] text-[#718EBF] hover:text-[#343C6A] text-xs font-bold transition-colors"
              >
                Reset to Live Physics
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[#718EBF] font-bold mb-1">Solar Generation (kW Override):</label>
                <input
                  type="number"
                  placeholder="e.g. 30.0 (Leave blank for auto sun curve)"
                  value={solarOverrideVal}
                  onChange={(e) => setSolarOverrideVal(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#E6EFF5] bg-[#F5F7FA] font-mono text-sm focus:outline-none focus:border-[#2D60FF]"
                />
              </div>

              <div>
                <label className="block text-[#718EBF] font-bold mb-1">Wind Turbine Output (kW Override):</label>
                <input
                  type="number"
                  placeholder="e.g. 20.0 (Leave blank for auto gusts)"
                  value={windOverrideVal}
                  onChange={(e) => setWindOverrideVal(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#E6EFF5] bg-[#F5F7FA] font-mono text-sm focus:outline-none focus:border-[#2D60FF]"
                />
              </div>

              <div>
                <label className="block text-[#718EBF] font-bold mb-1">Industrial Factory Load (kW Override):</label>
                <input
                  type="number"
                  placeholder="e.g. 45.0 (Leave blank for shift model)"
                  value={loadOverrideVal}
                  onChange={(e) => setLoadOverrideVal(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#E6EFF5] bg-[#F5F7FA] font-mono text-sm focus:outline-none focus:border-[#2D60FF]"
                />
              </div>

              <div>
                <label className="block text-[#718EBF] font-bold mb-1">Battery State of Charge (% Override):</label>
                <input
                  type="number"
                  placeholder="e.g. 80.0 (Leave blank for auto Coulomb counting)"
                  value={batterySocOverrideVal}
                  onChange={(e) => setBatterySocOverrideVal(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#E6EFF5] bg-[#F5F7FA] font-mono text-sm focus:outline-none focus:border-[#2D60FF]"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleApplyOverrides}
                className="px-6 py-3 rounded-2xl bg-[#2D60FF] hover:bg-[#1230AE] text-white text-xs font-bold transition-all shadow-md"
              >
                Apply Simulation Parameters
              </button>
            </div>
          </div>

          {/* Breaker Contactor Controls */}
          <div className="bg-white p-6 rounded-3xl border border-[#E6EFF5] shadow-sm space-y-4">
            <h3 className="font-bold text-base text-[#343C6A]">Hardware Circuit Breakers</h3>
            <div className="space-y-3">
              {[
                { label: 'Solar DC Disconnect (K1)', state: solarBreaker, toggle: () => setSolarBreaker(!solarBreaker) },
                { label: 'Wind Intertie Breaker (K2)', state: windBreaker, toggle: () => setWindBreaker(!windBreaker) },
                { label: 'BESS Master Contactor (K3)', state: batteryBreaker, toggle: () => setBatteryBreaker(!batteryBreaker) },
                { label: '11kV Grid Intertie (K4)', state: gridBreaker, toggle: () => setGridBreaker(!gridBreaker) }
              ].map((b, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5] flex items-center justify-between">
                  <span className="text-xs font-bold text-[#343C6A]">{b.label}</span>
                  <button
                    onClick={() => {
                      sound.playClick();
                      b.toggle();
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      b.state ? 'bg-[#DCFAF8] text-[#16DBCC]' : 'bg-[#FFEBEF] text-[#FE5C73]'
                    }`}
                  >
                    {b.state ? 'CLOSED (ON)' : 'OPEN (TRIPPED)'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 9. DATASET REPLAY & CSV STREAM STUDIO VIEW                         */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeSubTab === 'replay' && (
        <ScadaDatasetReplayView
          onReplayTick={handleReplayTick}
          onShowToast={showToast}
        />
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 10. COMPLIANCE & AUDIT REPORTS VIEW                                */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeSubTab === 'reports' && (
        <ScadaReportsView
          telemetry={telemetry}
          alarms={alarms}
          history={history}
          onShowToast={showToast}
        />
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 11. PLANT SETPOINTS & SETTINGS VIEW                                */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeSubTab === 'settings' && (
        <ScadaSettingsView
          emsMode={emsMode}
          onUpdateEmsMode={handleEmsModeChange}
          onShowToast={showToast}
          userRole={userRole}
        />
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* ASSET FACEPLATE MODAL                                               */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <ScadaFaceplateModal
        asset={selectedAsset}
        telemetry={telemetry}
        onClose={() => setSelectedAsset(null)}
        userRole={userRole}
      />

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* RBAC ROLE AUTHORIZATION MODAL                                       */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <ScadaRoleAuthModal
        isOpen={isAuthModalOpen}
        currentRole={userRole}
        onClose={() => setIsAuthModalOpen(false)}
        onSelectRole={(newRole) => {
          setUserRole(newRole);
          showToast({
            type: 'success',
            title: 'Role Authorized',
            message: `Switched operational control privileges to [${newRole.toUpperCase()}].`
          });
        }}
      />
    </div>
  );
};
