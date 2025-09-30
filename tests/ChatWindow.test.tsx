import { render, screen } from "@testing-library/react"
import { ChatWindow } from "@/components/chat/chat-window"
import type { Message } from "@/lib/types"

const mockTranslations = {
  today: "Today",
  yesterday: "Yesterday",
  noMessages: "Start a conversation by asking a question!",
  confidence: "Confidence",
  sources: "Sources",
}

describe("ChatWindow", () => {
  it("renders empty state when no messages", () => {
    render(<ChatWindow messages={[]} isLoading={false} translations={mockTranslations} />)

    expect(screen.getByText("Start a conversation by asking a question!")).toBeInTheDocument()
  })

  it("renders messages correctly", () => {
    const messages: Message[] = [
      {
        id: "1",
        role: "user",
        content: "Hello",
        timestamp: new Date(),
      },
      {
        id: "2",
        role: "assistant",
        content: "Hi there!",
        timestamp: new Date(),
        confidence: 95,
      },
    ]

    render(<ChatWindow messages={messages} isLoading={false} translations={mockTranslations} />)

    expect(screen.getByText("Hello")).toBeInTheDocument()
    expect(screen.getByText("Hi there!")).toBeInTheDocument()
  })

  it("shows loading indicator when isLoading is true", () => {
    render(<ChatWindow messages={[]} isLoading={true} translations={mockTranslations} />)

    expect(screen.getByText("Thinking...")).toBeInTheDocument()
  })

  it("displays confidence badge for assistant messages", () => {
    const messages: Message[] = [
      {
        id: "1",
        role: "assistant",
        content: "Test message",
        timestamp: new Date(),
        confidence: 85,
      },
    ]

    render(<ChatWindow messages={messages} isLoading={false} translations={mockTranslations} />)

    expect(screen.getByText("85%")).toBeInTheDocument()
  })

  it("groups messages by date", () => {
    const today = new Date()
    const messages: Message[] = [
      {
        id: "1",
        role: "user",
        content: "Message 1",
        timestamp: today,
      },
      {
        id: "2",
        role: "user",
        content: "Message 2",
        timestamp: today,
      },
    ]

    render(<ChatWindow messages={messages} isLoading={false} translations={mockTranslations} />)

    expect(screen.getByText("Today")).toBeInTheDocument()
  })
})
