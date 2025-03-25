"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface DiffViewerProps {
  originalText: string
  modifiedText: string
  originalTitle?: string
  modifiedTitle?: string
  className?: string
}

interface DiffLine {
  content: string
  type: "unchanged" | "added" | "removed"
  lineNumber: number
}

export default function AutoSizingDiffViewer({
  originalText,
  modifiedText,
  originalTitle = "Original",
  modifiedTitle = "Modified",
  className,
}: DiffViewerProps) {
  const [originalLines, setOriginalLines] = useState<DiffLine[]>([])
  const [modifiedLines, setModifiedLines] = useState<DiffLine[]>([])

  useEffect(() => {
    const computeDiff = () => {
      const original = originalText.split("\n")
      const modified = modifiedText.split("\n")

      // Create a map to track which lines are present in both texts
      const commonLines = new Map<string, number>()

      // First pass: mark all lines in original text
      original.forEach((line, index) => {
        if (line.trim() !== "") {
          commonLines.set(line, (commonLines.get(line) || 0) + 1)
        }
      })

      // Second pass: process modified text and identify differences
      const origResult: DiffLine[] = []
      const modResult: DiffLine[] = []

      let origLineNum = 1
      let modLineNum = 1

      // Simple diff algorithm - in a real app you'd use a more sophisticated one like Myers diff
      let i = 0,
        j = 0

      while (i < original.length || j < modified.length) {
        // Both lines exist and are the same
        if (i < original.length && j < modified.length && original[i] === modified[j]) {
          origResult.push({
            content: original[i],
            type: "unchanged",
            lineNumber: origLineNum++,
          })

          modResult.push({
            content: modified[j],
            type: "unchanged",
            lineNumber: modLineNum++,
          })

          i++
          j++
        }
        // Lines are different
        else {
          // Check if current original line was removed
          if (i < original.length && (j >= modified.length || !modified.includes(original[i]))) {
            origResult.push({
              content: original[i],
              type: "removed",
              lineNumber: origLineNum++,
            })
            i++
          }
          // Check if current modified line was added
          else if (j < modified.length && (i >= original.length || !original.includes(modified[j]))) {
            modResult.push({
              content: modified[j],
              type: "added",
              lineNumber: modLineNum++,
            })
            j++
          }
          // Lines are different but present in both texts
          else {
            origResult.push({
              content: original[i],
              type: "removed",
              lineNumber: origLineNum++,
            })

            modResult.push({
              content: modified[j],
              type: "added",
              lineNumber: modLineNum++,
            })

            i++
            j++
          }
        }
      }

      setOriginalLines(origResult)
      setModifiedLines(modResult)
    }

    computeDiff()
  }, [originalText, modifiedText])

  // Ensure both columns have the same number of lines for proper alignment
  const maxLines = Math.max(originalLines.length, modifiedLines.length)
  const paddedOriginalLines = [...originalLines]
  const paddedModifiedLines = [...modifiedLines]

  // Add empty lines to make both columns the same length
  while (paddedOriginalLines.length < maxLines) {
    paddedOriginalLines.push({
      content: "",
      type: "unchanged",
      lineNumber:
        paddedOriginalLines.length > 0 ? paddedOriginalLines[paddedOriginalLines.length - 1].lineNumber + 1 : 1,
    })
  }

  while (paddedModifiedLines.length < maxLines) {
    paddedModifiedLines.push({
      content: "",
      type: "unchanged",
      lineNumber:
        paddedModifiedLines.length > 0 ? paddedModifiedLines[paddedModifiedLines.length - 1].lineNumber + 1 : 1,
    })
  }

  return (
    <div
      className={cn(
        "border rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-md",
        className,
      )}
    >
      {/* Header */}
      <div className="flex border-b dark:border-gray-700">
        <div className="w-1/2 px-4 py-3 font-medium text-sm border-r dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
          {originalTitle}
        </div>
        <div className="w-1/2 px-4 py-3 font-medium text-sm bg-gray-100 dark:bg-gray-800">{modifiedTitle}</div>
      </div>

      {/* Content */}
      <div className="flex">
        {/* Original Text */}
        <div className="w-1/2 border-r dark:border-gray-700">
          {paddedOriginalLines.map((line, idx) => (
            <div
              key={`orig-${idx}`}
              className={cn("flex", line.type === "removed" ? "bg-red-50 dark:bg-red-950/30" : "bg-transparent")}
            >
              <div className="w-10 flex-shrink-0 text-right pr-2 text-gray-500 select-none font-mono text-xs py-1 border-r dark:border-gray-700">
                {line.lineNumber}
              </div>
              <div
                className={cn(
                  "px-3 py-1 font-mono text-xs whitespace-pre-wrap break-all w-full",
                  line.type === "removed" ? "text-red-800 dark:text-red-400" : "text-gray-800 dark:text-gray-300",
                )}
              >
                {line.content || " "}
              </div>
            </div>
          ))}
        </div>

        {/* Modified Text */}
        <div className="w-1/2">
          {paddedModifiedLines.map((line, idx) => (
            <div
              key={`mod-${idx}`}
              className={cn("flex", line.type === "added" ? "bg-green-50 dark:bg-green-950/30" : "bg-transparent")}
            >
              <div className="w-10 flex-shrink-0 text-right pr-2 text-gray-500 select-none font-mono text-xs py-1 border-r dark:border-gray-700">
                {line.lineNumber}
              </div>
              <div
                className={cn(
                  "px-3 py-1 font-mono text-xs whitespace-pre-wrap break-all w-full",
                  line.type === "added" ? "text-green-800 dark:text-green-400" : "text-gray-800 dark:text-gray-300",
                )}
              >
                {line.content || " "}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

