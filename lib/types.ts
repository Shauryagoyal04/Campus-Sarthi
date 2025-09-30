export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  confidence?: number
  sources?: Source[]
  audioUrl?: string
  suggestions?: string[]
}

export interface Source {
  id: string
  title: string
  url?: string
  page?: number
  excerpt?: string
}

export interface ChatSession {
  sessionId: string
  messages: Message[]
  language: string
}

// Python API Request Types
export interface PythonQueryRequest {
  query: string
  branch?: string
  year?: string
  top_k?: number
}

export interface PythonQueryResponse {
  answer: string
  query: string
  branch: string
  year: string
  timestamp: string
  context_used: number
}

export interface DocumentUploadRequest {
  file: File
  doc_name: string
  branch?: string
  year?: string
  valid_from?: string
  valid_to?: string
}

export interface DocumentUploadResponse {
  message: string
  doc_name: string
  chunks_processed: number
  branch: string
  year: string
  doc_id: string
}

export interface SimilarDocument {
  content: string
  doc_name: string
  branch: string
  year: string
  similarity: number
  valid_from?: string
  valid_to?: string
}

export interface SearchResponse {
  documents: SimilarDocument[]
  total_found: number
  query_embedding_success: boolean
}

// Legacy types for compatibility
export interface QueryRequest {
  sessionId?: string
  text?: string
  audioUrl?: string
  language?: string
  modality: "text" | "voice"
}

export interface QueryResponse {
  sessionId: string
  answer: string
  confidence: number
  sources: Source[]
  suggestions?: string[]
}

export interface EscalateRequest {
  sessionId: string
  message: string
  reason: string
  language: string
  contact?: string
}

export interface Conversation {
  id: string
  sessionId: string
  status: "pending" | "resolved"
  messages: Message[]
  lastActivity: Date
  language: string
}

export interface Document {
  id: string
  name: string
  type: string
  uploadedAt: Date
  size: number
  url?: string
}

export interface KPIData {
  totalQueries: number
  avgConfidence: number
  escalations: number
  activeUsers: number
}
