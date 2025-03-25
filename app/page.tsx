"use client"

import { useState } from "react"
import AutoSizingDiffViewer from "@/components/auto-sizing-diff-viewer"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function Home() {
  const [originalText, setOriginalText] = useState(
    `This is a sample text.
It has multiple lines.
Some lines will be removed.
This line stays the same.
Another line that will be modified slightly.
The final line of the original text.`,
  )

  const [modifiedText, setModifiedText] = useState(
    `This is a sample text.
It has multiple lines.
This line stays the same.
Another line that has been modified.
The final line of the original text.
This is a new line added to the text.`,
  )

  return (
    <main className="min-h-screen p-4 md:p-8 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Text Diff Viewer</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Compare two text inputs side by side with highlighted differences. All content is visible without scrolling.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Original Text</label>
            <Textarea
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
              className="h-48 font-mono text-sm"
              placeholder="Enter original text here..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Modified Text</label>
            <Textarea
              value={modifiedText}
              onChange={(e) => setModifiedText(e.target.value)}
              className="h-48 font-mono text-sm"
              placeholder="Enter modified text here..."
            />
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Button
            onClick={() => {
              setOriginalText(
                `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.`,
              )
              setModifiedText(
                `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
This is a completely new line that was added.
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.
Another new line was added here to show the difference.
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.
And one more line at the end.`,
              )
            }}
          >
            Load Example
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              setOriginalText("")
              setModifiedText("")
            }}
          >
            Clear
          </Button>
        </div>

        <div className="pt-4">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Diff Result</h2>
          <AutoSizingDiffViewer
            originalText={originalText}
            modifiedText={modifiedText}
            originalTitle="Original Version"
            modifiedTitle="Modified Version"
          />
        </div>
      </div>
    </main>
  )
}

