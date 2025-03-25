"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"

interface DiffViewerProps {
  originalText: string
  modifiedText: string
  title?: string
  originalTitle?: string
  modifiedTitle?: string
}

interface DiffLine {
  lineNumber: number
  content: string
  type: "unchanged" | "added" | "removed" | "modified"
  correspondingLine?: number
}

export default function SplitDiffViewer({
  originalText,
  modifiedText,
  title = "File Comparison",
  originalTitle = "Original",
  modifiedTitle = "Modified",
}: DiffViewerProps) {
  const [diffData, setDiffData] = useState<{
    originalLines: DiffLine[]
    modifiedLines: DiffLine[]
  }>({
    originalLines: [],
    modifiedLines: [],
  })

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const originalLines = originalText.split("\n")
    const modifiedLines = modifiedText.split("\n")

    // Simple diff algorithm
    const result = computeDiff(originalLines, modifiedLines)
    setDiffData(result)
  }, [originalText, modifiedText])

  const computeDiff = (originalLines: string[], modifiedLines: string[]) => {
    const result: {
      originalLines: DiffLine[]
      modifiedLines: DiffLine[]
    } = {
      originalLines: [],
      modifiedLines: [],
    }

    let origLineNum = 1
    let modLineNum = 1

    // Very simple diff algorithm - in a real app you'd use a more sophisticated one
    let i = 0,
      j = 0

    while (i < originalLines.length || j < modifiedLines.length) {
      // Lines are the same
      if (i < originalLines.length && j < modifiedLines.length && originalLines[i] === modifiedLines[j]) {
        result.originalLines.push({
          lineNumber: origLineNum++,
          content: originalLines[i],
          type: "unchanged",
          correspondingLine: modLineNum,
        })

        result.modifiedLines.push({
          lineNumber: modLineNum++,
          content: modifiedLines[j],
          type: "unchanged",
          correspondingLine: origLineNum - 1,
        })

        i++
        j++
      }
      // Lines are different
      else {
        // Check if it's a removal
        if (i < originalLines.length && (j >= modifiedLines.length || !modifiedLines.includes(originalLines[i]))) {
          result.originalLines.push({
            lineNumber: origLineNum++,
            content: originalLines[i],
            type: "removed",
          })
          i++
        }
        // Check if it's an addition
        else if (j < modifiedLines.length && (i >= originalLines.length || !originalLines.includes(modifiedLines[j]))) {
          result.modifiedLines.push({
            lineNumber: modLineNum++,
            content: modifiedLines[j],
            type: "added",
          })
          j++
        }
        // It's a modification
        else {
          result.originalLines.push({
            lineNumber: origLineNum++,
            content: originalLines[i],
            type: "modified",
            correspondingLine: modLineNum,
          })

          result.modifiedLines.push({
            lineNumber: modLineNum++,
            content: modifiedLines[j],
            type: "modified",
            correspondingLine: origLineNum - 1,
          })

          i++
          j++
        }
      }
    }

    return result
  }

  const toggleSection = (sectionId: string) => {
    setCollapsed((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  // Group lines into sections based on empty lines or section headers
  const getSections = (lines: DiffLine[]) => {
    const sections: { id: string; title: string; lines: DiffLine[]; hasChanges: boolean }[] = []
    let currentSection: DiffLine[] = []
    let currentTitle = ""
    let sectionIndex = 0

    lines.forEach((line, index) => {
      // Start a new section if we encounter a section header or after multiple empty lines
      if (line.content.startsWith("Sub-Section") || line.content.startsWith("SECTION")) {
        if (currentSection.length > 0) {
          const hasChanges = currentSection.some((l) => l.type !== "unchanged")
          sections.push({
            id: `section-${sectionIndex++}`,
            title: currentTitle || "Untitled Section",
            lines: currentSection,
            hasChanges,
          })
        }
        currentSection = [line]
        currentTitle = line.content
      } else {
        currentSection.push(line)
        if (currentTitle === "" && line.content.trim() !== "") {
          currentTitle = line.content
        }
      }
    })

    // Add the last section
    if (currentSection.length > 0) {
      const hasChanges = currentSection.some((l) => l.type !== "unchanged")
      sections.push({
        id: `section-${sectionIndex}`,
        title: currentTitle || "Untitled Section",
        lines: currentSection,
        hasChanges,
      })
    }

    return sections
  }

  const originalSections = getSections(diffData.originalLines)
  const modifiedSections = getSections(diffData.modifiedLines)

  // Combine sections from both sides
  const allSectionIds = new Set([...originalSections.map((s) => s.id), ...modifiedSections.map((s) => s.id)])

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-900 text-white">
      <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 font-mono text-sm">{title}</div>

      <div className="flex border-b border-gray-700">
        <div className="w-1/2 px-4 py-2 font-medium border-r border-gray-700">{originalTitle}</div>
        <div className="w-1/2 px-4 py-2 font-medium">{modifiedTitle}</div>
      </div>

      <div className="flex">
        <div className="w-1/2 border-r border-gray-700">
          {originalSections.map((section) => {
            const isCollapsed = collapsed[section.id]
            return (
              <div key={section.id} className="border-b border-gray-700 last:border-b-0">
                <div
                  className={`flex items-center px-2 py-1 cursor-pointer hover:bg-gray-800 ${section.hasChanges ? "bg-gray-800" : ""}`}
                  onClick={() => toggleSection(section.id)}
                >
                  {isCollapsed ? <ChevronRight className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
                  <span className="font-mono text-xs truncate">{section.title}</span>
                </div>

                {!isCollapsed && (
                  <div>
                    {section.lines.map((line, idx) => (
                      <div
                        key={`orig-${section.id}-${idx}`}
                        className={`flex ${
                          line.type === "removed"
                            ? "bg-red-950/30"
                            : line.type === "modified"
                              ? "bg-yellow-950/30"
                              : "bg-transparent"
                        }`}
                      >
                        <div className="w-10 text-right pr-2 text-gray-500 select-none font-mono text-xs border-r border-gray-700">
                          {line.lineNumber}
                        </div>
                        <pre
                          className={`px-2 py-0.5 font-mono text-xs overflow-x-auto w-full ${
                            line.type === "removed"
                              ? "text-red-400"
                              : line.type === "modified"
                                ? "text-yellow-400"
                                : "text-gray-300"
                          }`}
                        >
                          {line.content}
                        </pre>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="w-1/2">
          {modifiedSections.map((section) => {
            const isCollapsed = collapsed[section.id]
            return (
              <div key={section.id} className="border-b border-gray-700 last:border-b-0">
                <div
                  className={`flex items-center px-2 py-1 cursor-pointer hover:bg-gray-800 ${section.hasChanges ? "bg-gray-800" : ""}`}
                  onClick={() => toggleSection(section.id)}
                >
                  {isCollapsed ? <ChevronRight className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
                  <span className="font-mono text-xs truncate">{section.title}</span>
                </div>

                {!isCollapsed && (
                  <div>
                    {section.lines.map((line, idx) => (
                      <div
                        key={`mod-${section.id}-${idx}`}
                        className={`flex ${
                          line.type === "added"
                            ? "bg-green-950/30"
                            : line.type === "modified"
                              ? "bg-yellow-950/30"
                              : "bg-transparent"
                        }`}
                      >
                        <div className="w-10 text-right pr-2 text-gray-500 select-none font-mono text-xs border-r border-gray-700">
                          {line.lineNumber}
                        </div>
                        <pre
                          className={`px-2 py-0.5 font-mono text-xs overflow-x-auto w-full ${
                            line.type === "added"
                              ? "text-green-400"
                              : line.type === "modified"
                                ? "text-yellow-400"
                                : "text-gray-300"
                          }`}
                        >
                          {line.content}
                        </pre>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

