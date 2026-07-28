"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false
    })

    if (result?.error) {
      setError("Invalid email or password")
      setLoading(false)
    } else {
      router.push("/dashboard")
    }
  }

  const inputStyle = {
    width: "100%",
    border: "0.5px solid var(--color-border)",
    borderRadius: "var(--radius-control)",
    padding: "10px 12px",
    fontSize: 14,
    color: "var(--color-text-heading)",
    background: "var(--color-bg-page)",
    outline: "none"
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg-page)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, background: "var(--color-primary)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "white", fontSize: 22, fontWeight: 500 }}>T</div>
          <h1 style={{ color: "var(--color-text-heading)", fontSize: 22, fontWeight: 500 }}>Task Manager</h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: 14, marginTop: 4 }}>Sign in to your account</p>
        </div>

        <div style={{ background: "var(--color-bg-card)", border: "0.5px solid var(--color-border)", borderRadius: "var(--radius-card)", padding: 32 }}>
          {error && (
            <div style={{ background: "#fef2f2", color: "var(--color-danger)", padding: "10px 12px", borderRadius: "var(--radius-control)", marginBottom: 16, fontSize: 13 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--color-text-subtle)", marginBottom: 6 }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} placeholder="you@example.com" required />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--color-text-subtle)", marginBottom: 6 }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} placeholder="••••••••" required />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", background: "var(--color-primary)", color: "white", border: "none", padding: "10px", borderRadius: "var(--radius-control)", fontSize: 14, fontWeight: 500, cursor: "pointer", opacity: loading ? 0.6 : 1 }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: 13, color: "var(--color-text-muted)", marginTop: 20 }}>
            Don't have an account?{" "}
            <Link href="/register" style={{ color: "var(--color-primary)", textDecoration: "none", fontWeight: 500 }}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}