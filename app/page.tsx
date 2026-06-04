import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import DailyLogForm from '@/components/DailyLogForm'

export const dynamic = 'force-dynamic'

const colorMap: Record<string, string> = {
  teal: '#1EB88A', blue: '#4A9EFF', amber: '#F0A348', coral: '#E86B5F',
}
const bgMap: Record<string, string> = {
  teal: 'rgba(30,184,138,0.08)', blue: 'rgba(74,158,255,0.08)',
  amber: 'rgba(240,163,72,0.08)', coral: 'rgba(232,107,95,0.08)',
}

export default async function DashboardPage() {
  const phases = await prisma.phase.findMany({
    orderBy: { order: 'asc' },
    include: { subjects: true },
  })

  const allSubjects = phases.flatMap(p => p.subjects)
  const totalDone = allSubjects.filter(s => s.done).length
  const totalAll  = allSubjects.length
  const overallPct = totalAll ? Math.round((totalDone / totalAll) * 100) : 0

  const today = new Date()
  const startDate = new Date('2025-01-01')
  const elapsed = Math.max(0, Math.floor((today.getTime() - startDate.getTime()) / 86400000))
  const dayNum = Math.min(elapsed + 1, 120)

  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* Hero */}
      <div style={{ paddingTop: 8 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--teal)', letterSpacing: '0.1em', marginBottom: 8 }}>
          DAY {dayNum} / 120
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 8 }}>
          Your Study<br />
          <span style={{ color: 'var(--teal)' }}>Dashboard</span>
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 14, maxWidth: 420 }}>
          4 months · 6 hours/day · software engineering foundations to interview-ready.
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Overall Progress', value: `${overallPct}%` },
          { label: 'Topics Done', value: `${totalDone}/${totalAll}` },
          { label: 'Study Hours/Day', value: '6h' },
          { label: 'Aptitude/Day', value: '1h' },
        ].map(s => (
          <div key={s.label} className="card-sm" style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: 'var(--teal)' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Overall progress bar */}
      <div className="card-sm">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600 }}>Overall Completion</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--teal)' }}>{overallPct}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${overallPct}%` }} />
        </div>
      </div>

      {/* Phase cards */}
      <div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, marginBottom: 12, letterSpacing: '-0.01em' }}>Study Phases</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {phases.map(p => {
            const done = p.subjects.filter(s => s.done).length
            const pct = p.subjects.length ? Math.round((done / p.subjects.length) * 100) : 0
            const col = colorMap[p.color] || '#1EB88A'
            const bg  = bgMap[p.color] || 'rgba(30,184,138,0.08)'
            return (
              <Link key={p.id} href="/phases" style={{ textDecoration: 'none' }}>
                <div className="card-sm" style={{ transition: 'border-color 0.15s', cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = col + '55')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700 }}>{p.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{p.month}</div>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: col, background: bg, padding: '2px 8px', borderRadius: 99 }}>{pct}%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${pct}%`, background: col }} />
                  </div>
                  <div style={{ marginTop: 6, fontSize: 11, color: 'var(--muted)' }}>{done}/{p.subjects.length} topics</div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Daily log */}
      <DailyLogForm />

      {/* Quick links */}
      <div style={{ display: 'flex', gap: 10, paddingBottom: 16 }}>
        <Link href="/timetable"><button className="btn-primary">View Timetable →</button></Link>
        <Link href="/phases"><button className="btn-ghost">Edit Phases</button></Link>
      </div>
    </div>
  )
}
