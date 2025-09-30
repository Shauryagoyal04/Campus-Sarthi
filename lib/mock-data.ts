import type { Conversation, Document, KPIData, Message } from "./types"

export const mockKPIData: KPIData = {
  totalQueries: 1247,
  avgConfidence: 87,
  escalations: 23,
  activeUsers: 156,
}

export const mockDocuments: Document[] = [
  {
    id: "doc-1",
    name: "Student Handbook 2024",
    type: "PDF",
    uploadedAt: new Date("2024-01-15"),
    size: 2457600,
    url: "/documents/handbook.pdf",
  },
  {
    id: "doc-2",
    name: "Course Catalog",
    type: "PDF",
    uploadedAt: new Date("2024-01-20"),
    size: 5242880,
    url: "/documents/catalog.pdf",
  },
  {
    id: "doc-3",
    name: "Campus Map",
    type: "PDF",
    uploadedAt: new Date("2024-02-01"),
    size: 1048576,
    url: "/documents/map.pdf",
  },
  {
    id: "doc-4",
    name: "Academic Calendar",
    type: "PDF",
    uploadedAt: new Date("2024-02-10"),
    size: 524288,
    url: "/documents/calendar.pdf",
  },
  {
    id: "doc-5",
    name: "Library Guidelines",
    type: "DOCX",
    uploadedAt: new Date("2024-02-15"),
    size: 307200,
    url: "/documents/library.docx",
  },
]

const mockMessages: Message[] = [
  {
    id: "msg-1",
    role: "user",
    content: "What are the library hours?",
    timestamp: new Date("2024-03-15T10:30:00"),
  },
  {
    id: "msg-2",
    role: "assistant",
    content: "The library is open Monday-Friday from 8 AM to 10 PM, and Saturday-Sunday from 10 AM to 6 PM.",
    timestamp: new Date("2024-03-15T10:30:15"),
    confidence: 95,
    sources: [
      {
        id: "src-1",
        title: "Library Guidelines",
        page: 2,
        excerpt: "Operating hours: Mon-Fri 8:00-22:00, Sat-Sun 10:00-18:00",
      },
    ],
  },
  {
    id: "msg-3",
    role: "user",
    content: "How do I register for courses?",
    timestamp: new Date("2024-03-15T10:31:00"),
  },
  {
    id: "msg-4",
    role: "assistant",
    content:
      "I'm not entirely sure about the course registration process. Would you like me to connect you with an advisor?",
    timestamp: new Date("2024-03-15T10:31:20"),
    confidence: 45,
  },
]

export const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    sessionId: "session-123",
    status: "pending",
    messages: mockMessages,
    lastActivity: new Date("2024-03-15T10:31:20"),
    language: "en",
  },
  {
    id: "conv-2",
    sessionId: "session-124",
    status: "resolved",
    messages: [
      {
        id: "msg-5",
        role: "user",
        content: "Where is the cafeteria?",
        timestamp: new Date("2024-03-14T14:20:00"),
      },
      {
        id: "msg-6",
        role: "assistant",
        content: "The main cafeteria is located in Building A, first floor.",
        timestamp: new Date("2024-03-14T14:20:10"),
        confidence: 92,
      },
    ],
    lastActivity: new Date("2024-03-14T14:20:10"),
    language: "en",
  },
  {
    id: "conv-3",
    sessionId: "session-125",
    status: "pending",
    messages: [
      {
        id: "msg-7",
        role: "user",
        content: "ਕੀ ਮੈਂ ਆਪਣਾ ਕੋਰਸ ਬਦਲ ਸਕਦਾ ਹਾਂ?",
        timestamp: new Date("2024-03-15T09:15:00"),
      },
      {
        id: "msg-8",
        role: "assistant",
        content: "ਹਾਂ, ਤੁਸੀਂ ਪਹਿਲੇ ਦੋ ਹਫ਼ਤਿਆਂ ਦੇ ਅੰਦਰ ਆਪਣਾ ਕੋਰਸ ਬਦਲ ਸਕਦੇ ਹੋ।",
        timestamp: new Date("2024-03-15T09:15:15"),
        confidence: 78,
      },
    ],
    lastActivity: new Date("2024-03-15T09:15:15"),
    language: "pa",
  },
]

export const mockVolunteerQueue = [
  {
    id: "vol-1",
    question: "What is the process for applying for scholarships?",
    suggestedAnswer: "Students can apply for scholarships through the Financial Aid portal...",
    confidence: 65,
    submittedBy: "user-456",
    submittedAt: new Date("2024-03-15T11:00:00"),
    status: "pending",
  },
  {
    id: "vol-2",
    question: "How do I access the student portal?",
    suggestedAnswer: "Visit portal.campus.edu and use your student ID and password to log in.",
    confidence: 88,
    submittedBy: "user-789",
    submittedAt: new Date("2024-03-15T10:45:00"),
    status: "pending",
  },
]

export const mockChartData = [
  { date: "Mar 1", queries: 45, confidence: 85 },
  { date: "Mar 2", queries: 52, confidence: 87 },
  { date: "Mar 3", queries: 48, confidence: 86 },
  { date: "Mar 4", queries: 61, confidence: 89 },
  { date: "Mar 5", queries: 55, confidence: 88 },
  { date: "Mar 6", queries: 67, confidence: 90 },
  { date: "Mar 7", queries: 58, confidence: 87 },
]
