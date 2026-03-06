import type { Metadata } from "next"
import { Geist, Geist_Mono, Inter } from "next/font/google"
import "./global.css"
import { ThemeProvider } from "@/components/theme-provider"
import AppNavbar from "@/components/app-navbar"
import { FooterBars } from "@/components/ui/footer-bars"
import AppFooter from "@/components/app-footer"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Subway Builder Modded",
  description: "The complete hub for everything modded in Subway Builder.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen pt-14">
            <AppNavbar/>
            <main>{children}</main>
            <footer id="site-footer" className="border-t border-border/50 bg-background backdrop-blur-sm">
              <div className="mx-auto flex items-center justify-center">
                <FooterBars />
              </div>
              <AppFooter />
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
