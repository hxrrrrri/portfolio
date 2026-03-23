import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import Footer from '../components/Footer'
import { skills, socials } from '../data/projects'

const ArrowIcon = ({ size = 24, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`flex-shrink-0 ${className}`}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

export default function About() {
  const cardRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.05 })
    tl.fromTo('.about-hero-left', { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.85, ease: 'power4.out' })
    tl.fromTo('.about-hero-right', { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.85, ease: 'power4.out' }, '<0.1')
    tl.fromTo('.about-story', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, '<0.2')
    tl.fromTo('.skill-block', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, stagger: 0.1, ease: 'power3.out' }, '<0.15')
    tl.fromTo('.about-social-link', { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, stagger: 0.08, ease: 'power2.out' }, '<0.1')
    return () => tl.kill()
  }, [])

  const handleMouseMove = (e) => {
    const card = cardRef.current
    const container = containerRef.current
    if (!card || !container) return
    const rect = container.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 14
    const rotateY = (centerX - x) / 14
    const px = (x / rect.width) * 100
    const py = (y / rect.height) * 100
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`
    card.style.setProperty('--mouse-x', `${px}%`)
    card.style.setProperty('--mouse-y', `${py}%`)
  }

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)'
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#E5E5E5]">
      <div className="bg-blob" style={{ background: '#FF4D2D', top: '-50px', right: '-100px', opacity: 0.08 }} />
      <div className="bg-blob" style={{ background: '#2D5BFF', bottom: '200px', left: '-100px', opacity: 0.07 }} />

      <main className="flex-1 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 border-b-2 border-black">
          {/* Left */}
          <div className="about-hero-left lg:col-span-4 border-b-2 lg:border-b-0 lg:border-r-2 border-black p-8 lg:p-16 flex flex-col justify-between bg-[#E5E5E5]">
            <div>
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#FF4D2D] block mb-6">X/LABS</span>
              <h1 className="text-[clamp(5rem,10vw,8rem)] font-black uppercase tracking-tighter leading-[0.8]">
                lab<span className="text-[#FF4D2D]">.</span>
              </h1>
            </div>
            <div className="flex items-center gap-4 mt-8">
              <span className="text-[10px] font-black uppercase tracking-widest text-black/40">Trivandrum, Kerala</span>
              <div className="vertical-text text-[8px] font-bold uppercase tracking-[0.4em] text-black/20">001</div>
            </div>
          </div>

          {/* Right */}
          <div className="about-hero-right lg:col-span-8 flex flex-col">
            <div className="bg-[#FF4D2D] border-b-2 border-black flex items-end p-8 lg:p-12" style={{ minHeight: '120px' }}>
              <span className="text-white text-[9px] font-black uppercase tracking-widest">B.Tech CSE (AI) · MBCET · 2026</span>
            </div>
            <div
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="flex-1 p-8 lg:p-16 flex items-center justify-center bg-white"
              style={{ minHeight: '300px', perspective: '1000px' }}
            >
              <div
                ref={cardRef}
                className="w-full max-w-lg border-2 border-black p-8 lg:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                style={{
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.15s ease-out, box-shadow 0.3s ease',
                  background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,77,45,0.08), #ffffff 65%)',
                  '--mouse-x': '50%',
                  '--mouse-y': '50%',
                }}
              >
                <div className="space-y-4">
                  <div className="text-[9px] font-black uppercase tracking-widest text-[#FF4D2D]">Harisankar S.</div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter leading-none">
                    AI/ML Engineer &<br />Full-Stack Developer
                  </h2>
                  <p className="text-xs font-medium uppercase tracking-tight text-black/60 leading-relaxed">
                    Two-time Smart India Hackathon winner. Interned at ICT Academy of Kerala building MERN applications.
                    Passionate about geospatial AI, computer vision, and deploying models that solve real-world problems.
                  </p>
                  <div className="flex gap-2 mt-4 flex-wrap">
                    <span className="text-[8px] font-black uppercase tracking-widest border-2 border-black px-2 py-1">SIH '23</span>
                    <span className="text-[8px] font-black uppercase tracking-widest border-2 border-black px-2 py-1">SIH '24</span>
                    <span className="text-[8px] font-black uppercase tracking-widest border-2 border-[#FF4D2D] text-[#FF4D2D] px-2 py-1">Open to Work</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Story */}
        <section className="about-story p-8 lg:p-20 border-b-2 border-black grid grid-cols-1 lg:grid-cols-12 gap-0 bg-[#E5E5E5]">
          <div className="lg:col-span-4 lg:border-r-2 border-black pr-0 lg:pr-12 mb-8 lg:mb-0">
            <span className="text-[9px] font-black uppercase tracking-widest text-[#FF4D2D] block mb-4">+002 / STORY</span>
            <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-none">
              Creative<br />Problem<br />Solver.
            </h2>
          </div>
          <div className="lg:col-span-8 lg:pl-12 space-y-6">
            <p className="text-sm font-medium uppercase tracking-tight text-black/70 leading-relaxed">
              Final year CSE (AI) student at Mar Baselios College of Engineering and Technology, Trivandrum. I build full-stack AI platforms — from satellite imagery analysis to autonomous robotics.
            </p>
            <p className="text-sm font-medium uppercase tracking-tight text-black/70 leading-relaxed">
              My work spans the full stack: React / Next.js frontends, FastAPI backends, PyTorch models trained on custom datasets, and end-to-end MLOps pipelines. I care about shipping things that actually work.
            </p>
            <p className="text-sm font-medium uppercase tracking-tight text-black/70 leading-relaxed">
              Outside of code, I obsess over mechanical keyboards — currently rocking an R75 wireless board with a custom VIA config — and design posters and album covers in Figma.
            </p>
          </div>
        </section>

        {/* Skills */}
        <section className="border-b-2 border-black bg-[#E5E5E5]">
          <div className="p-8 lg:p-20 pb-4 lg:pb-4">
            <span className="text-[9px] font-black uppercase tracking-widest text-[#FF4D2D] block mb-2">+003 / CAPABILITIES</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 border-t-2 border-black">
            {[
              { key: 'frontend', label: 'Frontend & Web', items: skills.frontend },
              { key: 'backend', label: 'Backend & Infra', items: skills.backend },
              { key: 'ai', label: 'AI / ML', items: skills.ai },
            ].map((block, i) => (
              <div key={block.key} className={`skill-block p-8 lg:p-12 border-b-2 lg:border-b-0 ${i < 2 ? 'lg:border-r-2' : ''} border-black bg-white`}>
                <h3 className="text-[9px] font-black uppercase tracking-widest text-[#FF4D2D] mb-6">{block.label}</h3>
                <ul className="space-y-3">
                  {block.items.map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-[#FF4D2D] flex-shrink-0" />
                      <span className="text-sm font-bold uppercase tracking-tight">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Socials */}
        <section className="p-8 lg:p-20 border-b-2 border-black bg-white">
          <span className="text-[9px] font-black uppercase tracking-widest text-[#FF4D2D] block mb-8">+004 / FIND ME ONLINE</span>
          <div className="flex flex-col gap-1">
            {[
              { label: 'GitHub', href: socials.github },
              { label: 'LinkedIn', href: socials.linkedin },
              { label: 'Email', href: `mailto:${socials.email}` },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target={label !== 'Email' ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="about-social-link text-3xl lg:text-5xl font-black uppercase hover:text-[#FF4D2D] transition-colors flex items-center justify-between group border-t-2 border-black py-4"
              >
                {label}
                <ArrowIcon size={32} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
