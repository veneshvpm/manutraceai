import React, { useState } from 'react';
import {
  Layers,
  Thermometer,
  Activity,
  Droplets,
  Eye,
  CheckCircle2,
  RotateCw,
  Box
} from 'lucide-react';
import { sound } from '../../services/soundFx';

interface DigitalTwinVisualizerProps {
  productId?: string;
  batchId?: string;
  machineId?: string;
  currentTemp?: number;
}

export const DigitalTwinVisualizer: React.FC<DigitalTwinVisualizerProps> = ({
  productId = 'PRD-10021',
  batchId = 'B-1042',
  machineId = 'M04',
  currentTemp = 182
}) => {
  const [viewMode, setViewMode] = useState<'thermal' | 'xray' | 'solid'>('thermal');
  const [activeHotspot, setActiveHotspot] = useState<string | null>('temp');
  const [coolantBoost, setCoolantBoost] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  const hotspots = [
    {
      id: 'temp',
      label: 'Chamber Thermal Sensor (PT100)',
      x: 290,
      y: 110,
      severity: 'critical',
      value: `${coolantBoost ? (currentTemp - 3.4).toFixed(1) : currentTemp}°C`,
      desc: coolantBoost ? 'Auxiliary coolant bypass active (-3.4°C)' : 'Sustained +2.0°C thermal excursion above nominal setpoint 180°C.'
    },
    {
      id: 'vibration',
      label: 'Spindle Bearing Accelerometer',
      x: 180,
      y: 160,
      severity: 'warning',
      value: '3.4 mm/s',
      desc: 'Harmonic frequency spike detected at 2,400 RPM. Bearing lubrication recommended.'
    },
    {
      id: 'coolant',
      label: 'Auxiliary Coolant Manifold',
      x: 370,
      y: 180,
      severity: 'normal',
      value: coolantBoost ? 'Active (5.8 bar)' : 'Normal (4.8 bar)',
      desc: coolantBoost ? 'Coolant flow boosted to 12.4 L/min.' : 'Click button to trigger instant thermal flush.'
    },
    {
      id: 'bore',
      label: 'Precision Bore Flank (CMM Station)',
      x: 270,
      y: 220,
      severity: 'normal',
      value: '±0.012 mm',
      desc: 'Optical probe verified concentricity within allowable ±0.025 mm tolerance window.'
    }
  ];

  const selectedHotspotData = hotspots.find(h => h.id === activeHotspot) || hotspots[0];

  const handleHotspotClick = (id: string) => {
    sound.playClick();
    setActiveHotspot(id);
  };

  const handleToggleCoolant = () => {
    sound.playSuccess();
    setCoolantBoost(!coolantBoost);
  };

  return (
    <div className="p-6 rounded-3xl bg-white border border-[#E6EFF5] shadow-sm space-y-4">
      {/* Visualizer Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E6EFF5] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#E7EDFF] text-[#2D60FF] flex items-center justify-center">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-[#343C6A]">
                Interactive 3D Digital Twin CAD
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E7EDFF] text-[#2D60FF]">
                1:1 VIRTUAL TWIN
              </span>
            </div>
            <p className="text-xs text-[#718EBF]">
              Target: <span className="font-semibold text-[#343C6A]">{productId}</span> • Batch: {batchId} • Machined on: {machineId}
            </p>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-[#F5F7FA] p-1 rounded-full border border-[#E6EFF5]">
          <button
            onClick={() => {
              sound.playClick();
              setViewMode('thermal');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              viewMode === 'thermal'
                ? 'bg-[#FE5C73] text-white shadow-xs'
                : 'text-[#718EBF] hover:text-[#343C6A]'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>Thermal Heatmap</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setViewMode('xray');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              viewMode === 'xray'
                ? 'bg-[#2D60FF] text-white shadow-xs'
                : 'text-[#718EBF] hover:text-[#343C6A]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>X-Ray Wireframe</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setViewMode('solid');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              viewMode === 'solid'
                ? 'bg-[#16DBCC] text-white shadow-xs'
                : 'text-[#718EBF] hover:text-[#343C6A]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Solid Shaded</span>
          </button>
        </div>
      </div>

      {/* Main Interactive CAD Canvas Area */}
      <div className="relative w-full h-80 rounded-2xl bg-[#F8FAFC] border border-[#E6EFF5] overflow-hidden flex items-center justify-center select-none group">
        {/* Isometric Grid Background */}
        <div
          className="absolute inset-0 opacity-[0.25] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, #C5D3E8 1.5px, transparent 1.5px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* HUD in corners */}
        <div className="absolute top-3 left-4 text-xs font-medium text-[#718EBF] flex items-center gap-1">
          <span>COORDINATES: X:142.4 Y:88.1 Z:12.0</span>
        </div>
        <div className="absolute top-3 right-4 text-xs font-medium text-[#718EBF] flex items-center gap-2">
          <span>ORTHO-ISOMETRIC CAD</span>
          <button
            onClick={() => setIsRotating(!isRotating)}
            className="p-1.5 rounded-full bg-white hover:bg-[#EEF2F6] text-[#2D60FF] border border-[#E6EFF5] shadow-xs"
            title="Toggle CAD rotation angle"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Scalable Vector Isometric CAD Assembly */}
        <svg
          viewBox="0 0 550 300"
          className={`w-full h-full max-w-xl transition-transform duration-500 ${
            isRotating ? 'scale-105 rotate-1' : ''
          }`}
        >
          <defs>
            {/* Thermal Heatmap Gradient */}
            <radialGradient id="thermalHotspot" cx="55%" cy="38%" r="45%">
              <stop offset="0%" stopColor="#FE5C73" stopOpacity="0.85" />
              <stop offset="35%" stopColor="#FFBB38" stopOpacity="0.75" />
              <stop offset="70%" stopColor="#2D60FF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#E2E8F0" stopOpacity="0.2" />
            </radialGradient>

            {/* Solid Shaded Gradient */}
            <linearGradient id="solidMetal" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#CBD5E1" />
              <stop offset="50%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#64748B" />
            </linearGradient>

            <linearGradient id="solidMetalTop" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>
          </defs>

          {/* Isometric Caliper Arm Body Shapes */}
          <g transform="translate(10, 10)">
            {/* Base Shadow */}
            <ellipse cx="275" cy="245" rx="160" ry="28" fill="#343C6A" fillOpacity="0.08" />

            {/* Main Cast Housing Body */}
            <path
              d="M 170 140 L 275 80 L 380 140 L 380 200 L 275 250 L 170 190 Z"
              fill={viewMode === 'thermal' ? 'url(#thermalHotspot)' : viewMode === 'solid' ? 'url(#solidMetal)' : '#FFFFFF'}
              stroke={viewMode === 'xray' ? '#2D60FF' : '#475569'}
              strokeWidth={viewMode === 'xray' ? '2' : '1.5'}
              strokeDasharray={viewMode === 'xray' ? '4 2' : undefined}
            />

            {/* Top Mounting Plate Flange */}
            <path
              d="M 210 115 L 275 75 L 340 115 L 275 150 Z"
              fill={viewMode === 'solid' ? 'url(#solidMetalTop)' : viewMode === 'thermal' ? '#FE5C73' : '#FFFFFF'}
              fillOpacity={viewMode === 'thermal' ? '0.7' : '1'}
              stroke="#2D60FF"
              strokeWidth="2"
            />

            {/* Caliper Piston Bore Cutout */}
            <ellipse
              cx="275"
              cy="165"
              rx="42"
              ry="22"
              fill={viewMode === 'solid' ? '#1E293B' : '#FFFFFF'}
              stroke="#2D60FF"
              strokeWidth="2"
            />
            <path
              d="M 233 165 L 233 195 C 233 210, 317 210, 317 195 L 317 165"
              fill="none"
              stroke="#2D60FF"
              strokeWidth="2"
            />

            {/* Cooling Fins */}
            <line x1="200" y1="160" x2="200" y2="185" stroke="#64748B" strokeWidth="2" />
            <line x1="220" y1="170" x2="220" y2="195" stroke="#64748B" strokeWidth="2" />
            <line x1="330" y1="170" x2="330" y2="195" stroke="#64748B" strokeWidth="2" />
            <line x1="350" y1="160" x2="350" y2="185" stroke="#64748B" strokeWidth="2" />

            {/* Auxiliary Coolant Conduit */}
            <path
              d="M 340 115 C 370 130, 390 160, 370 190"
              fill="none"
              stroke={coolantBoost ? '#10B981' : '#8BA3CB'}
              strokeWidth={coolantBoost ? '4' : '2'}
              strokeDasharray={coolantBoost ? '6 3' : undefined}
              className={coolantBoost ? 'animate-pulse' : ''}
            />

            {/* Internal Wireframe Lines in X-Ray View */}
            {viewMode === 'xray' && (
              <g stroke="#2D60FF" strokeWidth="1" strokeDasharray="2 2" fill="none">
                <ellipse cx="275" cy="115" rx="55" ry="30" />
                <line x1="220" y1="115" x2="220" y2="175" />
                <line x1="330" y1="115" x2="330" y2="175" />
                <circle cx="275" cy="165" r="16" />
              </g>
            )}

            {/* Interactive Hotspots */}
            {hotspots.map(h => {
              const isSelected = activeHotspot === h.id;
              const isCrit = h.severity === 'critical';
              const isWarn = h.severity === 'warning';

              return (
                <g
                  key={h.id}
                  onClick={() => handleHotspotClick(h.id)}
                  className="cursor-pointer group/hotspot"
                >
                  <circle
                    cx={h.x}
                    cy={h.y}
                    r={isSelected ? '14' : '10'}
                    fill="none"
                    stroke={isCrit ? '#FE5C73' : isWarn ? '#FFBB38' : '#2D60FF'}
                    strokeWidth="1.5"
                    className="animate-ping opacity-75"
                  />

                  <circle
                    cx={h.x}
                    cy={h.y}
                    r={isSelected ? '9' : '7'}
                    fill={isSelected ? '#2D60FF' : isCrit ? '#FE5C73' : '#FFFFFF'}
                    stroke={isCrit ? '#FE5C73' : '#2D60FF'}
                    strokeWidth="2"
                  />

                  <circle
                    cx={h.x}
                    cy={h.y}
                    r="3"
                    fill={isSelected ? '#FFFFFF' : '#343C6A'}
                  />

                  {/* Hotspot Tag Label */}
                  <rect
                    x={h.x + 12}
                    y={h.y - 12}
                    width={h.value.length * 8 + 18}
                    height="20"
                    rx="10"
                    fill="#FFFFFF"
                    stroke={isSelected ? '#2D60FF' : '#E6EFF5'}
                    strokeWidth="1.5"
                  />
                  <text
                    x={h.x + 18}
                    y={h.y + 2}
                    fill={isCrit ? '#FE5C73' : isWarn ? '#FFBB38' : '#2D60FF'}
                    fontSize="10"
                    fontFamily="sans-serif"
                    fontWeight="bold"
                  >
                    {h.value}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Bottom Legend */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-[#718EBF] bg-white/95 backdrop-blur-sm px-4 py-2 rounded-2xl border border-[#E6EFF5] shadow-xs">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FE5C73] animate-pulse" />
            <span>Click any hotspot node to inspect live sensor telemetry</span>
          </span>
          <span className="text-[#2D60FF] font-bold">
            Mode: {viewMode.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Selected Hotspot Deep Diagnostic Tray */}
      <div className="p-4 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div
            className={`p-2.5 rounded-2xl mt-0.5 ${
              selectedHotspotData.severity === 'critical'
                ? 'bg-[#FFEBEF] text-[#FE5C73]'
                : selectedHotspotData.severity === 'warning'
                ? 'bg-[#FFF5D9] text-[#FFBB38]'
                : 'bg-[#E7EDFF] text-[#2D60FF]'
            }`}
          >
            {selectedHotspotData.id === 'temp' ? (
              <Thermometer className="w-5 h-5" />
            ) : selectedHotspotData.id === 'vibration' ? (
              <Activity className="w-5 h-5" />
            ) : selectedHotspotData.id === 'coolant' ? (
              <Droplets className="w-5 h-5" />
            ) : (
              <CheckCircle2 className="w-5 h-5" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-[#343C6A]">
                {selectedHotspotData.label}
              </h4>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  selectedHotspotData.severity === 'critical'
                    ? 'bg-[#FFEBEF] text-[#FE5C73]'
                    : selectedHotspotData.severity === 'warning'
                    ? 'bg-[#FFF5D9] text-[#FFBB38]'
                    : 'bg-[#E1F8EC] text-[#10B981]'
                }`}
              >
                {selectedHotspotData.value}
              </span>
            </div>
            <p className="text-xs text-[#718EBF] mt-0.5">
              {selectedHotspotData.desc}
            </p>
          </div>
        </div>

        {/* Hotspot Interactive Action Trigger */}
        <div className="flex items-center gap-2 self-end md:self-auto flex-shrink-0">
          {selectedHotspotData.id === 'coolant' || selectedHotspotData.id === 'temp' ? (
            <button
              onClick={handleToggleCoolant}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                coolantBoost
                  ? 'bg-[#10B981] text-white shadow-sm'
                  : 'bg-[#2D60FF] hover:bg-blue-700 text-white shadow-[0_4px_12px_rgba(45,96,255,0.3)]'
              }`}
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>{coolantBoost ? 'Coolant Active (-3.4°C)' : 'Trigger Coolant Flush'}</span>
            </button>
          ) : (
            <span className="text-xs text-[#718EBF] font-medium">
              Sensor status verified
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
