import { describe, it, expect } from 'vitest'
import { filterTasks, sortTasks, isValidTask } from '@/lib/taskUtils'

const mockTasks = [
  {
    id: '1',
    title: 'Buy groceries',
    description: null,
    dueDate: '2026-08-01T00:00:00.000Z',
    completed: false,
    category: 'Personal'
  },
  {
    id: '2',
    title: 'Finish project',
    description: 'Complete the task manager',
    dueDate: '2026-07-25T00:00:00.000Z',
    completed: true,
    category: 'Work'
  },
  {
    id: '3',
    title: 'Call dentist',
    description: null,
    dueDate: null,
    completed: false,
    category: null
  }
]

describe('filterTasks', () => {
  it('returns all tasks when filter is "all"', () => {
    const result = filterTasks(mockTasks, 'all')
    expect(result).toHaveLength(3)
  })

  it('returns only incomplete tasks when filter is "active"', () => {
    const result = filterTasks(mockTasks, 'active')
    expect(result).toHaveLength(2)
    expect(result.every(t => !t.completed)).toBe(true)
  })

  it('returns only completed tasks when filter is "completed"', () => {
    const result = filterTasks(mockTasks, 'completed')
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Finish project')
  })
})

describe('sortTasks', () => {
  it('sorts tasks by due date with nulls last', () => {
    const result = sortTasks(mockTasks, 'dueDate')
    expect(result[0].title).toBe('Finish project')
    expect(result[1].title).toBe('Buy groceries')
    expect(result[2].title).toBe('Call dentist')
  })

  it('returns tasks unchanged when sortBy is not dueDate', () => {
    const result = sortTasks(mockTasks, 'createdAt')
    expect(result[0].title).toBe('Buy groceries')
  })
})

describe('isValidTask', () => {
  it('returns true for a valid title', () => {
    expect(isValidTask('Buy milk')).toBe(true)
  })

  it('returns false for an empty title', () => {
    expect(isValidTask('')).toBe(false)
  })

  it('returns false for a whitespace-only title', () => {
    expect(isValidTask('   ')).toBe(false)
  })
})