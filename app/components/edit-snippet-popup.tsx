"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
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
        description: "Failed to update the snippet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Snippet</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Snippet name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Textarea
              placeholder="Paste your code here"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="h-[200px]"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 