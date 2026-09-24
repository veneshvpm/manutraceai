import {
  IndustryType,
  Batch,
  Product,
  Machine,
  Supplier,
  RawMaterial,
  QualityInspection,
  Defect,
  Shipment,
  RiskLevel,
  QualityStatus,
  MachineStatus
} from '../types';

export type DatasetTarget =
  | 'batches'
  | 'products'
  | 'machines'
  | 'suppliers'
  | 'rawMaterials'
  | 'inspections'
  | 'defects'
  | 'shipments';

export interface DatasetTargetMeta {
  id: DatasetTarget;
  label: string;
  description: string;
  primaryKey: string;
  expectedFields: string[];
}

export const DATASET_TARGETS: DatasetTargetMeta[] = [
  {
    id: 'batches',
    label: 'Production Batches',
    description: 'Manufacturing lots with telemetry, yield rates, defects, and operators',
    primaryKey: 'id',
    expectedFields: ['id', 'productId', 'productName', 'quantity', 'passRate', 'defectRate', 'machineId', 'operatorId']
  },
  {
    id: 'products',
    label: 'Product Catalog',
    description: 'Finished products, serial numbers, warranty, and quality certifications',
    primaryKey: 'id',
    expectedFields: ['id', 'name', 'category', 'batchId', 'productionLine', 'qualityStatus', 'riskLevel', 'traceability']
  },
  {
    id: 'machines',
    label: 'Machines & Telemetry',
    description: 'Factory equipment, utilization, operating hours, and sensor parameters',
    primaryKey: 'id',
    expectedFields: ['id', 'name', 'type', 'line', 'status', 'utilization', 'operatingHours', 'associatedDefects']
  },
  {
    id: 'suppliers',
    label: 'Suppliers & Vendors',
    description: 'Material suppliers, IATF/ISO certifications, quality ratings, and risk scores',
    primaryKey: 'id',
    expectedFields: ['id', 'name', 'material', 'qualityScore', 'defectRate', 'activeBatches', 'location', 'contactEmail']
  },
  {
    id: 'rawMaterials',
    label: 'Raw Materials Inventory',
    description: 'Raw materials batches, supplier traceability, purity scores, and acceptance status',
    primaryKey: 'id',
    expectedFields: ['id', 'name', 'supplierId', 'supplierName', 'batchNumber', 'receivedDate', 'purityScore', 'status']
  },
  {
    id: 'inspections',
    label: 'Quality Inspections',
    description: 'Inline QA inspections, sample sizes, tolerances, and defect detection stages',
    primaryKey: 'id',
    expectedFields: ['id', 'batchId', 'productId', 'inspectorId', 'stage', 'result', 'defectsFound', 'sampleSize']
  },
  {
    id: 'defects',
    label: 'Defects & Incidents Log',
    description: 'Identified non-conformances, root causes, machine links, and severity ratings',
    primaryKey: 'id',
    expectedFields: ['id', 'batchId', 'productId', 'category', 'severity', 'description', 'detectedAtStage', 'machineId']
  },
  {
    id: 'shipments',
    label: 'Shipments & Logistics',
    description: 'Dispatched finished goods, carriers, destinations, and compliance status',
    primaryKey: 'id',
    expectedFields: ['id', 'batchId', 'destination', 'quantity', 'dispatchDate', 'deliveryStatus', 'carrier', 'customerName']
  }
];

/**
 * Robust CSV parser that handles commas inside quotes, line breaks, and whitespace
 */
export function parseCSV(csvText: string): Record<string, any>[] {
  const lines: string[] = [];
  let currentLine = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"' || char === "'") {
      if (inQuotes && nextChar === char) {
        currentLine += char;
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (currentLine.trim()) {
        lines.push(currentLine.trim());
      }
      currentLine = '';
      if (char === '\r' && nextChar === '\n') i++;
    } else {
      currentLine += char;
    }
  }
  if (currentLine.trim()) {
    lines.push(currentLine.trim());
  }

  if (lines.length < 2) return [];

  // Parse header
  const parseRow = (row: string): string[] => {
    const values: string[] = [];
    let cur = '';
    let inQ = false;
    for (let i = 0; i < row.length; i++) {
      const c = row[i];
      if (c === '"' || c === "'") {
        inQ = !inQ;
      } else if (c === ',' && !inQ) {
        values.push(cur.trim());
        cur = '';
      } else {
        cur += c;
      }
    }
    values.push(cur.trim());
    return values.map(v => v.replace(/^["'](.*)["']$/, '$1').trim());
  };

  const headers = parseRow(lines[0]);
  const rows: Record<string, any>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const vals = parseRow(lines[i]);
    if (vals.length === 0 || (vals.length === 1 && !vals[0])) continue;

    const rowObj: Record<string, any> = {};
    headers.forEach((header, index) => {
      const val = vals[index] !== undefined ? vals[index] : '';
      rowObj[header] = coerceValue(val);
    });
    rows.push(rowObj);
  }

  return rows;
}

/**
 * Coerces string values to numbers or booleans if applicable
 */
function coerceValue(val: string): any {
  if (val === '') return '';
  if (val.toLowerCase() === 'true') return true;
  if (val.toLowerCase() === 'false') return false;
  if (val.toLowerCase() === 'null') return null;

  // Number test (avoid converting codes like 0012 to 12 if leading zeroes exist and length > 1)
  if (!isNaN(Number(val)) && !/^0[0-9]+/.test(val)) {
    return Number(val);
  }
  return val;
}

/**
 * Parse JSON text (either array of objects or an object with data array)
 */
export function parseJSON(jsonText: string): Record<string, any>[] {
  const parsed = JSON.parse(jsonText);
  if (Array.isArray(parsed)) {
    return parsed;
  }
  if (typeof parsed === 'object' && parsed !== null) {
    // Check if it has a data or items property
    for (const key of ['data', 'items', 'records', 'batches', 'products', 'machines', 'defects', 'suppliers']) {
      if (Array.isArray((parsed as any)[key])) {
        return (parsed as any)[key];
      }
    }
    return [parsed];
  }
  return [];
}

/**
 * Detects entity schema based on keys present in sample rows
 */
export function detectEntitySchema(sampleRows: Record<string, any>[]): DatasetTarget {
  if (!sampleRows || sampleRows.length === 0) return 'batches';

  const firstRow = sampleRows[0];
  const keys = Object.keys(firstRow).map(k => k.toLowerCase().replace(/[^a-z0-9]/g, ''));

  let bestMatch: DatasetTarget = 'batches';
  let highestScore = -1;

  for (const target of DATASET_TARGETS) {
    let score = 0;
    target.expectedFields.forEach(field => {
      const cleanField = field.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (keys.some(k => k.includes(cleanField) || cleanField.includes(k))) {
        score += 2;
      }
    });
    // Specific tie-breakers
    if (target.id === 'machines' && keys.some(k => k.includes('utilization') || k.includes('operat') || k.includes('speed'))) score += 3;
    if (target.id === 'defects' && keys.some(k => k.includes('defect') || k.includes('severity') || k.includes('stage'))) score += 3;
    if (target.id === 'suppliers' && keys.some(k => k.includes('supplier') || k.includes('compliance') || k.includes('material'))) score += 3;
    if (target.id === 'rawMaterials' && keys.some(k => k.includes('purity') || k.includes('raw') || k.includes('grade'))) score += 3;
    if (target.id === 'inspections' && keys.some(k => k.includes('inspector') || k.includes('tolerance') || k.includes('variance'))) score += 3;
    if (target.id === 'shipments' && keys.some(k => k.includes('carrier') || k.includes('destination') || k.includes('dispatch'))) score += 3;

    if (score > highestScore) {
      highestScore = score;
      bestMatch = target.id;
    }
  }

  return bestMatch;
}

/**
 * Normalizes uploaded rows into conforming entity structures with safe defaults
 */
export function normalizeDataset(
  rows: Record<string, any>[],
  target: DatasetTarget,
  defaultIndustry: IndustryType = 'automotive'
): any[] {
  return rows.map((raw, idx) => {
    // Helper to get case-insensitive key
    const get = (key: string, altKey?: string, fallback: any = ''): any => {
      for (const k of Object.keys(raw)) {
        const lower = k.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (lower === key.toLowerCase().replace(/[^a-z0-9]/g, '')) return raw[k];
        if (altKey && lower === altKey.toLowerCase().replace(/[^a-z0-9]/g, '')) return raw[k];
      }
      return fallback;
    };

    const id = String(get('id', 'batchId', `LOAD-${idx + 1}`));

    switch (target) {
      case 'batches': {
        const batch: Batch = {
          id: id.startsWith('B-') ? id : `B-${id}`,
          productId: String(get('productId', 'prodId', 'PRD-10021')),
          productName: String(get('productName', 'product', 'Manufactured Assembly')),
          industry: (get('industry', '', defaultIndustry) as IndustryType) || defaultIndustry,
          productionLine: String(get('productionLine', 'line', 'Line 01')),
          manufacturingDate: String(get('manufacturingDate', 'date', new Date().toISOString().split('T')[0])),
          quantity: Number(get('quantity', 'qty', 500)) || 500,
          qualityStatus: (['passed', 'failed', 'rework', 'scrapped', 'pending'].includes(String(get('qualityStatus', 'status')).toLowerCase())
            ? String(get('qualityStatus', 'status')).toLowerCase()
            : 'passed') as QualityStatus,
          riskLevel: (['low', 'medium', 'high', 'critical'].includes(String(get('riskLevel', 'risk')).toLowerCase())
            ? String(get('riskLevel', 'risk')).toLowerCase()
            : 'low') as RiskLevel,
          passRate: Number(get('passRate', 'yield', 98.2)) || 98.2,
          defectRate: Number(get('defectRate', 'defects', 1.8)) || 1.8,
          traceabilityCoverage: Number(get('traceabilityCoverage', 'traceability', 99.5)) || 99.5,
          operatorId: String(get('operatorId', 'operator', 'OP-24')),
          machineId: String(get('machineId', 'machine', 'M01')),
          rawMaterialBatchId: String(get('rawMaterialBatchId', 'materialBatch', 'RM-7821')),
          telemetry: {
            temperature: Number(get('temperature', 'temp', 72.5)) || 72.5,
            pressure: Number(get('pressure', 'psi', 4.2)) || 4.2,
            processingTime: Number(get('processingTime', 'cycleTime', 35)) || 35,
            vibration: Number(get('vibration', 'vib', 0.8)) || 0.8,
            machineSpeed: Number(get('machineSpeed', 'speed', 1200)) || 1200
          },
          anomalyDetected: Boolean(get('anomalyDetected', 'anomaly', false)),
          anomalyNotes: String(get('anomalyNotes', 'notes', ''))
        };
        return batch;
      }

      case 'products': {
        const product: Product = {
          id: id.startsWith('PRD-') ? id : `PRD-${id}`,
          name: String(get('name', 'productName', 'Industrial Component')),
          category: String(get('category', 'type', 'High-Precision Assemblies')),
          industry: (get('industry', '', defaultIndustry) as IndustryType) || defaultIndustry,
          batchId: String(get('batchId', 'batch', 'B-1042')),
          manufacturingDate: String(get('manufacturingDate', 'date', new Date().toISOString().split('T')[0])),
          productionLine: String(get('productionLine', 'line', 'Line 01')),
          qualityStatus: (['passed', 'failed', 'rework', 'scrapped', 'pending'].includes(String(get('qualityStatus', 'status')).toLowerCase())
            ? String(get('qualityStatus', 'status')).toLowerCase()
            : 'passed') as QualityStatus,
          riskLevel: (['low', 'medium', 'high', 'critical'].includes(String(get('riskLevel', 'risk')).toLowerCase())
            ? String(get('riskLevel', 'risk')).toLowerCase()
            : 'low') as RiskLevel,
          traceability: Number(get('traceability', 'coverage', 100)) || 100,
          serialNumber: String(get('serialNumber', 'sn', `SN-${Date.now().toString().slice(-6)}-${idx + 1}`)),
          certification: String(get('certification', 'cert', 'ISO 9001 / IATF 16949')),
          warrantyStatus: String(get('warrantyStatus', 'warranty', '36 Months Certified'))
        };
        return product;
      }

      case 'machines': {
        const machine: Machine = {
          id: id.startsWith('M') ? id : `M${id}`,
          name: String(get('name', 'machineName', 'CNC Center')),
          type: String(get('type', 'category', 'Machining Station')),
          line: String(get('line', 'productionLine', 'Line 01')),
          industry: (get('industry', '', defaultIndustry) as IndustryType) || defaultIndustry,
          status: (['running', 'idle', 'warning', 'maintenance'].includes(String(get('status', 'state')).toLowerCase())
            ? String(get('status', 'state')).toLowerCase()
            : 'running') as MachineStatus,
          utilization: Number(get('utilization', 'load', 85)) || 85,
          lastMaintenance: String(get('lastMaintenance', 'lastService', '2026-09-01')),
          nextMaintenance: String(get('nextMaintenance', 'nextService', '2026-10-15')),
          risk: (['low', 'medium', 'high', 'critical'].includes(String(get('risk', 'riskLevel')).toLowerCase())
            ? String(get('risk', 'riskLevel')).toLowerCase()
            : 'low') as RiskLevel,
          operatingHours: Number(get('operatingHours', 'hours', 1450)) || 1450,
          associatedDefects: Number(get('associatedDefects', 'defects', 0)) || 0,
          telemetry: {
            temperature: Number(get('temperature', 'temp', 68.4)) || 68.4,
            pressure: Number(get('pressure', 'psi', 4.1)) || 4.1,
            processingTime: Number(get('processingTime', 'cycle', 28)) || 28,
            vibration: Number(get('vibration', 'vib', 0.6)) || 0.6,
            machineSpeed: Number(get('machineSpeed', 'rpm', 2400)) || 2400
          }
        };
        return machine;
      }

      case 'suppliers': {
        const supplier: Supplier = {
          id: id.startsWith('SUP-') ? id : `SUP-${id}`,
          name: String(get('name', 'supplierName', 'Precision Supplier Corp.')),
          material: String(get('material', 'materialSupplied', 'High-Spec Alloy Castings')),
          industry: (get('industry', '', defaultIndustry) as IndustryType) || defaultIndustry,
          qualityScore: Number(get('qualityScore', 'score', 92)) || 92,
          defectRate: Number(get('defectRate', 'defect', 1.5)) || 1.5,
          activeBatches: Number(get('activeBatches', 'batches', 8)) || 8,
          risk: (['low', 'medium', 'high', 'critical'].includes(String(get('risk', 'riskLevel')).toLowerCase())
            ? String(get('risk', 'riskLevel')).toLowerCase()
            : 'low') as RiskLevel,
          location: String(get('location', 'origin', 'Stuttgart, Germany')),
          certification: String(get('certification', 'cert', 'ISO 9001 / IATF 16949')),
          complianceDate: String(get('complianceDate', 'auditDate', '2026-08-01')),
          contactEmail: String(get('contactEmail', 'email', 'contact@supplier.com'))
        };
        return supplier;
      }

      case 'rawMaterials': {
        const rawMat: RawMaterial = {
          id: id.startsWith('RM-') ? id : `RM-${id}`,
          name: String(get('name', 'materialName', 'High-Tensile Raw Material')),
          industry: (get('industry', '', defaultIndustry) as IndustryType) || defaultIndustry,
          supplierId: String(get('supplierId', 'supplier', 'SUP-001')),
          supplierName: String(get('supplierName', 'vendor', 'Global Materials Ltd.')),
          batchNumber: String(get('batchNumber', 'lot', `LOT-${idx + 100}`)),
          receivedDate: String(get('receivedDate', 'date', '2026-09-10')),
          expiryDate: String(get('expiryDate', 'expiry', '2027-09-10')),
          qualityGrade: String(get('qualityGrade', 'grade', 'Grade A+')),
          status: (['approved', 'quarantined', 'investigating', 'rejected'].includes(String(get('status')).toLowerCase())
            ? String(get('status')).toLowerCase()
            : 'approved') as any,
          riskLevel: (['low', 'medium', 'high', 'critical'].includes(String(get('riskLevel', 'risk')).toLowerCase())
            ? String(get('riskLevel', 'risk')).toLowerCase()
            : 'low') as RiskLevel,
          purityScore: Number(get('purityScore', 'purity', 99.1)) || 99.1,
          notes: String(get('notes', 'remark', 'Inspection verified on intake'))
        };
        return rawMat;
      }

      case 'inspections': {
        const inspection: QualityInspection = {
          id: id.startsWith('INSP-') ? id : `INSP-${id}`,
          batchId: String(get('batchId', 'batch', 'B-1042')),
          productId: String(get('productId', 'product', 'PRD-10021')),
          inspectorId: String(get('inspectorId', 'inspector', 'QA-88')),
          stage: String(get('stage', 'checkpoint', 'End of Line Verification')),
          result: (['passed', 'failed', 'rework', 'scrapped', 'pending'].includes(String(get('result', 'status')).toLowerCase())
            ? String(get('result', 'status')).toLowerCase()
            : 'passed') as QualityStatus,
          defectsFound: Number(get('defectsFound', 'defects', 0)) || 0,
          defectCategory: get('defectCategory', 'category', 'Other') as any,
          timestamp: String(get('timestamp', 'date', new Date().toISOString().replace('T', ' ').slice(0, 19))),
          sampleSize: Number(get('sampleSize', 'samples', 50)) || 50,
          toleranceVariance: String(get('toleranceVariance', 'tolerance', '±0.02mm')),
          notes: String(get('notes', 'remark', 'Standard batch clearance protocol'))
        };
        return inspection;
      }

      case 'defects': {
        const defect: Defect = {
          id: id.startsWith('DEF-') ? id : `DEF-${id}`,
          batchId: String(get('batchId', 'batch', 'B-1042')),
          productId: String(get('productId', 'product', 'PRD-10021')),
          category: (get('category', 'type', 'Dimension') as any),
          severity: (['low', 'medium', 'high', 'critical'].includes(String(get('severity', 'risk')).toLowerCase())
            ? String(get('severity', 'risk')).toLowerCase()
            : 'medium') as RiskLevel,
          description: String(get('description', 'issue', 'Dimensional variance beyond specified tolerance')),
          detectedAtStage: String(get('detectedAtStage', 'stage', 'CNC Stage 02')),
          machineId: String(get('machineId', 'machine', 'M04')),
          timestamp: String(get('timestamp', 'date', new Date().toISOString().replace('T', ' ').slice(0, 19))),
          resolved: Boolean(get('resolved', 'isResolved', false))
        };
        return defect;
      }

      case 'shipments': {
        const shipment: Shipment = {
          id: id.startsWith('SHP-') ? id : `SHP-${id}`,
          batchId: String(get('batchId', 'batch', 'B-1042')),
          destination: String(get('destination', 'dest', 'Berlin Assembly Plant')),
          quantity: Number(get('quantity', 'qty', 250)) || 250,
          dispatchDate: String(get('dispatchDate', 'date', '2026-09-22')),
          deliveryStatus: (['in_transit', 'delivered', 'quarantined', 'scheduled'].includes(String(get('deliveryStatus', 'status')).toLowerCase())
            ? String(get('deliveryStatus', 'status')).toLowerCase()
            : 'in_transit') as any,
          carrier: String(get('carrier', 'logistics', 'DHL Industrial Freight')),
          customerName: String(get('customerName', 'customer', 'Bavaria Motors AG')),
          complianceVerified: Boolean(get('complianceVerified', 'verified', true))
        };
        return shipment;
      }

      default:
        return raw;
    }
  });
}

/**
 * Downloads data as a CSV file in browser
 */
export function downloadCSV(data: Record<string, any>[], filename: string) {
  if (!data || data.length === 0) return;

  // Flatten nested objects like telemetry for CSV
  const flattenedData = data.map(item => {
    const flat: Record<string, any> = {};
    for (const [key, val] of Object.entries(item)) {
      if (val && typeof val === 'object' && !Array.isArray(val)) {
        for (const [subKey, subVal] of Object.entries(val)) {
          flat[`${key}_${subKey}`] = subVal;
        }
      } else {
        flat[key] = val;
      }
    }
    return flat;
  });

  const headers = Array.from(new Set(flattenedData.flatMap(row => Object.keys(row))));
  const csvRows: string[] = [];

  csvRows.push(headers.join(','));

  flattenedData.forEach(row => {
    const values = headers.map(header => {
      const val = row[header];
      if (val === undefined || val === null) return '""';
      const escaped = String(val).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  });

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Downloads data as a JSON file in browser
 */
export function downloadJSON(data: any, filename: string) {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ==========================================
// PRE-BUILT INDUSTRIAL SAMPLE CSV DATASETS
// ==========================================

export const SAMPLE_BATCHES_CSV = `id,productId,productName,industry,productionLine,manufacturingDate,quantity,qualityStatus,riskLevel,passRate,defectRate,traceabilityCoverage,operatorId,machineId,rawMaterialBatchId,temperature,pressure,processingTime,vibration,machineSpeed,anomalyDetected,anomalyNotes
B-3001,PRD-10021,High-Torque Drive Shaft,automotive,Line 01,2026-09-23,450,passed,low,99.1,0.9,100,OP-12,M01,RM-7821,68.4,4.2,32,0.52,1450,false,Smooth thermal profile
B-3002,PRD-10022,Carbon-Ceramic Brake Disc,automotive,Line 02,2026-09-23,320,passed,low,98.6,1.4,99.2,OP-18,M02,RM-7822,72.1,4.5,41,0.61,1620,false,Normal tolerance run
B-3003,PRD-10023,Precision Injector Nozzle,automotive,Line 04,2026-09-22,600,failed,critical,87.4,12.6,98.0,OP-07,M04,RM-7825,89.6,5.8,48,1.42,1950,true,High thermal excursion on CNC spindle
B-3004,PRD-10024,Titanium Turbo Impeller,automotive,Line 03,2026-09-22,180,passed,medium,96.2,3.8,99.8,OP-15,M03,RM-7823,76.3,4.0,55,0.75,2200,false,Minor vibration variance resolved
B-3005,PRD-10025,Lithium Cell Battery Module,automotive,Line 05,2026-09-21,800,rework,high,91.5,8.5,97.5,OP-22,M05,RM-7826,82.4,3.8,30,0.88,1100,true,Electrode weld resistance warning
B-3006,PRD-10026,Alloy Transmission Casing,automotive,Line 01,2026-09-21,240,passed,low,99.4,0.6,100,OP-12,M01,RM-7821,69.0,4.3,38,0.48,1380,false,Optimal casting pressure verified`;

export const SAMPLE_DEFECTS_CSV = `id,batchId,productId,category,severity,description,detectedAtStage,machineId,timestamp,resolved
DEF-901,B-3003,PRD-10023,Dimension,critical,Nozzle diameter micro-clearance exceeded by 0.045mm,Optical Metrology Stage,M04,2026-09-23 09:14:00,false
DEF-902,B-3005,PRD-10025,Surface,high,Laser weld porosity on cathode tab junction,Laser Ultrasonic Station,M05,2026-09-23 10:45:00,false
DEF-903,B-3003,PRD-10023,Temperature,high,Thermal oxidation discoloration along inner bore,Post-Heat Chamber,M04,2026-09-23 11:20:00,false
DEF-904,B-3004,PRD-10024,Assembly,medium,Micro-burr detected on rotor vane tip,Robotic Deburring,M03,2026-09-22 16:30:00,true
DEF-905,B-3002,PRD-10022,Dimension,low,Radial runout within allowable secondary tolerance,Dial Gauge Check,M02,2026-09-22 14:15:00,true`;

export const SAMPLE_MACHINES_CSV = `id,name,type,line,status,utilization,operatingHours,associatedDefects,temperature,pressure,processingTime,vibration,machineSpeed
M11,DMG MORI 5-Axis Milling,CNC Center,Line 01,running,94,3200,1,67.2,4.1,30,0.45,1500
M12,Trumpf TruLaser Cell 7040,Laser Welding,Line 02,running,88,2840,0,64.8,3.9,25,0.32,1800
M13,Zeiss Prismo Ultra CMM,Coordinate Metrology,Line 04,warning,78,4100,4,74.5,4.8,42,0.92,1200
M14,Fanuc Robocut Alpha-C600i,EDM Wire Cutting,Line 03,running,91,1950,2,69.1,4.0,36,0.51,2100
M15,Schuler 800T Servo Stamping,Hydraulic Press,Line 05,maintenance,45,6200,6,83.4,5.6,50,1.25,950`;

export const SAMPLE_SUPPLIERS_CSV = `id,name,material,qualityScore,defectRate,activeBatches,risk,location,certification,complianceDate,contactEmail
SUP-101,ThyssenKrupp Materials DE,Ultra-High Strength Steel,97.5,0.8,14,low,Essen Germany,IATF 16949 / ISO 14001,2026-09-01,automotive@thyssenkrupp.com
SUP-102,Kobe Steel Precision,Forged Aluminum 6061-T6,94.2,1.6,9,low,Kobe Japan,ISO 9001 / JIS Q 9100,2026-08-18,sales@kobesteel.jp
SUP-103,Sandvik Coromant Alloys,Tungsten Carbide Billets,96.8,1.1,11,low,Sandviken Sweden,ISO 9001 / ISO 45001,2026-07-25,alloys@sandvik.com
SUP-104,Apex MicroSensors GmbH,MEMS Pressure & Temp Transducers,88.4,3.2,5,medium,Nuremberg Germany,ISO 9001:2015,2026-06-30,orders@apex-sensors.de`;
