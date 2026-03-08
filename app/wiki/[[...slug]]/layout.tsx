import type { ReactNode } from "react"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppWikiSidebar } from "@/components/app-sidebar"
import { resolveWikiRoute } from "@/lib/wiki-shared"
import { getAllWikiDocSlugs, getSidebarTree } from "@/lib/wiki.server"

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
    return <section className="w-full px-4 pb-12 md:px-6">{children}</section>
  }

  const tree = await getSidebarTree(resolved.instance, resolved.version)

  const allSlugs = await getAllWikiDocSlugs()

  const versionDocSlugs = resolved.instance.versioned
    ? Object.fromEntries(
        (resolved.instance.versions ?? []).map((version) => [
          version.value,
          allSlugs
            .filter(
              (parts) =>
                parts[0] === resolved.instance.id && parts[1] === version.value
            )
            .map((parts) => parts.slice(2).join("/") || "home"),
        ])
      )
    : {}

  return (
    <section className="w-full">
      <SidebarProvider defaultOpen className="w-full">
        <AppWikiSidebar tree={tree} versionDocSlugs={versionDocSlugs} />
        <SidebarInset className="min-w-0 flex-1 md:ml-0">
          <div className="w-full px-5 pt-6 pb-16 md:px-8 md:pt-6 md:pb-16 xl:pr-6 2xl:pr-4">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </section>
  )
}
