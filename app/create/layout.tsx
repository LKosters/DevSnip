import "../globals.css"
import type { Metadata } from "next"
import { Jost } from "next/font/google"
import type React from "react"
import { Sidebar } from "../components/sidebar"
import { ToastProvider, ToastContainer } from "@/components/ui/use-toast"
import { PostHogProvider } from "../components/providers"

const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Create New Snippet",
  description: "Create and share your code snippets",
}

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={jost.className}>
        <PostHogProvider>
          <ToastProvider>
            <div className="flex h-screen bg-[#1C1C1C]">
              <Sidebar />
              <main className="flex-1 overflow-y-auto p-8">{children}</main>
            </div>
            <ToastContainer />
          </ToastProvider>
        </PostHogProvider>
      </body>
    </html>
  )
}
