import type { Metadata } from "next"
import { Suspense } from "react"
import { BrowsePage } from "@/components/railyard/browse-page"

export const metadata: Metadata = {
  title: "Browse | Railyard",
  description: "Discover and install maps and mods for Subway Builder.",
}

export default function BrowseRoutePage() {
  return (
    <main className="px-6 py-8 max-w-screen-xl mx-auto">
      <Suspense fallback={null}>
        <BrowsePage />
      </Suspense>
    </main>
  )
}
