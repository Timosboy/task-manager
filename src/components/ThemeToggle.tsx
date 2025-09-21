import { useLayoutEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

function applyTheme(mode: 'light' | 'dark') {
  const root = document.documentElement
  if (mode === 'dark') root.classList.add('dark')
  else root.classList.remove('dark')
  root.style.setProperty('color-scheme', mode)
  localStorage.setItem('theme', mode)
}

export default function ThemeToggle() {
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    const stored = localStorage.getItem('theme')
    if (stored) return stored === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useLayoutEffect(() => {
    applyTheme(dark ? 'dark' : 'light')
  }, [dark])

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Cambiar tema"
      onClick={() => {
        setDark(!dark)
      }}
      className="
        relative inline-flex h-9 w-[70px] items-center rounded-full border
        border-border bg-card/80 backdrop-blur px-1
        transition-[background,box-shadow] hover:shadow-sm
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
      "
    >
      <span className="sr-only">Cambiar tema</span>

      {/* iconos */}
      <div className="flex w-full items-center justify-between px-1">
        <Sun
          className={`h-4 w-4 transition-opacity ${dark ? 'opacity-40' : 'opacity-100'}`}
        />
        <Moon
          className={`h-4 w-4 transition-opacity ${dark ? 'opacity-100' : 'opacity-40'}`}
        />
      </div>

      {/* “thumb” deslizante */}
      <span
        className={`
          pointer-events-none absolute left-1 top-1 h-7 w-7 rounded-full
          bg-background shadow transition-transform duration-300
          ${dark ? 'translate-x-[34px]' : 'translate-x-0'}
        `}
      />
    </button>
  )
}
