import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json()
  const updated = await prisma.subject.update({ where: { id: params.id }, data })
  return NextResponse.json(updated)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await prisma.subject.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
