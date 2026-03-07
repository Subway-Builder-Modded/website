"use client"

import { Avatar } from "@/components/ui/avatar"
import { Link } from "@/components/ui/link"
import {
  MapPin,
  BookText,
  Megaphone,
  Trophy,
  TrainTrack,
  Download,
  Map,
  Unplug,
} from "lucide-react"

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
                  src="/logo.png"
                  className="outline-hidden ring-0 shadow-none border-0 [&_*]:ring-0 [&_*]:border-0 [&_*]:shadow-none"
                />
                <span className="font-bold">Subway Builder Modded</span>
              </Link>
            </div>

            <p className="max-w-xs text-sm text-muted-foreground pl-8">
              The complete hub for everything modded in Subway Builder.
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 md:justify-self-end md:gap-x-[clamp(2rem,5vw,8rem)]">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <MapPin className="size-5 stroke-[2.25] text-foreground md:size-6" />
                <h3 className="text-base font-bold text-foreground md:text-lg">Navigation</h3>
              </div>

              <div className="flex flex-col gap-2 text-sm">
                <Link
                  href="/wiki"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                >
                  <BookText className="size-4 stroke-[2.25]" />
                  <span>Wiki</span>
                </Link>

                <Link
                  href="/updates"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                >
                  <Megaphone className="size-4 stroke-[2.25]" />
                  <span>Updates</span>
                </Link>

                <Link
                  href="/credits"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                >
                  <Trophy className="size-4 stroke-[2.25]" />
                  <span>Credits</span>
                </Link>
              </div>
            </div>

            <div>
              <div className="mb-4 flex items-center gap-2">
                <TrainTrack className="size-5 stroke-[2.25] text-foreground md:size-6" />
                <h3 className="text-base font-bold text-foreground md:text-lg">Railyard</h3>
              </div>

              <div className="flex flex-col gap-2 text-sm">
                <Link
                  href="/railyard"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                >
                  <Download className="size-4 stroke-[2.25]" />
                  <span>Download App</span>
                </Link>

                <Link
                  href="/railyard/maps"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                >
                  <Map className="size-4 stroke-[2.25]" />
                  <span>Browse Maps</span>
                </Link>

                <Link
                  href="/railyard/mods"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                >
                  <Unplug className="size-4 stroke-[2.25]" />
                  <span>Browse Mods</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="my-8 border-t" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © Subway Builder Modded {new Date().getFullYear()}. Not affiliated with Subway Builder or Redistricter, LLC. All content is community-created and shared under appropriate licenses.
          </p>

          <div className="flex items-center gap-4">
            <Link
                href="https://discord.gg/jrNQpbytUQ"
                aria-label="Discord"
                target="_blank"
                rel="noreferrer"
                className="text-muted-fg hover:text-primary transition-colors"
            >
                <span
                className="block size-5 bg-current"
                style={{
                    WebkitMask: "url(/assets/discord.svg) center / contain no-repeat",
                    mask: "url(/assets/discord.svg) center / contain no-repeat",
                }}
                />
            </Link>

            <Link
                href="https://github.com/Subway-Builder-Modded"
                aria-label="GitHub"
                target="_blank"
                rel="noreferrer"
                className="text-muted-fg hover:text-primary transition-colors"
            >
                <span
                className="block size-5 bg-current"
                style={{
                    WebkitMask: "url(/assets/github.svg) center / contain no-repeat",
                    mask: "url(/assets/github.svg) center / contain no-repeat",
                }}
                />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
