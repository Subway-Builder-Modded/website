import { Suspense } from "react"
import { ProjectPage } from "@/components/railyard/project-page"

const BASE_URL =
  "https://raw.githubusercontent.com/Subway-Builder-Modded/The-Railyard/main"

export async function generateStaticParams() {
  const res = await fetch(`${BASE_URL}/mods/index.json`)
  const data = await res.json()
  const ids: string[] = data.mods ?? []
  return ids.map((id) => ({ id }))
}

export default async function ModProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <Suspense fallback={null}>
      <ProjectPage type="mods" id={id} />
    </Suspense>
  )
}
