import {
  ScadaTelemetry,
  ScadaAlarm,
  ProtocolPacket,
  ModbusRegister,
  CellTelemetry,
  ScadaProtocolType
} from '../types';

export type EmsMode = 'AUTO_ECO' | 'PEAK_SHAVING' | 'ISLANDED_EMERGENCY' | 'GRID_SUPPORT' | 'STORM_RESILIENCE';

export interface ScadaSimulatorOverrides {
  solarOverride: number | null;
  windOverride: number | null;
  loadOverride: number | null;
  batterySocOverride: number | null;
  ambientTempOverride: number | null;
  cloudCoverOverride: number | null;
  gridStatusOverride: 1 | 0 | null;
  inverterStatusOverride: 'RUNNING' | 'STANDBY' | 'FAULT' | 'TRIPPED' | null;
  solarEnabled: boolean;
  windEnabled: boolean;
  batteryEnabled: boolean;
  gridEnabled: boolean;
  fanCoolingOverride: boolean | null;
}

export interface ScadaAssetFaceplate {
  id: 'solar' | 'wind' | 'battery' | 'inverter' | 'grid' | 'load';
  name: string;
  tag: string;
  substation: string;
  voltageRating: string;
  powerRating: string;
  status: 'ONLINE' | 'STANDBY' | 'WARNING' | 'FAULT' | 'ISLANDED';
  efficiency: number;
  temperature: number;
  setpoints: Record<string, number | string | boolean>;
  protocols: string[];
}

export interface HourlyForecastPoint {
  hour: number;
  timeLabel: string;
  loadForecast: number;
  solarForecast: number;
  windForecast: number;
  totalRenewable: number;
  netGridExpected: number;
  tariffRate: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// FAULT CODE KNOWLEDGE BASE (AI SCADA ADVISOR)
// ─────────────────────────────────────────────────────────────────────────────

export const FAULT_KNOWLEDGE_BASE: Record<string, {
  source: 'SOLAR' | 'WIND' | 'BATTERY' | 'INVERTER' | 'GRID' | 'LOAD' | 'COMMUNICATION';
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  message: string;
  rootCause: string;
  repairActions: string[];
  estimatedTime: string;
  safetyWarning: string;
}> = {
  'FLT-BESS-01': {
    source: 'BATTERY',
    severity: 'CRITICAL',
    message: 'BESS Cell Module 04 Thermal Runaway Alert (>52°C)',
    rootCause: 'Localized thermal dissipation bottleneck due to coolant pump cavitation and micro-shorting in pouch cell layer 14.',
    repairActions: [
      '1. Isolate DC Contactor K1 to cut charging current immediately.',
      '2. Force glycol cooling loop to 100% duty cycle.',
      '3. Inspect BMS temperature thermistor harness on Rack 02.',
      '4. Execute automated thermal equilibration cycle.'
    ],
    estimatedTime: '25 Mins',
    safetyWarning: 'HIGH VOLTAGE DC HAZARD: Wear Arc-Flash 40 cal/cm² PPE before rack entry.'
  },
  'FLT-BESS-02': {
    source: 'BATTERY',
    severity: 'WARNING',
    message: 'BESS Cell Voltage Imbalance Exceeds 85mV Limit',
    rootCause: 'Cell #07 internal impedance variance caused state-of-charge drift during high C-rate peak shaving discharge.',
    repairActions: [
      '1. Enable active passive shunt balancing circuit across cells #05 - #08.',
      '2. Reduce discharge C-rate from 1.5C to 0.4C.',
      '3. Run full CV absorption calibration at 54.6V.'
    ],
    estimatedTime: '45 Mins',
    safetyWarning: 'Ensure DC bus voltage is monitored continuously during shunt balancing.'
  },
  'FLT-INV-01': {
    source: 'INVERTER',
    severity: 'CRITICAL',
    message: 'PCS 3-Phase Inverter DC Link Overvoltage (>820V DC)',
    rootCause: 'Rapid load rejection on Factory Feeder 02 during full solar generation caused energy reflux into DC link capacitors.',
    repairActions: [
      '1. Modulate PWM switching angle to absorb reactive power.',
      '2. Engage chopper brake resistor bank to bleed excess DC rail energy.',
      '3. Verify Phase-A/B/C synchronization angle with grid bus.'
    ],
    estimatedTime: '15 Mins',
    safetyWarning: 'Wait 10 minutes after shutdown for DC bus capacitors to discharge below 50V.'
  },
  'FLT-INV-02': {
    source: 'INVERTER',
    severity: 'WARNING',
    message: 'IGBT Inverter Heat Sink Temperature Warning (>78°C)',
    rootCause: 'Exhaust fan duct partially clogged by ambient industrial particulates, decreasing heat exchanger CFM by 38%.',
    repairActions: [
      '1. Switch auxiliary cooling fans from Auto to Force Max RPM.',
      '2. Inspect and vacuum intake filter mesh.',
      '3. Derate inverter continuous throughput to 85% until heatsink drops below 65°C.'
    ],
    estimatedTime: '20 Mins',
    safetyWarning: 'Internal heatsinks remain extremely hot for up to 30 mins after derating.'
  },
  'FLT-GRID-01': {
    source: 'GRID',
    severity: 'CRITICAL',
    message: 'Grid Under-Frequency Deviation (49.42 Hz) - Anti-Islanding Trip Imminent',
    rootCause: 'Regional utility grid transmission corridor trip caused sudden load-generation imbalance.',
    repairActions: [
      '1. Ramp BESS fast frequency response (FFR) to +35 kW synthetic inertia injection.',
      '2. Shed non-critical Tier 3 auxiliary HVAC loads.',
      '3. Prepare microgrid breaker for seamless islanding transfer if frequency drops below 49.30 Hz.'
    ],
    estimatedTime: 'Instant / Auto',
    safetyWarning: 'IEEE 1547 compliant islanding protocol actively engaging.'
  },
  'FLT-SOL-01': {
    source: 'SOLAR',
    severity: 'WARNING',
    message: 'Solar Array String 03 MPPT Efficiency Degradation (<72%)',
    rootCause: 'Partial shade and localized dust accumulation on south-west array tilt angle.',
    repairActions: [
      '1. Trigger automated robotic dry-cleaning brush on Array Bay C.',
      '2. Check string combiner box diode bypass continuity.',
      '3. Re-scan I-V characteristic curve for micro-crack hot spots.'
    ],
    estimatedTime: '30 Mins',
    safetyWarning: 'Lockout/Tagout (LOTO) combiner box DC isolators before physical touch.'
  },
  'FLT-WND-01': {
    source: 'WIND',
    severity: 'WARNING',
    message: 'Wind Turbine #01 Nacelle Gearbox High Vibration (4.8 mm/s RMS)',
    rootCause: 'Turbulence gust shear induced resonant frequency on yaw bearing assembly.',
    repairActions: [
      '1. Feather blade pitch angle by +4.5 degrees to reduce aerodynamic thrust.',
      '2. Engage regenerative electromagnetic yaw brake dampening.',
      '3. Lubricate main shaft bearing bearing cartridge.'
    ],
    estimatedTime: '35 Mins',
    safetyWarning: 'Do not climb nacelle tower when wind speeds exceed 12 m/s.'
  },
  'FLT-COMM-01': {
    source: 'COMMUNICATION',
    severity: 'WARNING',
    message: 'Modbus TCP Timeout on Substation Energy Meter (Port 502)',
    rootCause: 'Ethernet switch port buffer overflow caused by high broadcast traffic during network scan.',
    repairActions: [
      '1. Ping gateway 192.168.1.104 and flush ARP table.',
      '2. Fall back to CAN Bus secondary telemetry channel.',
      '3. Restart RS-485 to Modbus TCP gateway transceiver.'
    ],
    estimatedTime: '10 Mins',
    safetyWarning: 'Fail-safe mode maintains last known good dispatch setpoint for 60 seconds.'
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// SCADA CORE ENGINE CLASS
// ─────────────────────────────────────────────────────────────────────────────

export class ScadaEngine {
  private telemetry: ScadaTelemetry;
  private alarms: ScadaAlarm[] = [];
  private history: ScadaTelemetry[] = [];
  private protocolPackets: ProtocolPacket[] = [];
  private cells: CellTelemetry[] = [];
  private emsMode: EmsMode = 'AUTO_ECO';
  private overrides: ScadaSimulatorOverrides = {
    solarOverride: null,
    windOverride: null,
    loadOverride: null,
    batterySocOverride: null,
    ambientTempOverride: null,
    cloudCoverOverride: null,
    gridStatusOverride: null,
    inverterStatusOverride: null,
    solarEnabled: true,
    windEnabled: true,
    batteryEnabled: true,
    gridEnabled: true,
    fanCoolingOverride: null
  };
  private peakTariffStart = 14; // 14:00
  private peakTariffEnd = 20; // 20:00
  private peakRate = 0.18; // $/kWh
  private offPeakRate = 0.05; // $/kWh
  private totalKwhCleanGenerated = 1420;
  private totalSavingsUsd = 348.50;

  constructor() {
    this.telemetry = this.getInitialTelemetry();
    this.initCells();
    this.initAlarms();
    this.generateInitialPackets();
    this.generateInitialHistory();
  }

  private getInitialTelemetry(): ScadaTelemetry {
    return {
      Solar_Power: 24.8,
      Solar_Voltage: 485.2,
      Solar_Current: 51.1,
      Solar_Temperature: 38.4,
      Solar_Irradiance: 840.0,
      Wind_Power: 18.5,
      Wind_Speed: 8.4,
      Wind_RPM: 28.2,
      Wind_Pitch: 2.1,
      Battery_SOC: 68.5,
      Battery_SOH: 97.8,
      Battery_Voltage: 518.4,
      Battery_Current: -14.2, // Charging
      Battery_Temperature: 27.6,
      Battery_C_Rate: 0.28,
      Battery_Cycles: 412,
      Grid_Status: 1,
      Grid_Voltage: 11040,
      Grid_Frequency: 50.01,
      Grid_Power: -6.8, // Exporting surplus
      Grid_PowerFactor: 0.992,
      Load_Demand: 36.5,
      Load_Current: 88.0,
      Load_Voltage: 415.0,
      Inverter_Status: 'RUNNING',
      Inverter_Efficiency: 98.4,
      Inverter_Output_Power: 43.3,
      Inverter_Temp: 44.8,
      ems_action: 'SOLAR_TO_LOAD',
      electricity_cost: 0.05,
      accumulated_savings: 348.50,
      carbon_avoided_kg: 1164.4,
      timestamp: Date.now() / 1000,
      hour: 13.5,
      ambient_temp: 26.2,
      cloud_cover: 0.15,
      load_shedding_level: 0,
      original_load: 36.5,
      active_failures: []
    };
  }

  private initCells() {
    this.cells = Array.from({ length: 16 }, (_, i) => ({
      cellId: i + 1,
      voltage: 3.240 + (Math.sin(i * 1.3) * 0.015),
      temp: 26.5 + (i === 3 ? 3.8 : Math.sin(i * 0.8) * 1.2),
      balanceStatus: i === 3 ? 'BALANCING' : 'BALANCED'
    }));
  }

  private initAlarms() {
    this.alarms = [
      {
        id: 'ALM-1001',
        source: 'BATTERY',
        severity: 'WARNING',
        status: 'ACTIVE',
        message: FAULT_KNOWLEDGE_BASE['FLT-BESS-02'].message,
        fault_code: 'FLT-BESS-02',
        timestamp: Date.now() / 1000 - 450,
        root_cause: FAULT_KNOWLEDGE_BASE['FLT-BESS-02'].rootCause,
        repair_actions: FAULT_KNOWLEDGE_BASE['FLT-BESS-02'].repairActions,
        estimated_time: FAULT_KNOWLEDGE_BASE['FLT-BESS-02'].estimatedTime,
        safety_warning: FAULT_KNOWLEDGE_BASE['FLT-BESS-02'].safetyWarning,
        subsystem: 'Rack 01 BMS Controller'
      },
      {
        id: 'ALM-1002',
        source: 'SOLAR',
        severity: 'INFO',
        status: 'ACKNOWLEDGED',
        message: FAULT_KNOWLEDGE_BASE['FLT-SOL-01'].message,
        fault_code: 'FLT-SOL-01',
        timestamp: Date.now() / 1000 - 1800,
        root_cause: FAULT_KNOWLEDGE_BASE['FLT-SOL-01'].rootCause,
        repair_actions: FAULT_KNOWLEDGE_BASE['FLT-SOL-01'].repairActions,
        estimated_time: FAULT_KNOWLEDGE_BASE['FLT-SOL-01'].estimatedTime,
        safety_warning: FAULT_KNOWLEDGE_BASE['FLT-SOL-01'].safetyWarning,
        subsystem: 'Array Bay C Combiner'
      }
    ];
  }

  private generateInitialPackets() {
    const protocols: ScadaProtocolType[] = ['modbus', 'mqtt', 'can', 'opcua', 'iec61850'];
    const now = new Date();
    
    this.protocolPackets = [
      {
        id: 'PKT-901',
        protocol: 'can',
        timestamp: now.toLocaleTimeString(),
        source: 'BMS_NODE_01 (0x18FF0202)',
        destination: 'EMS_MASTER_ECU',
        identifier: '0x18FF0202 [Ext ID]',
        data: '51 84 14 02 44 26 68 00 (V:518.4V, I:-14.2A, SOC:68%, T:27.6°C)',
        status: 'CRC_OK'
      },
      {
        id: 'PKT-902',
        protocol: 'modbus',
        timestamp: now.toLocaleTimeString(),
        source: 'PLC_SUBSTATION_01',
        destination: 'SCADA_SERVER (192.168.1.100)',
        identifier: 'Reg 40012: Inverter_Active_Power',
        data: '0x01 0x03 0x00 0x0B 0x00 0x01 -> Value: 43300 W (43.3 kW)',
        status: 'VALID'
      },
      {
        id: 'PKT-903',
        protocol: 'mqtt',
        timestamp: now.toLocaleTimeString(),
        source: 'SOLAR_MPPT_GW',
        destination: 'broker.industrial.local:1883',
        identifier: 'scada/microgrid/solar/telemetry',
        data: '{"irradiance": 840.0, "power_kw": 24.8, "mppt_eff": 99.1, "string_v": 485.2}',
        status: 'VALID'
      },
      {
        id: 'PKT-904',
        protocol: 'opcua',
        timestamp: now.toLocaleTimeString(),
        source: 'WIND_TURBINE_PLC',
        destination: 'opc.tcp://10.0.4.12:4840',
        identifier: 'ns=2;s=Turbine.Nacelle.Vibration_RMS',
        data: 'Double: 2.14 mm/s | Quality: Good_Completeness (0x00)',
        status: 'VALID'
      },
      {
        id: 'PKT-905',
        protocol: 'iec61850',
        timestamp: now.toLocaleTimeString(),
        source: 'BAY_CONTROLLER_BCU1',
        destination: 'MULTICAST (01:0C:CD:01:00:01)',
        identifier: 'GOOSE: CTRL/LLN0$GO$gcb01 [AppID: 0x3001]',
        data: 'Status: CLOSED (10) | TimeQuality: ClockSync (4ms fast interlock)',
        status: 'VALID'
      }
    ];
  }

  private generateInitialHistory() {
    const points: ScadaTelemetry[] = [];
    const baseTime = Date.now() / 1000 - (30 * 60); // past 30 mins
    
    for (let i = 0; i < 20; i++) {
      const t = baseTime + (i * 90);
      const hour = 12 + (i * 0.05);
      const solar = Math.max(0, 26 * Math.sin(((hour - 6) / 12) * Math.PI) + (Math.sin(i) * 1.5));
      const wind = Math.max(2, 16 + Math.cos(i * 0.7) * 4);
      const load = 34 + Math.sin(i * 0.5) * 5;
      const batterySoc = 65 + i * 0.2;
      const totalGen = solar + wind;
      const netGrid = load - totalGen;
      
      points.push({
        ...this.telemetry,
        timestamp: t,
        hour,
        Solar_Power: Number(solar.toFixed(1)),
        Wind_Power: Number(wind.toFixed(1)),
        Load_Demand: Number(load.toFixed(1)),
        Battery_SOC: Number(batterySoc.toFixed(1)),
        Grid_Power: Number(netGrid.toFixed(1)),
        Inverter_Output_Power: Number(totalGen.toFixed(1))
      });
    }
    this.history = points;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // REAL-TIME PHYSICS & TELEMETRY TICK (Calculates full microgrid energy balance)
  // ─────────────────────────────────────────────────────────────────────────

  public tick(deltaTimeSeconds: number = 1.0): ScadaTelemetry {
    const now = Date.now() / 1000;
    const currentHour = (new Date().getHours() + new Date().getMinutes() / 60) % 24;

    const ambientTemp = this.overrides.ambientTempOverride !== null 
      ? this.overrides.ambientTempOverride 
      : 24.0 + 6.0 * Math.sin(((currentHour - 8) / 16) * Math.PI);

    const cloudCover = this.overrides.cloudCoverOverride !== null
      ? this.overrides.cloudCoverOverride
      : 0.15 + (Math.sin(now / 40) * 0.1);

    // 1. Solar Physics (Irradiance curve + PV temperature derating)
    let solarPower = 0;
    let solarIrradiance = 0;
    if (this.overrides.solarEnabled) {
      if (this.overrides.solarOverride !== null) {
        solarPower = this.overrides.solarOverride;
        solarIrradiance = solarPower * 35.0;
      } else {
        const sunElevation = Math.max(0, Math.sin(((currentHour - 6) / 12) * Math.PI));
        solarIrradiance = sunElevation * 1000.0 * (1.0 - cloudCover * 0.75);
        // PV cell temp rises above ambient
        const cellTemp = ambientTemp + (solarIrradiance / 800.0) * 22.0;
        // 0.4% loss per deg above 25°C
        const tempDerate = 1.0 - Math.max(0, (cellTemp - 25.0) * 0.004);
        const nameplateKw = 35.0; // 35 kW peak system
        solarPower = Math.max(0, (solarIrradiance / 1000.0) * nameplateKw * tempDerate * 0.96);
      }
    }

    const solarVoltage = solarPower > 0 ? 460.0 + (solarPower * 0.8) : 0;
    const solarCurrent = solarVoltage > 0 ? (solarPower * 1000) / solarVoltage : 0;
    const solarTemp = ambientTemp + (solarIrradiance / 800.0) * 20.0;

    // 2. Wind Physics (Cubic power curve with cut-in 3m/s, rated 12m/s, cut-out 25m/s)
    let windPower = 0;
    let windSpeed = 8.0;
    if (this.overrides.windEnabled) {
      if (this.overrides.windOverride !== null) {
        windPower = this.overrides.windOverride;
        windSpeed = Math.max(3.0, Math.pow(windPower / 0.05, 1 / 3));
      } else {
        windSpeed = Math.max(1.0, 7.5 + Math.sin(now / 15) * 2.5 + (Math.random() - 0.5) * 0.8);
        const nameplateWindKw = 25.0;
        if (windSpeed < 3.0 || windSpeed > 25.0) {
          windPower = 0;
        } else if (windSpeed >= 12.0) {
          windPower = nameplateWindKw;
        } else {
          // Cubic transition
          windPower = nameplateWindKw * Math.pow((windSpeed - 3.0) / 9.0, 3);
        }
      }
    }
    const windRpm = windSpeed > 3.0 ? 12.0 + (windSpeed * 2.1) : 0;
    const windPitch = windSpeed > 12.0 ? (windSpeed - 12.0) * 2.5 : 0.5;

    // 3. Factory Load (Base manufacturing demand + dynamic peaks)
    let baseLoad = 38.0;
    if (this.overrides.loadOverride !== null) {
      baseLoad = this.overrides.loadOverride;
    } else {
      const shiftMultiplier = (currentHour >= 8 && currentHour <= 18) ? 1.35 : 0.85;
      baseLoad = (32.0 + Math.sin(now / 25) * 4.0 + (Math.random() - 0.5) * 1.5) * shiftMultiplier;
    }
    const originalLoad = baseLoad;

    // 4. Tariff Rate ($/kWh)
    const isPeakTariff = currentHour >= this.peakTariffStart && currentHour < this.peakTariffEnd;
    const electricityCost = isPeakTariff ? this.peakRate : this.offPeakRate;

    // 5. Intelligent EMS Arbitration & Power Flow
    let batterySoc = this.overrides.batterySocOverride !== null 
      ? this.overrides.batterySocOverride 
      : this.telemetry.Battery_SOC;
    
    let batterySoh = this.telemetry.Battery_SOH;
    let gridStatus = this.overrides.gridStatusOverride !== null 
      ? this.overrides.gridStatusOverride 
      : (this.overrides.gridEnabled ? 1 : 0);

    const totalRenewable = solarPower + windPower;
    let netSurplusDeficit = totalRenewable - baseLoad; // Positive=surplus, Negative=deficit

    let emsAction: ScadaTelemetry['ems_action'] = 'STANDBY';
    let batteryCurrent = 0; // Negative = charging, Positive = discharging
    let batteryPowerKw = 0;
    let gridPowerKw = 0; // Positive = import, Negative = export
    let loadSheddingLevel: 0 | 1 | 2 | 3 = 0;

    // Execute EMS Mode Strategy
    if (gridStatus === 0 || this.emsMode === 'ISLANDED_EMERGENCY') {
      // Islanded mode: BESS forms grid frequency
      emsAction = 'ISLANDED';
      if (netSurplusDeficit >= 0) {
        // Charge surplus into battery if not full
        if (batterySoc < 98.0 && this.overrides.batteryEnabled) {
          batteryPowerKw = -Math.min(25.0, netSurplusDeficit);
          emsAction = 'BATT_CHARGE';
        }
      } else {
        // Discharging battery to meet load
        const needed = Math.abs(netSurplusDeficit);
        if (batterySoc > 15.0 && this.overrides.batteryEnabled) {
          batteryPowerKw = Math.min(30.0, needed);
          emsAction = 'BATT_DISCHARGE';
          if (needed > 30.0) {
            // Need load shedding
            loadSheddingLevel = 1;
            baseLoad -= (needed - 30.0);
          }
        } else {
          // Critical battery empty in islanded mode -> Shed non-essential loads
          loadSheddingLevel = 2;
          baseLoad = Math.max(12.0, totalRenewable);
        }
      }
      gridPowerKw = 0;
    } else if (this.emsMode === 'PEAK_SHAVING' || isPeakTariff) {
      // Discharge battery during peak to avoid high tariff grid import
      if (netSurplusDeficit < 0) {
        const deficit = Math.abs(netSurplusDeficit);
        if (batterySoc > 20.0 && this.overrides.batteryEnabled) {
          batteryPowerKw = Math.min(25.0, deficit);
          emsAction = 'BATT_DISCHARGE';
          gridPowerKw = Math.max(0, deficit - batteryPowerKw);
        } else {
          gridPowerKw = deficit;
        }
      } else {
        // Surplus during peak -> export to grid for revenue credit!
        if (batterySoc >= 85.0 || !this.overrides.batteryEnabled) {
          gridPowerKw = -netSurplusDeficit;
          emsAction = 'GRID_EXPORT';
        } else {
          batteryPowerKw = -Math.min(15.0, netSurplusDeficit);
          gridPowerKw = -(netSurplusDeficit + batteryPowerKw);
          emsAction = 'BATT_CHARGE';
        }
      }
    } else {
      // Default: AUTO_ECO mode (Self-consumption maximization)
      if (netSurplusDeficit >= 0) {
        // Prioritize charging battery
        if (batterySoc < 95.0 && this.overrides.batteryEnabled) {
          batteryPowerKw = -Math.min(20.0, netSurplusDeficit);
          gridPowerKw = -(netSurplusDeficit + batteryPowerKw);
          emsAction = 'BATT_CHARGE';
        } else {
          // Export surplus to grid
          gridPowerKw = -netSurplusDeficit;
          emsAction = 'GRID_EXPORT';
        }
      } else {
        // Deficit: Check if battery has cheap stored energy
        const deficit = Math.abs(netSurplusDeficit);
        if (batterySoc > 35.0 && this.overrides.batteryEnabled) {
          batteryPowerKw = Math.min(20.0, deficit);
          gridPowerKw = deficit - batteryPowerKw;
          emsAction = 'BATT_DISCHARGE';
        } else {
          // Import from grid
          gridPowerKw = deficit;
          emsAction = 'GRID_IMPORT';
        }
      }
    }

    // Battery SOC integration (Capacity: 100 kWh battery pack)
    const packCapacityKwh = 100.0;
    const socDelta = (-batteryPowerKw * (deltaTimeSeconds / 3600.0) / packCapacityKwh) * 100.0;
    if (this.overrides.batterySocOverride === null) {
      batterySoc = Math.max(5.0, Math.min(100.0, batterySoc + socDelta));
    }

    const batteryVoltage = 480.0 + (batterySoc / 100.0) * 45.0;
    batteryCurrent = (batteryPowerKw * 1000) / (batteryVoltage || 500);
    const batteryCRate = Math.abs(batteryPowerKw) / packCapacityKwh;

    // Battery thermal model with fan override
    let fanCooling = this.overrides.fanCoolingOverride;
    if (fanCooling === null) {
      fanCooling = this.telemetry.Battery_Temperature > 32.0;
    }
    const heatGen = (batteryCRate * batteryCRate) * 12.0;
    const coolingEff = fanCooling ? 6.0 : 1.5;
    const battTempTarget = ambientTemp + Math.max(0, heatGen - coolingEff);
    const batteryTemp = this.telemetry.Battery_Temperature + (battTempTarget - this.telemetry.Battery_Temperature) * 0.05;

    // Inverter Physics
    let inverterStatus: ScadaTelemetry['Inverter_Status'] = this.overrides.inverterStatusOverride || 'RUNNING';
    const inverterOutputPower = Math.max(0, totalRenewable + (batteryPowerKw > 0 ? batteryPowerKw : 0));
    const inverterEfficiency = inverterOutputPower > 5.0 ? 98.6 - (inverterOutputPower / 80.0) * 0.8 : 94.0;
    const inverterTemp = ambientTemp + (inverterOutputPower / 50.0) * 18.0;

    // Grid frequency and voltage fluctuations
    const gridFreq = gridStatus === 1 ? 50.0 + (Math.sin(now / 8) * 0.03) + (Math.random() - 0.5) * 0.01 : 50.0;
    const gridVolt = gridStatus === 1 ? 11000 + Math.sin(now / 12) * 80 : 0;

    // Economic and Carbon Accumulation
    const cleanKwhThisTick = (totalRenewable * (deltaTimeSeconds / 3600.0));
    this.totalKwhCleanGenerated += cleanKwhThisTick;
    
    const costAvoided = cleanKwhThisTick * electricityCost;
    const exportEarnings = gridPowerKw < 0 ? Math.abs(gridPowerKw) * (deltaTimeSeconds / 3600.0) * (electricityCost * 0.8) : 0;
    this.totalSavingsUsd += (costAvoided + exportEarnings);
    const carbonAvoidedKg = this.totalKwhCleanGenerated * 0.82; // 0.82 kg CO2 / kWh grid factor

    // Update 16-Cell Matrix
    this.cells = this.cells.map((cell) => {
      const cellV = (batteryVoltage / 16.0) + (Math.sin(cell.cellId * 1.5 + now / 20) * 0.008);
      const cellT = batteryTemp + (cell.cellId === 4 ? 4.2 : (cell.cellId % 3) * 0.4);
      return {
        ...cell,
        voltage: Number(cellV.toFixed(3)),
        temp: Number(cellT.toFixed(1)),
        balanceStatus: cell.cellId === 4 && cellT > 42.0 ? 'OVER_VOLT' : (Math.abs(cellV - (batteryVoltage / 16)) > 0.025 ? 'BALANCING' : 'BALANCED')
      };
    });

    // Check Auto-Generated Alarms based on physics thresholds
    this.evaluatePhysicalAlarms(batteryTemp, batterySoc, inverterTemp, gridFreq, gridStatus);

    const activeFailureCodes = this.alarms.filter(a => a.status === 'ACTIVE').map(a => a.fault_code);

    const newTelemetry: ScadaTelemetry = {
      Solar_Power: Number(solarPower.toFixed(1)),
      Solar_Voltage: Number(solarVoltage.toFixed(1)),
      Solar_Current: Number(solarCurrent.toFixed(1)),
      Solar_Temperature: Number(solarTemp.toFixed(1)),
      Solar_Irradiance: Number(solarIrradiance.toFixed(1)),
      Wind_Power: Number(windPower.toFixed(1)),
      Wind_Speed: Number(windSpeed.toFixed(1)),
      Wind_RPM: Number(windRpm.toFixed(1)),
      Wind_Pitch: Number(windPitch.toFixed(1)),
      Battery_SOC: Number(batterySoc.toFixed(1)),
      Battery_SOH: Number(batterySoh.toFixed(1)),
      Battery_Voltage: Number(batteryVoltage.toFixed(1)),
      Battery_Current: Number(batteryCurrent.toFixed(1)),
      Battery_Temperature: Number(batteryTemp.toFixed(1)),
      Battery_C_Rate: Number(batteryCRate.toFixed(2)),
      Battery_Cycles: 412,
      Grid_Status: gridStatus as (1 | 0),
      Grid_Voltage: Number(gridVolt.toFixed(0)),
      Grid_Frequency: Number(gridFreq.toFixed(2)),
      Grid_Power: Number(gridPowerKw.toFixed(1)),
      Grid_PowerFactor: 0.992,
      Load_Demand: Number(baseLoad.toFixed(1)),
      Load_Current: Number(((baseLoad * 1000) / (415 * Math.sqrt(3) * 0.95)).toFixed(1)),
      Load_Voltage: 415.0,
      Inverter_Status: inverterStatus,
      Inverter_Efficiency: Number(inverterEfficiency.toFixed(1)),
      Inverter_Output_Power: Number(inverterOutputPower.toFixed(1)),
      Inverter_Temp: Number(inverterTemp.toFixed(1)),
      ems_action: emsAction,
      electricity_cost: electricityCost,
      accumulated_savings: Number(this.totalSavingsUsd.toFixed(2)),
      carbon_avoided_kg: Number(carbonAvoidedKg.toFixed(1)),
      timestamp: now,
      hour: Number(currentHour.toFixed(2)),
      ambient_temp: Number(ambientTemp.toFixed(1)),
      cloud_cover: Number(cloudCover.toFixed(2)),
      load_shedding_level: loadSheddingLevel,
      original_load: Number(originalLoad.toFixed(1)),
      active_failures: activeFailureCodes
    };

    this.telemetry = newTelemetry;

    // Append to rolling history
    this.history.push(newTelemetry);
    if (this.history.length > 50) {
      this.history.shift();
    }

    // Push new simulated protocol packet every few ticks
    if (Math.random() > 0.4) {
      this.generateLiveProtocolPacket(newTelemetry);
    }

    return newTelemetry;
  }

  private evaluatePhysicalAlarms(batteryTemp: number, batterySoc: number, inverterTemp: number, gridFreq: number, gridStatus: number) {
    // 1. High Battery Temp Alert
    if (batteryTemp > 48.0 && !this.alarms.some(a => a.fault_code === 'FLT-BESS-01' && a.status === 'ACTIVE')) {
      this.addAlarm('FLT-BESS-01');
    }
    // 2. Inverter Overheat Alert
    if (inverterTemp > 75.0 && !this.alarms.some(a => a.fault_code === 'FLT-INV-02' && a.status === 'ACTIVE')) {
      this.addAlarm('FLT-INV-02');
    }
    // 3. Grid Frequency Alert
    if ((gridFreq < 49.5 || gridFreq > 50.5) && gridStatus === 1 && !this.alarms.some(a => a.fault_code === 'FLT-GRID-01' && a.status === 'ACTIVE')) {
      this.addAlarm('FLT-GRID-01');
    }
  }

  private generateLiveProtocolPacket(t: ScadaTelemetry) {
    const protocols: ScadaProtocolType[] = ['modbus', 'mqtt', 'can', 'opcua', 'iec61850'];
    const p = protocols[Math.floor(Math.random() * protocols.length)];
    const id = `PKT-${Math.floor(1000 + Math.random() * 9000)}`;
    const time = new Date().toLocaleTimeString();

    let packet: ProtocolPacket;
    if (p === 'can') {
      packet = {
        id,
        protocol: 'can',
        timestamp: time,
        source: 'BMS_MASTER_01',
        destination: 'EMS_CAN_GW',
        identifier: '0x18FF0202',
        data: `SOC:${t.Battery_SOC}% | V:${t.Battery_Voltage}V | I:${t.Battery_Current}A | T:${t.Battery_Temperature}°C`,
        status: 'CRC_OK'
      };
    } else if (p === 'modbus') {
      packet = {
        id,
        protocol: 'modbus',
        timestamp: time,
        source: 'SUBSTATION_METER_01',
        destination: 'SCADA_RTU',
        identifier: 'Reg 40024: Grid_Active_Power',
        data: `0x01 0x03 0x00 0x18 -> ${t.Grid_Power} kW [Import/Export]`,
        status: 'VALID'
      };
    } else if (p === 'mqtt') {
      packet = {
        id,
        protocol: 'mqtt',
        timestamp: time,
        source: 'SOLAR_INVERTER_PCS',
        destination: 'scada/solar/live',
        identifier: 'scada/microgrid/pcs/power',
        data: JSON.stringify({ power_kw: t.Solar_Power, irrad: t.Solar_Irradiance, eff: t.Inverter_Efficiency }),
        status: 'VALID'
      };
    } else if (p === 'opcua') {
      packet = {
        id,
        protocol: 'opcua',
        timestamp: time,
        source: 'WIND_TURBINE_PLC',
        destination: 'opc.tcp://10.0.4.12',
        identifier: 'ns=2;s=Turbine.Rotor_RPM',
        data: `Double: ${t.Wind_RPM} RPM | Status: Good`,
        status: 'VALID'
      };
    } else {
      packet = {
        id,
        protocol: 'iec61850',
        timestamp: time,
        source: 'IED_BAY_RELAY',
        destination: 'GOOSE_MULTICAST',
        identifier: 'GOOSE: BAY1/MMXU1$MX$TotW',
        data: `ActivePower: ${t.Inverter_Output_Power} kW | Quality: 0x0000 | Latency: 2.4ms`,
        status: 'VALID'
      };
    }

    this.protocolPackets.unshift(packet);
    if (this.protocolPackets.length > 25) {
      this.protocolPackets.pop();
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ALARMS & ADVISOR MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────

  public addAlarm(faultCode: string): ScadaAlarm | null {
    const kb = FAULT_KNOWLEDGE_BASE[faultCode];
    if (!kb) return null;

    const alarm: ScadaAlarm = {
      id: `ALM-${Math.floor(1000 + Math.random() * 9000)}`,
      source: kb.source,
      severity: kb.severity,
      status: 'ACTIVE',
      message: kb.message,
      fault_code: faultCode,
      timestamp: Date.now() / 1000,
      root_cause: kb.rootCause,
      repair_actions: kb.repairActions,
      estimated_time: kb.estimatedTime,
      safety_warning: kb.safetyWarning,
      subsystem: `${kb.source} Subsystem Unit`
    };

    this.alarms.unshift(alarm);
    return alarm;
  }

  public acknowledgeAlarm(id: string) {
    this.alarms = this.alarms.map(a => a.id === id ? { ...a, status: 'ACKNOWLEDGED' } : a);
  }

  public clearAlarm(id: string) {
    this.alarms = this.alarms.filter(a => a.id !== id);
  }

  public repairAlarm(id: string) {
    const target = this.alarms.find(a => a.id === id);
    if (target) {
      // Fix physical root cause in simulator
      if (target.fault_code === 'FLT-BESS-01') {
        this.overrides.fanCoolingOverride = true;
      } else if (target.fault_code === 'FLT-INV-02') {
        this.overrides.fanCoolingOverride = true;
      } else if (target.fault_code === 'FLT-GRID-01') {
        this.overrides.gridStatusOverride = 1;
      }
      this.alarms = this.alarms.map(a => a.id === id ? { ...a, status: 'REPAIRED' } : a);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // GETTERS & SETTERS
  // ─────────────────────────────────────────────────────────────────────────

  public getTelemetry(): ScadaTelemetry {
    return this.telemetry;
  }

  public getAlarms(): ScadaAlarm[] {
    return this.alarms;
  }

  public getHistory(): ScadaTelemetry[] {
    return this.history;
  }

  public getProtocolPackets(): ProtocolPacket[] {
    return this.protocolPackets;
  }

  public getCells(): CellTelemetry[] {
    return this.cells;
  }

  public getEmsMode(): EmsMode {
    return this.emsMode;
  }

  public setEmsMode(mode: EmsMode) {
    this.emsMode = mode;
  }

  public getOverrides(): ScadaSimulatorOverrides {
    return this.overrides;
  }

  public setOverrides(partial: Partial<ScadaSimulatorOverrides>) {
    this.overrides = { ...this.overrides, ...partial };
  }

  public resetOverrides() {
    this.overrides = {
      solarOverride: null,
      windOverride: null,
      loadOverride: null,
      batterySocOverride: null,
      ambientTempOverride: null,
      cloudCoverOverride: null,
      gridStatusOverride: null,
      inverterStatusOverride: null,
      solarEnabled: true,
      windEnabled: true,
      batteryEnabled: true,
      gridEnabled: true,
      fanCoolingOverride: null
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 24-HOUR FORECASTER & MODBUS REGISTERS
  // ─────────────────────────────────────────────────────────────────────────

  public get24HourForecast(): HourlyForecastPoint[] {
    const hours: HourlyForecastPoint[] = [];
    const nowHour = Math.floor(new Date().getHours());

    for (let i = 0; i < 24; i++) {
      const h = (nowHour + i) % 24;
      const isDay = h >= 6 && h <= 18;
      const solar = isDay ? Math.max(0, 32 * Math.sin(((h - 6) / 12) * Math.PI)) : 0;
      const wind = 14 + Math.cos(h * 0.5) * 6;
      const isShift = h >= 8 && h <= 18;
      const load = (isShift ? 42 : 28) + Math.sin(h * 0.8) * 5;
      const isPeak = h >= this.peakTariffStart && h < this.peakTariffEnd;
      const tariff = isPeak ? this.peakRate : this.offPeakRate;

      hours.push({
        hour: h,
        timeLabel: `${h.toString().padStart(2, '0')}:00`,
        loadForecast: Number(load.toFixed(1)),
        solarForecast: Number(solar.toFixed(1)),
        windForecast: Number(wind.toFixed(1)),
        totalRenewable: Number((solar + wind).toFixed(1)),
        netGridExpected: Number((load - (solar + wind)).toFixed(1)),
        tariffRate: tariff
      });
    }
    return hours;
  }

  public getModbusRegisterTable(): ModbusRegister[] {
    const t = this.telemetry;
    return [
      { address: 40001, name: 'Solar_Active_Power_kW', type: 'Holding Register', value: t.Solar_Power, unit: 'kW', access: 'RO', description: 'PV array net generation' },
      { address: 40002, name: 'Solar_DC_Voltage_V', type: 'Holding Register', value: t.Solar_Voltage, unit: 'V', access: 'RO', description: 'MPPT string voltage' },
      { address: 40003, name: 'Solar_Irradiance', type: 'Holding Register', value: t.Solar_Irradiance, unit: 'W/m²', access: 'RO', description: 'Pyranometer sensor value' },
      { address: 40005, name: 'Wind_Active_Power_kW', type: 'Holding Register', value: t.Wind_Power, unit: 'kW', access: 'RO', description: 'Turbine generator output' },
      { address: 40006, name: 'Wind_Rotor_Speed_RPM', type: 'Holding Register', value: t.Wind_RPM, unit: 'RPM', access: 'RO', description: 'Main shaft tachometer' },
      { address: 40010, name: 'BESS_State_Of_Charge', type: 'Holding Register', value: t.Battery_SOC, unit: '%', access: 'RO', description: 'Pack Coulomb-counted SOC' },
      { address: 40011, name: 'BESS_DC_Bus_Voltage', type: 'Holding Register', value: t.Battery_Voltage, unit: 'V', access: 'RO', description: 'BESS main DC terminal' },
      { address: 40012, name: 'BESS_Current_Amps', type: 'Holding Register', value: t.Battery_Current, unit: 'A', access: 'RO', description: 'Positive=discharge, Neg=charge' },
      { address: 40015, name: 'PCS_Inverter_Power_kW', type: 'Holding Register', value: t.Inverter_Output_Power, unit: 'kW', access: 'RO', description: '3-Phase inverter output' },
      { address: 40016, name: 'PCS_Inverter_Efficiency', type: 'Holding Register', value: t.Inverter_Efficiency, unit: '%', access: 'RO', description: 'IGBT conversion efficiency' },
      { address: 40020, name: 'Grid_Intertie_Power_kW', type: 'Holding Register', value: t.Grid_Power, unit: 'kW', access: 'RO', description: 'Substation meter (Pos=Import)' },
      { address: 40021, name: 'Grid_Frequency_Hz', type: 'Holding Register', value: t.Grid_Frequency, unit: 'Hz', access: 'RO', description: '11kV bus frequency' },
      { address: 40030, name: 'Plant_Load_Demand_kW', type: 'Holding Register', value: t.Load_Demand, unit: 'kW', access: 'RO', description: 'Total industrial factory load' },
      { address: 40040, name: 'EMS_Dispatch_Mode', type: 'Holding Register', value: this.emsMode, unit: 'enum', access: 'RW', description: '0=ECO, 1=PEAK, 2=ISLAND' },
      { address: 1, name: 'Solar_DC_Breaker_Coil', type: 'Coil', value: this.overrides.solarEnabled ? 'CLOSED (1)' : 'OPEN (0)', unit: 'bool', access: 'RW', description: 'Main PV array contactor' },
      { address: 2, name: 'Wind_Turbine_Breaker_Coil', type: 'Coil', value: this.overrides.windEnabled ? 'CLOSED (1)' : 'OPEN (0)', unit: 'bool', access: 'RW', description: 'Wind intertie breaker' },
      { address: 3, name: 'BESS_Main_Contactor_Coil', type: 'Coil', value: this.overrides.batteryEnabled ? 'CLOSED (1)' : 'OPEN (0)', unit: 'bool', access: 'RW', description: 'Battery rack master contactor' },
      { address: 4, name: 'Grid_Intertie_Breaker_Coil', type: 'Coil', value: t.Grid_Status === 1 ? 'CLOSED (1)' : 'OPEN (0)', unit: 'bool', access: 'RW', description: 'Substation synchronization breaker' }
    ];
  }
}

// Global Singleton Instance
export const scadaEngine = new ScadaEngine();
