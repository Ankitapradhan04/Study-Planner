import { prisma } from '@/lib/prisma'
import PhaseEditor from '@/components/PhaseEditor'

export const dynamic = 'force-dynamic'

export default async function PhasesPage() {
  const phases = await prisma.phase.findMany({
    orderBy: { order: 'asc' },
    include: { subjects: { orderBy: { createdAt: 'asc' } } },
  })

  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--teal)', letterSpacing: '0.1em', marginBottom: 6 }}>4 PHASES · 120 DAYS</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 800, letterSpacing: '-0.03em' }}>
          Study <span style={{ color: 'var(--teal)' }}>Phases</span>
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 6 }}>
          Click subjects to mark them done. Add, edit, or remove topics.
        </p>
      </div>
      <PhaseEditor phases={phases} />
    </div>
  )
}
