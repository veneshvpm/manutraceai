import {
  Product,
  Batch,
  RawMaterial,
  Supplier,
  Machine,
  QualityInspection,
  Defect,
  Shipment,
  AlertNotification,
  PassportStage
} from '../types';

// ==========================================
// 8 INDUSTRIAL SUPPLIERS
// ==========================================
export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'SUP-001',
    name: 'Global Materials Ltd.',
    material: 'Steel & High-Tensile Alloys (4140, 316L)',
    industry: 'automotive',
    qualityScore: 94,
    defectRate: 1.8,
    activeBatches: 12,
    risk: 'low',
    location: 'Munich, Germany',
    certification: 'IATF 16949 / ISO 9001:2015',
    complianceDate: '2026-08-15',
    contactEmail: 'qa@globalmaterials.com'
  },
  {
    id: 'SUP-002',
    name: 'Apex Precision Castings',
    material: 'Die-cast Aluminum Housings & Flanges',
    industry: 'automotive',
    qualityScore: 91,
    defectRate: 2.4,
    activeBatches: 8,
    risk: 'low',
    location: 'Detroit, USA',
    certification: 'ISO 9001 / ISO 14001',
    complianceDate: '2026-07-20',
    contactEmail: 'orders@apexcastings.com'
  },
  {
    id: 'SUP-003',
    name: 'Titanium Dynamics Corp.',
    material: 'Grade 5 Titanium & Aerospace Billets',
    industry: 'automotive',
    qualityScore: 83,
    defectRate: 4.6,
    activeBatches: 6,
    risk: 'medium',
    location: 'Osaka, Japan',
    certification: 'AS9100D / ISO 9001',
    complianceDate: '2026-06-11',
    contactEmail: 'spec@titaniumdynamics.jp'
  },
  {
    id: 'SUP-004',
    name: 'Silicon NanoTech Foundry',
    material: 'Gallium Nitride (GaN) & Silicon Wafers',
    industry: 'electronics',
    qualityScore: 98,
    defectRate: 0.6,
    activeBatches: 18,
    risk: 'low',
    location: 'Hsinchu, Taiwan',
    certification: 'ISO 9001 / Sony Green Partner',
    complianceDate: '2026-09-01',
    contactEmail: 'yield@siliconnanotech.com'
  },
  {
    id: 'SUP-005',
    name: 'PureBio API Synthetics',
    material: 'Active Pharmaceutical Ingredients & Lyophilized Excipients',
    industry: 'pharmaceutical',
    qualityScore: 97,
    defectRate: 0.4,
    activeBatches: 9,
    risk: 'low',
    location: 'Basel, Switzerland',
    certification: 'cGMP / FDA 21 CFR Part 210',
    complianceDate: '2026-08-30',
    contactEmail: 'compliance@purebio.ch'
  },
  {
    id: 'SUP-006',
    name: 'AgriHarvest Certified Organics',
    material: 'Non-GMO Fruit Puree & Cold-Pressed Concentrate',
    industry: 'food',
    qualityScore: 93,
    defectRate: 1.9,
    activeBatches: 14,
    risk: 'low',
    location: 'Bologna, Italy',
    certification: 'BRCGS / FSMA / HACCP',
    complianceDate: '2026-08-10',
    contactEmail: 'audit@agriharvest.eu'
  },
  {
    id: 'SUP-007',
    name: 'Nordic Polymer & Resins',
    material: 'Thermal Elastomer & Seal Polymers',
    industry: 'automotive',
    qualityScore: 79,
    defectRate: 5.2,
    activeBatches: 5,
    risk: 'high',
    location: 'Gothenburg, Sweden',
    certification: 'ISO 9001:2015',
    complianceDate: '2026-05-19',
    contactEmail: 'techsupport@nordicresins.se'
  },
  {
    id: 'SUP-008',
    name: 'Vanguard Technical Yarn Ltd.',
    material: 'Aramid Fibers & High-Tenacity Polyethylene',
    industry: 'textile',
    qualityScore: 95,
    defectRate: 1.2,
    activeBatches: 11,
    risk: 'low',
    location: 'Manchester, UK',
    certification: 'OEKO-TEX 100 / ISO 9001',
    complianceDate: '2026-07-29',
    contactEmail: 'qa@vanguardfibers.co.uk'
  },
  {
    id: 'SUP-009',
    name: 'Apex CleanTech Cell Systems',
    material: 'LFP Lithium Iron Phosphate 3.2V 100Ah Cells & Monocrystalline Silicon',
    industry: 'energy',
    qualityScore: 98,
    defectRate: 0.5,
    activeBatches: 16,
    risk: 'low',
    location: 'Munich, Germany',
    certification: 'IEC 62619 / UL 9540A / UN 38.3',
    complianceDate: '2026-09-15',
    contactEmail: 'bms-qa@apexcleantech.de'
  }
];

// ==========================================
// 15 RAW MATERIAL BATCHES
// ==========================================
export const INITIAL_RAW_MATERIALS: RawMaterial[] = [
  {
    id: 'RM-7821',
    name: 'High-Tensile Steel Alloy 4140',
    industry: 'automotive',
    supplierId: 'SUP-001',
    supplierName: 'Global Materials Ltd.',
    batchNumber: 'LOT-2026-09-A4140',
    receivedDate: '2026-09-10',
    expiryDate: '2028-09-10',
    qualityGrade: 'Grade A+ (Certified)',
    status: 'investigating',
    riskLevel: 'medium',
    purityScore: 98.4,
    notes: 'Alerted: Trace thermal variation observed during induction forging.'
  },
  {
    id: 'RM-7822',
    name: 'Die-Cast Aluminum A380 Ingot',
    industry: 'automotive',
    supplierId: 'SUP-002',
    supplierName: 'Apex Precision Castings',
    batchNumber: 'LOT-2026-08-AL380',
    receivedDate: '2026-09-12',
    qualityGrade: 'Grade A',
    status: 'approved',
    riskLevel: 'low',
    purityScore: 99.1
  },
  {
    id: 'RM-7823',
    name: 'Titanium Ti-6Al-4V Billets',
    industry: 'automotive',
    supplierId: 'SUP-003',
    supplierName: 'Titanium Dynamics Corp.',
    batchNumber: 'LOT-2026-07-TI64',
    receivedDate: '2026-09-05',
    qualityGrade: 'Grade B (Acceptable)',
    status: 'approved',
    riskLevel: 'medium',
    purityScore: 96.7
  },
  {
    id: 'RM-7824',
    name: 'Ceramic Composite Brake Pad Liners',
    industry: 'automotive',
    supplierId: 'SUP-001',
    supplierName: 'Global Materials Ltd.',
    batchNumber: 'LOT-2026-09-CC01',
    receivedDate: '2026-09-14',
    qualityGrade: 'Grade A+',
    status: 'approved',
    riskLevel: 'low',
    purityScore: 99.5
  },
  {
    id: 'RM-7825',
    name: 'Synthetic Fluoroelastomer O-Rings',
    industry: 'automotive',
    supplierId: 'SUP-007',
    supplierName: 'Nordic Polymer & Resins',
    batchNumber: 'LOT-2026-09-FKM-09',
    receivedDate: '2026-09-11',
    qualityGrade: 'Grade C (Borderline)',
    status: 'quarantined',
    riskLevel: 'high',
    purityScore: 91.2,
    notes: 'Durometer hardness variance exceeds ±4 Shore A.'
  },
  {
    id: 'RM-7826',
    name: 'Gallium Nitride 200mm Wafer Ingot',
    industry: 'electronics',
    supplierId: 'SUP-004',
    supplierName: 'Silicon NanoTech Foundry',
    batchNumber: 'LOT-2026-E-GAN200',
    receivedDate: '2026-09-15',
    qualityGrade: 'Ultra Pure (99.9999%)',
    status: 'approved',
    riskLevel: 'low',
    purityScore: 99.99
  },
  {
    id: 'RM-7827',
    name: 'Lead-Free SAC305 Solder Paste',
    industry: 'electronics',
    supplierId: 'SUP-004',
    supplierName: 'Silicon NanoTech Foundry',
    batchNumber: 'LOT-2026-E-SAC305',
    receivedDate: '2026-09-16',
    qualityGrade: 'Grade A (Type 4 Powder)',
    status: 'approved',
    riskLevel: 'low',
    purityScore: 99.2
  },
  {
    id: 'RM-7828',
    name: 'Active Paracetamol API Micronized',
    industry: 'pharmaceutical',
    supplierId: 'SUP-005',
    supplierName: 'PureBio API Synthetics',
    batchNumber: 'LOT-2026-P-API01',
    receivedDate: '2026-09-13',
    qualityGrade: 'USP/EP Pharmacopeia',
    status: 'approved',
    riskLevel: 'low',
    purityScore: 99.8
  },
  {
    id: 'RM-7829',
    name: 'Sterile Water for Injection (WFI)',
    industry: 'pharmaceutical',
    supplierId: 'SUP-005',
    supplierName: 'PureBio API Synthetics',
    batchNumber: 'LOT-2026-P-WFI12',
    receivedDate: '2026-09-18',
    qualityGrade: 'USP Pyrogen-Free',
    status: 'approved',
    riskLevel: 'low',
    purityScore: 100.0
  },
  {
    id: 'RM-7830',
    name: 'Organic Strawberry Concentrate 65 Brix',
    industry: 'food',
    supplierId: 'SUP-006',
    supplierName: 'AgriHarvest Certified Organics',
    batchNumber: 'LOT-2026-F-STR65',
    receivedDate: '2026-09-17',
    qualityGrade: 'USDA Organic / HACCP Verified',
    status: 'approved',
    riskLevel: 'low',
    purityScore: 99.0
  },
  {
    id: 'RM-7831',
    name: 'Food-Grade Pectin Stabilizer',
    industry: 'food',
    supplierId: 'SUP-006',
    supplierName: 'AgriHarvest Certified Organics',
    batchNumber: 'LOT-2026-F-PEC04',
    receivedDate: '2026-09-14',
    qualityGrade: 'Grade A',
    status: 'approved',
    riskLevel: 'low',
    purityScore: 98.7
  },
  {
    id: 'RM-7832',
    name: 'High-Tenacity Cordura Nylon 500D',
    industry: 'textile',
    supplierId: 'SUP-008',
    supplierName: 'Vanguard Technical Yarn Ltd.',
    batchNumber: 'LOT-2026-T-NY500',
    receivedDate: '2026-09-12',
    qualityGrade: 'Mil-Spec Grade 1',
    status: 'approved',
    riskLevel: 'low',
    purityScore: 99.3
  },
  {
    id: 'RM-7833',
    name: 'Waterproof Breathable ePTFE Membrane',
    industry: 'textile',
    supplierId: 'SUP-008',
    supplierName: 'Vanguard Technical Yarn Ltd.',
    batchNumber: 'LOT-2026-T-PTFE',
    receivedDate: '2026-09-09',
    qualityGrade: 'Grade A',
    status: 'approved',
    riskLevel: 'low',
    purityScore: 98.9
  },
  {
    id: 'RM-7834',
    name: 'Graphite Lubricant Coated Shims',
    industry: 'automotive',
    supplierId: 'SUP-001',
    supplierName: 'Global Materials Ltd.',
    batchNumber: 'LOT-2026-09-GL02',
    receivedDate: '2026-09-16',
    qualityGrade: 'Grade A',
    status: 'approved',
    riskLevel: 'low',
    purityScore: 98.5
  },
  {
    id: 'RM-7835',
    name: 'Electroless Nickel Plating Bath Chemical',
    industry: 'automotive',
    supplierId: 'SUP-007',
    supplierName: 'Nordic Polymer & Resins',
    batchNumber: 'LOT-2026-09-NI77',
    receivedDate: '2026-09-08',
    qualityGrade: 'Grade B+',
    status: 'approved',
    riskLevel: 'medium',
    purityScore: 95.8
  },
  {
    id: 'RM-7836',
    name: 'Lithium Iron Phosphate (LFP) 100Ah Pouch Cells',
    industry: 'energy',
    supplierId: 'SUP-009',
    supplierName: 'Apex CleanTech Cell Systems',
    batchNumber: 'LOT-2026-ENG-LFP01',
    receivedDate: '2026-09-18',
    qualityGrade: 'Automotive Grade A+ (99.98%)',
    status: 'approved',
    riskLevel: 'low',
    purityScore: 99.8
  },
  {
    id: 'RM-7837',
    name: 'M10 N-Type TOPCon Silicon Solar Cells',
    industry: 'energy',
    supplierId: 'SUP-009',
    supplierName: 'Apex CleanTech Cell Systems',
    batchNumber: 'LOT-2026-ENG-PV04',
    receivedDate: '2026-09-19',
    qualityGrade: 'Tier-1 24.5% Efficiency',
    status: 'approved',
    riskLevel: 'low',
    purityScore: 99.5
  }
];

// ==========================================
// 6 INDUSTRIAL MACHINES
// ==========================================
export const INITIAL_MACHINES: Machine[] = [
  {
    id: 'M04',
    name: '5-Axis CNC Milling Center',
    type: 'High-Speed CNC Subtractive Machining',
    line: 'Line 04',
    industry: 'automotive',
    status: 'warning',
    utilization: 82,
    lastMaintenance: '18 Sep 2026',
    nextMaintenance: '25 Sep 2026',
    risk: 'medium',
    operatingHours: 4120,
    associatedDefects: 14,
    telemetry: {
      temperature: 182, // Abnormal temperature pattern!
      pressure: 5.1,
      processingTime: 20.4,
      vibration: 3.4,
      machineSpeed: 1420
    }
  },
  {
    id: 'M01',
    name: 'Hydraulic Press & Forging Cell',
    type: '1200-Ton Forging Press',
    line: 'Line 01',
    industry: 'automotive',
    status: 'running',
    utilization: 94,
    lastMaintenance: '12 Sep 2026',
    nextMaintenance: '02 Oct 2026',
    risk: 'low',
    operatingHours: 6840,
    associatedDefects: 3,
    telemetry: {
      temperature: 176,
      pressure: 5.0,
      processingTime: 17.5,
      vibration: 1.8,
      machineSpeed: 1100
    }
  },
  {
    id: 'M02',
    name: 'Precision Surface Grinder & Polisher',
    type: 'Rotary Table Surface Grinding',
    line: 'Line 02',
    industry: 'automotive',
    status: 'running',
    utilization: 79,
    lastMaintenance: '14 Sep 2026',
    nextMaintenance: '28 Sep 2026',
    risk: 'low',
    operatingHours: 3210,
    associatedDefects: 2,
    telemetry: {
      temperature: 178,
      pressure: 4.8,
      processingTime: 18.2,
      vibration: 2.1,
      machineSpeed: 1180
    }
  },
  {
    id: 'M03',
    name: 'Automated Induction Heat Treat Chamber',
    type: 'Quench & Temper Thermal Reactor',
    line: 'Line 03',
    industry: 'automotive',
    status: 'running',
    utilization: 88,
    lastMaintenance: '10 Sep 2026',
    nextMaintenance: '24 Sep 2026',
    risk: 'low',
    operatingHours: 5190,
    associatedDefects: 5,
    telemetry: {
      temperature: 180,
      pressure: 5.0,
      processingTime: 18.0,
      vibration: 1.5,
      machineSpeed: 1200
    }
  },
  {
    id: 'M05',
    name: 'SMT Pick-and-Place Robotic Arm Array',
    type: 'High-Precision Electronic Component Mounting',
    line: 'Line 05',
    industry: 'electronics',
    status: 'running',
    utilization: 91,
    lastMaintenance: '16 Sep 2026',
    nextMaintenance: '06 Oct 2026',
    risk: 'low',
    operatingHours: 2980,
    associatedDefects: 1,
    telemetry: {
      temperature: 42,
      pressure: 6.2,
      processingTime: 12.1,
      vibration: 0.9,
      machineSpeed: 3200
    }
  },
  {
    id: 'M06',
    name: 'Aseptic Autoclave & Lyophilizer Unit',
    type: 'Continuous Sterilization & Freeze-Drying Chamber',
    line: 'Line 06',
    industry: 'pharmaceutical',
    status: 'maintenance',
    utilization: 0,
    lastMaintenance: '21 Sep 2026',
    nextMaintenance: '22 Sep 2026',
    risk: 'medium',
    operatingHours: 4900,
    associatedDefects: 4,
    telemetry: {
      temperature: 121,
      pressure: 2.2,
      processingTime: 45.0,
      vibration: 0.4,
      machineSpeed: 600
    }
  },
  {
    id: 'M07',
    name: 'Apex Microgrid Master SCADA Gateway',
    type: 'Embedded RTU & Industrial Protocol Gateway',
    line: 'Substation Bay 01',
    industry: 'energy',
    status: 'running',
    utilization: 96,
    lastMaintenance: '20 Sep 2026',
    nextMaintenance: '20 Oct 2026',
    risk: 'low',
    operatingHours: 8760,
    associatedDefects: 0,
    telemetry: {
      temperature: 34,
      pressure: 1.0,
      processingTime: 0.1,
      vibration: 0.1,
      machineSpeed: 50
    }
  },
  {
    id: 'M08',
    name: 'PCS 3-Phase Inverter Converter Bay',
    type: '100kW IGBT Bidirectional PCS Inverter',
    line: 'PCS Inverter 01',
    industry: 'energy',
    status: 'running',
    utilization: 92,
    lastMaintenance: '15 Sep 2026',
    nextMaintenance: '15 Oct 2026',
    risk: 'low',
    operatingHours: 5420,
    associatedDefects: 1,
    telemetry: {
      temperature: 44,
      pressure: 1.0,
      processingTime: 1.0,
      vibration: 0.2,
      machineSpeed: 50
    }
  }
];

// ==========================================
// 10 PRODUCTION BATCHES
// ==========================================
export const INITIAL_BATCHES: Batch[] = [
  {
    id: 'B-1042',
    productId: 'PRD-10021',
    productName: 'Brake Component Caliper Arm',
    industry: 'automotive',
    productionLine: 'Line 04',
    manufacturingDate: '22 Sep 2026',
    quantity: 486,
    qualityStatus: 'passed',
    riskLevel: 'medium',
    passRate: 96.8,
    defectRate: 3.2,
    traceabilityCoverage: 100.0,
    operatorId: 'OP-17',
    machineId: 'M04',
    rawMaterialBatchId: 'RM-7821',
    telemetry: {
      temperature: 182,
      pressure: 5.1,
      processingTime: 20.4,
      vibration: 3.4,
      machineSpeed: 1420
    },
    anomalyDetected: true,
    anomalyNotes: 'Abnormal temperature pattern (182°C vs nominal 180°C) sustained for 35 min on M04.'
  },
  {
    id: 'B-1043',
    productId: 'PRD-10022',
    productName: 'Ventilated Disc Rotor 340mm',
    industry: 'automotive',
    productionLine: 'Line 04',
    manufacturingDate: '22 Sep 2026',
    quantity: 320,
    qualityStatus: 'passed',
    riskLevel: 'medium',
    passRate: 95.4,
    defectRate: 4.6,
    traceabilityCoverage: 98.8,
    operatorId: 'OP-17',
    machineId: 'M04',
    rawMaterialBatchId: 'RM-7821',
    telemetry: {
      temperature: 183,
      pressure: 5.2,
      processingTime: 21.0,
      vibration: 3.6,
      machineSpeed: 1410
    },
    anomalyDetected: true,
    anomalyNotes: 'Thermal spillover from prior run on Machine M04.'
  },
  {
    id: 'B-1044',
    productId: 'PRD-10023',
    productName: 'EV Power Inverter Enclosure',
    industry: 'automotive',
    productionLine: 'Line 01',
    manufacturingDate: '21 Sep 2026',
    quantity: 600,
    qualityStatus: 'passed',
    riskLevel: 'low',
    passRate: 99.2,
    defectRate: 0.8,
    traceabilityCoverage: 99.5,
    operatorId: 'OP-04',
    machineId: 'M01',
    rawMaterialBatchId: 'RM-7822',
    telemetry: {
      temperature: 176,
      pressure: 5.0,
      processingTime: 17.5,
      vibration: 1.7,
      machineSpeed: 1100
    },
    anomalyDetected: false
  },
  {
    id: 'B-1045',
    productId: 'PRD-10024',
    productName: 'ABS Master Cylinder Body',
    industry: 'automotive',
    productionLine: 'Line 04',
    manufacturingDate: '20 Sep 2026',
    quantity: 280,
    qualityStatus: 'passed',
    riskLevel: 'high',
    passRate: 92.1,
    defectRate: 7.9,
    traceabilityCoverage: 97.5,
    operatorId: 'OP-22',
    machineId: 'M04',
    rawMaterialBatchId: 'RM-7821',
    telemetry: {
      temperature: 185,
      pressure: 5.3,
      processingTime: 22.4,
      vibration: 4.1,
      machineSpeed: 1450
    },
    anomalyDetected: true,
    anomalyNotes: 'Defect rate spike (+8.4%) associated with M04 spindle vibration and thermal creep.'
  },
  {
    id: 'B-1046',
    productId: 'PRD-10025',
    productName: 'Steering Column Tie Rod End',
    industry: 'automotive',
    productionLine: 'Line 03',
    manufacturingDate: '20 Sep 2026',
    quantity: 850,
    qualityStatus: 'passed',
    riskLevel: 'low',
    passRate: 98.7,
    defectRate: 1.3,
    traceabilityCoverage: 99.0,
    operatorId: 'OP-09',
    machineId: 'M03',
    rawMaterialBatchId: 'RM-7824',
    telemetry: {
      temperature: 180,
      pressure: 5.0,
      processingTime: 18.0,
      vibration: 1.6,
      machineSpeed: 1200
    },
    anomalyDetected: false
  },
  {
    id: 'B-1047',
    productId: 'PRD-10026',
    productName: 'Microcontroller ECU Motherboard',
    industry: 'electronics',
    productionLine: 'Line 05',
    manufacturingDate: '22 Sep 2026',
    quantity: 1200,
    qualityStatus: 'passed',
    riskLevel: 'low',
    passRate: 99.4,
    defectRate: 0.6,
    traceabilityCoverage: 100.0,
    operatorId: 'OP-31',
    machineId: 'M05',
    rawMaterialBatchId: 'RM-7826',
    telemetry: {
      temperature: 42,
      pressure: 6.2,
      processingTime: 12.1,
      vibration: 0.8,
      machineSpeed: 3200
    },
    anomalyDetected: false
  },
  {
    id: 'B-1048',
    productId: 'PRD-10027',
    productName: 'Li-Ion Battery Management Controller',
    industry: 'electronics',
    productionLine: 'Line 05',
    manufacturingDate: '21 Sep 2026',
    quantity: 950,
    qualityStatus: 'passed',
    riskLevel: 'low',
    passRate: 98.9,
    defectRate: 1.1,
    traceabilityCoverage: 99.1,
    operatorId: 'OP-31',
    machineId: 'M05',
    rawMaterialBatchId: 'RM-7827',
    telemetry: {
      temperature: 44,
      pressure: 6.1,
      processingTime: 12.5,
      vibration: 0.9,
      machineSpeed: 3180
    },
    anomalyDetected: false
  },
  {
    id: 'B-1049',
    productId: 'PRD-10028',
    productName: 'Sterile Antibiotic Infusion Vial 50ml',
    industry: 'pharmaceutical',
    productionLine: 'Line 06',
    manufacturingDate: '19 Sep 2026',
    quantity: 5000,
    qualityStatus: 'passed',
    riskLevel: 'low',
    passRate: 99.8,
    defectRate: 0.2,
    traceabilityCoverage: 100.0,
    operatorId: 'OP-12',
    machineId: 'M06',
    rawMaterialBatchId: 'RM-7828',
    telemetry: {
      temperature: 121,
      pressure: 2.2,
      processingTime: 45.0,
      vibration: 0.3,
      machineSpeed: 600
    },
    anomalyDetected: false
  },
  {
    id: 'B-1050',
    productId: 'PRD-10029',
    productName: 'Organic Strawberry Fruit Spread 350g',
    industry: 'food',
    productionLine: 'Line 02',
    manufacturingDate: '21 Sep 2026',
    quantity: 4200,
    qualityStatus: 'passed',
    riskLevel: 'low',
    passRate: 97.9,
    defectRate: 2.1,
    traceabilityCoverage: 98.6,
    operatorId: 'OP-08',
    machineId: 'M02',
    rawMaterialBatchId: 'RM-7830',
    telemetry: {
      temperature: 88,
      pressure: 1.2,
      processingTime: 32.0,
      vibration: 0.7,
      machineSpeed: 850
    },
    anomalyDetected: false
  },
  {
    id: 'B-1051',
    productId: 'PRD-10030',
    productName: 'Ripstop Tactical Fabric Weave 500D',
    industry: 'textile',
    productionLine: 'Line 03',
    manufacturingDate: '22 Sep 2026',
    quantity: 3500,
    qualityStatus: 'passed',
    riskLevel: 'low',
    passRate: 98.2,
    defectRate: 1.8,
    traceabilityCoverage: 99.3,
    operatorId: 'OP-14',
    machineId: 'M03',
    rawMaterialBatchId: 'RM-7832',
    telemetry: {
      temperature: 140,
      pressure: 3.5,
      processingTime: 25.0,
      vibration: 1.2,
      machineSpeed: 950
    },
    anomalyDetected: false
  },
  {
    id: 'B-1052',
    productId: 'PRD-10041',
    productName: 'BESS 100kWh Industrial Lithium Storage Rack',
    industry: 'energy',
    productionLine: 'Substation Bay 01',
    manufacturingDate: '23 Sep 2026',
    quantity: 12,
    qualityStatus: 'passed',
    riskLevel: 'low',
    passRate: 99.8,
    defectRate: 0.2,
    traceabilityCoverage: 100,
    operatorId: 'OP-01 (Lead SCADA Eng)',
    machineId: 'M07',
    rawMaterialBatchId: 'RM-7836',
    telemetry: {
      temperature: 27,
      pressure: 1.0,
      processingTime: 120.0,
      vibration: 0.1,
      machineSpeed: 50
    },
    anomalyDetected: false
  },
  {
    id: 'B-1053',
    productId: 'PRD-10042',
    productName: '35kW Bifacial Monocrystalline Solar Array Block',
    industry: 'energy',
    productionLine: 'Substation Bay 01',
    manufacturingDate: '23 Sep 2026',
    quantity: 80,
    qualityStatus: 'passed',
    riskLevel: 'low',
    passRate: 99.5,
    defectRate: 0.5,
    traceabilityCoverage: 100,
    operatorId: 'OP-02 (Solar Tech)',
    machineId: 'M08',
    rawMaterialBatchId: 'RM-7837',
    telemetry: {
      temperature: 38,
      pressure: 1.0,
      processingTime: 60.0,
      vibration: 0.1,
      machineSpeed: 50
    },
    anomalyDetected: false
  }
];

// ==========================================
// 20 MANUFACTURED PRODUCTS
// ==========================================
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'PRD-10021',
    name: 'Brake Component Caliper Arm',
    category: 'Chassis & Braking Systems',
    industry: 'automotive',
    batchId: 'B-1042',
    manufacturingDate: '22 Sep 2026',
    productionLine: 'Line 04',
    qualityStatus: 'passed',
    riskLevel: 'medium',
    traceability: 100,
    serialNumber: 'SN-2026-BC-00421',
    certification: 'ISO 26262 ASIL-D Compliant',
    warrantyStatus: 'Standard 5-Yr / 100,000 km'
  },
  {
    id: 'PRD-10022',
    name: 'Ventilated Disc Rotor 340mm',
    category: 'Chassis & Braking Systems',
    industry: 'automotive',
    batchId: 'B-1043',
    manufacturingDate: '22 Sep 2026',
    productionLine: 'Line 04',
    qualityStatus: 'passed',
    riskLevel: 'medium',
    traceability: 99,
    serialNumber: 'SN-2026-VR-09122',
    certification: 'ECE R90 Certified',
    warrantyStatus: '3-Yr / 60,000 km'
  },
  {
    id: 'PRD-10023',
    name: 'EV Power Inverter Enclosure',
    category: 'Electric Powertrain',
    industry: 'automotive',
    batchId: 'B-1044',
    manufacturingDate: '21 Sep 2026',
    productionLine: 'Line 01',
    qualityStatus: 'passed',
    riskLevel: 'low',
    traceability: 100,
    serialNumber: 'SN-2026-EV-77103',
    certification: 'IP67 / UL94-V0',
    warrantyStatus: '8-Yr / 160,000 km'
  },
  {
    id: 'PRD-10024',
    name: 'ABS Master Cylinder Body',
    category: 'Hydraulic Actuation',
    industry: 'automotive',
    batchId: 'B-1045',
    manufacturingDate: '20 Sep 2026',
    productionLine: 'Line 04',
    qualityStatus: 'passed',
    riskLevel: 'high',
    traceability: 98,
    serialNumber: 'SN-2026-MC-33104',
    certification: 'DOT 4 / SAE J1703',
    warrantyStatus: '5-Yr / 100,000 km'
  },
  {
    id: 'PRD-10025',
    name: 'Steering Column Tie Rod End',
    category: 'Steering & Suspension',
    industry: 'automotive',
    batchId: 'B-1046',
    manufacturingDate: '20 Sep 2026',
    productionLine: 'Line 03',
    qualityStatus: 'passed',
    riskLevel: 'low',
    traceability: 99,
    serialNumber: 'SN-2026-TR-88125',
    certification: 'ISO/TS 16949',
    warrantyStatus: '5-Yr OEM Grade'
  },
  {
    id: 'PRD-10026',
    name: 'Microcontroller ECU Motherboard',
    category: 'Automotive Electronics',
    industry: 'electronics',
    batchId: 'B-1047',
    manufacturingDate: '22 Sep 2026',
    productionLine: 'Line 05',
    qualityStatus: 'passed',
    riskLevel: 'low',
    traceability: 100,
    serialNumber: 'SN-2026-EC-90126',
    certification: 'AEC-Q100 Qualified',
    warrantyStatus: 'Standard Commercial'
  },
  {
    id: 'PRD-10027',
    name: 'Li-Ion Battery Management Controller',
    category: 'Energy Storage Systems',
    industry: 'electronics',
    batchId: 'B-1048',
    manufacturingDate: '21 Sep 2026',
    productionLine: 'Line 05',
    qualityStatus: 'passed',
    riskLevel: 'low',
    traceability: 99,
    serialNumber: 'SN-2026-BM-44127',
    certification: 'UN 38.3 / IEC 62133',
    warrantyStatus: '10-Yr Battery Pack'
  },
  {
    id: 'PRD-10028',
    name: 'Sterile Antibiotic Infusion Vial 50ml',
    category: 'Sterile Injectables',
    industry: 'pharmaceutical',
    batchId: 'B-1049',
    manufacturingDate: '19 Sep 2026',
    productionLine: 'Line 06',
    qualityStatus: 'passed',
    riskLevel: 'low',
    traceability: 100,
    serialNumber: 'SN-2026-PH-11028',
    certification: 'WHO-GMP / FDA Approved',
    warrantyStatus: 'Expires Sep 2028'
  },
  {
    id: 'PRD-10029',
    name: 'Organic Strawberry Fruit Spread 350g',
    category: 'Preserved Spreads',
    industry: 'food',
    batchId: 'B-1050',
    manufacturingDate: '21 Sep 2026',
    productionLine: 'Line 02',
    qualityStatus: 'passed',
    riskLevel: 'low',
    traceability: 99,
    serialNumber: 'SN-2026-FD-55129',
    certification: 'USDA Organic / Non-GMO',
    warrantyStatus: 'Best Before Sep 2027'
  },
  {
    id: 'PRD-10030',
    name: 'Ripstop Tactical Fabric Weave 500D',
    category: 'Protective Materials',
    industry: 'textile',
    batchId: 'B-1051',
    manufacturingDate: '22 Sep 2026',
    productionLine: 'Line 03',
    qualityStatus: 'passed',
    riskLevel: 'low',
    traceability: 99,
    serialNumber: 'SN-2026-TX-66130',
    certification: 'EN 343 / ISO 13934',
    warrantyStatus: '5-Yr Durability Guarantee'
  },
  {
    id: 'PRD-10031',
    name: 'Dual-Mass Flywheel Hub Assembly',
    category: 'Drivetrain',
    industry: 'automotive',
    batchId: 'B-1042',
    manufacturingDate: '22 Sep 2026',
    productionLine: 'Line 04',
    qualityStatus: 'passed',
    riskLevel: 'medium',
    traceability: 100,
    serialNumber: 'SN-2026-FW-22131',
    certification: 'OEM Tier-1 Certified',
    warrantyStatus: '4-Yr / 80,000 km'
  },
  {
    id: 'PRD-10032',
    name: 'Radar Radome Antenna Sub-Module',
    category: 'ADAS Sensors',
    industry: 'electronics',
    batchId: 'B-1047',
    manufacturingDate: '22 Sep 2026',
    productionLine: 'Line 05',
    qualityStatus: 'passed',
    riskLevel: 'low',
    traceability: 100,
    serialNumber: 'SN-2026-RA-77132',
    certification: 'FCC Part 15 / CE RED',
    warrantyStatus: '3-Yr ADAS Module'
  },
  {
    id: 'PRD-10033',
    name: 'Lyophilized Vaccine Diluent Syringe',
    category: 'Bio-Therapeutics',
    industry: 'pharmaceutical',
    batchId: 'B-1049',
    manufacturingDate: '19 Sep 2026',
    productionLine: 'Line 06',
    qualityStatus: 'passed',
    riskLevel: 'low',
    traceability: 100,
    serialNumber: 'SN-2026-VA-99133',
    certification: 'EMA / FDA Biologics License',
    warrantyStatus: 'Cold-Chain 2-8°C Verified'
  },
  {
    id: 'PRD-10034',
    name: 'Cold-Pressed Extra Virgin Olive Oil 500ml',
    category: 'Culinary Oils',
    industry: 'food',
    batchId: 'B-1050',
    manufacturingDate: '21 Sep 2026',
    productionLine: 'Line 02',
    qualityStatus: 'passed',
    riskLevel: 'low',
    traceability: 98,
    serialNumber: 'SN-2026-OL-33134',
    certification: 'PDO Protected Designation',
    warrantyStatus: 'Best Before Dec 2027'
  },
  {
    id: 'PRD-10035',
    name: 'Ballistic Carbon-Aramid Plate',
    category: 'Armor & Defense Tech',
    industry: 'textile',
    batchId: 'B-1051',
    manufacturingDate: '22 Sep 2026',
    productionLine: 'Line 03',
    qualityStatus: 'passed',
    riskLevel: 'low',
    traceability: 100,
    serialNumber: 'SN-2026-AR-00135',
    certification: 'NIJ Level III-A',
    warrantyStatus: '10-Yr Shelf Life'
  },
  {
    id: 'PRD-10036',
    name: 'Precision Planetary Gear Carrier',
    category: 'Transmission Gears',
    industry: 'automotive',
    batchId: 'B-1044',
    manufacturingDate: '21 Sep 2026',
    productionLine: 'Line 01',
    qualityStatus: 'passed',
    riskLevel: 'low',
    traceability: 99,
    serialNumber: 'SN-2026-PG-44136',
    certification: 'DIN 3962 Class 6',
    warrantyStatus: '100,000 km Warranty'
  },
  {
    id: 'PRD-10037',
    name: 'Turbocharger Compressor Wheel',
    category: 'Forced Induction',
    industry: 'automotive',
    batchId: 'B-1043',
    manufacturingDate: '22 Sep 2026',
    productionLine: 'Line 04',
    qualityStatus: 'passed',
    riskLevel: 'medium',
    traceability: 99,
    serialNumber: 'SN-2026-TC-88137',
    certification: 'High-Stress Dynamic Balance',
    warrantyStatus: '3-Yr Unlimited Mileage'
  },
  {
    id: 'PRD-10038',
    name: 'RF Bluetooth LE Gateway Chipset',
    category: 'IoT Connectivity',
    industry: 'electronics',
    batchId: 'B-1048',
    manufacturingDate: '21 Sep 2026',
    productionLine: 'Line 05',
    qualityStatus: 'passed',
    riskLevel: 'low',
    traceability: 100,
    serialNumber: 'SN-2026-RF-22138',
    certification: 'Bluetooth SIG v5.4 Qualified',
    warrantyStatus: 'Standard 2-Yr'
  },
  {
    id: 'PRD-10039',
    name: 'Oral Suspension Liquid Bottle 100ml',
    category: 'Pediatric Formulations',
    industry: 'pharmaceutical',
    batchId: 'B-1049',
    manufacturingDate: '19 Sep 2026',
    productionLine: 'Line 06',
    qualityStatus: 'passed',
    riskLevel: 'low',
    traceability: 100,
    serialNumber: 'SN-2026-OS-55139',
    certification: 'USP Dissolution Standard',
    warrantyStatus: '36 Months Shelf Life'
  },
  {
    id: 'PRD-10040',
    name: 'Thermal Heat-Shield Engine Blanket',
    category: 'Thermal Insulation',
    industry: 'textile',
    batchId: 'B-1051',
    manufacturingDate: '22 Sep 2026',
    productionLine: 'Line 03',
    qualityStatus: 'passed',
    riskLevel: 'low',
    traceability: 99,
    serialNumber: 'SN-2026-TB-99140',
    certification: 'UL 94-5VA / Continuous 1000°C',
    warrantyStatus: '5-Yr Replacement Warranty'
  },
  {
    id: 'PRD-10041',
    name: 'BESS 100kWh Industrial Lithium Storage Rack',
    category: 'Energy Storage Systems',
    industry: 'energy',
    batchId: 'B-1052',
    manufacturingDate: '23 Sep 2026',
    productionLine: 'Substation Bay 01',
    qualityStatus: 'passed',
    riskLevel: 'low',
    traceability: 100,
    serialNumber: 'SN-2026-BESS-100K-01',
    certification: 'IEC 62619 / UL 9540A / UN 38.3',
    warrantyStatus: '15-Yr / 6000 Cycle Guarantee'
  },
  {
    id: 'PRD-10042',
    name: '35kW Bifacial Monocrystalline Solar Array Block',
    category: 'Solar Power Generation',
    industry: 'energy',
    batchId: 'B-1053',
    manufacturingDate: '23 Sep 2026',
    productionLine: 'Substation Bay 01',
    qualityStatus: 'passed',
    riskLevel: 'low',
    traceability: 100,
    serialNumber: 'SN-2026-PV-35KW-04',
    certification: 'IEC 61215 / IEC 61730 Tier-1',
    warrantyStatus: '25-Yr 85% Linear Yield Warranty'
  }
];

// ==========================================
// QUALITY INSPECTIONS
// ==========================================
export const INITIAL_INSPECTIONS: QualityInspection[] = [
  {
    id: 'INS-901',
    batchId: 'B-1042',
    productId: 'PRD-10021',
    inspectorId: 'QC-Lead Dave Miller',
    stage: 'CNC Dimension & Bore Inspection',
    result: 'passed',
    defectsFound: 2,
    defectCategory: 'Dimension',
    timestamp: '2026-09-22 10:45:00',
    sampleSize: 50,
    toleranceVariance: '+0.012 mm (Within ±0.025 mm)',
    notes: 'Micro-chatter observed on bore flank, within safety specification.'
  },
  {
    id: 'INS-902',
    batchId: 'B-1042',
    productId: 'PRD-10021',
    inspectorId: 'Automated CMM Scanner #2',
    stage: 'Final Surface Finish & Hardness',
    result: 'passed',
    defectsFound: 1,
    defectCategory: 'Surface',
    timestamp: '2026-09-22 11:30:00',
    sampleSize: 100,
    toleranceVariance: 'Ra 0.8 µm (Target Ra 0.6-0.9 µm)',
    notes: 'Approved for protective anti-corrosion coating.'
  },
  {
    id: 'INS-903',
    batchId: 'B-1045',
    productId: 'PRD-10024',
    inspectorId: 'QC-Lead Dave Miller',
    stage: 'Hydraulic Burst Pressure Test',
    result: 'failed',
    defectsFound: 8,
    defectCategory: 'Material',
    timestamp: '2026-09-20 15:20:00',
    sampleSize: 30,
    toleranceVariance: 'Leakage at 220 bar (Min spec 280 bar)',
    notes: 'Sub-lot quarantined due to thermal micro-cracking in casting.'
  },
  {
    id: 'INS-904',
    batchId: 'B-1044',
    productId: 'PRD-10023',
    inspectorId: 'Inspector Elena Rostova',
    stage: 'Helium Leak Detection Test',
    result: 'passed',
    defectsFound: 0,
    defectCategory: 'Packaging',
    timestamp: '2026-09-21 09:10:00',
    sampleSize: 75,
    toleranceVariance: '< 1x10^-6 mbar l/s',
    notes: 'Perfect hermetic seal verification.'
  },
  {
    id: 'INS-905',
    batchId: 'B-1047',
    productId: 'PRD-10026',
    inspectorId: 'Automated Optical Inspection AOI-4',
    stage: 'SMT Solder Joint & Coplanarity',
    result: 'passed',
    defectsFound: 1,
    defectCategory: 'Assembly',
    timestamp: '2026-09-22 08:30:00',
    sampleSize: 200,
    toleranceVariance: 'Bridging risk: Zero detected',
    notes: 'All BGA balls 100% coplanar.'
  }
];

// ==========================================
// DEFECTS
// ==========================================
export const INITIAL_DEFECTS: Defect[] = [
  {
    id: 'DEF-101',
    batchId: 'B-1042',
    productId: 'PRD-10021',
    category: 'Temperature',
    severity: 'medium',
    description: 'Thermal expansion anomaly caused transient +0.015mm bore elongation on 2 units.',
    detectedAtStage: 'CNC Finishing',
    machineId: 'M04',
    timestamp: '2026-09-22 10:15',
    resolved: true
  },
  {
    id: 'DEF-102',
    batchId: 'B-1045',
    productId: 'PRD-10024',
    category: 'Material',
    severity: 'critical',
    description: 'Micro-fissure porosity detected under hydraulic pressure proof testing.',
    detectedAtStage: 'Pressure Testing Cell',
    machineId: 'M04',
    timestamp: '2026-09-20 14:40',
    resolved: false
  },
  {
    id: 'DEF-103',
    batchId: 'B-1043',
    productId: 'PRD-10022',
    category: 'Surface',
    severity: 'low',
    description: 'Tooling chatter marks Ra 1.2 µm on outer flange circumference.',
    detectedAtStage: 'Visual Inspection',
    machineId: 'M04',
    timestamp: '2026-09-22 12:00',
    resolved: true
  },
  {
    id: 'DEF-104',
    batchId: 'B-1045',
    productId: 'PRD-10024',
    category: 'Dimension',
    severity: 'high',
    description: 'Bore concentricity deviated by 32 microns from centerline axis.',
    detectedAtStage: 'CMM Automated Probe',
    machineId: 'M04',
    timestamp: '2026-09-20 16:10',
    resolved: false
  },
  {
    id: 'DEF-105',
    batchId: 'B-1048',
    productId: 'PRD-10027',
    category: 'Assembly',
    severity: 'low',
    description: 'Minor flux residue near ground capacitor pads C14-C18.',
    detectedAtStage: 'De-flux Wash Station',
    machineId: 'M05',
    timestamp: '2026-09-21 14:00',
    resolved: true
  }
];

// ==========================================
// SHIPMENTS
// ==========================================
export const INITIAL_SHIPMENTS: Shipment[] = [
  {
    id: 'SHP-22091',
    batchId: 'B-1042',
    destination: 'Stuttgart Assembly Plant (Bavaria Auto)',
    quantity: 240,
    dispatchDate: '2026-09-22',
    deliveryStatus: 'in_transit',
    carrier: 'DHL Industrial Freight Logistics',
    customerName: 'Bavaria Motor Works OEM',
    complianceVerified: true
  },
  {
    id: 'SHP-22092',
    batchId: 'B-1042',
    destination: 'Tier-1 Brake Subassembly Hub (Turin, Italy)',
    quantity: 246,
    dispatchDate: '2026-09-23',
    deliveryStatus: 'scheduled',
    carrier: 'Kuehne+Nagel Intermodal',
    customerName: 'Brembo Powertrain Solutions',
    complianceVerified: true
  },
  {
    id: 'SHP-22093',
    batchId: 'B-1044',
    destination: 'Tesla Gigafactory Berlin Distribution',
    quantity: 600,
    dispatchDate: '2026-09-21',
    deliveryStatus: 'delivered',
    carrier: 'Schenker Direct Express',
    customerName: 'Tesla Gigafactory Logistics',
    complianceVerified: true
  },
  {
    id: 'SHP-22094',
    batchId: 'B-1045',
    destination: 'Detroit Central Warehouse (HOLD NOTICE)',
    quantity: 280,
    dispatchDate: '2026-09-20',
    deliveryStatus: 'quarantined',
    carrier: 'FedEx Custom Critical',
    customerName: 'North American Brake Systems',
    complianceVerified: false
  },
  {
    id: 'SHP-22095',
    batchId: 'B-1047',
    destination: 'Foxconn SMT Assembly Campus (Shenzhen)',
    quantity: 1200,
    dispatchDate: '2026-09-22',
    deliveryStatus: 'in_transit',
    carrier: 'Air Cargo Express',
    customerName: 'Foxconn Electronics Industrial',
    complianceVerified: true
  },
  {
    id: 'SHP-22096',
    batchId: 'B-1049',
    destination: 'Novartis Central Cold Distribution (Basel)',
    quantity: 5000,
    dispatchDate: '2026-09-20',
    deliveryStatus: 'delivered',
    carrier: 'World Courier Life Sciences',
    customerName: 'Novartis Pharma AG',
    complianceVerified: true
  },
  {
    id: 'SHP-22097',
    batchId: 'B-1050',
    destination: 'Carrefour Distribution Logistics (Lyon)',
    quantity: 4200,
    dispatchDate: '2026-09-22',
    deliveryStatus: 'in_transit',
    carrier: 'STEF Cold Chain Solutions',
    customerName: 'Carrefour Group International',
    complianceVerified: true
  }
];

// ==========================================
// LIVE ALERTS
// ==========================================
export const INITIAL_ALERTS: AlertNotification[] = [
  {
    id: 'ALT-301',
    severity: 'critical',
    title: 'Abnormal Temperature Pattern Detected',
    description: 'Batch B-1042 shows abnormal temperature pattern (182°C vs 180°C setpoint) for 35 min on Machine M04.',
    timestamp: '12 mins ago',
    entityId: 'B-1042',
    entityType: 'batch',
    read: false
  },
  {
    id: 'ALT-302',
    severity: 'warning',
    title: 'Supplier Material Quality Deviations',
    description: 'Supplier RM-7821 (Global Materials Ltd.) has hardness quality deviations of +3.8% in recent shipment.',
    timestamp: '42 mins ago',
    entityId: 'RM-7821',
    entityType: 'material',
    read: false
  },
  {
    id: 'ALT-303',
    severity: 'info',
    title: 'Predictive Maintenance Recommended',
    description: 'Machine M04 spindle vibration index reached 3.4 mm/s; bearing lubrication cycle recommended.',
    timestamp: '2 hours ago',
    entityId: 'M04',
    entityType: 'machine',
    read: false
  },
  {
    id: 'ALT-304',
    severity: 'warning',
    title: 'Line 04 Defect Probability Alert',
    description: 'AI defect prediction engine forecasted a 76% defect probability spike if feed rate is maintained.',
    timestamp: '3 hours ago',
    entityId: 'Line 04',
    entityType: 'line',
    read: true
  }
];

// ==========================================
// PASSPORT STAGES (PRD-10021 / Batch B-1042)
// ==========================================
export const SAMPLE_PASSPORT_STAGES: PassportStage[] = [
  {
    id: 'stage-1',
    label: 'RAW MATERIAL',
    code: 'STAGE-01-MAT',
    iconName: 'Boxes',
    status: 'passed',
    timestamp: '10 Sep 2026 08:30',
    operator: 'Inbound Logistics QA',
    location: 'Warehouse Receiving Dock A',
    verified: true,
    metrics: {
      'Material Batch': 'RM-7821',
      'Material Name': 'High-Tensile Steel 4140',
      'Purity Assay': '98.4%',
      'Tensile Strength': '950 MPa'
    },
    parameters: {
      'Spectrometer Scan': 'Verified ASTM A29',
      'Moisture Content': '0.01%',
      'Storage Temp': '21.4°C'
    }
  },
  {
    id: 'stage-2',
    label: 'SUPPLIER',
    code: 'STAGE-02-SUP',
    iconName: 'Building2',
    status: 'passed',
    timestamp: '10 Sep 2026 09:15',
    operator: 'Supplier Quality Lead',
    location: 'Global Materials Ltd. (Munich)',
    verified: true,
    metrics: {
      'Supplier ID': 'SUP-001',
      'Supplier Name': 'Global Materials Ltd.',
      'Quality Rating': '94%',
      'IATF Certificate': 'IATF-16949-GER-2024'
    },
    parameters: {
      'Certificate of Analysis': 'CoA-88219-OK',
      'Audit Score': '96 / 100',
      'Defect Rate': '1.8%'
    }
  },
  {
    id: 'stage-3',
    label: 'MACHINE',
    code: 'STAGE-03-MAC',
    iconName: 'Cpu',
    status: 'warning',
    timestamp: '22 Sep 2026 09:40',
    operator: 'Telemetry Edge Daemon v4',
    location: 'Production Line 04 - Station 2',
    verified: true,
    metrics: {
      'Machine ID': 'M04',
      'Machine Name': '5-Axis CNC Milling Center',
      'Spindle Speed': '1,420 RPM',
      'Vibration Index': '3.4 mm/s (Elevated)'
    },
    parameters: {
      'Tool Wear Index': '68%',
      'Coolant Pressure': '4.8 bar',
      'PLC Firmware': 'v8.4.1-RT'
    }
  },
  {
    id: 'stage-4',
    label: 'PRODUCTION',
    code: 'STAGE-04-PRD',
    iconName: 'Factory',
    status: 'passed',
    timestamp: '22 Sep 2026 10:20',
    operator: 'OP-17 (Senior CNC Operator)',
    location: 'Machining Cell Line 04',
    verified: true,
    metrics: {
      'Batch ID': 'B-1042',
      'Chamber Temperature': '182°C',
      'Hydraulic Pressure': '5.1 bar',
      'Processing Time': '20.4 min'
    },
    parameters: {
      'Nominal Target Temp': '180°C',
      'Nominal Target Time': '18.0 min',
      'Feed Rate': '350 mm/min'
    }
  },
  {
    id: 'stage-5',
    label: 'QUALITY INSPECTION',
    code: 'STAGE-05-QCI',
    iconName: 'CheckCircle2',
    status: 'passed',
    timestamp: '22 Sep 2026 11:30',
    operator: 'QC Inspector Dave Miller',
    location: 'Metrology Lab Station Q-04',
    verified: true,
    metrics: {
      'Inspection Result': 'Passed (100% CMM)',
      'Defects Count': 0,
      'Bore Concentricity': '±0.012 mm',
      'Surface Finish': 'Ra 0.8 µm'
    },
    parameters: {
      'Inspection Record': 'INS-901 / INS-902',
      'Hardness Rockwell': '48 HRC',
      'Eddy Current Scan': 'No Subsurface Voids'
    }
  },
  {
    id: 'stage-6',
    label: 'PACKAGING',
    code: 'STAGE-06-PKG',
    iconName: 'PackageCheck',
    status: 'passed',
    timestamp: '22 Sep 2026 13:00',
    operator: 'Automated Desiccant Pack Line 3',
    location: 'Cleanroom Packaging Terminal',
    verified: true,
    metrics: {
      'Packaging Status': 'Verified & Sealed',
      'Corrosion Inhibitor': 'VCI Barrier Film',
      'Barcode Serial': 'SN-2026-BC-00421',
      'RFID Tag': 'EPC-96-A01B42'
    },
    parameters: {
      'Weight Variance': '±0.2%',
      'Carton Strength': 'ECT 44 Double Wall',
      'Tamper Seal': 'Tamper-Evident Foil'
    }
  },
  {
    id: 'stage-7',
    label: 'SHIPMENT',
    code: 'STAGE-07-SHP',
    iconName: 'Truck',
    status: 'passed',
    timestamp: '22 Sep 2026 14:15',
    operator: 'Outbound Logistics Carrier',
    location: 'Logistics Dock 03',
    verified: true,
    metrics: {
      'Shipment ID': 'SHP-22091',
      'Carrier': 'DHL Industrial Freight',
      'Destination': 'Stuttgart Assembly Plant (Bavaria Auto)',
      'Status': 'In-Transit (Tracked)'
    },
    parameters: {
      'Waybill Tracking': 'DHL-EX-99812401',
      'GPS Temp Logger': 'Active (19.8°C)',
      'Expected Delivery': '24 Sep 2026 09:00'
    }
  }
];
