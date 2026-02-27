'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from './theme-provider'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Determine if dark mode is active
  const isDark = theme === 'dark'

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  if (!mounted) {
    return (
      <button
        className={cn(
          'relative w-12 h-12 rounded-full',
          'bg-white/80 dark:bg-gray-800/80',
          'backdrop-blur-md',
          'border border-gray-200 dark:border-gray-700',
          'shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50',
          'transition-all duration-300',
          'flex items-center justify-center',
          className
        )}
        aria-label="Toggle theme"
      >
        <div className="w-5 h-5 bg-gray-200 dark:bg-gray-600 rounded-full animate-pulse" />
      </button>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'group relative w-12 h-12 rounded-full',
        'bg-white/80 dark:bg-gray-800/80',
        'backdrop-blur-md',
        'border border-gray-200 dark:border-gray-700',
        'shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50',
        'hover:shadow-xl hover:scale-105',
        'active:scale-95',
        'transition-all duration-300 ease-out',
        'flex items-center justify-center',
        'overflow-hidden',
        className
      )}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Sun Icon */}
      <Sun
        className={cn(
          'absolute w-5 h-5 text-amber-500',
          'transition-all duration-500 ease-out',
          isDark 
            ? 'opacity-0 rotate-90 scale-0' 
            : 'opacity-100 rotate-0 scale-100'
        )}
      />
      
      {/* Moon Icon */}
      <Moon
        className={cn(
          'absolute w-5 h-5 text-blue-400',
          'transition-all duration-500 ease-out',
          isDark 
            ? 'opacity-100 rotate-0 scale-100' 
            : 'opacity-0 -rotate-90 scale-0'
        )}
      />

      {/* Glow effect */}
      <div
        className={cn(
          'absolute inset-0 rounded-full',
          'transition-opacity duration-300',
          isDark 
            ? 'opacity-0' 
            : 'opacity-0 group-hover:opacity-100'
        )}
        style={{
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.2) 0%, transparent 70%)',
        }}
      />
      <div
        className={cn(
          'absolute inset-0 rounded-full',
          'transition-opacity duration-300',
          isDark 
            ? 'opacity-0 group-hover:opacity-100' 
            : 'opacity-0'
        )}
        style={{
          background: 'radial-gradient(circle, rgba(96, 165, 250, 0.2) 0%, transparent 70%)',
        }}
      />
    </button>
  )
}
