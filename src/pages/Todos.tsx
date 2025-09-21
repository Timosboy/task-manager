import { useEffect, useState } from 'react'
import { api, baseURL } from '../lib/api'
import { Button } from '../components/ui/button'
import { CanceledError } from 'axios'

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
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    const ctrl = new AbortController()
    ;(async () => {
      try {
        setError(null)
        console.log('[Todos] fetching...')
        const res = await api.get<Todo[]>('/todos', {
          params: { _limit: 5 },
          signal: ctrl.signal, // cancela si se desmonta
        })
        console.log('[Todos] ok', res.status, res.data)
        setData(res.data)
      } catch (err) {
        if (err instanceof CanceledError) return
        const msg = err instanceof Error ? err.message : String(err)
        setError(msg)
        setData(FALLBACK)
      } finally {
        setLoading(false)
      }
    })()
    return () => ctrl.abort()
  }, [retry])

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="h-4 w-48 rounded bg-gray-200 animate-pulse dark:bg-gray-700" />
        <div className="h-4 w-64 rounded bg-gray-200 animate-pulse dark:bg-gray-700" />
        <div className="h-4 w-56 rounded bg-gray-200 animate-pulse dark:bg-gray-700" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-3">
        <p className="text-red-600">Error: {error}</p>
        <p className="text-gray-600 dark:text-gray-300">
          Mostrando datos de ejemplo (fallback).
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setLoading(true)
            setRetry((r) => r + 1)
          }}
        >
          Reintentar
        </Button>
        <List data={data} />
      </div>
    )
  }
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Todos (API Demo)</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
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
