import React, { useState } from 'react';
import { 
  Inbox as InboxIcon, 
  Mail, 
  Bot, 
  ArrowRight, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  ShieldAlert, 
  Paperclip,
  Sparkles
} from 'lucide-react';

interface InboxItem {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  preview: string;
  fullBody: string;
  receivedAt: string;
  priority: 'High' | 'Medium' | 'Low';
  orderRef?: string;
  hasAttachment?: boolean;
  status: 'Unprocessed' | 'Handed off to Agent' | 'Resolved';
}

const INBOX_ITEMS: InboxItem[] = [
  {
    id: 'MSG-301',
    senderName: 'Alex Mercer',
    senderEmail: 'alex.mercer@gmail.com',
    subject: 'Damaged shipment received for Order #ORD-8842',
    preview: 'I opened the package today and two of the dinner plates were completely shattered in the box...',
    fullBody: `Hello Support,\n\nI received my dinnerware set (Order #ORD-8842) this morning, but unfortunately upon opening the box, two of the large stoneware dinner plates are completely shattered. It looks like the carrier dropped the box during transit.\n\nI have attached photos of the cracked pieces and outer box. Can you please check if you can refund or replace this item?\n\nThanks,\nAlex Mercer`,
    receivedAt: 'Today, 09:12 AM',
    priority: 'High',
    orderRef: 'ORD-8842',
    hasAttachment: true,
    status: 'Unprocessed'
  },
  {
    id: 'MSG-302',
    senderName: 'TechSupply Distribution Corp',
    senderEmail: 'billing@techsupply.com',
    subject: 'Commercial Invoice INV-9912-US for Purchase Order PO-3391',
    preview: 'Please find attached invoice for 10x barcode scanners and direct thermal ribbons...',
    fullBody: `Dear Accounts Payable,\n\nPlease find attached commercial invoice #INV-9912-US for Purchase Order PO-3391 in the amount of $3,420.00 USD.\nPayment terms: Net-30 via ACH/Direct Deposit.\n\nThank you for your business,\nTechSupply Distribution AR Dept`,
    receivedAt: 'Today, 08:28 AM',
    priority: 'Medium',
    orderRef: 'PO-3391',
    hasAttachment: true,
    status: 'Unprocessed'
  },
  {
    id: 'MSG-303',
    senderName: 'Marcus Vance',
    senderEmail: 'marcus.v@protonmail.com',
    subject: 'Need to redirect shipment destination for Order #ORD-8910',
    preview: 'I had an emergency move this morning. Can I change the delivery address to my secondary warehouse?',
    fullBody: `Hi team,\n\nI just placed order ORD-8910 yesterday. I am currently relocating facilities and need to update the delivery address to 842 Industrial Blvd, Suite 4.\n\nCan your operations team re-route the shipment?\n\nBest,\nMarcus`,
    receivedAt: 'Today, 10:01 AM',
    priority: 'Medium',
    orderRef: 'ORD-8910',
    hasAttachment: false,
    status: 'Unprocessed'
  }
];

interface InboxViewProps {
  onHandoffToAgent: (prompt: string) => void;
}

export const InboxView: React.FC<InboxViewProps> = ({ onHandoffToAgent }) => {
  const [messages, setMessages] = useState<InboxItem[]>(INBOX_ITEMS);
  const [selectedMessage, setSelectedMessage] = useState<InboxItem>(INBOX_ITEMS[0]);

  const handleHandoff = (item: InboxItem) => {
    setMessages(prev => prev.map(m => m.id === item.id ? { ...m, status: 'Handed off to Agent' } : m));
    
    // Construct tailored operational prompt for the Agent
    let agentPrompt = '';
    if (item.id === 'MSG-301') {
      agentPrompt = 'Check this damaged-order complaint and determine whether we can refund the customer.';
    } else if (item.id === 'MSG-302') {
      agentPrompt = 'Review this invoice and create a follow-up task.';
    } else {
      agentPrompt = `Process customer request from ${item.senderName}: "${item.subject}". Verify security credentials and evaluate shipment redirection policy.`;
    }

    onHandoffToAgent(agentPrompt);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <InboxIcon className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-semibold text-indigo-400 uppercase tracking-wide">
              Inbound Operations Intake
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Operations Inbox</h1>
          <p className="text-sm text-slate-400">
            Incoming customer queries, vendor bills, and carrier notifications ingested via Amazon SES and API webhooks.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Amazon SES Inbound Parser Active</span>
        </div>
      </div>

      {/* Main Split: Message List & Reading Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Inbound Messages */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">
            Inbound Queue ({messages.length})
          </div>

          <div className="space-y-2.5">
            {messages.map((item) => {
              const isSelected = selectedMessage.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedMessage(item)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-slate-850 border-indigo-500 shadow-md shadow-indigo-950' 
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-bold text-xs text-slate-200">{item.senderName}</span>
                    <span className="font-mono text-[10px] text-slate-500">{item.receivedAt}</span>
                  </div>

                  <h3 className="text-xs font-semibold text-slate-100 truncate">{item.subject}</h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{item.preview}</p>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/80 text-[10px]">
                    <div className="flex items-center gap-2">
                      {item.orderRef && (
                        <span className="font-mono px-1.5 py-0.2 rounded bg-slate-800 text-indigo-300">
                          {item.orderRef}
                        </span>
                      )}
                      {item.hasAttachment && (
                        <span className="flex items-center gap-0.5 text-slate-400">
                          <Paperclip className="w-3 h-3" />
                          <span>Attachment</span>
                        </span>
                      )}
                    </div>

                    <span className={`px-2 py-0.2 rounded font-medium ${
                      item.status === 'Handed off to Agent' ? 'bg-cyan-500/20 text-cyan-300' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (7 cols): Selected Message & One-Click Agent Hand-off */}
        <div className="lg:col-span-7">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5 sticky top-24">
            {/* Subject and Sender */}
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center justify-between gap-2 text-xs text-slate-400 mb-2">
                <span className="font-mono text-indigo-400 font-semibold">{selectedMessage.id}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{selectedMessage.receivedAt}</span>
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-100">{selectedMessage.subject}</h2>
              <div className="flex items-center gap-2 mt-2 text-xs text-slate-300">
                <span className="font-semibold">{selectedMessage.senderName}</span>
                <span className="text-slate-500">&lt;{selectedMessage.senderEmail}&gt;</span>
              </div>
            </div>

            {/* Message Body */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
              {selectedMessage.fullBody}
            </div>

            {/* Security Isolation Notice */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p>
                <strong>Untrusted External Input:</strong> This message will be handed to the OpsPilot agent strictly inside an isolated data envelope to prevent prompt injection attacks.
              </p>
            </div>

            {/* Action Bar: Hand Off to OpsPilot Agent */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-[11px] text-slate-400">
                Status: <strong className="text-slate-200">{selectedMessage.status}</strong>
              </div>

              <button
                onClick={() => handleHandoff(selectedMessage)}
                id="handoff-to-agent-btn"
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all"
              >
                <Bot className="w-4 h-4" />
                <span>Hand Off to OpsPilot Agent</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
