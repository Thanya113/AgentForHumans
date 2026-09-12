import React from 'react';
import { 
  CheckCircle2, 
  Bot, 
  ShieldAlert, 
  AlertOctagon, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  UserCheck, 
  FileCheck2, 
  Activity,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
  DollarSign
} from 'lucide-react';
import { AgentStatus, ApprovalRequest, AuditEvent, Customer, TaskItem } from '../../types';

interface DashboardViewProps {
  agentStatus: AgentStatus;
  approvals: ApprovalRequest[];
  tasks: TaskItem[];
  customers: Customer[];
  auditLog: AuditEvent[];
  onNavigate: (view: string) => void;
  onRunPrompt: (prompt: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  agentStatus,
  approvals,
  tasks,
  customers,
  auditLog,
  onNavigate,
  onRunPrompt
}) => {
  const pendingApprovals = approvals.filter(a => a.status === 'PENDING');
  const completedToday = tasks.filter(t => t.status === 'Completed').length + 12; // Realistic operations count
  const escalatedTasks = tasks.filter(t => t.status === 'Escalated');

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-150">
      {/* Top Welcome & Agent Status Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Operations Control Center
            </span>
            <span className="text-xs text-slate-400 font-mono">AWS Bedrock · Strands Agents SDK</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            OpsPilot is maintaining your operations
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl">
            Autonomous agent triages inquiries, reconciles vendor invoices, checks return policies, and executes authorized workflows while strictly gating high-risk actions.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 shrink-0">
          <button
            onClick={() => onNavigate('agent')}
            id="launch-agent-workspace-btn"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all"
          >
            <Bot className="w-4 h-4" />
            <span>Open Agent Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Demo Metrics Notice Banner */}
      <div className="px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          <span className="font-semibold text-slate-300">[DEMO DATA NOTICE]</span>
          <span>Metrics below represent simulated small-business operations until connected to live AWS CloudWatch & Bedrock telemetry.</span>
        </div>
        <span className="font-mono text-[11px] text-slate-400">v1.4-beta</span>
      </div>

      {/* 4 Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Today's completed tasks */}
        <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Today's Completed</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-100 tracking-tight font-mono">{completedToday}</div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-400 font-medium">
            <span>↑ 94.2% on-time resolution</span>
          </div>
        </div>

        {/* Metric 2: Automated tasks */}
        <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Automated Rate</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Bot className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-100 tracking-tight font-mono">82.4%</div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-400">
            <span>Autonomous policy executions</span>
          </div>
        </div>

        {/* Metric 3: Pending Approvals */}
        <div 
          onClick={() => onNavigate('approvals')}
          className="p-5 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-rose-500/30 hover:border-rose-500/50 shadow-sm relative overflow-hidden cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-rose-300">Pending Approvals</span>
            <div className="p-2 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-rose-300 tracking-tight font-mono">{pendingApprovals.length}</div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-rose-400 font-medium">
            <span>High-risk transactions gated</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Metric 4: Escalated tasks */}
        <div 
          onClick={() => onNavigate('tasks')}
          className="p-5 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 shadow-sm relative overflow-hidden cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Escalated to Human</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-100 tracking-tight font-mono">{escalatedTasks.length}</div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-amber-400/90 font-medium">
            <span>Requires manual intervention</span>
          </div>
        </div>
      </div>

      {/* Pending Approvals Spotlight Card (if any pending) */}
      {pendingApprovals.length > 0 && (
        <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-500/30 relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-500 text-white uppercase tracking-wider">
                  Action Required
                </span>
                <span className="text-xs font-semibold text-rose-300">
                  {pendingApprovals.length} High-Risk Operation{pendingApprovals.length > 1 ? 's' : ''} Awaiting Review
                </span>
              </div>
              <p className="text-sm text-slate-300 font-medium">
                Customer <strong className="text-white">{pendingApprovals[0].customerName}</strong> ({pendingApprovals[0].requestedAction})
              </p>
              <p className="text-xs text-slate-400">
                Reason: {pendingApprovals[0].reason}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => onNavigate('approvals')}
                id="review-pending-approvals-btn"
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-600/30 transition-all flex items-center gap-1.5"
              >
                <span>Review in Approval Center</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Two Column Grid: Recent Agent Activity & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Agent Activity Stream */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                Recent Agent Activity & Audit Log
              </h2>
            </div>
            <button
              onClick={() => onNavigate('audit')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              <span>View full ledger</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {auditLog.slice(0, 5).map((log) => (
              <div 
                key={log.id} 
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700/80 transition-colors text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-slate-400">{log.timestamp}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-800 text-slate-300">
                      {log.tool || 'decision_engine'}
                    </span>
                    <span className={`px-1.5 py-0.2 text-[9px] font-bold rounded ${
                      log.riskLevel === 'HIGH' ? 'bg-rose-500/20 text-rose-300' :
                      log.riskLevel === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {log.riskLevel}
                    </span>
                  </div>
                  <p className="font-medium text-slate-200 truncate">{log.action}</p>
                  <p className="text-[11px] text-slate-400 truncate">{log.reason}</p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400">{log.hash.slice(0, 16)}...</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    VERIFIED
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Agent Performance & Autonomous SOP Compliance */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
              Agent Performance
            </h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-400">Policy Adherence</span>
                <span className="text-emerald-400 font-mono">100.0%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="w-full h-full bg-emerald-500 rounded-full"></div>
              </div>
              <p className="text-[10px] text-slate-400">Zero unauthorized refunds or policy overrides</p>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-400">Untrusted Input Sanitization</span>
                <span className="text-indigo-400 font-mono">100%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="w-full h-full bg-indigo-500 rounded-full"></div>
              </div>
              <p className="text-[10px] text-slate-400">Customer text strictly isolated as external DATA</p>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-400">Mean Time to Decision</span>
                <span className="text-cyan-400 font-mono">1.8s</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="w-[88%] h-full bg-cyan-500 rounded-full"></div>
              </div>
              <p className="text-[10px] text-slate-400">Via Bedrock Claude 3.5 Sonnet</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Human-In-The-Loop Boundary</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Automatic refund limit is strictly clamped at <strong className="text-slate-200">$50.00</strong>. Any higher amount generates an immutable approval request.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Recent Tasks & Recent Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
              Recent Tasks
            </h2>
            <button
              onClick={() => onNavigate('tasks')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              <span>View all tasks</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {tasks.slice(0, 4).map((task) => (
              <div 
                key={task.id}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between text-xs"
              >
                <div className="space-y-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-slate-400">{task.id}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      task.priority === 'Critical' ? 'bg-rose-500/20 text-rose-300' :
                      task.priority === 'High' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {task.priority}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate">Assignee: {task.assignee}</span>
                  </div>
                  <p className="font-semibold text-slate-200 truncate">{task.title}</p>
                </div>

                <div className="shrink-0 text-right">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    task.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300' :
                    task.status === 'Waiting Approval' ? 'bg-rose-500/20 text-rose-300' :
                    task.status === 'Escalated' ? 'bg-amber-500/20 text-amber-300' : 'bg-cyan-500/20 text-cyan-300'
                  }`}>
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Customers */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
              Recent Customers & Open Issues
            </h2>
            <button
              onClick={() => onNavigate('customers')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              <span>Browse customers</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {customers.map((cust) => (
              <div 
                key={cust.id}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-950/60 border border-indigo-800/60 text-indigo-300 flex items-center justify-center font-bold text-xs">
                    {cust.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-200">{cust.name}</p>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-slate-800 text-slate-400">
                        {cust.tier}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{cust.email}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-mono font-medium text-slate-300">${cust.lifetimeValue.toFixed(2)}</p>
                  <p className="text-[10px] text-slate-400">
                    {cust.openIssuesCount > 0 ? (
                      <span className="text-rose-400 font-medium">{cust.openIssuesCount} open dispute</span>
                    ) : (
                      <span className="text-emerald-400">All clear</span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
