"use client"

import { useState } from "react"
import { Copy, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface CodeSnippetProps {
  name: string
  language: string
  code: string
}

export function CodeSnippet({ name, language, code }: CodeSnippetProps) {
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setIsCopied(true)
    toast({
      title: "Copied to clipboard",
      description: "The code snippet has been copied to your clipboard.",
    })
    setTimeout(() => setIsCopied(false), 2000)
  }

  const shareSnippet = () => {
    // In a real application, this would open a share dialog or generate a shareable link
    toast({
      title: "Share functionality",
      description: "This would open a share dialog in a real application.",
    })
  }

  return (
    <div className="bg-[#292828] text-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{name}</h3>
        <span className="text-sm text-gray-500">{language}</span>
      </div>
      <pre className="bg-[#1C1C1C] p-4 rounded mb-4 overflow-x-auto">
        <code>{code}</code>
      </pre>
      <div className="flex space-x-2">
        <Button className="text-black text-lg" variant="outline" size="sm" onClick={copyToClipboard}>
          <Copy className="h-4 w-4 mr-2" />
          {isCopied ? "Copied!" : "Copy"}
        </Button>
        <Button className="text-black text-lg" variant="outline" size="sm" onClick={shareSnippet}>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  )
}

