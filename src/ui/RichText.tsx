import type { ReactNode } from 'react'

// Minimal markup for longer YAML texts: blank lines separate blocks, a "## " line is a heading
// (text may follow directly below it), "- " lines form a list. Keeps legal texts editable
// without a Markdown dependency
export function RichText({ text }: { text: string }) {
  const nodes: ReactNode[] = []
  for (const [i, block] of text
    .trim()
    .split(/\n\s*\n/)
    .entries()) {
    const lines = block.split('\n').map((line) => line.trim())
    if (lines[0]!.startsWith('## ')) {
      nodes.push(
        <h3 key={`${i}h`} className="rich__heading">
          {lines.shift()!.slice(3)}
        </h3>,
      )
    }
    if (lines.length === 0) continue
    if (lines.every((line) => line.startsWith('- '))) {
      nodes.push(
        <ul key={i} className="rich__list">
          {lines.map((line, j) => (
            <li key={j}>{line.slice(2)}</li>
          ))}
        </ul>,
      )
    } else {
      nodes.push(
        <p key={i} className="rich__paragraph">
          {lines.map((line, j) => (
            <span key={j}>
              {j > 0 && <br />}
              {line}
            </span>
          ))}
        </p>,
      )
    }
  }
  return <>{nodes}</>
}
