"use client"

import { useState, useEffect } from "react"
import TaskList from "./TaskList"
import DunzoBoard from "./DunzoBoard"

type View = "list" | "dunzo"

const COLOR_OPTIONS = [
  { label: "Navy",        value: "#1e3a5f", hover: "#163052", light: "#e8f0f8", text: "#1e3a5f" },
  { label: "Indigo",      value: "#6366f1", hover: "#4f46e5", light: "#eef2ff", text: "#6366f1" },
  { label: "Deep Indigo", value: "#312e81", hover: "#27246b", light: "#ede9fe", text: "#312e81" },
  { label: "Blue",        value: "#1d4ed8", hover: "#1a44c2", light: "#dbeafe", text: "#1d4ed8" },
  { label: "Slate",       value: "#334155", hover: "#293548", light: "#f1f5f9", text: "#334155" },
  { label: "Emerald",     value: "#059669", hover: "#047857", light: "#d1fae5", text: "#059669" },
]

const STORAGE_KEY = "dunzo-color"

function applyColor(color: typeof COLOR_OPTIONS[0]) {
  const root = document.documentElement
  root.style.setProperty("--color-primary",      color.value)
  root.style.setProperty("--color-primary-hover", color.hover)
  root.style.setProperty("--color-primary-light", color.light)
  root.style.setProperty("--color-primary-text",  color.text)
}

export default function DashboardClient() {
  const [view, setView] = useState<View>("list")
  const [activeColor, setActiveColor] = useState(COLOR_OPTIONS[0].value)

  // On mount, restore saved color
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    const match = COLOR_OPTIONS.find(c => c.value === saved)
    if (match) {
      applyColor(match)
      setActiveColor(match.value)
    }
  }, [])

  function handleColorPick(color: typeof COLOR_OPTIONS[0]) {
    applyColor(color)
    setActiveColor(color.value)
    localStorage.setItem(STORAGE_KEY, color.value)
  }

  return (
    <div>
      {/* Toolbar row: toggle left, color swatches right */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>

        {/* List | Dunzo Board toggle */}
        <div style={{
          display: "flex",
          gap: 4,
          background: "var(--color-bg-task)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-control)",
          padding: 4,
        }}>
          {(["list", "dunzo"] as View[]).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding: "6px 18px",
                borderRadius: "var(--radius-control)",
                border: "none",
                background: view === v ? "var(--color-primary)" : "transparent",
                color: view === v ? "white" : "var(--color-text-muted)",
                fontWeight: 500,
                fontSize: 13,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {v === "list" ? "List" : "Dunzo Board"}
            </button>
          ))}
        </div>

        {/* Color swatches */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 11, color: "var(--color-text-muted)", marginRight: 2 }}>Theme</span>
          {COLOR_OPTIONS.map(color => (
            <button
              key={color.value}
              title={color.label}
              onClick={() => handleColorPick(color)}
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: color.value,
                border: activeColor === color.value
                  ? "2px solid var(--color-text-heading)"
                  : "2px solid transparent",
                cursor: "pointer",
                padding: 0,
                outline: activeColor === color.value ? "2px solid white" : "none",
                outlineOffset: "-3px",
                transition: "border 0.15s",
              }}
            />
          ))}
        </div>
      </div>

      {view === "list" ? <TaskList /> : <DunzoBoard />}
    </div>
  )
}
