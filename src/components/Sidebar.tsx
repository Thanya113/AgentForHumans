import React from 'react';
import { 
  LayoutDashboard, 
  Bot, 
  Inbox, 
  ShieldAlert, 
  CheckSquare, 
  Users, 
  FileText, 
  BarChart3, 
  ScrollText, 
  Settings,
  Cpu,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  pendingApprovalsCount: number;
  onOpenAwsInfo?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  pendingApprovalsCount,
  onOpenAwsInfo
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'agent', label: 'Agent Workspace', icon: Bot, highlight: true },
    { id: 'inbox', label: 'Inbox', icon: Inbox, badge: '3' },
    { id: 'approvals', label: 'Approvals', icon: ShieldAlert, alertBadge: pendingApprovalsCount },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'audit', label: 'Audit Log', icon: ScrollText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800/80 flex flex-col shrink-0 h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-100 text-lg tracking-tight">OpsPilot</span>
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">AI</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Your AI operations teammate</p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Core Operations
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-colors ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'
                }`} />
                <span>{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {item.alertBadge && item.alertBadge > 0 ? (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-rose-500 text-white animate-pulse">
                    {item.alertBadge}
                  </span>
                ) : null}
                {item.badge && !item.alertBadge ? (
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-slate-800 text-slate-400">
                    {item.badge}
                  </span>
                ) : null}
                {item.highlight && !isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Production Architecture Pill */}
      <div className="p-3 m-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
        <div className="flex items-center gap-2 mb-1.5">
          <Cpu className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wide">Production Stack</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed mb-2.5">
          Powered by <strong className="text-slate-300">Strands Agents SDK</strong> & Amazon Bedrock.
        </p>
        <button
          onClick={onOpenAwsInfo}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md bg-slate-800/90 hover:bg-slate-800 text-[11px] font-medium text-slate-300 hover:text-white transition-colors border border-slate-700/50"
        >
          <span>Architecture Contract</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </button>
      </div>

      {/* User / Workspace Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/50 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-500/40 text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0">
            AR
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-200 truncate">Alex Rivera</p>
            <p className="text-[10px] text-slate-400 truncate">Operations Lead</p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50">
          AWS-Ready
        </span>
      </div>
    </aside>
  );
};
