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

export default function TaskCard({ task, onDelete, onToggle, onEdit }: TaskCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow p-4 border-l-4 ${task.completed ? "border-green-400 opacity-75" : "border-blue-500"}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id, !task.completed)}
            className="mt-1 h-4 w-4 cursor-pointer"
          />
          <div>
            <h3 className={`font-semibold text-gray-800 ${task.completed ? "line-through text-gray-400" : ""}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-gray-500 mt-1">{task.description}</p>
            )}
            <div className="flex gap-3 mt-2">
              {task.dueDate && (
                <span className="text-xs text-gray-400">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}
              {task.category && (
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                  {task.category}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(task)}
            className="text-sm text-blue-500 hover:text-blue-700"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-sm text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}