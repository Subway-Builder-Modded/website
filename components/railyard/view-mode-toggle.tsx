"use client"

import { Rows3, SquareMenu, TableProperties } from "lucide-react"

import type { SearchViewMode } from "@/lib/railyard/search-view-mode"
import { isSearchViewMode } from "@/lib/railyard/search-view-mode"
import { cn } from "@/lib/utils"

interface ViewModeToggleProps {
  value: SearchViewMode
  onChange: (value: SearchViewMode) => void
}

const options: Array<{ value: SearchViewMode; label: string; icon: typeof SquareMenu }> = [
  { value: "full", label: "Full", icon: SquareMenu },
  { value: "compact", label: "Compact", icon: TableProperties },
  { value: "list", label: "List", icon: Rows3 },
]

export function ViewModeToggle({ value, onChange }: ViewModeToggleProps) {
  return (
    <div className="inline-flex items-center rounded-md border border-input bg-background p-0.5" aria-label="Browse view mode">
      {options.map((option) => {
        const Icon = option.icon
        const selected = value === option.value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              if (isSearchViewMode(option.value)) onChange(option.value)
            }}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-xs transition-colors",
              selected
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
            )}
            aria-label={`${option.label} view`}
            aria-pressed={selected}
          >
            <Icon className="h-4 w-4" />
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
