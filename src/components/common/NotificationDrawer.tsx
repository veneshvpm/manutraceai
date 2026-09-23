import React, { useState } from 'react';
import {
  X,
  Bell,
  AlertOctagon,
  AlertTriangle,
  Info,
  CheckCheck,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationDrawer: React.FC = () => {
  const {
    isNotificationsOpen,
    setIsNotificationsOpen,
    alerts,
    markAlertRead,
    markAllAlertsRead,
    setSelectedBatchId,
    setSelectedMachineId,
    setActiveTab
  } = useApp();

  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');

  if (!isNotificationsOpen) return null;

  const filteredAlerts = alerts.filter(a => {
    if (severityFilter === 'all') return true;
    return a.severity === severityFilter;
  });

  const handleActionClick = (alert: any) => {
    markAlertRead(alert.id);
    setIsNotificationsOpen(false);

    if (alert.entityType === 'batch') {
      setSelectedBatchId(alert.entityId);
      setActiveTab('passport');
    } else if (alert.entityType === 'machine') {
      setSelectedMachineId(alert.entityId);
      setActiveTab('machines');
    } else if (alert.entityType === 'material') {
      setActiveTab('reverse-trace');
    } else {
      setActiveTab('dashboard');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md h-full bg-white border-l border-[#E6EFF5] shadow-2xl flex flex-col">
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#E6EFF5] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E7EDFF] text-[#2D60FF] flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#343C6A]">Incident Stream</h3>
              <p className="text-xs text-[#718EBF]">
                {alerts.filter(a => !a.read).length} Unacknowledged Alerts
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsNotificationsOpen(false)}
            className="p-2 rounded-full text-[#718EBF] hover:text-[#343C6A] hover:bg-[#F5F7FA] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 border-b border-[#E6EFF5] flex items-center justify-between gap-2 bg-[#F5F7FA]">
          <div className="flex items-center gap-1.5">
            {(['all', 'critical', 'warning', 'info'] as const).map(sev => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
                  severityFilter === sev
                    ? 'bg-[#2D60FF] text-white shadow-xs'
                    : 'text-[#718EBF] hover:text-[#343C6A] hover:bg-white'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          <button
            onClick={markAllAlertsRead}
            className="flex items-center gap-1 text-xs font-semibold text-[#718EBF] hover:text-[#2D60FF] transition-colors"
            title="Mark all as read"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark all read</span>
          </button>
        </div>

        {/* Alert List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12 text-[#718EBF]">
              <CheckCheck className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs font-medium">No notifications in this category.</p>
            </div>
          ) : (
            filteredAlerts.map(alert => {
              const isCritical = alert.severity === 'critical';
              const isWarning = alert.severity === 'warning';

              return (
                <div
                  key={alert.id}
                  className={`p-4 rounded-3xl border transition-all ${
                    alert.read
                      ? 'bg-[#F5F7FA] border-[#E6EFF5] opacity-60'
                      : isCritical
                      ? 'bg-[#FFEBEF] border-[#FE5C73]/30 shadow-sm'
                      : isWarning
                      ? 'bg-[#FFF5D9] border-[#FFBB38]/30 shadow-sm'
                      : 'bg-[#E7EDFF] border-[#2D60FF]/30 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className="mt-0.5">
                      {isCritical ? (
                        <div className="w-8 h-8 rounded-full bg-[#FE5C73] text-white flex items-center justify-center">
                          <AlertOctagon className="w-4 h-4" />
                        </div>
                      ) : isWarning ? (
                        <div className="w-8 h-8 rounded-full bg-[#FFBB38] text-white flex items-center justify-center">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#2D60FF] text-white flex items-center justify-center">
                          <Info className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            isCritical
                              ? 'bg-[#FE5C73] text-white'
                              : isWarning
                              ? 'bg-[#FFBB38] text-white'
                              : 'bg-[#2D60FF] text-white'
                          }`}
                        >
                          {alert.severity}
                        </span>
                        <span className="text-[11px] text-[#718EBF] font-mono">
                          {alert.timestamp}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-[#343C6A] leading-tight mb-1">
                        {alert.title}
                      </h4>
                      <p className="text-[11px] text-[#718EBF] leading-relaxed mb-3">
                        {alert.description}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-black/5">
                        <span className="text-[11px] font-bold font-mono text-[#343C6A]">
                          ID: <span className="text-[#2D60FF]">{alert.entityId}</span>
                        </span>

                        <button
                          onClick={() => handleActionClick(alert)}
                          className="flex items-center gap-1 text-xs font-bold text-[#2D60FF] hover:underline transition-colors"
                        >
                          <span>Inspect Entity</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E6EFF5] bg-[#F5F7FA] text-center">
          <p className="text-xs text-[#718EBF]">
            Live Event Stream Connected • Auto-refreshed
          </p>
        </div>
      </div>
    </div>
  );
};
