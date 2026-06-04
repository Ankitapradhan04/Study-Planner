import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { name, phaseId } = await req.json()
  if (!name || !phaseId) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  const subject = await prisma.subject.create({ data: { name, phaseId } })
  return NextResponse.json(subject)
}
