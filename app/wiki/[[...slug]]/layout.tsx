import type { ReactNode } from "react"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppWikiSidebar } from "@/components/app-sidebar"
import { getSidebarTree } from "@/lib/wiki.server"
import { resolveWikiRoute } from "@/lib/wiki-shared"

export default async function WikiCatchAllLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ slug?: string[] }>
}) {
  const { slug } = await params
  const resolved = resolveWikiRoute(slug)

  if (!resolved) {
    return <section className="w-full px-4 pt-8 pb-12 md:px-6 md:pt-10">{children}</section>
  }

  const tree = await getSidebarTree(resolved.instance, resolved.version)

  return (
    <section className="w-full px-4 pt-8 pb-12 md:px-6 md:pt-10">
      <SidebarProvider
        defaultOpen
        className="relative min-h-[calc(100svh-10rem)] w-full items-stretch"
      >
        <AppWikiSidebar tree={tree} />
        <SidebarInset className="min-h-[calc(100svh-10rem)] md:ml-0">
          <div className="mx-auto w-full max-w-6xl px-5 py-6 md:px-8 md:py-8">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </section>
  )
}
