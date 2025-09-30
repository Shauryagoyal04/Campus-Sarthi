import { formatDate, formatTime, getConfidenceColor, getConfidenceBgColor } from "@/lib/utils"

describe("Utils", () => {
  describe("formatDate", () => {
    it("formats date correctly", () => {
      const date = new Date("2024-03-15")
      const formatted = formatDate(date)
      expect(formatted).toMatch(/Mar/)
    })

    it("handles string input", () => {
      const formatted = formatDate("2024-03-15")
      expect(formatted).toMatch(/Mar/)
    })
  })

  describe("formatTime", () => {
    it("formats time correctly", () => {
      const date = new Date("2024-03-15T14:30:00")
      const formatted = formatTime(date)
      expect(formatted).toMatch(/\d{1,2}:\d{2}/)
    })
  })

  describe("getConfidenceColor", () => {
    it("returns success color for high confidence", () => {
      expect(getConfidenceColor(85)).toBe("text-success")
    })

    it("returns warning color for medium confidence", () => {
      expect(getConfidenceColor(65)).toBe("text-warning")
    })

    it("returns destructive color for low confidence", () => {
      expect(getConfidenceColor(45)).toBe("text-destructive")
    })
  })

  describe("getConfidenceBgColor", () => {
    it("returns success background for high confidence", () => {
      expect(getConfidenceBgColor(85)).toBe("bg-success/10")
    })

    it("returns warning background for medium confidence", () => {
      expect(getConfidenceBgColor(65)).toBe("bg-warning/10")
    })

    it("returns destructive background for low confidence", () => {
      expect(getConfidenceBgColor(45)).toBe("bg-destructive/10")
    })
  })
})
