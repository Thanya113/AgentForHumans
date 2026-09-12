export type AgentStatus = 'ONLINE' | 'THINKING' | 'EXECUTING' | 'WAITING FOR APPROVAL';

export type TaskStatus = 
  | 'Pending' 
  | 'In Progress' 
  | 'Waiting Approval' 
  | 'Completed' 
  | 'Failed' 
  | 'Escalated';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type PipelineStage = 
  | 'UNDERSTAND'
  | 'PLAN'
  | 'RETRIEVE'
  | 'REASON'
  | 'DECIDE'
  | 'APPROVE'
  | 'EXECUTE'
  | 'VERIFY'
  | 'AUDIT';

export interface AgentStep {
  id: string;
  stage: PipelineStage;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'waiting_approval';
  toolUsed?: string;
  toolInput?: Record<string, unknown>;
  toolOutput?: Record<string, unknown>;
  timestamp: string;
  untrustedDataDetected?: boolean;
}

export interface AgentRun {
  id: string;
  userPrompt: string;
  createdAt: string;
  completedAt?: string;
  status: 'running' | 'completed' | 'waiting_approval' | 'failed';
  plan: string[];
  currentStepIndex: number;
  steps: AgentStep[];
  evidence: Array<{
    source: string;
    detail: string;
    verified: boolean;
  }>;
  policyCheck: {
    policyName: string;
    rule: string;
    passed: boolean;
    requiresApproval: boolean;
    automaticLimit?: number;
    requestedAmount?: number;
  };
  decision: string;
  actions: string[];
  finalResult?: string;
  riskLevel: RiskLevel;
  approvalId?: string;
}

export interface ApprovalRequest {
  id: string;
  taskId: string;
  runId?: string;
  customerName: string;
  customerId: string;
  orderId?: string;
  requestedAction: string;
  amount?: number;
  automaticAuthorityLimit: number;
  riskLevel: RiskLevel;
  reason: string;
  evidence: string[];
  policyReference: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED';
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  feedback?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  category: 'Customer Support' | 'Refund' | 'Invoice' | 'Policy Review' | 'Follow-up';
  status: TaskStatus;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assignee: 'OpsPilot Agent' | 'Human Operations';
  createdAt: string;
  deadline: string;
  customerName?: string;
  customerId?: string;
  agentActions: Array<{
    timestamp: string;
    action: string;
  }>;
  humanActions: Array<{
    timestamp: string;
    action: string;
    operator: string;
  }>;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: 'Standard' | 'Silver' | 'VIP';
  joinedDate: string;
  lifetimeValue: number;
  openIssuesCount: number;
  orders: Array<{
    orderId: string;
    date: string;
    total: number;
    status: 'Delivered' | 'In Transit' | 'Refunded' | 'Disputed';
    items: string[];
  }>;
  openIssues: Array<{
    id: string;
    title: string;
    severity: 'Low' | 'Medium' | 'High';
    date: string;
  }>;
  previousInteractions: Array<{
    id: string;
    channel: 'Email' | 'Chat' | 'Phone' | 'Ticket';
    date: string;
    summary: string;
    sentiment: 'Positive' | 'Neutral' | 'Negative';
  }>;
  agentHistory: Array<{
    timestamp: string;
    task: string;
    resolution: string;
    status: 'Automated' | 'Approved by Human';
  }>;
}

export interface UploadedDocument {
  id: string;
  filename: string;
  fileSize: string;
  format: 'PDF' | 'PNG' | 'JPG' | 'CSV' | 'TXT';
  uploadedAt: string;
  uploadStatus: 'Uploaded' | 'Processing' | 'Failed';
  processingStatus: 'Completed (Demo)' | 'Pending AWS Textract' | 'Analyzed by Bedrock';
  extractedInformation?: {
    documentType?: string;
    vendor?: string;
    invoiceNumber?: string;
    date?: string;
    totalAmount?: string;
    lineItems?: Array<{ description: string; amount: string }>;
    rawSummary?: string;
  };
  agentAnalysis?: {
    flags: string[];
    actionRequired: boolean;
    recommendedTask?: string;
    confidenceScore: number;
  };
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  hash: string;
  agent: string;
  user?: string;
  action: string;
  tool?: string;
  reason: string;
  result: string;
  riskLevel: RiskLevel;
  simulatedDemo?: boolean;
}

export interface SecurityConfig {
  authProvider: string;
  userPoolId: string;
  sessionExpiry: string;
  connectedServices: {
    bedrock: boolean;
    lambda: boolean;
    dynamoDb: boolean;
    s3: boolean;
    ses: boolean;
    apiGateway: boolean;
  };
  approvalLimits: {
    maxAutomaticRefund: number;
    emailOutreachRequiresApproval: boolean;
    recordDeletionRequiresApproval: boolean;
    customerTierChangeRequiresApproval: boolean;
  };
  auditEncryption: string;
}
