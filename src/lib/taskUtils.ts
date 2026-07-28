export interface Task {
  id: string
  title: string
  description: string | null
  dueDate: string | null
  completed: boolean
  category: string | null
}

export function filterTasks(tasks: Task[], filter: string): Task[] {
  if (filter === "active") return tasks.filter(t => !t.completed)
  if (filter === "completed") return tasks.filter(t => t.completed)
  return tasks
}

export function sortTasks(tasks: Task[], sortBy: string): Task[] {
  if (sortBy === "dueDate") {
    return [...tasks].sort((a, b) => {
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    })
  }
  return tasks
}

export function isValidTask(title: string): boolean {
  return title.trim().length > 0
}