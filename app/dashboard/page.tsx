"use client"

import { useUser } from "@clerk/nextjs";
import { useEffect, useState, useRef, useCallback } from "react";
import { getUserSnippets, createSnippet, type CodeSnippet } from "@/lib/db";
import { CodeSnippet as CodeSnippetComponent } from "../components/code-snippet"
import { CreateSnippetPopup } from "../components/create-snippet-popup"
import { Button } from "@/components/ui/button"
import { PlusCircle, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { EditSnippetPopup } from "../components/edit-snippet-popup"
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

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
  const [loadingMore, setLoadingMore] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [editingSnippet, setEditingSnippet] = useState<{
    id: string
    name: string
    code: string
  } | null>(null)
  
  const observer = useRef<IntersectionObserver | null>(null);
  
  const loadSnippets = useCallback(async (reset = false) => {
    if (!user?.id) return;
    
    try {
      if (reset) {
        setSnippets([]);
        setLastVisible(null);
      }
      
      setLoading(true);
      const result = await getUserSnippets(user.id);
      
      if (result && result.snippets) {
        setSnippets(result.snippets);
        setLastVisible(result.lastVisible);
        setHasMore(result.snippets.length === 4 && result.lastVisible !== null);
      } else {
        setSnippets([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading snippets:", error);
      setSnippets([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const loadMoreSnippets = useCallback(async () => {
    if (!user?.id || !lastVisible || !hasMore || loadingMore) return;
    
    try {
      setLoadingMore(true);
      const result = await getUserSnippets(user.id, 4, lastVisible);
      
      if (result && result.snippets && result.snippets.length > 0) {
        // Always append new snippets to the bottom of the list
        setSnippets(prev => [...prev, ...result.snippets]);
        setLastVisible(result.lastVisible);
        setHasMore(result.snippets.length === 4 && result.lastVisible !== null);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more snippets:", error);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [user?.id, lastVisible, hasMore, loadingMore]);
  
  const lastSnippetRef = useCallback((node: HTMLDivElement | null) => {
    if (loadingMore || !hasMore) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreSnippets();
      }
    }, { threshold: 0.5 });
    
    if (node) observer.current.observe(node);
  }, [loadingMore, hasMore, loadMoreSnippets]);

  useEffect(() => {
    if (user?.id) {
      loadSnippets();
    }
  }, [user?.id, loadSnippets]);

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
      loadSnippets(true);
    } catch (error) {
      console.error("Error creating snippet:", error);
    }
  };

  const refreshSnippets = async () => {
    if (!user?.id) return;
    loadSnippets(true);
  };

  if (loading && snippets.length === 0) {
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
      
      {/* Hidden in production, useful for debugging */}
      {/* <div className="mb-4 text-gray-400 text-sm">
        Loaded {snippets.length} snippets. {hasMore ? 'More available' : 'No more snippets'}
      </div> */}

      {snippets.length === 0 && !loading ? (
        <div className="flex flex-col w-full">
          <div>
            <p className="mt-2 text-gray-400 block">
              Create your first code snippet by clicking the "Create a snippet" button above.
            </p>
          </div>
        </div>
      ) : (
        <motion.div 
          className="columns-1 lg:columns-2 gap-6"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {snippets.map((snippet, index) => (
            <div 
              key={snippet.id} 
              className="break-inside-avoid mb-6"
              ref={index === snippets.length - 1 ? lastSnippetRef : null}
            >
              <CodeSnippetComponent
                id={snippet.id}
                name={snippet.name}
                code={snippet.code}
                viewOnly={false}
                onEdit={() => setEditingSnippet(snippet)}
                onDelete={refreshSnippets}
              />
            </div>
          ))}
        </motion.div>
      )}
      
      {loadingMore && (
        <div className="flex justify-center mt-8 mb-8">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      )}
      
      <CreateSnippetPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onCreateSnippet={(snippet) => handleCreateSnippet({
          ...snippet,
          language: snippet.language || 'javascript'
        })}
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

