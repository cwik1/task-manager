"use client"

import { signOut } from "next-auth/react"

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="text-sm bg-gray-100 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-200"
    >
      Sign Out
    </button>
  )
}