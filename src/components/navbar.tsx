'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/theme-provider'
import { StatusBadge } from '@/components/ui/status-badge'
import { Moon, Sun, Menu, X, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/skills', label: 'Skills' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const { isAuthenticated, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-8',
        scrolled 
          ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm py-2' 
          : 'bg-transparent py-4'
      )}
    >
      <div className="max-w-7xl mx-auto">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">RH</span>
            </div>
            <span className="font-semibold text-sm hidden sm:block">RH</span>
          </Link>

          {/* Desktop Navigation - macOS style */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200',
                  pathname === item.href
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            <StatusBadge variant="success" showPing className="hidden sm:flex text-xs py-1" />
            
            {isAuthenticated ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="rounded-full w-8 h-8"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="rounded-full w-8 h-8"
                >
                  {theme === 'dark' ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="rounded-full hidden sm:flex"
                >
                  <Link href="/login">Admin</Link>
                </Button>
              </>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden w-8 h-8"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-2 pb-2 animate-in slide-in-from-top-2">
            <div className="flex flex-col gap-1 bg-background/95 backdrop-blur-lg rounded-xl p-3 border border-border">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'px-3 py-2 rounded-md text-sm font-medium transition-all',
                    pathname === item.href
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  )}
                >
                  {item.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2 rounded-md text-sm font-medium transition-all text-primary"
                >
                  Admin Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
