"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import * as TabsPrimitive from "@radix-ui/react-tabs"

type TabItemProps = {
  value: string
  label?: string
  children: React.ReactNode
  default?: boolean
}

type TabsProps = {
  children: React.ReactNode
  defaultValue?: string | null
  groupId?: string
  className?: string
}

const GROUP_STORAGE_PREFIX = "wiki-tabs:"

function getStoredGroupValue(groupId: string) {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(`${GROUP_STORAGE_PREFIX}${groupId}`)
}

function setStoredGroupValue(groupId: string, value: string) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(`${GROUP_STORAGE_PREFIX}${groupId}`, value)
  window.dispatchEvent(
    new CustomEvent("mdx-tab-group-change", {
      detail: { groupId, value },
    })
  )
}

export function Tabs({
  children,
  defaultValue,
  groupId,
  className,
}: TabsProps) {
  const items = React.Children.toArray(children).filter(
    React.isValidElement<TabItemProps>
  ) as React.ReactElement<TabItemProps>[]

  const values = items.map((item) => ({
    value: item.props.value,
    label: item.props.label ?? item.props.value,
    default: item.props.default,
  }))

  const initialValue = React.useMemo(() => {
    if (groupId) {
      const stored = getStoredGroupValue(groupId)
      if (stored && values.some((v) => v.value === stored)) return stored
    }

    if (defaultValue !== undefined) return defaultValue ?? undefined

    const explicitDefault = values.find((v) => v.default)
    if (explicitDefault) return explicitDefault.value

    return values[0]?.value
  }, [defaultValue, groupId, values])

  const [activeValue, setActiveValue] = React.useState<string | undefined>(initialValue)

  React.useEffect(() => {
    if (!groupId) return

    function onGroupChange(event: Event) {
      const customEvent = event as CustomEvent<{ groupId: string; value: string }>
      if (customEvent.detail.groupId !== groupId) return

      const nextValue = customEvent.detail.value
      if (values.some((v) => v.value === nextValue)) {
        setActiveValue(nextValue)
      }
    }

    window.addEventListener("mdx-tab-group-change", onGroupChange)
    return () => window.removeEventListener("mdx-tab-group-change", onGroupChange)
  }, [groupId, values])

  function handleValueChange(value: string) {
    setActiveValue(value)
    if (groupId) setStoredGroupValue(groupId, value)
  }

  return (
    <TabsPrimitive.Root
      value={activeValue}
      onValueChange={handleValueChange}
      className={cn("my-6", className)}
    >
      <TabsPrimitive.List
        className={cn(
          "mb-4 flex w-full items-end gap-6 bg-transparent p-0"
        )}
      >
        {values.map((item) => (
          <TabsPrimitive.Trigger
            key={item.value}
            value={item.value}
            className={cn(
              "relative -mb-px inline-flex items-center rounded-none border-0 bg-transparent px-0 pb-2.5 pt-0",
              "text-[1.15rem] font-semibold tracking-tight",
              "text-muted-foreground",
              "transition-colors duration-150 ease-out",
              "hover:bg-transparent hover:text-foreground/80",
              "focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
              "after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:scale-x-0 after:bg-primary after:transition-transform after:duration-150 after:ease-out after:content-['']",
              "data-[state=active]:text-primary data-[state=active]:after:scale-x-100"
            )}
          >
            {item.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>

      {items.map((item) => (
        <TabsPrimitive.Content
          key={item.props.value}
          value={item.props.value}
          className="mt-0 border-0 bg-transparent p-0 outline-none"
        >
          <div className="[&>p:first-child]:mt-0">
            {item.props.children}
          </div>
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  )
}

export function TabItem({ children }: TabItemProps) {
  return <>{children}</>
}
