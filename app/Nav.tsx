// /components/Nav.tsx
'use client'
import { useState, useEffect } from 'react'

const NAV_ITEMS = [
  { label: 'Home', href: '#home' },
  { label: 'About me', href: '#aboutme' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isDark, setIsDark] = useState(true)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const theme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches
    const shouldBeDark = theme === 'dark' || (!theme && prefersDark)

    setIsDark(shouldBeDark)
    if (!shouldBeDark) {
      document.body.classList.add('light-mode')
    }
  }, [])

  // Scroll spy to detect active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = NAV_ITEMS.map(item => item.href.substring(1))
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetBottom = offsetTop + element.offsetHeight

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    handleScroll() // Initial check
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)

    if (newIsDark) {
      document.body.classList.remove('light-mode')
      localStorage.setItem('theme', 'dark')
    } else {
      document.body.classList.add('light-mode')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <header className={`navbar ${scrolled ? 'nav-scrolled' : ''}`}>
      <div className="nav-inner">
        <div className="nav-left">
          <span className="nav-left-text">John Bryx Torralba Jovellanos</span>
          <span className="nav-left-binary">01001010 01000010 01001010</span>
        </div>

        <div className="nav-right">
          <nav className={`nav-links ${open ? 'open' : ''}`}>
            {NAV_ITEMS.map((item) => {
              const sectionId = item.href.substring(1)
              const isActive = activeSection === sectionId
              
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  {item.label}
                </a>
              )
            })}
          </nav>

          <button
            className="theme-toggle"
            aria-label="Toggle theme"
            onClick={toggleTheme}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <span>{isDark ? '◐' : '◑'}</span>
          </button>

          <button
            className="nav-hamburger"
            aria-label="Toggle menu"
            onClick={() => setOpen((s) => !s)}
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </header>
  )
}