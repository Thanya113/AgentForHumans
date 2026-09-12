import React from 'react';
import { 
  LayoutDashboard, 
  Bot, 
  ShieldAlert, 
  Inbox, 
  Menu 
} from 'lucide-react';

interface BottomNavProps {
  activeView: string;
  setActiveView: (view: string) => void;
  pendingApprovalsCount: number;
  onOpenSidebar: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeView,
  setActiveView,
  pendingApprovalsCount,
  onOpenSidebar
}) => {
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'agent', label: 'Agent', icon: Bot, highlight: true },
    { id: 'approvals', label: 'Approvals', icon: ShieldAlert, alertBadge: pendingApprovalsCount },
    { id: 'inbox', label: 'Inbox', icon: Inbox, badge: '3' },
  ];

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="fixed bottom-0 inset-x-0 z-30 bg-slate-900/95 backdrop-blur-md border-t border-slate-800/90 py-1 px-2 flex items-center justify-around lg:hidden shadow-lg shadow-black/50"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors relative min-w-[56px] ${
              isActive 
                ? 'text-indigo-400 font-bold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
              {item.alertBadge && item.alertBadge > 0 ? (
                <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse">
                  {item.alertBadge}
                </span>
              ) : null}
            </div>
            <span>{item.label}</span>
          </button>
        );
      })}

      {/* More / Full Menu Button */}
      <button
        onClick={onOpenSidebar}
        className="flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-medium text-slate-400 hover:text-slate-200 transition-colors min-w-[56px]"
      >
        <Menu className="w-5 h-5 mb-0.5 text-slate-400" />
        <span>Menu</span>
      </button>
    </nav>
  );
};
