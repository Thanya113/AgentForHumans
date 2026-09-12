import React from 'react';
import { X, Info, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

interface DemoNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoNoticeModal: React.FC<DemoNoticeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 sm:p-6 space-y-4 sm:space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
            <Info className="w-5 h-5 text-amber-400" />
            <span>DEMO MODE ACTIVE</span>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            You are exploring the <strong className="text-white">OpsPilot AI web application shell</strong>. This environment is designed for rapid development and demonstration prior to production AWS deployment.
          </p>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-slate-200 font-semibold">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Safety &amp; Simulation Boundaries</span>
            </div>
            <ul className="space-y-1.5 text-slate-400 text-[11px]">
              <li>• <strong className="text-slate-300">No real financial transactions:</strong> Refunds and credit adjustments are simulated.</li>
              <li>• <strong className="text-slate-300">No real external emails:</strong> Outbound communications are simulated locally.</li>
              <li>• <strong className="text-slate-300">Operations tagged with [DEMO ACTION]:</strong> Every simulated outcome is transparently labeled.</li>
              <li>• <strong className="text-slate-300">Production ready:</strong> The frontend API service layer is pre-wired to connect to your AWS API Gateway endpoint (<code className="text-indigo-300">VITE_API_GATEWAY_URL</code>).</li>
            </ul>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
