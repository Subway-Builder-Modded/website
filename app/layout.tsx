import type { Metadata } from "next"
import "./global.css"
import { ThemeProvider } from "@/components/theme-provider"
import AppNavbar from "@/components/navigation/app-navbar"
import { FooterBars } from "@/components/ui/footer-bars"
import AppFooter from "@/components/layout/app-footer"
import { resolveSiteMetadataBase, SITE_DESCRIPTION, SITE_LOGO_PATH, SITE_NAME } from "@/config/site/metadata"

export const metadata: Metadata = {
  metadataBase: resolveSiteMetadataBase(),
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  openGraph: {
    images: [{ url: SITE_LOGO_PATH }],
  },
  twitter: {
    card: "summary_large_image",
    images: [SITE_LOGO_PATH],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              '(function(){try{var d=document.documentElement;var stored=localStorage.getItem("theme");var theme=stored&&stored!=="system"?stored:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");d.classList.remove("light","dark");d.classList.add(theme);d.style.colorScheme=theme;}catch(_){}})();',
          }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
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
