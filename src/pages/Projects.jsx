import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import ProjectCard from '../components/ProjectCard'
import Footer from '../components/Footer'
import { projects } from '../data/projects'

const ArrowIcon = ({ size = 18, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`flex-shrink-0 ${className}`}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

const FILTERS = ['All', 'AI / Full-Stack', 'AI / NLP', 'Machine Learning', 'Robotics / CV', 'Full-Stack', 'Web App']

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('All')
  const gridRef = useRef(null)

  const filtered = activeFilter === 'All' ? projects : projects.filter((p) => p.category === activeFilter)

  useEffect(() => {
    if (gridRef.current?.children) {
      gsap.fromTo(gridRef.current.children,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out' }
      )
    }
  }, [activeFilter])

  useEffect(() => {
    gsap.fromTo('.projects-hero',
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: 'power4.out' }
    )
  }, [])

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <div className="bg-blob" style={{ background: '#FF4D2D', top: '-100px', left: '-50px', opacity: 0.08 }} />
      <div className="bg-blob" style={{ background: '#2D5BFF', bottom: '-100px', right: '-50px', opacity: 0.07 }} />

      <main className="flex-1 relative z-10">
        {/* Hero */}
        <div className="projects-hero p-8 lg:p-20 border-b-2 border-black bg-[#E5E5E5]">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary block mb-4">
                +001 / PROJECTS
              </span>
              <h1 className="text-[clamp(4rem,10vw,9rem)] font-black uppercase tracking-tighter leading-[0.85]">
                Selected<br />Works.
              </h1>
            </div>
            <div className="max-w-xs">
              <p className="text-sm font-medium uppercase tracking-tight text-black/60 leading-relaxed">
                {projects.length} projects spanning AI, full-stack development, computer vision, and robotics.
              </p>
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="px-8 lg:px-20 py-6 border-b-2 border-black bg-white flex flex-wrap gap-2 items-center">
          <span className="text-[9px] font-black uppercase tracking-widest text-black/30 mr-4">Filter —</span>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`text-[9px] font-black uppercase tracking-widest px-4 py-2 border-2 transition-all ${
                activeFilter === f
                  ? 'bg-black text-white border-black'
                  : 'border-black/20 hover:border-black hover:bg-black hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Projects grid */}
        <div
          ref={gridRef}
          className="p-8 lg:p-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-b-2 border-black bg-[#E5E5E5]"
        >
          {filtered.map((project) => (
            <div
              key={project.id}
              className="border-b-2 border-r-0 md:border-r-2 border-black last:border-b-0 md:last:border-r-0 [&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r-2 lg:[&:nth-child(3n)]:border-r-0"
            >
              <div className="p-6 h-full">
                <ProjectCard project={project} index={project.id} />
              </div>
            </div>
          ))}
        </div>

        {/* GitHub CTA */}
        <section className="p-8 lg:p-20 bg-black text-white grid grid-cols-1 lg:grid-cols-12 gap-0">
          <div className="lg:col-span-8">
            <span className="text-[9px] font-black uppercase tracking-widest text-primary block mb-4">+002 / MORE</span>
            <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter leading-none mb-6">
              See more on<br />GitHub.
            </h2>
            <p className="text-sm font-medium uppercase tracking-tight text-white/60 max-w-sm leading-relaxed">
              Explore all repositories, contributions, and experiments at github.com/hxrrrrri.
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
