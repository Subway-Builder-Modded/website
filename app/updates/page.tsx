import type { Metadata } from "next"
import { UpdatesHubPage } from "@/components/updates/updates-hub-page"

export const metadata: Metadata = {
  title: "Updates & Changelogs | Subway Builder Modded",
  description:
    "Stay up to date with the latest tools and updates from Subway Builder Modded.",
}

export default function UpdatesPage() {
  return <UpdatesHubPage />
}
