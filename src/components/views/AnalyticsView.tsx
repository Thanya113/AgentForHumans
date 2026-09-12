import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Bot, 
  ShieldCheck, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  AlertTriangle,
  Info
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <BarChart3 className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-semibold text-indigo-400 uppercase tracking-wide">
              Operational Performance Telemetry
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Operations Analytics</h1>
          <p className="text-sm text-slate-400">
            Efficiency metrics, autonomous resolution times, cost reduction, and human-in-the-loop escalation distributions.
          </p>
        </div>
      </div>

      {/* Demo Data Notice */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2.5">
        <Info className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          <strong>Demo Metrics Notice:</strong> All data cards below are simulated operational benchmarks. In production, metrics are streamed live from Amazon CloudWatch, DynamoDB Streams, and Amazon Bedrock invocation metrics.
        </span>
      </div>

      {/* 4 Core KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-medium">Autonomous Resolution Rate</span>
          <div className="text-3xl font-bold font-mono text-emerald-400">82.4%</div>
          <p className="text-[11px] text-slate-400">Tasks resolved with zero human intervention</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-medium">Mean Time to Resolution (MTTR)</span>
          <div className="text-3xl font-bold font-mono text-cyan-400">2.4 min</div>
          <p className="text-[11px] text-emerald-400 font-medium">↓ 98% faster than 4.2 hr human baseline</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-medium">Estimated Monthly Savings</span>
          <div className="text-3xl font-bold font-mono text-indigo-300">$4,850</div>
          <p className="text-[11px] text-slate-400">Based on 140 operational hours reclaimed</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-medium">Policy Audit Compliance</span>
          <div className="text-3xl font-bold font-mono text-slate-100">100.0%</div>
          <p className="text-[11px] text-emerald-400 font-medium">Zero unauthorized financial overrides</p>
        </div>
      </div>

      {/* Workload Breakdown & Escalation Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Breakdown by Category */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">
            Automated Workload Distribution
          </h3>

          <div className="space-y-3 text-xs">
            {[
              { category: 'Customer Returns & Claims', share: '38%', color: 'bg-indigo-500' },
              { category: 'Vendor Invoice Reconciliation', share: '29%', color: 'bg-cyan-500' },
              { category: 'Inbound Email Support Triage', share: '21%', color: 'bg-emerald-500' },
              { category: 'Address Changes & Tracking Updates', share: '12%', color: 'bg-amber-500' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-300">{item.category}</span>
                  <span className="font-mono text-slate-200">{item.share}</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: item.share }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Human-in-the-Loop Triggers */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">
            Human-in-the-Loop Escalation Reasons
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-200 block">Financial Claim &gt; $50.00 Limit</span>
                <span className="text-[11px] text-slate-400">Strict safety boundary enforced</span>
              </div>
              <span className="font-mono text-rose-400 font-bold">68%</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-200 block">Legal or Formal Dispute Language</span>
                <span className="text-[11px] text-slate-400">Escalated to human supervisor</span>
              </div>
              <span className="font-mono text-amber-400 font-bold">19%</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-200 block">High Invoice PO Discrepancy (&gt; 5%)</span>
                <span className="text-[11px] text-slate-400">Passed to Accounting team</span>
              </div>
              <span className="font-mono text-indigo-400 font-bold">13%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
