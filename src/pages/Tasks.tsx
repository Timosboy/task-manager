import { useEffect, useState } from 'react'

type Task = { id: string; title: string; done: boolean }

const LS_KEY = 'tasks_v1'

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')

  // cargar desde localStorage
  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) setTasks(JSON.parse(raw))
  }, [])

  // guardar en localStorage
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

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="mb-4 text-2xl font-bold">Task Manager</h1>

      <form onSubmit={addTask} className="mb-6 flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nueva tarea..."
          className="flex-1 rounded border px-3 py-2"
        />
        <button className="rounded bg-blue-600 px-4 py-2 text-white">
          Agregar
        </button>
      </form>

      <ul className="space-y-2">
        {tasks.map((t) => (
          <li
            key={t.id}
            className="flex items-center justify-between rounded border bg-white p-3"
          >
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => toggle(t.id)}
              />
              <span className={t.done ? 'line-through text-gray-500' : ''}>
                {t.title}
              </span>
            </label>
            <button
              onClick={() => remove(t.id)}
              className="text-sm text-red-600"
            >
              Eliminar
            </button>
          </li>
        ))}
        {tasks.length === 0 && <p className="text-gray-500">Sin tareas aún.</p>}
      </ul>
    </div>
  )
}
