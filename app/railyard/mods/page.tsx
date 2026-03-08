import type { Metadata } from "next"
import { BrowsePage } from "@/components/railyard/browse-page"

export const metadata: Metadata = {
  title: "Browse Mods | Railyard",
  description: "Discover and install community mods for Subway Builder.",
}

export default function ModsPage() {
  return (
    <main className="px-6 py-8 max-w-screen-xl mx-auto">
      <BrowsePage initialType="mods" />
    </main>
  )
}
