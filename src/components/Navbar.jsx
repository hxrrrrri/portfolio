import { Link, useLocation } from 'react-router-dom'

const ArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

const GitHubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>
)

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <header className="flex items-center justify-between px-6 py-5 lg:px-20 border-b-2 border-black bg-white sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <Link to="/" className="font-black text-2xl tracking-tighter hover:text-primary transition-colors">
          Hxrrrrri.
        </Link>
        <nav className="hidden md:flex gap-6 text-[10px] font-bold uppercase tracking-widest">
          <Link to="/projects" className={`hover:underline transition-colors ${pathname === '/projects' ? 'text-primary' : ''}`}>
            Projects
          </Link>
          <Link to="/showcase" className={`hover:underline transition-colors ${pathname === '/showcase' ? 'text-primary' : ''}`}>
            3D Lab
          </Link>
          <Link to="/about" className={`hover:underline transition-colors ${pathname === '/about' ? 'text-primary' : ''}`}>
            About
          </Link>
          <Link to="/contact" className={`hover:underline transition-colors ${pathname === '/contact' ? 'text-primary' : ''}`}>
            Contact
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-6">
        <span className="text-[10px] font-bold uppercase tracking-widest hidden md:block">B.Tech CSE AI '26</span>
        <a
          href="https://github.com/hxrrrrri"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-8 w-8 items-center justify-center border-2 border-black hover:bg-black hover:text-white transition-colors"
          aria-label="GitHub"
        >
          <GitHubIcon />
        </a>
      </div>
    </header>
  )
}
