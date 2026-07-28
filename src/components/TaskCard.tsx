"use client"

interface Task {
  id: string
  title: string
  description: string | null
  dueDate: string | null
  completed: boolean
  category: string | null
}

interface TaskCardProps {
  task: Task
  onDelete: (id: string) => void
  onToggle: (id: string, completed: boolean) => void
  onEdit: (task: Task) => void
}

function getDueDateColor(dueDate: string | null, completed: boolean) {
  if (completed || !dueDate) return "var(--color-text-muted)"
  const due = new Date(dueDate)
  const now = new Date()
  const daysUntil = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  if (daysUntil < 0) return "var(--color-danger)"
  if (daysUntil <= 2) return "var(--color-warning)"
  return "var(--color-text-muted)"
}

export default function TaskCard({ task, onDelete, onToggle, onEdit }: TaskCardProps) {
  const dueDateColor = getDueDateColor(task.dueDate, task.completed)

  return (
    <div style={{
      background: "var(--color-bg-task)",
      border: "0.5px solid var(--color-border)",
      borderRadius: "var(--radius-card)",
      padding: "14px 16px",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 12,
      opacity: task.completed ? 0.6 : 1,
      transition: "box-shadow 0.15s"
    }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start", flex: 1 }}>
        <button
          onClick={() => onToggle(task.id, !task.completed)}
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            border: task.completed ? "none" : "1.5px solid var(--color-border)",
            background: task.completed ? "var(--color-primary)" : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
            marginTop: 2,
            color: "white",
            fontSize: 10
          }}
        >
          {task.completed && "✓"}
        </button>

        <div style={{ flex: 1 }}>
          <p style={{
            color: task.completed ? "var(--color-text-muted)" : "var(--color-text-heading)",
            fontWeight: 500,
            fontSize: 14,
            textDecoration: task.completed ? "line-through" : "none",
            margin: "0 0 3px"
          }}>
            {task.title}
          </p>
          {task.description && (
            <p style={{ color: "var(--color-text-subtle)", fontSize: 12, margin: "0 0 6px" }}>
              {task.description}
            </p>
          )}
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            {task.dueDate && (
              <span style={{ color: dueDateColor, fontSize: 11 }}>
                📅 {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
            {task.category && (
              <span style={{
                background: "var(--color-primary-light)",
                color: "var(--color-primary-text)",
                fontSize: 11,
                padding: "2px 8px",
                borderRadius: "var(--radius-pill)"
              }}>
                {task.category}
              </span>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        <button
          onClick={() => onEdit(task)}
          style={{ color: "var(--color-text-muted)", fontSize: 12, background: "none", border: "none", cursor: "pointer", padding: "2px 6px", borderRadius: "var(--radius-control)" }}
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          style={{ color: "var(--color-text-muted)", fontSize: 12, background: "none", border: "none", cursor: "pointer", padding: "2px 6px", borderRadius: "var(--radius-control)" }}
        >
          Delete
        </button>
      </div>
    </div>
  )
}