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

  const completed = tasks.filter(t => t.completed).length
  const total = tasks.length

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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={{ background: "var(--color-bg-page)", border: "0.5px solid var(--color-border)", color: "var(--color-text-subtle)", fontSize: 12, padding: "6px 10px", borderRadius: "var(--radius-control)" }}
          >
            <option value="all">All Tasks</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{ background: "var(--color-bg-page)", border: "0.5px solid var(--color-border)", color: "var(--color-text-subtle)", fontSize: 12, padding: "6px 10px", borderRadius: "var(--radius-control)" }}
          >
            <option value="createdAt">Sort by Date Created</option>
            <option value="dueDate">Sort by Due Date</option>
          </select>
          {total > 0 && (
            <span style={{ color: "var(--color-text-muted)", fontSize: 12 }}>
              {completed} of {total} completed
            </span>
          )}
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingTask(null) }}
          style={{
            background: "var(--color-primary)",
            color: "white",
            border: "none",
            padding: "7px 14px",
            borderRadius: "var(--radius-control)",
            fontSize: 12,
            fontWeight: 500,
            cursor: "pointer"
          }}
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
        <p style={{ textAlign: "center", color: "var(--color-text-muted)", padding: "48px 0", fontSize: 14 }}>
          No tasks yet — click Add Task to get started!
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
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