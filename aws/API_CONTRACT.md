# OpsPilot AI - Production API Gateway & Lambda Contract

This document specifies the exact JSON REST contract established between the React/TypeScript frontend (`src/services/api.ts`) and the AWS API Gateway / Lambda backend (`aws/strands_agent/agent.py`).

---

## Base URL
- Local/Demo Mode: Fallback to simulated client-side service when `VITE_API_GATEWAY_URL` is empty.
- AWS Production: Configured via environment variable `VITE_API_GATEWAY_URL=https://{api-id}.execute-api.us-east-1.amazonaws.com`

---

## 1. Agent Execution & Orchestration

### `POST /api/agent/run`
Triggers an autonomous operational reasoning run powered by Python Strands Agents SDK and Amazon Bedrock.

**Request Headers:**
```http
Content-Type: application/json
Authorization: Bearer <cognito-jwt-token>
```

**Request Body:**
```json
{
  "prompt": "Customer Alex Mercer reports shattered plates for order ORD-8842.",
  "context": {
    "channel": "email",
    "priority": "High"
  }
}
```

**Response (200 OK):**
```json
{
  "runId": "RUN-2026-8842",
  "status": "WAITING FOR APPROVAL",
  "stages": [
    { "stage": "UNDERSTAND", "status": "COMPLETED", "summary": "Identified damaged order ORD-8842." },
    { "stage": "PLAN", "status": "COMPLETED", "summary": "Planned retrieval of customer, order, and policy." },
    { "stage": "RETRIEVE", "status": "COMPLETED", "summary": "Order ORD-8842 and Customer CUST-8842 retrieved." },
    { "stage": "REASON", "status": "COMPLETED", "summary": "Policy allows refund for verified transit damages." },
    { "stage": "DECIDE", "status": "COMPLETED", "summary": "Calculated replacement refund of $124.50." },
    { "stage": "APPROVE", "status": "WAITING_APPROVAL", "summary": "Claim exceeds $50 threshold. Approval queued." }
  ],
  "requiresApproval": true,
  "approvalId": "APP-2026-001"
}
```

---

### `GET /api/agent/status`
Returns real-time health and heartbeat of the Strands Agent worker cluster.

**Response (200 OK):**
```json
{
  "status": "ONLINE",
  "activeModel": "anthropic.claude-3-5-sonnet-20241022-v2:0",
  "framework": "Strands Agents SDK (Python 3.11)",
  "region": "us-east-1",
  "lastHeartbeat": "2026-09-12T13:45:00Z"
}
```

---

## 2. Approvals & Human-in-the-Loop

### `GET /api/approvals`
List all pending, approved, and rejected operational approval requests.

**Response (200 OK):**
```json
[
  {
    "id": "APP-2026-001",
    "actionType": "Financial Refund",
    "amount": 124.50,
    "limit": 50.00,
    "customer": "Alex Mercer",
    "customerId": "CUST-8842",
    "orderId": "ORD-8842",
    "reason": "Damaged dinnerware reported within 48h.",
    "riskLevel": "HIGH",
    "status": "PENDING",
    "evidence": ["Damage photo photo_crack.jpg", "Policy SOP-4.2"],
    "createdAt": "Today, 10:42 AM"
  }
]
```

### `POST /api/approvals/{id}/approve`
Authorizes an escalated action.

**Request Body:**
```json
{
  "operatorNote": "Reviewed photographic evidence; approved replacement refund."
}
```

### `POST /api/approvals/{id}/reject`
Declines an escalated action.

**Request Body:**
```json
{
  "rejectionReason": "Item delivered outside 14-day claim window."
}
```

---

## 3. Tasks Management

### `GET /api/tasks`
Retrieve queued operational tasks.

### `POST /api/tasks`
Enqueue a new operational task.

---

## 4. Customers & CRM

### `GET /api/customers`
Query customer operational directory.

### `GET /api/customers/{id}`
Retrieve a full customer profile, order history, and previous agent interactions.

---

## 5. Document Intake & Ledger

### `POST /api/documents/upload`
Uploads document to Amazon S3 staging bucket and triggers Bedrock multimodal inspection.

### `GET /api/audit-log`
Retrieve cryptographically signed SHA-256 event trail from Amazon DynamoDB.

### `GET /api/health`
System health status endpoint for load balancers and container probes.
