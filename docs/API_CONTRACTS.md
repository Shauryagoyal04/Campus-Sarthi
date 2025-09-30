# Campus SARTHI API Contracts

This document describes the API contracts between the frontend and backend. The frontend expects these endpoints to be implemented by the backend.

## Base URL

All API endpoints are relative to: `${NEXT_PUBLIC_API_HOST}/api`

## Authentication

Admin endpoints require authentication via token in the `Authorization` header:

\`\`\`
Authorization: Bearer <admin-token>
\`\`\`

## Endpoints

### 1. Query Endpoint

**POST** `/api/query`

Submit a user query and receive an AI-generated response.

**Request Body:**

\`\`\`typescript
{
  sessionId?: string;        // Optional: existing session ID
  text?: string;             // User's text query
  audioUrl?: string;         // URL to uploaded audio file
  language?: string;         // Language code: en, pa, te, bn
  modality: "text" | "voice"; // Input modality
}
\`\`\`

**Response:**

\`\`\`typescript
{
  sessionId: string;         // Session ID for conversation continuity
  answer: string;            // AI-generated answer
  confidence: number;        // Confidence score (0-100)
  sources: Array<{           // Source citations
    id: string;
    title: string;
    url?: string;
    page?: number;
    excerpt?: string;
  }>;
  suggestions?: string[];    // Suggested follow-up questions
}
\`\`\`

**Status Codes:**
- 200: Success
- 400: Invalid request
- 500: Server error

---

### 2. Escalate Endpoint

**POST** `/api/escalate`

Escalate a conversation to human support.

**Request Body:**

\`\`\`typescript
{
  sessionId: string;         // Current session ID
  message: string;           // User's escalation message
  reason: string;            // Reason for escalation
  language: string;          // Language code
  contact?: string;          // Optional contact info
}
\`\`\`

**Response:**

\`\`\`typescript
{
  ok: boolean;               // Success indicator
}
\`\`\`

**Status Codes:**
- 200: Success
- 400: Invalid request
- 500: Server error

---

### 3. Upload Audio Endpoint

**POST** `/api/upload-audio`

Upload an audio file for voice queries.

**Request Body:** `multipart/form-data`
- `audio`: Audio file (Blob)

**Response:**

\`\`\`typescript
{
  ok: boolean;
  audioUrl: string;          // URL to the uploaded audio
  transcript?: string;       // Optional transcription
}
\`\`\`

**Status Codes:**
- 200: Success
- 400: Invalid request
- 500: Server error

---

### 4. Admin - Get Conversations

**GET** `/api/admin/conversations?status=pending`

Retrieve conversations for admin review.

**Query Parameters:**
- `status` (optional): Filter by status (`pending` | `resolved`)

**Response:**

\`\`\`typescript
{
  conversations: Array<{
    id: string;
    sessionId: string;
    status: "pending" | "resolved";
    messages: Array<Message>;
    lastActivity: Date;
    language: string;
  }>;
  total: number;
}
\`\`\`

---

### 5. Admin - Update Conversation

**PATCH** `/api/admin/conversations`

Update conversation status.

**Request Body:**

\`\`\`typescript
{
  conversationId: string;
  status: "pending" | "resolved";
}
\`\`\`

**Response:**

\`\`\`typescript
{
  ok: boolean;
}
\`\`\`

---

### 6. Admin - Get Documents

**GET** `/api/admin/documents?search=query`

Retrieve documents in the knowledge base.

**Query Parameters:**
- `search` (optional): Search query

**Response:**

\`\`\`typescript
{
  documents: Array<{
    id: string;
    name: string;
    type: string;
    uploadedAt: Date;
    size: number;
    url?: string;
  }>;
  total: number;
}
\`\`\`

---

### 7. Admin - Upload Document

**POST** `/api/admin/documents`

Upload a new document to the knowledge base.

**Request Body:** `multipart/form-data`
- `file`: Document file

**Response:**

\`\`\`typescript
{
  ok: boolean;
  document: {
    id: string;
    name: string;
    type: string;
    size: number;
    uploadedAt: Date;
  };
}
\`\`\`

---

### 8. Admin - Delete Document

**DELETE** `/api/admin/documents?id=doc-123`

Delete a document from the knowledge base.

**Query Parameters:**
- `id`: Document ID

**Response:**

\`\`\`typescript
{
  ok: boolean;
}
\`\`\`

---

### 9. Admin - Get KPI Data

**GET** `/api/admin/kpi`

Retrieve KPI metrics and chart data.

**Response:**

\`\`\`typescript
{
  kpi: {
    totalQueries: number;
    avgConfidence: number;
    escalations: number;
    activeUsers: number;
  };
  chartData: Array<{
    date: string;
    queries: number;
    confidence: number;
  }>;
}
\`\`\`

---

### 10. Admin - Get Volunteer Queue

**GET** `/api/admin/volunteers`

Retrieve volunteer-submitted answers for curation.

**Response:**

\`\`\`typescript
{
  queue: Array<{
    id: string;
    question: string;
    suggestedAnswer: string;
    confidence: number;
    submittedBy: string;
    submittedAt: Date;
    status: string;
  }>;
  total: number;
}
\`\`\`

---

### 11. Admin - Process Volunteer Submission

**POST** `/api/admin/volunteers`

Approve or reject a volunteer submission.

**Request Body:**

\`\`\`typescript
{
  submissionId: string;
  action: "approve" | "reject";
  editedAnswer?: string;     // Optional edited answer
}
\`\`\`

**Response:**

\`\`\`typescript
{
  ok: boolean;
}
\`\`\`

---

### 12. Health Check

**GET** `/api/health`

Check API health status.

**Response:**

\`\`\`typescript
{
  status: "ok";
  timestamp: string;
  version: string;
  environment: string;
}
\`\`\`

---

## WebSocket (Optional)

For real-time notifications:

**URL:** `wss://${NEXT_PUBLIC_API_HOST_HOSTNAME}/ws/notifications`

**Events:**
- `new_escalation`: New conversation escalated
- `document_processed`: Document processing complete
- `volunteer_submission`: New volunteer submission

---

## Error Responses

All endpoints may return error responses in this format:

\`\`\`typescript
{
  error: string;             // Error message
  code?: string;             // Optional error code
  details?: any;             // Optional error details
}
\`\`\`

---

## Notes for Backend Implementation

1. **Session Management**: Use `sessionId` to maintain conversation context
2. **Language Support**: Ensure responses are in the requested language
3. **Confidence Scoring**: Implement confidence calculation based on retrieval quality
4. **Source Citations**: Always include source documents with page numbers
5. **Rate Limiting**: Implement rate limiting to prevent abuse
6. **Caching**: Cache frequently asked questions for better performance
7. **Monitoring**: Log all queries for analytics and improvement
8. **Security**: Validate and sanitize all inputs
9. **CORS**: Configure CORS for widget embedding
10. **Embeddings**: Use Gemini or similar for generating embeddings
