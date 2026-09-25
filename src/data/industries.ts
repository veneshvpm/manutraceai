import { IndustryConfig, IndustryType } from '../types';

export const INDUSTRIES: Record<IndustryType, IndustryConfig> = {
  automotive: {
    id: 'automotive',
    name: 'Automotive & Precision Engineering',
    tagline: 'Precision powertrain, chassis, brake systems and EV assemblies',
    terminology: {
      productLabel: 'Component Part',
      batchLabel: 'Production Lot',
      materialLabel: 'Raw Alloy / Polymer',
      unitLabel: 'Units',
      processLabel: 'Machining & Assembly Process',
    },
    sampleFocus: 'High-tolerance CNC machining, thermal tempering, safety-critical brake components'
  },
  electronics: {
    id: 'electronics',
    name: 'Semiconductor & Electronics',
    tagline: 'SMT assembly, microcontrollers, multilayer PCBs and high-speed telemetry',
    terminology: {
      productLabel: 'Electronic Module',
      batchLabel: 'Wafer / SMT Lot',
      materialLabel: 'Substrate & Solder Paste',
      unitLabel: 'Modules',
      processLabel: 'Reflow & Wire Bonding',
    },
    sampleFocus: 'Reflow soldering temperature profiles, thermal paste voiding, ESD risks'
  },
  pharmaceutical: {
    id: 'pharmaceutical',
    name: 'Pharmaceutical & BioTech',
    tagline: 'Sterile injectables, active pharmaceutical ingredients (API) and cGMP compliance',
    terminology: {
      productLabel: 'Dosage Form / Vial',
      batchLabel: 'Synthesis Batch',
      materialLabel: 'Active Pharmaceutical Ingredient (API)',
      unitLabel: 'Vials',
      processLabel: 'Bioreactor & Lyophilization',
    },
    sampleFocus: 'Sterility assurance, incubation temperatures, autoclaving pressure, FDA 21 CFR Part 11'
  },
  food: {
    id: 'food',
    name: 'Food & Beverage Processing',
    tagline: 'Farm-to-fork cold chain, pasteurization integrity and allergen containment',
    terminology: {
      productLabel: 'Packaged SKU',
      batchLabel: 'Harvest / Vat Lot',
      materialLabel: 'Agricultural Bulk Inflow',
      unitLabel: 'Cartons',
      processLabel: 'Pasteurization & Homogenization',
    },
    sampleFocus: 'HACCP critical control points, pasteurization dwell time, seal integrity'
  },
  textile: {
    id: 'textile',
    name: 'Technical Textiles & Apparel',
    tagline: 'Advanced technical fibers, waterproof membranes and composite weaves',
    terminology: {
      productLabel: 'Textile Roll / Garment',
      batchLabel: 'Dye & Weave Lot',
      materialLabel: 'Polymer Yarn / Fiber',
      unitLabel: 'Meters',
      processLabel: 'Dyeing, Weaving & Curing',
    },
    sampleFocus: 'Tensile tensile load, dye bath pH & temp variance, moisture-wicking consistency'
  },
  energy: {
    id: 'energy',
    name: 'Clean Energy & Microgrid SCADA',
    tagline: 'Renewable Solar/Wind generation, BESS battery storage, EMS dispatch & Smart Grid Intertie',
    terminology: {
      productLabel: 'Grid Asset / Generation Unit',
      batchLabel: 'Dispatch Block / Telemetry Frame',
      materialLabel: 'Raw Power / BESS Chemistry',
      unitLabel: 'kWh / MW',
      processLabel: 'PCS Inversion & EMS Arbitration',
    },
    sampleFocus: 'Frequency stability 50.0Hz, BESS cell thermal runaway prevention, TOU tariff peak-shaving'
  }
};

