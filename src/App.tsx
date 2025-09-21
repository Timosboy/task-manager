import { NavLink, Route, Routes, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import AuthGate from './components/AuthGate'
import {
  ClipboardList,
  ListTodo,
  LineChart,
  Info,
  LayoutGrid,
} from 'lucide-react'
import ThemeToggle from './components/ThemeToggle'

const Todos = lazy(() => import('./pages/Todos'))
const Tasks = lazy(() => import('./pages/Tasks'))
const ChartPage = lazy(() => import('./pages/ChartPage'))
const Board = lazy(() => import('./pages/Board'))

function About() {
  return <h1 className="text-2xl font-bold">About</h1>
}

export default function App() {
  const link = ({ isActive }: { isActive: boolean }) =>
    `text-muted-foreground hover:text-foreground ${isActive ? 'font-semibold underline' : ''}`

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-10 flex items-center justify-between gap-4 px-4 py-3 border-b border-border bg-card/80 backdrop-blur-md supports-[backdrop-filter]:backdrop-blur">
        <div className="flex items-center gap-6">
          <span className="font-bold text-lg">Task Manager</span>
          <div className="flex gap-4 text-sm">
            <NavLink to="/tasks" className={link}>
              <span className="inline-flex items-center gap-1">
                <ClipboardList size={16} /> Tasks
              </span>
            </NavLink>
            <NavLink to="/todos" className={link}>
              <span className="inline-flex items-center gap-1">
                <ListTodo size={16} /> Todos
              </span>
            </NavLink>
            <NavLink to="/chart" className={link}>
              <span className="inline-flex items-center gap-1">
                <LineChart size={16} /> Chart
              </span>
            </NavLink>
            <NavLink to="/board" className={link}>
              <span className="inline-flex items-center gap-1">
                <LayoutGrid size={16} /> Board
              </span>
            </NavLink>
            <NavLink to="/about" className={link}>
              <span className="inline-flex items-center gap-1">
                <Info size={16} /> About
              </span>
            </NavLink>
          </div>
        </div>
        <ThemeToggle />
      </nav>

      <main className="px-4 md:px-6 py-6">
        <Suspense fallback={<p className="text-sm text-muted-foreground">Cargando…</p>}>
          <Routes>
            <Route path="/board" element={<AuthGate><Board /></AuthGate>} />
            <Route path="/" element={<Navigate to="/board" replace />} />
            <Route path="/about" element={<About />} />
            <Route path="/todos" element={<Todos />} />
            <Route path="/chart" element={<ChartPage />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/board" element={<Board />} />
            <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
          </Routes>
        </Suspense>
      </main>
    </div>
  )
}