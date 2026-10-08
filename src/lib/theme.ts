import { useEffect, useState } from 'react'
import { readStored, writeStored } from './storage.ts'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

/** A valid stored choice wins over the system preference. */
export function resolveTheme(stored: string | null, systemDark: boolean): Theme {
  if (stored === 'light' || stored === 'dark') return stored
  return systemDark ? 'dark' : 'light'
}

export function systemPrefersDark(): boolean {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  } catch {
    return false
  }
}

// ponytail: the system preference is read once at load; a system theme change mid-session is not tracked
export function useTheme(): { theme: Theme; toggle: () => void } {
  const [theme, setTheme] = useState<Theme>(() => resolveTheme(readStored(STORAGE_KEY), systemPrefersDark()))

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    writeStored(STORAGE_KEY, next)
  }

  return { theme, toggle }
}
