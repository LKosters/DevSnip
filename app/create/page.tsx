"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"

export default function CreatePage() {
  const [name, setName] = useState("")
  const [language, setLanguage] = useState("")
  const [code, setCode] = useState("")
  const { toast } = useToast()
  
  const titleCharLimit = 50

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && language && code) {
      // Handle submission
      toast({
        title: "Snippet created",
        description: "Your new code snippet has been created successfully.",
      })
    } else {
      toast({
        title: "Error",
        description: "Please fill in all fields."
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-3xl font-bold mb-6 text-white">Create New Snippet</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => {
              if (e.target.value.length <= titleCharLimit) {
                setName(e.target.value)
              }
            }}
            maxLength={titleCharLimit}
            className="w-full p-2 rounded-md bg-[#292828] text-white border border-gray-600"
            placeholder="Enter snippet name"
          />
          <div className="text-xs text-gray-400 mt-1">
            {name.length}/{titleCharLimit} characters
          </div>
        </div>

        <div>
          <label htmlFor="language" className="block text-sm font-medium text-white mb-2">
            Language
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full p-2 rounded-md bg-[#292828] text-white border border-gray-600"
          >
            <option value="">Select a language</option>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
        </div>

        <div>
          <label htmlFor="code" className="block text-sm font-medium text-white mb-2">
            Code
          </label>
          <textarea
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={8}
            className="w-full p-2 rounded-md bg-[#292828] text-white border border-gray-600 font-mono"
            placeholder="Enter your code here"
          />
        </div>

        <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
          Create Snippet
        </Button>
      </form>
    </motion.div>
  )
}

