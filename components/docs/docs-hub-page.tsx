import { HubPageHeader } from "@/components/hub/hub-page-header"
import { ProjectHubCard } from "@/components/hub/project-hub-card"
import { DOCS_INSTANCES } from "@/config/content/docs"
import { PROJECT_COLOR_SCHEMES } from "@/config/theme/colors"
import { DOCS_HUB_CONTENT, DOCS_PROJECT_DESCRIPTIONS, PROJECT_PREVIEW_IMAGES } from "@/config/ui/site-content"
import { buildBaseHomeHref } from "@/lib/docs/shared"

export function DocsHubPage() {
  return (
    <section className="relative px-5 pb-12 pt-8 sm:px-8 sm:pt-10">
      <div className="mx-auto w-full max-w-screen-xl">
        <HubPageHeader
          icon={DOCS_HUB_CONTENT.icon}
          title={DOCS_HUB_CONTENT.title}
          description={DOCS_HUB_CONTENT.description}
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {DOCS_INSTANCES.map((instance) => (
            <ProjectHubCard
              key={instance.id}
              href={buildBaseHomeHref(instance)}
              label={instance.label}
              description={DOCS_PROJECT_DESCRIPTIONS[instance.id]}
              icon={instance.icon}
              image={{
                ...PROJECT_PREVIEW_IMAGES[instance.id],
                alt: `${instance.label} documentation preview`,
              }}
              colors={PROJECT_COLOR_SCHEMES[instance.id]}
              eyebrow={DOCS_HUB_CONTENT.eyebrow}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
