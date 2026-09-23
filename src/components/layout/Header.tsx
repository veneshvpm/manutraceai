import React, { useState } from 'react';
import {
  Search,
  Bell,
  Factory,
  ChevronDown,
  Sparkles,
  LogOut,
  Check,
  Radio,
  SlidersHorizontal
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { IndustryType } from '../../types';
import { sound } from '../../services/soundFx';

export const Header: React.FC = () => {
  const {
    currentIndustry,
    setIndustry,
    industryConfig,
    user,
    logout,
    alerts,
    setIsSearchOpen,
    setIsNotificationsOpen,
    startDemoTour,
    isDemoTourActive,
    isLiveTelemetryActive,
    toggleLiveTelemetry
  } = useApp();

  const [isIndustryDropdownOpen, setIsIndustryDropdownOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const unreadAlerts = alerts.filter(a => !a.read);
  const criticalCount = unreadAlerts.filter(a => a.severity === 'critical').length;

  const industryList: { id: IndustryType; label: string; icon: string }[] = [
    { id: 'automotive', label: 'Automotive & Precision Eng.', icon: '🚗' },
    { id: 'electronics', label: 'Semiconductor & Electronics', icon: '⚡' },
    { id: 'pharmaceutical', label: 'Pharma & BioTech (cGMP)', icon: '💊' },
    { id: 'food', label: 'Food & Beverage Processing', icon: '🥫' },
    { id: 'textile', label: 'Technical Textiles & Apparel', icon: '🧵' }
  ];

  return (
    <header className="h-20 bg-white border-b border-[#E6EFF5] px-8 flex items-center justify-between sticky top-0 z-20 shadow-[0_2px_10px_rgba(0,0,0,0.015)]">
      {/* Left: BankDash Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center justify-between px-5 py-2.5 rounded-full bg-[#F5F7FA] hover:bg-[#EEF2F6] text-[#718EBF] transition-all text-sm group"
        >
          <div className="flex items-center gap-3">
            <Search className="w-4 h-4 text-[#718EBF] group-hover:text-[#2D60FF] transition-colors" />
            <span className="text-[#8BA3CB] font-normal">
              Search Product, Batch, Machine, Supplier...
            </span>
          </div>
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-medium text-[#718EBF] bg-white rounded-full border border-[#E6EFF5] shadow-xs">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Center Tagline Banner in BankDash pastel badge */}
      <div className="hidden xl:flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E7EDFF] text-xs font-semibold text-[#2D60FF]">
        <span className="w-2 h-2 rounded-full bg-[#2D60FF] animate-pulse" />
        <span className="tracking-wide">
          TRACE EVERYTHING. UNDERSTAND ANYTHING. ACT BEFORE IMPACT.
        </span>
      </div>

      {/* Right: BankDash Circular Controls & User Profile */}
      <div className="flex items-center gap-3">
        {/* Live Telemetry Stream Indicator & Toggle */}
        <button
          onClick={() => {
            toggleLiveTelemetry();
            sound.playClick();
          }}
          className={`hidden md:flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium transition-all ${
            isLiveTelemetryActive
              ? 'bg-[#E1F8EC] text-[#10B981]'
              : 'bg-[#F5F7FA] text-[#718EBF] hover:bg-[#EEF2F6]'
          }`}
          title="Toggle 10 Hz Real-Time Telemetry Stream Simulation"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isLiveTelemetryActive ? 'bg-[#10B981] animate-pulse' : 'bg-[#8BA3CB]'
            }`}
          />
          <Radio className="w-3.5 h-3.5" />
          <span className="font-semibold text-[11px]">
            {isLiveTelemetryActive ? '10 Hz Live' : 'Paused'}
          </span>
        </button>

        {/* EXPO DEMO GUIDED TOUR BUTTON */}
        <button
          onClick={() => {
            sound.playSuccess();
            startDemoTour();
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 shadow-sm ${
            isDemoTourActive
              ? 'bg-[#16DBCC] text-white shadow-[0_4px_15px_rgba(22,219,204,0.4)]'
              : 'bg-gradient-to-r from-[#2D60FF] to-[#1230AE] text-white hover:opacity-95 shadow-[0_4px_15px_rgba(45,96,255,0.35)]'
          }`}
          title="Launch 5-Minute Project Expo Story Tour"
        >
          <Sparkles className="w-3.5 h-3.5 animate-spin text-white" style={{ animationDuration: '6s' }} />
          <span>{isDemoTourActive ? 'Tour Active' : '5-Min Expo Tour'}</span>
        </button>

        {/* Industry / Factory Selector */}
        <div className="relative">
          <button
            onClick={() => setIsIndustryDropdownOpen(!isIndustryDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#F5F7FA] hover:bg-[#EEF2F6] text-xs font-semibold text-[#343C6A] transition-colors"
          >
            <Factory className="w-3.5 h-3.5 text-[#2D60FF]" />
            <span className="max-w-[140px] truncate">
              {industryConfig.name.split(' ')[0]}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#718EBF]" />
          </button>

          {isIndustryDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-3xl bg-white border border-[#E6EFF5] shadow-[0_10px_35px_rgba(0,0,0,0.08)] p-2 z-50">
              <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#718EBF] border-b border-[#E6EFF5]">
                Select Manufacturing Sector
              </div>
              <div className="mt-1 space-y-1">
                {industryList.map(ind => (
                  <button
                    key={ind.id}
                    onClick={() => {
                      setIndustry(ind.id);
                      setIsIndustryDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-medium transition-colors ${
                      currentIndustry === ind.id
                        ? 'bg-[#E7EDFF] text-[#2D60FF] font-semibold'
                        : 'text-[#343C6A] hover:bg-[#F5F7FA]'
                    }`}
                  >
                    <span className="flex items-center gap-2.5 truncate">
                      <span className="text-sm">{ind.icon}</span>
                      <span className="truncate">{ind.label}</span>
                    </span>
                    {currentIndustry === ind.id && <Check className="w-4 h-4 text-[#2D60FF]" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* BankDash Circular Notification Bell */}
        <button
          onClick={() => setIsNotificationsOpen(true)}
          className="relative w-11 h-11 rounded-full bg-[#F5F7FA] hover:bg-[#EEF2F6] text-[#718EBF] hover:text-[#2D60FF] flex items-center justify-center transition-colors"
          title="Manufacturing Alerts & Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadAlerts.length > 0 && (
            <span
              className={`absolute top-2 right-2 flex h-2.5 w-2.5 rounded-full ${
                criticalCount > 0 ? 'bg-[#FE5C73] animate-pulse' : 'bg-[#2D60FF]'
              }`}
            />
          )}
        </button>

        {/* BankDash User Profile */}
        <div className="relative">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-[#F5F7FA] transition-colors"
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#2D60FF] to-[#16DBCC] flex items-center justify-center text-sm font-bold text-white shadow-sm ring-2 ring-white">
              {user.avatar}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-[#343C6A] leading-tight">{user.name}</span>
              <span className="text-[11px] text-[#718EBF] leading-none truncate max-w-[120px]">
                {user.role}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#718EBF]" />
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-60 rounded-3xl bg-white border border-[#E6EFF5] shadow-[0_10px_35px_rgba(0,0,0,0.08)] p-3 z-50">
              <div className="px-3 py-2 border-b border-[#E6EFF5]">
                <p className="text-xs font-bold text-[#343C6A]">{user.name}</p>
                <p className="text-[11px] text-[#718EBF] truncate">{user.email}</p>
                <span className="inline-block mt-1 text-[10px] font-semibold text-[#2D60FF] bg-[#E7EDFF] px-2 py-0.5 rounded-full">
                  {user.plant}
                </span>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#FE5C73] hover:bg-[#FFEBEF] rounded-2xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out / Switch User</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
