import { useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import Footer from '../components/Footer'
import heroImg from '../assets/hero.jpg'

// ── Global mouse-reveal texture hook ──────────────────────────────────────────
// Creates an SVG dot-grid canvas revealed by a radial spotlight following the mouse.
// Applied as a fixed overlay on top of every page via the wrapper div.
function useMouseTexture(wrapperRef) {
  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return

    const onMove = (e) => {
      el.style.setProperty('--mx', `${e.clientX}px`)
      el.style.setProperty('--my', `${e.clientY}px`)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [wrapperRef])
}

export default function Home() {
  const pageRef         = useRef(null)
  const heroRef         = useRef(null)
  const headingRef      = useRef(null)
  const subRef          = useRef(null)
  const ctaRef          = useRef(null)
  const photoRef        = useRef(null)
  const photoWrapRef    = useRef(null)
  const photoOverlayRef = useRef(null)
  const glassShineRef   = useRef(null)
  const badgeRef        = useRef(null)
  // Hidden reveal text refs
  const revealRef       = useRef(null)

  useMouseTexture(pageRef)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current,
        { x: -80, opacity: 0, skewX: -4 },
        { x: 0, opacity: 1, skewX: 0, duration: 1.0, ease: 'power4.out', delay: 0.05 }
      )
      gsap.fromTo(subRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.35, ease: 'power3.out' }
      )
      gsap.fromTo(ctaRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, delay: 0.55, ease: 'power3.out' }
      )
      if (photoWrapRef.current) {
        gsap.fromTo(photoWrapRef.current,
          { clipPath: 'inset(0% 0% 100% 0%)', scale: 1.06 },
          { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.2, delay: 0.15, ease: 'power4.out' }
        )
      }
      if (glassShineRef.current) {
        gsap.fromTo(glassShineRef.current,
          { x: '-130%', opacity: 1 },
          { x: '130%', opacity: 0, duration: 1.0, delay: 1.3, ease: 'power2.inOut' }
        )
      }
      if (badgeRef.current) {
        gsap.fromTo(badgeRef.current,
          { scale: 0, rotation: -12, opacity: 0 },
          { scale: 1, rotation: 0, opacity: 1, duration: 0.65, delay: 0.9, ease: 'back.out(2.2)' }
        )
        gsap.to(badgeRef.current, {
          scale: 1.06, duration: 1.1, ease: 'sine.inOut',
          yoyo: true, repeat: -1, delay: 1.6,
        })
      }
      // Hidden reveal text — starts invisible
      if (revealRef.current) {
        gsap.set(revealRef.current, { opacity: 0 })
      }
    }, heroRef)
    return () => ctx.revert()
  }, [])

  const handlePhotoEnter = () => {
    if (photoOverlayRef.current)
      gsap.to(photoOverlayRef.current, { opacity: 0, duration: 0.4, ease: 'power2.out' })
  }
  const handlePhotoLeave = () => {
    if (photoOverlayRef.current)
      gsap.to(photoOverlayRef.current, { opacity: 1, duration: 0.55, ease: 'power2.inOut' })
    if (photoRef.current)
      gsap.to(photoRef.current, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power2.out' })
  }
  const handlePhotoMove = (e) => {
    const wrap = photoWrapRef.current
    if (!wrap || !photoRef.current) return
    const rect = wrap.getBoundingClientRect()
    const rx = ((e.clientY - rect.top)  / rect.height - 0.5) * 18
    const ry = (0.5 - (e.clientX - rect.left) / rect.width) * 18
    gsap.to(photoRef.current, { rotateX: rx, rotateY: ry, duration: 0.18, ease: 'power1.out' })
  }

  // Hover-reveal on the grey hero area
  const handleHeroEnter = () => {
    if (revealRef.current)
      gsap.to(revealRef.current, { opacity: 1, duration: 0.6, ease: 'power2.out' })
  }
  const handleHeroLeave = () => {
    if (revealRef.current)
      gsap.to(revealRef.current, { opacity: 0, duration: 0.4, ease: 'power2.in' })
  }

  const ArrowIcon = ({ size = 20, className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      className={`flex-shrink-0 ${className}`}>
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  )

  return (
    <div
      ref={pageRef}
      className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#E5E5E5]"
      style={{ '--mx': '50vw', '--my': '50vh' }}
    >
      {/* ── GLOBAL DOT-GRID TEXTURE OVERLAY ──
          Revealed only within a radial spotlight around the cursor.
          pointer-events:none so it never blocks clicks.
      ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 5,
          pointerEvents: 'none',
          // SVG dot grid as data-URI background
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Ccircle cx='12' cy='12' r='1.2' fill='%23000' fill-opacity='0.18'/%3E%3C/svg%3E")`,
          backgroundSize: '24px 24px',
          // radial mask — only shows near cursor
          WebkitMaskImage: 'radial-gradient(circle 220px at var(--mx) var(--my), black 0%, transparent 100%)',
          maskImage: 'radial-gradient(circle 220px at var(--mx) var(--my), black 0%, transparent 100%)',
          transition: 'opacity 0.2s',
        }}
      />

      <div className="bg-blob" style={{ background: '#FF4D2D', top: '-100px', left: '-100px', opacity: 0.08 }} />
      <div className="bg-blob" style={{ background: '#2D5BFF', bottom: '-100px', right: '-100px', opacity: 0.07 }} />

      <main ref={heroRef} className="flex-1 relative z-10">

        {/*
          HERO GRID: [Stats black:2] | [Name + photo + bio:10]
          No right black column — clean right edge.
        */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-73px)] border-b-2 border-black">

          {/* ── A: Stats LEFT (black, col-span-2) ── */}
          <div className="lg:col-span-2 flex flex-col bg-black text-white border-b-2 lg:border-b-0 lg:border-r-2 border-[#222]">
            {/* Open to Work badge */}
            <div className="p-4 border-b border-white/10 flex justify-center">
              <div ref={badgeRef} style={{ transformOrigin: 'center' }}>
                <div className="relative" style={{ display: 'inline-flex' }}>
                  <div style={{
                    position: 'absolute', inset: '-5px', borderRadius: '4px',
                    background: 'rgba(255,77,45,0.4)', filter: 'blur(10px)', zIndex: 0,
                  }} />
                  <div className="relative z-10 px-3 py-2 bg-[#FF4D2D] border-2 border-white"
                    style={{ boxShadow: '3px 3px 0 #000' }}>
                    <div className="flex items-center gap-2">
                      <span style={{
                        width: '7px', height: '7px', borderRadius: '50%',
                        background: '#22ff88', display: 'inline-block',
                        boxShadow: '0 0 8px #22ff88', flexShrink: 0,
                        animation: 'blink 1.1s ease-in-out infinite',
                      }} />
                      <span style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.16em', color: '#fff', whiteSpace: 'nowrap' }}>
                        Open to Work
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Stats */}
            <div className="p-5 lg:p-6 space-y-4 flex-1 flex flex-col justify-center">
              <div className="border-b border-white/10 pb-4">
                <div className="text-[8px] font-black uppercase tracking-widest text-[#FF4D2D] mb-1">Achievements</div>
                <div className="text-4xl font-black leading-none">2×</div>
                <div className="text-[8px] font-bold uppercase tracking-widest text-white/50 mt-1">SIH Winner</div>
              </div>
              <div className="border-b border-white/10 pb-4">
                <div className="text-[8px] font-black uppercase tracking-widest text-[#FF4D2D] mb-1">Projects</div>
                <div className="text-4xl font-black leading-none">6+</div>
                <div className="text-[8px] font-bold uppercase tracking-widest text-white/50 mt-1">Built &amp; Shipped</div>
              </div>
              <div>
                <div className="text-[8px] font-black uppercase tracking-widest text-[#FF4D2D] mb-1">Stack</div>
                <div className="text-4xl font-black leading-none">15+</div>
                <div className="text-[8px] font-bold uppercase tracking-widest text-white/50 mt-1">Technologies</div>
              </div>
              <div className="pt-3 border-t border-white/10">
                <a href="https://github.com/hxrrrrri" target="_blank" rel="noopener noreferrer"
                  className="group flex items-center justify-between text-[8px] font-black uppercase tracking-widest hover:text-[#FF4D2D] transition-colors">
                  <span>github/hxrrrrri</span>
                  <ArrowIcon size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
            </div>
          </div>

          {/* ── B: Name + bio + Photo (grey, col-span-10) ── */}
          <div
            className="lg:col-span-10 border-b-2 lg:border-b-0 border-black bg-[#E5E5E5] relative overflow-hidden"
            onMouseEnter={handleHeroEnter}
            onMouseLeave={handleHeroLeave}
          >

            {/* ── HOVER-REVEAL hidden background text ──
                Large ghost typography that appears when hovering the grey area,
                mirroring the number-reveal on the 3D project cards.
            ── */}
            <div
              ref={revealRef}
              aria-hidden="true"
              style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                pointerEvents: 'none', zIndex: 1,
                overflow: 'hidden',
              }}
            >
              <span style={{
                fontSize: 'clamp(6rem, 18vw, 18rem)',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '-0.06em',
                color: 'rgba(0,0,0,0.04)',
                lineHeight: 1,
                whiteSpace: 'nowrap',
                userSelect: 'none',
              }}>
                HARISANKAR
              </span>
            </div>

            {/* Text — pinned to top-left, NOT vertically centred */}
            <div className="relative z-10 p-8 lg:p-14 pt-10 lg:pt-14 flex flex-col"
              style={{ maxWidth: '52%', minHeight: '100%' }}>

              <div ref={headingRef}>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black/40 block mb-4">
                  FINAL YEAR · CSE (AI) · MBCET
                </span>
                {/* Name sits near the top — generous mb pushes bio down */}
                <h1
                  className="font-black leading-[0.88] tracking-tighter uppercase whitespace-nowrap"
                  style={{ fontSize: 'clamp(2.4rem, 4.5vw, 5.5rem)' }}
                >
                  Harisankar S<span className="text-[#FF4D2D]">.</span>
                </h1>
                <div className="mt-3 text-[11px] font-black uppercase tracking-[0.25em] text-black/50">
                  AI/ML Engineer · Full-Stack Developer
                </div>
              </div>

              {/* Spacer pushes bio+buttons towards the bottom */}
              <div className="flex-1" />

              <div ref={subRef} className="space-y-8 pb-10 lg:pb-14">
                <p className="text-sm font-medium leading-relaxed uppercase tracking-tight text-black/60">
                  Building intelligent systems at the intersection of computer vision, NLP, and modern web architecture.
                  Two-time SIH winner.
                </p>
                <div ref={ctaRef} className="flex flex-row items-center gap-4">
                  <Link
                    to="/projects"
                    className="group inline-flex items-center gap-3 bg-black text-white hover:bg-[#FF4D2D] transition-colors"
                    style={{ height: '52px', padding: '0 28px' }}
                  >
                    <span className="text-[11px] font-black uppercase tracking-widest leading-none">View Works</span>
                    <ArrowIcon size={16} className="group-hover:translate-x-2 transition-transform" />
                  </Link>
                  <Link
                    to="/contact"
                    className="group inline-flex items-center gap-3 border-2 border-black hover:bg-black hover:text-white transition-colors"
                    style={{ height: '52px', padding: '0 28px' }}
                  >
                    <span className="text-[11px] font-black uppercase tracking-widest leading-none">Get in Touch</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* ── Photo — absolute right, TOP-ALIGNED with a gap from the name ── */}
            <div
              style={{
                position: 'absolute',
                right: '5%',
                top: '8%',           // starts near the top — creates gap below the name
                width: '34%',
                zIndex: 10,
              }}
            >
              <div
                ref={photoWrapRef}
                onMouseEnter={handlePhotoEnter}
                onMouseLeave={handlePhotoLeave}
                onMouseMove={handlePhotoMove}
                className="cursor-crosshair"
                style={{ perspective: '900px', position: 'relative' }}
              >
                <div ref={photoRef} style={{ transformStyle: 'preserve-3d', position: 'relative' }}>

                  {/* Colour base */}
                  <img
                    src={heroImg}
                    alt="Harisankar S"
                    style={{
                      display: 'block', width: '100%',
                      clipPath: 'inset(0 0 12% 0)',
                      marginBottom: '-12%',
                      boxShadow: '14px 14px 0 rgba(0,0,0,0.15)',
                    }}
                  />

                  {/* B&W overlay */}
                  <div ref={photoOverlayRef} style={{ position: 'absolute', inset: 0 }}>
                    <img
                      src={heroImg} alt="" aria-hidden="true"
                      style={{
                        display: 'block', width: '100%',
                        clipPath: 'inset(0 0 12% 0)',
                        marginBottom: '-12%',
                        filter: 'grayscale(1) contrast(1.1) brightness(0.9)',
                      }}
                    />
                  </div>

                  {/* Glass border */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    border: '2px solid rgba(255,255,255,0.35)',
                    boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.4)',
                    pointerEvents: 'none', transform: 'translateZ(10px)',
                  }} />

                  {/* Shine sweep */}
                  <div ref={glassShineRef} style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(108deg, transparent 35%, rgba(255,255,255,0.55) 50%, transparent 65%)',
                    pointerEvents: 'none', transform: 'translateZ(14px)',
                  }} />

                  {/* Hover hint */}
                  <div style={{ position: 'absolute', top: '10px', right: '10px', transform: 'translateZ(8px)' }}>
                    <span style={{ fontSize: '7px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(0,0,0,0.28)' }}>
                      Hover →
                    </span>
                  </div>

                </div>
              </div>
            </div>

          </div>
          {/* ── end col-span-10 ── */}

        </div>
        {/* ── end hero grid ── */}

        {/* Marquee */}
        <div className="border-b-2 border-black bg-[#FF4D2D] py-3 overflow-hidden">
          <div className="marquee-track flex gap-12 whitespace-nowrap">
            {Array(3).fill(['AI · ML · COMPUTER VISION', 'NEXT.JS · REACT · TYPESCRIPT', 'FASTAPI · PYTORCH · YOLOV8', 'SIH 2023 WINNER · SIH 2024 WINNER', 'TRIVANDRUM · KERALA · INDIA']).flat().map((t, i) => (
              <span key={i} className="text-white font-black uppercase tracking-widest text-sm flex-shrink-0">
                {t} <span className="mx-4">—</span>
              </span>
            ))}
          </div>
        </div>

        {/* Featured teaser */}
        <section className="p-8 lg:p-20 border-b-2 border-black grid grid-cols-1 lg:grid-cols-12 gap-0">
          <div className="lg:col-span-4 lg:border-r-2 border-black pr-0 lg:pr-12 mb-8 lg:mb-0">
            <span className="text-[9px] font-black uppercase tracking-widest text-[#FF4D2D] block mb-4">+002 / FEATURED</span>
            <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none">Selected<br />Works.</h2>
          </div>
          <div className="lg:col-span-8 lg:pl-12 flex flex-col justify-center">
            <p className="text-sm font-medium uppercase tracking-tight text-black/60 max-w-lg leading-relaxed mb-8">
              A curated set of projects ranging from geospatial AI to autonomous robotics. Each built end-to-end, from research to deployment.
            </p>
            <Link to="/projects"
              className="group inline-flex items-center gap-4 border-b-2 border-black pb-2 w-max hover:border-[#FF4D2D] hover:text-[#FF4D2D] transition-colors">
              <span className="text-sm font-black uppercase tracking-widest">View All Projects</span>
              <ArrowIcon size={18} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </section>
      </main>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.35; transform: scale(0.8); }
        }
      `}</style>

      <Footer />
    </div>
  )
}
