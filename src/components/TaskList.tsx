"use client"

import { useState, useEffect } from "react"
import TaskCard from "./TaskCard"
import TaskForm from "./TaskForm"

interface Task {
  id: string
  title: string
  description: string | null
  dueDate: string | null
  completed: boolean
  category: string | null
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [filter, setFilter] = useState("all")
  const [sortBy, setSortBy] = useState("createdAt")

  useEffect(() => {
    fetchTasks()
  }, [])

  async function fetchTasks() {
    const res = await fetch("/api/tasks")
    const data = await res.json()
    setTasks(data)
  }

  async function handleCreate(taskData: Partial<Task>) {
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData)
    })
    setShowForm(false)
    fetchTasks()
  }

  async function handleUpdate(taskData: Partial<Task>) {
    if (!editingTask) return
    await fetch(`/api/tasks/${editingTask.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData)
    })
    setEditingTask(null)
    fetchTasks()
  }

  async function handleDelete(id: string) {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" })
    fetchTasks()
  }

  async function handleToggle(id: string, completed: boolean) {
    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed })
    })
    fetchTasks()
  }

  const filteredTasks = tasks
    .filter(task => {
      if (filter === "active") return !task.completed
      if (filter === "completed") return task.completed
      return true
    })
    .sort((a, b) => {
      if (sortBy === "dueDate") {
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      }
      return 0
    })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-3">
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Tasks</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="createdAt">Sort by Date Created</option>
            <option value="dueDate">Sort by Due Date</option>
          </select>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingTask(null) }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
        >
          + Add Task
        </button>
      </div>

      {(showForm || editingTask) && (
        <TaskForm
          onSubmit={editingTask ? handleUpdate : handleCreate}
          onCancel={() => { setShowForm(false); setEditingTask(null) }}
          editingTask={editingTask}
        />
      )}

      {filteredTasks.length === 0 ? (
        <p className="text-center text-gray-400 py-12">No tasks yet — click Add Task to get started!</p>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={handleDelete}
              onToggle={handleToggle}
              onEdit={setEditingTask}
            />
          ))}
        </div>
      )}
    </div>
  )
}