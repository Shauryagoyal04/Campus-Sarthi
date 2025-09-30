import { ChatWidget } from "@/components/chat/chat-widget"
import en from "@/locales/en.json"

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-background">
      <ChatWidget translations={en} />
    </div>
  )
}
