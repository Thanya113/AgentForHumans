import React from 'react';
import { X, Server, Cpu, Database, Shield, Terminal, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AwsStackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AwsStackModal: React.FC<AwsStackModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 sm:p-6 space-y-4 sm:space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Production Architecture Contract</h2>
              <p className="text-xs text-slate-400">AWS Cloud, Amazon Bedrock &amp; Python Strands Agents SDK</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* The Exact Architecture Path */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            End-To-End Infrastructure Path
          </span>
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-200">
            <span className="px-2 py-1 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30">React/TypeScript</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="px-2 py-1 rounded bg-slate-800 text-slate-300">AWS API Gateway</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="px-2 py-1 rounded bg-slate-800 text-slate-300">AWS Lambda</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="px-2 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-bold">Python Strands Agents SDK</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="px-2 py-1 rounded bg-indigo-900 text-indigo-200 font-bold">Amazon Bedrock</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="px-2 py-1 rounded bg-slate-800 text-slate-300">Custom Business Tools</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="px-2 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">DynamoDB / S3 / SES</span>
          </div>
        </div>

        {/* Key Architectural Mandates */}
        <div className="space-y-3 text-xs text-slate-300">
          <h3 className="font-bold text-slate-200 uppercase tracking-wider">Mandatory Security &amp; Execution Principles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="font-bold text-indigo-400 block">Untrusted Data Envelope</span>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                External customer emails, invoice texts, and uploaded attachments are treated as untrusted DATA and never executed as agent instructions.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="font-bold text-rose-400 block">Strict Human-In-The-Loop</span>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                High-risk actions (refunds &gt; $50, legal emails, database deletions) create immutable approval requests and cannot execute autonomously.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="font-bold text-emerald-400 block">Zero Browser Secrets</span>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                AWS credentials, IAM secrets, and Bedrock session keys live exclusively in AWS Secrets Manager and Lambda environment variables.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="font-bold text-cyan-400 block">Cryptographic Audit Trail</span>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Every tool execution, policy lookup, and human decision writes a sequenced SHA-256 event to DynamoDB.
              </p>
            </div>
          </div>
        </div>

        {/* 8 Strands Tools Built-in */}
        <div className="space-y-2 text-xs">
          <span className="font-bold text-slate-200 uppercase tracking-wider block">Registered Strands Tools</span>
          <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
            {['get_customer', 'get_order', 'search_business_policy', 'analyze_document', 'send_email', 'issue_refund', 'create_followup_task', 'record_audit_event'].map(t => (
              <span key={t} className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-indigo-300">
                {t}()
              </span>
            ))}
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
          >
            Close Architecture Summary
          </button>
        </div>
      </div>
    </div>
  );
};
