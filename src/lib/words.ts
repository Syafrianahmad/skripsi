export function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length
}

/** Split after `.`, `!` or `?` followed by whitespace. */
export function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
}
