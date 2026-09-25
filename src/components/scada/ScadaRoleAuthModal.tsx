import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  ShieldCheck,
  UserCheck,
  X,
  AlertCircle,
  KeyRound
} from 'lucide-react';
import { sound } from '../../services/soundFx';

interface ScadaRoleAuthModalProps {
  isOpen: boolean;
  currentRole: string;
  onClose: () => void;
  onSelectRole: (role: 'admin' | 'engineer' | 'operator' | 'viewer') => void;
}

export const ScadaRoleAuthModal: React.FC<ScadaRoleAuthModalProps> = ({
  isOpen,
  currentRole,
  onClose,
  onSelectRole
}) => {
  if (!isOpen) return null;

  const [selectedRole, setSelectedRole] = useState<'admin' | 'engineer' | 'operator' | 'viewer'>('engineer');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMsg('Please enter security pin / password');
      sound.playAlert();
      return;
    }

    // Role pin validation: Accepts role name or standard '1234' / 'admin'
    const valid = password.toLowerCase() === selectedRole || password === '1234' || password === 'admin';
    if (valid) {
      sound.playSuccess();
      onSelectRole(selectedRole);
      onClose();
    } else {
      setErrorMsg(`Invalid security credential for role [${selectedRole.toUpperCase()}]. Hint: enter '${selectedRole}'`);
      sound.playAlert();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in select-none">
      <div className="bg-white rounded-3xl border border-[#E6EFF5] max-w-sm w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#E6EFF5] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#E7EDFF] flex items-center justify-center text-[#2D60FF]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#343C6A]">Authorize Control Role</h3>
              <span className="text-[11px] text-[#718EBF]">Active: <strong className="text-[#2D60FF] uppercase">{currentRole}</strong></span>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-[#F5F7FA] text-[#718EBF] hover:text-[#343C6A] flex items-center justify-center text-base font-bold"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-2xl bg-[#FFEBEF] border border-[#FE5C73]/30 text-xs text-[#FE5C73] font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#718EBF] font-bold mb-1.5">Select Operational Role:</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'admin', label: 'Admin (Full Setpoint RW)', badge: 'ADMIN' },
                { id: 'engineer', label: 'Engineer (Simulator/Overrides)', badge: 'ENG' },
                { id: 'operator', label: 'Operator (ACK Alarms)', badge: 'OP' },
                { id: 'viewer', label: 'Viewer (Read-Only Telemetry)', badge: 'VIEW' }
              ].map((r) => (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedRole(r.id as any);
                    setErrorMsg('');
                  }}
                  className={`p-2.5 rounded-2xl border text-left font-medium transition-all ${
                    selectedRole === r.id
                      ? 'bg-[#E7EDFF] border-[#2D60FF] text-[#2D60FF] font-bold'
                      : 'bg-[#F5F7FA] border-[#E6EFF5] text-[#718EBF]'
                  }`}
                >
                  <span className="text-[11px] block">{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[#718EBF] font-bold mb-1">Security PIN / Password:</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-[#718EBF] absolute left-3 top-3" />
              <input
                type="password"
                placeholder={`Enter '${selectedRole}' to authorize`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-[#E6EFF5] bg-[#F5F7FA] font-mono text-xs focus:outline-none focus:border-[#2D60FF]"
                autoFocus
              />
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#F5F7FA] border border-[#E6EFF5] text-[10px] text-[#718EBF] space-y-0.5 font-mono">
            <div>• Admin: pass <code>admin</code> (Master setpoint configuration)</div>
            <div>• Engineer: pass <code>engineer</code> (Overrides, breaker toggles)</div>
            <div>• Operator: pass <code>operator</code> (Alarm acknowledgment)</div>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-2xl bg-[#F5F7FA] text-[#718EBF] hover:text-[#343C6A] font-bold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-2xl bg-[#2D60FF] hover:bg-[#1230AE] text-white font-bold text-xs transition-colors shadow-xs"
            >
              Authorize Role
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
