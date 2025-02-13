"use client"

import { useState } from "react"
import { CodeSnippet } from "../components/code-snippet"
import { CreateSnippetPopup } from "../components/create-snippet-popup"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { motion } from "framer-motion"

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

// Dummy data for initial code snippets
const initialCodeSnippets = [
  {
    id: 1,
    name: "Hello World in Python",
    language: "Python",
    code: 'print("Hello, World!")',
  },
  {
    id: 2,
    name: "React Function Component",
    language: "JavaScript",
    code: `import React from 'react';

const MyComponent = ({ name }) => {
  return <div>Hello, {name}!</div>;
};

export default MyComponent;`,
  },
  {
    id: 3,
    name: "SQL Select Query",
    language: "SQL",
    code: "SELECT * FROM users WHERE age > 18;",
  },
]

export default function Home() {
  const [codeSnippets, setCodeSnippets] = useState(initialCodeSnippets)
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const handleCreateSnippet = (newSnippet: {
    name: string;
    language: string;
    code: string;
  }) => {
    setCodeSnippets([...codeSnippets, { ...newSnippet, id: Date.now() }])
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">All your code snippets</h1>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button className="text-lg" onClick={() => setIsPopupOpen(true)}>
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
        {codeSnippets.map((snippet) => (
          <div key={snippet.id} className="break-inside-avoid mb-6">
            <CodeSnippet name={snippet.name} language={snippet.language} code={snippet.code} />
          </div>
        ))}
      </motion.div>
      <CreateSnippetPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onCreateSnippet={handleCreateSnippet}
      />
    </div>
  )
}

