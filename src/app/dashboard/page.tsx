import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import DashboardClient from "@/components/DashboardClient"
import SignOutButton from "@/components/SignOutButton"

export default async function DashboardPage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg-page)" }}>
      <nav style={{ background: "var(--color-nav-bg)", borderBottom: "0.5px solid var(--color-nav-border)", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: 32, height: 32, background: "var(--color-primary)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 15 }}>D</div>
          <span style={{ color: "var(--color-text-heading)", fontWeight: 600, fontSize: 15 }}>Dunzo Task Manager</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: "var(--color-text-muted)", fontSize: 13 }}>{session.user?.email}</span>
          <SignOutButton />
        </div>
      </nav>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "20px 24px" }}>
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ color: "var(--color-text-heading)", fontSize: 20, fontWeight: 600 }}>My Tasks</h2>
          <p style={{ color: "var(--color-text-muted)", fontSize: 13, marginTop: 2 }}>Stay organized, stay productive.</p>
        </div>
        <div style={{ background: "var(--color-bg-card)", border: "0.5px solid var(--color-border)", borderRadius: "var(--radius-card)", padding: 16 }}>
          <DashboardClient />
        </div>
      </div>
    </div>
  )
}