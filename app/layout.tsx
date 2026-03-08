import type { Metadata } from "next"
import "./global.css"
import { ThemeProvider } from "@/components/theme-provider"
import AppNavbar from "@/components/app-navbar"
import { FooterBars } from "@/components/ui/footer-bars"
import AppFooter from "@/components/app-footer"

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
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col pt-14">
            <AppNavbar />
            <main className="flex-1">{children}</main>
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
