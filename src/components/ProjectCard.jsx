import { useRef } from 'react'

const ArrowIcon = ({ size = 16, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`flex-shrink-0 ${className}`}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

const ExternalIcon = ({ size = 14, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)

export default function ProjectCard({ project, index }) {
  const isLight = project.variant === 'light'
  const cardRef = useRef(null)
  const glowRef = useRef(null)
  const containerRef = useRef(null)

  const handleMouseMove = (e) => {
    if (!cardRef.current || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const rx = (y - cy) / 12
    const ry = (cx - x) / 12
    const px = (x / rect.width) * 100
    const py = (y / rect.height) * 100
    cardRef.current.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(16px) translateY(-6px)`
    cardRef.current.style.boxShadow = `${12 + ry}px ${12 + rx}px 0px 0px rgba(0,0,0,0.9)`
    if (glowRef.current) {
      glowRef.current.style.opacity = '1'
      glowRef.current.style.background = isLight
        ? `radial-gradient(circle at ${px}% ${py}%, rgba(255,77,45,0.18) 0%, transparent 65%)`
        : `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.12) 0%, transparent 65%)`
    }
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px) translateY(0px)'
    cardRef.current.style.boxShadow = '4px 4px 0px 0px rgba(0,0,0,1)'
    if (glowRef.current) glowRef.current.style.opacity = '0'
  }

  return (
    <div
      ref={containerRef}
      className="perspective-container"
      style={{ perspective: '1000px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={cardRef}
        className={`relative brutalist-border h-full flex flex-col group cursor-pointer ${
          isLight ? 'bg-white hover:bg-[#FF4D2D]' : 'bg-black hover:bg-black text-white'
        } transition-colors duration-300`}
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.12s ease-out, box-shadow 0.12s ease-out',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        }}
      >
        <div ref={glowRef} className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-150" style={{ opacity: 0 }} />

        <div className="tilt-card-content p-6 flex-1 flex flex-col">
          {/* Meta row */}
          <div className="flex items-start justify-between mb-6">
            <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 ${
              isLight ? 'bg-black text-white group-hover:bg-white group-hover:text-black' : 'bg-[#FF4D2D] text-white'
            } transition-colors`}>
              {project.category}
            </span>
            <span className={`text-[10px] font-black tracking-widest ${
              isLight ? 'text-black/30 group-hover:text-white/50' : 'text-white/30'
            } transition-colors`}>
              {project.number}
            </span>
          </div>

          {/* Title */}
          <h3 className={`text-3xl lg:text-4xl font-black uppercase tracking-tighter leading-none mb-4 ${
            isLight ? 'text-black group-hover:text-white' : 'text-white'
          } transition-colors`}>
            {project.title}
          </h3>

          {/* Description */}
          <p className={`text-xs font-medium leading-relaxed uppercase tracking-tight flex-1 ${
            isLight ? 'text-black/60 group-hover:text-white/80' : 'text-white/60'
          } transition-colors`}>
            {project.description}
          </p>

          {/* Footer row */}
          <div className="mt-6 flex items-end justify-between gap-2">
            <div className="flex flex-wrap gap-1 flex-1">
              {project.tech.slice(0, 3).map((t) => (
                <span key={t} className={`text-[8px] font-black uppercase tracking-widest border px-2 py-0.5 ${
                  isLight
                    ? 'border-black/20 text-black/50 group-hover:border-white/40 group-hover:text-white/60'
                    : 'border-white/20 text-white/50'
                } transition-colors`}>
                  {t}
                </span>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex gap-1 flex-shrink-0">
              {/* GitHub link */}
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center w-9 h-9 border-2 transition-all ${
                  isLight
                    ? 'border-black group-hover:border-white group-hover:bg-white group-hover:text-[#FF4D2D]'
                    : 'border-white/40 group-hover:border-[#FF4D2D] group-hover:bg-[#FF4D2D]'
                }`}
                onClick={(e) => e.stopPropagation()}
                aria-label={`View ${project.title} on GitHub`}
                title="GitHub"
              >
                <ArrowIcon size={14} />
              </a>

              {/* Vercel live demo — only if exists */}
              {project.vercelLink && (
                <a
                  href={project.vercelLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center w-9 h-9 border-2 transition-all ${
                    isLight
                      ? 'border-black group-hover:border-white group-hover:bg-white group-hover:text-[#FF4D2D]'
                      : 'border-white/40 group-hover:border-[#FF4D2D] group-hover:bg-[#FF4D2D]'
                  }`}
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`View ${project.title} live demo`}
                  title="Live Demo"
                >
                  <ExternalIcon size={13} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom accent line */}
        <div className={`h-1 w-full transition-all duration-500 ${isLight ? 'bg-[#FF4D2D]' : 'bg-white/20'}`} />
      </div>
    </div>
  )
}
