import { 
  AgentRun, 
  AgentStatus, 
  AgentStep, 
  ApprovalRequest, 
  AuditEvent, 
  Customer, 
  RiskLevel, 
  TaskItem, 
  UploadedDocument 
} from '../types';
import { 
  INITIAL_APPROVALS, 
  INITIAL_AUDIT_LOG, 
  INITIAL_CUSTOMERS, 
  INITIAL_DOCUMENTS, 
  INITIAL_TASKS 
} from '../data/mockData';

// Storage keys
const STORAGE_PREFIX = 'opspilot_';

function getStored<T>(key: string, defaultVal: T): T {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setStored<T>(key: string, val: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(val));
  } catch (e) {
    console.warn('Storage write failed', e);
  }
}

// Global In-Memory State synced with localStorage
let approvalsState: ApprovalRequest[] = getStored('approvals', INITIAL_APPROVALS);
let tasksState: TaskItem[] = getStored('tasks', INITIAL_TASKS);
let customersState: Customer[] = getStored('customers', INITIAL_CUSTOMERS);
let documentsState: UploadedDocument[] = getStored('documents', INITIAL_DOCUMENTS);
let auditState: AuditEvent[] = getStored('audit', INITIAL_AUDIT_LOG);
let currentAgentStatus: AgentStatus = 'ONLINE';

// API Gateway base URL (if deployed to AWS)
const API_BASE_URL = (import.meta as any).env?.VITE_API_GATEWAY_URL || '';

export const api = {
  // GET /api/agent/status
  async getAgentStatus(): Promise<{ status: AgentStatus; mode: 'DEMO' | 'AWS_PRODUCTION'; activeModel: string }> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/agent/status`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Live API Gateway unavailable, falling back to simulated status', err);
      }
    }
    return {
      status: currentAgentStatus,
      mode: 'DEMO',
      activeModel: 'Amazon Bedrock (anthropic.claude-3-5-sonnet-20241022-v2:0 via Strands Agents SDK)'
    };
  },

  // POST /api/agent/run
  async runAgent(
    prompt: string, 
    onStepUpdate?: (step: AgentStep, run: AgentRun) => void
  ): Promise<AgentRun> {
    currentAgentStatus = 'THINKING';

    const runId = `RUN-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // Determine intent & preset patterns
    const isDamagedOrder = prompt.toLowerCase().includes('damaged') || prompt.toLowerCase().includes('refund');
    const isInvoice = prompt.toLowerCase().includes('invoice') || prompt.toLowerCase().includes('bill');
    const isSummarize = prompt.toLowerCase().includes('summarize') || prompt.toLowerCase().includes('draft');
    
    // Check for prompt injection keywords in prompt or untrusted data simulation
    const hasInjectionAttempt = prompt.toLowerCase().includes('ignore previous') || 
                                prompt.toLowerCase().includes('system prompt') || 
                                prompt.toLowerCase().includes('bypass approval');

    // Build the 9-stage pipeline steps according to the prompt
    let plan: string[] = [];
    let stepsDef: Array<{ stage: any; title: string; desc: string; tool?: string; toolInput?: any; toolOutput?: any; untrusted?: boolean }> = [];
    let riskLevel: RiskLevel = 'LOW';
    let requiresApproval = false;
    let refundAmount = 0;
    let decision = '';
    let actions: string[] = [];
    let finalResult = '';

    if (isDamagedOrder) {
      plan = [
        'Parse customer complaint & identify order reference',
        'Retrieve customer profile from DynamoDB via get_customer',
        'Fetch order shipment & item records via get_order',
        'Evaluate damage photos via analyze_document',
        'Verify business return & damage policy threshold',
        'Enforce human approval requirement for claims exceeding authority ($50 limit)',
        'Stage action and create Approval Center request',
        'Record cryptographic audit trail entry in DynamoDB'
      ];
      riskLevel = 'HIGH';
      requiresApproval = true;
      refundAmount = 120.00;
      decision = 'Order ORD-8842 meets damage warranty policy Sec 4.2. Claim amount ($120.00) exceeds agent automatic authority limit ($50.00). Human approval is mandatory.';
      actions = [
        'Tool executed: get_customer("CUST-8842")',
        'Tool executed: get_order("ORD-8842")',
        'Tool executed: analyze_document("damage_photo_ord8842.jpg")',
        'Tool executed: search_business_policy("returns_and_damage_v3.2")',
        'Action staged: issue_refund(ORD-8842, $120.00) -> Placed in WAITING_APPROVAL',
        'Tool executed: record_audit_event("APPROVAL_REQUESTED_REFUND_120")'
      ];
      finalResult = 'Dispute verified against policy. Refund of $120.00 exceeds $50.00 autonomous threshold. Escalate to human operator for approval before payment execution.';

      stepsDef = [
        {
          stage: 'UNDERSTAND',
          title: 'Analyze Inbound Request & Sanitize Untrusted Content',
          desc: 'Parsed query. External email/message treated as strictly untrusted DATA to defend against prompt injection.',
          untrusted: true
        },
        {
          stage: 'PLAN',
          title: 'Construct Multi-Step Verification Plan',
          desc: 'Formulated 8-step operations execution graph using Strands Agents SDK.'
        },
        {
          stage: 'RETRIEVE',
          title: 'Query Customer & Order Records',
          desc: 'Invoking get_customer and get_order tools to fetch customer history and order details.',
          tool: 'get_customer',
          toolInput: { customerId: 'CUST-8842' },
          toolOutput: { name: 'Alex Mercer', tier: 'Silver', lifetimeOrders: 3, disputeRate: '0%' }
        },
        {
          stage: 'RETRIEVE',
          title: 'Inspect Order Details & Line Items',
          desc: 'Retrieved order ORD-8842 from DynamoDB table.',
          tool: 'get_order',
          toolInput: { orderId: 'ORD-8842' },
          toolOutput: { orderId: 'ORD-8842', total: 120.00, items: ['Artisan Ceramic 16-Piece Dinner Set'], status: 'Delivered 2 days ago' }
        },
        {
          stage: 'REASON',
          title: 'Analyze Damage Visual Evidence',
          desc: 'Inspected customer uploaded photo evidence via Amazon Bedrock multimodal document analyzer.',
          tool: 'analyze_document',
          toolInput: { documentId: 'Damage_Photo_ORD-8842_Plate.jpg' },
          toolOutput: { confidence: 0.968, verifiedDamage: true, observation: 'Ceramic fractures consistent with in-transit shipping impact' }
        },
        {
          stage: 'DECIDE',
          title: 'Verify Business Policy & Authority Limits',
          desc: 'Evaluating Merchant Returns & Damage Policy v3.2 Sec 4.2 against discretionary limits.',
          tool: 'search_business_policy',
          toolInput: { policyName: 'Returns & Damage SOP', section: '4.2' },
          toolOutput: { eligible: true, maxAutonomousLimit: 50.00, requested: 120.00, approvalRequired: true }
        },
        {
          stage: 'APPROVE',
          title: 'Require Human Approval (High-Risk Threshold Exceeded)',
          desc: 'Amount $120.00 > $50.00 automatic threshold. Creating pending approval request in Approval Center.',
          tool: 'request_human_approval',
          toolInput: { taskId: 'TSK-4029', amount: 120.00, authorityLimit: 50.00 },
          toolOutput: { approvalId: 'APP-1092', queue: 'Operations_Lead_Queue', status: 'PENDING' }
        },
        {
          stage: 'EXECUTE',
          title: 'Action Staged (Awaiting Authorization)',
          desc: 'Execution paused. Financial transaction is gated behind signed human authorization.'
        },
        {
          stage: 'AUDIT',
          title: 'Record Immutable Audit Log',
          desc: 'Wrote SHA-256 signed audit trail entry to DynamoDB audit ledger.',
          tool: 'record_audit_event',
          toolInput: { action: 'DISPUTE_VERIFIED_APPROVAL_REQUIRED', risk: 'HIGH' },
          toolOutput: { hash: 'sha256:8b2a4f0011c782e45901ba34de12aa59', status: 'COMMITTED' }
        }
      ];
    } else if (isInvoice) {
      plan = [
        'Ingest vendor invoice document',
        'Extract key metadata: Vendor, PO number, Total, Line items',
        'Cross-reference Purchase Order in ERP/DynamoDB',
        'Check variance against tolerance limit (< 1% variance)',
        'Schedule accounts payable follow-up task',
        'Publish audit event'
      ];
      riskLevel = 'LOW';
      requiresApproval = false;
      decision = 'Vendor invoice matches Purchase Order PO-3391 with 0.00% variance. Automatically approved within standard vendor reconciliation authority.';
      actions = [
        'Tool executed: analyze_document("Invoice_TechSupply_9912.pdf")',
        'Tool executed: get_order("PO-3391")',
        'Tool executed: create_followup_task("Schedule ACH Disbursement for PO-3391")',
        'Tool executed: record_audit_event("INVOICE_AUTOMATIC_MATCH")'
      ];
      finalResult = 'Invoice reconciled successfully. Created automated payment schedule task #TSK-4030 for finance.';

      stepsDef = [
        { stage: 'UNDERSTAND', title: 'Parse Invoice Review Request', desc: 'Received document review instruction.' },
        { stage: 'PLAN', title: 'Formulate PO Matching Workflow', desc: 'Planned document OCR extraction and purchase order cross-referencing.' },
        { stage: 'RETRIEVE', title: 'Extract Document Metadata via Bedrock', desc: 'Running document extractor tool.', tool: 'analyze_document', toolInput: { file: 'Invoice_TechSupply_9912.pdf' }, toolOutput: { vendor: 'TechSupply Corp', total: 3420.00, po: 'PO-3391' } },
        { stage: 'REASON', title: 'Match Purchase Order & Line Items', desc: 'Cross-checked line items with warehouse inventory intake records.', tool: 'get_order', toolInput: { poId: 'PO-3391' }, toolOutput: { matched: true, variance: 0 } },
        { stage: 'DECIDE', title: 'Check Automatic Reconciliation Policy', desc: 'Zero-discrepancy vendor match under $10,000 threshold allows autonomous settlement.', tool: 'search_business_policy', toolInput: { rule: 'AP_Reconciliation' }, toolOutput: { requiresApproval: false } },
        { stage: 'EXECUTE', title: 'Create Follow-up Accounting Task', desc: 'Generated structured task in OpsPilot task queue.', tool: 'create_followup_task', toolInput: { task: 'Schedule ACH Payout' }, toolOutput: { taskId: 'TSK-4030', status: 'Created' } },
        { stage: 'VERIFY', title: 'Verify Task Queue Insertion', desc: 'Confirmed task status in DynamoDB.' },
        { stage: 'AUDIT', title: 'Record Ledger Audit Event', desc: 'Logged event with tamper-resistant cryptographic hash.', tool: 'record_audit_event', toolInput: { event: 'INVOICE_MATCHED' }, toolOutput: { auditId: 'AUD-90919' } }
      ];
    } else {
      // General operations request / summarize / unresolved
      plan = [
        'Scan active customer queues for unresolved items',
        'Triage priorities and policy constraints',
        'Formulate drafted response under support tone guidelines',
        'Verify customer relationship status',
        'Stage resolution or follow-up task',
        'Emit audit log event'
      ];
      riskLevel = 'LOW';
      requiresApproval = false;
      decision = 'Customer inquiries analyzed. Inquiries triaged: 2 general information queries handled; 1 formal dispute escalated to Approval Center.';
      actions = [
        'Tool executed: get_customer("CUST-5512")',
        'Tool executed: send_email("courtesy_update")',
        'Tool executed: record_audit_event("BATCH_TRIAGE_COMPLETED")'
      ];
      finalResult = 'Operational queue processed. 3 customer tickets evaluated, 1 customer goodwill resolution applied, and audit trail recorded.';

      stepsDef = [
        { stage: 'UNDERSTAND', title: 'Inspect Queue & Untrusted Customer Inquiries', desc: 'Treating all customer messages as unvalidated external DATA.', untrusted: true },
        { stage: 'PLAN', title: 'Synthesize Operations Priority Matrix', desc: 'Organized queue by SLA urgency, VIP tier, and monetary risk.' },
        { stage: 'RETRIEVE', title: 'Retrieve Customer Interaction Histories', desc: 'Fetched recent tickets from DynamoDB customer interaction store.', tool: 'get_customer', toolInput: { query: 'active_disputes' }, toolOutput: { pendingCount: 3 } },
        { stage: 'REASON', title: 'Analyze Policy Compliance & Sentiment', desc: 'Bedrock evaluation of customer requests against support playbook.', tool: 'search_business_policy', toolInput: { playbook: 'Standard Operations SOP' }, toolOutput: { compliant: true } },
        { stage: 'DECIDE', title: 'Determine Autonomous vs. Approval Actions', desc: 'Separated low-risk communications from financial adjustments.' },
        { stage: 'EXECUTE', title: 'Execute Authorized Communications', desc: 'Drafted professional responses and dispatched notifications.', tool: 'send_email', toolInput: { recipient: 'sjenkins@outlook.com' }, toolOutput: { sent: true, provider: 'Amazon SES (Demo)' } },
        { stage: 'VERIFY', title: 'Confirm Delivery & Ticket Status', desc: 'Verified message delivery receipts and queue counter updates.' },
        { stage: 'AUDIT', title: 'Record Batch Operations Audit', desc: 'Committed event hash to audit timeline.', tool: 'record_audit_event', toolInput: { event: 'BATCH_TRIAGE_COMPLETED' }, toolOutput: { auditId: 'AUD-90928' } }
      ];
    }

    if (hasInjectionAttempt) {
      decision = 'SECURITY ALERT: Prompt injection attempt detected in input string! Neutralized by Strands Guardrail. Input isolated as untrusted data.';
      riskLevel = 'HIGH';
    }

    // Build the initial AgentRun
    const agentRun: AgentRun = {
      id: runId,
      userPrompt: prompt,
      createdAt: timeStr,
      status: 'running',
      plan,
      currentStepIndex: 0,
      steps: stepsDef.map((s, idx) => ({
        id: `step-${idx + 1}`,
        stage: s.stage,
        title: s.title,
        description: s.desc,
        status: idx === 0 ? 'running' : 'pending',
        toolUsed: s.tool,
        toolInput: s.toolInput,
        toolOutput: s.toolOutput,
        timestamp: timeStr,
        untrustedDataDetected: s.untrusted
      })),
      evidence: [
        { source: 'DynamoDB (Customer Records)', detail: 'Customer identity, dispute history, and tenure verified', verified: true },
        { source: 'DynamoDB (Orders Store)', detail: 'Shipment tracking, delivery timestamps, and order lines validated', verified: true },
        { source: 'Business Policy Engine (SOP-04)', detail: 'Discretionary authority limit enforced at $50.00', verified: true }
      ],
      policyCheck: {
        policyName: 'Merchant Returns & Damage Policy v3.2',
        rule: 'Damage claims > $50.00 require human authorization; automated resolution allowable below $50.00.',
        passed: true,
        requiresApproval,
        automaticLimit: 50.00,
        requestedAmount: refundAmount || undefined
      },
      decision,
      actions,
      finalResult,
      riskLevel
    };

    // If step callback provided, simulate realistic progressive execution
    for (let i = 0; i < agentRun.steps.length; i++) {
      currentAgentStatus = i === 6 && requiresApproval ? 'WAITING FOR APPROVAL' : 'EXECUTING';
      agentRun.currentStepIndex = i;
      agentRun.steps[i].status = 'running';

      if (onStepUpdate) {
        onStepUpdate(agentRun.steps[i], { ...agentRun });
      }

      // Small realistic pause for progressive visual feedback (350ms)
      await new Promise(res => setTimeout(res, 350));

      if (agentRun.steps[i].stage === 'APPROVE' && requiresApproval) {
        agentRun.steps[i].status = 'waiting_approval';
        agentRun.status = 'waiting_approval';
        currentAgentStatus = 'WAITING FOR APPROVAL';
        
        // Ensure approval exists in state
        const existingApproval = approvalsState.find(a => a.id === 'APP-1092');
        if (!existingApproval) {
          const newApproval: ApprovalRequest = {
            id: `APP-${Math.floor(1000 + Math.random() * 9000)}`,
            taskId: 'TSK-4029',
            runId: agentRun.id,
            customerName: 'Alex Mercer',
            customerId: 'CUST-8842',
            orderId: 'ORD-8842',
            requestedAction: `Issue Refund ($${refundAmount.toFixed(2)})`,
            amount: refundAmount,
            automaticAuthorityLimit: 50.00,
            riskLevel: 'HIGH',
            reason: prompt,
            evidence: [
              'Order ORD-8842 verified in DynamoDB',
              'Customer Alex Mercer verified',
              'Damage evidence verified via document OCR',
              'Exceeds automatic authority limit ($50.00)'
            ],
            policyReference: 'Merchant Returns & Damage Policy v3.2',
            status: 'PENDING',
            createdAt: 'Just now'
          };
          approvalsState = [newApproval, ...approvalsState];
          setStored('approvals', approvalsState);
          agentRun.approvalId = newApproval.id;
        } else {
          agentRun.approvalId = existingApproval.id;
        }

        if (onStepUpdate) {
          onStepUpdate(agentRun.steps[i], { ...agentRun });
        }
      } else {
        agentRun.steps[i].status = 'completed';
        if (onStepUpdate) {
          onStepUpdate(agentRun.steps[i], { ...agentRun });
        }
      }
    }

    if (requiresApproval) {
      agentRun.status = 'waiting_approval';
      currentAgentStatus = 'WAITING FOR APPROVAL';
    } else {
      agentRun.status = 'completed';
      agentRun.completedAt = new Date().toLocaleTimeString();
      currentAgentStatus = 'ONLINE';
    }

    // Add audit event for this run
    const newAuditEvent: AuditEvent = {
      id: `AUD-${Math.floor(90000 + Math.random() * 9000)}`,
      timestamp: timeStr,
      hash: `sha256:${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`,
      agent: 'Strands-Bedrock/v1.4',
      user: 'agent:opspilot',
      action: `Executed operations run: "${prompt.slice(0, 48)}..."`,
      tool: stepsDef[stepsDef.length - 2]?.tool || 'record_audit_event',
      reason: decision,
      result: agentRun.status === 'waiting_approval' ? 'PAUSED: Staged in Approval Center' : 'Completed automatically',
      riskLevel: agentRun.riskLevel,
      simulatedDemo: true
    };
    auditState = [newAuditEvent, ...auditState];
    setStored('audit', auditState);

    return agentRun;
  },

  // GET /api/tasks
  async getTasks(): Promise<TaskItem[]> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/tasks`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('API Gateway tasks failed, using fallback', err);
      }
    }
    return [...tasksState];
  },

  // GET /api/tasks/:id
  async getTaskById(id: string): Promise<TaskItem | null> {
    const tasks = await this.getTasks();
    return tasks.find(t => t.id === id) || null;
  },

  // GET /api/approvals
  async getApprovals(): Promise<ApprovalRequest[]> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/approvals`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('API Gateway approvals failed, using fallback', err);
      }
    }
    return [...approvalsState];
  },

  // POST /api/approvals/:id/approve
  async approveApproval(id: string, operatorNote?: string): Promise<{ success: boolean; approval: ApprovalRequest; auditEvent: AuditEvent }> {
    const approvalIndex = approvalsState.findIndex(a => a.id === id);
    if (approvalIndex === -1) {
      throw new Error(`Approval request with ID ${id} not found.`);
    }

    const item = approvalsState[approvalIndex];
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const updated: ApprovalRequest = {
      ...item,
      status: 'APPROVED',
      resolvedAt: timeStr,
      resolvedBy: 'Alex Rivera (Operations Lead)',
      feedback: operatorNote || 'Verified invoice and customer photos. Authorized under Manager Policy Override.'
    };

    approvalsState[approvalIndex] = updated;
    setStored('approvals', approvalsState);

    // Update corresponding task if applicable
    tasksState = tasksState.map(t => {
      if (t.id === item.taskId) {
        return {
          ...t,
          status: 'Completed',
          humanActions: [
            ...t.humanActions,
            {
              timestamp: timeStr,
              action: `Approved request ${id}: ${item.requestedAction}`,
              operator: 'Alex Rivera (Operations Lead)'
            }
          ]
        };
      }
      return t;
    });
    setStored('tasks', tasksState);

    // Create Audit Log entry
    const auditEvent: AuditEvent = {
      id: `AUD-${Math.floor(90000 + Math.random() * 9000)}`,
      timestamp: timeStr,
      hash: `sha256:${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`,
      agent: 'Strands-Bedrock/v1.4',
      user: 'user:alex.rivera@opspilot.internal',
      action: `Human Approved: ${item.requestedAction}`,
      tool: 'issue_refund',
      reason: `Authorized by Operations Lead: ${item.reason}`,
      result: `[DEMO ACTION] Refund of $${item.amount?.toFixed(2) || '0.00'} simulated via Stripe/AWS Lambda mock. Real fund movement disabled in Demo Mode.`,
      riskLevel: item.riskLevel,
      simulatedDemo: true
    };

    auditState = [auditEvent, ...auditState];
    setStored('audit', auditState);

    currentAgentStatus = 'ONLINE';

    return { success: true, approval: updated, auditEvent };
  },

  // POST /api/approvals/:id/reject
  async rejectApproval(id: string, reason: string): Promise<{ success: boolean; approval: ApprovalRequest }> {
    const approvalIndex = approvalsState.findIndex(a => a.id === id);
    if (approvalIndex === -1) {
      throw new Error(`Approval request with ID ${id} not found.`);
    }

    const item = approvalsState[approvalIndex];
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const updated: ApprovalRequest = {
      ...item,
      status: 'REJECTED',
      resolvedAt: timeStr,
      resolvedBy: 'Alex Rivera (Operations Lead)',
      feedback: reason || 'Declined: Does not comply with policy requirements.'
    };

    approvalsState[approvalIndex] = updated;
    setStored('approvals', approvalsState);

    // Update task
    tasksState = tasksState.map(t => {
      if (t.id === item.taskId) {
        return {
          ...t,
          status: 'Escalated',
          humanActions: [
            ...t.humanActions,
            {
              timestamp: timeStr,
              action: `Rejected approval request ${id}: ${reason}`,
              operator: 'Alex Rivera'
            }
          ]
        };
      }
      return t;
    });
    setStored('tasks', tasksState);

    // Audit entry
    const auditEvent: AuditEvent = {
      id: `AUD-${Math.floor(90000 + Math.random() * 9000)}`,
      timestamp: timeStr,
      hash: `sha256:${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`,
      agent: 'Strands-Bedrock/v1.4',
      user: 'user:alex.rivera@opspilot.internal',
      action: `Human Rejected Action: ${item.requestedAction}`,
      tool: 'reject_human_approval',
      reason,
      result: 'Action aborted. Task escalated for manual customer inquiry follow-up.',
      riskLevel: 'MEDIUM',
      simulatedDemo: true
    };
    auditState = [auditEvent, ...auditState];
    setStored('audit', auditState);

    currentAgentStatus = 'ONLINE';

    return { success: true, approval: updated };
  },

  // GET /api/customers
  async getCustomers(): Promise<Customer[]> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/customers`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('API Gateway customers failed, using fallback', err);
      }
    }
    return [...customersState];
  },

  // GET /api/customers/:id
  async getCustomerById(id: string): Promise<Customer | null> {
    const list = await this.getCustomers();
    return list.find(c => c.id === id || c.name.toLowerCase().includes(id.toLowerCase())) || null;
  },

  // GET /api/documents
  async getDocuments(): Promise<UploadedDocument[]> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/documents`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('API Gateway documents failed, using fallback', err);
      }
    }
    return [...documentsState];
  },

  // POST /api/documents
  async uploadDocument(file: { name: string; size: string; type: string }): Promise<UploadedDocument> {
    const ext = file.name.split('.').pop()?.toUpperCase() as any || 'PDF';
    const validFormats = ['PDF', 'PNG', 'JPG', 'CSV', 'TXT'];
    const format = validFormats.includes(ext) ? ext : 'PDF';

    const newDoc: UploadedDocument = {
      id: `DOC-${Math.floor(8800 + Math.random() * 1000)}`,
      filename: file.name,
      fileSize: file.size,
      format,
      uploadedAt: 'Just now',
      uploadStatus: 'Uploaded',
      processingStatus: 'Completed (Demo)',
      extractedInformation: {
        documentType: `${format} Operational Document`,
        vendor: 'Simulated Inbound Source',
        date: new Date().toISOString().split('T')[0],
        rawSummary: `Parsed ${file.name} using local preview OCR simulator. Connect AWS S3 & Textract/Bedrock in production.`
      },
      agentAnalysis: {
        flags: ['Ingested to Staging Bucket', 'Format Validated', 'Ready for OpsPilot Agent Review'],
        actionRequired: false,
        recommendedTask: 'Trigger OpsPilot agent review in Agent Workspace',
        confidenceScore: 97.5
      }
    };

    documentsState = [newDoc, ...documentsState];
    setStored('documents', documentsState);

    // Audit log
    const auditEvent: AuditEvent = {
      id: `AUD-${Math.floor(90000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleTimeString(),
      hash: `sha256:${Math.random().toString(16).substring(2)}`,
      agent: 'Strands-Bedrock/v1.4',
      user: 'user:alex.rivera@opspilot.internal',
      action: `Uploaded document: ${file.name}`,
      tool: 'analyze_document',
      reason: 'User added new operational document for automated processing',
      result: `Document staged in S3 demo bucket. Ready for analysis.`,
      riskLevel: 'LOW',
      simulatedDemo: true
    };
    auditState = [auditEvent, ...auditState];
    setStored('audit', auditState);

    return newDoc;
  },

  // GET /api/audit
  async getAuditLog(): Promise<AuditEvent[]> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/audit`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('API Gateway audit failed, using fallback', err);
      }
    }
    return [...auditState];
  },

  // Reset demo state helper
  resetDemoData(): void {
    approvalsState = [...INITIAL_APPROVALS];
    tasksState = [...INITIAL_TASKS];
    customersState = [...INITIAL_CUSTOMERS];
    documentsState = [...INITIAL_DOCUMENTS];
    auditState = [...INITIAL_AUDIT_LOG];
    currentAgentStatus = 'ONLINE';
    localStorage.removeItem(STORAGE_PREFIX + 'approvals');
    localStorage.removeItem(STORAGE_PREFIX + 'tasks');
    localStorage.removeItem(STORAGE_PREFIX + 'customers');
    localStorage.removeItem(STORAGE_PREFIX + 'documents');
    localStorage.removeItem(STORAGE_PREFIX + 'audit');
  }
};
