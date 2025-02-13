"use client"

import type React from "react"
import { useState, useEffect, createContext, useContext } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface ToastProps {
  title: string
  description?: string
  duration?: number
}

interface ToastContextType {
  toast: (props: ToastProps) => void
  toasts: ToastProps[]
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = ({ title, description, duration = 3000 }: ToastProps) => {
    const id = Date.now()
    setToasts((prevToasts) => [...prevToasts, { id, title, description, duration }])
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => Date.now() - toast.id < toast.duration))
    }, 100)

    return () => clearInterval(timer)
  }, [])

  return <ToastContext.Provider value={{ toast, toasts }}>{children}</ToastContext.Provider>
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export function ToastContainer() {
  const { toasts } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence mode="sync">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.5 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30
            }}
            className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 mb-2 max-w-sm"
          >
            <h3 className="font-semibold">{toast.title}</h3>
            {toast.description && <p className="text-sm text-gray-600">{toast.description}</p>}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

