'use client'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('theme') as 'light' | 'dark'
    if (saved) {
      setTheme(saved)
      document.documentElement.setAttribute('data-theme', saved)
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark')
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  }, [])

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    console.log('ThemeToggle: switching to', next)
    setTheme(next)
    localStorage.setItem('theme', next)
    document.documentElement.setAttribute('data-theme', next)
  }

  if (!mounted) return <div style={{ width: '36px', height: '36px' }} />

  return (
    <button 
      onClick={toggle} 
      className="btn-ghost" 
      style={{ 
        padding: '8px', 
        fontSize: '18px', 
        width: '40px', 
        height: '40px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }} 
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}
