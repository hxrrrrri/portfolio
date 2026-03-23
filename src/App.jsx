import { useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Projects from './pages/Projects.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Showcase from './pages/Showcase.jsx'

// Global dot-grid texture that follows the mouse on every page
function MouseTexture() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onMove = (e) => {
      el.style.setProperty('--mx', `${e.clientX}px`)
      el.style.setProperty('--my', `${e.clientY}px`)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22'%3E%3Ccircle cx='11' cy='11' r='1.1' fill='%23000' fill-opacity='0.15'/%3E%3C/svg%3E")`,
        backgroundSize: '22px 22px',
        WebkitMaskImage: 'radial-gradient(circle 200px at var(--mx, 50vw) var(--my, 50vh), black 0%, transparent 100%)',
        maskImage: 'radial-gradient(circle 200px at var(--mx, 50vw) var(--my, 50vh), black 0%, transparent 100%)',
      }}
    />
  )
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Dot-grid texture — applied globally across all pages */}
      <MouseTexture />
      <div className="font-display text-accent-dark min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/showcase" element={<Showcase />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
