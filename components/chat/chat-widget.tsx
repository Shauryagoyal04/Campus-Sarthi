"use client"

import { useState } from "react"
import { X, Minimize2, MessageSquare, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ChatWindow } from "./chat-window"
import { InputBar } from "./input-bar"
import { EscalateModal } from "./escalate-modal"
import { LanguageSelector } from "./language-selector"
import { useChat } from "@/hooks/use-chat"
import { setPreferredLanguage, getPreferredLanguage } from "@/lib/storage"

interface ChatWidgetProps {
  translations: any
  initialLanguage?: string
}

export function ChatWidget({ translations, initialLanguage }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [language, setLanguage] = useState(initialLanguage || getPreferredLanguage())
  const [showEscalateModal, setShowEscalateModal] = useState(false)

  const { messages, isLoading, sendMessage } = useChat(language)

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang)
    setPreferredLanguage(newLang)
  }

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center z-50"
          >
            <MessageSquare className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-[400px] h-[600px] bg-background border border-border rounded-lg shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{translations.chat.title}</h3>
                  <p className="text-xs opacity-90">{translations.chat.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <LanguageSelector
                  currentLanguage={language}
                  onLanguageChange={handleLanguageChange}
                  languages={translations.languages}
                />
                <button
                  onClick={() => setShowEscalateModal(true)}
                  className="p-2 rounded-full hover:bg-primary-foreground/10 transition-colors"
                  title={translations.chat.escalate}
                >
                  <User className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 rounded-full hover:bg-primary-foreground/10 transition-colors"
                >
                  <Minimize2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-primary-foreground/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            {!isMinimized && (
              <>
                <ChatWindow messages={messages} isLoading={isLoading} translations={translations.chat} />
                <InputBar
                  onSendMessage={sendMessage}
                  disabled={isLoading}
                  placeholder={translations.chat.placeholder}
                  language={language}
                  enableVoice={process.env.NEXT_PUBLIC_ENABLE_VOICE === "true"}
                  enableFileUpload={process.env.NEXT_PUBLIC_ENABLE_FILE_UPLOAD === "true"}
                />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Escalate Modal */}
      <EscalateModal
        isOpen={showEscalateModal}
        onClose={() => setShowEscalateModal(false)}
        language={language}
        translations={{
          title: translations.escalate.title,
          description: translations.escalate.description,
          reason: translations.escalate.reason,
          reasonPlaceholder: translations.escalate.reasonPlaceholder,
          contact: translations.escalate.contact,
          contactPlaceholder: translations.escalate.contactPlaceholder,
          submit: translations.escalate.submit,
          cancel: translations.common.cancel,
          success: translations.escalate.success,
          error: translations.escalate.error,
        }}
      />
    </>
  )
}
