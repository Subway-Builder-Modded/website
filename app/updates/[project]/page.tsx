import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { UpdateStatusBadge } from "@/components/updates/update-status-badge"
import { Card } from "@/components/ui/card"
import { FooterBars } from "@/components/ui/footer-bars"
import {
  UPDATE_PROJECTS,
  getUpdateProjectById,
  type UpdateProjectId,
} from "@/lib/updates-config"
import { getUpdatesForProject } from "@/lib/updates.server"

type ProjectPageProps = {
  params: Promise<{ project: string }>
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { project } = await params
  const projectConfig = getUpdateProjectById(project)

  if (!projectConfig) {
    return { title: "Updates | Subway Builder Modded" }
  }

  return {
    title: `${projectConfig.label} Changelogs | Subway Builder Modded`,
    description: projectConfig.description,
  }
}

export async function generateStaticParams() {
  return UPDATE_PROJECTS.map((project) => ({ project: project.id }))
}

export default async function ProjectUpdatesPage({ params }: ProjectPageProps) {
  const { project } = await params
  const projectConfig = getUpdateProjectById(project)
  if (!projectConfig) notFound()

  const updates = await getUpdatesForProject(project as UpdateProjectId)

  return (
    <main className="px-7 py-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/updates"
          className="mb-6 inline-flex text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          ← Back to updates
        </Link>

        <header className="mb-9 text-center">
          <h1
            className="text-4xl font-black tracking-tight sm:text-5xl"
            style={{ color: projectConfig.base }}
          >
            {projectConfig.label} Changelogs
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Releases are generated automatically from files in <code>content/updates/{projectConfig.id}</code>.
          </p>
        </header>

        <section className="space-y-4">
          {updates.map((update, index) => (
            <Link
              key={update.slug}
              href={`/updates/${projectConfig.id}/${update.slug}`}
              className="block outline-none"
            >
              <Card
                className="flex items-center justify-between gap-4 border p-4 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-white/5"
                style={{
                  borderColor: `${projectConfig.accent}66`,
                  backgroundColor: `${projectConfig.base}12`,
                }}
              >
                <div>
                  <h2
                    className="text-2xl font-extrabold tracking-tight"
                    style={{ color: projectConfig.base }}
                  >
                    {update.frontmatter.title || update.version}
                  </h2>
                  <p className="text-sm text-muted-foreground">{update.frontmatter.date}</p>
                </div>

                <div className="flex items-center gap-2">
                  {index === 0 ? <UpdateStatusBadge tag="latest" /> : null}
                  <UpdateStatusBadge tag={update.frontmatter.tag ?? "release"} />
                </div>
              </Card>
            </Link>
          ))}
        </section>
      </div>

      <FooterBars className="mt-8" />
    </main>
  )
}
