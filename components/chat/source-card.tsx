import type { Source } from "@/lib/types"
import { ExternalLink, FileText } from "lucide-react"

interface SourceCardProps {
  source: Source
}

export function SourceCard({ source }: SourceCardProps) {
  return (
    <div className="bg-muted/50 rounded-lg p-3 border border-border hover:bg-muted transition-colors">
      <div className="flex items-start gap-2">
        <FileText className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium text-sm line-clamp-1">{source.title}</h4>
            {source.url && (
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 flex-shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
          {source.page && <p className="text-xs text-muted-foreground mt-0.5">Page {source.page}</p>}
          {source.excerpt && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{source.excerpt}</p>}
        </div>
      </div>
    </div>
  )
}
