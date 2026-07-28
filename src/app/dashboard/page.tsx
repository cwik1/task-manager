import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import TaskList from "@/components/TaskList"
import SignOutButton from "@/components/SignOutButton"

export default async function DashboardPage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-8 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-blue-600">Task Manager</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{session.user?.email}</span>
          <SignOutButton />
        </div>
      </nav>
      <div className="max-w-4xl mx-auto p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">My Tasks</h2>
        <TaskList />
      </div>
    </div>
  )
}