import { permanentRedirect } from "next/navigation"
import { DOCS_INSTANCES, getDocsInstanceById } from "@/config/content/docs"
import { getAllDocsDocSlugs } from "@/lib/docs/server"
import { buildDocsHubHref } from "@/lib/docs/shared"

export const dynamicParams = false

export async function generateStaticParams() {
  const slugs = await getAllDocsDocSlugs()

  const baseRouteSlugs = DOCS_INSTANCES.flatMap((instance) => {
    if (!instance.versioned) return [[instance.id]]

    const versionRoots = (instance.versions ?? []).flatMap((version) => [
      [instance.id, version.value],
      [instance.id, "latest"],
    ])

    return [[instance.id], ...versionRoots]
  })

  const latestAliasSlugs = DOCS_INSTANCES.flatMap((instance) => {
    if (!instance.versioned) return []

    return slugs
      .filter(
        (parts) =>
          parts[0] === instance.id &&
          parts[1] &&
          instance.versions?.some((version) => version.value === parts[1])
      )
      .map((parts) => [parts[0], "latest", ...parts.slice(2)])
  })

  const allParamKeys = new Set<string>([
    "",
    ...baseRouteSlugs.map((parts) => parts.join("/")),
    ...slugs.map((parts) => parts.join("/")),
    ...latestAliasSlugs.map((parts) => parts.join("/")),
  ])

  return Array.from(allParamKeys).map((key) => ({
    slug: key === "" ? [""] : key.split("/"),
  }))
}

export default async function LegacyDocsRedirectPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const { slug } = await params
  const normalizedSlug = slug?.filter(Boolean)

  if (!normalizedSlug?.length) {
    permanentRedirect(buildDocsHubHref(DOCS_INSTANCES[0]))
  }

  const [instanceId, ...rest] = normalizedSlug
  const instance = getDocsInstanceById(instanceId)

  if (!instance) {
    permanentRedirect(buildDocsHubHref(DOCS_INSTANCES[0]))
  }

  const destination = rest.length
    ? `${instance.basePath}/${rest.join("/")}`
    : instance.basePath

  permanentRedirect(destination)
}
