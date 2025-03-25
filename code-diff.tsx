import type React from "react"

interface DiffLineProps {
  content: string
  type: "normal" | "addition" | "deletion"
  lineNumber?: number
}

const DiffLine: React.FC<DiffLineProps> = ({ content, type, lineNumber }) => {
  const bgColor = type === "addition" ? "bg-green-950/30" : type === "deletion" ? "bg-red-950/30" : "bg-transparent"

  const textColor = type === "addition" ? "text-green-400" : type === "deletion" ? "text-red-400" : "text-gray-300"

  const prefix = type === "addition" ? "+ " : type === "deletion" ? "- " : "  "

  return (
    <div className={`flex ${bgColor} w-full`}>
      {lineNumber !== undefined && <span className="text-gray-500 w-12 text-right pr-4 select-none">{lineNumber}</span>}
      <pre className={`font-mono ${textColor} whitespace-pre overflow-x-auto`}>
        <code>
          {prefix}
          {content}
        </code>
      </pre>
    </div>
  )
}

interface CodeDiffProps {
  oldCode: string[]
  newCode: string[]
  showLineNumbers?: boolean
  title?: string
}

export default function CodeDiff({ oldCode, newCode, showLineNumbers = true, title }: CodeDiffProps) {
  // Simple diff algorithm to match lines
  const diffLines: DiffLineProps[] = []
  let i = 0,
    j = 0

  while (i < oldCode.length || j < newCode.length) {
    // If lines are the same, add as normal
    if (i < oldCode.length && j < newCode.length && oldCode[i] === newCode[j]) {
      diffLines.push({
        content: oldCode[i],
        type: "normal",
        lineNumber: showLineNumbers ? i + 1 : undefined,
      })
      i++
      j++
    }
    // If lines are different, add as deletion and addition
    else {
      // Add deletion line if there's more old code
      if (i < oldCode.length) {
        diffLines.push({
          content: oldCode[i],
          type: "deletion",
          lineNumber: showLineNumbers ? i + 1 : undefined,
        })
        i++
      }

      // Add addition line if there's more new code
      if (j < newCode.length) {
        diffLines.push({
          content: newCode[j],
          type: "addition",
          lineNumber: showLineNumbers ? j + 1 : undefined,
        })
        j++
      }
    }
  }

  return (
    <div className="rounded-lg overflow-hidden border border-gray-700 bg-gray-900 text-white">
      {title && <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 font-mono text-sm">{title}</div>}
      <div className="p-4 overflow-x-auto">
        {diffLines.map((line, index) => (
          <DiffLine key={index} content={line.content} type={line.type} lineNumber={line.lineNumber} />
        ))}
      </div>
    </div>
  )
}

