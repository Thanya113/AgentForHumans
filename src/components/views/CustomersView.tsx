import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  Calendar, 
  DollarSign, 
  Package, 
  AlertCircle, 
  MessageSquare, 
  Bot, 
  CheckCircle2, 
  ShieldCheck, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Customer } from '../../types';

interface CustomersViewProps {
  customers: Customer[];
  onOpenAgentWithCustomer?: (customer: Customer) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  onOpenAgentWithCustomer
}) => {
  const [search, setSearch] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase())
  );

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId) || customers[0];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Users className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-semibold text-indigo-400 uppercase tracking-wide">
              Customer Operations Directory
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Customers & CRM</h1>
          <p className="text-sm text-slate-400">
            Search customer operational profiles, order histories, interaction transcripts, and autonomous agent resolutions.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            id="customer-search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, CUST ID..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Main Split: Customer List & Detailed Customer Page */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (4 cols): Customer List */}
        <div className="lg:col-span-4 space-y-2.5">
          {filteredCustomers.map((cust) => {
            const isSelected = selectedCustomer?.id === cust.id;
            return (
              <div
                key={cust.id}
                onClick={() => setSelectedCustomerId(cust.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-slate-850 border-indigo-500 shadow-md shadow-indigo-950' 
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-mono text-[10px] text-slate-400 font-semibold">{cust.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    cust.tier === 'VIP' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    cust.tier === 'Silver' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {cust.tier}
                  </span>
                </div>

                <div className="font-bold text-sm text-slate-200">{cust.name}</div>
                <div className="text-xs text-slate-400 truncate">{cust.email}</div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/80 text-[11px]">
                  <span className="text-slate-400">Lifetime: <strong className="text-slate-200 font-mono">${cust.lifetimeValue.toFixed(2)}</strong></span>
                  {cust.openIssuesCount > 0 ? (
                    <span className="text-rose-400 font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{cust.openIssuesCount} Dispute</span>
                    </span>
                  ) : (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Clean</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column (8 cols): Comprehensive Customer Detail Profile */}
        {selectedCustomer ? (
          <div className="lg:col-span-8 space-y-6">
            {/* Customer Banner */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 p-0.5 shadow-lg">
                    <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center font-bold text-lg text-slate-100">
                      {selectedCustomer.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-slate-100">{selectedCustomer.name}</h2>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {selectedCustomer.tier} Tier
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-slate-500" />
                        <span>{selectedCustomer.email}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        <span>{selectedCustomer.phone}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>Joined {selectedCustomer.joinedDate}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400">Total Spent</div>
                  <div className="text-xl font-bold font-mono text-emerald-400">
                    ${selectedCustomer.lifetimeValue.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Orders History */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
                  <Package className="w-4 h-4 text-indigo-400" />
                  <span>Order History ({selectedCustomer.orders.length})</span>
                </h3>
              </div>

              <div className="space-y-2.5">
                {selectedCustomer.orders.map((ord) => (
                  <div 
                    key={ord.orderId}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-200">{ord.orderId}</span>
                        <span className="text-slate-500">·</span>
                        <span className="text-slate-400">{ord.date}</span>
                        <span className={`px-2 py-0.2 rounded text-[9px] font-bold ${
                          ord.status === 'Disputed' ? 'bg-rose-500/20 text-rose-300' :
                          ord.status === 'Delivered' ? 'bg-emerald-500/20 text-emerald-300' :
                          'bg-slate-800 text-slate-300'
                        }`}>
                          {ord.status}
                        </span>
                      </div>
                      <p className="text-slate-300 text-[11px]">{ord.items.join(', ')}</p>
                    </div>

                    <div className="font-mono font-bold text-slate-200">
                      ${ord.total.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Previous Customer Interactions */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span>Interactions & Transcripts</span>
              </h3>

              <div className="space-y-3">
                {selectedCustomer.previousInteractions.map((int) => (
                  <div key={int.id} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-slate-400">{int.id}</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-slate-800 text-slate-300">
                          {int.channel}
                        </span>
                        <span className="text-slate-500 text-[10px]">{int.date}</span>
                      </div>
                      <span className={`text-[10px] font-bold ${
                        int.sentiment === 'Positive' ? 'text-emerald-400' :
                        int.sentiment === 'Negative' ? 'text-rose-400' : 'text-slate-400'
                      }`}>
                        {int.sentiment} Sentiment
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">{int.summary}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Agent Operational History */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
                <Bot className="w-4 h-4 text-emerald-400" />
                <span>OpsPilot Agent History & Actions</span>
              </h3>

              <div className="space-y-2.5">
                {selectedCustomer.agentHistory.map((hist, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-semibold text-slate-200">{hist.task}</span>
                        <span className="font-mono text-[10px] text-slate-500">{hist.timestamp}</span>
                      </div>
                      <p className="text-slate-400 text-[11px]">{hist.resolution}</p>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold shrink-0 ml-2 ${
                      hist.status === 'Approved by Human' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {hist.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
