import { describe, it, expect, beforeEach } from 'vitest'

const KEY = 'tasks_v1'

describe('storage local de Tasks', () => {
  beforeEach(() => localStorage.clear())

  it('guarda y carga tareas', () => {
    const sample = [{ id: '1', title: 'Hola', done: false }]
    localStorage.setItem(KEY, JSON.stringify(sample))
    const parsed = JSON.parse(localStorage.getItem(KEY) || '[]')
    expect(parsed).toHaveLength(1)
    expect(parsed[0].title).toBe('Hola')
  })
})
