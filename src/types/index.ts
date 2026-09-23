export type IndustryType = 'automotive' | 'electronics' | 'pharmaceutical' | 'food' | 'textile';

export interface IndustryConfig {
  id: IndustryType;
  name: string;
  tagline: string;
  terminology: {
    productLabel: string;
    batchLabel: string;
    materialLabel: string;
    unitLabel: string;
    processLabel: string;
  };
  sampleFocus: string;
}

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type QualityStatus = 'passed' | 'failed' | 'rework' | 'scrapped' | 'pending';
export type MachineStatus = 'running' | 'idle' | 'warning' | 'maintenance';

export interface TelemetryData {
  temperature: number; // e.g. °C
  pressure: number;    // e.g. bar
  processingTime: number; // minutes
  vibration?: number;  // mm/s
  machineSpeed?: number; // RPM or units/min
  humidity?: number;   // %
}

export interface Product {
  id: string;          // e.g. PRD-10021
  name: string;        // e.g. Brake Component
  category: string;
  industry: IndustryType;
  batchId: string;     // e.g. B-1042
  manufacturingDate: string;
  productionLine: string; // e.g. Line 04
  qualityStatus: QualityStatus;
  riskLevel: RiskLevel;
  traceability: number; // e.g. 100%
  serialNumber?: string;
  certification: string;
  warrantyStatus: string;
}

export interface Batch {
  id: string;          // e.g. B-1042
  productId: string;
  productName: string;
  industry: IndustryType;
  productionLine: string;
  manufacturingDate: string;
  quantity: number;
  qualityStatus: QualityStatus;
  riskLevel: RiskLevel;
  passRate: number;    // e.g. 96.8
  defectRate: number;  // e.g. 3.2
  traceabilityCoverage: number; // e.g. 98.4
  operatorId: string;  // e.g. OP-17
  machineId: string;   // e.g. M04
  rawMaterialBatchId: string; // e.g. RM-7821
  telemetry: TelemetryData;
  anomalyDetected: boolean;
  anomalyNotes?: string;
}

export interface RawMaterial {
  id: string;          // e.g. RM-7821
  name: string;        // e.g. High-Tensile Steel Alloy 4140
  industry: IndustryType;
  supplierId: string;  // e.g. SUP-001
  supplierName: string;// e.g. Global Materials Ltd.
  batchNumber: string;
  receivedDate: string;
  expiryDate?: string;
  qualityGrade: string;
  status: 'approved' | 'quarantined' | 'investigating' | 'rejected';
  riskLevel: RiskLevel;
  purityScore: number;
  notes?: string;
}

export interface Supplier {
  id: string;          // e.g. SUP-001
  name: string;        // e.g. Global Materials Ltd.
  material: string;    // e.g. Steel & Alloy Castings
  industry: IndustryType;
  qualityScore: number;// e.g. 94%
  defectRate: number;  // e.g. 1.8%
  activeBatches: number;// e.g. 12
  risk: RiskLevel;     // e.g. Low
  location: string;
  certification: string;
  complianceDate: string;
  contactEmail: string;
}

export interface Machine {
  id: string;          // e.g. M04
  name: string;        // e.g. 5-Axis CNC Milling Center
  type: string;
  line: string;        // e.g. Line 04
  industry: IndustryType;
  status: MachineStatus;
  utilization: number; // e.g. 82%
  lastMaintenance: string; // e.g. 18 Sep 2026
  nextMaintenance: string;
  risk: RiskLevel;
  operatingHours: number;
  associatedDefects: number;
  telemetry: TelemetryData;
}

export interface QualityInspection {
  id: string;
  batchId: string;
  productId: string;
  inspectorId: string;
  stage: string;
  result: QualityStatus;
  defectsFound: number;
  defectCategory?: DefectCategory;
  timestamp: string;
  sampleSize: number;
  toleranceVariance: string;
  notes: string;
}

export type DefectCategory = 
  | 'Dimension' 
  | 'Surface' 
  | 'Material' 
  | 'Assembly' 
  | 'Temperature' 
  | 'Packaging' 
  | 'Other';

export interface Defect {
  id: string;
  batchId: string;
  productId: string;
  category: DefectCategory;
  severity: RiskLevel;
  description: string;
  detectedAtStage: string;
  machineId: string;
  timestamp: string;
  resolved: boolean;
}

export interface Shipment {
  id: string;          // e.g. SHP-22091
  batchId: string;
  destination: string;
  quantity: number;
  dispatchDate: string;
  deliveryStatus: 'in_transit' | 'delivered' | 'quarantined' | 'scheduled';
  carrier: string;
  customerName: string;
  complianceVerified: boolean;
}

export interface AlertNotification {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp: string;
  entityId: string;
  entityType: 'batch' | 'machine' | 'supplier' | 'line' | 'material';
  read: boolean;
}

export interface PassportStage {
  id: string;
  label: string;
  code: string;
  iconName: string;
  status: 'passed' | 'warning' | 'failed' | 'verified';
  timestamp: string;
  operator: string;
  location: string;
  metrics: Record<string, string | number>;
  parameters: Record<string, string | number>;
  verified: boolean;
}

export interface RcaFactor {
  factor: string;
  percentage: number;
  description: string;
  confidence: number;
  telemetryEvidence: string;
}

export interface WhatIfSimulationParams {
  temperature: number;
  pressure: number;
  processingTime: number;
  machineSpeed: number;
  supplierId: string;
  productionLine: string;
}

export interface SimulationResult {
  current: {
    qualityRisk: number;
    defectRisk: number;
    energyConsumption: number;
    yieldRate: number;
    cycleTime: number;
  };
  simulated: {
    qualityRisk: number;
    defectRisk: number;
    energyConsumption: number;
    yieldRate: number;
    cycleTime: number;
  };
  deltas: {
    qualityRiskDelta: number;
    defectRiskDelta: number;
    energyDelta: number;
    yieldDelta: number;
    cycleTimeDelta: number;
  };
  riskRating: RiskLevel;
  recommendations: string[];
}
