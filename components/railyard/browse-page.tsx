"use client"

import { useMemo } from "react"
import { SearchX, AlertCircle } from "lucide-react"
import { useRegistry } from "@/hooks/use-registry"
import { useFilteredItems, type TypeFilter } from "@/hooks/use-filtered-items"
import { SearchBar } from "@/components/railyard/search-bar"
import { SidebarFilters } from "@/components/railyard/sidebar-filters"
import { SortSelect } from "@/components/railyard/sort-select"
import { ItemCard } from "@/components/railyard/item-card"
import { CardSkeletonGrid } from "@/components/railyard/card-skeleton-grid"
import { EmptyState } from "@/components/railyard/empty-state"
import { Pagination } from "@/components/railyard/pagination"

interface BrowsePageProps {
  initialType?: TypeFilter
}

export function BrowsePage({ initialType = "all" }: BrowsePageProps) {
  const { mods, maps, loading, error } = useRegistry()

  const allTags = useMemo(() => {
    const modTags = mods.flatMap((m) => m.tags ?? [])
    const mapTags = maps.flatMap((m) => m.tags ?? [])
    return [...new Set([...modTags, ...mapTags])].sort()
  }, [mods, maps])

  const {
    items,
    page,
    totalPages,
    totalResults,
    query,
    type,
    selectedTags,
    sort,
    perPage,
    setQuery,
    setType,
    setSelectedTags,
    setSort,
    setPage,
    setPerPage,
  } = useFilteredItems({ mods, maps, initialType })

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="h-10 w-10 text-destructive mb-3" />
        <h3 className="text-sm font-semibold text-foreground">Failed to load registry</h3>
        <p className="mt-1 text-sm text-muted-foreground max-w-sm">{error}</p>
      </div>
    )
  }

  const modCount = mods.length
  const mapCount = maps.length

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
          {initialType === "mods" ? "Browse Mods" : initialType === "maps" ? "Browse Maps" : "Browse"}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {initialType === "mods"
            ? "Discover and install mods for Subway Builder"
            : initialType === "maps"
            ? "Discover and install community maps for Subway Builder"
            : "Discover and install mods and maps for Subway Builder"}
        </p>
      </div>

      {/* Search bar */}
      <SearchBar query={query} onQueryChange={setQuery} />

      {/* Two-column layout */}
      <div className="flex gap-6 items-start">
        {/* Sidebar */}
        <aside className="w-52 shrink-0 sticky top-20">
          <SidebarFilters
            type={type}
            onTypeChange={setType}
            availableTags={allTags}
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
            modCount={loading ? 0 : modCount}
            mapCount={loading ? 0 : mapCount}
          />
        </aside>

        {/* Main results */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {loading ? (
                <span className="inline-block h-4 w-24 bg-muted rounded animate-pulse" />
              ) : (
                <>
                  <span className="font-medium text-foreground">{totalResults}</span>{" "}
                  result{totalResults !== 1 ? "s" : ""}
                  {query && (
                    <span className="ml-1">
                      for <span className="italic">"{query}"</span>
                    </span>
                  )}
                </>
              )}
            </p>
            <SortSelect value={sort} onChange={setSort} />
          </div>

          {/* Cards / loading / empty */}
          {loading ? (
            <CardSkeletonGrid count={perPage} />
          ) : items.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="No results found"
              description={
                query
                  ? `No items match "${query}"`
                  : "No items match the current filters"
              }
            />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {items.map(({ type: itemType, item }) => (
                  <ItemCard
                    key={`${itemType}-${item.id}`}
                    type={itemType}
                    item={item}
                  />
                ))}
              </div>
              <Pagination
                page={page}
                totalPages={totalPages}
                totalResults={totalResults}
                perPage={perPage}
                onPageChange={setPage}
                onPerPageChange={setPerPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
