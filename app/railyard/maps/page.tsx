import type { Metadata } from "next"
import { BrowsePage } from "@/components/railyard/browse-page"

export const metadata: Metadata = {
  title: "Browse Maps | Railyard",
  description: "Discover and install community maps for Subway Builder.",
}

export default function MapsPage() {
  return (
    <main className="px-6 py-8 max-w-screen-xl mx-auto">
      <BrowsePage initialType="maps" />
    </main>
  )
}
