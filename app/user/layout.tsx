import "../globals.css"
import type { Metadata } from "next"
import { Noto_Sans_Mono } from "next/font/google"
import type React from "react"
import { Sidebar } from "../components/sidebar"
import { ToastProvider, ToastContainer } from "@/components/ui/use-toast"
import { PostHogProvider } from "../components/providers"
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

const notoSansMono = Noto_Sans_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const { userId } = await auth()
  if (!userId) return redirect('/')

  return (
    <html lang="en">
      <body className={notoSansMono.className}>
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

