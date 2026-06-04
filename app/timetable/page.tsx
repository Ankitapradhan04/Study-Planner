import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const typeConfig: Record<string, { pill: string; label: string }> = {
  sleep:    { pill: 'pill-sleep',    label: 'Sleep' },
  morning:  { pill: 'pill-morning',  label: 'Morning' },
  meal:     { pill: 'pill-meal',     label: 'Meal' },
  study:    { pill: 'pill-study',    label: 'Study' },
  aptitude: { pill: 'pill-aptitude', label: 'Aptitude' },
  break:    { pill: 'pill-break',    label: 'Break' },
  free:     { pill: 'pill-free',     label: 'Free' },
}

export default async function TimetablePage() {
  const blocks = await prisma.timetableBlock.findMany({ orderBy: { order: 'asc' } })

  const studyBlocks   = blocks.filter(b => b.type === 'study').length
  const aptitudeBlocks = blocks.filter(b => b.type === 'aptitude').length

  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--teal)', letterSpacing: '0.1em', marginBottom: 6 }}>DAILY SCHEDULE</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 800, letterSpacing: '-0.03em' }}>
          24-Hour <span style={{ color: 'var(--teal)' }}>Timetable</span>
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 6 }}>
          Fixed schedule · Sleep 23:00–06:00 · Meals at 07:30, 12:30, 19:30
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {[
          { label: 'Study sessions', value: studyBlocks, pill: 'pill-study' },
          { label: 'Aptitude sets', value: aptitudeBlocks, pill: 'pill-aptitude' },
          { label: 'Meals', value: 3, pill: 'pill-meal' },
          { label: 'Sleep', value: '8h', pill: 'pill-sleep' },
        ].map(s => (
          <div key={s.label} className="card-sm" style={{ flex: 1, minWidth: 110, textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>{s.value}</div>
            <span className={`pill ${s.pill}`} style={{ marginTop: 4 }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {Object.entries(typeConfig).map(([k, v]) => (
          <span key={k} className={`pill ${v.pill}`}>{v.label}</span>
        ))}
      </div>

      {/* Timetable */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Time', 'Type', 'Activity'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--muted)', textTransform: 'uppercase' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {blocks.map((block, i) => {
              const cfg = typeConfig[block.type] || { pill: 'pill-break', label: block.type }
              const isStudy = block.type === 'study' || block.type === 'aptitude'
              return (
                <tr key={block.id} style={{
                  borderBottom: i < blocks.length - 1 ? '1px solid var(--border)' : 'none',
                  background: isStudy ? 'rgba(255,255,255,0.015)' : 'transparent',
                  transition: 'background 0.1s',
                }}>
                  <td style={{ padding: '11px 16px', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                    {block.startTime} – {block.endTime}
                  </td>
                  <td style={{ padding: '11px 16px' }}>
                    <span className={`pill ${cfg.pill}`}>{cfg.label}</span>
                  </td>
                  <td style={{ padding: '11px 16px', fontSize: 13, color: 'var(--text)' }}>
                    {block.label}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', padding: '0 0 16px' }}>
        Total: 6h study + 1h aptitude per day · 120 days · ~840 study hours over 4 months
      </div>
    </div>
  )
}
