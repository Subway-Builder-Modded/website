export type AuthMe = {
  login: string
  avatar_url: string
  html_url: string
}

const rawAuthBaseUrl = process.env.NEXT_PUBLIC_AUTH_BASE_URL ?? ""

export const AUTH_BASE_URL = rawAuthBaseUrl.trim().replace(/\/$/, "")

function normalizeReturnTo(returnTo: string): string {
  if (!returnTo.startsWith("/") || returnTo.startsWith("//")) {
    return "/"
  }

  return returnTo
}

export function getLoginUrl(returnTo = "/"): string {
  const normalizedReturnTo = normalizeReturnTo(returnTo)
  if (!AUTH_BASE_URL) {
    return "#"
  }

  const url = new URL("/auth/login", AUTH_BASE_URL)
  url.searchParams.set("returnTo", normalizedReturnTo)
  return url.toString()
}

export function getLogoutUrl(): string {
  if (!AUTH_BASE_URL) {
    return "#"
  }

  return new URL("/auth/logout", AUTH_BASE_URL).toString()
}

function isAuthMe(value: unknown): value is AuthMe {
  if (!value || typeof value !== "object") {
    return false
  }

  const payload = value as Partial<AuthMe>

  return (
    typeof payload.login === "string"
    && typeof payload.avatar_url === "string"
    && typeof payload.html_url === "string"
  )
}

export async function fetchMe(): Promise<AuthMe | null> {
  if (!AUTH_BASE_URL) {
    return null
  }

  const response = await fetch(new URL("/api/me", AUTH_BASE_URL).toString(), {
    method: "GET",
    credentials: "include",
  })

  if (response.status === 401) {
    return null
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch profile: ${response.status}`)
  }

  const payload = await response.json()
  return isAuthMe(payload) ? payload : null
}
