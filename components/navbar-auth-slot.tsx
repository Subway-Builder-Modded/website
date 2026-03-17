"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Users } from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import { Link } from "@/components/ui/link"
import { fetchMe, getLoginUrl, type AuthMe } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

type AuthState =
  | { status: "loading" }
  | { status: "logged-out" }
  | { status: "logged-in"; me: AuthMe }

export function NavbarAuthSlot({ className }: { className?: string }) {
  const pathname = usePathname()
  const [authState, setAuthState] = useState<AuthState>({ status: "loading" })

  useEffect(() => {
    let isCancelled = false

    async function loadAuthState() {
      try {
        const me = await fetchMe()

        if (isCancelled) {
          return
        }

        if (!me) {
          setAuthState({ status: "logged-out" })
          return
        }

        setAuthState({ status: "logged-in", me })
      } catch {
        if (!isCancelled) {
          setAuthState({ status: "logged-out" })
        }
      }
    }

    loadAuthState()

    return () => {
      isCancelled = true
    }
  }, [])

  const returnTo = pathname

  if (authState.status === "loading") {
    return <span aria-hidden className={cn("block size-5 rounded-full bg-muted md:size-4", className)} />
  }

  if (authState.status === "logged-out") {
    return (
      <Link
        href={getLoginUrl(returnTo)}
        aria-label="Log in with GitHub"
        className={cn("inline-flex", className)}
      >
        <Users className="size-5 md:size-4" />
      </Link>
    )
  }

  return (
    <span
      role="img"
      aria-label={`Signed in as @${authState.me.login}`}
      className={cn("inline-flex", className)}
    >
      <Avatar src={authState.me.avatar_url} alt="" size="xs" className="outline-hidden" />
    </span>
  )
}
