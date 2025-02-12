"use client"

import { useState } from "react"
import { CodeSnippet } from "../components/code-snippet"
import { CreateSnippetPopup } from "../components/create-snippet-popup"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

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

  const handleCreateSnippet = (newSnippet) => {
    setCodeSnippets([...codeSnippets, { ...newSnippet, id: Date.now() }])
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <Button onClick={() => setIsPopupOpen(true)}>
          <PlusCircle className="h-5 w-5 mr-2" />
          Create Snippet
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {codeSnippets.map((snippet) => (
          <CodeSnippet key={snippet.id} name={snippet.name} language={snippet.language} code={snippet.code} />
        ))}
      </div>
      <CreateSnippetPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onCreateSnippet={handleCreateSnippet}
      />
    </div>
  )
}

