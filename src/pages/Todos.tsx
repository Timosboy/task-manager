import { useEffect, useState } from 'react'
import { api, baseURL } from '../lib/api'

type Todo = { id: number; title: string }

const FALLBACK: Todo[] = [
  { id: 1, title: 'Ejemplo 1 (fallback)' },
  { id: 2, title: 'Ejemplo 2 (fallback)' },
  { id: 3, title: 'Ejemplo 3 (fallback)' },
]

export default function Todos() {
  const [data, setData] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        console.log('[Todos] fetching...')
        const res = await api.get<Todo[]>('/todos', { params: { _limit: 5 } })
        console.log('[Todos] ok', res.status, res.data)
        setData(res.data)
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err)
        console.error('[Todos] error', msg)
        setError(msg)
        // muestra algo aunque falle la red
        setData(FALLBACK)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return <p className="text-gray-600">Cargando…</p>
  if (error)
    return (
      <div className="space-y-2">
        <p className="text-red-600">Error: {error}</p>
        <p className="text-gray-600">Mostrando datos de ejemplo.</p>
        <List data={data} />
      </div>
    )
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Todos (API Demo)</h1>
      <p className="text-gray-600 mb-4">
        Esta vista hace <code>fetch</code> a{' '}
        <code>{baseURL}/todos?_limit=5</code>. Si la red falla, se muestra un
        fallback local para no romper la UI.
      </p>
      <List data={data} />
    </div>
  )
}

function List({ data }: { data: Todo[] }) {
  return (
    <ul className="list-disc pl-6">
      {data.map((t) => (
        <li key={t.id}>{t.title}</li>
      ))}
    </ul>
  )
}
