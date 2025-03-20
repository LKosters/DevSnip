"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { CodeSnippet } from "@/app/components/code-snippet"
import { useToast } from "@/hooks/use-toast"

interface PageProps {
  params: {
    id: string
  }
}

export default function SnippetPage({ params }: PageProps) {
  const [snippet, setSnippet] = useState<{
    id: string
    name: string
    code: string
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        const snippetDoc = await getDoc(doc(db, "snippets", params.id))
        if (snippetDoc.exists()) {
          setSnippet({
            id: snippetDoc.id,
            ...snippetDoc.data() as { name: string; code: string }
          })
        } else {
          toast({
            title: "Not found",
            description: "The requested snippet could not be found.",
            variant: "destructive"
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load the snippet.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchSnippet()
  }, [params.id, toast])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    )
  }

  if (!snippet) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Snippet not found</h1>
          <p className="text-gray-600">The requested snippet could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CodeSnippet
        id={snippet.id}
        name={snippet.name}
        code={snippet.code}
        onEdit={() => {}}
        onDelete={() => {}}
        viewOnly
      />
    </div>
  )
} 