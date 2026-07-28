"use client"

import { signOut } from "next-auth/react"

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      style={{
        background: "var(--color-bg-task)",
        color: "var(--color-text-subtle)",
        border: "0.5px solid var(--color-border)",
        padding: "6px 12px",
        borderRadius: "var(--radius-control)",
        fontSize: 12,
        cursor: "pointer"
      }}
    >
      Sign out
    </button>
  )
}