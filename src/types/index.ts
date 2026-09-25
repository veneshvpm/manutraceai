export type IndustryType = 'automotive' | 'electronics' | 'pharmaceutical' | 'food' | 'textile' | 'energy';

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

// ─────────────────────────────────────────────────────────────────────────────
// INDUSTRIAL SCADA & SMART MICROGRID EMS INTERFACES
// ─────────────────────────────────────────────────────────────────────────────

export interface ScadaTelemetry {
  Solar_Power: number; // kW
  Solar_Voltage: number; // V
  Solar_Current: number; // A
  Solar_Temperature: number; // °C
  Solar_Irradiance: number; // W/m²
  Wind_Power: number; // kW
  Wind_Speed: number; // m/s
  Wind_RPM: number; // RPM
  Wind_Pitch: number; // deg
  Battery_SOC: number; // %
  Battery_SOH: number; // %
  Battery_Voltage: number; // V
  Battery_Current: number; // A (positive=discharge, negative=charge)
  Battery_Temperature: number; // °C
  Battery_C_Rate: number; // C
  Battery_Cycles: number;
  Grid_Status: 1 | 0; // 1=Connected, 0=Islanded
  Grid_Voltage: number; // V
  Grid_Frequency: number; // Hz
  Grid_Power: number; // kW (positive=import, negative=export)
  Grid_PowerFactor: number;
  Load_Demand: number; // kW
  Load_Current: number; // A
  Load_Voltage: number; // V
  Inverter_Status: 'RUNNING' | 'STANDBY' | 'FAULT' | 'TRIPPED';
  Inverter_Efficiency: number; // %
  Inverter_Output_Power: number; // kW
  Inverter_Temp: number; // °C
  ems_action: 'STANDBY' | 'SOLAR_TO_LOAD' | 'WIND_TO_LOAD' | 'BATT_DISCHARGE' | 'BATT_CHARGE' | 'GRID_IMPORT' | 'GRID_EXPORT' | 'ISLANDED';
  electricity_cost: number; // $/kWh
  accumulated_savings: number; // $
  carbon_avoided_kg: number; // kg CO2
  timestamp: number;
  hour: number;
  ambient_temp: number;
  cloud_cover: number; // 0 to 1
  load_shedding_level: 0 | 1 | 2 | 3;
  original_load: number;
  active_failures: string[];
}

export interface ScadaAlarm {
  id: string;
  source: 'SOLAR' | 'WIND' | 'BATTERY' | 'INVERTER' | 'GRID' | 'LOAD' | 'EMS' | 'COMMUNICATION';
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'CLEARED' | 'REPAIRED';
  message: string;
  fault_code: string;
  timestamp: number;
  root_cause?: string;
  repair_actions?: string[];
  estimated_time?: string;
  safety_warning?: string;
  subsystem?: string;
}

export type ScadaProtocolType = 'modbus' | 'mqtt' | 'can' | 'opcua' | 'iec61850';

export interface ProtocolPacket {
  id: string;
  protocol: ScadaProtocolType;
  timestamp: string;
  source: string;
  destination: string;
  identifier: string; // Register / Topic / CAN-ID / NodeId / GOOSE AppID
  data: string; // Raw hex or formatted payload
  status: 'VALID' | 'WARNING' | 'ERROR' | 'CRC_OK';
}

export interface ModbusRegister {
  address: number;
  name: string;
  type: 'Holding Register' | 'Input Register' | 'Coil' | 'Discrete Input';
  value: string | number;
  unit: string;
  access: 'RO' | 'RW';
  description: string;
}

export interface CellTelemetry {
  cellId: number;
  voltage: number; // V (e.g. 3.250)
  temp: number; // °C (e.g. 26.4)
  balanceStatus: 'BALANCED' | 'BALANCING' | 'OVER_VOLT' | 'UNDER_VOLT';
}

// ─────────────────────────────────────────────────────────────────────────────
// HUMAN SECURITY & WORKER SAFETY (HSE / EHS) INTERFACES
// ─────────────────────────────────────────────────────────────────────────────

export interface WorkerSafetyProfile {
  id: string; // e.g. "WRK-104"
  name: string; // e.g. "Marcus Vance"
  role: string; // e.g. "Senior Electrical Technician"
  department: string; // e.g. "Substation & High-Voltage Maintenance"
  shift: 'MORNING' | 'AFTERNOON' | 'NIGHT';
  bloodGroup: string; // e.g. "O+"
  emergencyContact: string;
  smartBadgeId: string; // e.g. "RFID-8831-BLE"
  certifications: string[]; // e.g. ["NFPA 70E Arc Flash", "OSHA 30", "LOTO Level 3"]
  heartRate: number; // BPM (e.g. 74)
  bodyTemp: number; // °C (e.g. 36.8)
  fallStatus: 'NORMAL' | 'FALL_DETECTED' | 'MAN_DOWN' | 'IMMOBILE';
  fatigueIndex: number; // 0 to 100% (e.g. 18%)
  currentZone: string; // e.g. "Bay 02 - Inverter Room"
  ppeStatus: {
    helmet: boolean;
    vest: boolean;
    goggles: boolean;
    gloves: boolean;
    harness?: boolean;
  };
  sosActive: boolean;
  lastCheckInSecondsAgo: number;
}

export interface PpeCameraFeed {
  id: string; // e.g. "CAM-BAY-01"
  name: string; // e.g. "Main Assembly & Robotic Cell #03"
  zone: string;
  fps: number;
  resolution: string;
  activeWorkers: number;
  helmetCompliancePct: number;
  vestCompliancePct: number;
  gogglesCompliancePct: number;
  overallScore: number;
  violationsCount: number;
  streamStatus: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  detections: {
    personId: string;
    personName: string;
    box: { x: number; y: number; width: number; height: number };
    helmet: { detected: boolean; confidence: number };
    vest: { detected: boolean; confidence: number };
    goggles: { detected: boolean; confidence: number };
    gloves: { detected: boolean; confidence: number };
    status: 'COMPLIANT' | 'VIOLATION' | 'WARNING';
    violationLabel?: string;
  }[];
}

export interface LotoPermit {
  id: string; // e.g. "LOTO-2026-089"
  equipmentId: string; // e.g. "M04 - 5-Axis CNC Milling"
  equipmentName: string;
  location: string; // e.g. "Machining Hall A"
  isolationType: 'ELECTRICAL_415V' | 'HYDRAULIC_200BAR' | 'PNEUMATIC_8BAR' | 'CHEMICAL_LINE';
  lockoutTagId: string; // e.g. "PADLOCK-RED-4401"
  technicianId: string;
  technicianName: string;
  supervisorSignOff: string;
  zeroEnergyVerified: boolean; // 0.0V / 0.0 bar verified
  status: 'TAGGED_LOCKED' | 'MAINTENANCE_IN_PROGRESS' | 'TESTING' | 'REMOVED_CLEARED';
  lockedAt: string;
  expectedCompletion: string;
  residualEnergyDissipated: boolean;
  notes: string;
}

export interface SafetyGeofenceZone {
  id: string; // e.g. "ZONE-HV-11KV"
  name: string; // e.g. "11kV Substation Switchyard"
  riskTier: 'CRITICAL_HIGH_VOLTAGE' | 'ROBOTIC_ENCLOSURE' | 'CHEMICAL_STORAGE' | 'CONFINED_SPACE' | 'CRANE_RADIUS';
  maxOccupancy: number;
  currentOccupants: string[];
  interlockRelayArmed: boolean;
  intrusionAlarm: boolean;
  eStopTriggered: boolean;
  requiredCertifications: string[];
  ambientHazards: string;
}

export interface EnvironmentalGasSensor {
  id: string;
  location: string;
  o2Percent: number; // Normal 20.9%
  coPpm: number; // Carbon Monoxide (OSHA limit 50 ppm)
  h2sPpm: number; // Hydrogen Sulfide (OSHA limit 10 ppm)
  sf6Ppm: number; // SF6 Gas Leak (Substation limit 1000 ppm)
  combustibleLelPct: number; // Lower Explosive Limit % (Limit < 10%)
  ambientTempC: number;
  humidityPct: number;
  noiseDecibels: number; // dB (OSHA 85 dB TWA)
  wbgtHeatIndexC: number; // Wet Bulb Globe Temp
  status: 'SAFE' | 'WARNING' | 'CRITICAL_EVACUATE';
  lastCalibrated: string;
}

export interface MusterStation {
  id: string; // e.g. "MUSTER-A"
  name: string; // e.g. "Assembly Point Alpha (North Field)"
  capacity: number;
  checkedInCount: number;
  missingCount: number;
  checkedInPersonnel: string[];
  status: 'STANDBY' | 'DRILL_ACTIVE' | 'EMERGENCY_EVACUATION';
}

export interface SafetyIncidentLog {
  id: string; // e.g. "INC-2026-014"
  type: 'NEAR_MISS' | 'FIRST_AID' | 'LOST_TIME_INJURY' | 'EQUIPMENT_BREACH' | 'HAZMAT_EXPOSURE';
  timestamp: string;
  location: string;
  involvedPerson: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  oshaRecordable: boolean;
  rootCause: string;
  correctiveActionCapa: string;
  status: 'OPEN' | 'INVESTIGATING' | 'CAPA_ASSIGNED' | 'RESOLVED_CLOSED';
  investigator: string;
}


