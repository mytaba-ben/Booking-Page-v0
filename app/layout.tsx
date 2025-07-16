import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Truvay - Book Your Night Out",
  description: "Experience Seattle nightlife with Truvay - your personalized night out booking service",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-gray-50 to-gray-100 font-future-lt">{children}</body>
    </html>
  )
}
