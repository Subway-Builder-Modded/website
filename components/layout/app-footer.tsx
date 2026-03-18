"use client"

import { Avatar } from "@/components/ui/avatar"
import { Link } from "@/components/ui/link"
import { AppIcon } from "@/components/common/app-icon"
import { FOOTER_NAV_SECTIONS, FOOTER_SOCIAL_LINKS } from "@/config/navigation/footer"
import { SITE_DESCRIPTION, SITE_NAME, SITE_LOGO_PATH } from "@/config/site/metadata"

export default function AppFooter() {
  return (
    <footer className="bg-sidebar">
      <div className="px-4 py-8">
        <div className="grid gap-10 md:grid-cols-[max-content_1fr] md:gap-x-24 md:items-center">
          <div className="flex flex-col items-start gap-3">
            <div className="flex items-center gap-2 pl-8">
              <Link href="/" className="flex items-center gap-2 font-bold text-foreground transition-colors hover:text-primary">
                <Avatar
                  isSquare
                  size="sm"
                  src={SITE_LOGO_PATH}
                  className="outline-hidden ring-0 shadow-none border-0 [&_*]:ring-0 [&_*]:border-0 [&_*]:shadow-none"
                />
                <span className="font-bold">{SITE_NAME}</span>
              </Link>
            </div>

            <p className="max-w-xs text-sm text-muted-foreground pl-8">{SITE_DESCRIPTION}</p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 md:justify-self-end md:mr-8 md:gap-x-[clamp(2rem,5vw,8rem)]">
            {FOOTER_NAV_SECTIONS.map((section) => {
              const SectionIcon = section.icon

              return (
                <div key={section.id}>
                  <div className="mb-4 flex items-center gap-2">
                    <SectionIcon className="size-5 stroke-[2.25] text-foreground md:size-6" />
                    <h3 className="text-base font-bold text-foreground md:text-lg">{section.title}</h3>
                  </div>

                  <div className="flex flex-col gap-2 text-sm">
                    {section.links.map((link) => {
                      const LinkIcon = link.icon
                      return (
                        <Link key={link.id} href={link.href} className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                          <LinkIcon className="size-4 stroke-[2.25]" />
                          <span>{link.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="my-8 border-t" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground md:pl-8">
            © {SITE_NAME} {new Date().getFullYear()}. Not affiliated with Subway Builder or Redistricter, LLC. All content is community-created and shared under appropriate licenses.
          </p>

          <div className="flex items-center gap-4 md:mr-12">
            {FOOTER_SOCIAL_LINKS.map((social) => (
              <Link
                key={social.id}
                href={social.href}
                aria-label={social.label}
                target="_blank"
                rel="noreferrer"
                className="text-muted-fg hover:text-primary transition-colors"
              >
                <AppIcon icon={{ type: "mask", src: social.iconSrc }} className="size-5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
