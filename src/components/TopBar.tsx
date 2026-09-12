import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Info, 
  RotateCcw, 
  ShieldCheck, 
  ChevronDown,
  AlertTriangle,
  Server,
  Menu
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
  onToggleSidebar?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  agentStatus,
  searchQuery,
  setSearchQuery,
  onResetDemo,
  onOpenDemoInfo,
  onOpenAwsInfo,
  pendingApprovalsCount,
  onToggleSidebar
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
          label: 'APPROVAL REQ'
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
    <header className="h-16 bg-slate-900/90 backdrop-blur border-b border-slate-800/80 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left side: Hamburger (mobile/tablet) + Search */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 pr-2">
        {/* Mobile Sidebar Hamburger Toggle */}
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden transition-colors shrink-0"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand Name on Mobile */}
        <div className="flex items-center gap-1 sm:hidden shrink-0">
          <span className="font-bold text-slate-100 text-sm tracking-tight">OpsPilot</span>
        </div>

        {/* Responsive Search Input */}
        <div className="relative flex-1 min-w-0 max-w-[170px] xs:max-w-[220px] sm:max-w-xs md:max-w-sm lg:max-w-md">
          <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            id="global-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders, tasks..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-8 sm:pl-9 pr-7 sm:pr-8 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-200"
            >
              ESC
            </button>
          )}
        </div>
      </div>

      {/* Right Controls & Indicators */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Agent Status Indicator */}
        <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-slate-950/60 border border-slate-800">
          <span className="hidden md:inline text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status:</span>
          <div className={`flex items-center gap-1.5 px-1.5 sm:px-2 py-0.5 rounded-md border text-[11px] sm:text-xs font-mono font-bold ${statusConfig.bg}`}>
            <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`}></span>
            <span>{statusConfig.label}</span>
          </div>
        </div>

        {/* DEMO MODE Pill */}
        <button
          onClick={onOpenDemoInfo}
          id="demo-mode-pill-btn"
          className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium transition-colors"
          title="Click to view Demo Mode boundaries"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
          <span className="hidden sm:inline font-semibold tracking-wide">DEMO MODE</span>
          <span className="sm:hidden font-semibold text-[10px]">DEMO</span>
          <Info className="w-3.5 h-3.5 text-amber-400/70 hidden xs:inline" />
        </button>

        {/* AWS Backend Stack Info */}
        <button
          onClick={onOpenAwsInfo}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-medium transition-colors"
        >
          <Server className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden lg:inline">Strands / Bedrock</span>
          <span className="lg:hidden">AWS</span>
        </button>

        {/* Reset State Tool */}
        <button
          onClick={onResetDemo}
          title="Reset simulated state to defaults"
          className="p-1.5 sm:p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
          aria-label="Reset Demo State"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            id="notifications-toggle-btn"
            className="relative p-1.5 sm:p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {pendingApprovalsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                {pendingApprovalsCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 max-w-[calc(100vw-2rem)] bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
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
        <div className="flex items-center gap-2 pl-1.5 sm:pl-2 border-l border-slate-800">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 p-0.5 shrink-0">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-xs font-bold text-slate-200">
              AR
            </div>
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-medium text-slate-200 leading-tight">Alex Rivera</p>
            <p className="text-[10px] text-slate-400 leading-tight">Operations Lead</p>
          </div>
        </div>
      </div>
    </header>
  );
};
