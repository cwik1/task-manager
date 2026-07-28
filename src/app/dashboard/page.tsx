import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import TaskList from "@/components/TaskList"

export default async function DashboardPage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Tasks</h1>
            <p className="text-gray-500">Welcome back, {session.user?.email}</p>
          </div>
        </div>
        <TaskList />
      </div>
    </div>
  )
}