import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import Footer from '../components/Footer'
import { projects } from '../data/projects'

const ArrowIcon = ({ size = 20, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`flex-shrink-0 ${className}`}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

const ChevronIcon = ({ direction = 'right', size = 20, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`flex-shrink-0 ${className}`}>
    {direction === 'right' ? <polyline points="9 18 15 12 9 6" /> : <polyline points="15 18 9 12 15 6" />}
  </svg>
)

// Each card manages its own isolated float — no shared timeline, no collision
function Project3DCard({ project, isActive, onActivate, floatOffset }) {
  const cardRef = useRef(null)
  const wrapRef = useRef(null)
  const glowRef = useRef(null)
  const tweenRef = useRef(null)

  // Independent float per card — staggered phase prevents sync collision
  useEffect(() => {
    if (!wrapRef.current) return
    const amplitude = 6 + (floatOffset % 3) * 2        // 6–10 px unique amplitude
    const duration  = 2.8 + floatOffset * 0.37           // 2.8–5.0 s unique period
    const direction = floatOffset % 2 === 0 ? -1 : 1    // alternating start direction
    const delay     = floatOffset * 0.22                 // staggered start

    tweenRef.current = gsap.to(wrapRef.current, {
      y: `${direction * amplitude}px`,
      duration,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay,
    })
    return () => tweenRef.current?.kill()
  }, [floatOffset])

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const rx = (y - cy) / 10
    const ry = (cx - x) / 10
    const px = (x / rect.width) * 100
    const py = (y / rect.height) * 100
    cardRef.current.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(20px)`
    if (glowRef.current) {
      glowRef.current.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(255,77,45,0.25) 0%, transparent 60%)`
    }
  }

  const handleMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px)'
    if (glowRef.current) glowRef.current.style.background = 'none'
  }

  const isLight = project.variant === 'light'

  return (
    // Outer wrap owns the float translate — keeps cards in their grid cell
    <div ref={wrapRef} style={{ willChange: 'transform' }}>
      <div
        className="perspective-container cursor-pointer w-full"
        style={{ perspective: '1000px' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onActivate}
      >
        <div
          ref={cardRef}
          className={`relative border-2 border-black transition-shadow duration-300 ${
            isActive
              ? 'shadow-[16px_16px_0px_0px_rgba(255,77,45,1)]'
              : 'shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
          } ${isLight ? 'bg-white' : 'bg-black text-white'}`}
          style={{ transformStyle: 'preserve-3d', transition: 'transform 0.15s ease-out, box-shadow 0.3s ease' }}
        >
          <div ref={glowRef} className="absolute inset-0 pointer-events-none z-10 transition-all duration-100" />
          {isActive && <div className="absolute top-0 left-0 right-0 h-1 bg-[#FF4D2D] z-20" />}

          <div className="p-6 lg:p-8 relative z-20">
            <div className="flex items-start justify-between mb-6">
              <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 ${isLight ? 'bg-black text-white' : 'bg-[#FF4D2D] text-white'}`}>
                {project.category}
              </span>
              <span className={`text-[10px] font-black tracking-widest ${isLight ? 'text-black/30' : 'text-white/30'}`}>
                {project.number}
              </span>
            </div>

            <div
              className="text-[6rem] font-black leading-none tracking-tighter mb-2 select-none"
              style={{
                color: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)',
                lineHeight: 0.8,
                transform: 'translateZ(30px)',
              }}
            >
              {project.number}
            </div>

            <h3
              className={`text-2xl lg:text-3xl font-black uppercase tracking-tighter leading-none mb-3 ${isLight ? 'text-black' : 'text-white'}`}
              style={{ transform: 'translateZ(20px)' }}
            >
              {project.title}
            </h3>
            <p className={`text-xs font-medium leading-relaxed uppercase tracking-tight line-clamp-3 ${isLight ? 'text-black/60' : 'text-white/60'}`}>
              {project.description}
            </p>

            <div className="flex flex-wrap gap-1 mt-4">
              {project.tech.slice(0, 3).map((t) => (
                <span key={t} className={`text-[8px] font-black uppercase tracking-widest border px-2 py-0.5 ${isLight ? 'border-black/20 text-black/50' : 'border-white/20 text-white/50'}`}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProjectDetailPanel({ project }) {
  const panelRef = useRef(null)

  useEffect(() => {
    if (panelRef.current) {
      gsap.fromTo(panelRef.current, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' })
    }
  }, [project.id])

  return (
    <div ref={panelRef} className="h-full flex flex-col">
      <div className="relative overflow-hidden bg-black text-white p-8 lg:p-12 border-b-2 border-black flex-shrink-0" style={{ minHeight: '200px' }}>
        <div className="absolute top-0 right-0 text-[10rem] font-black leading-none tracking-tighter select-none pointer-events-none" style={{ color: 'rgba(255,255,255,0.05)', lineHeight: 0.9 }}>
          {project.number}
        </div>
        <div className="relative z-10">
          <span className="text-[9px] font-black uppercase tracking-widest text-[#FF4D2D] block mb-4">{project.category}</span>
          <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-none mb-4">{project.title}</h2>
          <p className="text-sm font-medium uppercase tracking-tight text-white/60 leading-relaxed max-w-lg">{project.description}</p>
        </div>
      </div>

      <div className="flex-1 bg-[#E5E5E5] p-8 lg:p-12">
        <div className="space-y-8">
          <div>
            <span className="text-[9px] font-black uppercase tracking-widest text-[#FF4D2D] block mb-4">Stack</span>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span key={t} className="text-xs font-black uppercase tracking-widest border-2 border-black px-3 py-2 bg-white">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[9px] font-black uppercase tracking-widest text-[#FF4D2D] block mb-4">Highlights</span>
            <ul className="space-y-2">
              {getHighlights(project).map((h, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#FF4D2D] flex-shrink-0 mt-1.5" />
                  <span className="text-sm font-bold uppercase tracking-tight text-black/70">{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3">
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 bg-black text-white px-6 py-3 hover:bg-[#FF4D2D] transition-colors"
            >
              <span className="text-sm font-black uppercase tracking-widest">GitHub</span>
              <ArrowIcon size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
            {project.vercelLink && (
              <a
                href={project.vercelLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 border-2 border-black px-6 py-3 hover:bg-black hover:text-white transition-colors"
              >
                <span className="text-sm font-black uppercase tracking-widest">Live Demo</span>
                <ArrowIcon size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function getHighlights(project) {
  const map = {
    1: ['Multi-tile satellite boundary detection via YOLOv8', '7 live environmental data APIs integrated', 'Interactive 3D floor plan viewer via React Three Fiber', 'Zone-based strip packer with named spatial variants', 'Deployed: Next.js on Vercel + FastAPI on Railway'],
    2: ['Semantic search across multiple languages', 'Vector embeddings with FAISS indexing', 'Context-aware document Q&A with LangChain', 'HuggingFace models for multilingual NLP', 'FastAPI backend with streaming responses'],
    3: ['XGBoost pipeline on physiological sensor data', 'SHAP explainability for model interpretability', 'Feature engineering across 10+ biomarkers', 'Streamlit dashboard for real-time inference', 'Trained on Kaggle wearable stress dataset'],
    4: ['Custom-trained YOLOv8 wildlife detection model', 'Real-time object tracking at 30+ FPS', 'Autonomous navigation with obstacle avoidance', 'OpenCV-based visual pipeline on embedded hardware', 'Alert system for ranger notifications'],
    5: ['Full MERN stack with JWT authentication', 'Role-based access control (admin / attendee)', 'Real-time event updates via WebSockets', 'MongoDB aggregation pipelines for analytics', 'Built collaboratively during ICT Academy internship'],
    6: ['Category-wise KTU activity point calculation', 'PDF export with jsPDF', 'Responsive form UI with live score tracking', 'Deployed as a static React app on Vercel', 'Used by 100+ students at MBCET'],
    7: ['Secure Python execution tracing with line/call/return events', 'Timeline playback with synced variables, output, and call stack', 'Modular visualizers for arrays, graphs, trees, heaps, DP tables, and recursion', 'Streaming execution endpoint for progressive frontend updates', 'Dockerized multi-service architecture for reproducible deployment'],
    8: ['Autonomous tool execution across file system, shell, git, and web tasks', 'Real-time SSE chat and tool stream for transparent agent workflows', 'Multi-provider LLM routing with strategy-based failover', 'Session replay, custom skills/prompts, and collaboration sharing links', 'Production-minded controls with feature flags, permissions, and observability'],
  }
  return map[project.id] || ['End-to-end implementation', 'Production deployed', 'Open source on GitHub']
}

export default function Showcase() {
  const [activeId, setActiveId] = useState(1)
  const activeProject = projects.find((p) => p.id === activeId)

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.05 })
    tl.fromTo('.showcase-hero', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power4.out' })
    tl.fromTo('.proj-card', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }, '<0.2')
    return () => tl.kill()
  }, [])

  const handlePrev = () => setActiveId((id) => (id === 1 ? projects.length : id - 1))
  const handleNext = () => setActiveId((id) => (id === projects.length ? 1 : id + 1))

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#E5E5E5]">
      <div className="bg-blob" style={{ background: '#FF4D2D', top: '-80px', right: '-100px', opacity: 0.08 }} />
      <div className="bg-blob" style={{ background: '#2D5BFF', bottom: '100px', left: '-100px', opacity: 0.07 }} />

      <main className="flex-1 relative z-10">
        <div className="showcase-hero p-8 lg:p-20 border-b-2 border-black bg-[#E5E5E5]">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#FF4D2D] block mb-4">+001 / 3D SHOWCASE</span>
              <h1 className="text-[clamp(3.5rem,9vw,8rem)] font-black uppercase tracking-tighter leading-[0.85]">
                Interactive<br />Project Lab.
              </h1>
            </div>
            <p className="text-sm font-medium uppercase tracking-tight text-black/60 max-w-xs leading-relaxed">
              Click a card to explore each project in detail. Hover for 3D perspective.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 border-b-2 border-black" style={{ minHeight: '80vh' }}>
          {/* Left — card grid */}
          <div className="lg:col-span-7 border-b-2 lg:border-b-0 lg:border-r-2 border-black p-8 lg:p-12 bg-[#E5E5E5]">
            <div className="flex items-center justify-between mb-8">
              <span className="text-[9px] font-black uppercase tracking-widest text-black/30">
                {activeId.toString().padStart(2, '0')} / {projects.length.toString().padStart(2, '0')}
              </span>
              <div className="flex gap-2">
                <button onClick={handlePrev} className="w-10 h-10 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors" aria-label="Previous project">
                  <ChevronIcon direction="left" size={18} />
                </button>
                <button onClick={handleNext} className="w-10 h-10 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors" aria-label="Next project">
                  <ChevronIcon direction="right" size={18} />
                </button>
              </div>
            </div>

            {/* Grid — each card has its own float via floatOffset prop, no GSAP on the wrapper */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((project, i) => (
                <div key={project.id} className="proj-card">
                  <Project3DCard
                    project={project}
                    isActive={activeId === project.id}
                    onActivate={() => setActiveId(project.id)}
                    floatOffset={i}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right — Detail panel */}
          <div className="lg:col-span-5 flex flex-col overflow-hidden">
            {activeProject && <ProjectDetailPanel key={activeId} project={activeProject} />}
          </div>
        </div>

        <section className="p-8 lg:p-20 bg-black text-white grid grid-cols-1 lg:grid-cols-12 gap-0">
          <div className="lg:col-span-8">
            <span className="text-[9px] font-black uppercase tracking-widest text-[#FF4D2D] block mb-4">+002 / GITHUB</span>
            <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter leading-none mb-6">
              Explore more<br />on GitHub.
            </h2>
            <p className="text-sm font-medium uppercase tracking-tight text-white/60 max-w-sm leading-relaxed">
              All repositories, contributions, and experiments live at github.com/hxrrrrri
            </p>
          </div>
          <div className="lg:col-span-4 flex items-end justify-start lg:justify-end mt-8 lg:mt-0">
            <a
              href="https://github.com/hxrrrrri"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 border-2 border-white px-8 py-4 hover:bg-white hover:text-black transition-colors"
            >
              <span className="text-sm font-black uppercase tracking-widest">hxrrrrri</span>
              <ArrowIcon size={18} className="group-hover:translate-x-2 transition-transform" />
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
