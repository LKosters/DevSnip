"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"

interface CreateSnippetPopupProps {
  isOpen: boolean
  onClose: () => void
  onCreateSnippet: (snippet: { name: string; language: string; code: string }) => void
}

export function CreateSnippetPopup({ isOpen, onClose, onCreateSnippet }: CreateSnippetPopupProps) {
  const [name, setName] = useState("")
  const [language, setLanguage] = useState("")
  const [code, setCode] = useState("")
  const { toast } = useToast()
  const popupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && language && code) {
      onCreateSnippet({ name, language, code })
      setName("")
      setLanguage("")
      setCode("")
      onClose()
      toast({
        title: "Snippet created",
        description: "Your new code snippet has been created successfully.",
      })
    } else {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        status: "error"
      })
    }
  }

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-white"
        >
          <motion.div
            ref={popupRef}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-[#292828] rounded-lg p-8 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Create New Snippet</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-white">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-[#1C1C1C] mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="language" className="block text-sm font-medium text-white">
                  Language
                </label>
                <input
                  type="text"
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-[#1C1C1C] mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="code" className="block text-sm font-medium text-white">
                  Code
                </label>
                <textarea
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  rows={5}
                  className="bg-[#1C1C1C] mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                ></textarea>
              </div>
              <div className="flex">
                <Button type="submit" className="bg-purple-600 text-white">Create Snippet</Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

