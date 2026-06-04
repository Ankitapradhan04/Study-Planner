import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { mood, note } = await req.json()
  const log = await prisma.dailyLog.create({ data: { mood: Number(mood), note } })
  return NextResponse.json(log)
}

export async function GET() {
  const logs = await prisma.dailyLog.findMany({ orderBy: { createdAt: 'desc' }, take: 30 })
  return NextResponse.json(logs)
}
