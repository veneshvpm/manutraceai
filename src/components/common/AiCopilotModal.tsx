import React, { useState, useRef, useEffect } from 'react';
import {
  BrainCircuit,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  Flame,
  Boxes,
  Cpu,
  ShieldCheck,
  Mic,
  Copy,
  Check,
  RefreshCw,
  Zap,
  Sliders,
  FileText,
  Building2,
  Package,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { sound } from '../../services/soundFx';
import { generateCopilotResponse, CopilotAction } from '../../services/aiEngine';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  actions?: {
    label: string;
    icon?: React.ElementType;
    onClick: () => void;
  }[];
  metrics?: {
    label: string;
    value: string;
    color: string;
  }[];
}

export const AiCopilotModal: React.FC = () => {
  const {
    isCopilotOpen,
    setIsCopilotOpen,
    batches,
    products,
    machines,
    suppliers,
    rawMaterials,
    inspections,
    defects,
    shipments,
    alerts,
    currentIndustry,
    industryConfig,
    selectedBatchId,
    setSelectedBatchId,
    selectedMachineId,
    setSelectedMachineId,
    selectedRawMaterialId,
    setSelectedRawMaterialId,
    setActiveTab,
    setIsPassportModalOpen,
    setIsExportDossierOpen,
    applyPresetScenario,
    startDemoTour,
    showToast
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-init',
      sender: 'ai',
      text: `Hello Director. I am your **ManuTrace Industrial AI Copilot**.\n\nI have continuous telemetry access to all ${batches.length} active batches, ${machines.length} machine cells, ${suppliers.length} suppliers, and digital passports across the **${industryConfig.name}** facility.\n\nAsk me anything about lots, machine telemetry, supplier certifications, defect forensics, or digital twin simulations!`,
      timestamp: 'Just now',
      actions: [
        {
          label: 'Analyze Batch B-1042 Anomaly',
          icon: Flame,
          onClick: () => {
            setSelectedBatchId('B-1042');
            setActiveTab('rca');
            setIsCopilotOpen(false);
          }
        },
        {
          label: 'Trace Material RM-7821 Blast Radius',
          icon: Boxes,
          onClick: () => {
            setSelectedRawMaterialId('RM-7821');
            setActiveTab('reverse-trace');
            setIsCopilotOpen(false);
          }
        },
        {
          label: 'Machine M04 Fleet Telemetry',
          icon: Cpu,
          onClick: () => {
            setSelectedMachineId('M04');
            setActiveTab('machines');
            setIsCopilotOpen(false);
          }
        },
        {
          label: 'What-If Simulation Lab',
          icon: Sliders,
          onClick: () => {
            setActiveTab('simulator');
            setIsCopilotOpen(false);
          }
        }
      ]
    }
  ]);

  useEffect(() => {
    if (isCopilotOpen) {
      setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [isCopilotOpen, messages]);

  if (!isCopilotOpen) return null;

  const quickPrompts = [
    'What is the current condition of the plant?',
    'Why did Batch B-1042 fail quality inspection?',
    'What is Machine M04 vibration and utilization?',
    'What products are affected by Raw Material RM-7821?',
    'Simulate +10°C thermal drift on Machine M04',
    'List all suppliers by quality scorecard ranking',
    'Verify ISO 9001 compliance for Batch B-1039',
    'Show all failing or quarantined batches'
  ];

  const getActionIcon = (act: CopilotAction) => {
    if (act.targetTab === 'rca') return Flame;
    if (act.targetTab === 'passport') return ShieldCheck;
    if (act.targetTab === 'reverse-trace') return Boxes;
    if (act.targetTab === 'machines') return Cpu;
    if (act.targetTab === 'simulator') return Sliders;
    if (act.targetTab === 'suppliers') return Building2;
    if (act.targetTab === 'products') return Package;
    if (act.modalName === 'export_dossier') return FileText;
    if (act.modalName === 'expo_tour') return Sparkles;
    return ArrowRight;
  };

  const handleSend = (queryText?: string) => {
    const query = (queryText || inputQuery).trim();
    if (!query) return;

    sound.playClick();
    const userMsgId = `user-${Date.now()}`;
    const newMessages: Message[] = [
      ...messages,
      {
        id: userMsgId,
        sender: 'user',
        text: query,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];

    setMessages(newMessages);
    setInputQuery('');
    setIsTyping(true);

    // Process intelligence query across full website data
    setTimeout(() => {
      const response = generateCopilotResponse(query, {
        batches,
        products,
        machines,
        suppliers,
        rawMaterials,
        inspections,
        defects,
        shipments,
        alerts,
        currentIndustry,
        industryConfig,
        selectedBatchId,
        selectedMachineId,
        selectedRawMaterialId
      });

      // Map actions to functional handlers
      const mappedActions = response.actions?.map(act => ({
        label: act.label,
        icon: getActionIcon(act),
        onClick: () => {
          if (act.actionType === 'select_batch' && act.targetId) {
            setSelectedBatchId(act.targetId);
            if (act.targetTab) setActiveTab(act.targetTab);
          } else if (act.actionType === 'select_machine' && act.targetId) {
            setSelectedMachineId(act.targetId);
            if (act.targetTab) setActiveTab(act.targetTab);
          } else if (act.actionType === 'select_material' && act.targetId) {
            setSelectedRawMaterialId(act.targetId);
            if (act.targetTab) setActiveTab(act.targetTab);
          } else if (act.actionType === 'navigate' && act.targetTab) {
            setActiveTab(act.targetTab);
          } else if (act.actionType === 'modal') {
            if (act.modalName === 'export_dossier') setIsExportDossierOpen(true);
            if (act.modalName === 'expo_tour') startDemoTour();
          } else if (act.actionType === 'scenario' && act.scenarioId) {
            applyPresetScenario(act.scenarioId);
          }
          setIsCopilotOpen(false);
        }
      }));

      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: response.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actions: mappedActions,
          metrics: response.metrics
        }
      ]);
      setIsTyping(false);
      sound.playSuccess();
    }, 450);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast({
      type: 'success',
      title: 'Copied to Clipboard',
      message: 'AI diagnostic response copied.'
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleVoiceSimulate = () => {
    setIsListening(true);
    sound.playScan();
    showToast({
      type: 'info',
      title: 'Voice Command Listening',
      message: 'Synthesizing spoken question...'
    });
    setTimeout(() => {
      setIsListening(false);
      handleSend('Why did Batch B-1042 fail quality inspection?');
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
      onClick={() => setIsCopilotOpen(false)}
    >
      <div
        className="w-full max-w-4xl bg-white border border-[#E6EFF5] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.18)] overflow-hidden flex flex-col h-[85vh] max-h-[760px]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E6EFF5] bg-gradient-to-r from-[#2D60FF] via-[#1F4BFF] to-[#1230AE] text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <BrainCircuit className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white tracking-tight">
                  ManuTrace AI Copilot
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#10B981] text-white text-[10px] font-bold tracking-wider uppercase">
                  Online • 10 Hz Real-Time
                </span>
              </div>
              <p className="text-xs text-white/80">
                Connected to full plant telemetry, lots, digital passports, and SPC models
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setMessages([
                  {
                    id: 'msg-init',
                    sender: 'ai',
                    text: `Hello Director. I am your **ManuTrace Industrial AI Copilot**.\n\nI have continuous telemetry access to all ${batches.length} active batches, ${machines.length} machine cells, ${suppliers.length} suppliers, and digital passports across the **${industryConfig.name}** facility.\n\nAsk me anything about lots, machine telemetry, supplier certifications, defect forensics, or digital twin simulations!`,
                    timestamp: 'Just now'
                  }
                ]);
                sound.playClick();
              }}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Reset conversation"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsCopilotOpen(false)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-5 py-3 bg-[#F5F7FA] border-b border-[#E6EFF5] flex items-center gap-2 overflow-x-auto flex-shrink-0 scrollbar-none">
          <span className="text-[11px] font-bold text-[#718EBF] uppercase tracking-wider flex items-center gap-1 flex-shrink-0">
            <Sparkles className="w-3 h-3 text-[#2D60FF]" /> Suggestions:
          </span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-white hover:bg-[#E7EDFF] text-[#343C6A] hover:text-[#2D60FF] border border-[#E6EFF5] shadow-xs transition-colors flex-shrink-0 whitespace-nowrap"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-white">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start gap-3.5 ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-[#343C6A] text-white'
                    : 'bg-gradient-to-tr from-[#2D60FF] to-[#1230AE] text-white shadow-sm'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Content Bubble */}
              <div
                className={`max-w-[85%] rounded-3xl p-4 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#2D60FF] text-white shadow-sm rounded-tr-sm'
                    : 'bg-[#F5F7FA] border border-[#E6EFF5] text-[#343C6A] rounded-tl-sm'
                }`}
              >
                {/* Text render with markdown support */}
                <div className="space-y-2 whitespace-pre-line font-normal">
                  {msg.text.split('\n\n').map((paragraph, pIdx) => (
                    <p key={pIdx}>
                      {paragraph.split('**').map((chunk, cIdx) =>
                        cIdx % 2 === 1 ? (
                          <strong key={cIdx} className="font-extrabold text-[#2D60FF]/90">
                            {chunk}
                          </strong>
                        ) : (
                          chunk
                        )
                      )}
                    </p>
                  ))}
                </div>

                {/* Metrics Cards */}
                {msg.metrics && msg.metrics.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-[#E6EFF5]">
                    {msg.metrics.map((m, mIdx) => (
                      <div key={mIdx} className="p-2 rounded-xl bg-white border border-[#E6EFF5] text-center">
                        <span className="text-[10px] text-[#718EBF] block uppercase font-bold">
                          {m.label}
                        </span>
                        <span className={`text-xs font-black font-mono mt-0.5 block ${m.color}`}>
                          {m.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Interactive Action Buttons */}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#E6EFF5] flex flex-wrap gap-2">
                    {msg.actions.map((act, aIdx) => {
                      const Icon = act.icon || ArrowRight;
                      return (
                        <button
                          key={aIdx}
                          onClick={() => {
                            sound.playClick();
                            act.onClick();
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#E7EDFF] text-[#2D60FF] font-bold text-xs border border-[#2D60FF]/30 shadow-xs transition-colors"
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{act.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Timestamp & Copy Action */}
                <div className="mt-2 flex items-center justify-between text-[10px] text-[#718EBF]/80 pt-1">
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'ai' && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="hover:text-[#2D60FF] flex items-center gap-1 transition-colors"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-[#10B981]" />
                          <span className="text-[#10B981]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-3 text-xs text-[#718EBF] animate-pulse">
              <div className="w-8 h-8 rounded-2xl bg-[#E7EDFF] flex items-center justify-center text-[#2D60FF]">
                <Bot className="w-4 h-4" />
              </div>
              <span>ManuTrace AI is evaluating live telemetry, lot lineage, and SPC models...</span>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-[#E6EFF5] bg-white flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleVoiceSimulate}
            className={`p-2.5 rounded-2xl border transition-colors ${
              isListening
                ? 'bg-[#FE5C73] text-white border-[#FE5C73] animate-pulse'
                : 'bg-[#F5F7FA] hover:bg-[#EEF2F6] text-[#718EBF] hover:text-[#2D60FF] border-[#E6EFF5]'
            }`}
            title="Simulate Voice Command Input"
          >
            <Mic className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder="Ask any question about batches, machines, suppliers, simulations, DPP..."
            className="flex-1 bg-[#F5F7FA] border border-[#E6EFF5] rounded-2xl px-4 py-2.5 text-xs text-[#343C6A] placeholder-[#8BA3CB] focus:outline-none focus:border-[#2D60FF] focus:bg-white transition-all font-medium"
          />

          <button
            onClick={() => handleSend()}
            disabled={!inputQuery.trim() || isTyping}
            className="px-5 py-2.5 rounded-2xl bg-[#2D60FF] hover:bg-blue-700 disabled:opacity-40 disabled:pointer-events-none text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-all"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
