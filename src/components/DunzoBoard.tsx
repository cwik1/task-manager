"use client"

import { useState, useEffect, useRef } from "react"
import confetti from "canvas-confetti"

interface Task {
  id: string
  title: string
  description: string | null
  dueDate: string | null
  completed: boolean
  category: string | null
}

const FREE_INDEX = 12
const MAX_TASKS = 24 // 25 squares minus the free space

const FUNNY_TASKS = [
  "Wash exactly 1 dish",
  "Put on your gym clothes (workout optional)",
  "Make the bed — pillows count",
  "Take out one piece of trash",
  "Drink a full glass of water",
  "Put your shoes where they belong",
  "Wipe down one surface",
  "Reply to one text you've been ignoring",
  "Eat something green",
  "Go outside for 60 seconds",
  "Do 5 jumping jacks",
  "Close 5 browser tabs",
  "Delete 10 photos you don't need",
  "Put on real pants",
  "Wash your face",
  "Take your vitamins",
  "Write down one thing to do today",
  "Cook something, even if it's toast",
  "Sit up straight for 2 minutes",
  "Text one friend you owe a reply",
  "Check your bank balance",
  "Put something back where it belongs",
  "Eat breakfast before noon",
  "Do nothing for 5 full minutes",
  "Stretch for 30 seconds",
  "Stand up and refill your water",
  "Send one genuinely nice text",
  "Go to bed before midnight",
  "Say something nice to yourself out loud",
  "Take a 10-minute walk",
  "Open a window for fresh air",
  "Listen to one full song",
  "Write tomorrow's top 3 tasks",
  "Brush your teeth (the second time today)",
  "Respond to one email",
  "Throw away something expired",
  "Fold one item of laundry",
  "Charge your devices before they die",
  "Drink water before your first coffee",
  "Take 3 deep breaths on purpose",
]

const LINES = [
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],
  [0, 5, 10, 15, 20],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24],
  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20],
]

export default function DunzoBoard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [taskOrder, setTaskOrder] = useState<string[]>([])
  const prevDunzoCount = useRef(0)
  const prevFullDunzo = useRef(false)
  const [flash, setFlash] = useState(false)
  const [filling, setFilling] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [shuffling, setShuffling] = useState(false)
  const [bouncingCell, setBouncingCell] = useState<number | null>(null)

  useEffect(() => {
    fetchTasks()
  }, [])

  async function fetchTasks() {
    const res = await fetch("/api/tasks")
    const data: Task[] = await res.json()
    setTasks(data)
    // Maintain display order: keep existing order, add new tasks at end, drop deleted ones
    setTaskOrder(prev => {
      const taskIds = new Set(data.map(t => t.id))
      const kept = prev.filter(id => taskIds.has(id))
      const added = data.filter(t => !prev.includes(t.id)).map(t => t.id)
      return [...kept, ...added]
    })
  }

  function handleShuffle() {
    if (shuffling || taskOrder.length === 0) return
    setShuffling(true)

    // Delays: fast at first, slow at end (slot machine feel)
    const delays = [60, 80, 110, 150, 200, 270, 360, 460]
    const finalOrder = [...taskOrder].sort(() => Math.random() - 0.5)

    let elapsed = 0
    delays.forEach((delay, step) => {
      elapsed += delay
      setTimeout(() => {
        const isLast = step === delays.length - 1
        setTaskOrder(isLast ? finalOrder : [...taskOrder].sort(() => Math.random() - 0.5))
        if (isLast) setShuffling(false)
      }, elapsed)
    })
  }

  async function handleFillBoard() {
    const needed = MAX_TASKS - tasks.length
    if (needed <= 0) return
    setFilling(true)
    // Shuffle and pick enough funny tasks
    const shuffled = [...FUNNY_TASKS].sort(() => Math.random() - 0.5)
    const picks = shuffled.slice(0, needed)
    await Promise.all(
      picks.map(title =>
        fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description: null, dueDate: null, category: "fun" }),
        })
      )
    )
    await fetchTasks()
    setFilling(false)
  }

  async function handleResetBoard() {
    setResetting(true)
    await Promise.all(
      tasks.map(task =>
        fetch(`/api/tasks/${task.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completed: false }),
        })
      )
    )
    await fetchTasks()
    setResetting(false)
  }

  async function handleRemoveFun() {
    setRemoving(true)
    const funTasks = tasks.filter(t => t.category === "fun")
    await Promise.all(
      funTasks.map(task =>
        fetch(`/api/tasks/${task.id}`, { method: "DELETE" })
      )
    )
    await fetchTasks()
    setRemoving(false)
  }

  async function handleToggle(id: string, completed: boolean, cellIndex: number) {
    // Bounce the cell
    setBouncingCell(cellIndex)
    setTimeout(() => setBouncingCell(null), 350)

    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed }),
    })
    await fetchTasks()
  }

  // Build 25-cell grid — slot 12 is FREE
  const taskById = Object.fromEntries(tasks.map(t => [t.id, t]))
  const orderedTasks = taskOrder.map(id => taskById[id]).filter(Boolean) as Task[]
  const taskSlots = Array.from({ length: 25 }, (_, i) => i).filter(i => i !== FREE_INDEX)
  const grid: (Task | null | "FREE")[] = Array(25).fill(null)
  grid[FREE_INDEX] = "FREE"
  orderedTasks.forEach((task, i) => {
    if (i < taskSlots.length) grid[taskSlots[i]] = task
  })

  function isMarked(index: number): boolean {
    if (index === FREE_INDEX) return true
    const cell = grid[index]
    if (!cell || cell === "FREE") return false
    return (cell as Task).completed
  }

  const dunzoLines = LINES.filter(line => line.every(i => isMarked(i)))
  const isFullDunzo = Array.from({ length: 25 }, (_, i) => i).every(i => isMarked(i))

  // Confetti + flash when a new DUNZO line appears or FULL DUNZO
  useEffect(() => {
    if (isFullDunzo && !prevFullDunzo.current) {
      // Big celebration for FULL DUNZO
      confetti({ particleCount: 200, spread: 120, origin: { y: 0.5 } })
      setTimeout(() => confetti({ particleCount: 100, spread: 80, origin: { x: 0.1, y: 0.6 } }), 300)
      setTimeout(() => confetti({ particleCount: 100, spread: 80, origin: { x: 0.9, y: 0.6 } }), 500)
    } else if (dunzoLines.length > prevDunzoCount.current) {
      // Standard DUNZO line celebration
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } })
      setFlash(true)
      setTimeout(() => setFlash(false), 600)
    }
    prevDunzoCount.current = dunzoLines.length
    prevFullDunzo.current = isFullDunzo
  }, [dunzoLines.length, isFullDunzo])

  const highlightedCells = new Set(dunzoLines.flat())

  return (
    <div>
      {/* Celebration banner */}
      {isFullDunzo ? (
        <div style={{
          textAlign: "center",
          marginBottom: 20,
          padding: "18px 24px",
          background: "var(--color-primary)",
          borderRadius: "var(--radius-card)",
          color: "white",
          animation: "pulse 1s ease-in-out infinite",
        }}>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: 2 }}>👑 FULL DUNZO! 👑</div>
          <div style={{ fontSize: 13, opacity: 0.9, marginTop: 4 }}>Every square complete. You are a legend.</div>
        </div>
      ) : dunzoLines.length > 0 ? (
        <div style={{
          textAlign: "center",
          marginBottom: 20,
          padding: "14px 24px",
          background: flash ? "#4f46e5" : "var(--color-primary)",
          borderRadius: "var(--radius-card)",
          color: "white",
          transition: "background 0.2s",
        }}>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: 2 }}>
            🎉 DUNZO! 🎉
          </div>
          <div style={{ fontSize: 13, opacity: 0.9, marginTop: 4 }}>
            {dunzoLines.length} line{dunzoLines.length > 1 ? "s" : ""} complete — keep going!
          </div>
        </div>
      ) : null}

      {/* Board action buttons */}
      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", marginBottom: 8, flexWrap: "wrap" }}>
        {/* Fill Board */}
        <button
          onClick={handleFillBoard}
          disabled={filling || tasks.length >= MAX_TASKS}
          style={{
            background: "var(--color-primary-light)",
            color: tasks.length >= MAX_TASKS ? "var(--color-text-muted)" : "var(--color-primary-text)",
            border: `1px solid ${tasks.length >= MAX_TASKS ? "var(--color-border)" : "var(--color-primary)"}`,
            padding: "6px 14px",
            borderRadius: "var(--radius-control)",
            fontSize: 12,
            fontWeight: 500,
            cursor: filling || tasks.length >= MAX_TASKS ? "default" : "pointer",
            opacity: filling ? 0.6 : 1,
            transition: "opacity 0.15s",
          }}
        >
          {filling
            ? "Filling..."
            : tasks.length >= MAX_TASKS
            ? "✓ Board Full"
            : `🎲 Fill ${MAX_TASKS - tasks.length} empty square${MAX_TASKS - tasks.length === 1 ? "" : "s"}`}
        </button>

        {/* Reset Board */}
        <button
          onClick={handleResetBoard}
          disabled={resetting || tasks.length === 0}
          style={{
            background: "var(--color-bg-task)",
            color: "var(--color-text-subtle)",
            border: "1px solid var(--color-border)",
            padding: "6px 14px",
            borderRadius: "var(--radius-control)",
            fontSize: 12,
            fontWeight: 500,
            cursor: resetting || tasks.length === 0 ? "default" : "pointer",
            opacity: resetting ? 0.6 : 1,
            transition: "opacity 0.15s",
          }}
        >
          {resetting ? "Resetting..." : "↺ Reset Board"}
        </button>

        {/* Remove Fun Tasks */}
        <button
          onClick={handleRemoveFun}
          disabled={removing || tasks.filter(t => t.category === "fun").length === 0}
          style={{
            background: "var(--color-bg-task)",
            color: "var(--color-text-subtle)",
            border: "1px solid var(--color-border)",
            padding: "6px 14px",
            borderRadius: "var(--radius-control)",
            fontSize: 12,
            fontWeight: 500,
            cursor: removing || tasks.filter(t => t.category === "fun").length === 0 ? "default" : "pointer",
            opacity: removing ? 0.6 : 1,
            transition: "opacity 0.15s",
          }}
        >
          {removing ? "Removing..." : "🗑 Remove Fun Tasks"}
        </button>

        {/* Shuffle Board */}
        <button
          onClick={handleShuffle}
          disabled={shuffling || taskOrder.length === 0}
          style={{
            background: "var(--color-bg-task)",
            color: "var(--color-text-subtle)",
            border: "1px solid var(--color-border)",
            padding: "6px 14px",
            borderRadius: "var(--radius-control)",
            fontSize: 12,
            fontWeight: 500,
            cursor: shuffling || taskOrder.length === 0 ? "default" : "pointer",
            opacity: shuffling ? 0.6 : 1,
            transition: "opacity 0.15s",
          }}
        >
          {shuffling ? "Shuffling..." : "🔀 Shuffle Board"}
        </button>
      </div>

      {/* D U N Z O column headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 4, marginBottom: 3 }}>
        {["D", "U", "N", "Z", "O"].map(letter => (
          <div
            key={letter}
            style={{
              textAlign: "center",
              fontWeight: 800,
              fontSize: 15,
              color: "var(--color-primary)",
              padding: "4px 0",
              letterSpacing: 1,
            }}
          >
            {letter}
          </div>
        ))}
      </div>

      {/* 5×5 grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: 4,
        animation: shuffling ? "gridShuffle 0.15s ease-in-out infinite" : "none",
        transition: "animation 0.3s",
      }}>
        {grid.map((cell, i) => {
          const marked = isMarked(i)
          const isFree = i === FREE_INDEX
          const isEmpty = cell === null
          const isHighlighted = highlightedCells.has(i)

          let bg = "var(--color-bg-task)"
          if (isFree) bg = "var(--color-primary)"
          else if (marked && isHighlighted) bg = "#4f46e5"
          else if (marked) bg = "var(--color-primary)"
          else if (isEmpty) bg = "transparent"

          return (
            <div
              key={i}
              onClick={() => {
                if (isFree || isEmpty) return
                const task = cell as Task
                handleToggle(task.id, !task.completed, i)
              }}
              style={{
                height: 88,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 6,
                borderRadius: 8,
                border: isEmpty
                  ? "1.5px dashed var(--color-border)"
                  : isHighlighted
                  ? "2px solid var(--color-primary-hover)"
                  : "1.5px solid transparent",
                background: bg,
                color: marked || isFree ? "white" : "var(--color-text-body)",
                cursor: isEmpty || isFree ? "default" : "pointer",
                transition: "background 0.2s, box-shadow 0.2s",
                textAlign: "center",
                overflow: "hidden",
                boxShadow: isHighlighted ? "0 0 0 3px var(--color-primary-light)" : "none",
                animation: bouncingCell === i ? "cellBounce 0.35s ease" : "none",
              }}
            >
              {isFree ? (
                <>
                  <div style={{ fontSize: 18, marginBottom: 2 }}>✓</div>
                  <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.3, textAlign: "center" }}>
                    Open Dunzo Task Manager
                  </div>
                </>
              ) : isEmpty ? null : (
                <>
                  {(cell as Task).completed && (
                    <div style={{ fontSize: 18, marginBottom: 2 }}>✓</div>
                  )}
                  <div style={{
                    fontSize: 13,
                    fontWeight: 500,
                    lineHeight: 1.3,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical" as const,
                  }}>
                    {(cell as Task).title}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>

      <p style={{ textAlign: "center", color: "var(--color-text-muted)", fontSize: 11, marginTop: 12 }}>
        Click a square to mark it complete
      </p>
    </div>
  )
}
