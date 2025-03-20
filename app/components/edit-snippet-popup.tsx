"use client"

import { useState, useRef, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { db } from "@/lib/firebase"
import { doc, updateDoc, serverTimestamp } from "firebase/firestore"

interface EditSnippetPopupProps {
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
  snippet: {
    id: string
    name: string
    code: string
  }
}

export function EditSnippetPopup({ isOpen, onClose, onUpdate, snippet }: EditSnippetPopupProps) {
  const [name, setName] = useState(snippet.name)
  const [code, setCode] = useState(snippet.code)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const popupRef = useRef<HTMLDivElement>(null)
  
  const titleCharLimit = 50

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await updateDoc(doc(db, "snippets", snippet.id), {
        name,
        code,
        updatedAt: serverTimestamp(),
      })

      toast({
        title: "Success",
        description: "Your snippet has been updated.",
      })
      onUpdate()
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update the snippet. Please try again."
      })
    } finally {
      setIsLoading(false)
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
              <h2 className="text-2xl font-bold">Edit Snippet</h2>
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
                  onChange={(e) => {
                    if (e.target.value.length <= titleCharLimit) {
                      setName(e.target.value)
                    }
                  }}
                  maxLength={titleCharLimit}
                  className="bg-[#1C1C1C] mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                />
                <div className="text-xs text-gray-400 mt-1">
                  {name.length}/{titleCharLimit} characters
                </div>
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
              <div className="flex justify-between space-x-2">
                <Button type="button" variant="outline" onClick={onClose} className="text-white">
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-purple-600 text-white">
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 