import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { DashboardView } from './components/views/DashboardView';
import { AgentWorkspaceView } from './components/views/AgentWorkspaceView';
import { ApprovalsView } from './components/views/ApprovalsView';
import { TasksView } from './components/views/TasksView';
import { CustomersView } from './components/views/CustomersView';
import { DocumentsView } from './components/views/DocumentsView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { AuditLogView } from './components/views/AuditLogView';
import { SettingsView } from './components/views/SettingsView';
import { InboxView } from './components/views/InboxView';
import { AwsStackModal } from './components/modals/AwsStackModal';
import { DemoNoticeModal } from './components/modals/DemoNoticeModal';
import { api } from './services/api';
import { 
  AgentStatus, 
  ApprovalRequest, 
  AuditEvent, 
  Customer, 
  TaskItem, 
  UploadedDocument 
} from './types';

export default function App() {
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [agentStatus, setAgentStatus] = useState<AgentStatus>('ONLINE');
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [auditLog, setAuditLog] = useState<AuditEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAgentPrompt, setActiveAgentPrompt] = useState<string>('');
  
  const [isAwsModalOpen, setIsAwsModalOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  // Load initial data from api service
  const loadData = async () => {
    try {
      const [statusRes, apprs, tsks, custs, docs, audits] = await Promise.all([
        api.getAgentStatus(),
        api.getApprovals(),
        api.getTasks(),
        api.getCustomers(),
        api.getDocuments(),
        api.getAuditLog()
      ]);

      setAgentStatus(statusRes.status);
      setApprovals(apprs);
      setTasks(tsks);
      setCustomers(custs);
      setDocuments(docs);
      setAuditLog(audits);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update status based on pending approvals
  const pendingApprovalsCount = approvals.filter(a => a.status === 'PENDING').length;

  const handleApprove = async (id: string, note?: string) => {
    await api.approveApproval(id, note);
    await loadData();
  };

  const handleReject = async (id: string, reason: string) => {
    await api.rejectApproval(id, reason);
    await loadData();
  };

  const handleUploadDocument = async (file: { name: string; size: string; type: string }) => {
    const doc = await api.uploadDocument(file);
    await loadData();
    return doc;
  };

  const handleResetDemo = () => {
    api.resetDemoData();
    loadData();
  };

  const handleHandoffToAgent = (prompt: string) => {
    setActiveAgentPrompt(prompt);
    setActiveView('agent');
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white font-sans antialiased">
      {/* Persistent Left Sidebar */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        pendingApprovalsCount={pendingApprovalsCount}
        onOpenAwsInfo={() => setIsAwsModalOpen(true)}
      />

      {/* Main Workspace Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          agentStatus={agentStatus}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onResetDemo={handleResetDemo}
          onOpenDemoInfo={() => setIsDemoModalOpen(true)}
          onOpenAwsInfo={() => setIsAwsModalOpen(true)}
          pendingApprovalsCount={pendingApprovalsCount}
        />

        <main className="flex-1 overflow-y-auto pb-16">
          {activeView === 'dashboard' && (
            <DashboardView
              agentStatus={agentStatus}
              approvals={approvals}
              tasks={tasks}
              customers={customers}
              auditLog={auditLog}
              onNavigate={(view) => setActiveView(view)}
              onRunPrompt={(p) => handleHandoffToAgent(p)}
            />
          )}

          {activeView === 'agent' && (
            <AgentWorkspaceView
              onNavigate={(view) => setActiveView(view)}
              initialPrompt={activeAgentPrompt}
            />
          )}

          {activeView === 'inbox' && (
            <InboxView onHandoffToAgent={handleHandoffToAgent} />
          )}

          {activeView === 'approvals' && (
            <ApprovalsView
              approvals={approvals}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          )}

          {activeView === 'tasks' && (
            <TasksView tasks={tasks} />
          )}

          {activeView === 'customers' && (
            <CustomersView customers={customers} />
          )}

          {activeView === 'documents' && (
            <DocumentsView
              documents={documents}
              onUpload={handleUploadDocument}
              onNavigateToAgent={(doc) => handleHandoffToAgent(`Review document ${doc} and verify line items against policy`)}
            />
          )}

          {activeView === 'analytics' && (
            <AnalyticsView />
          )}

          {activeView === 'audit' && (
            <AuditLogView auditLog={auditLog} />
          )}

          {activeView === 'settings' && (
            <SettingsView />
          )}
        </main>
      </div>

      {/* Modal Dialogs */}
      <AwsStackModal
        isOpen={isAwsModalOpen}
        onClose={() => setIsAwsModalOpen(false)}
      />

      <DemoNoticeModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />
    </div>
  );
}
