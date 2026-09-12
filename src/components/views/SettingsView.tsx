import React, { useState } from 'react';
import { 
  Settings, 
  ShieldCheck, 
  Key, 
  Lock, 
  Server, 
  Sliders, 
  Cpu, 
  FileCode, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  Clock,
  EyeOff
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'SECURITY' | 'AGENT_LIMITS' | 'CONNECTED_SERVICES' | 'ARCHITECTURE'>('SECURITY');
  const [refundLimit, setRefundLimit] = useState(50);
  const [emailApprovalRequired, setEmailApprovalRequired] = useState(true);
  const [deletionApprovalRequired, setDeletionApprovalRequired] = useState(true);
  const [tierChangeApprovalRequired, setTierChangeApprovalRequired] = useState(true);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Settings className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-semibold text-indigo-400 uppercase tracking-wide">
              Security Governance & Infrastructure
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">System Settings & Security</h1>
          <p className="text-sm text-slate-400">
            Configure authentication, AWS service integrations, agent discretionary authority limits, and cryptographic audit parameters.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 self-start">
          <button
            onClick={() => setActiveTab('SECURITY')}
            id="settings-tab-security"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'SECURITY' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Security & Auth
          </button>
          <button
            onClick={() => setActiveTab('AGENT_LIMITS')}
            id="settings-tab-limits"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'AGENT_LIMITS' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Approval Limits
          </button>
          <button
            onClick={() => setActiveTab('CONNECTED_SERVICES')}
            id="settings-tab-services"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'CONNECTED_SERVICES' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Connected Services
          </button>
          <button
            onClick={() => setActiveTab('ARCHITECTURE')}
            id="settings-tab-arch"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'ARCHITECTURE' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Strands Architecture
          </button>
        </div>
      </div>

      {/* TAB 1: SECURITY & AUTH */}
      {activeTab === 'SECURITY' && (
        <div className="space-y-6">
          {/* Secret Values Security Notice */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3 text-xs text-slate-400">
            <EyeOff className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Zero-Trust Protocol:</strong> Secret values (AWS IAM Secret Keys, Bedrock tokens, API bearer keys) are never transmitted or rendered in the browser.
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Authentication & Session */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-400" />
                <span>Authentication & Session</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Identity Provider:</span>
                  <span className="font-semibold text-slate-200">AWS Cognito User Pool (SAML / OIDC)</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Cognito Pool ID:</span>
                  <span className="font-mono text-slate-300">us-east-1_8d9F21aB</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Active User:</span>
                  <span className="font-mono text-indigo-300">alex.rivera@opspilot.internal</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Session Status:</span>
                  <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>Valid (Token expires in 52 min)</span>
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Multi-Factor Auth (MFA):</span>
                  <span className="font-semibold text-emerald-400">Enforced (TOTP)</span>
                </div>
              </div>
            </div>

            {/* Authorization & RBAC */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Authorization & Permissions (RBAC)</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Assigned Role:</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-500/20 text-indigo-300">
                    Operations Lead (Supervisory Authority)
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Override Permission:</span>
                  <span className="text-emerald-400 font-semibold">Authorized to approve high-risk claims</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">API Scopes:</span>
                  <span className="font-mono text-slate-300 text-[11px]">opspilot:agent:run, opspilot:approvals:*</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Audit Ledger Encryption:</span>
                  <span className="font-mono text-slate-300">AWS KMS Customer Managed Key (CMK)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AGENT APPROVAL LIMITS & POLICY GUARDRAILS */}
      {activeTab === 'AGENT_LIMITS' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-100">Discretionary Authority & Safety Boundaries</h3>
            <p className="text-xs text-slate-400 mt-1">
              Actions exceeding these thresholds will automatically halt the agent and create an Approval Request in the queue.
            </p>
          </div>

          <div className="space-y-6 max-w-2xl">
            {/* Limit 1: Discretionary Refund Slider */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-200 block">Automatic Refund Authority Limit</span>
                  <span className="text-[11px] text-slate-400">
                    Claims at or below this amount execute automatically if verified by policy.
                  </span>
                </div>
                <span className="text-base font-mono font-bold text-indigo-400 px-3 py-1 rounded bg-indigo-950 border border-indigo-500/30">
                  ${refundLimit}.00
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={500}
                step={10}
                value={refundLimit}
                onChange={(e) => setRefundLimit(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>$0 (Require approval for all)</span>
                <span>$50 (Recommended)</span>
                <span>$500 (High Discretion)</span>
              </div>
            </div>

            {/* Toggle 2: External Emails */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
              <div>
                <span className="font-bold text-slate-200 block">Legal & Escalated Inbound Email Responses</span>
                <span className="text-slate-400 text-[11px]">
                  Require human review for emails involving dispute threats or legal keywords.
                </span>
              </div>
              <button
                onClick={() => setEmailApprovalRequired(!emailApprovalRequired)}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  emailApprovalRequired ? 'bg-indigo-600' : 'bg-slate-800'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  emailApprovalRequired ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Toggle 3: Record Deletion */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
              <div>
                <span className="font-bold text-slate-200 block">Customer Record or Order Data Modifications</span>
                <span className="text-slate-400 text-[11px]">
                  Always require human authorization before changing customer addresses or status.
                </span>
              </div>
              <button
                onClick={() => setDeletionApprovalRequired(!deletionApprovalRequired)}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  deletionApprovalRequired ? 'bg-indigo-600' : 'bg-slate-800'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  deletionApprovalRequired ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CONNECTED AWS SERVICES */}
      {activeTab === 'CONNECTED_SERVICES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Amazon Bedrock', service: 'LLM & Reasoning Engine', status: 'Active (Claude 3.5 Sonnet)', role: 'Core Agent Brain via Strands' },
            { name: 'AWS Lambda', service: 'Serverless Runtime', status: 'Active (Python 3.11)', role: 'Runs Strands Agent & Tools' },
            { name: 'Amazon DynamoDB', service: 'NoSQL Persistence', status: 'Active (4 Tables)', role: 'Tasks, Customers, Approvals, AuditLog' },
            { name: 'Amazon S3', service: 'Document Staging', status: 'Active (AES-256 Encrypted)', role: 'Invoice & Damage photo storage' },
            { name: 'Amazon SES', service: 'Email Delivery & Inbound', status: 'Active (Verified Domain)', role: 'Parses inbound support requests' },
            { name: 'AWS API Gateway', service: 'REST API & Webhooks', status: 'Active (v2 HTTP API)', role: 'Routes frontend requests to Lambda' },
          ].map((srv, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-100">{srv.name}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Configured
                </span>
              </div>
              <p className="text-[11px] text-indigo-400 font-mono">{srv.service}</p>
              <p className="text-[11px] text-slate-400">{srv.role}</p>
              <div className="text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800">
                {srv.status}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: STRANDS ARCHITECTURE & PYTHON CODE SPEC */}
      {activeTab === 'ARCHITECTURE' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-100">Strands Agents SDK & Bedrock Production Architecture</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Frontend contract connects to AWS API Gateway → AWS Lambda running Python Strands Agent.
              </p>
            </div>
            <span className="text-xs font-mono px-2 py-1 rounded bg-slate-800 text-slate-300">
              Python 3.11 · strands-agents 0.1.x
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs overflow-x-auto space-y-2">
            <div className="text-slate-500"># Production Agent Setup (backend/strands_agent.py)</div>
            <div className="text-indigo-400">from strands_agents import Agent, Tool, BedrockModel</div>
            <div className="text-slate-300">
              model = BedrockModel(model_id="anthropic.claude-3-5-sonnet-20241022-v2:0")
            </div>
            <div className="text-slate-300">
              agent = Agent(
                name="OpsPilot",
                model=model,
                tools=[get_customer, get_order, search_business_policy, analyze_document, send_email, issue_refund, create_followup_task, record_audit_event],
                system_prompt="You are OpsPilot AI, an autonomous operations agent for small businesses..."
              )
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
