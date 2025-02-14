"use client"

import { useState, useEffect } from "react"
import { Copy, Share2, Pencil, Trash2 } from "lucide-react"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { db } from "@/lib/firebase"
import { doc, deleteDoc } from "firebase/firestore"

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
  id: string
  name: string
  code: string
  onEdit: () => void
  onDelete: () => void
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

export function CodeSnippet({ id, name, code, onEdit, onDelete }: CodeSnippetProps) {
  const [isCopied, setIsCopied] = useState(false)
  const [detectedLanguage, setDetectedLanguage] = useState('plaintext')
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const detectLanguage = () => {
      const codeContent = code.trim()
      
      // Check for common JS/TS patterns
      const jsPatterns = [
        'import', 'export', 'const', 'let', 'var', 'function',
        '=>', 'class', 'extends', 'return', 'async', 'await',
        'console.log', 'document.', 'window.', 'new ', 'this.',
        'undefined', 'null', 'true', 'false', 'setTimeout',
        'Promise', '.then', '.catch', '.map', '.filter', '.reduce'
      ]
      const tsPatterns = ['interface', 'type', 'namespace', 'enum', '<string>', '<number>', '<boolean>']
      
      // Check for common method calls with dot notation
      if (/\w+\.\w+\(.*\)/.test(codeContent)) {
        return 'javascript'
      }
      
      // Check for TypeScript-specific syntax
      if (tsPatterns.some(pattern => codeContent.includes(pattern))) {
        return 'typescript'
      }
      
      // Check for JavaScript patterns
      if (jsPatterns.some(pattern => codeContent.includes(pattern))) {
        return 'javascript'
      }
      
      // If there are parentheses, brackets, or semicolons, likely JavaScript
      if (/[();{}]/.test(codeContent)) {
        return 'javascript'
      }
      
      // Other language checks...
      if (codeContent.startsWith('<?php')) return 'php'
      if (codeContent.includes('def ') || codeContent.includes('import ')) return 'python'
      if (codeContent.startsWith('package ')) return 'java'
      if (codeContent.startsWith('#include')) return 'cpp'
      if (/^(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP)\s/i.test(codeContent)) return 'sql'
      
      // Check for JSON
      if (codeContent.startsWith('{') || codeContent.startsWith('[')) {
        try {
          JSON.parse(codeContent)
          return 'json'
        } catch {}
      }
      
      // Check for shell scripts
      if (codeContent.startsWith('#!') || codeContent.startsWith('$')) return 'bash'
      
      // Check for Markdown
      if (codeContent.includes('```') || /^#\s/.test(codeContent)) return 'markdown'
      
      return 'javascript' // Default to JavaScript if we detect any code-like syntax
    }

    const detected = detectLanguage()
    setDetectedLanguage(detected)
    
    // Wait for next tick to ensure DOM is updated
    setTimeout(() => {
      Prism.highlightAll()
    }, 0)
  }, [code])

  const getLanguageClass = (lang: string) => {
    const normalizedLang = lang.toLowerCase()
    return `language-${languageMap[normalizedLang] || 'javascript'}`
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

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "snippets", id))
      toast({
        title: "Snippet deleted",
        description: "The code snippet has been successfully deleted.",
      })
      onDelete()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the snippet. Please try again.",
      })
    }
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
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="text-gray-400 hover:text-white"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
            className="text-gray-400 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <pre className="line-numbers bg-[#1C1C1C] p-4 rounded mb-4 overflow-x-auto">
        <code className={getLanguageClass(detectedLanguage)}>{code}</code>
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your code snippet.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
}

