import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="px-6 py-12 lg:px-20 bg-black text-white flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="text-[10px] font-black uppercase tracking-[0.5em]">HARISANKAR S. © 2025</div>
      <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest">
        <Link to="/projects" className="hover:text-primary transition-colors">Works</Link>
        <Link to="/showcase" className="hover:text-primary transition-colors">3D Lab</Link>
        <Link to="/about" className="hover:text-primary transition-colors">About</Link>
        <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
      </div>
      <div className="text-[10px] font-black uppercase tracking-widest opacity-40">Built with React + Vite.</div>
    </footer>
  )
}
