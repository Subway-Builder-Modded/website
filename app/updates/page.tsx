import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Card } from "@/components/ui/card"
import { FooterBars } from "@/components/ui/footer-bars"
import { LineBullet } from "@/components/ui/line-bullet"
import { UPDATE_PROJECTS } from "@/lib/updates-config"

export const metadata: Metadata = {
  title: "Updates & Changelogs | Subway Builder Modded",
  description:
    "Browse release notes and changelogs for Subway Builder Modded projects.",
}

export default function UpdatesHubPage() {
  return (
    <main className="px-7 py-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Updates & Changelogs</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            All Subway Builder Modded project releases in one place.
          </p>
        </header>

        <section className="grid gap-7 md:grid-cols-2">
          {UPDATE_PROJECTS.map((project) => {
            const Icon = project.icon

            return (
              <Link key={project.id} href={project.href} className="block h-full outline-none">
                <Card
                  className="group flex h-full min-h-[22rem] flex-col justify-between border p-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-white/5"
                  style={{
                    backgroundColor: project.base,
                    borderColor: `${project.accent}70`,
                  }}
                >
                  <div>
                    <div className="mb-6">
                      <LineBullet
                        bullet={project.bullet}
                        color={project.mid}
                        textColor={project.accent}
                        size="md"
                      />
                    </div>

                    <div className="mb-5 flex items-center gap-3">
                      <Icon className="size-5" style={{ color: project.accent }} />
                      <h2 className="text-3xl font-black" style={{ color: project.accent }}>
                        {project.label}
                      </h2>
                    </div>

                    <p className="text-base leading-relaxed" style={{ color: `${project.accent}DD` }}>
                      {project.description}
                    </p>
                  </div>

                  <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: project.accent }}>
                    View changelogs
                    <ArrowRight className="size-4" />
                  </div>
                </Card>
              </Link>
            )
          })}
        </section>
      </div>

      <FooterBars className="mt-8" />
    </main>
  )
}
