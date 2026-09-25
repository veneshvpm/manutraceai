import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  HardHat,
  Eye,
  Heart,
  Activity,
  AlertTriangle,
  Lock,
  Unlock,
  Radio,
  Users,
  Flame,
  Wind,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  CheckCircle,
  FileSpreadsheet,
  FileText,
  Clock,
  Sparkles,
  Zap,
  Cpu,
  Layers,
  Search,
  Bell,
  Check,
  Download,
  AlertCircle
} from 'lucide-react';
import { humanSecurityEngine } from '../services/humanSecurityEngine';
import {
  WorkerSafetyProfile,
  PpeCameraFeed,
  LotoPermit,
  SafetyGeofenceZone,
  EnvironmentalGasSensor,
  MusterStation,
  SafetyIncidentLog
} from '../types';
import { useApp } from '../context/AppContext';
import { sound } from '../services/soundFx';

export const HumanSecurityPage: React.FC = () => {
  const { showToast } = useApp();

  // Engine state
  const [workers, setWorkers] = useState<WorkerSafetyProfile[]>(humanSecurityEngine.getWorkers());
  const [cameras, setCameras] = useState<PpeCameraFeed[]>(humanSecurityEngine.getCameraFeeds());
  const [lotoList, setLotoList] = useState<LotoPermit[]>(humanSecurityEngine.getLotoPermits());
  const [zones, setZones] = useState<SafetyGeofenceZone[]>(humanSecurityEngine.getGeofenceZones());
  const [gasSensors, setGasSensors] = useState<EnvironmentalGasSensor[]>(humanSecurityEngine.getGasSensors());
  const [muster, setMuster] = useState<MusterStation[]>(humanSecurityEngine.getMusterStations());
  const [incidents, setIncidents] = useState<SafetyIncidentLog[]>(humanSecurityEngine.getIncidentLogs());
  const [ltiDays, setLtiDays] = useState<number>(humanSecurityEngine.getLtiFreeDays());
  const [evacActive, setEvacActive] = useState<boolean>(humanSecurityEngine.isEvacuationActive());
  const [safetyScore, setSafetyScore] = useState<number>(humanSecurityEngine.getOverallSafetyScore());

  // Navigation
  const [activeTab, setActiveTab] = useState<
    'overview' | 'ppe' | 'workers' | 'loto' | 'geofence' | 'environmental' | 'muster' | 'incidents'
  >('overview');

  // Selected details
  const [selectedWorker, setSelectedWorker] = useState<WorkerSafetyProfile | null>(null);
  const [selectedCam, setSelectedCam] = useState<PpeCameraFeed | null>(cameras[0]);
  const [incidentFilter, setIncidentFilter] = useState<'ALL' | 'OPEN' | 'RECORDABLE'>('ALL');

  // 1-second ticker loop
  useEffect(() => {
    const timer = setInterval(() => {
      humanSecurityEngine.tick(1.0);
      setWorkers([...humanSecurityEngine.getWorkers()]);
      setCameras([...humanSecurityEngine.getCameraFeeds()]);
      setGasSensors([...humanSecurityEngine.getGasSensors()]);
      setSafetyScore(humanSecurityEngine.getOverallSafetyScore());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Sync state
  const syncState = () => {
    setWorkers([...humanSecurityEngine.getWorkers()]);
    setCameras([...humanSecurityEngine.getCameraFeeds()]);
    setLotoList([...humanSecurityEngine.getLotoPermits()]);
    setZones([...humanSecurityEngine.getGeofenceZones()]);
    setGasSensors([...humanSecurityEngine.getGasSensors()]);
    setMuster([...humanSecurityEngine.getMusterStations()]);
    setIncidents([...humanSecurityEngine.getIncidentLogs()]);
    setEvacActive(humanSecurityEngine.isEvacuationActive());
    setSafetyScore(humanSecurityEngine.getOverallSafetyScore());
  };

  // Actions
  const handleTriggerFall = () => {
    sound.playAlert();
    const inc = humanSecurityEngine.injectWorkerFall('WRK-105');
    syncState();
    showToast({
      type: 'error',
      title: 'CRITICAL: Worker Fall Detected',
      message: 'David Chen (WRK-105) smart badge detected high-impact fall in Machining Hall A.'
    });
  };

  const handleTriggerIntrusion = () => {
    sound.playAlert();
    humanSecurityEngine.injectGeofenceIntrusion('ZONE-HV-11KV');
    syncState();
    showToast({
      type: 'warning',
      title: 'Substation Geofence Breach',
      message: '11kV Substation perimeter broken. Safety Relay interlock engaged (E-STOP tripped).'
    });
  };

  const handleTriggerGasLeak = () => {
    sound.playAlert();
    humanSecurityEngine.injectGasHazard('GAS-CHEM-02');
    syncState();
    showToast({
      type: 'error',
      title: 'CRITICAL: H2S Toxic Gas Alarm',
      message: 'Hydrogen Sulfide concentration exceeded 14.5 ppm in Chemical Storage Vault.'
    });
  };

  const handleToggleEvac = () => {
    sound.playClick();
    if (evacActive) {
      humanSecurityEngine.stopEvacuationDrill();
      showToast({
        type: 'info',
        title: 'Evacuation Drill Standdown',
        message: 'All muster stations returned to nominal standby.'
      });
    } else {
      sound.playAlert();
      humanSecurityEngine.triggerEvacuationDrill();
      showToast({
        type: 'warning',
        title: 'Plantwide Evacuation Drill Active',
        message: 'Acoustic sirens sounding. RFID muster roll-call active across all 3 assembly points.'
      });
    }
    syncState();
  };

  const handleResolveSos = (id: string) => {
    sound.playSuccess();
    humanSecurityEngine.resolveWorkerSos(id);
    syncState();
    showToast({
      type: 'success',
      title: 'Worker SOS Cleared',
      message: `Worker ${id} vitals stabilized and emergency state cleared.`
    });
  };

  const handleResetZone = (zoneId: string) => {
    sound.playClick();
    humanSecurityEngine.resetZoneInterlock(zoneId);
    syncState();
    showToast({
      type: 'info',
      title: 'Interlock Reset',
      message: `Zone ${zoneId} safety interlock reset to armed state.`
    });
  };

  const handleResetGas = () => {
    sound.playSuccess();
    humanSecurityEngine.resetGasHazard('GAS-CHEM-02');
    syncState();
    showToast({
      type: 'success',
      title: 'Gas Hazard Cleared',
      message: 'Chemical vault atmosphere returned to nominal safe limits.'
    });
  };

  const handleExportHseReport = () => {
    sound.playSuccess();
    const headers = ['Incident ID', 'Type', 'Timestamp', 'Location', 'Involved Worker', 'Severity', 'OSHA Recordable', 'Root Cause', 'CAPA'];
    const rows = incidents.map(i => [
      i.id,
      i.type,
      i.timestamp,
      `"${i.location}"`,
      `"${i.involvedPerson}"`,
      i.severity,
      i.oshaRecordable ? 'YES' : 'NO',
      `"${i.rootCause}"`,
      `"${i.correctiveActionCapa}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MANUTRACE_HSE_SAFETY_DOSSIER_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast({
      type: 'success',
      title: 'HSE Dossier Exported',
      message: 'OSHA 300 & ISO 45001 safety audit data exported to CSV.'
    });
  };

  // Critical conditions
  const activeFallWorkers = workers.filter(w => w.fallStatus !== 'NORMAL' || w.sosActive);
  const activeIntrusions = zones.filter(z => z.intrusionAlarm);
  const activeGasLeaks = gasSensors.filter(g => g.status === 'CRITICAL_EVACUATE');

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto select-none">
      {/* ── Top Header Hero Banner ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E6EFF5] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#10B981] to-[#047857] p-3 flex items-center justify-center text-white shadow-md">
            <ShieldCheck className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-[#343C6A]">Human Security & Worker Safety Intelligence</h1>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#E1F8EC] text-[#10B981] border border-[#10B981]/20">
                OSHA 1910 & ISO 45001 EHS
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E7EDFF] text-[#2D60FF]">
                10 Hz Real-Time Biometric & CV Vision
              </span>
            </div>
            <p className="text-sm text-[#718EBF] mt-1">
              AI Vision PPE Compliance, Smart Badge Wearable Telemetry, LOTO Digital Interlocks, Hazardous Zone Geofencing & Toxic Gas Guard.
            </p>
          </div>
        </div>

        {/* Global Key Metrics Cluster */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1 lg:pb-0">
          <div className="px-4 py-2.5 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5] flex flex-col">
            <span className="text-[10px] uppercase font-bold text-[#718EBF]">Safety Health Score</span>
            <span className="text-base font-extrabold text-[#10B981] font-mono">{safetyScore}%</span>
          </div>
          <div className="px-4 py-2.5 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5] flex flex-col">
            <span className="text-[10px] uppercase font-bold text-[#718EBF]">LTI-Free Days</span>
            <span className="text-base font-extrabold text-[#2D60FF] font-mono">{ltiDays} <span className="text-xs text-[#718EBF]">Days</span></span>
          </div>
          <div className="px-4 py-2.5 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5] flex flex-col">
            <span className="text-[10px] uppercase font-bold text-[#718EBF]">Active LOTO Locks</span>
            <span className="text-base font-extrabold text-[#FFBB38] font-mono">{lotoList.filter(l => l.status !== 'REMOVED_CLEARED').length} <span className="text-xs text-[#718EBF]">Active</span></span>
          </div>
          <button
            onClick={handleExportHseReport}
            className="px-4 py-3 rounded-2xl bg-[#2D60FF] hover:bg-[#1230AE] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md"
            title="Export OSHA 300 / ISO 45001 Compliance Dossier"
          >
            <Download className="w-4 h-4" />
            <span>Export HSE Log</span>
          </button>
        </div>
      </div>

      {/* ── Emergency Warning Banners (if any hazard active) ── */}
      {(activeFallWorkers.length > 0 || activeIntrusions.length > 0 || activeGasLeaks.length > 0 || evacActive) && (
        <div className="space-y-3 animate-pulse">
          {activeFallWorkers.map(w => (
            <div key={w.id} className="bg-[#FFEBEF] border-2 border-[#FE5C73] rounded-2xl p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-6 h-6 text-[#FE5C73] flex-shrink-0" />
                <div>
                  <span className="text-xs font-black text-[#FE5C73] uppercase tracking-wider">MAN-DOWN / FALL ALARM ACTIVE:</span>
                  <p className="text-sm font-bold text-[#343C6A]">{w.name} ({w.id}) in {w.currentZone} • Heart Rate: {w.heartRate} BPM</p>
                </div>
              </div>
              <button
                onClick={() => handleResolveSos(w.id)}
                className="px-4 py-2 rounded-xl bg-[#FE5C73] text-white text-xs font-bold hover:bg-[#e04f64] transition-colors shadow-sm"
              >
                Acknowledge & Clear SOS
              </button>
            </div>
          ))}

          {activeIntrusions.map(z => (
            <div key={z.id} className="bg-[#FFF5D9] border-2 border-[#FFBB38] rounded-2xl p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-[#FFBB38] flex-shrink-0" />
                <div>
                  <span className="text-xs font-black text-[#FFBB38] uppercase tracking-wider">PERIMETER GEOFENCE BREACH:</span>
                  <p className="text-sm font-bold text-[#343C6A]">{z.name} • Physical Machine Interlock Tripped (E-STOP Engaged)</p>
                </div>
              </div>
              <button
                onClick={() => handleResetZone(z.id)}
                className="px-4 py-2 rounded-xl bg-[#FFBB38] text-[#343C6A] text-xs font-bold hover:bg-amber-400 transition-colors shadow-sm"
              >
                Reset Interlock Relay
              </button>
            </div>
          ))}

          {activeGasLeaks.map(g => (
            <div key={g.id} className="bg-[#FFEBEF] border-2 border-[#FE5C73] rounded-2xl p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <Flame className="w-6 h-6 text-[#FE5C73] flex-shrink-0" />
                <div>
                  <span className="text-xs font-black text-[#FE5C73] uppercase tracking-wider">TOXIC GAS CONCENTRATION SPIKE:</span>
                  <p className="text-sm font-bold text-[#343C6A]">{g.location} • H2S: {g.h2sPpm} ppm (Limit: 10 ppm) • Scrubber active</p>
                </div>
              </div>
              <button
                onClick={handleResetGas}
                className="px-4 py-2 rounded-xl bg-[#FE5C73] text-white text-xs font-bold hover:bg-[#e04f64] transition-colors shadow-sm"
              >
                Deactivate Gas Alarm
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── Sub-Navigation Tabs Bar ── */}
      <div className="flex items-center gap-2 overflow-x-auto bg-white p-2 rounded-2xl border border-[#E6EFF5] shadow-xs">
        {[
          { id: 'overview', label: 'SOC Operations Center', icon: ShieldCheck },
          { id: 'ppe', label: 'AI Vision & PPE Enforcement', icon: HardHat, badge: cameras.some(c => c.violationsCount > 0) },
          { id: 'workers', label: `Worker Biometrics (${workers.length})`, icon: Heart, badge: activeFallWorkers.length > 0 },
          { id: 'loto', label: `Digital LOTO (${lotoList.filter(l => l.status !== 'REMOVED_CLEARED').length})`, icon: Lock },
          { id: 'geofence', label: 'Hazardous Geofence Interlocks', icon: Zap, badge: activeIntrusions.length > 0 },
          { id: 'environmental', label: 'Gas & Environmental Monitors', icon: Wind, badge: activeGasLeaks.length > 0 },
          { id: 'muster', label: 'Emergency Evacuation Muster', icon: Users, badge: evacActive },
          { id: 'incidents', label: `OSHA 300 Logs (${incidents.length})`, icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setActiveTab(tab.id as any);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[#10B981] text-white shadow-sm'
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
      {/* 1. OVERVIEW: SAFETY OPERATIONS CENTER (SOC)                         */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Drill Simulator Controls Strip */}
          <div className="bg-white p-5 rounded-3xl border border-[#E6EFF5] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-base text-[#343C6A] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FFBB38]" /> Emergency & Safety Drill Injections
              </h3>
              <p className="text-xs text-[#718EBF]">Test real-time automated safety alarms, AI response dispatch, and interlocks.</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleTriggerFall}
                className="px-3.5 py-2 rounded-xl bg-[#FFEBEF] text-[#FE5C73] hover:bg-red-100 text-xs font-bold border border-[#FE5C73]/30 transition-colors"
              >
                + Inject Man-Down Fall
              </button>
              <button
                onClick={handleTriggerIntrusion}
                className="px-3.5 py-2 rounded-xl bg-[#FFF5D9] text-[#FFBB38] hover:bg-amber-100 text-xs font-bold border border-[#FFBB38]/30 transition-colors"
              >
                + Inject Geofence Intrusion
              </button>
              <button
                onClick={handleTriggerGasLeak}
                className="px-3.5 py-2 rounded-xl bg-[#FFEBEF] text-[#FE5C73] hover:bg-red-100 text-xs font-bold border border-[#FE5C73]/30 transition-colors"
              >
                + Inject H2S Gas Spike
              </button>
              <button
                onClick={handleToggleEvac}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                  evacActive
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-[#FE5C73] hover:bg-[#e04f64] text-white'
                }`}
              >
                {evacActive ? 'Stop Evacuation Drill' : 'Trigger Plant Siren Drill'}
              </button>
            </div>
          </div>

          {/* 4 Overview Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: PPE Compliance */}
            <div
              onClick={() => setActiveTab('ppe')}
              className="bg-white p-6 rounded-3xl border border-[#E6EFF5] shadow-sm hover:border-[#10B981] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#10B981] flex items-center justify-center">
                  <HardHat className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#E1F8EC] text-[#10B981]">
                  AI VISION ONLINE
                </span>
              </div>
              <span className="text-xs text-[#718EBF] uppercase font-bold">PPE Compliance Index</span>
              <h3 className="text-2xl font-black text-[#343C6A] my-1 font-mono">97.8%</h3>
              <p className="text-xs text-[#718EBF]">3 HD AI streams active • 1 minor eye protection advisory</p>
            </div>

            {/* Card 2: Biometric Vitals */}
            <div
              onClick={() => setActiveTab('workers')}
              className="bg-white p-6 rounded-3xl border border-[#E6EFF5] shadow-sm hover:border-[#2D60FF] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#2D60FF] flex items-center justify-center">
                  <Heart className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#E7EDFF] text-[#2D60FF]">
                  100% CHECKED-IN
                </span>
              </div>
              <span className="text-xs text-[#718EBF] uppercase font-bold">Monitored Personnel</span>
              <h3 className="text-2xl font-black text-[#343C6A] my-1 font-mono">6 / 6 <span className="text-sm font-bold text-[#718EBF]">Active</span></h3>
              <p className="text-xs text-[#718EBF]">Avg Pulse: 77 BPM • Avg Temp: 36.8°C • Fatigue: 25%</p>
            </div>

            {/* Card 3: LOTO System */}
            <div
              onClick={() => setActiveTab('loto')}
              className="bg-white p-6 rounded-3xl border border-[#E6EFF5] shadow-sm hover:border-[#FFBB38] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#FFBB38] flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FFF5D9] text-[#FFBB38]">
                  OSHA 1910.147
                </span>
              </div>
              <span className="text-xs text-[#718EBF] uppercase font-bold">Lockout / Tagout (LOTO)</span>
              <h3 className="text-2xl font-black text-[#343C6A] my-1 font-mono">2 Active <span className="text-sm font-bold text-[#718EBF]">Locks</span></h3>
              <p className="text-xs text-[#718EBF]">0V energy isolation verified on CNC M04 & PCS Inverter</p>
            </div>

            {/* Card 4: Hazardous Geofencing */}
            <div
              onClick={() => setActiveTab('geofence')}
              className="bg-white p-6 rounded-3xl border border-[#E6EFF5] shadow-sm hover:border-purple-500 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-50 text-purple-700">
                  4 ZONES ARMED
                </span>
              </div>
              <span className="text-xs text-[#718EBF] uppercase font-bold">Safety Interlocks</span>
              <h3 className="text-2xl font-black text-[#343C6A] my-1 font-mono">100% Armed</h3>
              <p className="text-xs text-[#718EBF]">High-Voltage 11kV, Robotic Laser & Chemical Vaults</p>
            </div>
          </div>

          {/* Real-time Camera AI Preview + Active Workers Table */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Live Camera AI Preview Box */}
            <div className="bg-[#0F172A] p-6 rounded-3xl border border-slate-800 shadow-xl text-white space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                  <span className="font-extrabold text-sm font-mono text-slate-200">
                    LIVE AI VISION • CAM-BAY-01 (Robotic Stamping)
                  </span>
                </div>
                <span className="text-xs font-mono text-emerald-400">28 FPS • 4K UHD</span>
              </div>

              {/* Simulated Visual Stream with AI Bounding Boxes */}
              <div className="relative w-full h-64 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center">
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />

                {/* Simulated Technician Silhouettes with Bounding Boxes */}
                <div className="absolute left-1/4 top-12 border-2 border-emerald-400 bg-emerald-500/10 rounded-lg p-2 text-[10px] font-mono shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  <span className="bg-emerald-500 text-slate-950 font-bold px-1.5 py-0.5 rounded text-[9px] block mb-1">
                    WRK-102 (Elena R.) 99.4%
                  </span>
                  <div className="space-y-0.5 text-emerald-300">
                    <div>✓ Hardhat: 99.4%</div>
                    <div>✓ Hi-Vis Vest: 98.8%</div>
                    <div>✓ Safety Goggles: 97.2%</div>
                  </div>
                </div>

                <div className="absolute right-1/4 bottom-10 border-2 border-amber-400 bg-amber-500/10 rounded-lg p-2 text-[10px] font-mono shadow-[0_0_15px_rgba(251,191,36,0.3)]">
                  <span className="bg-amber-400 text-slate-950 font-bold px-1.5 py-0.5 rounded text-[9px] block mb-1">
                    ZONE 03 PERIMETER
                  </span>
                  <div className="space-y-0.5 text-amber-200">
                    <div>Laser Interlock: ARMED</div>
                    <div>Light Curtain: CLEAR</div>
                  </div>
                </div>

                <div className="absolute bottom-3 left-4 text-[11px] font-mono text-slate-400 bg-slate-950/80 px-3 py-1 rounded-xl border border-slate-800">
                  Model: YOLOv8-PPE-Industrial-v4 • Inference: 14.2ms
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-400 pt-1">
                <span>Active Tracked Workers: <strong className="text-white">Elena Rostov (WRK-102)</strong></span>
                <button
                  onClick={() => setActiveTab('ppe')}
                  className="text-emerald-400 hover:text-emerald-300 font-bold"
                >
                  View All Camera Streams →
                </button>
              </div>
            </div>

            {/* Shift Personnel Biometric Pulse Grid */}
            <div className="bg-white p-6 rounded-3xl border border-[#E6EFF5] shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#E6EFF5] pb-3">
                <h3 className="font-extrabold text-base text-[#343C6A]">Active Shift Floor Personnel</h3>
                <span className="text-xs font-bold text-[#718EBF] font-mono">Shift 01 (06:00 - 14:00)</span>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto">
                {workers.map(w => {
                  const isCritical = w.fallStatus !== 'NORMAL' || w.sosActive;
                  return (
                    <div
                      key={w.id}
                      onClick={() => setSelectedWorker(w)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isCritical
                          ? 'bg-[#FFEBEF] border-[#FE5C73] shadow-xs'
                          : 'bg-[#F5F7FA] border-[#E6EFF5] hover:bg-[#EEF2F6]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                          isCritical ? 'bg-[#FE5C73] text-white' : 'bg-[#E7EDFF] text-[#2D60FF]'
                        }`}>
                          {w.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <strong className="text-xs text-[#343C6A]">{w.name}</strong>
                            <span className="font-mono text-[10px] text-[#718EBF]">{w.id}</span>
                            {isCritical && (
                              <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-[#FE5C73] text-white">
                                {w.fallStatus}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#718EBF]">{w.role} • <span className="font-mono text-[#2D60FF]">{w.currentZone}</span></p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 font-mono text-xs text-right">
                        <div>
                          <span className="text-[9px] text-[#718EBF] block uppercase">PULSE</span>
                          <strong className={w.heartRate > 100 ? 'text-rose-600' : 'text-[#343C6A]'}>{w.heartRate} BPM</strong>
                        </div>
                        <div>
                          <span className="text-[9px] text-[#718EBF] block uppercase">TEMP</span>
                          <strong className="text-[#343C6A]">{w.bodyTemp}°C</strong>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 2. AI VISION & PPE COMPLIANCE MATRIX                                */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTab === 'ppe' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cameras.map(cam => (
              <div
                key={cam.id}
                onClick={() => setSelectedCam(cam)}
                className={`bg-white p-6 rounded-3xl border transition-all cursor-pointer ${
                  selectedCam?.id === cam.id
                    ? 'border-[#10B981] shadow-md ring-2 ring-[#10B981]/20'
                    : 'border-[#E6EFF5] hover:border-[#10B981]/50 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-extrabold text-[#2D60FF]">{cam.id}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    cam.violationsCount > 0 ? 'bg-[#FFEBEF] text-[#FE5C73]' : 'bg-[#E1F8EC] text-[#10B981]'
                  }`}>
                    {cam.violationsCount > 0 ? `${cam.violationsCount} VIOLATION` : '100% COMPLIANT'}
                  </span>
                </div>
                <h4 className="font-extrabold text-sm text-[#343C6A] mb-1">{cam.name}</h4>
                <p className="text-xs text-[#718EBF] mb-4">{cam.zone}</p>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between"><span>Hardhat Compliance:</span><strong className="text-emerald-600">{cam.helmetCompliancePct}%</strong></div>
                  <div className="flex justify-between"><span>Hi-Vis Vest:</span><strong className="text-emerald-600">{cam.vestCompliancePct}%</strong></div>
                  <div className="flex justify-between"><span>Eye Protection:</span><strong className={cam.gogglesCompliancePct < 100 ? 'text-rose-600' : 'text-emerald-600'}>{cam.gogglesCompliancePct}%</strong></div>
                </div>
              </div>
            ))}
          </div>

          {/* Expanded Selected Camera View */}
          {selectedCam && (
            <div className="bg-white p-6 rounded-3xl border border-[#E6EFF5] shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#E6EFF5] pb-3">
                <div>
                  <h3 className="font-extrabold text-lg text-[#343C6A]">{selectedCam.name} ({selectedCam.id})</h3>
                  <span className="text-xs text-[#718EBF]">{selectedCam.zone} • {selectedCam.resolution} • {selectedCam.fps} FPS</span>
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    showToast({
                      type: 'info',
                      title: 'Snapshot Captured',
                      message: `Frame from ${selectedCam.id} saved to safety audit archive.`
                    });
                  }}
                  className="px-4 py-2 rounded-xl bg-[#F5F7FA] hover:bg-[#EEF2F6] text-xs font-bold text-[#343C6A] transition-colors"
                >
                  Capture AI Snapshot
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-950 rounded-2xl h-80 relative flex items-center justify-center border border-slate-800 text-white overflow-hidden">
                  <div className="text-center font-mono text-xs text-slate-400 space-y-2">
                    <HardHat className="w-12 h-12 text-emerald-400 mx-auto animate-pulse" />
                    <p className="text-slate-300 font-bold">COMPUTER VISION LIVE INFERENCE STREAM</p>
                    <span className="text-[10px] text-slate-500">Bounding Box Neural Pipeline Active • Zero Latency</span>
                  </div>

                  {selectedCam.detections.map((det, idx) => (
                    <div
                      key={idx}
                      className={`absolute border-2 rounded-xl p-3 font-mono text-xs ${
                        det.status === 'VIOLATION'
                          ? 'border-rose-500 bg-rose-950/40 shadow-[0_0_20px_rgba(244,63,94,0.4)]'
                          : 'border-emerald-500 bg-emerald-950/40 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                      }`}
                      style={{
                        left: `${det.box.x}%`,
                        top: `${det.box.y}%`,
                        width: `${det.box.width}%`
                      }}
                    >
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase block mb-1.5 ${
                        det.status === 'VIOLATION' ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-slate-950'
                      }`}>
                        {det.personName}
                      </span>
                      <div className="space-y-1 text-[11px]">
                        <div>Hardhat: {det.helmet.detected ? '✓ Detected' : '✗ MISSING'}</div>
                        <div>Vest: {det.vest.detected ? '✓ Detected' : '✗ MISSING'}</div>
                        <div>Goggles: {det.goggles.detected ? '✓ Detected' : '✗ MISSING'}</div>
                        {det.violationLabel && (
                          <div className="text-rose-400 font-bold mt-1 text-[10px]">{det.violationLabel}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="font-extrabold text-sm text-[#343C6A]">Detected Person Inspection</h4>
                  {selectedCam.detections.map((det, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5] space-y-2 text-xs">
                      <div className="flex justify-between font-bold">
                        <span className="text-[#343C6A]">{det.personName}</span>
                        <span className="font-mono text-[#2D60FF]">{det.personId}</span>
                      </div>
                      <div className="space-y-1 font-mono text-[#718EBF]">
                        <div className="flex justify-between"><span>Hardhat Confidence:</span><strong className="text-emerald-600">{det.helmet.confidence}%</strong></div>
                        <div className="flex justify-between"><span>Vest Confidence:</span><strong className="text-emerald-600">{det.vest.confidence}%</strong></div>
                        <div className="flex justify-between"><span>Goggles Confidence:</span><strong className={det.goggles.confidence < 50 ? 'text-rose-600' : 'text-emerald-600'}>{det.goggles.confidence}%</strong></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 3. WORKER BIOMETRICS & LONE WORKER GUARD VIEW                       */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTab === 'workers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workers.map(w => {
            const isCritical = w.fallStatus !== 'NORMAL' || w.sosActive;
            return (
              <div
                key={w.id}
                className={`bg-white p-6 rounded-3xl border transition-all space-y-4 ${
                  isCritical ? 'border-[#FE5C73] shadow-md ring-2 ring-[#FE5C73]/20' : 'border-[#E6EFF5] shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between border-b border-[#E6EFF5] pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs ${
                      isCritical ? 'bg-[#FE5C73] text-white' : 'bg-[#E7EDFF] text-[#2D60FF]'
                    }`}>
                      {w.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#343C6A]">{w.name}</h4>
                      <span className="text-xs text-[#718EBF] font-mono">{w.id} • {w.bloodGroup}</span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isCritical ? 'bg-[#FFEBEF] text-[#FE5C73]' : 'bg-[#E1F8EC] text-[#10B981]'
                  }`}>
                    {w.fallStatus}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 font-mono text-center text-xs">
                  <div className="p-2.5 rounded-2xl bg-[#F5F7FA]">
                    <span className="text-[9px] text-[#718EBF] block">PULSE</span>
                    <strong className={`text-sm ${w.heartRate > 100 ? 'text-rose-600' : 'text-[#343C6A]'}`}>{w.heartRate} BPM</strong>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-[#F5F7FA]">
                    <span className="text-[9px] text-[#718EBF] block">SKIN TEMP</span>
                    <strong className="text-sm text-[#343C6A]">{w.bodyTemp}°C</strong>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-[#F5F7FA]">
                    <span className="text-[9px] text-[#718EBF] block">FATIGUE</span>
                    <strong className={`text-sm ${w.fatigueIndex > 40 ? 'text-amber-500' : 'text-[#10B981]'}`}>{w.fatigueIndex}%</strong>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-[#718EBF]">
                  <div className="flex justify-between"><span>Current Location:</span><strong className="text-[#343C6A]">{w.currentZone}</strong></div>
                  <div className="flex justify-between"><span>Smart Badge RFID:</span><strong className="font-mono text-[#2D60FF]">{w.smartBadgeId}</strong></div>
                  <div className="flex justify-between"><span>Last Check-In:</span><strong className="font-mono text-[#343C6A]">{w.lastCheckInSecondsAgo}s ago</strong></div>
                </div>

                <div className="pt-2 border-t border-[#E6EFF5] flex items-center justify-between">
                  {isCritical ? (
                    <button
                      onClick={() => handleResolveSos(w.id)}
                      className="w-full py-2 rounded-xl bg-[#FE5C73] text-white text-xs font-bold hover:bg-[#e04f64] transition-colors"
                    >
                      Clear SOS & Restore Normal
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        sound.playClick();
                        w.lastCheckInSecondsAgo = 0;
                        setWorkers([...workers]);
                        showToast({
                          type: 'info',
                          title: 'Lone Worker Ping',
                          message: `Sent check-in acknowledgment ping to ${w.name}'s badge.`
                        });
                      }}
                      className="w-full py-2 rounded-xl bg-[#F5F7FA] hover:bg-[#EEF2F6] text-xs font-bold text-[#343C6A] transition-colors"
                    >
                      Ping Worker Badge
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 4. DIGITAL LOCKOUT / TAGOUT (LOTO) VIEW                             */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTab === 'loto' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#E6EFF5] shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-lg text-[#343C6A]">Digital Lockout / Tagout (LOTO) Register</h3>
              <p className="text-xs text-[#718EBF]">OSHA 29 CFR 1910.147 standard energy isolation verification and electronic padlock tracking.</p>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                showToast({
                  type: 'info',
                  title: 'Permit Generator',
                  message: 'New digital LOTO isolation permit draft initiated.'
                });
              }}
              className="px-4 py-2.5 rounded-2xl bg-[#2D60FF] text-white text-xs font-bold shadow-md hover:bg-[#1230AE] transition-all"
            >
              + Create LOTO Permit
            </button>
          </div>

          <div className="space-y-4">
            {lotoList.map(l => (
              <div key={l.id} className="bg-white p-6 rounded-3xl border border-[#E6EFF5] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#E6EFF5] pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                      l.status === 'TAGGED_LOCKED' ? 'bg-rose-50 text-rose-600' : l.status === 'MAINTENANCE_IN_PROGRESS' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-base text-[#343C6A]">{l.equipmentName}</h4>
                        <span className="font-mono text-xs font-bold text-[#2D60FF]">{l.equipmentId}</span>
                      </div>
                      <p className="text-xs text-[#718EBF]">{l.location} • Isolation: <strong className="text-[#343C6A]">{l.isolationType}</strong></p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                    l.status === 'TAGGED_LOCKED' ? 'bg-[#FFEBEF] text-[#FE5C73]' : l.status === 'MAINTENANCE_IN_PROGRESS' ? 'bg-[#FFF5D9] text-[#FFBB38]' : 'bg-[#E1F8EC] text-[#10B981]'
                  }`}>
                    {l.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-2xl bg-[#F5F7FA]">
                    <span className="text-[10px] text-[#718EBF] block">PERMIT ID</span>
                    <strong className="text-[#343C6A]">{l.id}</strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#F5F7FA]">
                    <span className="text-[10px] text-[#718EBF] block">PADLOCK TAG ID</span>
                    <strong className="text-rose-600 font-bold">{l.lockoutTagId}</strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#F5F7FA]">
                    <span className="text-[10px] text-[#718EBF] block">ZERO ENERGY</span>
                    <strong className="text-[#10B981] font-bold">0.0V / 0.0 BAR (VERIFIED)</strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#F5F7FA]">
                    <span className="text-[10px] text-[#718EBF] block">TECHNICIAN</span>
                    <strong className="text-[#343C6A]">{l.technicianName}</strong>
                  </div>
                </div>

                <p className="text-xs text-[#718EBF] bg-[#F5F7FA] p-3 rounded-2xl border border-[#E6EFF5]">
                  <strong className="text-[#343C6A]">Safety Notes:</strong> {l.notes}
                </p>

                <div className="flex justify-end gap-2 pt-2">
                  {l.status !== 'REMOVED_CLEARED' ? (
                    <button
                      onClick={() => {
                        sound.playSuccess();
                        humanSecurityEngine.toggleLoto(l.id, 'REMOVED_CLEARED');
                        syncState();
                        showToast({
                          type: 'success',
                          title: 'LOTO De-isolated & Cleared',
                          message: `Lockout padlock ${l.lockoutTagId} removed after safety sign-off.`
                        });
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                    >
                      Verify & Release Lockout (Remove Lock)
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" /> Machine Cleared for Production
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 5. HAZARDOUS GEOFENCE ZONES & INTERLOCKS VIEW                      */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTab === 'geofence' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {zones.map(z => (
            <div
              key={z.id}
              className={`bg-white p-6 rounded-3xl border transition-all space-y-4 ${
                z.intrusionAlarm ? 'border-[#FE5C73] shadow-md ring-2 ring-[#FE5C73]/20' : 'border-[#E6EFF5] shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between border-b border-[#E6EFF5] pb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                    z.riskTier === 'CRITICAL_HIGH_VOLTAGE' ? 'bg-rose-50 text-rose-600' : 'bg-purple-50 text-purple-600'
                  }`}>
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-[#343C6A]">{z.name}</h4>
                    <span className="font-mono text-xs text-[#718EBF]">{z.id}</span>
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                  z.intrusionAlarm ? 'bg-[#FFEBEF] text-[#FE5C73]' : 'bg-[#E1F8EC] text-[#10B981]'
                }`}>
                  {z.intrusionAlarm ? 'INTRUSION ALARM' : 'INTERLOCK ARMED'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5] space-y-1 text-xs">
                <div className="flex justify-between font-mono">
                  <span className="text-[#718EBF]">Occupancy:</span>
                  <strong className="text-[#343C6A]">{z.currentOccupants.length} / {z.maxOccupancy} Workers Inside</strong>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-[#718EBF]">Safety Relay E-STOP:</span>
                  <strong className={z.eStopTriggered ? 'text-rose-600' : 'text-emerald-600'}>
                    {z.eStopTriggered ? 'TRIPPED (MACHINE HALTED)' : 'NORMAL (RUN ENABLED)'}
                  </strong>
                </div>
                <div className="text-[#718EBF] mt-2 pt-2 border-t border-[#E6EFF5]">
                  <span className="block text-[10px] uppercase font-bold text-[#343C6A]">Ambient Hazards:</span>
                  <span>{z.ambientHazards}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-[#718EBF]">Req. Cert: <strong>{z.requiredCertifications.join(', ')}</strong></span>
                {z.intrusionAlarm && (
                  <button
                    onClick={() => handleResetZone(z.id)}
                    className="px-4 py-2 rounded-xl bg-[#FE5C73] text-white text-xs font-bold hover:bg-[#e04f64] transition-colors"
                  >
                    Reset Interlock
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 6. ENVIRONMENTAL & TOXIC GAS MULTI-SENSORS VIEW                    */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTab === 'environmental' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {gasSensors.map(g => (
              <div
                key={g.id}
                className={`bg-white p-6 rounded-3xl border transition-all space-y-4 ${
                  g.status === 'CRITICAL_EVACUATE' ? 'border-[#FE5C73] shadow-md ring-2 ring-[#FE5C73]/20' : 'border-[#E6EFF5] shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between border-b border-[#E6EFF5] pb-3">
                  <div>
                    <span className="font-mono text-xs font-extrabold text-[#2D60FF]">{g.id}</span>
                    <h4 className="font-bold text-sm text-[#343C6A]">{g.location}</h4>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    g.status === 'CRITICAL_EVACUATE' ? 'bg-[#FFEBEF] text-[#FE5C73]' : 'bg-[#E1F8EC] text-[#10B981]'
                  }`}>
                    {g.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-2xl bg-[#F5F7FA]">
                    <span className="text-[10px] text-[#718EBF] block">O2 LEVEL</span>
                    <strong className="text-sm text-[#343C6A]">{g.o2Percent}% vol</strong>
                    <span className="text-[9px] text-emerald-600 block">Nominal 20.9%</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#F5F7FA]">
                    <span className="text-[10px] text-[#718EBF] block">CO (CARBON MONOXIDE)</span>
                    <strong className="text-sm text-[#343C6A]">{g.coPpm} ppm</strong>
                    <span className="text-[9px] text-[#718EBF] block">OSHA Limit: 50 ppm</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#F5F7FA]">
                    <span className="text-[10px] text-[#718EBF] block">H2S (HYDROGEN SULFIDE)</span>
                    <strong className={`text-sm ${g.h2sPpm > 10 ? 'text-rose-600 font-extrabold' : 'text-[#343C6A]'}`}>{g.h2sPpm} ppm</strong>
                    <span className="text-[9px] text-[#718EBF] block">OSHA Limit: 10 ppm</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#F5F7FA]">
                    <span className="text-[10px] text-[#718EBF] block">NOISE DOSIMETRY</span>
                    <strong className={`text-sm ${g.noiseDecibels > 85 ? 'text-amber-500' : 'text-[#343C6A]'}`}>{g.noiseDecibels} dB</strong>
                    <span className="text-[9px] text-[#718EBF] block">OSHA TWA: 85 dB</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5] text-xs font-mono text-[#718EBF] space-y-1">
                  <div className="flex justify-between"><span>Wet Bulb Globe Temp (WBGT):</span><strong className="text-[#343C6A]">{g.wbgtHeatIndexC} °C</strong></div>
                  <div className="flex justify-between"><span>Combustible Gas (% LEL):</span><strong className="text-[#10B981]">{g.combustibleLelPct}%</strong></div>
                  <div className="flex justify-between"><span>Calibration Date:</span><strong className="text-[#343C6A]">{g.lastCalibrated}</strong></div>
                </div>

                {g.status === 'CRITICAL_EVACUATE' && (
                  <button
                    onClick={handleResetGas}
                    className="w-full py-2.5 rounded-xl bg-[#FE5C73] hover:bg-[#e04f64] text-white text-xs font-bold transition-colors"
                  >
                    Reset Gas Monitor to Safe
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 7. EMERGENCY EVACUATION & MUSTER ROLL-CALL VIEW                     */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTab === 'muster' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#E6EFF5] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-lg text-[#343C6A]">Emergency Evacuation & RFID Muster Stations</h3>
              <p className="text-xs text-[#718EBF]">Automated real-time personnel accountability during fire or chemical emergency evacuations.</p>
            </div>
            <button
              onClick={handleToggleEvac}
              className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all shadow-md ${
                evacActive
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-[#FE5C73] hover:bg-[#e04f64] text-white'
              }`}
            >
              {evacActive ? 'Deactivate Evacuation Drill' : 'Trigger Acoustic Siren & Muster'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {muster.map(m => (
              <div key={m.id} className="bg-white p-6 rounded-3xl border border-[#E6EFF5] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#E6EFF5] pb-3">
                  <div>
                    <span className="font-mono text-xs font-extrabold text-[#2D60FF]">{m.id}</span>
                    <h4 className="font-bold text-sm text-[#343C6A]">{m.name}</h4>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    evacActive ? 'bg-[#FFEBEF] text-[#FE5C73] animate-pulse' : 'bg-[#E1F8EC] text-[#10B981]'
                  }`}>
                    {m.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center font-mono">
                  <div className="p-3 rounded-2xl bg-[#F5F7FA]">
                    <span className="text-[10px] text-[#718EBF] block">CHECKED-IN</span>
                    <strong className="text-xl text-[#10B981]">{m.checkedInCount}</strong>
                    <span className="text-[9px] text-[#718EBF] block">of {m.capacity} Cap</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#F5F7FA]">
                    <span className="text-[10px] text-[#718EBF] block">UNACCOUNTED</span>
                    <strong className={`text-xl ${m.missingCount > 0 ? 'text-rose-600 font-extrabold' : 'text-[#343C6A]'}`}>{m.missingCount}</strong>
                    <span className="text-[9px] text-[#718EBF] block">{m.missingCount > 0 ? 'Locating...' : 'All Clear'}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <span className="text-[10px] font-bold uppercase text-[#718EBF]">Sample Verified Badges:</span>
                  <div className="flex items-center gap-1.5 flex-wrap font-mono">
                    {m.checkedInPersonnel.map((p, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-lg bg-[#E7EDFF] text-[#2D60FF] text-[10px] font-bold">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 8. OSHA 300 & ISO 45001 INCIDENT DOSSIER VIEW                       */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTab === 'incidents' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {['ALL', 'OPEN', 'RECORDABLE'].map((f) => (
                <button
                  key={f}
                  onClick={() => setIncidentFilter(f as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    incidentFilter === f
                      ? 'bg-[#10B981] text-white shadow-sm'
                      : 'bg-white text-[#718EBF] border border-[#E6EFF5] hover:bg-[#F5F7FA]'
                  }`}
                >
                  {f} INCIDENTS
                </button>
              ))}
            </div>

            <button
              onClick={handleExportHseReport}
              className="px-4 py-2 rounded-xl bg-[#2D60FF] text-white text-xs font-bold flex items-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download OSHA 300 Form</span>
            </button>
          </div>

          <div className="space-y-4">
            {incidents.map(inc => (
              <div key={inc.id} className="bg-white p-6 rounded-3xl border border-[#E6EFF5] shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-[#E6EFF5] pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs ${
                      inc.severity === 'CRITICAL' ? 'bg-[#FFEBEF] text-[#FE5C73]' : 'bg-[#FFF5D9] text-[#FFBB38]'
                    }`}>
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono text-xs font-extrabold text-[#2D60FF]">{inc.id}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          inc.severity === 'CRITICAL' ? 'bg-[#FFEBEF] text-[#FE5C73]' : 'bg-[#FFF5D9] text-[#FFBB38]'
                        }`}>
                          {inc.type} ({inc.severity})
                        </span>
                        {inc.oshaRecordable && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFEBEF] text-[#FE5C73] border border-[#FE5C73]/20">
                            OSHA 300 RECORDABLE
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-sm text-[#343C6A]">{inc.description}</h4>
                    </div>
                  </div>
                  <span className="text-xs text-[#718EBF] font-mono">{inc.timestamp}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-[#F5F7FA] space-y-1">
                    <strong className="text-[#343C6A] block">🔍 Root Cause:</strong>
                    <p className="text-[#718EBF]">{inc.rootCause}</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#F5F7FA] space-y-1">
                    <strong className="text-[#343C6A] block">🔧 Corrective Action (CAPA):</strong>
                    <p className="text-[#718EBF]">{inc.correctiveActionCapa}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[#718EBF] pt-2">
                  <span>Location: <strong className="text-[#343C6A]">{inc.location}</strong> • Person: <strong className="text-[#343C6A]">{inc.involvedPerson}</strong></span>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#E7EDFF] text-[#2D60FF]">
                    Investigator: {inc.investigator}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
