import { render, screen } from "@testing-library/react"
import { ConfidenceBadge } from "@/components/chat/confidence-badge"

describe("ConfidenceBadge", () => {
  it("renders confidence value", () => {
    render(<ConfidenceBadge confidence={85} />)
    expect(screen.getByText("85%")).toBeInTheDocument()
  })

  it("renders with label when provided", () => {
    render(<ConfidenceBadge confidence={90} label="Confidence" />)
    expect(screen.getByText("Confidence:")).toBeInTheDocument()
    expect(screen.getByText("90%")).toBeInTheDocument()
  })

  it("applies correct color classes for high confidence", () => {
    const { container } = render(<ConfidenceBadge confidence={95} />)
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toContain("text-success")
  })

  it("applies correct color classes for medium confidence", () => {
    const { container } = render(<ConfidenceBadge confidence={70} />)
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toContain("text-warning")
  })

  it("applies correct color classes for low confidence", () => {
    const { container } = render(<ConfidenceBadge confidence={45} />)
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toContain("text-destructive")
  })
})
