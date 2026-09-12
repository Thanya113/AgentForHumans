# OpsPilot AI — Autonomous Operations Agent for Small Businesses

**OpsPilot AI** is a professional autonomous operations agent for small businesses and growing enterprises. It automates repetitive, judgment-heavy operational workflows—such as damaged-order complaints, return evaluations, vendor invoice reconciliations, customer policy verifications, follow-up scheduling, and inbound email resolution—while enforcing strict human-in-the-loop safety boundaries and immutable cryptographic audit logging.

---

## 1. Architectural Blueprint

OpsPilot AI is purpose-built to execute on Amazon Web Services using the **Strands Agents SDK** and **Amazon Bedrock**:

```
[ React / TypeScript Frontend ]
              │
              ▼ (HTTPS / Cognito JWT)
[ AWS API Gateway (v2 HTTP API) ]
              │
              ▼
[ AWS Lambda Functions (Python 3.11 Runtime) ]
              │
              ▼
[ Python Strands Agents SDK ] ────► [ Amazon Bedrock (Claude 3.5 Sonnet / Nova) ]
              │
              ├──► get_customer() ───────────► Amazon DynamoDB (OpsPilot_Customers)
              ├──► get_order() ──────────────► Amazon DynamoDB (OpsPilot_Orders)
              ├──► search_business_policy() ──► Amazon DynamoDB (OpsPilot_Policies)
              ├──► analyze_document() ───────► Amazon S3 + Bedrock Multimodal
              ├──► send_email() ─────────────► Amazon SES
              ├──► issue_refund() ───────────► Stripe / Payment Gateway
              ├──► create_followup_task() ───► Amazon DynamoDB (OpsPilot_Tasks)
              └──► record_audit_event() ─────► Amazon DynamoDB (OpsPilot_AuditLedger)
```

---

## 2. Why Strands Agents SDK?

- **Native AWS & Amazon Bedrock Optimization:** Purpose-built for low-latency tool orchestration with foundation models on Amazon Bedrock (including Anthropic Claude 3.5 Sonnet and Amazon Nova).
- **Strict Human-in-the-Loop Intercepts:** Unlike conversational chat frameworks that treat tool calls as side effects, Strands enables halting the execution pipeline at the `DECIDE` or `APPROVE` stage when discretionary boundaries (e.g. $50 financial limit) are met.
- **Enterprise Python Tool Ecosystem:** Python 3.11 Lambda execution provides direct access to `boto3`, cryptography, and multimodal image inspection libraries.

---

## 3. The 9-Stage Operations Pipeline

OpsPilot AI structures all operational tasks into an explicit, transparent 9-stage pipeline:

1. **UNDERSTAND:** Ingest user request or inbound message and categorize business intent.
2. **PLAN:** Generate tool invocation sequence and data retrieval steps.
3. **RETRIEVE:** Fetch customer records, order details, and policy manuals from DynamoDB.
4. **REASON:** Cross-reference operational facts against standard operating procedures (SOPs).
5. **DECIDE:** Formulate concrete remediation actions (e.g. replacement, refund, billing task).
6. **APPROVE (Human-in-the-Loop Gate):** Verify whether proposed action exceeds discretionary authority limits. If limit is exceeded, execution halts and creates an approval request.
7. **EXECUTE:** Invoke external tools (payment API, Amazon SES email, carrier dispatch).
8. **VERIFY:** Confirm external API success codes and update customer dispute status.
9. **AUDIT:** Generate an immutable, cryptographically sequenced (SHA-256) event entry.

---

## 4. Security & Safety Model

### Prompt Injection Defense (Untrusted Data Envelope)
External data (customer emails, invoice text, attached files) is strictly isolated within an untrusted data envelope:
```xml
<untrusted_external_data>
Customer email body or document OCR text here
</untrusted_external_data>
```
The system prompt strictly instructs the agent to treat this payload purely as inert data to extract facts from, ignoring any instructions to alter system behavior or approve actions.

### Discretionary Authority Limits
- **Refunds ≤ $50.00:** Agent is authorized to issue refunds autonomously if policy criteria are satisfied.
- **Refunds > $50.00:** Hard-coded security gate triggers `WAITING FOR APPROVAL`. Execution stops until an authorized Operations Lead approves or rejects the action in the UI.
- **Outbound Email Review:** Emails involving formal dispute threats, carrier claims, or legal terminology are automatically queued for human sign-off.

### Zero Secrets in Frontend
No AWS credentials, IAM secret keys, or Bedrock tokens are ever bundled or exposed in the frontend. All cloud authentication occurs server-side via AWS Cognito and IAM Lambda execution roles.

---

## 5. Demo Mode vs. Production Mode

OpsPilot AI features a dual-mode service architecture (`src/services/api.ts`):

| Feature | Demo Mode (Local Preview) | Production Mode (AWS Cloud) |
| :--- | :--- | :--- |
| **Backend** | Reactive local simulation in browser storage | AWS API Gateway + AWS Lambda |
| **Agent Engine** | Step-by-step pipeline visualizer with realistic reasoning | Python Strands Agents SDK + Amazon Bedrock |
| **Financial Actions** | Clearly tagged with `[DEMO ACTION]` (no charges made) | Live Stripe / ERP payment gateway via Lambda |
| **Email Dispatch** | Simulated delivery to preview console | Amazon SES verified domain sending |
| **Audit Log** | Local SHA-256 hash chain in `localStorage` | KMS-encrypted Amazon DynamoDB audit ledger |
| **Activation** | Default when `VITE_API_GATEWAY_URL` is unset | Automatically engaged when `VITE_API_GATEWAY_URL` is set |

---

## 6. AWS Deployment Guide

### Prerequisites
1. AWS CLI configured (`aws configure`)
2. Node.js 18+ and Python 3.11+
3. AWS CDK CLI (`npm install -g aws-cdk`)

### Step 1: Deploy AWS Backend
```bash
# Navigate to CDK directory
cd aws/cdk

# Install Python dependencies
pip install -r requirements.txt

# Bootstrap CDK environment (first time only)
cdk bootstrap

# Deploy the OpsPilot infrastructure stack
cdk deploy
```
Upon completion, the CDK output will provide your **API Gateway Endpoint URL**:
```
Outputs:
OpsPilotStack.OpsPilotHttpApiEndpoint = https://a1b2c3d4.execute-api.us-east-1.amazonaws.com
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env` in the project root:
```bash
cp .env.example .env
```
Set the API Gateway URL:
```env
VITE_API_GATEWAY_URL=https://a1b2c3d4.execute-api.us-east-1.amazonaws.com
```

### Step 3: Run the Frontend
```bash
npm install
npm run dev
```
Open your browser at `http://localhost:3000` to access the OpsPilot AI Operations Dashboard.

---

## 7. Directory Structure

```
├── aws/
│   ├── strands_agent/
│   │   ├── agent.py               # Strands Agent definition with Bedrock model
│   │   └── tools.py               # 8 Custom business tools with DynamoDB/S3/SES
│   ├── cdk/
│   │   └── opspilot_stack.py      # AWS CDK infrastructure stack definition
│   └── API_CONTRACT.md            # Detailed REST API specification
├── src/
│   ├── components/
│   │   ├── Sidebar.tsx            # Left navigation sidebar
│   │   ├── TopBar.tsx             # Global search, agent status, and mode switcher
│   │   ├── modals/                # Architecture overview & demo mode modals
│   │   └── views/
│   │       ├── DashboardView.tsx       # KPI summaries and rapid launch
│   │       ├── AgentWorkspaceView.tsx  # 9-stage pipeline visualizer
│   │       ├── ApprovalsView.tsx       # Human-in-the-loop review center
│   │       ├── TasksView.tsx           # Operational tasks queue
│   │       ├── CustomersView.tsx       # Customer directory and interaction histories
│   │       ├── DocumentsView.tsx       # Drag-and-drop OCR intake and analysis
│   │       ├── AnalyticsView.tsx       # Automation telemetry and metrics
│   │       ├── AuditLogView.tsx        # Cryptographic immutable audit trail
│   │       ├── InboxView.tsx           # Inbound customer requests intake
│   │       └── SettingsView.tsx        # Security, RBAC, and approval limits
│   ├── data/
│   │   └── mockData.ts            # High-fidelity domain seed data
│   ├── services/
│   │   └── api.ts                 # Dual-mode API service layer
│   ├── types.ts                   # Core domain TypeScript interfaces
│   ├── App.tsx                    # Main application controller
│   └── main.tsx                   # React 18 DOM root
├── metadata.json                  # Application capabilities and metadata
└── README.md                      # Architecture and deployment guide
```

---

## 8. License & Verification
OpsPilot AI is architected in accordance with enterprise operations best practices. For technical inquiries, consult `aws/API_CONTRACT.md`.
