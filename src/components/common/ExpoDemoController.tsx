import React from 'react';
import {
  ChevronRight,
  ChevronLeft,
  X,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface TourStepInfo {
  step: number;
  title: string;
  action: string;
  narrative: string;
}

const TOUR_STEPS: TourStepInfo[] = [
  {
    step: 1,
    title: 'Industrial Authentication',
    action: 'Enterprise Single Sign-On',
    narrative: 'Role-based plant governance with multi-sector configurable schema.'
  },
  {
    step: 2,
    title: 'Command Center & Health Score',
    action: 'Manufacturing Dashboard',
    narrative: 'Real-time telemetry showing 87/100 Health Score and live plant KPIs.'
  },
  {
    step: 3,
    title: 'Flagged Batch B-1042',
    action: 'Select Active Batch B-1042',
    narrative: 'AI telemetry stream flagged an abnormal temperature pattern on Machine M04.'
  },
  {
    step: 4,
    title: 'Manufacturing Passport',
    action: 'Open Digital Product Passport',
    narrative: 'Full digital identity for Batch B-1042 connecting raw material to customer delivery.'
  },
  {
    step: 5,
    title: '7-Stage Lifecycle Timeline',
    action: 'Explore Production History',
    narrative: 'Clickable stages: Raw Material → Supplier → Machine → Production → Quality → Packaging → Shipment.'
  },
  {
    step: 6,
    title: 'Abnormal Machine Event',
    action: 'Inspect Machine Stage (M04)',
    narrative: 'Telemetry logs show 182°C sustained for 35 min with 3.4 mm/s vibration.'
  },
  {
    step: 7,
    title: 'AI Root Cause Analysis',
    action: 'Decompose Failure Mechanisms',
    narrative: 'AI evaluates multi-variate correlations across temperature, machine vibration, and materials.'
  },
  {
    step: 8,
    title: 'Contributing Factors Breakdown',
    action: 'View Root Cause Tree',
    narrative: 'Temperature deviation identified as 42% potential contributing factor, vibration 24%.'
  },
  {
    step: 9,
    title: 'Reverse Traceability',
    action: 'Trace Upstream Raw Material',
    narrative: 'Querying Raw Material RM-7821 from Global Materials Ltd. to discover downstream ripple.'
  },
  {
    step: 10,
    title: 'Downstream Blast Radius',
    action: 'View Affected Entities',
    narrative: '3 active production batches, 486 finished products, and 7 customer shipments quarantined.'
  },
  {
    step: 11,
    title: 'Cascading Impact Analysis',
    action: 'Evaluate Operational Risk',
    narrative: 'Multi-tiered impact tree showing 27 rework units and $42,500 USD financial exposure.'
  },
  {
    step: 12,
    title: 'What-If Process Simulator',
    action: 'Open Process Simulation Lab',
    narrative: 'Simulate the impact of adjusting temperature, hydraulic pressure, and cycle speeds.'
  },
  {
    step: 13,
    title: 'Parameter Adjustment',
    action: 'Adjust Temperature to 185°C',
    narrative: 'Test parameter shifts before applying changes to physical machinery.'
  },
  {
    step: 14,
    title: 'Run Simulation Engine',
    action: 'Execute Predictive SPC Model',
    narrative: 'Real-time calculation compares Current Process vs Simulated Process.'
  },
  {
    step: 15,
    title: 'Predicted Impact Review',
    action: 'Review Risk & Energy Deltas',
    narrative: 'Quality Risk increases by +12%, Defect Risk +8%, and Energy Consumption +5%.'
  },
  {
    step: 16,
    title: 'Generate Passport QR',
    action: 'Inspect Digital Passport QR',
    narrative: 'Generate tamper-evident public QR code with masked confidential factory telemetry.'
  },
  {
    step: 17,
    title: 'Analytics & Quality Reports',
    action: 'Executive Analytics & Export',
    narrative: 'Comprehensive quality trends, machine OEE, supplier scorecards, and one-click PDF/CSV reports.'
  }
];

export const ExpoDemoController: React.FC = () => {
  const {
    isDemoTourActive,
    demoTourStep,
    nextDemoTourStep,
    prevDemoTourStep,
    exitDemoTour,
    goToDemoTourStep
  } = useApp();

  if (!isDemoTourActive) return null;

  const currentStepInfo = TOUR_STEPS[demoTourStep - 1] || TOUR_STEPS[0];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-4xl animate-slide-in">
      <div className="bg-white border border-[#E6EFF5] rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] p-4 text-[#343C6A]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Step Badge & Info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#2D60FF] to-[#1230AE] flex-shrink-0 flex items-center justify-center text-white shadow-[0_4px_12px_rgba(45,96,255,0.35)]">
              <div className="flex flex-col items-center justify-center">
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 leading-none">
                  STEP
                </span>
                <span className="text-sm font-black font-mono leading-none mt-1">
                  {demoTourStep}/17
                </span>
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#2D60FF] uppercase tracking-wider">
                  {currentStepInfo.action}
                </span>
                <span className="hidden sm:inline text-xs text-[#718EBF]">
                  • 5-Min Expo Story
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#343C6A] truncate">
                {currentStepInfo.title}
              </h4>
              <p className="text-xs text-[#718EBF] line-clamp-1">
                {currentStepInfo.narrative}
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={prevDemoTourStep}
              disabled={demoTourStep === 1}
              className="p-2.5 rounded-full bg-[#F5F7FA] hover:bg-[#EEF2F6] text-[#718EBF] disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Previous Step"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {demoTourStep < 17 ? (
              <button
                onClick={nextDemoTourStep}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2D60FF] hover:bg-blue-700 text-white font-bold text-xs shadow-[0_4px_12px_rgba(45,96,255,0.35)] transition-all"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={exitDemoTour}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#10B981] hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Finish Demo</span>
              </button>
            )}

            <button
              onClick={exitDemoTour}
              className="p-2.5 rounded-full text-[#718EBF] hover:text-[#343C6A] hover:bg-[#F5F7FA] transition-colors"
              title="Exit Guided Tour"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Progress Bar with Clickable Pips */}
        <div className="mt-3.5 pt-3 border-t border-[#E6EFF5] flex items-center justify-between gap-1.5">
          {TOUR_STEPS.map(s => (
            <button
              key={s.step}
              onClick={() => goToDemoTourStep(s.step)}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                s.step === demoTourStep
                  ? 'bg-[#2D60FF] scale-y-125'
                  : s.step < demoTourStep
                  ? 'bg-[#16DBCC]'
                  : 'bg-[#DFEAF2] hover:bg-[#C5D3E8]'
              }`}
              title={`Step ${s.step}: ${s.title}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
