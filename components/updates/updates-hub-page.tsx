import { HubPageHeader } from "@/components/hub/hub-page-header"
import { ProjectHubCard } from "@/components/hub/project-hub-card"
import { UPDATE_PROJECTS } from "@/config/content/updates"
import { PROJECT_COLOR_SCHEMES } from "@/config/theme/colors"
import { PROJECT_PREVIEW_IMAGES, UPDATES_HUB_CONTENT } from "@/config/ui/site-content"

export function UpdatesHubPage() {
  return (
    <section className="relative px-5 pb-12 pt-8 sm:px-8 sm:pt-10">
      <div className="mx-auto w-full max-w-screen-xl">
        <HubPageHeader
          icon={UPDATES_HUB_CONTENT.icon}
          title={UPDATES_HUB_CONTENT.title}
          description={UPDATES_HUB_CONTENT.description}
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {UPDATE_PROJECTS.map((project) => (
            <ProjectHubCard
              key={project.id}
              href={project.basePath}
              label={project.label}
              description={project.description}
              icon={project.icon}
              image={{
                ...PROJECT_PREVIEW_IMAGES[project.id],
                alt: `${project.label} updates preview`,
              }}
              colors={PROJECT_COLOR_SCHEMES[project.id]}
              eyebrow={UPDATES_HUB_CONTENT.eyebrow}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
