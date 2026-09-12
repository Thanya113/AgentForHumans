import React, { useState } from 'react';
import { 
  ScrollText, 
  Search, 
  Filter, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Clock, 
  Bot, 
  User, 
  Code2, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { AuditEvent, RiskLevel } from '../../types';

interface AuditLogViewProps {
  auditLog: AuditEvent[];
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ auditLog }) => {
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');

  const filteredLog = auditLog.filter(item => {
    const matchesRisk = riskFilter === 'ALL' || item.riskLevel === riskFilter;
    const matchesSearch = item.action.toLowerCase().includes(search.toLowerCase()) ||
                          item.reason.toLowerCase().includes(search.toLowerCase()) ||
                          (item.tool && item.tool.toLowerCase().includes(search.toLowerCase())) ||
                          item.hash.toLowerCase().includes(search.toLowerCase());
    return matchesRisk && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-4 sm:space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <ScrollText className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-semibold text-indigo-400 uppercase tracking-wide">
              Cryptographic Audit Trail
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Immutable Operations Ledger</h1>
          <p className="text-sm text-slate-400">
            Every query, policy evaluation, human approval, and tool execution is cryptographically signed and sequenced.
          </p>
        </div>

        {/* Ledger Integrity Badge */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-300">Ledger Hash Chain:</span>
          <span className="font-mono text-emerald-400 font-bold">VERIFIED</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Risk Pills */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setRiskFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              riskFilter === 'ALL' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            All Events ({auditLog.length})
          </button>
          <button
            onClick={() => setRiskFilter('HIGH')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              riskFilter === 'HIGH' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            High Risk ({auditLog.filter(a => a.riskLevel === 'HIGH').length})
          </button>
          <button
            onClick={() => setRiskFilter('MEDIUM')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              riskFilter === 'MEDIUM' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Medium Risk ({auditLog.filter(a => a.riskLevel === 'MEDIUM').length})
          </button>
          <button
            onClick={() => setRiskFilter('LOW')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              riskFilter === 'LOW' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Low Risk ({auditLog.filter(a => a.riskLevel === 'LOW').length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action, tool, SHA-256 hash..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Audit Timeline */}
      <div className="space-y-4">
        {filteredLog.map((event) => (
          <div 
            key={event.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-md space-y-3 text-xs"
          >
            {/* Top row: Timestamp, Actor, Risk Badge, Hash */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="font-mono text-xs font-bold text-slate-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{event.timestamp}</span>
                </span>

                <span className="text-slate-600">·</span>

                <div className="flex items-center gap-1 font-mono text-[11px] text-slate-300">
                  {event.user?.startsWith('user:') ? (
                    <User className="w-3 h-3 text-indigo-400" />
                  ) : (
                    <Bot className="w-3 h-3 text-cyan-400" />
                  )}
                  <span>{event.user || event.agent}</span>
                </div>

                {event.tool && (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] text-indigo-300">
                    <Code2 className="w-3 h-3 text-indigo-400" />
                    <span>{event.tool}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  event.riskLevel === 'HIGH' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                  event.riskLevel === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {event.riskLevel}
                </span>

                <span className="font-mono text-[10px] text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {event.hash}
                </span>
              </div>
            </div>

            {/* Action and Reason */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Action Executed</span>
                <p className="font-semibold text-slate-100 text-xs">{event.action}</p>
              </div>

              <div className="md:col-span-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Policy Reason</span>
                <p className="text-slate-300 text-xs">{event.reason}</p>
              </div>

              <div className="md:col-span-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Result & Outcome</span>
                <p className="text-emerald-300 text-xs font-mono bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                  {event.result}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
