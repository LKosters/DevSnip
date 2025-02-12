import "../globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import { Sidebar } from "../components/sidebar"
import { ToastProvider, ToastContainer } from "@/components/ui/use-toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CodeSnippets Dashboard",
  description: "Manage and share your code snippets",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          <div className="flex h-screen bg-[#1C1C1C]">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-8">{children}</main>
          </div>
          <ToastContainer />
        </ToastProvider>
      </body>
    </html>
  )
}

