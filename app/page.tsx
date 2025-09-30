import type React from "react"
import Link from "next/link"
import { MessageSquare, Shield, Globe, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-balance">
            Campus <span className="text-primary">SARTHI</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty">
            Your multilingual campus assistant, available 24/7
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/chat"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Start Chatting
            </Link>
            <Link
              href="/admin/login"
              className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-accent transition-colors"
            >
              Admin Login
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <FeatureCard
            icon={<MessageSquare className="w-8 h-8" />}
            title="Smart Conversations"
            description="Get instant answers to your campus-related questions"
          />
          <FeatureCard
            icon={<Globe className="w-8 h-8" />}
            title="Multilingual"
            description="Chat in English, Punjabi, Telugu, or Bengali"
          />
          <FeatureCard
            icon={<Zap className="w-8 h-8" />}
            title="Voice Support"
            description="Ask questions using your voice for hands-free interaction"
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8" />}
            title="Reliable Sources"
            description="All answers backed by verified campus documents"
          />
        </div>
      </div>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-card p-6 rounded-lg border border-border">
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground text-pretty">{description}</p>
    </div>
  )
}
