'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/',            label: 'Dashboard' },
  { href: '/timetable',  label: 'Timetable' },
  { href: '/phases',     label: 'Phases' },
]

export default function Navbar() {
  const path = usePathname()
  return (
    <nav style={{
      background: 'rgba(13,15,20,0.85)',
      borderBottom: '1px solid var(--border)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between" style={{ height: 56 }}>
        <Link href="/" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, color: 'var(--teal)', letterSpacing: '-0.02em', textDecoration: 'none' }}>
          Study<span style={{ color: 'var(--text)' }}>OS</span>
        </Link>
        <div style={{ display: 'flex', gap: 4 }}>
          {links.map(l => (
            <Link key={l.href} href={l.href} className={`nav-link${path === l.href ? ' active' : ''}`}>
              {l.label}
            </Link>
          ))}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>
          120 days
        </div>
      </div>
    </nav>
  )
}
