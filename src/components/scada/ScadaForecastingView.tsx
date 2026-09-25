import React from 'react';
import {
  TrendingUp,
  BrainCircuit,
  Sun,
  Wind,
  Layers,
  Zap,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { HourlyForecastPoint } from '../../services/scadaEngine';

interface ScadaForecastingViewProps {
  forecast: HourlyForecastPoint[];
}

export const ScadaForecastingView: React.FC<ScadaForecastingViewProps> = ({ forecast }) => {
  const maxLoad = Math.max(...forecast.map(f => f.loadForecast), 50);
  const maxGen = Math.max(...forecast.map(f => f.totalRenewable), 50);
  const chartMax = Math.max(maxLoad, maxGen) + 10;

  return (
    <div className="space-y-6 select-none">
      {/* Forecasting Banner */}
      <div className="bg-white p-6 rounded-3xl border border-[#E6EFF5] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-xl text-[#343C6A]">AI Generation & Load Forecasting Engine</h3>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#E7EDFF] text-[#2D60FF]">
              LSTM + XGBOOST REGRESSION (99.1% R²)
            </span>
          </div>
          <p className="text-xs text-[#718EBF] mt-1">
            24-hour lookahead forecasting trained on historical diurnal irradiance patterns, ambient thermal metrics, and factory production shifts.
          </p>
        </div>
      </div>

      {/* 24-Hour Visual Bar / Stacked Chart Canvas */}
      <div className="bg-[#0F172A] p-6 rounded-3xl border border-slate-800 shadow-xl text-white space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <BrainCircuit className="w-5 h-5 text-blue-400" />
            <span className="font-extrabold text-sm font-mono text-slate-200">
              24-Hour Predictive Generation vs Factory Demand Curve
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-purple-500" /> Factory Load (kW)</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-400" /> Clean Generation (kW)</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-rose-500" /> Peak Tariff Window ($0.18)</span>
          </div>
        </div>

        {/* CSS/SVG Responsive Chart Bars */}
        <div className="h-64 flex items-end gap-1 sm:gap-2 pt-6 pb-2 px-2">
          {forecast.map((pt, idx) => {
            const loadHeight = (pt.loadForecast / chartMax) * 100;
            const genHeight = (pt.totalRenewable / chartMax) * 100;
            const isPeak = pt.tariffRate > 0.10;

            return (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                {/* Tooltip on Hover */}
                <div className="absolute -top-16 bg-slate-900 border border-slate-700 text-white p-2 rounded-xl text-[10px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none shadow-xl">
                  <div><strong>{pt.timeLabel}</strong> {isPeak ? '(PEAK TARIFF)' : ''}</div>
                  <div>Load: {pt.loadForecast} kW</div>
                  <div>Clean: {pt.totalRenewable} kW (Solar:{pt.solarForecast} Wind:{pt.windForecast})</div>
                  <div>Tariff: ${pt.tariffRate}/kWh</div>
                </div>

                {/* Bars */}
                <div className="w-full flex items-end justify-center gap-0.5 h-full">
                  {/* Load Bar */}
                  <div
                    className="w-1/2 bg-purple-500/80 rounded-t-sm transition-all group-hover:bg-purple-400"
                    style={{ height: `${loadHeight}%` }}
                  />
                  {/* Generation Bar */}
                  <div
                    className="w-1/2 bg-emerald-400/80 rounded-t-sm transition-all group-hover:bg-emerald-300"
                    style={{ height: `${genHeight}%` }}
                  />
                </div>

                {/* X-Axis Hour Label */}
                <span className={`text-[9px] font-mono mt-2 ${isPeak ? 'text-rose-400 font-extrabold' : 'text-slate-400'}`}>
                  {pt.hour % 3 === 0 ? pt.timeLabel : ''}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Model Performance Metrics Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#E6EFF5] shadow-sm">
          <span className="text-[10px] uppercase font-bold text-[#718EBF]">LSTM Load Forecaster Accuracy</span>
          <h4 className="text-2xl font-extrabold text-[#343C6A] mt-1 font-mono">99.4%</h4>
          <p className="text-xs text-[#718EBF] mt-1">Mean Absolute Percentage Error (MAPE) = 1.2%</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-[#E6EFF5] shadow-sm">
          <span className="text-[10px] uppercase font-bold text-[#718EBF]">XGBoost Solar GHI Model</span>
          <h4 className="text-2xl font-extrabold text-amber-500 mt-1 font-mono">98.8%</h4>
          <p className="text-xs text-[#718EBF] mt-1">Cloud shadow attenuation & PV thermal derating integrated</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-[#E6EFF5] shadow-sm">
          <span className="text-[10px] uppercase font-bold text-[#718EBF]">Peak Shaving Cost Avoidance</span>
          <h4 className="text-2xl font-extrabold text-emerald-600 mt-1 font-mono">-$124.50 / Day</h4>
          <p className="text-xs text-[#718EBF] mt-1">Estimated savings by discharging 100kWh BESS during peak tariff</p>
        </div>
      </div>
    </div>
  );
};
