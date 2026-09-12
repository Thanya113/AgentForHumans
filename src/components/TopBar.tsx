import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Info, 
  RotateCcw, 
  ShieldCheck, 
  ChevronDown,
  AlertTriangle,
  Server
} from 'lucide-react';
import { AgentStatus } from '../types';

interface TopBarProps {
  agentStatus: AgentStatus;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onResetDemo: () => void;
  onOpenDemoInfo: () => void;
  onOpenAwsInfo: () => void;
  pendingApprovalsCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  agentStatus,
  searchQuery,
  setSearchQuery,
  onResetDemo,
  onOpenDemoInfo,
  onOpenAwsInfo,
  pendingApprovalsCount
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const getStatusBadge = (status: AgentStatus) => {
    switch (status) {
      case 'ONLINE':
        return {
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          dot: 'bg-emerald-400 animate-pulse',
          label: 'ONLINE'
        };
      case 'THINKING':
        return {
          bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
          dot: 'bg-cyan-400 animate-spin',
          label: 'THINKING'
        };
      case 'EXECUTING':
        return {
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          dot: 'bg-amber-400 animate-ping',
          label: 'EXECUTING'
        };
      case 'WAITING FOR APPROVAL':
        return {
          bg: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
          dot: 'bg-rose-400 animate-bounce',
          label: 'WAITING FOR APPROVAL'
        };
      default:
        return {
          bg: 'bg-slate-800 text-slate-300 border-slate-700',
          dot: 'bg-slate-400',
          label: status
        };
    }
  };

  const statusConfig = getStatusBadge(agentStatus);

  return (
    <header className="h-16 bg-slate-900/90 backdrop-blur border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Search Input */}
      <div className="flex items-center gap-3 w-96">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            id="global-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders, customers, tasks, policies..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-9 pr-8 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-200"
            >
              ESC
            </button>
          )}
        </div>
      </div>

      {/* Right Controls & Indicators */}
      <div className="flex items-center gap-3">
        {/* Agent Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Agent Status:</span>
          <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-xs font-mono font-bold ${statusConfig.bg}`}>
            <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`}></span>
            <span>{statusConfig.label}</span>
          </div>
        </div>

        {/* DEMO MODE Pill */}
        <button
          onClick={onOpenDemoInfo}
          id="demo-mode-pill-btn"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium transition-colors"
          title="Click to view Demo Mode boundaries"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
          <span className="font-semibold tracking-wide">DEMO MODE</span>
          <Info className="w-3.5 h-3.5 ml-0.5 text-amber-400/70" />
        </button>

        {/* AWS Backend Stack Info */}
        <button
          onClick={onOpenAwsInfo}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-medium transition-colors"
        >
          <Server className="w-3.5 h-3.5 text-indigo-400" />
          <span>Strands / Bedrock</span>
        </button>

        {/* Reset State Tool */}
        <button
          onClick={onResetDemo}
          title="Reset simulated state to defaults"
          className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            id="notifications-toggle-btn"
            className="relative p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {pendingApprovalsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                {pendingApprovalsCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">Operations Alerts</span>
                <span className="text-[10px] font-mono text-slate-400">{pendingApprovalsCount} pending</span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {pendingApprovalsCount > 0 ? (
                  <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs">
                    <div className="flex items-center gap-1.5 text-rose-300 font-semibold mb-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>Action requires approval</span>
                    </div>
                    <p className="text-slate-300 text-[11px]">
                      Refund claim #ORD-8842 ($120.00) exceeds automatic limit ($50.00).
                    </p>
                  </div>
                ) : null}
                <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>Reconciliation complete</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    TechSupply PO-3391 matched with zero variance.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 p-0.5">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-xs font-bold text-slate-200">
              AR
            </div>
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-medium text-slate-200">Alex Rivera</p>
            <p className="text-[10px] text-slate-400">Operations Lead</p>
          </div>
        </div>
      </div>
    </header>
  );
};
