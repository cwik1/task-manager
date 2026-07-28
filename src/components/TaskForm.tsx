"use client"

import { useState, useEffect } from "react"

interface Task {
  id: string
  title: string
  description: string | null
  dueDate: string | null
  completed: boolean
  category: string | null
}

interface TaskFormProps {
  onSubmit: (task: Partial<Task>) => void
  onCancel: () => void
  editingTask?: Task | null
}

export default function TaskForm({ onSubmit, onCancel, editingTask }: TaskFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [category, setCategory] = useState("")

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title)
      setDescription(editingTask.description || "")
      setDueDate(editingTask.dueDate ? editingTask.dueDate.split("T")[0] : "")
      setCategory(editingTask.category || "")
    }
  }, [editingTask])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({ title, description, dueDate, category })
    setTitle("")
    setDescription("")
    setDueDate("")
    setCategory("")
  }

  const inputStyle = {
    width: "100%",
    border: "0.5px solid var(--color-border)",
    borderRadius: "var(--radius-control)",
    padding: "8px 12px",
    fontSize: 13,
    color: "var(--color-text-heading)",
    background: "var(--color-bg-page)",
    outline: "none"
  }

  const labelStyle = {
    display: "block",
    fontSize: 12,
    fontWeight: 500,
    color: "var(--color-text-subtle)",
    marginBottom: 4
  }

  return (
    <div style={{
      background: "var(--color-bg-page)",
      border: "0.5px solid var(--color-border)",
      borderRadius: "var(--radius-card)",
      padding: 20,
      marginBottom: 16
    }}>
      <h2 style={{ color: "var(--color-text-heading)", fontSize: 15, fontWeight: 500, marginBottom: 16 }}>
        {editingTask ? "Edit task" : "Add new task"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label style={labelStyle}>Title *</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={inputStyle}
            required
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={labelStyle}>Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            style={{ ...inputStyle, resize: "vertical" }}
            rows={3}
          />
        </div>
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Due date</label>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Category</label>
            <input
              type="text"
              value={category}
              onChange={e => setCategory(e.target.value)}
              placeholder="e.g. Work, Personal"
              style={inputStyle}
            />
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="submit"
            style={{
              background: "var(--color-primary)",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "var(--radius-control)",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer"
            }}
          >
            {editingTask ? "Save changes" : "Add task"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: "var(--color-bg-card)",
              color: "var(--color-text-subtle)",
              border: "0.5px solid var(--color-border)",
              padding: "8px 16px",
              borderRadius: "var(--radius-control)",
              fontSize: 13,
              cursor: "pointer"
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}