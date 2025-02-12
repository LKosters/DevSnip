"use client"

import { Jost } from "next/font/google"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Book, Link2, ImageIcon, Zap, Link } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { UserButton, SignInButton, SignUpButton, useUser, SignedOut, SignedIn } from "@clerk/nextjs"

const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const fadeInScale = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
}

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

export default function Home() {
  const featuresRef = useRef(null)
  const codeRef = useRef(null)
  const isInViewFeatures = useInView(featuresRef, { once: true, margin: "-100px" })
  const isInViewCode = useInView(codeRef, { once: true, margin: "-100px" })

  return (
    <div className={`min-h-screen bg-[#1C1C1C] text-white leading-8 ${jost.className}`}>
      {/* Header */}
      <motion.header
        className="container flex items-center justify-between py-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">DevSnip</span>
          <motion.span
            className="rounded bg-purple-600 px-2 py-0.5 text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            1.0
          </motion.span>
        </div>
        <div className="flex gap-6 items-center">
          <div className="flex items-center gap-6">
            <SignedIn>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" className="text-black text-lg">
                    View Snippets
                  </Button>
              </motion.div>
            </SignedIn>
            <UserButton afterSignOutUrl="/" />
            <SignedOut>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <SignInButton mode="modal">
                  <Button variant="outline" className="text-black text-lg">
                    Log in
                  </Button>
                </SignInButton>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <SignUpButton mode="modal">
                  <Button className="text-lg">Register</Button>
                </SignUpButton>
              </motion.div>
            </SignedOut>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        className="container relative py-60 text-center"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="absolute right-60 top-30"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <Zap className="size-14 text-purple-600" />
        </motion.div>
        <div className="mx-auto max-w-3xl">
          <motion.div 
            variants={fadeIn} 
            className="mb-6 inline-block rounded-full bg-purple-600 px-4 py-1 text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            1.0 out now
          </motion.div>
          <motion.h1 variants={fadeIn} className="mb-8 text-6xl font-bold leading-tight">
            Create and share beautiful <span className="text-purple-600">code snippets</span>
          </motion.h1>
          <motion.div className="w-max mx-auto" variants={fadeIn} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="lg" className="text-lg">Get started</Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <div className="bg-[#292828]">
        <motion.section
          ref={featuresRef}
          className="container grid gap-8 py-24 md:grid-cols-3"
          variants={container}
          initial="hidden"
          animate={isInViewFeatures ? "visible" : "hidden"}
      >
        {[
          { icon: Book, title: "Clean snippet overview" },
          { icon: Link2, title: "Easy snippet sharing" },
          { icon: ImageIcon, title: "Export snippets as PNG" },
        ].map((feature, index) => (
          <motion.div
            key={index}
            variants={fadeInScale}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="border-none bg-[#353434] transition-colors hover:bg-[#353434]">
              <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                <feature.icon className="size-20 text-purple-600" />
                <h3 className="text-3xl font-semibold text-white">{feature.title}</h3>
                <p className="text-gray-400 text-white">
                  Lorem ipsum odor amet, consectetur adipiscing elit. Cursus adipiscing egestas nibh a sodales tortor
                  scelerisque.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.section>
      </div>
      {/* Code Preview Section */}
      <div className="bg-[#292828]">
        <motion.section
          ref={codeRef}
          className="container grid gap-20 py-24 md:grid-cols-5"
          initial="hidden"
          animate={isInViewCode ? "visible" : "hidden"}
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: { opacity: 1, x: 0 },
            }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2"
          >
            <h2 className="mb-6 text-4xl font-bold">
              What makes this <span className="text-purple-600">code snippet</span> site special?
            </h2>
            <p className="text-white">
              Lorem ipsum odor amet, consectetur adipiscing elit. Cursus adipiscing egestas nibh a sodales tortor
              scelerisque. Adipiscing nostra dolor pharetra praesent fusce iaculis tristique lacus augue. Tellus varius
              nam vehicula, praesent ut mus.
            </p>
          </motion.div>
          <motion.div
            variants={{
              hidden: { opacity: 0, x: 50 },
              visible: { opacity: 1, x: 0 },
            }}
            transition={{ duration: 0.5 }}
            className="rounded-lg bg-black p-4 md:col-span-3"
          >
            <div className="mb-4 flex gap-2">
              <motion.div className="h-3 w-3 rounded-full bg-red-500" whileHover={{ scale: 1.2 }} />
              <motion.div className="h-3 w-3 rounded-full bg-yellow-500" whileHover={{ scale: 1.2 }} />
              <motion.div className="h-3 w-3 rounded-full bg-green-500" whileHover={{ scale: 1.2 }} />
            </div>
            <pre className="font-mono text-lg">
              <code>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-purple-400"
                >
                  .container
                </motion.span>{" "}
                <span className="text-white">{"{"}</span>
                {"\n"}
                {"  "}
                <span className="text-cyan-400">display</span>
                <span className="text-white">: </span>
                <span className="text-purple-400">flex</span>
                <span className="text-white">;</span>
                {"\n"}
                {"  "}
                <span className="text-cyan-400">justify-content</span>
                <span className="text-white">: </span>
                <span className="text-purple-400">center</span>
                <span className="text-white">;</span>
                {"\n"}
                {"  "}
                <span className="text-cyan-400">align-items</span>
                <span className="text-white">: </span>
                <span className="text-purple-400">center</span>
                <span className="text-white">;</span>
                {"\n"}
                <span className="text-white">{"}"}</span>
              </code>
            </pre>
          </motion.div>
        </motion.section>
      </div>
      {/* CTA Section */}
      <div className="bg-[#1E1E1E]">
        <motion.section
          className="container py-24 flex items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
      >
        <h2 className="text-5xl font-bold">
          Make it easier to share <br />
          <span className="text-purple-600">code snippets</span>
        </h2>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button size="lg" className="text-lg">Get started</Button>
        </motion.div>
      </motion.section>
      </div>

      {/* Footer */}
      <div className="bg-purple-600">
        <motion.footer
          className="py-4 text-lg font-bold container"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Made by Laurens Kosters
        </motion.footer>
      </div>
    </div>
  )
}

