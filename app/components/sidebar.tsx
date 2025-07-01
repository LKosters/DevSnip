'use client'

import Link from "next/link"
import { Home, User, LogOut, ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { useClerk, UserButton } from "@clerk/nextjs"
import { useRouter, usePathname } from "next/navigation"
import { useState, useEffect } from "react"

export function Sidebar() {
  const { signOut } = useClerk()
  const router = useRouter()
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) {
        setIsCollapsed(true)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  const handleSignOut = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      setIsLoggingOut(false);
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className={`${isCollapsed ? 'w-20' : isMobile ? 'w-56' : 'w-64'} h-full shadow-md bg-[#292828] text-white transition-all duration-300 fixed md:relative z-10`}>
      <div className="p-6">
        <Link href="/">
          <div className="flex items-center gap-2 mb-10">
            {!isCollapsed && <span className="text-xl font-bold">DevSnip</span>}
            {!isCollapsed && (
              <motion.span
                className="rounded bg-purple-600 px-2 py-0.5 text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                2.0
              </motion.span>
            )}
          </div>
        </Link>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link href="/dashboard">
                <motion.div 
                  className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'} p-2 rounded hover:bg-purple-600/20 ${
                    pathname === '/dashboard' ? 'bg-purple-600/20' : ''
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Home className="h-5 w-5" />
                  {!isCollapsed && <span>Dashboard</span>}
                </motion.div>
              </Link>
            </li>
            {/* <li>
              <Link href="/user">
                <motion.div
                  className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'} p-2 rounded hover:bg-purple-600/20 ${
                    pathname === '/user' ? 'bg-purple-600/20' : ''
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <User className="h-5 w-5" />
                  {!isCollapsed && <span>User</span>}
                </motion.div>
              </Link>
            </li> */}
          </ul>
          <div className={`mt-auto pt-2 flex ${isCollapsed ? 'flex-col gap-1' : 'flex-row gap-2'} items-center`}>
            <div className="w-max flex items-center">
              <UserButton afterSignOutUrl="/" />
            </div>
            <motion.button
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'} p-2 rounded hover:bg-purple-600/20 w-full flex-1`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSignOut}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mx-auto" />
              ) : (
                <>
                  <LogOut className="h-5 w-5" />
                  {!isCollapsed && <span>Logout</span>}
                </>
              )}
            </motion.button>
          </div>
        </nav>
      </div>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-6 -right-4 bg-purple-600 rounded-full p-1 hover:bg-purple-700 transition-colors"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </div>
  )
}

