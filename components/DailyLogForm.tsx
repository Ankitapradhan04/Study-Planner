'use client'
import { useState } from 'react'

const moods = ['😩','😕','😐','🙂','🔥']

export default function DailyLogForm() {
  const [mood, setMood] = useState(3)
  const [note, setNote] = useState('')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    await fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mood, note }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
    setNote('')
  }

  return (
    <div className="card-sm">
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Today&apos;s Log</h2>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>How are you feeling?</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {moods.map((m, i) => (
            <button key={i} onClick={() => setMood(i + 1)}
              style={{
                fontSize: 22, background: mood === i + 1 ? 'var(--teal-glow)' : 'transparent',
                border: mood === i + 1 ? '1px solid var(--teal-dim)' : '1px solid var(--border)',
                borderRadius: 8, padding: '6px 10px', cursor: 'pointer', transition: 'all 0.15s'
              }}>
              {m}
            </button>
          ))}
        </div>
      </div>
      <textarea className="input" rows={2} placeholder="Notes for today... what did you study?"
        value={note} onChange={e => setNote(e.target.value)}
        style={{ resize: 'none', marginBottom: 10 }} />
      <button className="btn-primary" onClick={handleSave} disabled={saving}>
        {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Log'}
      </button>
    </div>
  )
}
