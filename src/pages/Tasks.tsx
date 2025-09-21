import { useEffect, useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

type Task = { id: string; title: string; done: boolean }
const LS_KEY = 'tasks_v1'

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('all')
  const [editing, setEditing] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) setTasks(JSON.parse(raw))
  }, [])
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(tasks))
  }, [tasks])

  function addTask(e: React.FormEvent) {
    e.preventDefault()
    const t = title.trim()
    if (!t) return
    setTasks((prev) => [
      { id: crypto.randomUUID(), title: t, done: false },
      ...prev,
    ])
    setTitle('')
  }
  function toggle(id: string) {
    setTasks((prev) =>
      prev.map((x) => (x.id === id ? { ...x, done: !x.done } : x)),
    )
  }
  function remove(id: string) {
    setTasks((prev) => prev.filter((x) => x.id !== id))
  }
  function startEdit(t: Task) {
    setEditing(t.id)
    setEditValue(t.title)
  }
  function commitEdit() {
    const v = editValue.trim()
    if (editing && v)
      setTasks((prev) =>
        prev.map((x) => (x.id === editing ? { ...x, title: v } : x)),
      )
    setEditing(null)
    setEditValue('')
  }
  function clearCompleted() {
    setTasks((prev) => prev.filter((x) => !x.done))
  }

  const filtered = useMemo(() => {
    if (filter === 'active') return tasks.filter((t) => !t.done)
    if (filter === 'done') return tasks.filter((t) => t.done)
    return tasks
  }, [tasks, filter])
  const left = tasks.filter((t) => !t.done).length

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Badge variant={left ? 'secondary' : 'outline'}>
          {left} pendientes
        </Badge>
      </div>

      <Card className="p-4 space-y-3">
        <form onSubmit={addTask} className="flex gap-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nueva tarea…"
            aria-label="Nueva tarea"
          />
          <Button type="submit">Agregar</Button>
        </form>

        <div className="flex items-center gap-2 text-sm">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            Todas
          </Button>
          <Button
            variant={filter === 'active' ? 'default' : 'outline'}
            onClick={() => setFilter('active')}
          >
            Activas
          </Button>
          <Button
            variant={filter === 'done' ? 'default' : 'outline'}
            onClick={() => setFilter('done')}
          >
            Hechas
          </Button>
          {tasks.some((t) => t.done) && (
            <>
              <Separator className="mx-2 h-5" orientation="vertical" />
              <Button variant="ghost" onClick={clearCompleted}>
                Limpiar completadas
              </Button>
            </>
          )}
        </div>
      </Card>

      <div className="space-y-2">
        {filtered.map((t) => (
          <Card key={t.id} className="p-3 flex items-center justify-between">
            <label className="flex items-center gap-3">
              <Checkbox
                checked={t.done}
                onCheckedChange={() => toggle(t.id)}
                aria-label={t.title}
              />
              {editing === t.id ? (
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={commitEdit}
                  onKeyDown={(e) => e.key === 'Enter' && commitEdit()}
                  autoFocus
                  className="h-8 w-72"
                />
              ) : (
                <button
                  onClick={() => startEdit(t)}
                  className={`text-left ${t.done ? 'line-through text-gray-500' : ''}`}
                  title="Editar"
                >
                  {t.title}
                </button>
              )}
            </label>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => remove(t.id)}
            >
              Eliminar
            </Button>
          </Card>
        ))}
        {tasks.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Sin tareas aún.
          </p>
        )}
      </div>
    </div>
  )
}
