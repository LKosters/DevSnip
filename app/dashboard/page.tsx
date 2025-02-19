"use client"

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { getUserSnippets, createSnippet, type CodeSnippet } from "@/lib/db";
import { CodeSnippet as CodeSnippetComponent } from "../components/code-snippet"
import { CreateSnippetPopup } from "../components/create-snippet-popup"
import { Button } from "@/components/ui/button"
import { PlusCircle, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { EditSnippetPopup } from "../components/edit-snippet-popup"

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

export default function Dashboard() {
  const { user } = useUser();
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<{
    id: string
    name: string
    code: string
  } | null>(null)

  useEffect(() => {
    async function loadSnippets() {
      if (user?.id) {
        try {
          const userSnippets = await getUserSnippets(user.id);
          setSnippets(userSnippets);
        } catch (error) {
          console.error("Error loading snippets:", error);
        } finally {
          setLoading(false);
        }
      }
    }

    loadSnippets();
  }, [user?.id]);

  const handleCreateSnippet = async (newSnippet: {
    name: string;
    language: string;
    code: string;
  }) => {
    if (!user?.id) return;

    try {
      await createSnippet({
        userId: user.id,
        ...newSnippet
      });
      
      // Reload snippets after creation
      const updatedSnippets = await getUserSnippets(user.id);
      setSnippets(updatedSnippets);
    } catch (error) {
      console.error("Error creating snippet:", error);
    }
  };

  const refreshSnippets = async () => {
    if (!user?.id) return
    try {
      const userSnippets = await getUserSnippets(user.id)
      setSnippets(userSnippets)
    } catch (error) {
      console.error("Error refreshing snippets:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="lg:flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white mb-5 lg:mb-0">All your code snippets</h1>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button className="text-lg w-full lg:w-auto" onClick={() => setIsPopupOpen(true)}>
            <PlusCircle className="!size-5 mr-2" />
            Create a snippet
          </Button>
        </motion.div>
      </div>
      <motion.div 
        className="columns-1 lg:columns-2 gap-6"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {snippets.map((snippet) => (
          <div key={snippet.id} className="break-inside-avoid mb-6">
            <CodeSnippetComponent
              id={snippet.id}
              name={snippet.name}
              code={snippet.code}
              onEdit={() => setEditingSnippet(snippet)}
              onDelete={refreshSnippets}
            />
          </div>
        ))}
      </motion.div>
      <CreateSnippetPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onCreateSnippet={handleCreateSnippet}
      />

      {editingSnippet && (
        <EditSnippetPopup
          isOpen={!!editingSnippet}
          onClose={() => setEditingSnippet(null)}
          onUpdate={refreshSnippets}
          snippet={editingSnippet}
        />
      )}
    </div>
  )
}

