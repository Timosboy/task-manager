import { NavLink, Route, Routes, Navigate } from 'react-router-dom'
import Todos from './pages/Todos'
import Tasks from './pages/Tasks'
import ChartPage from './pages/ChartPage'

function About() {
  return <h1 className="text-2xl font-bold">About</h1>
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex gap-4 p-4 border-b bg-white">
        <NavLink to="/tasks" className="text-blue-600">
          Tasks
        </NavLink>
        <NavLink to="/todos" className="text-blue-600">
          Todos
        </NavLink>
        <NavLink to="/chart" className="text-blue-600">
          Chart
        </NavLink>
        <NavLink to="/about" className="text-blue-600">
          About
        </NavLink>
      </nav>
      <main className="p-6">
        <Routes>
          <Route path="/" element={<Navigate to="/tasks" replace />} />
          <Route path="/about" element={<About />} />
          <Route path="/todos" element={<Todos />} />
          <Route path="/chart" element={<ChartPage />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
        </Routes>
      </main>
    </div>
  )
}
