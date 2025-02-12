"use client"

import { useState, useEffect } from "react"
import { Copy, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import Prism from "prismjs"
import "prismjs/themes/prism-tomorrow.css"
import "prismjs/plugins/line-numbers/prism-line-numbers.css"
import "prismjs/plugins/line-numbers/prism-line-numbers"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-jsx"
import "prismjs/components/prism-tsx"
import "prismjs/components/prism-css"
import "prismjs/components/prism-json"
import "prismjs/components/prism-python"
import "prismjs/components/prism-sql"
import "prismjs/components/prism-bash"
import "prismjs/components/prism-markdown"
import "prismjs/components/prism-yaml"
import "prismjs/components/prism-java"
import "prismjs/components/prism-c"
import "prismjs/components/prism-cpp"

const fadeInScale = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
}

interface CodeSnippetProps {
  name: string
  language: string
  code: string
}

const languageMap: { [key: string]: string } = {
  'typescript': 'typescript',
  'ts': 'typescript',
  'javascript': 'javascript',
  'js': 'javascript',
  'jsx': 'jsx',
  'tsx': 'tsx',
  'python': 'python',
  'py': 'python',
  'sql': 'sql',
  'json': 'json',
  'css': 'css',
  'bash': 'bash',
  'shell': 'bash',
  'markdown': 'markdown',
  'md': 'markdown',
  'yaml': 'yaml',
  'yml': 'yaml',
  'java': 'java',
  'c': 'c',
  'cpp': 'cpp',
  'c++': 'cpp'
}

export function CodeSnippet({ name, language, code }: CodeSnippetProps) {
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    Prism.highlightAll()
  }, [code])

  const getLanguageClass = (lang: string) => {
    const normalizedLang = lang.toLowerCase()
    return `language-${languageMap[normalizedLang] || 'plaintext'}`
  }

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
    toast({
      title: "Share functionality",
      description: "This would open a share dialog in a real application.",
    })
  }

  return (
    <motion.div
      variants={fadeInScale}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-[#292828] text-white p-6 rounded-lg shadow-md"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{name}</h3>
        <span className="text-sm text-gray-500">{language}</span>
      </div>
      <pre className="line-numbers bg-[#1C1C1C] p-4 rounded mb-4 overflow-x-auto">
        <code className={getLanguageClass(language)}>{code}</code>
      </pre>
      <div className="flex space-x-4 mt-5">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button className="text-black text-lg" variant="outline" size="sm" onClick={copyToClipboard}>
            <Copy className="h-4 w-4 mr-2" />
            {isCopied ? "Copied!" : "Copy"}
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button className="text-black text-lg" variant="outline" size="sm" onClick={shareSnippet}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}

