# ManuTrace AI™ — Exhaustive Platform Feature Specification & Operational Manual
**Enterprise Industrial AI, Digital Product Passport (DPP) & Supply Chain Traceability Operating System**
*Document Version: 2.4 LTS | Release Date: September 2026 | Document Reference: MT-SPEC-2026-V2*

---

## 📑 TABLE OF CONTENTS
1. [Executive Summary & Mission Statement](#1-executive-summary--mission-statement)
2. [Global Technology Stack & Infrastructure](#2-global-technology-stack--infrastructure)
3. [Multi-Sector Configurable Engine (5 Industry Sectors)](#3-multi-sector-configurable-engine)
4. [Master UI Layout, Navigation & Global Controls](#4-master-ui-layout-navigation--global-controls)
5. [Productivity Hubs, Global Modals & Speed-Dials](#5-productivity-hubs-global-modals--speed-dials)
6. [Exhaustive Feature Specification: All 17 Core Modules](#6-exhaustive-feature-specification-all-17-core-modules)
   - [6.1 Module 1: Overview Dashboard (`/dashboard`)](#61-module-1-overview-dashboard)
   - [6.2 Module 2: Industrial Dataset Studio (`/dataset`)](#62-module-2-industrial-dataset-studio)
   - [6.3 Module 3: Digital Product Passport (`/passport`)](#63-module-3-digital-product-passport)
   - [6.4 Module 4: Products & Batches Directory (`/products`)](#64-module-4-products--batches-directory)
   - [6.5 Module 5: Forward Traceability Flow (`/traceability`)](#65-module-5-forward-traceability-flow)
   - [6.6 Module 6: Reverse Traceability & Blast Radius (`/reverse-trace`)](#66-module-6-reverse-traceability--blast-radius)
   - [6.7 Module 7: AI Anomaly Intelligence (`/ai-intelligence`)](#67-module-7-ai-anomaly-intelligence)
   - [6.8 Module 8: Root Cause Analysis (`/rca`)](#68-module-8-root-cause-analysis)
   - [6.9 Module 9: Impact Analysis & Risk Forensics (`/impact`)](#69-module-9-impact-analysis--risk-forensics)
   - [6.10 Module 10: What-If Digital Twin Simulator (`/simulator`)](#610-module-10-what-if-digital-twin-simulator)
   - [6.11 Module 11: Quality Control & Gateways (`/quality`)](#611-module-11-quality-control--gateways)
   - [6.12 Module 12: Supplier Scorecard & Matrix (`/suppliers`)](#612-module-12-supplier-scorecard--matrix)
   - [6.13 Module 13: Machines & Fleet Telemetry (`/machines`)](#613-module-13-machines--fleet-telemetry)
   - [6.14 Module 14: Executive Operational Analytics (`/analytics`)](#614-module-14-executive-operational-analytics)
   - [6.15 Module 15: Compliance & Audit Reports (`/reports`)](#615-module-15-compliance--audit-reports)
   - [6.16 Module 16: System & Sector Settings (`/settings`)](#616-module-16-system--sector-settings)
   - [6.17 Module 17: Enterprise Authentication (`/login`)](#617-module-17-enterprise-authentication)
7. [Mathematical Algorithms, Statistical Formulas & SPC Models](#7-mathematical-algorithms-statistical-formulas--spc-models)
8. [Web Audio Synthesizer Sound Design](#8-web-audio-synthesizer-sound-design)
9. [Keyboard Shortcuts & Hotkey Reference](#9-keyboard-shortcuts--hotkey-reference)
10. [Data Schemas & Entity Relationship Dictionary](#10-data-schemas--entity-relationship-dictionary)

---

## 1. Executive Summary & Mission Statement

**ManuTrace AI** is an enterprise-grade Industrial AI and Digital Product Passport (DPP) platform designed to solve the critical challenges of modern manufacturing:
- **Zero-Defect Quality Assurance:** Prevent defective parts from escaping the factory floor through real-time multi-variate Statistical Process Control (SPC).
- **100% End-to-End Transparency:** Complete cryptographic forward genealogy and rapid backward blast-radius containment.
- **Automated Root Cause Forensics:** Eliminate weeks of guesswork by isolating the exact physical sensor contributions behind defect spikes.
- **Regulatory Compliance:** Full automated generation of EU Digital Product Passports (DPP), ISO 9001:2015 audit packages, and IATF 16949 / cGMP certifications.

---

## 2. Global Technology Stack & Infrastructure

- **Frontend Core:** React 18.3, TypeScript 5.7, Vite 6.4
- **Styling Architecture:** Vanilla Tailwind CSS with curated HSL color tokens and BankDash-inspired glassmorphism.
- **Iconography:** Lucide-React SVG vector icons with custom dynamic sector visualizers.
- **Real-Time Telemetry Engine:** 10 Hz simulated industrial PLC/SCADA packet stream with dynamic jitter (±0.25 offset).
- **Sound Synthesis Engine:** Zero-asset Web Audio API synthesizing sine, sawtooth, and triangle waveforms directly in-browser.
- **Client-Side Persistence:** LocalStorage state synchronization with automatic hydration across sessions.
- **Zero External API Dependency:** Self-contained statistical modeling, heuristics, and natural-language query engine.

---

## 3. Multi-Sector Configurable Engine

ManuTrace AI adapts dynamically across 5 distinct manufacturing sectors:

| Sector | Focus Area | Key Monitored Parameters | Relevant Compliance |
| :--- | :--- | :--- | :--- |
| **🚗 Automotive & Precision Engineering** | Brake Calipers, Transmission Housings, CNC Milling | Spindle Vibration, Chamber Temp (180°C), Hydraulic Pressure | IATF 16949, ISO 9001:2015 |
| **⚡ Semiconductor & Electronics** | Silicon Wafers, GaN Chips, SMT Surface Mount | Reflow Temp (245°C), Vacuum Pressure, Cleanroom Humidity | Sony Green Partner, ISO 14001 |
| **💊 Pharma & BioTech (cGMP)** | Active Pharmaceutical Ingredients (API), Lyophilized Vials | Autoclave Temp (121°C), Bioreactor Dwell, Impurity Assay | FDA 21 CFR Part 210, cGMP |
| **🥫 Food & Beverage Processing** | Organic Purees, Cold-Pressed Concentrates, Bottling | Pasteurization Temp (85°C), Brix %, Packaging Seal Integrity | HACCP, FSMA, BRCGS |
| **🧵 Technical Textiles & Apparel** | High-Tenacity Aramid Yarn, Spunbond Nonwovens | Loom Tension, Dye Bath Temp (130°C), Yarn Density | OEKO-TEX Standard 100 |

---

## 4. Master UI Layout, Navigation & Global Controls

### 4.1 Collapsible Left Sidebar
- **Brand Header:** ManuTrace AI logo with dynamic sector badge, factory icon, and collapse/expand toggle button (`<ChevronLeft>`).
- **16 Main Navigation Items:** Each item features custom icon, active blue vertical indicator bar, and color-coded status badges (`CORE`, `LOAD`, `KEY`, `AI`, `NEW`, `Alert`).
- **Collapsed Mode:** Minimizes to icon rail (w-20) with hover tooltips and expand button (`<ChevronRight>`).
- **Live Telemetry Footer Box:** Shows real-time 10 Hz synchronization status, pulsing green beacon, active build version (`v2.4 LTS`), and audio synthesizer mute/unmute toggle.

### 4.2 Top Application Header
- **Universal Search Bar:** Clickable search button with `<Search>` icon, placeholder text, and `<kbd>Ctrl K</kbd>` badge.
- **AI Copilot Quick Button:** Integrated `<BrainCircuit>` button launching the natural language assistant.
- **Mission Tagline Banner:** Pastel blue badge: *"TRACE EVERYTHING. UNDERSTAND ANYTHING. ACT BEFORE IMPACT."*
- **10 Hz Telemetry Toggle:** Pill button displaying live stream pulse (`10 Hz Live` vs `Paused`) with toggle click sound.
- **1-Click Scenarios Button:** Amber pill opening the preset test scenario launcher.
- **5-Min Expo Tour Button:** Gradient blue/purple button with spinning `<Sparkles>` icon launching the 17-step guided story.
- **Industrial Sector Dropdown:** Dynamic sector selector with emoji icons (🚗, ⚡, 💊, 🥫, 🧵) switching data schemas live.
- **Notification Bell:** Circular button with unread counter and pulsing red indicator for critical alerts.
- **User Profile Pill:** Shows Director avatar (`MV`), name (`Dr. Marcus Vance`), plant location, and Sign Out dropdown.

### 4.3 Universal Contextual Ribbon Bar (Below Header)
- **Module Breadcrumb:** Shows `[Sector] / [Active Module Name]` across all 17 pages.
- **In-Place Active Batch Selector:** Dropdown showing all active batches with pass rates and anomaly tags. Switching active batch updates all cross-module selections instantly without leaving the current view.
- **In-Place Active Machine Selector:** Dropdown showing all machines (M01–M06) with line assignment and status.
- **Speed-Dial Action Pills:**
  - `[🎯 Scenarios]` — Opens 1-Click Scenario Matrix
  - `[⚡ RCA]` — Jumps to Root Cause Analysis
  - `[🔄 Reverse Trace]` — Jumps to Backward Blast Radius
  - `[📜 Passport]` — Jumps to Digital Product Passport
  - `[🧪 Simulator]` — Jumps to What-If Digital Twin Lab
  - `[📄 Export Audit PDF]` — Opens ISO 9001 printable dossier modal
  - `[🤖 Ask AI]` — Opens ManuTrace AI Copilot

---

## 5. Productivity Hubs, Global Modals & Speed-Dials

### 5.1 🤖 ManuTrace AI Copilot Modal (`Ctrl + J` / `Ctrl + /`)
- **Natural Language Query Engine:** Powered by `generateCopilotResponse`, indexing all active batches, products, machines, suppliers, raw materials, inspections, defects, shipments, and platform concepts.
- **Quick Prompt Chips:** 8 instant suggestion pills:
  1. *"What is the current condition of the plant?"*
  2. *"Why did Batch B-1042 fail quality inspection?"*
  3. *"What is Machine M04 vibration and utilization?"*
  4. *"What products are affected by Raw Material RM-7821?"*
  5. *"Simulate +10°C thermal drift on Machine M04"*
  6. *"List all suppliers by quality scorecard ranking"*
  7. *"Verify ISO 9001 compliance for Batch B-1039"*
  8. *"Show all failing or quarantined batches"*
- **Rich Message Cards:** Generates structured markdown text with highlighted key terms, 4-column KPI metrics cards (Pass Rate, Delta, Temperature, Risk Rating), and interactive action buttons.
- **1-Click Action Buttons in Responses:** Clicking `[View Passport]`, `[Run RCA]`, `[Inspect Machine]`, or `[Reverse Trace]` navigates directly to the target module and applies the filter.
- **Simulated Voice Query Input:** `<Mic>` button simulating spoken manufacturing command input with audio scan chirp.
- **Clipboard Copy Action:** 1-click copy with green verification checkmark and toast notification.
- **Conversation Reset:** `<RefreshCw>` button to clear thread history.

### 5.2 🎯 1-Click Incident Scenario Matrix Modal
Provides 4 pre-configured realistic production test cases for live demonstrations:
1. 🔴 **Scenario 1 — Critical Thermal Drift & Defect Spike:**
   - *Target:* Batch B-1042 / Machine M04 / Overheating at 182.4°C / +8.4% defect rate.
   - *Action:* Auto-focuses B-1042 and opens Root Cause Diagnostics.
2. 🟡 **Scenario 2 — Upstream Raw Material Hardness Variance:**
   - *Target:* Raw Material RM-7821 / Supplier SUP-001 / +3.8% Hardness drift.
   - *Action:* Auto-focuses RM-7821 and opens Reverse Traceability & Blast Radius.
3. 🔵 **Scenario 3 — Predictive Spindle Vibration & Digital Twin:**
   - *Target:* Machine M04 / Spindle vibration 3.4 mm/s RMS.
   - *Action:* Auto-focuses M04 and opens Process Simulation Lab.
4. 🟢 **Scenario 4 — Zero-Defect EU Digital Product Passport:**
   - *Target:* Batch B-1039 / 99.4% FPY / Zero defects.
   - *Action:* Auto-focuses B-1039 and opens Digital Passport with QR code.
- **Category Filter Tabs:** *All Scenarios*, *Critical Incident RCA*, *Supplier Variance*, *Predictive SPC*, *Certified DPP*.

### 5.3 📄 Printable Executive Batch Audit Dossier Modal (`Ctrl + E`)
- **Official Letterhead:** Formatted with company header, facility name, LOT number, issue date, and official audit watermark.
- **Executive Overview Grid:** Production facility, assigned line, first-pass yield rate, and cryptographic SHA-256 seal.
- **7-Stage Lifecycle Genealogy Table:** Stage-by-stage audit showing entity name, recorded sensor parameters, and verification status (`VERIFIED`, `NOMINAL`, `FLAGGED EXCURSION`, `HOLD MANDATED`).
- **Sensor Envelope Breakdown:** Chamber temperature, hydraulic pressure, spindle vibration, and MTR mill test report reference.
- **Digital Passport QR Seal:** Embedded QR code visual with authorized plant sign-off signature (`Dr. Marcus Vance`).
- **Print / Save PDF Trigger:** Direct integration with `window.print()` using clean `@media print` layout.
- **Copy Clean JSON:** Formats and copies complete audit JSON payload to clipboard.

### 5.4 📱 Digital Product Passport QR Modal
- **High-Resolution QR Code:** Visual QR code encoding the cryptographic passport URL.
- **Dual Visibility Switcher:**
  - *Public Consumer View:* Shows sanitized sustainability metrics, carbon footprint, warranty status, and authenticity seal.
  - *Certified Auditor View:* Unmasks internal machine cell ID, chamber temperature logs, inspector ID, and raw tolerances.
- **Batch Metadata Chips:** Product name, lot ID, manufacturing facility, warranty status.
- **Download QR Code:** Button to download PNG/SVG QR graphic.

### 5.5 🔍 Universal Global Search Modal (`Ctrl + K`)
- **Instant Multi-Entity Search:** Real-time search across:
  - Production Batches (ID, product name, line)
  - Manufactured Products (ID, name, batch)
  - Machines & Cells (ID, name, line)
  - Raw Material Lots (ID, name, supplier)
  - Customer Shipments (ID, customer name, destination)
- **Popular Demo Query Chips:** Quick click pills for `B-1042`, `RM-7821`, `M04`, `PRD-10021`, `SUP-001`, `SHP-22091`.
- **Keyboard Navigation:** <kbd>ESC</kbd> to close, autofocus on open.

### 5.6 🚀 5-Minute Guided Expo Story Tour Controller (`Ctrl + D`)
- **Bottom Floating HUD:** Fixed bottom floating controller with step badge (`STEP 1/17` to `STEP 17/17`).
- **Step Title & Narrative Box:** Explains what the judge/user is viewing at each milestone.
- **17 Sequential Steps:**
  1. Industrial Authentication $\rightarrow$ 2. Command Center $\rightarrow$ 3. Flagged Batch B-1042 $\rightarrow$ 4. Manufacturing Passport $\rightarrow$ 5. Lifecycle Timeline $\rightarrow$ 6. Machine Event $\rightarrow$ 7. AI RCA $\rightarrow$ 8. Contributing Factors $\rightarrow$ 9. Reverse Trace $\rightarrow$ 10. Affected Products $\rightarrow$ 11. Impact Analysis $\rightarrow$ 12. Simulator Lab $\rightarrow$ 13. Parameter Adjustment $\rightarrow$ 14. Run Simulation $\rightarrow$ 15. Predicted Impact $\rightarrow$ 16. Generate Passport QR $\rightarrow$ 17. Executive Analytics.
- **Interactive Step Progress Pips:** 17 clickable progress bars allowing instant jump to any story step.
- **Controls:** `<Previous Step>`, `<Next Step>`, `<Finish Demo>`, `<Exit Tour>`.

### 5.7 ⚡ Floating Quick-Action Speed-Dial (Bottom-Right)
- Floating button in bottom right corner with `<BrainCircuit>` icon and pulsing beacon.
- Expands to reveal speed-dial buttons for AI Copilot, Scenarios, Expo Tour, Audit Dossier, and Keyboard Shortcuts.
- Automatically hides when the 17-step tour is running to avoid UI overlap.

### 5.8 🔔 Real-Time Action Toasts System
- Animated toast popups in the top-right corner with 4 visual themes:
  - 🟢 **Success:** Verification chime, green checkmark.
  - 🟡 **Warning:** Alert tone, amber triangle.
  - 🔴 **Error/Critical:** Warning buzz, red octagon.
  - 🔵 **Info:** Blue info icon.
- Auto-dismiss after 4 seconds, manual close `<X>` button, and optional action link.

---

## 6. Exhaustive Feature Specification: All 17 Core Modules

### 6.1 Module 1: Overview Dashboard (`/dashboard`)
- **Key Cards Section (BankDash style):**
  - *Card 1 (Royal Blue Gradient):* Primary Tracked Lot (`Batch B-1042`), Anomaly Flagged badge, Line 04 / Machine M04 assignment, UTC timestamp, and `[View Passport]` button.
  - *Card 2 (Clean White Card):* Certified Benchmark Lot (`Batch B-1041`), Pass 99.4% FPY badge, Line 02 assignment, and `[Verify QR]` button.
- **Recent Telemetry Incident Feed:**
  - Item 1: Thermal Spike in B-1042 (Machine M04, +8.4% Defect, 182°C sustained).
  - Item 2: RM-7821 Hardness Drift (Global Materials Ltd, +3.8% Hardness).
  - Item 3: Spindle Vibration Alert (Machine M04, 3.4 mm/s RMS, Service Due).
- **KPI Metric Quad:**
  - *Active Batches:* 24 Lots (+3 lots today).
  - *Units Manufactured:* 18,426 (+1,240 vs target).
  - *Quality Pass Rate:* 96.8% (+0.4% FPY).
  - *Quarantined Lots:* 4 Batches (B-1042 under quarantine).
- **Weekly Production Double-Bar SVG Chart:**
  - Compares Target Units (Cyan `#16DBCC`) vs Completed Units (Royal Blue `#2D60FF`) across Saturday through Friday.
  - Thursday spike callout badge highlighting the `B-1042 Spike`.
- **Manufacturing Health Donut Chart:**
  - Multi-segmented SVG Donut rendering aggregated **87% Health Score**.
  - Legend: Process (92%), Quality (96.8%), Supply (82%), Machine (78%).
- **1-Click Interactive Scenario Matrix:** 4 cards launching pre-configured test scenarios.
- **Quick Containment Card:** 1-click button to contain Batch B-1042 blast radius and launch rework simulation.

---

### 6.2 Module 2: Industrial Dataset Studio (`/dataset`)
- **View Tabs:** *Upload & Ingest*, *Sector Benchmark Samples*, *Active Database Explorer*.
- **Drag & Drop Upload Zone:**
  - Supports `.csv`, `.json`, and `.xlsx` files.
  - Auto-detects schema entity type (Batches, Machines, Suppliers, Raw Materials, Inspections, Defects, Shipments).
  - File size and row count validator.
- **Raw Text Parser Fallback:** Expandable text area for pasting raw CSV or JSON payloads directly.
- **Dual Ingestion Mode Toggle:** `<Append Mode>` (merges into existing database) vs `<Replace Mode>` (resets and populates).
- **Preloaded Sector Benchmarks:**
  - 🚗 Automotive Assembly Benchmark (24 batches, 6 machines, 8 suppliers)
  - ⚡ Semiconductor Fab Benchmark (18 wafer lots, 8 cleanroom tools)
  - 💊 BioPharma cGMP Benchmark (12 API batches, 6 bioreactors)
  - 🥫 Food Processing Benchmark (14 concentrate lots, 5 packaging lines)
  - 🧵 Technical Textiles Benchmark (10 yarn lots, 6 high-speed looms)
- **Sample CSV Templates:** Downloadable starter CSV files for Batches, Defects, Machines, and Suppliers.
- **Active Data Explorer:** Live searchable table displaying all rows in memory with column sorting, record count, and risk breakdown.
- **Reset to Baseline Button:** Reverts active memory to clean factory defaults.

---

### 6.3 Module 3: Digital Product Passport (`/passport`)
- **Passport Header:** Product name (`Brake Component Caliper Arm`), Lot number (`B-1042`), Certification badge (`ISO 9001:2015`), and `[Download Dossier]` button.
- **7 Clickable Lifecycle Stages:**
  - Stage 1: Raw Material (`RM-7821`, Purity 98.4%, Tensile 950 MPa)
  - Stage 2: Supplier (`SUP-001 Global Materials`, Quality 94%, IATF 16949)
  - Stage 3: Machine (`M04 5-Axis`, Spindle Vibration 3.4 mm/s, Temp 182°C)
  - Stage 4: Production (`Line 04`, Operator OP-17, Cycle 20.4 min)
  - Stage 5: Quality Inspection (`Station Q-04`, Eddy Current Test, Tolerance ±0.02 mm)
  - Stage 6: Packaging & Serialization (`QR Sealed`, Pallet ID #PL-9021)
  - Stage 7: Logistics & Dispatch (`Carrier Express`, Dock 4, In Warehouse)
- **Detailed Stage Inspector:** Clicking any stage displays unmasked parameters, operator badge, and verification status.
- **Interactive Digital Twin Visualizer:** 3D-styled exploded view rendering internal sensor points (Thermal Sensor T-01, Vibration Accelerometer V-04, Hydraulic Transducer P-02).
- **Tamper-Evident QR Code Button:** Opens the public QR code modal.
- **RCA Quick Trigger:** Direct button on Stage 3/4 to launch Root Cause Analysis for flagged anomalies.

---

### 6.4 Module 4: Products & Batches Directory (`/products`)
- **Filter Controls:**
  - Sector filter (All, Automotive, Electronics, Pharma, Food, Textiles)
  - Quality status filter (Passed, Failed, Rework, Pending)
  - Risk rating filter (Low, Medium, High, Critical)
  - Search input with real-time substring matching
- **Batch Grid Cards:**
  - Batch ID, Product Name, Production Line, Pass Rate %, Defect Rate %.
  - Visual status pill (`PASSED`, `FLAGGED`, `REWORK`).
  - Action buttons: `[Passport]`, `[RCA]`, `[Simulator]`, `[QR Code]`.
- **Summary Statistics:** Total lots, pass rate average, quarantined count.

---

### 6.5 Module 5: Forward Traceability Flow (`/traceability`)
- **Node-Based Genealogical Graph:**
  - Node 1: Raw Material Supplier (`Global Materials Ltd.`)
  - Node 2: Smelting & Ingot Mill (`Lot #ING-4401`)
  - Node 3: CNC Machining Cell (`Machine M04`)
  - Node 4: Ultrasonic Cleaning & QA (`Station Q-04`)
  - Node 5: Final Sub-Assembly (`Line 04 Active`)
  - Node 6: Packaging & Laser Barcoding (`Pallet PL-9021`)
  - Node 7: Warehouse Logistics (`Dock 4 Bay 2`)
  - Node 8: Customer Delivery (`Apex Automotive Corp`)
- **Node Status Indicators:** Green checkmark for verified steps, amber warning icon for anomalous steps.
- **Detail Drawer:** Clicking any node reveals station operator, cycle duration, sensor logs, and inspection sign-off.

---

### 6.6 Module 6: Reverse Traceability & Blast Radius (`/reverse-trace`)
- **Upstream Material Query Bar:** Select raw material lot (`RM-7821`, `RM-7820`, `RM-7822`) or enter custom material ID.
- **Supplier Provenance Card:** Supplier name, contact email, mill certificate date, purity score, and tensile hardness graph.
- **Automated Downstream Blast Radius Matrix:**
  - *Affected Batches:* 3 Lots (B-1042, B-1043, B-1045).
  - *Affected Manufactured Units:* 486 finished assemblies.
  - *Affected Shipments:* 7 customer deliveries.
- **Simultaneous Containment Action:** Button to trigger immediate quarantine lockdown across warehouse and transit logistics.
- **Downstream Unit Table:** Searchable table listing all 486 serialized units with line assignment and current warehouse location.

---

### 6.7 Module 7: AI Anomaly Intelligence (`/ai-intelligence`)
- **Multi-Variate SPC Monitoring Table:** Displays real-time Z-score calculations for all active machines and lots.
- **Anomaly Breakdown Cards:**
  - Anomaly Type: Temperature Spike, Vibration Resonance, Pressure Variance.
  - Z-Score Value: e.g. `2.8σ` (Exceeds 3-sigma control boundary).
  - Confidence Rating: `91.4% AI Confidence`.
- **Recommended Corrective Action Box:** Contextual engineering advice (e.g. *"Inspect cooling loop solenoid valve; quarantine sub-lot for eddy current audit"*).
- **Risk Distribution Chart:** Visual breakdown of Thermal Risk vs Mechanical Risk vs Supplier Quality Risk.

---

### 6.8 Module 8: Root Cause Analysis (`/rca`)
- **Failure Problem Statement:** *"Defect rate increased by +8.4% on Batch B-1042 during Line 04 processing."*
- **Root Cause Factors Pareto Tree:**
  1. Temperature Deviation: **42%** (Chamber exceeded 182°C for 35 continuous minutes).
  2. Machine Spindle Vibration: **24%** (Harmonic resonance at 4.1 mm/s peak during finishing pass).
  3. Raw Material Hardness Variation: **18%** (Tensile hardness showed +3.8% variance from standard mill certificate).
  4. Processing Cycle Duration: **11%** (Dwell extended by 2.4 min due to conveyor congestion).
  5. Operator Clamping Torque: **5%** (Manual fixture clamping torque showed shift variance).
- **Sensor Evidence Correlation Log:** Displays exact timestamped telemetry proving each contributing factor.
- **CAPA Action Plan Generator:** Generates formal Corrective and Preventive Actions with owner assignment and target closure dates.

---

### 6.9 Module 9: Impact Analysis & Risk Forensics (`/impact`)
- **Cascading Blast-Radius Flow:**
  - Stage 1: Triggering Event (Machine M04 thermal excursion)
  - Stage 2: Active Lots Quarantined (3 batches)
  - Stage 3: Manufactured Assemblies (486 units)
  - Stage 4: QA Gateways Quarantined (Station Q-04 audit mandated)
  - Stage 5: Customer Shipments (7 shipments held at distribution hubs)
- **Financial Risk Exposure Estimator:** Automatically computes dollar risk (**$42,500 USD** in rework and containment costs).
- **Quarantine Management Table:** Real-time disposition controls (Release, Hold, Scrapped, Rework).

---

### 6.10 Module 10: What-If Digital Twin Simulator (`/simulator`)
- **Parametric Sliders:**
  - Chamber Temperature: 160°C – 220°C (Default: 185°C)
  - Hydraulic Pressure: 3.0 – 8.0 bar (Default: 5.2 bar)
  - Processing Cycle Time: 10.0 – 30.0 min (Default: 20.4 min)
  - Spindle Speed: 800 – 2400 RPM (Default: 1420 RPM)
- **Simulation Mode Presets:**
  - `[Nominal Standard]` — 180°C, 5.0 bar, 18 min, 1200 RPM
  - `[High Speed / Throughput]` — 188°C, 5.6 bar, 14.5 min, 1650 RPM
  - `[Eco / Energy Saver]` — 175°C, 4.8 bar, 19.5 min, 1050 RPM
  - `[Stress Test / Thermal Limit]` — 195°C, 6.2 bar, 22 min, 1800 RPM
- **Automated Stress Test Run:** Dynamically ramps temperature by +3°C every 250ms with telemetry audio chirps to locate failure threshold.
- **Side-by-Side Comparison Matrix:**
  - First-Pass Yield: Current 96.8% vs Simulated Forecast
  - Defect Probability: Current 3.2% vs Simulated Risk
  - Energy Consumption: Current 142 kWh vs Simulated kWh
  - Cycle Dwell Time: Current 18.0 min vs Simulated min
- **AI SPC Recommendations Engine:** Explains trade-offs between speed, thermal stress, and micro-surface porosity.

---

### 6.11 Module 11: Quality Control & Gateways (`/quality`)
- **Inspection Stations Overview:** Station Q-01 (Incoming Raw Material), Station Q-02 (Post-Machining CMM), Station Q-03 (Eddy Current Surface), Station Q-04 (Final Assembly Audit).
- **Inspection Log Grid:** Batch ID, inspector ID, sample size, defects found, tolerance variance (±mm), result status (`PASSED`, `FAILED`, `REWORK`).
- **Defect Category Pareto:** Pie/Bar breakdown of failure modes (Dimension, Surface Porosity, Material Hardness, Assembly Fit, Packaging).

---

### 6.12 Module 12: Supplier Scorecard & Matrix (`/suppliers`)
- **Supplier Leaderboard:** 8 certified Tier-1 industrial partners with quality scores (83% – 98%) and defect rates (0.4% – 4.6%).
- **Compliance Audit Tracker:** Verified audit records for IATF 16949, ISO 9001:2015, AS9100D, cGMP, and HACCP.
- **Supplier Profile View:** Contact email, location (Munich, Detroit, Osaka, Basel, Bologna), active batch count, risk level.
- **1-Click Reverse Trace Link:** Directly query all material lots received from any selected supplier.

---

### 6.13 Module 13: Machines & Fleet Telemetry (`/machines`)
- **Machine Fleet Grid (M01 to M06):**
  - M01: High-Speed Laser Cutting Center (Line 01, Running, 88% Util)
  - M02: Automated Stamping Press (Line 02, Running, 94% Util)
  - M03: Multi-Axis Turning Center (Line 03, Running, 81% Util)
  - M04: 5-Axis CNC Milling Center (Line 04, Warning, 82% Util, Elevated Vibration 3.4 mm/s)
  - M05: Precision Robotic Welder (Line 05, Running, 89% Util)
  - M06: Automated CMM Inspection Cell (Line 06, Running, 95% Util)
- **Spindle Vibration FFT & RMS Spectrum:** Real-time vibration telemetry against ISO 10816 limits (< 2.8 mm/s nominal).
- **Maintenance Scheduler:** Total runtime hours, last serviced date, next preventative service countdown.
- **Live Stream Toggle:** Toggle 10 Hz real-time streaming with live data ticks.

---

### 6.14 Module 14: Executive Operational Analytics (`/analytics`)
- **OEE Dashboard:** Fleet Overall Equipment Effectiveness breakdown:
  - Availability: 94.2%
  - Performance: 91.8%
  - Quality: 96.8%
  - Composite OEE: **92.4%**
- **Yield Trend Analysis:** 30-day First-Pass Yield (FPY) line graph showing shifts, dips, and recovery periods.
- **Cost of Quality (CoQ) Analyzer:** Prevention investment vs appraisal costs vs internal rework vs external risk avoided.

---

### 6.15 Module 15: Compliance & Audit Reports (`/reports`)
- **ISO 9001:2015 Compliance Package Generator:** 1-click export of complete quality management system documentation.
- **EU Digital Product Passport Export:** Generates standardized JSON-LD and printable PDF passport files.
- **Supplier Corrective Action Requests (SCAR):** Automated generation of formal non-conformance notices.

---

### 6.16 Module 16: System & Sector Settings (`/settings`)
- **Industrial Sector Switcher:** Switch between Automotive, Semiconductor, Pharma, Food, and Textiles.
- **User Profile Management:** Edit name, role, email, and plant location.
- **LocalStorage Data Management:** Export complete factory database as JSON backup, or clear memory and restore factory defaults.

---

### 6.17 Module 17: Enterprise Authentication (`/login`)
- **Role-Based Single Sign-On:**
  - Plant Director (`Dr. Marcus Vance`)
  - Quality Assurance Lead (`Elena Rostova`)
  - Process Engineer (`David Chen`)
  - Compliance Auditor (`Sarah Jenkins`)
- **1-Click Demo Login:** Instant bypass for project presentations and hackathon judge evaluation.

---

## 7. Mathematical Algorithms, Statistical Formulas & SPC Models

### 7.1 Statistical Process Control (SPC) Z-Score Anomaly Formula
$$Z = \frac{|T_{\text{current}} - T_{\text{baseline}}|}{\sigma}$$
- Where $T_{\text{baseline}} = 180.0^\circ\text{C}$ and standard deviation $\sigma = 2.5^\circ\text{C}$.
- Anomaly triggered when $Z > 2.0$ or temperature exceeds nominal tolerance window ($180^\circ\text{C} \pm 5^\circ\text{C}$).

### 7.2 Multi-Variate Composite Risk Rating Formula
$$\text{Risk}_{\text{composite}} = 0.40 \cdot R_{\text{thermal}} + 0.25 \cdot R_{\text{vibration}} + 0.20 \cdot R_{\text{supplier}} + 0.15 \cdot R_{\text{variance}}$$
- **$R_{\text{thermal}}$:** $\min(100, \max(0, |T - 180| - 2) \times 11)$
- **$R_{\text{vibration}}$:** $\min(100, \frac{\text{Vibration}}{4.5} \times 100)$
- **$R_{\text{supplier}}$:** $\max(0, (100 - \text{QualityScore}) \times 1.5)$
- **$R_{\text{variance}}$:** $\min(100, \text{DefectRate} \times 18)$

### 7.3 What-If Process Simulation Empirical Response Functions
- **Quality Risk Delta:** $\Delta Q = \text{round}(2.4 \cdot \Delta T + 3.1 \cdot \Delta P - 0.8 \cdot \Delta t)$
- **Defect Risk Delta:** $\Delta D = \text{round}(1.6 \cdot \Delta T + 1.2 \cdot \frac{\Delta \text{Speed}}{100} + 1.8 \cdot \Delta P)$
- **Energy Consumption Delta:** $\Delta E = \text{round}(1.0 \cdot \Delta T + 2.5 \cdot \frac{\Delta \text{Speed}}{100} + 1.5 \cdot \Delta t)$
- **Yield Rate Forecast:** $Y_{\text{sim}} = \max(60, \min(99.8, Y_{\text{current}} - 0.4 \cdot \Delta D))$

---

## 8. Web Audio Synthesizer Sound Design

All sounds are generated natively via the Web Audio API with zero external audio files:

| Sound Action | Waveform | Frequency Ramp | Gain & Duration |
| :--- | :--- | :--- | :--- |
| **Button Click Tick** | Sine Wave | 800 Hz $\rightarrow$ 400 Hz (exponential) | 0.04 Gain, 40 ms duration |
| **Verification Chime** | Dual Sine Chord | D5 (587.3 Hz) / A5 (880 Hz) $\rightarrow$ A5 / D6 (1174.6 Hz) | 0.05 Gain, 350 ms duration |
| **Alert Warning Buzz** | Sawtooth Wave | 440 Hz $\rightarrow$ 370 Hz | 0.06 Gain, 220 ms duration |
| **QR Laser Scanner** | Triangle Wave | 1200 Hz $\rightarrow$ 2400 Hz | 0.06 Gain, 120 ms duration |
| **Quarantine Sub-Bass** | Deep Triangle | 160 Hz $\rightarrow$ 45 Hz (sub-bass drop) | 0.12 Gain, 350 ms duration |
| **Telemetry Packet Tick** | Sine Wave | 1800 Hz | 0.015 Gain, 20 ms duration |

---

## 9. Keyboard Shortcuts & Hotkey Reference

| Key Combination | Action Description |
| :--- | :--- |
| <kbd>Ctrl + K</kbd> or <kbd>Cmd + K</kbd> | Open Universal Global Search Modal |
| <kbd>Ctrl + J</kbd> or <kbd>Ctrl + /</kbd> | Open ManuTrace AI Copilot Assistant |
| <kbd>Ctrl + D</kbd> | Start / Exit 5-Minute Guided Expo Story Tour |
| <kbd>Ctrl + E</kbd> | Generate & Print ISO 9001 Batch Audit Dossier |
| <kbd>?</kbd> (Shift + /) | Open Keyboard Shortcuts & Productivity Guide |
| <kbd>ESC</kbd> | Close any open modal, drawer, or search overlay |

---

## 10. Data Schemas & Entity Relationship Dictionary

### 10.1 Batch Entity (`Batch`)
- `id`: string (e.g. "B-1042")
- `productId`: string (e.g. "PRD-10021")
- `productName`: string (e.g. "Brake Component Caliper Arm")
- `industry`: IndustryType ('automotive' | 'electronics' | 'pharmaceutical' | 'food' | 'textile')
- `productionLine`: string (e.g. "Line 04")
- `quantity`: number (e.g. 500)
- `qualityStatus`: QualityStatus ('passed' | 'failed' | 'rework' | 'scrapped' | 'pending')
- `riskLevel`: RiskLevel ('low' | 'medium' | 'high' | 'critical')
- `passRate`: number (e.g. 87.2)
- `defectRate`: number (e.g. 8.4)
- `traceabilityCoverage`: number (e.g. 98.4)
- `operatorId`: string (e.g. "OP-17")
- `machineId`: string (e.g. "M04")
- `rawMaterialBatchId`: string (e.g. "RM-7821")
- `telemetry`: TelemetryData (`temperature`, `pressure`, `processingTime`, `vibration`, `machineSpeed`)
- `anomalyDetected`: boolean
- `anomalyNotes`: string

### 10.2 Machine Entity (`Machine`)
- `id`: string (e.g. "M04")
- `name`: string (e.g. "5-Axis CNC Milling Center")
- `type`: string
- `line`: string (e.g. "Line 04")
- `industry`: IndustryType
- `status`: MachineStatus ('running' | 'idle' | 'warning' | 'maintenance')
- `utilization`: number (e.g. 82)
- `lastMaintenance`: string
- `nextMaintenance`: string
- `risk`: RiskLevel
- `operatingHours`: number (e.g. 3420)
- `associatedDefects`: number (e.g. 14)
- `telemetry`: TelemetryData

### 10.3 Supplier Entity (`Supplier`)
- `id`: string (e.g. "SUP-001")
- `name`: string (e.g. "Global Materials Ltd.")
- `material`: string (e.g. "Steel & High-Tensile Alloys")
- `industry`: IndustryType
- `qualityScore`: number (e.g. 94)
- `defectRate`: number (e.g. 1.8)
- `activeBatches`: number (e.g. 12)
- `risk`: RiskLevel
- `location`: string (e.g. "Munich, Germany")
- `certification`: string (e.g. "IATF 16949 / ISO 9001:2015")
- `complianceDate`: string
- `contactEmail`: string

---

*ManuTrace AI™ — Complete Platform Specification Document | Generated for Executive Evaluation.*
