"use client"

import { useState } from "react"
import { LayoutGrid, Package, MapPin, Tag, X, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import type { TypeFilter } from "@/hooks/use-filtered-items"

interface SidebarFiltersProps {
  type: TypeFilter
  onTypeChange: (type: TypeFilter) => void
  availableTags: string[]
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  modCount: number
  mapCount: number
}

const typeOptions: { value: TypeFilter; label: string; icon: typeof LayoutGrid }[] = [
  { value: "all", label: "All", icon: LayoutGrid },
  { value: "mods", label: "Mods", icon: Package },
  { value: "maps", label: "Maps", icon: MapPin },
]

export function SidebarFilters({
  type,
  onTypeChange,
  availableTags,
  selectedTags,
  onTagsChange,
  modCount,
  mapCount,
}: SidebarFiltersProps) {
  const [tagsOpen, setTagsOpen] = useState(false)
  const [tagSearch, setTagSearch] = useState("")

  const counts: Record<TypeFilter, number> = {
    all: modCount + mapCount,
    mods: modCount,
    maps: mapCount,
  }

  const toggleTag = (tag: string) => {
    onTagsChange(
      selectedTags.includes(tag)
        ? selectedTags.filter((t) => t !== tag)
        : [...selectedTags, tag]
    )
  }

  const filteredTags = availableTags.filter((tag) =>
    tag.toLowerCase().includes(tagSearch.toLowerCase())
  )

  return (
    <div className="space-y-5">
      {/* Type filter */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2 px-1">
          Type
        </p>
        <nav className="space-y-0.5" aria-label="Content type filter">
          {typeOptions.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => onTypeChange(value)}
              className={cn(
                "w-full flex items-center justify-between gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                type === value
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
              )}
              aria-current={type === value ? "true" : undefined}
            >
              <span className="flex items-center gap-2">
                <Icon className="h-3.5 w-3.5 shrink-0" />
                {label}
              </span>
              <span
                className={cn(
                  "text-xs tabular-nums",
                  type === value ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {counts[value]}
              </span>
            </button>
          ))}
        </nav>
      </div>

      <Separator />

      {/* Tags filter */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2 px-1">
          Tags
        </p>

        <button
          type="button"
          onClick={() => setTagsOpen((v) => !v)}
          className={cn(
            "w-full flex items-center justify-between gap-2 px-3 py-2 rounded-md border border-input text-sm transition-colors",
            tagsOpen
              ? "bg-accent border-ring"
              : "bg-transparent hover:bg-accent/60"
          )}
          aria-expanded={tagsOpen}
        >
          <span className="flex items-center gap-2 text-muted-foreground">
            <Tag className="h-3.5 w-3.5 shrink-0" />
            {selectedTags.length > 0 ? `${selectedTags.length} selected` : "Filter by tag"}
          </span>
          {selectedTags.length > 0 && (
            <Badge variant="secondary" className="h-4 px-1.5 text-xs min-h-0">
              {selectedTags.length}
            </Badge>
          )}
        </button>

        {tagsOpen && (
          <div className="mt-1.5 border border-border rounded-md bg-card overflow-hidden">
            <div className="p-2 border-b border-border">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search tags…"
                  value={tagSearch}
                  onChange={(e) => setTagSearch(e.target.value)}
                  className="w-full pl-8 pr-2 py-1 text-xs bg-transparent outline-none placeholder:text-muted-foreground"
                  aria-label="Search tags"
                />
              </div>
            </div>
            <div className="max-h-48 overflow-y-auto p-1">
              {filteredTags.length === 0 ? (
                <p className="px-2 py-3 text-xs text-muted-foreground text-center">No tags found</p>
              ) : (
                filteredTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm hover:bg-accent transition-colors text-left"
                  >
                    <Checkbox
                      checked={selectedTags.includes(tag)}
                      aria-hidden="true"
                      tabIndex={-1}
                    />
                    <span className="text-xs">{tag}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Active tag chips */}
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {selectedTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full hover:bg-secondary/80 transition-colors"
              >
                {tag}
                <X className="h-2.5 w-2.5" aria-label={`Remove ${tag}`} />
              </button>
            ))}
            <button
              type="button"
              onClick={() => onTagsChange([])}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
