import {
  WorkerSafetyProfile,
  PpeCameraFeed,
  LotoPermit,
  SafetyGeofenceZone,
  EnvironmentalGasSensor,
  MusterStation,
  SafetyIncidentLog
} from '../types';

class HumanSecurityEngine {
  private workers: WorkerSafetyProfile[] = [
    {
      id: 'WRK-101',
      name: 'Marcus Vance',
      role: 'Senior Electrical Lead',
      department: 'Substation & High-Voltage Maintenance',
      shift: 'MORNING',
      bloodGroup: 'O+',
      emergencyContact: '+1 (555) 392-1044 (Spouse)',
      smartBadgeId: 'RFID-8831-BLE',
      certifications: ['NFPA 70E Arc Flash', 'OSHA 30', 'LOTO Level 3'],
      heartRate: 74,
      bodyTemp: 36.8,
      fallStatus: 'NORMAL',
      fatigueIndex: 18,
      currentZone: 'Bay 02 - Inverter Room',
      ppeStatus: { helmet: true, vest: true, goggles: true, gloves: true },
      sosActive: false,
      lastCheckInSecondsAgo: 12
    },
    {
      id: 'WRK-102',
      name: 'Elena Rostov',
      role: 'Robotics Integration Specialist',
      department: 'Automated Body Welding & Stamping',
      shift: 'MORNING',
      bloodGroup: 'A+',
      emergencyContact: '+1 (555) 781-9923 (Father)',
      smartBadgeId: 'RFID-9421-BLE',
      certifications: ['RIA R15.06 Robot Safety', 'First Aid / CPR'],
      heartRate: 82,
      bodyTemp: 37.0,
      fallStatus: 'NORMAL',
      fatigueIndex: 24,
      currentZone: 'Robotic Cell #04 - Chassis Jig',
      ppeStatus: { helmet: true, vest: true, goggles: true, gloves: true },
      sosActive: false,
      lastCheckInSecondsAgo: 45
    },
    {
      id: 'WRK-103',
      name: 'Rajesh Kumar',
      role: 'Chemical Process Operator',
      department: 'Battery Chemistry & Electrolyte Filling',
      shift: 'MORNING',
      bloodGroup: 'B+',
      emergencyContact: '+1 (555) 612-4481 (Brother)',
      smartBadgeId: 'RFID-4190-BLE',
      certifications: ['HAZWOPER 40', 'Confined Space Entry'],
      heartRate: 78,
      bodyTemp: 36.7,
      fallStatus: 'NORMAL',
      fatigueIndex: 32,
      currentZone: 'Chemical Storage & Dispense Vault',
      ppeStatus: { helmet: true, vest: true, goggles: true, gloves: true, harness: true },
      sosActive: false,
      lastCheckInSecondsAgo: 28
    },
    {
      id: 'WRK-104',
      name: 'Sarah Jenkins',
      role: 'Quality Assurance Inspector',
      department: 'Final Line Assembly & Metrology',
      shift: 'MORNING',
      bloodGroup: 'AB+',
      emergencyContact: '+1 (555) 902-3311 (Spouse)',
      smartBadgeId: 'RFID-5520-BLE',
      certifications: ['Six Sigma Black Belt', 'ISO 45001 Internal Auditor'],
      heartRate: 69,
      bodyTemp: 36.6,
      fallStatus: 'NORMAL',
      fatigueIndex: 12,
      currentZone: 'Final Inspection Station #01',
      ppeStatus: { helmet: true, vest: true, goggles: true, gloves: true },
      sosActive: false,
      lastCheckInSecondsAgo: 10
    },
    {
      id: 'WRK-105',
      name: 'David Chen',
      role: 'CNC Machinist & Toolmaker',
      department: 'Precision Machining Hall A',
      shift: 'MORNING',
      bloodGroup: 'O-',
      emergencyContact: '+1 (555) 438-7719 (Mother)',
      smartBadgeId: 'RFID-7104-BLE',
      certifications: ['OSHA 10', 'Machinery Guarding ANSI B11'],
      heartRate: 88,
      bodyTemp: 37.1,
      fallStatus: 'NORMAL',
      fatigueIndex: 45,
      currentZone: 'Machining Center M04',
      ppeStatus: { helmet: true, vest: true, goggles: false, gloves: true },
      sosActive: false,
      lastCheckInSecondsAgo: 70
    },
    {
      id: 'WRK-106',
      name: 'Carlos Morales',
      role: 'Overhead Crane & Rigging Operator',
      department: 'Heavy Logistics & Coil Unloading',
      shift: 'MORNING',
      bloodGroup: 'A-',
      emergencyContact: '+1 (555) 883-2015 (Spouse)',
      smartBadgeId: 'RFID-3382-BLE',
      certifications: ['NCCCO Crane Certified', 'Rigging Safety Level 2'],
      heartRate: 75,
      bodyTemp: 36.9,
      fallStatus: 'NORMAL',
      fatigueIndex: 20,
      currentZone: 'Bay 01 - Heavy Unloading Gantry',
      ppeStatus: { helmet: true, vest: true, goggles: true, gloves: true, harness: true },
      sosActive: false,
      lastCheckInSecondsAgo: 35
    }
  ];

  private cameraFeeds: PpeCameraFeed[] = [
    {
      id: 'CAM-BAY-01',
      name: 'Robotic Stamping & Laser Cell #03',
      zone: 'Zone 03 - Laser Stamping',
      fps: 28,
      resolution: '4K UHD (3840x2160)',
      activeWorkers: 2,
      helmetCompliancePct: 100,
      vestCompliancePct: 100,
      gogglesCompliancePct: 100,
      overallScore: 100,
      violationsCount: 0,
      streamStatus: 'ONLINE',
      detections: [
        {
          personId: 'WRK-102',
          personName: 'Elena Rostov',
          box: { x: 22, y: 35, width: 26, height: 50 },
          helmet: { detected: true, confidence: 99.4 },
          vest: { detected: true, confidence: 98.8 },
          goggles: { detected: true, confidence: 97.2 },
          gloves: { detected: true, confidence: 96.5 },
          status: 'COMPLIANT'
        }
      ]
    },
    {
      id: 'CAM-BAY-02',
      name: '11kV Substation High-Voltage Corridor',
      zone: 'Zone 01 - Medium Voltage Substation',
      fps: 30,
      resolution: '4K UHD (3840x2160)',
      activeWorkers: 1,
      helmetCompliancePct: 100,
      vestCompliancePct: 100,
      gogglesCompliancePct: 100,
      overallScore: 100,
      violationsCount: 0,
      streamStatus: 'ONLINE',
      detections: [
        {
          personId: 'WRK-101',
          personName: 'Marcus Vance',
          box: { x: 55, y: 28, width: 24, height: 55 },
          helmet: { detected: true, confidence: 99.8 },
          vest: { detected: true, confidence: 99.1 },
          goggles: { detected: true, confidence: 98.4 },
          gloves: { detected: true, confidence: 99.0 },
          status: 'COMPLIANT'
        }
      ]
    },
    {
      id: 'CAM-BAY-03',
      name: 'Precision CNC Machining Hall A',
      zone: 'Zone 02 - Machining Hall',
      fps: 26,
      resolution: '1080p FHD',
      activeWorkers: 1,
      helmetCompliancePct: 100,
      vestCompliancePct: 100,
      gogglesCompliancePct: 0,
      overallScore: 68,
      violationsCount: 1,
      streamStatus: 'ONLINE',
      detections: [
        {
          personId: 'WRK-105',
          personName: 'David Chen',
          box: { x: 40, y: 30, width: 28, height: 52 },
          helmet: { detected: true, confidence: 98.2 },
          vest: { detected: true, confidence: 97.5 },
          goggles: { detected: false, confidence: 12.0 },
          gloves: { detected: true, confidence: 94.1 },
          status: 'VIOLATION',
          violationLabel: 'SAFETY GOGGLES MISSING NEAR SPINDLE'
        }
      ]
    }
  ];

  private lotoPermits: LotoPermit[] = [
    {
      id: 'LOTO-2026-089',
      equipmentId: 'M04 - 5-Axis CNC Milling',
      equipmentName: 'High-Precision 5-Axis CNC Spindle & Hydraulic Chuck',
      location: 'Machining Hall A - Bay 04',
      isolationType: 'ELECTRICAL_415V',
      lockoutTagId: 'PADLOCK-RED-4401',
      technicianId: 'WRK-105',
      technicianName: 'David Chen',
      supervisorSignOff: 'Chief Safety Engineer Roberts',
      zeroEnergyVerified: true,
      status: 'TAGGED_LOCKED',
      lockedAt: '2026-09-24 07:30:00',
      expectedCompletion: '2026-09-24 14:00:00',
      residualEnergyDissipated: true,
      notes: 'Main 415V 63A disconnect locked with hasp. Bleed-off valve depressurized to 0 bar.'
    },
    {
      id: 'LOTO-2026-090',
      equipmentId: 'PCS-INV-01',
      equipmentName: '100 kW 3-Phase Central Battery Inverter',
      location: 'Substation Yard - BESS Bay',
      isolationType: 'ELECTRICAL_415V',
      lockoutTagId: 'PADLOCK-YELLOW-1092',
      technicianId: 'WRK-101',
      technicianName: 'Marcus Vance',
      supervisorSignOff: 'EHS Manager Alistair',
      zeroEnergyVerified: true,
      status: 'MAINTENANCE_IN_PROGRESS',
      lockedAt: '2026-09-24 09:15:00',
      expectedCompletion: '2026-09-24 16:30:00',
      residualEnergyDissipated: true,
      notes: 'DC bus capacitors discharged to < 5V. Arc-flash boundary tagged.'
    },
    {
      id: 'LOTO-2026-088',
      equipmentId: 'ROBOT-CELL-02',
      equipmentName: 'KUKA 6-Axis Spot Welding Arm',
      location: 'Chassis Line 02',
      isolationType: 'PNEUMATIC_8BAR',
      lockoutTagId: 'PADLOCK-BLUE-9912',
      technicianId: 'WRK-102',
      technicianName: 'Elena Rostov',
      supervisorSignOff: 'Chief Safety Engineer Roberts',
      zeroEnergyVerified: true,
      status: 'REMOVED_CLEARED',
      lockedAt: '2026-09-23 13:00:00',
      expectedCompletion: '2026-09-23 17:00:00',
      residualEnergyDissipated: true,
      notes: 'Pneumatic manifold replaced and tested. Lock removed after dual verification.'
    }
  ];

  private geofenceZones: SafetyGeofenceZone[] = [
    {
      id: 'ZONE-HV-11KV',
      name: '11kV Substation & Medium Voltage Transformer Yard',
      riskTier: 'CRITICAL_HIGH_VOLTAGE',
      maxOccupancy: 3,
      currentOccupants: ['WRK-101'],
      interlockRelayArmed: true,
      intrusionAlarm: false,
      eStopTriggered: false,
      requiredCertifications: ['NFPA 70E Arc Flash', 'Substation Access Auth'],
      ambientHazards: '11,000 Volts AC • Arc Flash Boundary 3.2m • Step Potential'
    },
    {
      id: 'ZONE-ROBOT-03',
      name: 'Automated Robotic Cell #03 - High-Speed Laser Stamping',
      riskTier: 'ROBOTIC_ENCLOSURE',
      maxOccupancy: 2,
      currentOccupants: ['WRK-102'],
      interlockRelayArmed: true,
      intrusionAlarm: false,
      eStopTriggered: false,
      requiredCertifications: ['RIA R15.06 Robot Safety', 'LOTO Level 2'],
      ambientHazards: 'High-Speed Robot Trajectory • 4kW Fiber Laser Emission'
    },
    {
      id: 'ZONE-CHEM-01',
      name: 'Electrolyte & Hazardous Chemical Storage Vault',
      riskTier: 'CHEMICAL_STORAGE',
      maxOccupancy: 2,
      currentOccupants: ['WRK-103'],
      interlockRelayArmed: true,
      intrusionAlarm: false,
      eStopTriggered: false,
      requiredCertifications: ['HAZWOPER 40', 'Respiratory Protection'],
      ambientHazards: 'Flammable Solvents • Toxic Vapor Risk • O2 Depletion'
    },
    {
      id: 'ZONE-CRANE-01',
      name: 'Bay 01 Heavy Coil Unloading & Crane Swing Enclosure',
      riskTier: 'CRANE_RADIUS',
      maxOccupancy: 4,
      currentOccupants: ['WRK-106'],
      interlockRelayArmed: true,
      intrusionAlarm: false,
      eStopTriggered: false,
      requiredCertifications: ['Overhead Crane Rigging', 'High-Vis Level 3'],
      ambientHazards: '20-Ton Overhead Suspended Load • Pinch Points'
    }
  ];

  private gasSensors: EnvironmentalGasSensor[] = [
    {
      id: 'GAS-SUB-01',
      location: '11kV Substation Switchgear Room',
      o2Percent: 20.9,
      coPpm: 2.1,
      h2sPpm: 0.0,
      sf6Ppm: 12.0, // SF6 limit is 1000 ppm
      combustibleLelPct: 0.0,
      ambientTempC: 24.5,
      humidityPct: 48,
      noiseDecibels: 64,
      wbgtHeatIndexC: 22.1,
      status: 'SAFE',
      lastCalibrated: '15 Sep 2026'
    },
    {
      id: 'GAS-CHEM-02',
      location: 'Battery Electrolyte Filling & Chemical Vault',
      o2Percent: 20.8,
      coPpm: 4.8,
      h2sPpm: 0.8,
      sf6Ppm: 0.0,
      combustibleLelPct: 2.4, // < 10% is safe
      ambientTempC: 22.0,
      humidityPct: 42,
      noiseDecibels: 58,
      wbgtHeatIndexC: 20.8,
      status: 'SAFE',
      lastCalibrated: '20 Sep 2026'
    },
    {
      id: 'GAS-MACH-03',
      location: 'Precision CNC Machining Hall A',
      o2Percent: 20.9,
      coPpm: 6.2,
      h2sPpm: 0.0,
      sf6Ppm: 0.0,
      combustibleLelPct: 1.1,
      ambientTempC: 27.2,
      humidityPct: 54,
      noiseDecibels: 82, // OSHA 85dB threshold
      wbgtHeatIndexC: 25.4,
      status: 'SAFE',
      lastCalibrated: '18 Sep 2026'
    }
  ];

  private musterStations: MusterStation[] = [
    {
      id: 'MUSTER-A',
      name: 'Muster Point Alpha (North Admin Lawn)',
      capacity: 150,
      checkedInCount: 94,
      missingCount: 0,
      checkedInPersonnel: ['WRK-101', 'WRK-104'],
      status: 'STANDBY'
    },
    {
      id: 'MUSTER-B',
      name: 'Muster Point Bravo (South Logistics Gate 04)',
      capacity: 100,
      checkedInCount: 42,
      missingCount: 0,
      checkedInPersonnel: ['WRK-102', 'WRK-106'],
      status: 'STANDBY'
    },
    {
      id: 'MUSTER-C',
      name: 'Muster Point Charlie (West Substation Perimeter)',
      capacity: 60,
      checkedInCount: 6,
      missingCount: 0,
      checkedInPersonnel: ['WRK-103', 'WRK-105'],
      status: 'STANDBY'
    }
  ];

  private incidentLogs: SafetyIncidentLog[] = [
    {
      id: 'INC-2026-018',
      type: 'NEAR_MISS',
      timestamp: '2026-09-24 08:42:15',
      location: 'Precision CNC Machining Hall A',
      involvedPerson: 'David Chen (WRK-105)',
      description: 'Operator approached rotating 12,000 RPM spindle without safety eye protection goggles.',
      severity: 'MEDIUM',
      oshaRecordable: false,
      rootCause: 'Operator removed goggles to wipe fogging; automatic CV camera triggered early alarm.',
      correctiveActionCapa: 'Issued anti-fog certified polycarbonate safety goggles; completed 5-minute safety re-brief.',
      status: 'CAPA_ASSIGNED',
      investigator: 'EHS Officer Vance'
    },
    {
      id: 'INC-2026-017',
      type: 'HAZMAT_EXPOSURE',
      timestamp: '2026-09-21 14:10:00',
      location: 'Electrolyte Vault Chemical Line #02',
      involvedPerson: 'Rajesh Kumar (WRK-103)',
      description: 'Minor vapor release during quick-disconnect coupling calibration; auto-ventilation scrubber engaged within 1.2s.',
      severity: 'LOW',
      oshaRecordable: false,
      rootCause: 'Coupling O-ring micro-wear during pressure spike.',
      correctiveActionCapa: 'Replaced fluoropolymer seal kit; instituted 60-day preventative gasket replacement interval.',
      status: 'RESOLVED_CLOSED',
      investigator: 'Chief Safety Engineer Roberts'
    }
  ];

  private ltiFreeDays: number = 418;
  private evacuationDrillActive: boolean = false;

  // ─────────────────────────────────────────────────────────────────────────
  // TICK CYCLE (1000ms real-time loop)
  // ─────────────────────────────────────────────────────────────────────────
  public tick(dt: number = 1.0) {
    // 1. Update biometric pulse & check-ins
    this.workers.forEach(w => {
      // Slight natural biometric jitter
      const heartDelta = (Math.random() - 0.5) * 2;
      w.heartRate = Math.min(140, Math.max(58, Math.round(w.heartRate + heartDelta)));

      const tempDelta = (Math.random() - 0.5) * 0.05;
      w.bodyTemp = parseFloat(Math.min(39.5, Math.max(36.1, w.bodyTemp + tempDelta)).toFixed(1));

      // Increase check-in timer
      w.lastCheckInSecondsAgo += Math.round(dt);

      // Random micro-increment of fatigue
      if (Math.random() < 0.05) {
        w.fatigueIndex = Math.min(100, w.fatigueIndex + 1);
      }
    });

    // 2. Micro fluctuations on environmental gas sensors
    this.gasSensors.forEach(g => {
      g.noiseDecibels = Math.min(95, Math.max(50, Math.round(g.noiseDecibels + (Math.random() - 0.5) * 2)));
      g.ambientTempC = parseFloat((g.ambientTempC + (Math.random() - 0.5) * 0.1).toFixed(1));
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // GETTERS
  // ─────────────────────────────────────────────────────────────────────────
  public getWorkers(): WorkerSafetyProfile[] {
    return this.workers;
  }

  public getCameraFeeds(): PpeCameraFeed[] {
    return this.cameraFeeds;
  }

  public getLotoPermits(): LotoPermit[] {
    return this.lotoPermits;
  }

  public getGeofenceZones(): SafetyGeofenceZone[] {
    return this.geofenceZones;
  }

  public getGasSensors(): EnvironmentalGasSensor[] {
    return this.gasSensors;
  }

  public getMusterStations(): MusterStation[] {
    return this.musterStations;
  }

  public getIncidentLogs(): SafetyIncidentLog[] {
    return this.incidentLogs;
  }

  public getLtiFreeDays(): number {
    return this.ltiFreeDays;
  }

  public isEvacuationActive(): boolean {
    return this.evacuationDrillActive;
  }

  public getOverallSafetyScore(): number {
    const compliantCams = this.cameraFeeds.reduce((acc, c) => acc + c.overallScore, 0) / (this.cameraFeeds.length || 1);
    const noSosBonus = this.workers.every(w => !w.sosActive && w.fallStatus === 'NORMAL') ? 100 : 60;
    const gasBonus = this.gasSensors.every(g => g.status === 'SAFE') ? 100 : 70;
    return parseFloat(((compliantCams * 0.4) + (noSosBonus * 0.4) + (gasBonus * 0.2)).toFixed(1));
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ACTIONS & SIMULATION SCENARIO INJECTIONS
  // ─────────────────────────────────────────────────────────────────────────

  public injectWorkerFall(workerId: string = 'WRK-105') {
    const worker = this.workers.find(w => w.id === workerId);
    if (worker) {
      worker.fallStatus = 'FALL_DETECTED';
      worker.sosActive = true;
      worker.heartRate = 128;
      
      const newInc: SafetyIncidentLog = {
        id: `INC-2026-0${this.incidentLogs.length + 19}`,
        type: 'LOST_TIME_INJURY',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        location: worker.currentZone,
        involvedPerson: `${worker.name} (${worker.id})`,
        description: 'Automatic Smart Badge 3-Axis Gyroscope detected high-impact slip/fall. Emergency SOS beacon broadcasting.',
        severity: 'CRITICAL',
        oshaRecordable: true,
        rootCause: 'Sudden deceleration detected; immediate first responder dispatch triggered.',
        correctiveActionCapa: 'Dispatched Floor Safety Paramedic Team. Floor hazard inspection initiated.',
        status: 'OPEN',
        investigator: 'Duty HSE Commander'
      };
      this.incidentLogs.unshift(newInc);
      return newInc;
    }
    return null;
  }

  public injectPpeViolation(workerId: string = 'WRK-105', missingItem: 'goggles' | 'helmet' | 'vest' = 'goggles') {
    const worker = this.workers.find(w => w.id === workerId);
    if (worker) {
      worker.ppeStatus[missingItem] = false;
    }
    const cam = this.cameraFeeds.find(c => c.id === 'CAM-BAY-03');
    if (cam) {
      cam.violationsCount = 1;
      cam.overallScore = 65;
      cam.gogglesCompliancePct = 0;
    }
  }

  public injectGeofenceIntrusion(zoneId: string = 'ZONE-HV-11KV') {
    const zone = this.geofenceZones.find(z => z.id === zoneId);
    if (zone) {
      zone.intrusionAlarm = true;
      zone.eStopTriggered = true; // Auto-trip machine / power interlock
      
      const newInc: SafetyIncidentLog = {
        id: `INC-2026-0${this.incidentLogs.length + 19}`,
        type: 'EQUIPMENT_BREACH',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        location: zone.name,
        involvedPerson: 'Unverified RFID Badge Scan',
        description: `Unauthorized perimeter breach detected in ${zone.name}. Physical Safety Interlock tripped (E-STOP engaged).`,
        severity: 'HIGH',
        oshaRecordable: false,
        rootCause: 'Geofence laser beam broken without certified RFID authorization handshake.',
        correctiveActionCapa: 'Engaged emergency lockout; security dispatched to verify personnel credentials.',
        status: 'OPEN',
        investigator: 'Automated Interlock Safety PLC'
      };
      this.incidentLogs.unshift(newInc);
      return newInc;
    }
    return null;
  }

  public injectGasHazard(sensorId: string = 'GAS-CHEM-02') {
    const sensor = this.gasSensors.find(s => s.id === sensorId);
    if (sensor) {
      sensor.h2sPpm = 14.5; // Exceeds 10 ppm OSHA limit
      sensor.status = 'CRITICAL_EVACUATE';

      const newInc: SafetyIncidentLog = {
        id: `INC-2026-0${this.incidentLogs.length + 19}`,
        type: 'HAZMAT_EXPOSURE',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        location: sensor.location,
        involvedPerson: 'Zone Workers Alerted',
        description: `H2S gas concentration elevated to 14.5 ppm at ${sensor.location}. Exhaust purge fans forced to 100%.`,
        severity: 'CRITICAL',
        oshaRecordable: true,
        rootCause: 'Electrolyte vapor concentration spike detected by electrochemical cell.',
        correctiveActionCapa: 'Evacuate chemical vault; activate emergency nitrogen purge scrubbers.',
        status: 'OPEN',
        investigator: 'Automated HSE Gas Matrix'
      };
      this.incidentLogs.unshift(newInc);
      return newInc;
    }
    return null;
  }

  public triggerEvacuationDrill() {
    this.evacuationDrillActive = true;
    this.musterStations.forEach(m => {
      m.status = 'DRILL_ACTIVE';
      m.missingCount = Math.floor(Math.random() * 3) + 1; // 1-3 missing for realism
    });
  }

  public stopEvacuationDrill() {
    this.evacuationDrillActive = false;
    this.musterStations.forEach(m => {
      m.status = 'STANDBY';
      m.missingCount = 0;
    });
  }

  public resolveWorkerSos(workerId: string) {
    const worker = this.workers.find(w => w.id === workerId);
    if (worker) {
      worker.fallStatus = 'NORMAL';
      worker.sosActive = false;
      worker.heartRate = 76;
      worker.lastCheckInSecondsAgo = 0;
    }
  }

  public resetZoneInterlock(zoneId: string) {
    const zone = this.geofenceZones.find(z => z.id === zoneId);
    if (zone) {
      zone.intrusionAlarm = false;
      zone.eStopTriggered = false;
    }
  }

  public resetGasHazard(sensorId: string = 'GAS-CHEM-02') {
    const sensor = this.gasSensors.find(s => s.id === sensorId);
    if (sensor) {
      sensor.h2sPpm = 0.4;
      sensor.status = 'SAFE';
    }
  }

  public toggleLoto(permitId: string, newStatus: LotoPermit['status']) {
    const permit = this.lotoPermits.find(p => p.id === permitId);
    if (permit) {
      permit.status = newStatus;
    }
  }

  public acknowledgeIncident(incidentId: string) {
    const inc = this.incidentLogs.find(i => i.id === incidentId);
    if (inc && inc.status === 'OPEN') {
      inc.status = 'CAPA_ASSIGNED';
    }
  }
}

export const humanSecurityEngine = new HumanSecurityEngine();
