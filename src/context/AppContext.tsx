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
  qrTarget: QrTarget | null;
  openQrModal: (target: QrTarget) => void;
  closeQrModal: () => void;

  // Alerts management
  markAlertRead: (id: string) => void;
  markAllAlertsRead: () => void;

  // Audio & Live Telemetry Stream
  isAudioEnabled: boolean;
  toggleAudio: () => boolean;
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

  // Core data
  const [batches] = useState<Batch[]>(INITIAL_BATCHES);
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [machines] = useState<Machine[]>(INITIAL_MACHINES);
  const [suppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [rawMaterials] = useState<RawMaterial[]>(INITIAL_RAW_MATERIALS);
  const [inspections] = useState<QualityInspection[]>(INITIAL_INSPECTIONS);
  const [defects] = useState<Defect[]>(INITIAL_DEFECTS);
  const [shipments] = useState<Shipment[]>(INITIAL_SHIPMENTS);
  const [alerts, setAlerts] = useState<AlertNotification[]>(INITIAL_ALERTS);

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
    return next;
  };

  const toggleLiveTelemetry = () => {
    setIsLiveTelemetryActive(prev => !prev);
  };

  // Keyboard shortcut for Global Search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
  // 1. Login -> 2. Dashboard -> 3. Select Batch B-1042 -> 4. Open Passport -> 5. Product History
  // 6. Machine Event -> 7. AI RCA -> 8. Contributing Factors -> 9. Reverse Trace -> 10. Affected Products
  // 11. Impact Analysis -> 12. Simulator -> 13. Change Temp -> 14. Run Simulation -> 15. Show Predicted Impact
  // 16. Generate Passport QR -> 17. Analytics
  const startDemoTour = () => {
    setIsDemoTourActive(true);
    setDemoTourStep(1);
    setActiveTab('dashboard');
  };

  const exitDemoTour = () => {
    setIsDemoTourActive(false);
  };

  const nextDemoTourStep = () => {
    if (demoTourStep < 17) {
      goToDemoTourStep(demoTourStep + 1);
    } else {
      setIsDemoTourActive(false);
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
        qrTarget,
        openQrModal,
        closeQrModal,
        markAlertRead,
        markAllAlertsRead,
        isAudioEnabled,
        toggleAudio,
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
