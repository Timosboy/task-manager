import { useEffect, useMemo, useState } from 'react'
import {
  DndContext,
  type DragEndEvent,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GripVertical, Trash2 } from 'lucide-react'

type Status = 'todo' | 'doing' | 'done'
type TaskV2 = {
  id: string
  title: string
  status: Status
  createdAt: number
  priority?: 'low' | 'med' | 'high'
  due?: string
}

const V2_KEY = 'tasks_v2'
const V1_KEY = 'tasks_v1'

function migrateFromV1(): TaskV2[] {
  try {
    const raw = localStorage.getItem(V1_KEY)
    if (!raw) return []
    const v1 = JSON.parse(raw) as Array<{
      id: string
      title: string
      done: boolean
    }>
    return v1.map((t) => ({
      id: t.id,
      title: t.title,
      status: t.done ? 'done' : 'todo',
      createdAt: Date.now(),
    }))
  } catch {
    return []
  }
}

function loadV2(): TaskV2[] {
  const raw = localStorage.getItem(V2_KEY)
  if (raw) {
    try {
      return JSON.parse(raw) as TaskV2[]
    } catch {
      /* noop */
    }
  }
  // si no hay v2, migra de v1
  const migrated = migrateFromV1()
  if (migrated.length) localStorage.setItem(V2_KEY, JSON.stringify(migrated))
  return migrated
}

export default function Board() {
  const [tasks, setTasks] = useState<TaskV2[]>(() => loadV2())
  const [title, setTitle] = useState('')

  useEffect(() => {
    localStorage.setItem(V2_KEY, JSON.stringify(tasks))
  }, [tasks])

  const byStatus = useMemo(
    () => ({
      todo: tasks.filter((t) => t.status === 'todo'),
      doing: tasks.filter((t) => t.status === 'doing'),
      done: tasks.filter((t) => t.status === 'done'),
    }),
    [tasks],
  )

  function addTask(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const t = title.trim()
    if (!t) return
    setTasks((prev) => [
      {
        id: crypto.randomUUID(),
        title: t,
        status: 'todo',
        createdAt: Date.now(),
      },
      ...prev,
    ])
    setTitle('')
  }

  function removeTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e
    if (!over) return
    const overId = String(over.id)
    if (overId.startsWith('col:')) {
      const status = overId.replace('col:', '') as Status
      setTasks((prev) =>
        prev.map((t) => (t.id === active.id ? { ...t, status } : t)),
      )
    }
  }

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      pressDelay: 150,
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  return (
    <div className="space-y-4">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Board</h1>
          <p className="text-sm text-muted-foreground">
            Organiza tus tareas por estado. Arrastra tarjetas entre columnas.
          </p>
        </div>
        <div className="flex gap-2 text-xs">
          <Badge variant="secondary">Todo: {byStatus.todo.length}</Badge>
          <Badge variant="secondary">Activas: {byStatus.doing.length}</Badge>
          <Badge variant="secondary">Hechas: {byStatus.done.length}</Badge>
        </div>
      </header>

      {/* form para nueva tarea */}
      <Card className="p-4 border border-border bg-card/80 rounded-2xl">
        <form onSubmit={addTask} className="flex gap-2">
          <Input
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
            placeholder="Nueva tarea…"
            aria-label="Nueva tarea"
            className="h-10 bg-background"
          />
          <Button type="submit" className="h-10">
            <GripVertical size={16} className="mr-1" />
            Agregar
          </Button>
        </form>
      </Card>

      {/* columnas a pantalla completa */}
      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[60vh]">
          <Column
            id="col:todo"
            title="Pendientes"
            items={byStatus.todo}
            onRemove={removeTask}
          />
          <Column
            id="col:doing"
            title="En progreso"
            items={byStatus.doing}
            onRemove={removeTask}
          />
          <Column
            id="col:done"
            title="Hechas"
            items={byStatus.done}
            onRemove={removeTask}
          />
        </div>
      </DndContext>
    </div>
  )
}

/* ---------- Column & Card ---------- */

function Column({
  id,
  title,
  items,
  onRemove,
}: {
  id: string
  title: string
  items: TaskV2[]
  onRemove: (id: string) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id }) // 👈 droppable real

  return (
    <Card className="p-3 md:p-4 border border-border rounded-2xl bg-card/70">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-semibold tracking-tight">{title}</h2>
        <Badge variant="outline">{items.length}</Badge>
      </div>

      <SortableContext
        items={items.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className={`min-h-[200px] rounded-xl border p-2 bg-background/40 backdrop-blur-sm
            ${isOver ? 'border-primary/50 ring-2 ring-primary/30' : 'border-border/60 border-dashed'}`}
        >
          {items.length === 0 ? (
            <p className="py-6 text-center text-xs text-muted-foreground">
              Arrastra elementos aquí
            </p>
          ) : (
            items.map((t) => <TaskCard key={t.id} t={t} onRemove={onRemove} />)
          )}
        </div>
      </SortableContext>
    </Card>
  )
}

function TaskCard({
  t,
  onRemove,
}: {
  t: TaskV2
  onRemove: (id: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: t.id })
  const style: React.CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
    opacity: isDragging ? 0.6 : 1,
  }

  const chip =
    t.priority === 'high'
      ? 'bg-red-500/10 text-red-400'
      : t.priority === 'med'
        ? 'bg-amber-500/10 text-amber-400'
        : t.priority === 'low'
          ? 'bg-emerald-500/10 text-emerald-400'
          : 'bg-muted text-muted-foreground'

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group mb-2 rounded-xl border border-border bg-card p-3 shadow-sm hover:shadow transition-shadow"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* HANDLE: solo aquí van listeners/attributes */}
          <button
            className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
            aria-label="Arrastrar"
            {...attributes}
            {...listeners}
          >
            <GripVertical size={16} />
          </button>
          <h3 className="font-medium leading-tight">{t.title}</h3>
        </div>

        <button
          onClick={() => onRemove(t.id)}
          className="text-muted-foreground hover:text-destructive"
          aria-label="Eliminar"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <span className={`rounded px-2 py-0.5 text-[10px] ${chip}`}>
          {t.priority ?? 'normal'}
        </span>
        {t.due && (
          <span className="text-[10px] text-muted-foreground">
            vence {t.due}
          </span>
        )}
      </div>
    </div>
  )
}
