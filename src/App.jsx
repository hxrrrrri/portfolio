import { useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Projects from './pages/Projects.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Showcase from './pages/Showcase.jsx'

// Tracks mouse and exposes position via a React ref — no DOM writes inside render
function useMousePos() {
  const pos = useRef({ x: -1000, y: -1000 })
  useEffect(() => {
    const onMove = (e) => { pos.current.x = e.clientX; pos.current.y = e.clientY }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])
  return pos
}

function MouseTexture() {
  const dotRef  = useRef(null)
  const glowRef = useRef(null)
  const pos     = useMousePos()

  useEffect(() => {
    let raf
    const tick = () => {
      const { x, y } = pos.current

      // Dot grid — CSS custom properties drive the mask
      if (dotRef.current) {
        dotRef.current.style.setProperty('--mx', x + 'px')
        dotRef.current.style.setProperty('--my', y + 'px')
      }

      // Glow — translate so its centre sits exactly on the cursor
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${x - 130}px, ${y - 130}px)`
      }

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [pos])

  return (
    <>
      {/*
        DOT-GRID TEXTURE
        ─────────────────
        NO mix-blend-mode → plain overlay, so it can never bleed through
        isolation or z-index tricks. The dots are semi-transparent black on
        whatever colour sits beneath — they look the same on any background.
        The mask restricts them to a 150 px spotlight around the cursor.
      */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9998,
          pointerEvents: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Ccircle cx='10' cy='10' r='1.2' fill='%23000' fill-opacity='0.20'/%3E%3C/svg%3E")`,
          backgroundSize: '25px 25px',
          WebkitMaskImage: 'radial-gradient(circle 150px at var(--mx,-1000px) var(--my,-1000px), black 15%, transparent 100%)',
          maskImage:        'radial-gradient(circle 150px at var(--mx,-1000px) var(--my,-1000px), black 15%, transparent 100%)',
        }}
      />

      {/*
        ORANGE LUMINANCE GLOW
        ──────────────────────
        Key change: NO mix-blend-mode (defaults to 'normal').
        Instead we use a very low opacity so it looks like a warm light wash
        without the compositing side-effects that mix-blend-mode:screen causes.
        translate() centres it on the cursor (130 = half of 260px).

        Because it has no blend mode and very low opacity it will draw over
        the photo too — so we deliberately shrink it and make the gradient
        fall off before it reaches the photo's position on the right side.
        The photo is > 50 % from the left edge; the glow centre only ever
        reaches the photo if the cursor is directly on it, which is fine.
      */}
      <div
        ref={glowRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '260px',
          height: '260px',
          borderRadius: '50%',
          // Soft warm orange, very low opacity — no blend mode needed
          background: 'radial-gradient(circle, rgba(255,90,20,0.10) 0%, rgba(255,60,0,0.04) 15%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 9997,
          // will-change keeps it on the GPU compositor layer for smooth tracking
          willChange: 'transform',
        }}
      />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <MouseTexture />
      <div className="font-display text-accent-dark min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/"         element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/showcase" element={<Showcase />} />
          <Route path="/about"    element={<About />} />
          <Route path="/contact"  element={<Contact />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
