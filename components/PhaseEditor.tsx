'use client'
import { useState, useOptimistic, useTransition } from 'react'

type Subject = { id: string; name: string; done: boolean; phaseId: string }
type Phase   = { id: string; order: number; title: string; month: string; color: string; desc: string; subjects: Subject[] }

const colorMap: Record<string, string> = {
  teal: '#1EB88A', blue: '#4A9EFF', amber: '#F0A348', coral: '#E86B5F',
}
const bgMap: Record<string, string> = {
  teal: 'rgba(30,184,138,0.08)', blue: 'rgba(74,158,255,0.08)',
  amber: 'rgba(240,163,72,0.08)', coral: 'rgba(232,107,95,0.08)',
}

export default function PhaseEditor({ phases: initial }: { phases: Phase[] }) {
  const [phases, setPhases] = useState<Phase[]>(initial)
  const [activeTab, setActiveTab] = useState(0)
  const [newSubject, setNewSubject] = useState('')
  const [, startTransition] = useTransition()

  const phase = phases[activeTab]
  if (!phase) return null

  const done = phase.subjects.filter(s => s.done).length
  const pct  = phase.subjects.length ? Math.round((done / phase.subjects.length) * 100) : 0
  const col  = colorMap[phase.color] || '#1EB88A'
  const bg   = bgMap[phase.color] || 'rgba(30,184,138,0.08)'

  async function toggleSubject(subject: Subject) {
    // optimistic update
    setPhases(prev => prev.map(p => p.id === phase.id
      ? { ...p, subjects: p.subjects.map(s => s.id === subject.id ? { ...s, done: !s.done } : s) }
      : p
    ))
    await fetch(`/api/subjects/${subject.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: !subject.done }),
    })
  }

  async function addSubject() {
    const name = newSubject.trim()
    if (!name) return
    const res = await fetch('/api/subjects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phaseId: phase.id }),
    })
    const created: Subject = await res.json()
    setPhases(prev => prev.map(p => p.id === phase.id
      ? { ...p, subjects: [...p.subjects, created] } : p
    ))
    setNewSubject('')
  }

  async function deleteSubject(subjectId: string) {
    setPhases(prev => prev.map(p => p.id === phase.id
      ? { ...p, subjects: p.subjects.filter(s => s.id !== subjectId) } : p
    ))
    await fetch(`/api/subjects/${subjectId}`, { method: 'DELETE' })
  }

  async function renameSubject(subjectId: string, name: string) {
    await fetch(`/api/subjects/${subjectId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {phases.map((p, i) => {
          const c = colorMap[p.color] || '#1EB88A'
          const b = bgMap[p.color] || 'rgba(30,184,138,0.08)'
          return (
            <button key={p.id} onClick={() => setActiveTab(i)}
              style={{
                fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600,
                padding: '7px 16px', borderRadius: 99, border: 'none', cursor: 'pointer',
                background: activeTab === i ? b : 'var(--bg2)',
                color: activeTab === i ? c : 'var(--muted)',
                outline: activeTab === i ? `1px solid ${c}40` : '1px solid var(--border)',
                transition: 'all 0.15s',
              }}>
              {p.title}
            </button>
          )
        })}
      </div>

      {/* Phase card */}
      <div className="card" style={{ borderColor: col + '30' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>{phase.title}</h2>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{phase.desc}</div>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: col, background: bg, padding: '4px 10px', borderRadius: 99, border: `1px solid ${col}30` }}>
            {phase.month}
          </span>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>{done}/{phase.subjects.length} topics complete</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: col }}>{pct}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${pct}%`, background: col }} />
          </div>
        </div>

        {/* Subjects grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8, marginBottom: 16 }}>
          {phase.subjects.map(s => (
            <div key={s.id} style={{
              background: s.done ? bg : 'var(--bg3)',
              border: `1px solid ${s.done ? col + '40' : 'var(--border)'}`,
              borderRadius: 10, padding: '8px 10px',
              display: 'flex', alignItems: 'center', gap: 8,
              transition: 'all 0.15s',
            }}>
              {/* Checkbox */}
              <button onClick={() => toggleSubject(s)}
                style={{
                  width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                  border: `1.5px solid ${s.done ? col : 'var(--muted)'}`,
                  background: s.done ? col : 'transparent',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s',
                }}>
                {s.done && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="#0D0F14" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </button>
              {/* Editable name */}
              <span contentEditable suppressContentEditableWarning
                onBlur={e => renameSubject(s.id, e.currentTarget.textContent || s.name)}
                style={{
                  fontSize: 13, flex: 1, outline: 'none',
                  color: s.done ? col : 'var(--text)',
                  textDecoration: s.done ? 'line-through' : 'none',
                  opacity: s.done ? 0.7 : 1,
                  cursor: 'text',
                }}>
                {s.name}
              </span>
              {/* Delete */}
              <button onClick={() => deleteSubject(s.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 14, padding: '0 2px', lineHeight: 1, transition: 'color 0.1s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#E86B5F')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}>
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Add subject */}
        <div style={{ display: 'flex', gap: 8 }}>
          <input className="input" placeholder="Add a new topic..." value={newSubject}
            onChange={e => setNewSubject(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addSubject()}
            style={{ flex: 1 }} />
          <button className="btn-primary" onClick={addSubject}>Add</button>
        </div>
      </div>
    </div>
  )
}
