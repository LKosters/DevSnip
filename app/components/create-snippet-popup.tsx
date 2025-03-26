"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface CreateSnippetPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSnippet: (snippet: {
    name: string;
    language?: string;
    code: string;
  }) => void;
}

export function CreateSnippetPopup({
  isOpen,
  onClose,
  onCreateSnippet,
}: CreateSnippetPopupProps) {
  const [name, setName] = useState("");
  const [language, setLanguage] = useState("");
  const [code, setCode] = useState("");
  const { toast } = useToast();
  const popupRef = useRef<HTMLDivElement>(null);

  const titleCharLimit = 50;

  // Add supported languages array
  const supportedLanguages = [
    "javascript",
    "typescript",
    "python",
    "java",
    "c++",
    "ruby",
    "go",
    "rust",
    "html",
    "css",
    "sql",
    "php",
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && code) {
      onCreateSnippet({ name, language, code });
      setName("");
      setLanguage("");
      setCode("");
      onClose();
      toast({
        title: "Snippet created",
        description: "Your new code snippet has been created successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: "Please fill in the required fields.",
      });
    }
  };

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
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-white"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => {
                    if (e.target.value.length <= titleCharLimit) {
                      setName(e.target.value);
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
              {/* <div className="mb-4">
                <label htmlFor="language" className="block text-sm font-medium text-white">
                  Language
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-[#1C1C1C] mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                >
                  <option value="">Select a language</option>
                  {supportedLanguages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </option>
                  ))}
                </select>
              </div> */}
              <div className="mb-4">
                <label
                  htmlFor="code"
                  className="block text-sm font-medium text-white"
                >
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
                <Button type="submit" className="bg-purple-600 text-white">
                  Create Snippet
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
