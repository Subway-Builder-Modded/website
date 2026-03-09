"use client"

import { useEffect, useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { SearchX, AlertCircle } from "lucide-react"
import { useRegistry } from "@/hooks/use-registry"
import { useFilteredItems, type TypeFilter, getSortOptions } from "@/hooks/use-filtered-items"
import { SearchBar } from "@/components/railyard/search-bar"
import { SidebarFilters } from "@/components/railyard/sidebar-filters"
import { SortSelect } from "@/components/railyard/sort-select"
import { ItemCard } from "@/components/railyard/item-card"
import { CardSkeletonGrid } from "@/components/railyard/card-skeleton-grid"
import { EmptyState } from "@/components/railyard/empty-state"
import { Pagination } from "@/components/railyard/pagination"

function normalizeType(value: string | null): TypeFilter {
  if (value === "maps" || value === "mods") return value
  return "all"
}

export function BrowsePage() {
  const { mods, maps, loading, error } = useRegistry()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const initialType = normalizeType(searchParams.get("type"))

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

  const handleTypeChange = (nextType: TypeFilter) => {
    setType(nextType)
    if (nextType === "mods" && sort === "population-desc") {
      setSort("name-asc")
    }
    if (nextType === "maps" && type !== "maps") {
      setSort("population-desc")
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (type === "all") params.delete("type")
    else params.set("type", type)

    const next = params.toString()
    const current = searchParams.toString()
    if (next !== current) {
      router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false })
    }
  }, [pathname, router, searchParams, type])

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
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">Browse</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Discover and install maps and mods for Subway Builder.
        </p>
      </div>

      <SearchBar query={query} onQueryChange={setQuery} />

      <div className="flex gap-6 items-start">
        <aside className="w-52 shrink-0 sticky top-20">
          <SidebarFilters
            type={type}
            onTypeChange={handleTypeChange}
            availableTags={allTags}
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
            modCount={loading ? 0 : modCount}
            mapCount={loading ? 0 : mapCount}
          />
        </aside>

        <div className="flex-1 min-w-0 space-y-4">
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
                      for <span className="italic">&quot;{query}&quot;</span>
                    </span>
                  )}
                </>
              )}
            </p>
            <SortSelect value={sort} onChange={setSort} options={getSortOptions(type)} />
          </div>

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
