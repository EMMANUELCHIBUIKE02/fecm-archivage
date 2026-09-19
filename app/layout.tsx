import type { Metadata } from "next"
import "./globals.css"
import SessionProvider from "@/components/layout/SessionProvider"
import { ThemeProvider } from "@/components/providers/ThemeProvider"

export const metadata: Metadata = {
  title: "FECM Archivage",
  description: "Système de gestion d'archives documentaires",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="antialiased">
        <SessionProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}