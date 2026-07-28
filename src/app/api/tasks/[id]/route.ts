import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"

// PATCH update a task
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession()

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const task = await prisma.task.findFirst({
    where: { id: params.id, userId: user.id }
  })

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 })
  }

  const { title, description, dueDate, category, completed } = await req.json()

  const updatedTask = await prisma.task.update({
    where: { id: params.id },
    data: {
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : null,
      category,
      completed
    }
  })

  return NextResponse.json(updatedTask)
}

// DELETE a task
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession()

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const task = await prisma.task.findFirst({
    where: { id: params.id, userId: user.id }
  })

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 })
  }

  await prisma.task.delete({
    where: { id: params.id }
  })

  return NextResponse.json({ message: "Task deleted" })
}