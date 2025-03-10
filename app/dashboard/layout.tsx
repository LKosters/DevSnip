import "../globals.css"
import type { Metadata } from "next"
import { Jost } from "next/font/google"
import type React from "react"
import { Sidebar } from "../components/sidebar"
import { ToastProvider, ToastContainer } from "@/components/ui/use-toast"
import { PostHogProvider } from "../components/providers"
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "DevSnip | Dashboard",
  description: "Manage and share your code snippets",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const { userId } = await auth()
  if (!userId) return redirect('/')

  return (
    <html lang="en">
      <body className={jost.className}>
        <PostHogProvider>
          <ToastProvider>
            <div className="flex h-screen bg-[#1C1C1C]">
              <Sidebar />
              <main className="flex-1 w-full md:w-0 min-w-0 overflow-y-auto p-8 ml-20 md:ml-0">{children}</main>
            </div>
            <ToastContainer />
          </ToastProvider>
        </PostHogProvider>
      </body>
    </html>
  )
}

