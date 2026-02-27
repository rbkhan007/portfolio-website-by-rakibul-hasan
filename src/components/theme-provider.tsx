'use client'

import { createContext, useContext, useState, ReactNode, useCallback, useMemo, useEffect } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
  systemTheme: Theme
  resolvedTheme: Theme
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light')
  const [systemTheme, setSystemTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  // Initialize on mount
  useEffect(() => {
    const getSystemTheme = (): Theme => {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    
    const savedTheme = localStorage.getItem('theme') as Theme | null
    const system = getSystemTheme()
    const initialTheme = savedTheme || system
    
    setSystemTheme(system)
    document.documentElement.classList.toggle('dark', initialTheme === 'dark')
    setThemeState(initialTheme)
    setMounted(true)
  }, [])

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }, [theme, setTheme])

  // Sync with system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      const newSystemTheme = e.matches ? 'dark' : 'light'
      setSystemTheme(newSystemTheme)
      
      const savedTheme = localStorage.getItem('theme') as Theme | null
      if (!savedTheme) {
        setTheme(newSystemTheme)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [setTheme])

  // Resolved theme is simply the current theme (which already considers system preference)
  const resolvedTheme = theme

  const value = useMemo(() => ({ 
    theme, 
    toggleTheme, 
    setTheme, 
    systemTheme,
    resolvedTheme 
  }), [theme, toggleTheme, setTheme, systemTheme, resolvedTheme])

  // Render children normally, but provide a default context for SSR
  // The mounted state ensures the theme is applied after hydration
  return (
    <ThemeContext.Provider value={mounted ? value : { theme: 'light', toggleTheme: () => {}, setTheme: () => {}, systemTheme: 'light', resolvedTheme: 'light' }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
