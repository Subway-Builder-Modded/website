import Link from "next/link"
import { BookText, Megaphone, Package } from "lucide-react"

export default function TemplateModPage() {
  return (
    <section className="relative px-5 pb-12 pt-8 sm:px-8 sm:pt-10">
      <div className="mx-auto w-full max-w-screen-lg rounded-2xl border border-border/70 bg-card p-6 shadow-sm sm:p-8">
        <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-border/70 bg-background px-3 py-2 text-sm font-semibold text-foreground">
          <Package className="size-4" />
          Template Mod
        </div>

        <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">Template Mod</h1>
        <p className="mt-3 text-muted-foreground">
          This is a temporary landing page while the full Template Mod website section is being built.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/template-mod/docs"
            className="inline-flex items-center gap-2 rounded-lg border border-border/70 bg-background px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/50"
          >
            <BookText className="size-4" />
            Docs
          </Link>
          <Link
            href="/template-mod/updates"
            className="inline-flex items-center gap-2 rounded-lg border border-border/70 bg-background px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/50"
          >
            <Megaphone className="size-4" />
            Updates
          </Link>
        </div>
      </div>
    </section>
  )
}
