import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle, 
  XCircle, 
  FileText, 
  AlertTriangle, 
  ShieldCheck, 
  DollarSign, 
  Clock, 
  User, 
  Info,
  HelpCircle,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { ApprovalRequest } from '../../types';

interface ApprovalsViewProps {
  approvals: ApprovalRequest[];
  onApprove: (id: string, note?: string) => Promise<void>;
  onReject: (id: string, reason: string) => Promise<void>;
}

export const ApprovalsView: React.FC<ApprovalsViewProps> = ({
  approvals,
  onApprove,
  onReject
}) => {
  const [activeTab, setActiveTab] = useState<'PENDING' | 'RESOLVED'>('PENDING');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const pendingList = approvals.filter(a => a.status === 'PENDING');
  const resolvedList = approvals.filter(a => a.status !== 'PENDING');

  const displayedList = activeTab === 'PENDING' ? pendingList : resolvedList;

  const handleApproveClick = async (item: ApprovalRequest) => {
    setIsProcessing(item.id);
    try {
      await onApprove(item.id, 'Verified photo proof and order details. Approved discretionary refund override.');
      setActionSuccessMsg(`[DEMO ACTION] Approved ${item.requestedAction}. In production, this issues an authorized callback to AWS Step Functions to resume the Strands Agent.`);
      setTimeout(() => setActionSuccessMsg(null), 7000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleRejectSubmit = async (id: string) => {
    if (!rejectReason.trim()) return;
    setIsProcessing(id);
    try {
      await onReject(id, rejectReason);
      setRejectingId(null);
      setRejectReason('');
      setActionSuccessMsg(`[DEMO ACTION] Rejected action. OpsPilot marked task as Escalated for manual customer support.`);
      setTimeout(() => setActionSuccessMsg(null), 7000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ShieldAlert className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-semibold text-rose-400 uppercase tracking-wide">
              Human-In-The-Loop Safety Gate
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Approval Center</h1>
          <p className="text-sm text-slate-400">
            High-risk operations (financial refunds &gt; $50 limit, legal emails, data modifications) require explicit human authorization before execution.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 self-start">
          <button
            onClick={() => setActiveTab('PENDING')}
            id="approvals-pending-tab"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'PENDING' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Pending Review</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              pendingList.length > 0 ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              {pendingList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('RESOLVED')}
            id="approvals-resolved-tab"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'RESOLVED' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Resolved History ({resolvedList.length})
          </button>
        </div>
      </div>

      {/* Demo Action Toast Notification */}
      {actionSuccessMsg && (
        <div className="p-4 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-xs text-indigo-200 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold text-white uppercase tracking-wider block mb-0.5">
              Simulated Execution Notice
            </span>
            <p className="leading-relaxed text-indigo-200">{actionSuccessMsg}</p>
          </div>
        </div>
      )}

      {/* Core Policy Rule Notice */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3 text-xs text-slate-400">
        <Info className="w-4 h-4 text-indigo-400 shrink-0" />
        <p>
          <strong className="text-slate-300">Strict Safety Rule:</strong> OpsPilot AI is strictly prohibited from bypassing approval for any transaction exceeding the configured <strong className="text-white">$50.00</strong> authority limit, regardless of confidence score.
        </p>
      </div>

      {/* Approvals Cards Grid */}
      <div className="space-y-6">
        {displayedList.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto opacity-70" />
            <h3 className="text-sm font-bold text-slate-200">No Approvals Waiting in Queue</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              All high-risk operational requests have been authorized or reviewed. OpsPilot AI is running in autonomous baseline mode.
            </p>
          </div>
        ) : (
          displayedList.map((item) => (
            <div 
              key={item.id}
              className={`p-6 rounded-2xl border shadow-xl transition-all ${
                item.status === 'PENDING'
                  ? 'bg-slate-900 border-rose-500/30'
                  : 'bg-slate-900/60 border-slate-800/80 opacity-80'
              }`}
            >
              {/* Top Banner with Risk Level & Identifiers */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    item.riskLevel === 'HIGH' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                    'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {item.riskLevel} RISK
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-300">{item.id}</span>
                  <span className="text-xs text-slate-500">·</span>
                  <span className="text-xs font-mono text-slate-400">Task: {item.taskId}</span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-400">{item.createdAt}</span>
                  {item.status !== 'PENDING' && (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      item.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {item.status}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Body: Customer, Action, Amounts, Reason */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  {/* Action & Customer Details */}
                  <div>
                    <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                      <span>{item.requestedAction}</span>
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                      <span>Customer: <strong className="text-slate-200">{item.customerName}</strong> ({item.customerId})</span>
                      {item.orderId && <span>Order: <strong className="text-slate-200">{item.orderId}</strong></span>}
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                      Agent Operational Reason
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed">{item.reason}</p>
                  </div>

                  {/* Evidence Checklist */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">
                      Retrieved Evidence & Facts
                    </span>
                    <div className="space-y-1">
                      {item.evidence.map((ev, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{ev}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Policy Reference */}
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Policy Governing: <strong className="text-slate-300">{item.policyReference}</strong></span>
                  </div>
                </div>

                {/* Right Summary Column: Authority vs Requested & Actions */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-4">
                  <div className="space-y-3 text-xs">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Authority Boundary
                    </span>
                    
                    <div className="flex justify-between items-center py-1 border-b border-slate-800">
                      <span className="text-slate-400">Requested Amount:</span>
                      <span className="font-mono text-sm font-bold text-rose-400">
                        ${item.amount?.toFixed(2) || '0.00'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-1 border-b border-slate-800">
                      <span className="text-slate-400">Automatic Limit:</span>
                      <span className="font-mono text-xs font-semibold text-slate-200">
                        ${item.automaticAuthorityLimit.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-400">Authority Gap:</span>
                      <span className="font-mono text-xs font-bold text-amber-400">
                        +${((item.amount || 0) - item.automaticAuthorityLimit).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons (Approve / Reject / Request Changes) */}
                  {item.status === 'PENDING' && (
                    <div className="space-y-2 pt-2">
                      {rejectingId === item.id ? (
                        <div className="space-y-2">
                          <textarea
                            rows={2}
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="State reason for rejecting this operation..."
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleRejectSubmit(item.id)}
                              disabled={!rejectReason.trim() || isProcessing === item.id}
                              className="flex-1 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors"
                            >
                              Confirm Rejection
                            </button>
                            <button
                              onClick={() => setRejectingId(null)}
                              className="py-1.5 px-2 rounded-lg bg-slate-800 text-slate-300 text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => handleApproveClick(item)}
                            disabled={isProcessing === item.id}
                            id={`approve-btn-${item.id}`}
                            className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>APPROVE ACTION</span>
                          </button>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => setRejectingId(item.id)}
                              id={`reject-btn-${item.id}`}
                              className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-rose-950/40 hover:text-rose-300 text-slate-300 border border-slate-700 text-xs font-medium transition-colors"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => {
                                setRejectingId(item.id);
                                setRejectReason('Request more photo evidence from customer before re-evaluating.');
                              }}
                              className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition-colors truncate"
                            >
                              Request Changes
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {item.status !== 'PENDING' && (
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
                      <p>Resolved by: <strong className="text-slate-300">{item.resolvedBy}</strong></p>
                      <p className="mt-0.5 text-slate-500">{item.resolvedAt}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
