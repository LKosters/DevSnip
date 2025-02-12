'use client'

import Link from "next/link"
import { Home, User } from "lucide-react"
import { motion } from "framer-motion"

export function Sidebar() {
  return (
    <div className="w-64 h-full shadow-md bg-[#292828] text-white">
      <div className="p-6">
        <Link href="/">
          <div className="flex items-center gap-2 mb-10">
            <span className="text-xl font-bold">DevSnip</span>
            <motion.span
              className="rounded bg-purple-600 px-2 py-0.5 text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              1.0
            </motion.span>
          </div>
        </Link>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link href="/dashboard">
                <motion.div 
                  className="flex items-center space-x-2 p-2 rounded hover:bg-purple-600/20"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Home className="h-5 w-5" />
                  <span>Dashboard</span>
                </motion.div>
              </Link>
            </li>
            <li>
              <Link href="/user">
                <motion.div
                  className="flex items-center space-x-2 p-2 rounded hover:bg-purple-600/20"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <User className="h-5 w-5" />
                  <span>User</span>
                </motion.div>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

