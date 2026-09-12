import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  ChevronRight, 
  Terminal, 
  FileSearch, 
  Layers, 
  Lock, 
  Database, 
  ArrowRight,
  RefreshCw,
  ExternalLink,
  Code2
} from 'lucide-react';
import { AgentRun, AgentStep, PipelineStage } from '../../types';
import { api } from '../../services/api';

interface AgentWorkspaceViewProps {
  onNavigate: (view: string) => void;
  initialPrompt?: string;
}

const PRESET_PROMPTS = [
  {
    title: 'Damaged Order Claim & Refund',
    prompt: 'Check this damaged-order complaint and determine whether we can refund the customer.',
    tag: 'High Risk · Needs Approval'
  },
  {
    title: 'Invoice Reconciliation',
    prompt: 'Review this invoice and create a follow-up task.',
    tag: 'Automated · AP Policy'
  },
  {
    title: 'Customer Triage & Response',
    prompt: "Handle today's unresolved customer requests.",
    tag: 'Autonomous Triage'
  },
  {
    title: 'Summarize Issue & Draft Email',
    prompt: 'Summarize this customer issue and draft a response.',
    tag: 'Support Policy'
  }
];

const PIPELINE_STAGES: PipelineStage[] = [
  'UNDERSTAND',
  'PLAN',
  'RETRIEVE',
  'REASON',
  'DECIDE',
  'APPROVE',
  'EXECUTE',
  'VERIFY',
  'AUDIT'
];

export const AgentWorkspaceView: React.FC<AgentWorkspaceViewProps> = ({
  onNavigate,
  initialPrompt = ''
}) => {
  const [prompt, setPrompt] = useState(initialPrompt || PRESET_PROMPTS[0].prompt);
  const [isRunning, setIsRunning] = useState(false);
  const [currentRun, setCurrentRun] = useState<AgentRun | null>(null);
  const [selectedStep, setSelectedStep] = useState<AgentStep | null>(null);
  const [showRawJson, setShowRawJson] = useState(false);

  const handleRunAgent = async (promptToRun?: string) => {
    const textToExecute = promptToRun || prompt;
    if (!textToExecute.trim() || isRunning) return;

    setIsRunning(true);
    setSelectedStep(null);

    try {
      const result = await api.runAgent(textToExecute, (stepUpdate, runState) => {
        setCurrentRun({ ...runState });
        setSelectedStep(stepUpdate);
      });
      setCurrentRun(result);
    } catch (err) {
      console.error('Agent execution error:', err);
    } finally {
      setIsRunning(false);
    }
  };

  const getStageIndex = (stage: PipelineStage) => PIPELINE_STAGES.indexOf(stage);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-150">
      {/* Workspace Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Bot className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-semibold text-indigo-400 uppercase tracking-wide">
              Autonomous Operations Workspace
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">OpsPilot Agent Terminal</h1>
          <p className="text-sm text-slate-400">
            Executes autonomous workflows using the <strong className="text-slate-300">Strands Agents SDK</strong> on Amazon Bedrock. Untrusted data is strictly quarantined.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-300">Untrusted Data Boundary:</span>
            <span className="font-mono text-emerald-400 font-bold">Active</span>
          </div>
        </div>
      </div>

      {/* Preset Prompts Selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Sample Operational Tasks
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_PROMPTS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPrompt(preset.prompt);
                handleRunAgent(preset.prompt);
              }}
              disabled={isRunning}
              className={`p-3 rounded-xl border text-left transition-all ${
                prompt === preset.prompt
                  ? 'bg-indigo-950/40 border-indigo-500/50 shadow-md shadow-indigo-950'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              } ${isRunning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-xs font-bold text-slate-200">{preset.title}</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                  {preset.tag}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2">"{preset.prompt}"</p>
            </button>
          ))}
        </div>
      </div>

      {/* Input Prompt Box */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div className="relative">
          <textarea
            id="agent-prompt-input"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isRunning}
            placeholder="Enter operational request (e.g. Check this damaged-order complaint and determine whether we can refund the customer)..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none font-sans"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Customer emails, invoices & web inputs are treated strictly as untrusted DATA</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleRunAgent()}
              disabled={isRunning || !prompt.trim()}
              id="execute-agent-btn"
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold shadow-lg transition-all ${
                isRunning 
                  ? 'bg-indigo-700 text-white opacity-80 cursor-wait'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/25'
              }`}
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>OpsPilot Executing...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Execute Operations Task</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Pipeline Visualizer (UNDERSTAND -> PLAN -> RETRIEVE -> REASON -> DECIDE -> APPROVE -> EXECUTE -> VERIFY -> AUDIT) */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">
              Strands Autonomous Reasoning Pipeline
            </span>
          </div>
          {currentRun && (
            <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${
              currentRun.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
              currentRun.status === 'waiting_approval' ? 'bg-rose-500/15 text-rose-300 border-rose-500/40 animate-pulse' :
              'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
            }`}>
              {currentRun.status.toUpperCase()}
            </span>
          )}
        </div>

        {/* 9 Stages Horizontal Stepper */}
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-1.5 pt-2">
          {PIPELINE_STAGES.map((stage, idx) => {
            const hasRun = !!currentRun;
            const currentStep = currentRun?.steps[currentRun.currentStepIndex];
            const isCurrent = hasRun && currentStep?.stage === stage;
            const isPassed = hasRun && currentRun.steps.some(s => s.stage === stage && s.status === 'completed');
            const isWaiting = hasRun && currentRun.status === 'waiting_approval' && stage === 'APPROVE';

            return (
              <div 
                key={stage}
                className={`p-2 rounded-lg border text-center transition-all ${
                  isWaiting ? 'bg-rose-950/40 border-rose-500 text-rose-300 ring-2 ring-rose-500/30' :
                  isCurrent ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-md' :
                  isPassed ? 'bg-slate-950/80 border-slate-700 text-emerald-400' :
                  'bg-slate-950/40 border-slate-800/80 text-slate-400'
                }`}
              >
                <div className="text-[9px] font-mono opacity-60">0{idx + 1}</div>
                <div className="text-[10px] font-bold tracking-tighter truncate">{stage}</div>
                <div className="mt-1 flex justify-center">
                  {isWaiting ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
                  ) : isCurrent ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                  ) : isPassed ? (
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Run Execution Details (Plan, Steps, Evidence, Tools, Decision, Result) */}
      {currentRun && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          {/* Left 2 Cols: Step-by-Step Execution Log */}
          <div className="lg:col-span-2 space-y-6">
            {/* High-Risk Approval Alert Banner if paused at Approval */}
            {currentRun.status === 'waiting_approval' && (
              <div className="p-5 rounded-2xl bg-rose-950/30 border border-rose-500/40 shadow-lg space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
                    <ShieldAlert className="w-5 h-5 text-rose-400 animate-bounce" />
                    <span>Autonomous Execution Paused: High-Risk Action Detected</span>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-500 text-white font-bold">
                    HIGH RISK
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The agent verified the damage claim. However, the requested amount (<strong className="text-white">${currentRun.policyCheck.requestedAmount?.toFixed(2) || '120.00'}</strong>) exceeds the autonomous authority threshold (<strong className="text-white">${currentRun.policyCheck.automaticLimit?.toFixed(2) || '50.00'}</strong>).
                </p>
                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={() => onNavigate('approvals')}
                    id="goto-approvals-from-run-btn"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition-all"
                  >
                    <span>Go to Approval Center to Authorize</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] text-slate-400">Never executed without signed human approval</span>
                </div>
              </div>
            )}

            {/* Steps Timeline Card */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-indigo-400" />
                  <span>Execution Timeline & Tool Invocations</span>
                </h2>
                <span className="text-xs font-mono text-slate-400">
                  {currentRun.steps.filter(s => s.status === 'completed').length} of {currentRun.steps.length} steps
                </span>
              </div>

              <div className="space-y-3">
                {currentRun.steps.map((step, idx) => {
                  const isSelected = selectedStep?.id === step.id;
                  return (
                    <div
                      key={step.id}
                      onClick={() => setSelectedStep(step)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-slate-800/90 border-indigo-500/70 shadow-md' 
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            {step.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                            {step.status === 'running' && <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin" />}
                            {step.status === 'waiting_approval' && <ShieldAlert className="w-4 h-4 text-rose-400" />}
                            {step.status === 'pending' && <Clock className="w-4 h-4 text-slate-600" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-indigo-300 font-semibold">
                                {step.stage}
                              </span>
                              <span className="text-xs font-semibold text-slate-200">{step.title}</span>
                              {step.untrustedDataDetected && (
                                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                  UNTRUSTED DATA ISOLATED
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-1">{step.description}</p>
                          </div>
                        </div>

                        {step.toolUsed && (
                          <div className="shrink-0 flex items-center gap-1.5 px-2 py-1 rounded bg-indigo-950/60 border border-indigo-500/30 text-[10px] font-mono text-indigo-300">
                            <Code2 className="w-3 h-3 text-indigo-400" />
                            <span>{step.toolUsed}</span>
                          </div>
                        )}
                      </div>

                      {/* Tool Payload details if selected or expanded */}
                      {isSelected && step.toolInput && (
                        <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                          <div className="p-2 rounded bg-slate-950 border border-slate-800">
                            <span className="text-slate-400 block mb-1">Tool Input:</span>
                            <pre className="text-indigo-300 overflow-x-auto">{JSON.stringify(step.toolInput, null, 2)}</pre>
                          </div>
                          {step.toolOutput && (
                            <div className="p-2 rounded bg-slate-950 border border-slate-800">
                              <span className="text-slate-400 block mb-1">Tool Output (DynamoDB/Bedrock):</span>
                              <pre className="text-emerald-300 overflow-x-auto">{JSON.stringify(step.toolOutput, null, 2)}</pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right 1 Col: Agent Plan, Evidence & Policy Verification */}
          <div className="space-y-6">
            {/* Operational Plan */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
                <FileSearch className="w-4 h-4 text-cyan-400" />
                <span>Autonomous Plan</span>
              </h3>
              <ul className="space-y-2">
                {currentRun.plan.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-400 text-[10px] font-mono flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Evidence Gathered */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>Retrieved Evidence</span>
              </h3>
              <div className="space-y-2.5">
                {currentRun.evidence.map((ev, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{ev.source}</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">{ev.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Policy & Authority Check */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span>Policy Evaluation</span>
              </h3>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                <div className="text-slate-200 font-semibold">{currentRun.policyCheck.policyName}</div>
                <p className="text-[11px] text-slate-400">{currentRun.policyCheck.rule}</p>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Autonomous Limit:</span>
                  <span className="font-mono text-slate-200 font-bold">${currentRun.policyCheck.automaticLimit?.toFixed(2)}</span>
                </div>
                {currentRun.policyCheck.requestedAmount && (
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Requested Amount:</span>
                    <span className={`font-mono font-bold ${
                      currentRun.policyCheck.requestedAmount > (currentRun.policyCheck.automaticLimit || 0)
                        ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      ${currentRun.policyCheck.requestedAmount.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Final Result / Actions */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                Decision & Actions
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                {currentRun.decision}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
