"use client"

import { Globe } from "lucide-react"
import { locales } from "@/lib/i18n"

interface LanguageSelectorProps {
  currentLanguage: string
  onLanguageChange: (lang: string) => void
  languages: Record<string, string>
}

export function LanguageSelector({ currentLanguage, onLanguageChange, languages }: LanguageSelectorProps) {
  return (
    <div className="relative group">
      <button className="p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-colors">
        <Globe className="w-5 h-5" />
      </button>

      <div className="absolute right-0 top-full mt-2 bg-popover border border-border rounded-lg shadow-lg py-1 min-w-[150px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
        {locales.map((locale) => (
          <button
            key={locale}
            onClick={() => onLanguageChange(locale)}
            className={`w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors ${
              currentLanguage === locale ? "bg-accent font-medium" : "text-muted-foreground"
            }`}
          >
            {languages[locale]}
          </button>
        ))}
      </div>
    </div>
  )
}
