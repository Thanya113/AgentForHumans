import { ApprovalRequest, AuditEvent, Customer, TaskItem, UploadedDocument } from '../types';

export const INITIAL_APPROVALS: ApprovalRequest[] = [
  {
    id: 'APP-1092',
    taskId: 'TSK-4029',
    runId: 'RUN-771',
    customerName: 'Alex Mercer',
    customerId: 'CUST-8842',
    orderId: 'ORD-8842',
    requestedAction: 'Issue Refund ($120.00 to Visa •••• 4021)',
    amount: 120.00,
    automaticAuthorityLimit: 50.00,
    riskLevel: 'HIGH',
    reason: 'Customer reported premium ceramic dinnerware set arrived broken with photo evidence.',
    evidence: [
      'Order ORD-8842 verified in DynamoDB (Delivered 2 days ago)',
      'Customer Alex Mercer verified (Account age: 1.8 years, VIP Silver)',
      'Damage evidence verified via document OCR & visual verification tool',
      'Policy Sec 4.2 checked: Damaged goods eligible for full refund within 14 days',
      'Exceeds automatic refund threshold ($50.00 limit) - Human approval mandatory'
    ],
    policyReference: 'Merchant Returns & Damage Policy v3.2 - Section 4 (Discretionary Claims > $50)',
    status: 'PENDING',
    createdAt: '10 minutes ago'
  },
  {
    id: 'APP-1093',
    taskId: 'TSK-4031',
    runId: 'RUN-773',
    customerName: 'Elena Rostova (Apex Dynamics)',
    customerId: 'CUST-9104',
    orderId: 'ORD-9012',
    requestedAction: 'Override Late Fee & Apply $240.00 Credit to Net-30 Invoice',
    amount: 240.00,
    automaticAuthorityLimit: 50.00,
    riskLevel: 'HIGH',
    reason: 'Client experienced 6-hour shipment API outage during their peak Black Friday intake.',
    evidence: [
      'CloudWatch SLA metric verified: API degraded during Nov 28 window',
      'Customer lifetime billing: $18,400 with 100% on-time payment history',
      'Account Executive approval note confirmed in CRM'
    ],
    policyReference: 'Enterprise SLA & Billing Adjustment Policy Sec 9.1',
    status: 'PENDING',
    createdAt: '35 minutes ago'
  },
  {
    id: 'APP-1094',
    taskId: 'TSK-4015',
    customerName: 'David Chen',
    customerId: 'CUST-7210',
    orderId: 'ORD-8711',
    requestedAction: 'Send Custom Legal Liability Settlement Email',
    riskLevel: 'HIGH',
    amount: 0,
    automaticAuthorityLimit: 0,
    reason: 'Customer sent email mentioning "small claims escalation" regarding missing package.',
    evidence: [
      'FedEx tracking confirms package lost in transit (Case #FX-88912)',
      'External email contains legal escalation keywords',
      'Policy Sec 1.4: All formal dispute/legal responses require Ops Lead review'
    ],
    policyReference: 'Legal Risk & Outbound Escalation Standard SOP-08',
    status: 'PENDING',
    createdAt: '1 hour ago'
  }
];

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'TSK-4029',
    title: 'Resolve Damaged Order Claim #ORD-8842',
    description: 'Review ceramic dinnerware damage photos, inspect invoice, verify warranty and issue refund or replacement.',
    category: 'Refund',
    status: 'Waiting Approval',
    priority: 'High',
    assignee: 'OpsPilot Agent',
    createdAt: 'Today, 09:14 AM',
    deadline: 'Today, 01:00 PM',
    customerName: 'Alex Mercer',
    customerId: 'CUST-8842',
    agentActions: [
      { timestamp: '09:14:02', action: 'Ingested customer ticket via SES inbound parser' },
      { timestamp: '09:14:15', action: 'Called tool: get_customer(CUST-8842)' },
      { timestamp: '09:14:18', action: 'Called tool: get_order(ORD-8842)' },
      { timestamp: '09:14:24', action: 'Called tool: search_business_policy(refund_damaged)' },
      { timestamp: '09:14:30', action: 'Generated Approval Request APP-1092 (Amount $120 > $50 limit)' }
    ],
    humanActions: []
  },
  {
    id: 'TSK-4030',
    title: 'Automated Invoice Reconciliation for TechSupply Co',
    description: 'Match supplier PDF invoice against purchase orders and warehouse intake logs.',
    category: 'Invoice',
    status: 'Completed',
    priority: 'Medium',
    assignee: 'OpsPilot Agent',
    createdAt: 'Today, 08:30 AM',
    deadline: 'Today, 05:00 PM',
    customerName: 'TechSupply Distribution',
    customerId: 'CUST-6110',
    agentActions: [
      { timestamp: '08:30:10', action: 'Called tool: analyze_document(invoice_techsupply_9912.pdf)' },
      { timestamp: '08:30:25', action: 'Cross-referenced PO-3391 ($3,420.00 match with 0% discrepancy)' },
      { timestamp: '08:30:42', action: 'Called tool: create_followup_task(Schedule ACH Payment via Accounting)' },
      { timestamp: '08:31:00', action: 'Called tool: record_audit_event(INVOICE_RECONCILED)' }
    ],
    humanActions: []
  },
  {
    id: 'TSK-4031',
    title: 'Outage SLA Credit Review for Apex Dynamics',
    description: 'Calculate downtime credit for Net-30 invoice adjustment based on logged incident metrics.',
    category: 'Policy Review',
    status: 'Waiting Approval',
    priority: 'High',
    assignee: 'OpsPilot Agent',
    createdAt: 'Today, 07:45 AM',
    deadline: 'Today, 12:00 PM',
    customerName: 'Elena Rostova',
    customerId: 'CUST-9104',
    agentActions: [
      { timestamp: '07:45:12', action: 'Queried CloudWatch uptime telemetry for tenant' },
      { timestamp: '07:45:20', action: 'Calculated credit entitlement: $240.00' },
      { timestamp: '07:45:33', action: 'Pushed to Approval Center APP-1093' }
    ],
    humanActions: []
  },
  {
    id: 'TSK-4028',
    title: 'Customer Address Change Verification',
    description: 'Verify security credentials before updating destination address for in-flight shipment.',
    category: 'Customer Support',
    status: 'In Progress',
    priority: 'Medium',
    assignee: 'OpsPilot Agent',
    createdAt: 'Today, 10:02 AM',
    deadline: 'Today, 02:00 PM',
    customerName: 'Marcus Vance',
    customerId: 'CUST-4419',
    agentActions: [
      { timestamp: '10:02:11', action: 'Detected address update request in customer message' },
      { timestamp: '10:02:15', action: 'Untrusted content quarantine applied' },
      { timestamp: '10:02:22', action: 'Verified 2FA SMS code timestamp against Cognito auth log' }
    ],
    humanActions: []
  },
  {
    id: 'TSK-4022',
    title: 'Suspected Fraud Order Flag #ORD-8991',
    description: 'Multiple international credit card declines followed by high-ticket expedited shipping order.',
    category: 'Policy Review',
    status: 'Escalated',
    priority: 'Critical',
    assignee: 'Human Operations',
    createdAt: 'Yesterday, 04:20 PM',
    deadline: 'Today, 11:00 AM',
    customerName: 'Unknown / Flagged IP',
    customerId: 'CUST-1002',
    agentActions: [
      { timestamp: '16:20:05', action: 'Risk engine flagged fraud score: 89/100' },
      { timestamp: '16:20:12', action: 'Order placed on security hold' },
      { timestamp: '16:20:20', action: 'Escalated to Human Operations Lead' }
    ],
    humanActions: [
      { timestamp: '17:00:14', action: 'Manual IP geolocation cross-checked with card issuer', operator: 'Alex Rivera (Lead)' }
    ]
  },
  {
    id: 'TSK-4019',
    title: 'Damaged Packaging Inquiry #ORD-8810',
    description: 'Minor box dent reported, contents intact. Automated store credit voucher issued.',
    category: 'Refund',
    status: 'Completed',
    priority: 'Low',
    assignee: 'OpsPilot Agent',
    createdAt: 'Yesterday, 02:15 PM',
    deadline: 'Yesterday, 06:00 PM',
    customerName: 'Sarah Jenkins',
    customerId: 'CUST-5512',
    agentActions: [
      { timestamp: '14:15:10', action: 'Evaluated goodwill courtesy voucher policy' },
      { timestamp: '14:15:20', action: 'Amount $15.00 within automatic authority limit ($50.00)' },
      { timestamp: '14:15:35', action: 'Called tool: issue_refund(CUST-5512, $15.00 Store Credit)' },
      { timestamp: '14:15:45', action: 'Called tool: send_email(voucher_confirmation)' }
    ],
    humanActions: []
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'CUST-8842',
    name: 'Alex Mercer',
    email: 'alex.mercer@gmail.com',
    phone: '+1 (555) 234-8901',
    tier: 'Silver',
    joinedDate: '2024-03-15',
    lifetimeValue: 1420.50,
    openIssuesCount: 1,
    orders: [
      {
        orderId: 'ORD-8842',
        date: '2026-09-10',
        total: 120.00,
        status: 'Disputed',
        items: ['Artisan Ceramic 16-Piece Dinner Set - Matte Charcoal']
      },
      {
        orderId: 'ORD-8201',
        date: '2026-06-22',
        total: 340.00,
        status: 'Delivered',
        items: ['Stoneware Serving Platters (x2)', 'Handblown Wine Glasses (Set of 6)']
      },
      {
        orderId: 'ORD-7590',
        date: '2025-11-19',
        total: 960.50,
        status: 'Delivered',
        items: ['Nordic Oak Kitchen Stools (Pair)']
      }
    ],
    openIssues: [
      {
        id: 'ISS-401',
        title: 'Damaged item delivery (Order ORD-8842)',
        severity: 'High',
        date: '2026-09-12'
      }
    ],
    previousInteractions: [
      {
        id: 'INT-991',
        channel: 'Email',
        date: '2026-09-12 09:12',
        summary: 'Reported package arrived with shattered dinner plates inside box; sent photos.',
        sentiment: 'Negative'
      },
      {
        id: 'INT-720',
        channel: 'Chat',
        date: '2026-06-25 14:20',
        summary: 'Asked about care instructions for stoneware platters. Automated reply sent.',
        sentiment: 'Positive'
      }
    ],
    agentHistory: [
      {
        timestamp: '2026-09-12 09:14',
        task: 'TSK-4029: Damaged dinnerware claim',
        resolution: 'Generated high-risk Approval Request APP-1092 ($120 refund)',
        status: 'Approved by Human'
      },
      {
        timestamp: '2026-06-25 14:21',
        task: 'Care instructions delivery',
        resolution: 'Sent product maintenance PDF',
        status: 'Automated'
      }
    ]
  },
  {
    id: 'CUST-9104',
    name: 'Elena Rostova',
    email: 'elena@apexdynamics.io',
    phone: '+1 (555) 789-4412',
    tier: 'VIP',
    joinedDate: '2023-11-04',
    lifetimeValue: 18400.00,
    openIssuesCount: 1,
    orders: [
      {
        orderId: 'ORD-9012',
        date: '2026-09-01',
        total: 2400.00,
        status: 'Delivered',
        items: ['Quarterly API Ingestion License (Enterprise Tier)']
      }
    ],
    openIssues: [
      {
        id: 'ISS-402',
        title: 'SLA Outage credit claim for Nov 28 window',
        severity: 'Medium',
        date: '2026-09-12'
      }
    ],
    previousInteractions: [
      {
        id: 'INT-884',
        channel: 'Email',
        date: '2026-09-12 07:30',
        summary: 'Requested billing review for downtime credit calculation under Master Agreement Section 9.',
        sentiment: 'Neutral'
      }
    ],
    agentHistory: [
      {
        timestamp: '2026-09-12 07:45',
        task: 'TSK-4031: SLA adjustment calculation',
        resolution: 'Calculated $240.00 credit; created Approval Request APP-1093',
        status: 'Approved by Human'
      }
    ]
  },
  {
    id: 'CUST-5512',
    name: 'Sarah Jenkins',
    email: 'sjenkins@outlook.com',
    phone: '+1 (555) 345-0988',
    tier: 'Standard',
    joinedDate: '2025-08-14',
    lifetimeValue: 390.00,
    openIssuesCount: 0,
    orders: [
      {
        orderId: 'ORD-8810',
        date: '2026-09-08',
        total: 75.00,
        status: 'Delivered',
        items: ['Organic Linen Table Runner', 'Brass Napkin Rings']
      }
    ],
    openIssues: [],
    previousInteractions: [
      {
        id: 'INT-610',
        channel: 'Chat',
        date: '2026-09-11 14:10',
        summary: 'Customer noted crushed outer box. Agent verified items were intact and credited $15 voucher.',
        sentiment: 'Positive'
      }
    ],
    agentHistory: [
      {
        timestamp: '2026-09-11 14:15',
        task: 'TSK-4019: Box condition complaint',
        resolution: 'Issued $15 courtesy credit automatically under standard authority',
        status: 'Automated'
      }
    ]
  }
];

export const INITIAL_DOCUMENTS: UploadedDocument[] = [
  {
    id: 'DOC-8812',
    filename: 'Invoice_TechSupply_9912.pdf',
    fileSize: '412 KB',
    format: 'PDF',
    uploadedAt: 'Today, 08:28 AM',
    uploadStatus: 'Uploaded',
    processingStatus: 'Completed (Demo)',
    extractedInformation: {
      documentType: 'Vendor Commercial Invoice',
      vendor: 'TechSupply Distribution Corp (US-West)',
      invoiceNumber: 'INV-9912-US',
      date: '2026-09-08',
      totalAmount: '$3,420.00 USD',
      lineItems: [
        { description: 'Wireless Barcode Scanners (x10)', amount: '$1,800.00' },
        { description: 'Direct Thermal Shipping Labels (50 rolls)', amount: '$620.00' },
        { description: 'Industrial Label Printer Ribbon (x20)', amount: '$1,000.00' }
      ],
      rawSummary: 'Standard net-30 vendor invoice matching Purchase Order PO-3391. Sales tax exempt under resale certificate #CA-88912.'
    },
    agentAnalysis: {
      flags: ['Exact PO Match', 'Authorized Supplier', 'Within Budget Limit'],
      actionRequired: false,
      recommendedTask: 'Approved for scheduled automated batch payout via Bill.com / ACH',
      confidenceScore: 99.4
    }
  },
  {
    id: 'DOC-8813',
    filename: 'Damage_Photo_ORD-8842_Plate.jpg',
    fileSize: '2.8 MB',
    format: 'JPG',
    uploadedAt: 'Today, 09:12 AM',
    uploadStatus: 'Uploaded',
    processingStatus: 'Completed (Demo)',
    extractedInformation: {
      documentType: 'Customer Claim Photo Evidence',
      vendor: 'Alex Mercer (Customer)',
      invoiceNumber: 'ORD-8842',
      date: '2026-09-12',
      totalAmount: '$120.00 Claim',
      rawSummary: 'Image shows shattered ceramic stoneware inside manufacturer styrofoam packaging. Transit impact fractures clearly identifiable.'
    },
    agentAnalysis: {
      flags: ['Verified Physical Breakage', 'Original Shipping Label Visible in Background', 'High Probability Carrier Drop'],
      actionRequired: true,
      recommendedTask: 'Issue refund or re-shipment. Request approval due to $120.00 > $50.00 automatic threshold.',
      confidenceScore: 96.8
    }
  },
  {
    id: 'DOC-8814',
    filename: 'Vendor_Price_Sheet_Q4_2026.csv',
    fileSize: '84 KB',
    format: 'CSV',
    uploadedAt: 'Yesterday, 03:40 PM',
    uploadStatus: 'Uploaded',
    processingStatus: 'Completed (Demo)',
    extractedInformation: {
      documentType: 'Inventory Pricing Table',
      vendor: 'Global Warehousing Partners',
      date: '2026-09-01',
      rawSummary: '142 SKU line items with updated Q4 freight surcharges (+4.2% average across heavy items).'
    },
    agentAnalysis: {
      flags: ['Surcharge Increase Detected', 'Margin Threshold Alert'],
      actionRequired: true,
      recommendedTask: 'Update ERP landed cost table and alert operations manager',
      confidenceScore: 98.1
    }
  }
];

export const INITIAL_AUDIT_LOG: AuditEvent[] = [
  {
    id: 'AUD-90928',
    timestamp: '10:02:22',
    hash: 'sha256:7f4c9a812e9b0d1e345f09bc12de44a01',
    agent: 'Strands-Bedrock/v1.4',
    user: 'system:scheduler',
    action: 'Verified 2FA SMS code timestamp against Cognito auth log',
    tool: 'verify_security_token',
    reason: 'Security check before evaluating customer in-flight shipping address redirect',
    result: 'Auth token valid (expires in 45 min). Quarantine preserved for payload text.',
    riskLevel: 'MEDIUM',
    simulatedDemo: true
  },
  {
    id: 'AUD-90925',
    timestamp: '09:14:30',
    hash: 'sha256:8b2a4f0011c782e45901ba34de12aa59',
    agent: 'Strands-Bedrock/v1.4',
    user: 'agent:opspilot',
    action: 'Generated Approval Request APP-1092',
    tool: 'request_human_approval',
    reason: 'Refund amount $120.00 exceeds agent discretionary authority limit of $50.00',
    result: 'Task TSK-4029 placed in WAITING_APPROVAL. Alert broadcast to Operations Lead.',
    riskLevel: 'HIGH',
    simulatedDemo: true
  },
  {
    id: 'AUD-90924',
    timestamp: '09:14:24',
    hash: 'sha256:3e10bb4290fa8c71289de65cc0193bb2',
    agent: 'Strands-Bedrock/v1.4',
    user: 'agent:opspilot',
    action: 'Checked policy: Merchant Returns & Damage Policy v3.2',
    tool: 'search_business_policy',
    reason: 'Validate eligibility rules for shattered ceramic claim on order ORD-8842',
    result: 'Policy Sec 4.2 confirms full refund allowable within 14 days; requires lead approval > $50.',
    riskLevel: 'LOW',
    simulatedDemo: true
  },
  {
    id: 'AUD-90923',
    timestamp: '09:14:18',
    hash: 'sha256:9c1a76d8e09f4521780cbba44192dd10',
    agent: 'Strands-Bedrock/v1.4',
    user: 'agent:opspilot',
    action: 'Queried DynamoDB for Order ORD-8842',
    tool: 'get_order',
    reason: 'Retrieve purchase invoice, tracking status, and line item specifications',
    result: 'Found order ORD-8842 (Total $120.00, Paid via Visa, Delivered Sep 10).',
    riskLevel: 'LOW',
    simulatedDemo: true
  },
  {
    id: 'AUD-90922',
    timestamp: '09:14:15',
    hash: 'sha256:1a82f309b8c7144e99aa201dd48e7199',
    agent: 'Strands-Bedrock/v1.4',
    user: 'agent:opspilot',
    action: 'Queried customer record for CUST-8842 (Alex Mercer)',
    tool: 'get_customer',
    reason: 'Resolve customer profile, lifetime value, and dispute frequency',
    result: 'Customer Alex Mercer verified (Tier: Silver, 0 prior disputes, good standing).',
    riskLevel: 'LOW',
    simulatedDemo: true
  },
  {
    id: 'AUD-90919',
    timestamp: '08:31:00',
    hash: 'sha256:5501ba834c90ee123b09fa1288cd7234',
    agent: 'Strands-Bedrock/v1.4',
    user: 'agent:opspilot',
    action: 'Recorded audit event INVOICE_RECONCILED',
    tool: 'record_audit_event',
    reason: 'TechSupply Distribution invoice #INV-9912 matched PO-3391 with 0% discrepancy',
    result: 'Immutable ledger entry written. Scheduled ACH payment queued for accounting.',
    riskLevel: 'LOW',
    simulatedDemo: true
  },
  {
    id: 'AUD-90910',
    timestamp: '07:45:33',
    hash: 'sha256:4a009fb332c918ee87ba220199cf8471',
    agent: 'Strands-Bedrock/v1.4',
    user: 'agent:opspilot',
    action: 'Created Approval Request APP-1093 for SLA credit ($240.00)',
    tool: 'request_human_approval',
    reason: 'Credit adjustment > $50.00 limit for Apex Dynamics enterprise account',
    result: 'Task TSK-4031 status set to WAITING_APPROVAL.',
    riskLevel: 'HIGH',
    simulatedDemo: true
  }
];
