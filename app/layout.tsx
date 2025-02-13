import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import './globals.css'
import { Jost } from "next/font/google"
import { PostHogProvider } from "./components/providers"

const appearance = {
  layout: {
    logoPlacement: "none",
    showOptionalFields: false,
    socialButtonsPlacement: "bottom",
  },
  elements: {
    footer: "hidden",
    footerAction: "hidden",
    rootBox: "w-full",
    card: "shadow-none",
    headerTitle: "text-2xl font-semibold",
    headerSubtitle: "text-muted-foreground",
    socialButtonsIconButton: "hover:bg-muted",
    formButtonPrimary: "bg-primary hover:bg-primary/90",
    formFieldInput: "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    userButtonTrigger: "ring-0 focus:ring-0",
    userButtonPopoverCard: "shadow-none",
    userButtonPopoverFooter: "hidden",
    userButtonPopoverActionButton: "hover:bg-muted", // Removed hidden to show logout button
    userButtonPopoverActionButtonIcon: "", // Removed hidden
    userButtonPopoverText: "", // Removed hidden
    organizationSwitcherTriggerIcon: "hidden",
    organizationPreviewTextContainer: "hidden",
    organizationSwitcherTrigger: "hidden",
    organizationSwitcherTriggerButton: "hidden",
  },
  variables: {
    colorPrimary: '#9333EA',
    borderRadius: '0.5rem',
  },
}

const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata = {
  title: 'DevSnip | Easy Code Sharing',
  description: 'DevSnip is a platform for sharing code snippets with ease.',
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: 'any',
      },
      {
        url: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        url: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      }
    ],
    apple: [
      {
        url: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    other: [
      {
        rel: 'manifest',
        url: '/site.webmanifest',
      }
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PostHogProvider>
      <ClerkProvider appearance={appearance}>
        <html lang="en" className={jost.className}>
          <body>
          {children}
          </body>
        </html>
      </ClerkProvider>
    </PostHogProvider>
  )
}
