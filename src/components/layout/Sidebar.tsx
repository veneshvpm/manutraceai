import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShieldCheck,
  Package,
  GitFork,
  BrainCircuit,
  SearchCode,
  AlertTriangle,
  Sliders,
  CheckCircle,
  Building2,
  Cpu,
  BarChart3,
  FileSpreadsheet,
  Settings,
  ChevronLeft,
  ChevronRight,
  Boxes,
  Factory,
  Volume2,
  VolumeX,
  Database
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { IndustryVisualIcon } from '../common/IndustryVisualIcon';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    alerts,
    isSoundEnabled,
    toggleSound,
    currentIndustry,
    industryConfig
  } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  const unreadCriticalCount = alerts.filter(a => !a.read && a.severity === 'critical').length;

  const navItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'dataset', label: 'Dataset Studio', icon: Factory, badge: 'LOAD', badgeColor: 'bg-[#DCFAF8] text-[#16DBCC]' },
    { id: 'passport', label: 'Manufacturing Passport', icon: ShieldCheck, badge: 'CORE', badgeColor: 'bg-[#E7EDFF] text-[#2D60FF]' },
    { id: 'products', label: 'Products & Batches', icon: Package },
    { id: 'traceability', label: 'Traceability Flow', icon: GitFork },
    { id: 'reverse-trace', label: 'Reverse Traceability', icon: Boxes, badge: 'KEY', badgeColor: 'bg-[#DCFAF8] text-[#16DBCC]' },
    { id: 'ai-intelligence', label: 'AI Intelligence', icon: BrainCircuit, badge: 'AI', badgeColor: 'bg-[#E7EDFF] text-[#2D60FF]' },
    { id: 'rca', label: 'Root Cause Analysis', icon: SearchCode },
    { id: 'impact', label: 'Impact Analysis', icon: AlertTriangle, badge: unreadCriticalCount > 0 ? `${unreadCriticalCount} Alert` : undefined, badgeColor: 'bg-[#FFEBEF] text-[#FE5C73]' },
    { id: 'simulator', label: 'What-If Simulator', icon: Sliders, badge: 'NEW', badgeColor: 'bg-[#FFF5D9] text-[#FFBB38]' },
    { id: 'quality', label: 'Quality Control', icon: CheckCircle },
    { id: 'suppliers', label: 'Suppliers', icon: Building2 },
    { id: 'machines', label: 'Machines & Telemetry', icon: Cpu },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`relative flex flex-col bg-white border-r border-[#E6EFF5] transition-all duration-300 ease-in-out z-30 select-none shadow-[2px_0_12px_rgba(0,0,0,0.02)] ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-20 flex items-center justify-between px-5 border-b border-[#E6EFF5]">
        {!collapsed && (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#2D60FF] to-[#1230AE] p-2 flex items-center justify-center shadow-[0_4px_12px_rgba(45,96,255,0.35)] flex-shrink-0">
              <IndustryVisualIcon type="factory" size={22} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-[#343C6A] flex items-center gap-1.5">
                ManuTrace <span className="text-[#2D60FF] text-[10px] font-bold bg-[#E7EDFF] px-1.5 py-0.5 rounded-full">AI</span>
              </span>
              <span className="text-[11px] text-[#718EBF] font-medium tracking-tight truncate flex items-center gap-1.5">
                <IndustryVisualIcon type={currentIndustry} size={11} className="text-[#2D60FF] flex-shrink-0" />
                <span className="truncate">{industryConfig.name.split(' ')[0]} Sector</span>
              </span>
            </div>
          </div>
        )}

        {collapsed && (
          <div className="mx-auto w-10 h-10 rounded-2xl bg-gradient-to-br from-[#2D60FF] to-[#1230AE] p-2 flex items-center justify-center shadow-[0_4px_12px_rgba(45,96,255,0.35)]" title={`ManuTrace AI - ${industryConfig.name}`}>
            <IndustryVisualIcon type={currentIndustry} size={22} className="text-white" />
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-2 rounded-xl text-[#718EBF] hover:text-[#343C6A] hover:bg-[#F5F7FA] transition-colors ${
            collapsed ? 'hidden' : 'block'
          }`}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-150 group relative ${
                isActive
                  ? 'bg-[#F4F7FE] text-[#2D60FF] font-semibold shadow-sm'
                  : 'text-[#718EBF] hover:text-[#343C6A] hover:bg-[#F5F7FA]'
              }`}
            >
              <Icon
                className={`w-5 h-5 flex-shrink-0 transition-colors ${
                  isActive ? 'text-[#2D60FF]' : 'text-[#718EBF] group-hover:text-[#343C6A]'
                }`}
              />

              {!collapsed && (
                <div className="flex items-center justify-between w-full truncate">
                  <span className="truncate text-left">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        item.badgeColor || 'bg-[#F5F7FA] text-[#718EBF]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}

              {/* BankDash Left Active Indicator */}
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1.5 bg-[#2D60FF] rounded-r-full shadow-[0_0_8px_rgba(45,96,255,0.4)]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Collapse Toggle when in collapsed mode */}
      {collapsed && (
        <div className="p-3 border-t border-[#E6EFF5] flex justify-center">
          <button
            onClick={() => setCollapsed(false)}
            className="p-2.5 rounded-xl text-[#718EBF] hover:text-[#343C6A] hover:bg-[#F5F7FA]"
            title="Expand Sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Status Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-[#E6EFF5] bg-white">
          <div className="p-3 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5]">
            <div className="flex items-center justify-between text-xs font-medium mb-1.5">
              <span className="flex items-center gap-2 text-[#343C6A] font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                Live Telemetry
              </span>
              <button
                onClick={toggleSound}
                className={`p-1 rounded-lg transition-colors ${
                  isSoundEnabled ? 'text-[#2D60FF] bg-[#E7EDFF]' : 'text-[#718EBF] hover:text-[#343C6A]'
                }`}
                title={isSoundEnabled ? 'Industrial Audio Synthesizer ON' : 'Audio Muted'}
              >
                {isSoundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#718EBF]">
              <span>Sync 10 Hz Real-time</span>
              <span className="font-semibold text-[#2D60FF]">v2.4 LTS</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
