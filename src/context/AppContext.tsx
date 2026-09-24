import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  IndustryType,
  Product,
  Batch,
  Machine,
  Supplier,
  RawMaterial,
  QualityInspection,
  Defect,
  Shipment,
  AlertNotification
} from '../types';
import {
  INITIAL_BATCHES,
  INITIAL_PRODUCTS,
  INITIAL_MACHINES,
  INITIAL_SUPPLIERS,
  INITIAL_RAW_MATERIALS,
  INITIAL_INSPECTIONS,
  INITIAL_DEFECTS,
  INITIAL_SHIPMENTS,
  INITIAL_ALERTS
} from '../data/mockData';
import { INDUSTRIES } from '../data/industries';
import { DatasetTarget } from '../services/datasetParser';
import { sound } from '../services/soundFx';

export interface ToastItem {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title?: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
}

export interface PresetScenario {
  id: string;
  title: string;
  category: 'critical' | 'warning' | 'predictive' | 'success';
  badge: string;
  description: string;
  targetBatchId: string;
  targetProductId: string;
  targetMachineId: string;
  targetRawMaterialId: string;
  targetTab: string;
  highlights: string[];
}

interface UserProfile {
  name: string;
  role: string;
  plant: string;
  email: string;
  avatar: string;
}

interface QrTarget {
  type: 'product' | 'batch';
  id: string;
  name: string;
  batchId?: string;
  date?: string;
  status?: string;
}

interface AppContextType {
  // Authentication
  isAuthenticated: boolean;
  user: UserProfile;
  login: (email?: string, isDemo?: boolean, industry?: IndustryType) => void;
  logout: () => void;

  // Industry & Configuration
  currentIndustry: IndustryType;
  setIndustry: (industry: IndustryType) => void;
  industryConfig: typeof INDUSTRIES[IndustryType];

  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Datasets
  batches: Batch[];
  products: Product[];
  machines: Machine[];
  suppliers: Supplier[];
  rawMaterials: RawMaterial[];
  inspections: QualityInspection[];
  defects: Defect[];
  shipments: Shipment[];
  alerts: AlertNotification[];

  // Dataset Mutators & Loader
  setBatches: React.Dispatch<React.SetStateAction<Batch[]>>;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setMachines: React.Dispatch<React.SetStateAction<Machine[]>>;
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
  setRawMaterials: React.Dispatch<React.SetStateAction<RawMaterial[]>>;
  setInspections: React.Dispatch<React.SetStateAction<QualityInspection[]>>;
  setDefects: React.Dispatch<React.SetStateAction<Defect[]>>;
  setShipments: React.Dispatch<React.SetStateAction<Shipment[]>>;
  loadDataset: (target: DatasetTarget, rows: any[], mode: 'append' | 'replace') => { success: boolean; count: number; message: string };
  resetDatasetsToDefault: () => void;

  // Selections for cross-module flows
  selectedBatchId: string;
  setSelectedBatchId: (id: string) => void;
  selectedProductId: string;
  setSelectedProductId: (id: string) => void;
  selectedMachineId: string;
  setSelectedMachineId: (id: string) => void;
  selectedSupplierId: string;
  setSelectedSupplierId: (id: string) => void;
  selectedRawMaterialId: string;
  setSelectedRawMaterialId: (id: string) => void;

  // Global modals & flyouts
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  isQrModalOpen: boolean;
  setIsQrModalOpen: (open: boolean) => void;
  isPassportModalOpen: boolean;
  setIsPassportModalOpen: (open: boolean) => void;
  qrTarget: QrTarget | null;
  openQrModal: (target: QrTarget) => void;
  closeQrModal: () => void;

  // AI Copilot & Productivity Modals
  isCopilotOpen: boolean;
  setIsCopilotOpen: (open: boolean) => void;
  isScenarioModalOpen: boolean;
  setIsScenarioModalOpen: (open: boolean) => void;
  isExportDossierOpen: boolean;
  setIsExportDossierOpen: (open: boolean) => void;
  isShortcutsOpen: boolean;
  setIsShortcutsOpen: (open: boolean) => void;
  applyPresetScenario: (scenarioId: string) => void;

  // Interactive Toast Notifications
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, 'id'>) => string;
  removeToast: (id: string) => void;

  // Alerts management
  markAlertRead: (id: string) => void;
  markAllAlertsRead: () => void;

  // Audio & Live Telemetry Stream
  isAudioEnabled: boolean;
  isSoundEnabled: boolean;
  toggleAudio: () => boolean;
  toggleSound: () => boolean;
  isLiveTelemetryActive: boolean;
  toggleLiveTelemetry: () => void;
  telemetryJitter: number; // dynamically updated tick offset

  // Guided Expo Demo Tour (17 steps)
  isDemoTourActive: boolean;
  demoTourStep: number;
  startDemoTour: () => void;
  nextDemoTourStep: () => void;
  prevDemoTourStep: () => void;
  exitDemoTour: () => void;
  goToDemoTourStep: (step: number) => void;

  // Quick action helpers
  triggerRcaForBatch: (batchId: string) => void;
  triggerReverseTraceForMaterial: (materialId: string) => void;
  triggerImpactAnalysisForMachine: (machineId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'thermal-defect',
    title: 'Critical Thermal Drift & Defect Spike',
    category: 'critical',
    badge: 'URGENT RCA',
    description: 'Machine M04 sustained 182°C for 35m during Batch B-1042 resulting in +8.4% micro-surface defect rate.',
    targetBatchId: 'B-1042',
    targetProductId: 'PRD-10021',
    targetMachineId: 'M04',
    targetRawMaterialId: 'RM-7821',
    targetTab: 'rca',
    highlights: ['42% Thermal correlation', '486 Units Quarantined', '$42,500 Risk']
  },
  {
    id: 'material-contamination',
    title: 'Upstream Raw Material Hardness Variance',
    category: 'warning',
    badge: 'REVERSE TRACE',
    description: 'Incoming Alloy lot RM-7821 from Global Materials Ltd exhibits +3.8% hardness drift affecting 3 production batches.',
    targetBatchId: 'B-1043',
    targetProductId: 'PRD-10023',
    targetMachineId: 'M04',
    targetRawMaterialId: 'RM-7821',
    targetTab: 'reverse-trace',
    highlights: ['Supplier SUP-001 audit', '3 batches downstream', '7 customer shipments']
  },
  {
    id: 'vibration-maintenance',
    title: 'Predictive Spindle Vibration Early Warning',
    category: 'predictive',
    badge: 'PREDICTIVE SPC',
    description: 'Machine M04 harmonic vibration reached 3.4 mm/s RMS. Digital twin simulation recommends speed derate.',
    targetBatchId: 'B-1042',
    targetProductId: 'PRD-10021',
    targetMachineId: 'M04',
    targetRawMaterialId: 'RM-7821',
    targetTab: 'simulator',
    highlights: ['Run What-If process simulation', 'Bearing lubrication required', 'Avoid unplanned downtime']
  },
  {
    id: 'clean-compliance',
    title: 'Zero-Defect EU Digital Product Passport',
    category: 'success',
    badge: 'CERTIFIED DPP',
    description: 'Batch B-1039 completed 99.4% FPY with 100% blockchain-anchored traceability and tamper-evident QR code.',
    targetBatchId: 'B-1039',
    targetProductId: 'PRD-10022',
    targetMachineId: 'M02',
    targetRawMaterialId: 'RM-7820',
    targetTab: 'passport',
    highlights: ['ISO 9001 certified', 'Zero defects', 'Instant QR Share']
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth state - default logged in for immediate showcase access, but login page is fully toggleable
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [user, setUser] = useState<UserProfile>({
    name: 'Dr. Marcus Vance',
    role: 'Principal QA & Plant Director',
    plant: 'Munich Smart Plant 04 (Precision Mobility)',
    email: 'm.vance@manutrace.internal',
    avatar: 'MV'
  });

  const [currentIndustry, setCurrentIndustry] = useState<IndustryType>('automotive');
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Core data with localStorage hydration
  const [batches, setBatches] = useState<Batch[]>(() => {
    try {
      const s = localStorage.getItem('manutrace_batches');
      return s ? JSON.parse(s) : INITIAL_BATCHES;
    } catch {
      return INITIAL_BATCHES;
    }
  });
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const s = localStorage.getItem('manutrace_products');
      return s ? JSON.parse(s) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });
  const [machines, setMachines] = useState<Machine[]>(() => {
    try {
      const s = localStorage.getItem('manutrace_machines');
      return s ? JSON.parse(s) : INITIAL_MACHINES;
    } catch {
      return INITIAL_MACHINES;
    }
  });
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    try {
      const s = localStorage.getItem('manutrace_suppliers');
      return s ? JSON.parse(s) : INITIAL_SUPPLIERS;
    } catch {
      return INITIAL_SUPPLIERS;
    }
  });
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>(() => {
    try {
      const s = localStorage.getItem('manutrace_rawMaterials');
      return s ? JSON.parse(s) : INITIAL_RAW_MATERIALS;
    } catch {
      return INITIAL_RAW_MATERIALS;
    }
  });
  const [inspections, setInspections] = useState<QualityInspection[]>(() => {
    try {
      const s = localStorage.getItem('manutrace_inspections');
      return s ? JSON.parse(s) : INITIAL_INSPECTIONS;
    } catch {
      return INITIAL_INSPECTIONS;
    }
  });
  const [defects, setDefects] = useState<Defect[]>(() => {
    try {
      const s = localStorage.getItem('manutrace_defects');
      return s ? JSON.parse(s) : INITIAL_DEFECTS;
    } catch {
      return INITIAL_DEFECTS;
    }
  });
  const [shipments, setShipments] = useState<Shipment[]>(() => {
    try {
      const s = localStorage.getItem('manutrace_shipments');
      return s ? JSON.parse(s) : INITIAL_SHIPMENTS;
    } catch {
      return INITIAL_SHIPMENTS;
    }
  });
  const [alerts, setAlerts] = useState<AlertNotification[]>(INITIAL_ALERTS);

  // Sync state to localStorage
  useEffect(() => {
    try { localStorage.setItem('manutrace_batches', JSON.stringify(batches)); } catch {}
  }, [batches]);
  useEffect(() => {
    try { localStorage.setItem('manutrace_products', JSON.stringify(products)); } catch {}
  }, [products]);
  useEffect(() => {
    try { localStorage.setItem('manutrace_machines', JSON.stringify(machines)); } catch {}
  }, [machines]);
  useEffect(() => {
    try { localStorage.setItem('manutrace_suppliers', JSON.stringify(suppliers)); } catch {}
  }, [suppliers]);
  useEffect(() => {
    try { localStorage.setItem('manutrace_rawMaterials', JSON.stringify(rawMaterials)); } catch {}
  }, [rawMaterials]);
  useEffect(() => {
    try { localStorage.setItem('manutrace_inspections', JSON.stringify(inspections)); } catch {}
  }, [inspections]);
  useEffect(() => {
    try { localStorage.setItem('manutrace_defects', JSON.stringify(defects)); } catch {}
  }, [defects]);
  useEffect(() => {
    try { localStorage.setItem('manutrace_shipments', JSON.stringify(shipments)); } catch {}
  }, [shipments]);

  // Cross-entity selections
  const [selectedBatchId, setSelectedBatchId] = useState<string>('B-1042');
  const [selectedProductId, setSelectedProductId] = useState<string>('PRD-10021');
  const [selectedMachineId, setSelectedMachineId] = useState<string>('M04');
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('SUP-001');
  const [selectedRawMaterialId, setSelectedRawMaterialId] = useState<string>('RM-7821');

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);
  const [isPassportModalOpen, setIsPassportModalOpen] = useState<boolean>(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState<boolean>(false);
  const [isExportDossierOpen, setIsExportDossierOpen] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (toast: Omit<ToastItem, 'id'>): string => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newToast: ToastItem = { ...toast, id, duration: toast.duration || 4000 };
    setToasts(prev => [newToast, ...prev.slice(0, 4)]);

    if (toast.type === 'error' || toast.type === 'warning') {
      sound.playAlert();
    } else {
      sound.playSuccess();
    }

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
    return id;
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const [qrTarget, setQrTarget] = useState<QrTarget | null>({
    type: 'product',
    id: 'PRD-10021',
    name: 'Brake Component Caliper Arm',
    batchId: 'B-1042',
    date: '22 Sep 2026',
    status: 'QUALITY VERIFIED'
  });

  // Guided Expo Demo Tour state (17 steps)
  const [isDemoTourActive, setIsDemoTourActive] = useState<boolean>(false);
  const [demoTourStep, setDemoTourStep] = useState<number>(1);

  // Audio and Live Telemetry Stream
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true);
  const [isLiveTelemetryActive, setIsLiveTelemetryActive] = useState<boolean>(true);
  const [telemetryJitter, setTelemetryJitter] = useState<number>(0);

  // Live industrial telemetry ticker
  useEffect(() => {
    if (!isLiveTelemetryActive) return;
    const interval = setInterval(() => {
      // subtle industrial jitter ±0.25
      const jitter = (Math.random() - 0.5) * 0.5;
      setTelemetryJitter(Number(jitter.toFixed(2)));
    }, 1200);
    return () => clearInterval(interval);
  }, [isLiveTelemetryActive]);

  const toggleAudio = () => {
    const next = !isAudioEnabled;
    setIsAudioEnabled(next);
    sound.setEnabled(next);
    return next;
  };

  const toggleLiveTelemetry = () => {
    setIsLiveTelemetryActive(prev => !prev);
  };

  // Preset Scenario Applier
  const applyPresetScenario = (scenarioId: string) => {
    const scenario = PRESET_SCENARIOS.find(s => s.id === scenarioId);
    if (!scenario) return;

    setSelectedBatchId(scenario.targetBatchId);
    setSelectedProductId(scenario.targetProductId);
    setSelectedMachineId(scenario.targetMachineId);
    setSelectedRawMaterialId(scenario.targetRawMaterialId);
    setActiveTab(scenario.targetTab);
    setIsScenarioModalOpen(false);

    showToast({
      type: scenario.category === 'critical' ? 'error' : scenario.category === 'warning' ? 'warning' : 'success',
      title: `Applied: ${scenario.title}`,
      message: `Focused on Batch ${scenario.targetBatchId} / Machine ${scenario.targetMachineId}.`,
      action: {
        label: 'View Passport',
        onClick: () => setActiveTab('passport')
      }
    });
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If typing in input or textarea, only allow ESC
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsCopilotOpen(false);
        setIsScenarioModalOpen(false);
        setIsExportDossierOpen(false);
        setIsShortcutsOpen(false);
        setIsQrModalOpen(false);
        setIsPassportModalOpen(false);
        setIsNotificationsOpen(false);
        return;
      }

      if (isInput) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      } else if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'j' || e.key === '/')) {
        e.preventDefault();
        setIsCopilotOpen(prev => !prev);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        if (isDemoTourActive) {
          exitDemoTour();
        } else {
          startDemoTour();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setIsExportDossierOpen(prev => !prev);
      } else if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setIsShortcutsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDemoTourActive]);

  const login = (email?: string, _isDemo: boolean = true, industry: IndustryType = 'automotive') => {
    setIsAuthenticated(true);
    setCurrentIndustry(industry);
    setUser({
      name: email && email.includes('@') ? email.split('@')[0] : 'Dr. Marcus Vance',
      role: 'Principal QA & Plant Director',
      plant: `${INDUSTRIES[industry].name} — Facility 01`,
      email: email || 'demo.director@manutrace.internal',
      avatar: 'MV'
    });
    setActiveTab('dashboard');
    showToast({
      type: 'info',
      title: 'Authenticated as Director',
      message: `Welcome to ManuTrace AI — ${INDUSTRIES[industry].name} Sector.`
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const openQrModal = (target: QrTarget) => {
    setQrTarget(target);
    setIsQrModalOpen(true);
  };

  const closeQrModal = () => {
    setIsQrModalOpen(false);
  };

  const markAlertRead = (id: string) => {
    setAlerts(prev => prev.map(a => (a.id === id ? { ...a, read: true } : a)));
  };

  const markAllAlertsRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
    showToast({
      type: 'success',
      title: 'Alerts Acknowledged',
      message: 'All notifications marked as read.'
    });
  };

  // Quick Action triggers
  const triggerRcaForBatch = (batchId: string) => {
    setSelectedBatchId(batchId);
    setActiveTab('rca');
  };

  const triggerReverseTraceForMaterial = (materialId: string) => {
    setSelectedRawMaterialId(materialId);
    setActiveTab('reverse-trace');
  };

  const triggerImpactAnalysisForMachine = (machineId: string) => {
    setSelectedMachineId(machineId);
    setActiveTab('impact');
  };

  // Demo Tour Steps definitions according to USER STORY:
  const startDemoTour = () => {
    setIsDemoTourActive(true);
    setDemoTourStep(1);
    setActiveTab('dashboard');
    showToast({
      type: 'info',
      title: '5-Minute Expo Story Tour Started',
      message: 'Use Next/Previous or step pips to navigate the full storyline.'
    });
  };

  const exitDemoTour = () => {
    setIsDemoTourActive(false);
  };

  const nextDemoTourStep = () => {
    if (demoTourStep < 17) {
      goToDemoTourStep(demoTourStep + 1);
    } else {
      setIsDemoTourActive(false);
      showToast({
        type: 'success',
        title: 'Expo Tour Completed!',
        message: 'All 17 industrial traceability milestones verified.'
      });
    }
  };

  const prevDemoTourStep = () => {
    if (demoTourStep > 1) {
      goToDemoTourStep(demoTourStep - 1);
    }
  };

  const goToDemoTourStep = (step: number) => {
    setDemoTourStep(step);
    // Route to the appropriate tab depending on step
    switch (step) {
      case 1:
      case 2:
      case 3:
        setActiveTab('dashboard');
        setSelectedBatchId('B-1042');
        break;
      case 4:
      case 5:
      case 6:
        setActiveTab('passport');
        setSelectedProductId('PRD-10021');
        setSelectedBatchId('B-1042');
        break;
      case 7:
      case 8:
        setActiveTab('rca');
        break;
      case 9:
      case 10:
        setActiveTab('reverse-trace');
        setSelectedRawMaterialId('RM-7821');
        break;
      case 11:
        setActiveTab('impact');
        setSelectedMachineId('M04');
        break;
      case 12:
      case 13:
      case 14:
      case 15:
        setActiveTab('simulator');
        break;
      case 16:
        openQrModal({
          type: 'product',
          id: 'PRD-10021',
          name: 'Brake Component Caliper Arm',
          batchId: 'B-1042',
          date: '22 Sep 2026',
          status: 'QUALITY VERIFIED'
        });
        break;
      case 17:
        setIsQrModalOpen(false);
        setActiveTab('analytics');
        break;
      default:
        break;
    }
  };

  const loadDataset = (target: DatasetTarget, rows: any[], mode: 'append' | 'replace') => {
    switch (target) {
      case 'batches':
        setBatches(prev => (mode === 'replace' ? rows : [...rows, ...prev]));
        break;
      case 'products':
        setProducts(prev => (mode === 'replace' ? rows : [...rows, ...prev]));
        break;
      case 'machines':
        setMachines(prev => (mode === 'replace' ? rows : [...rows, ...prev]));
        break;
      case 'suppliers':
        setSuppliers(prev => (mode === 'replace' ? rows : [...rows, ...prev]));
        break;
      case 'rawMaterials':
        setRawMaterials(prev => (mode === 'replace' ? rows : [...rows, ...prev]));
        break;
      case 'inspections':
        setInspections(prev => (mode === 'replace' ? rows : [...rows, ...prev]));
        break;
      case 'defects':
        setDefects(prev => (mode === 'replace' ? rows : [...rows, ...prev]));
        break;
      case 'shipments':
        setShipments(prev => (mode === 'replace' ? rows : [...rows, ...prev]));
        break;
    }
    const msg = `Successfully loaded ${rows.length} ${target} records into active memory (${mode} mode).`;
    showToast({
      type: 'success',
      title: 'Dataset Ingestion Complete',
      message: msg
    });
    return {
      success: true,
      count: rows.length,
      message: msg
    };
  };

  const resetDatasetsToDefault = () => {
    setBatches(INITIAL_BATCHES);
    setProducts(INITIAL_PRODUCTS);
    setMachines(INITIAL_MACHINES);
    setSuppliers(INITIAL_SUPPLIERS);
    setRawMaterials(INITIAL_RAW_MATERIALS);
    setInspections(INITIAL_INSPECTIONS);
    setDefects(INITIAL_DEFECTS);
    setShipments(INITIAL_SHIPMENTS);
    try {
      localStorage.removeItem('manutrace_batches');
      localStorage.removeItem('manutrace_products');
      localStorage.removeItem('manutrace_machines');
      localStorage.removeItem('manutrace_suppliers');
      localStorage.removeItem('manutrace_rawMaterials');
      localStorage.removeItem('manutrace_inspections');
      localStorage.removeItem('manutrace_defects');
      localStorage.removeItem('manutrace_shipments');
    } catch {}
    showToast({
      type: 'info',
      title: 'Datasets Restored',
      message: 'All factory records reverted to factory default baseline.'
    });
  };

  const industryConfig = INDUSTRIES[currentIndustry];

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        currentIndustry,
        setIndustry: setCurrentIndustry,
        industryConfig,
        activeTab,
        setActiveTab,
        batches,
        products,
        machines,
        suppliers,
        rawMaterials,
        inspections,
        defects,
        shipments,
        alerts,
        setBatches,
        setProducts,
        setMachines,
        setSuppliers,
        setRawMaterials,
        setInspections,
        setDefects,
        setShipments,
        loadDataset,
        resetDatasetsToDefault,
        selectedBatchId,
        setSelectedBatchId,
        selectedProductId,
        setSelectedProductId,
        selectedMachineId,
        setSelectedMachineId,
        selectedSupplierId,
        setSelectedSupplierId,
        selectedRawMaterialId,
        setSelectedRawMaterialId,
        isSearchOpen,
        setIsSearchOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        isQrModalOpen,
        setIsQrModalOpen,
        isPassportModalOpen,
        setIsPassportModalOpen,
        qrTarget,
        openQrModal,
        closeQrModal,
        isCopilotOpen,
        setIsCopilotOpen,
        isScenarioModalOpen,
        setIsScenarioModalOpen,
        isExportDossierOpen,
        setIsExportDossierOpen,
        isShortcutsOpen,
        setIsShortcutsOpen,
        applyPresetScenario,
        toasts,
        showToast,
        removeToast,
        markAlertRead,
        markAllAlertsRead,
        isAudioEnabled,
        isSoundEnabled: isAudioEnabled,
        toggleAudio,
        toggleSound: toggleAudio,
        isLiveTelemetryActive,
        toggleLiveTelemetry,
        telemetryJitter,
        isDemoTourActive,
        demoTourStep,
        startDemoTour,
        nextDemoTourStep,
        prevDemoTourStep,
        exitDemoTour,
        goToDemoTourStep,
        triggerRcaForBatch,
        triggerReverseTraceForMaterial,
        triggerImpactAnalysisForMachine
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
