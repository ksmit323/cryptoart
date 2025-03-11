import type React from "react"
import { Toaster } from "@/components/ui/toast"
// import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* <ThemeProvider defaultTheme="dark"> */}
          {children}
          <Toaster />
        {/* </ThemeProvider> */}
      </body>
    </html>
  )
}

