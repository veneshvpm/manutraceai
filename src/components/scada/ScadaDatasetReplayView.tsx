import React, { useState, useEffect } from 'react';
import {
  Database,
  Play,
  Pause,
  RotateCcw,
  Upload,
  FileSpreadsheet,
  CheckCircle,
  Clock,
  FastForward,
  Layers,
  Sparkles
} from 'lucide-react';
import { ScadaTelemetry } from '../../types';
import { sound } from '../../services/soundFx';

interface ScadaDatasetReplayViewProps {
  onReplayTick: (data: Partial<ScadaTelemetry>) => void;
  onShowToast: (toast: { type: 'success' | 'info' | 'warning' | 'error'; title: string; message: string }) => void;
}

export const ScadaDatasetReplayView: React.FC<ScadaDatasetReplayViewProps> = ({
  onReplayTick,
  onShowToast
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [totalSteps, setTotalSteps] = useState<number>(100);
  const [selectedDataset, setSelectedDataset] = useState<'solar' | 'wind' | 'battery' | 'load' | 'inverter' | 'grid'>('solar');

  // Synthetic historical frames
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          const next = prev >= totalSteps ? 0 : prev + 1;
          const progress = next / totalSteps;
          const hour = 6 + (progress * 18);
          const solar = Math.max(0, 32 * Math.sin(((hour - 6) / 12) * Math.PI));
          const wind = 15 + Math.sin(progress * 10) * 8;
          const load = 35 + Math.cos(progress * 8) * 6;
          const soc = 50 + Math.sin(progress * 6) * 30;

          onReplayTick({
            Solar_Power: Number(solar.toFixed(1)),
            Wind_Power: Number(wind.toFixed(1)),
            Load_Demand: Number(load.toFixed(1)),
            Battery_SOC: Number(soc.toFixed(1)),
            hour: Number(hour.toFixed(2))
          });

          return next;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, totalSteps, onReplayTick]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      sound.playSuccess();
      onShowToast({
        type: 'success',
        title: 'Dataset Ingested',
        message: `Parsed historical sensor stream: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`
      });
    }
  };

  return (
    <div className="space-y-6 select-none">
      <div className="bg-white p-6 rounded-3xl border border-[#E6EFF5] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-xl text-[#343C6A]">Historical SCADA Dataset Replay Studio</h3>
          <p className="text-xs text-[#718EBF] mt-1">
            Simulate historical time-series sensor playback across Solar, Wind, BESS, Inverter, and Factory load profiles.
          </p>
        </div>

        <label className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#E7EDFF] hover:bg-[#d6e3ff] text-[#2D60FF] text-xs font-bold transition-colors cursor-pointer border border-[#2D60FF]/20 shadow-xs">
          <Upload className="w-4 h-4" />
          <span>Upload Custom Sensor CSV</span>
          <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      {/* Dataset Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { id: 'solar', label: 'solar_dataset.csv', rows: '1,440 Rows', size: '8.9 KB' },
          { id: 'wind', label: 'wind_dataset.csv', rows: '1,440 Rows', size: '7.1 KB' },
          { id: 'battery', label: 'battery_dataset.csv', rows: '1,440 Rows', size: '9.4 KB' },
          { id: 'load', label: 'load_dataset.csv', rows: '1,440 Rows', size: '8.0 KB' },
          { id: 'inverter', label: 'inverter_dataset.csv', rows: '1,440 Rows', size: '7.8 KB' },
          { id: 'grid', label: 'grid_dataset.csv', rows: '1,440 Rows', size: '7.9 KB' }
        ].map((ds) => (
          <div
            key={ds.id}
            onClick={() => {
              sound.playClick();
              setSelectedDataset(ds.id as any);
            }}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              selectedDataset === ds.id
                ? 'bg-[#E7EDFF] border-[#2D60FF] text-[#343C6A] shadow-xs font-bold'
                : 'bg-white border-[#E6EFF5] hover:bg-[#F5F7FA] text-[#718EBF]'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <FileSpreadsheet className="w-4 h-4 text-[#2D60FF]" />
              <span className="text-xs font-mono truncate">{ds.label}</span>
            </div>
            <div className="flex justify-between text-[10px] text-[#718EBF]">
              <span>{ds.rows}</span>
              <span>{ds.size}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Replay Scrubber & Control Deck */}
      <div className="bg-[#0F172A] p-6 rounded-3xl border border-slate-800 shadow-xl text-white space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-cyan-400" />
            <span className="font-extrabold text-sm font-mono text-cyan-300">
              Sensor Timeline Replay Engine (Step {currentStep} / {totalSteps})
            </span>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-800 text-emerald-400">
            {isPlaying ? 'PLAYBACK STREAMING' : 'PAUSED'}
          </span>
        </div>

        {/* Timeline Slider */}
        <div className="space-y-2 font-mono">
          <input
            type="range"
            min="0"
            max={totalSteps}
            value={currentStep}
            onChange={(e) => setCurrentStep(Number(e.target.value))}
            className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>00:00:00 (Start of Day)</span>
            <span>12:00:00 (Solar Peak)</span>
            <span>23:59:59 (End of Day)</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sound.playClick();
                setIsPlaying(!isPlaying);
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#2D60FF] hover:bg-[#1230AE] text-white text-xs font-bold transition-all shadow-md"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Pause Replay' : 'Play Timeline'}</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setCurrentStep(0);
                setIsPlaying(false);
              }}
              className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Reset Timeline"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold">Speed:</span>
            {[1, 2, 5, 10].map((spd) => (
              <button
                key={spd}
                onClick={() => {
                  sound.playClick();
                  setPlaybackSpeed(spd);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-colors ${
                  playbackSpeed === spd ? 'bg-cyan-500 text-slate-950 font-extrabold' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
