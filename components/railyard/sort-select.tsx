"use client"

import { useEffect } from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { AssetType } from "@/lib/railyard/asset-types"
import {
  DEFAULT_SORT_STATE,
  getSortOptionsForType,
  SortKey,
  sortKeyToState,
  type SortState,
  sortStateToOptionKey,
} from "@/lib/railyard/constants"

interface SortSelectProps {
  value: SortState
  onChange: (value: SortState) => void
  tab: AssetType
}

export function SortSelect({ value, onChange, tab }: SortSelectProps) {
  const sortOptions = getSortOptionsForType(tab)
  const selectedOptionKey = sortStateToOptionKey(value, tab)

  useEffect(() => {
    if (!sortOptions.some((option) => option.value === selectedOptionKey)) {
      const defaultKey = SortKey.fromState(DEFAULT_SORT_STATE)
      const defaultOption =
        sortOptions.find((option) => SortKey.equals(option.value, defaultKey)) ??
        sortOptions[0]
      if (defaultOption) {
        onChange(defaultOption.sort)
      }
    }
  }, [onChange, selectedOptionKey, sortOptions])

  return (
    <Select value={selectedOptionKey} onValueChange={(value) => onChange(sortKeyToState(value))}>
      <SelectTrigger className="w-36 h-8 text-xs">
        <SelectValue placeholder="Sort by…" />
      </SelectTrigger>
      <SelectContent
        side="bottom"
        sideOffset={4}
        position="popper"
        align="end"
        avoidCollisions={false}
        className="max-h-72 overflow-y-auto"
      >
        {sortOptions.map((option) => (
          <SelectItem key={option.value} value={option.value} className="text-xs">
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
