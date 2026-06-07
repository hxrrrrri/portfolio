import { useEffect, useState } from 'react'
import { gsap } from 'gsap'
import Footer from '../components/Footer'
import { socials } from '../data/projects'

const ArrowIcon = ({ size = 20, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`flex-shrink-0 ${className}`}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.05 })
    tl.fromTo('.contact-left', { x: -60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9, ease: 'power4.out' })
    tl.fromTo('.contact-right', { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9, ease: 'power4.out' }, '<0.1')
    return () => tl.kill()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setError('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
          company: '',
        }),
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Contact API not found. Use Vercel runtime (npm run dev:vercel) or deploy on Vercel.')
        }
        throw new Error(result.error || 'Something went wrong. Please try again.')
      }

      setSent(true)
      setForm({ name: '', email: '', message: '' })
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setError(err.message || 'Could not send your message. Please try again.')
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#E5E5E5]">
      {/* Blob — very low opacity so it never bleeds over content */}
      <div className="bg-blob" style={{ background: '#FF4D2D', top: '-80px', left: '-80px', opacity: 0.08 }} />

      <main className="flex-1 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 border-b-2 border-black">

          {/* Left */}
          <div className="contact-left lg:col-span-4 border-b-2 lg:border-b-0 lg:border-r-2 border-black p-8 lg:p-20 flex flex-col justify-between bg-white">
            <div className="space-y-12">
              <div className="space-y-2">
                <span className="text-sm font-bold uppercase tracking-tighter border-b-2 border-black pb-1 inline-block">
                  Contact / 001
                </span>
                <h1 className="text-[clamp(3.5rem,8vw,7rem)] font-black leading-[0.8] tracking-tighter uppercase">
                  Contact<span className="text-[#FF4D2D]">.</span>
                </h1>
              </div>
              <p className="text-sm font-medium leading-relaxed max-w-xs uppercase tracking-tight text-black/60">
                Open to full-time roles, freelance collaborations, and interesting projects. Reach out — I respond fast.
              </p>
            </div>
            <div className="mt-20 space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-widest">Find me online —</p>
              <div className="flex flex-col gap-1">
                {[
                  { label: 'LinkedIn', href: socials.linkedin },
                  { label: 'GitHub', href: socials.github },
                  { label: 'Email', href: `mailto:${socials.email}` },
                ].map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target={label !== 'Email' ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="text-xl font-black uppercase hover:text-[#FF4D2D] transition-colors flex items-center justify-between group border-t-2 border-black py-3"
                  >
                    {label}
                    <ArrowIcon size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Form — solid backgrounds, no backdrop-filter */}
          <div className="contact-right lg:col-span-8 relative flex flex-col">
            <div className="bg-[#FF4D2D] border-b-2 border-black flex items-end p-8" style={{ minHeight: '160px' }}>
              <h2 className="text-white text-4xl lg:text-6xl font-black uppercase tracking-tighter">
                Start a project
              </h2>
            </div>
            <div className="flex-1 p-8 lg:p-12 bg-[#E5E5E5]">
              <div className="border-2 border-black bg-white p-8 lg:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                {sent ? (
                  <div className="py-12 text-center">
                    <div className="text-5xl font-black uppercase tracking-tighter mb-4">Sent<span className="text-[#FF4D2D]">.</span></div>
                    <p className="text-sm font-bold uppercase tracking-widest text-black/60">Thanks! I'll get back to you soon.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <form onSubmit={handleSubmit} className="space-y-8">
                      {/* Honeypot field to reduce bot submissions */}
                      <input
                        type="text"
                        name="company"
                        autoComplete="off"
                        tabIndex={-1}
                        className="hidden"
                        aria-hidden="true"
                      />
                      {[
                        { num: '01', label: 'Full Name', type: 'text', key: 'name', placeholder: 'ENTER NAME' },
                        { num: '02', label: 'Email', type: 'email', key: 'email', placeholder: 'EMAIL ADDRESS' },
                      ].map(({ num, label, type, key, placeholder }) => (
                        <div key={key} className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest">{num} / {label}</label>
                          <input
                            type={type}
                            required
                            placeholder={placeholder}
                            value={form[key]}
                            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                            disabled={status === 'loading'}
                            className="w-full bg-transparent border-b-2 border-black px-0 py-4 text-xl font-bold placeholder:text-black/20 focus:outline-none focus:border-[#FF4D2D] transition-colors"
                          />
                        </div>
                      ))}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest">03 / Message</label>
                        <textarea
                          rows={3}
                          required
                          placeholder="TELL ME ABOUT IT"
                          value={form.message}
                          onChange={(e) => setForm({ ...form, message: e.target.value })}
                          disabled={status === 'loading'}
                          className="w-full bg-transparent border-b-2 border-black px-0 py-4 text-xl font-bold placeholder:text-black/20 focus:outline-none focus:border-[#FF4D2D] transition-colors resize-none"
                        />
                      </div>
                      {status === 'error' && (
                        <p className="text-sm font-bold uppercase tracking-wide text-red-600">{error}</p>
                      )}
                      <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="group flex items-center gap-4 bg-black text-white px-8 py-6 hover:bg-[#FF4D2D] transition-colors w-full lg:w-auto"
                      >
                        <span className="text-lg font-black uppercase">{status === 'loading' ? 'Sending...' : 'Send Message'}</span>
                        <ArrowIcon size={20} className="group-hover:translate-x-2 transition-transform" />
                      </button>
                    </form>

                    <div className="flex flex-col justify-between items-end">
                      <div className="hidden lg:block">
                        <div className="vertical-text text-[10px] font-bold uppercase tracking-[0.3em] text-black/30">
                          HARISANKAR S. — PORTFOLIO 2026
                        </div>
                      </div>
                      <div className="w-full lg:w-64 space-y-8 text-right lg:text-left">
                        <div className="border-t-2 border-black pt-4">
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#FF4D2D]">Email</p>
                          <a href={`mailto:${socials.email}`} className="text-base font-bold hover:text-[#FF4D2D] transition-colors">
                            {socials.email}
                          </a>
                        </div>
                        <div className="border-t-2 border-black pt-4">
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#FF4D2D]">Based in</p>
                          <p className="text-lg font-bold">Trivandrum, IN</p>
                        </div>
                        <div className="border-t-2 border-black pt-4">
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#FF4D2D]">Status</p>
                          <p className="text-lg font-bold">Open to Work</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
