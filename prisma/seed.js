const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const phases = [
  {
    order: 1, title: 'Foundations', month: 'Month 1', color: 'teal',
    desc: 'Build the bedrock: programming, math, and core CS theory.',
    subjects: [
      'Python / C++ basics', 'Data structures', 'Algorithms intro',
      'Discrete mathematics', 'Linux & command line', 'Git & version control',
      'Number systems & logic', 'Aptitude: number theory'
    ]
  },
  {
    order: 2, title: 'Core CS', month: 'Month 2', color: 'blue',
    desc: 'Deepen systems knowledge and build engineering thinking.',
    subjects: [
      'Operating systems', 'Computer networks', 'Databases & SQL',
      'Object-oriented design', 'Sorting & searching', 'Complexity & Big-O',
      'Aptitude: ratios & %', 'Aptitude: speed & time'
    ]
  },
  {
    order: 3, title: 'Applied Engineering', month: 'Month 3', color: 'amber',
    desc: 'Apply knowledge to real-world systems and practices.',
    subjects: [
      'System design basics', 'REST APIs & HTTP', 'Web dev fundamentals',
      'Testing & TDD', 'Design patterns', 'Cloud intro (AWS/GCP)',
      'Aptitude: permutations', 'Aptitude: probability'
    ]
  },
  {
    order: 4, title: 'Interview Prep', month: 'Month 4', color: 'coral',
    desc: 'Consolidate, review, and sharpen for technical interviews.',
    subjects: [
      'LeetCode / DSA practice', 'Mock interviews', 'Behavioral prep',
      'Portfolio projects', 'System design deep-dive', 'Resume & LinkedIn',
      'Quant: full mock tests', 'Aptitude: mixed timed sets'
    ]
  }
]

const timetable = [
  { order: 1,  startTime: '00:00', endTime: '06:00', type: 'sleep',    label: 'Night sleep' },
  { order: 2,  startTime: '06:00', endTime: '07:00', type: 'morning',  label: 'Wake up, freshen up, light exercise / walk' },
  { order: 3,  startTime: '07:00', endTime: '07:30', type: 'break',    label: 'Wind down / personal time before breakfast' },
  { order: 4,  startTime: '07:30', endTime: '08:00', type: 'meal',     label: 'Breakfast' },
  { order: 5,  startTime: '08:00', endTime: '10:30', type: 'study',    label: 'Study session 1 — deep focus (new concepts)' },
  { order: 6,  startTime: '10:30', endTime: '11:00', type: 'aptitude', label: 'Aptitude & quant practice — set 1' },
  { order: 7,  startTime: '11:00', endTime: '11:15', type: 'break',    label: 'Short break — stretch, water' },
  { order: 8,  startTime: '11:15', endTime: '12:30', type: 'study',    label: 'Study session 2 — practice / coding problems' },
  { order: 9,  startTime: '12:30', endTime: '13:15', type: 'meal',     label: 'Lunch' },
  { order: 10, startTime: '13:15', endTime: '13:45', type: 'break',    label: 'Post-lunch rest / light walk' },
  { order: 11, startTime: '13:45', endTime: '16:00', type: 'study',    label: 'Study session 3 — revision & projects' },
  { order: 12, startTime: '16:00', endTime: '16:30', type: 'aptitude', label: 'Aptitude & quant practice — set 2' },
  { order: 13, startTime: '16:30', endTime: '17:00', type: 'break',    label: 'Evening break — refresh, snack' },
  { order: 14, startTime: '17:00', endTime: '18:30', type: 'study',    label: 'Study session 4 — review notes & flashcards' },
  { order: 15, startTime: '18:30', endTime: '19:00', type: 'free',     label: 'Personal time, leisure, social' },
  { order: 16, startTime: '19:00', endTime: '19:30', type: 'break',    label: 'Wind down before dinner' },
  { order: 17, startTime: '19:30', endTime: '20:30', type: 'meal',     label: 'Dinner' },
  { order: 18, startTime: '20:30', endTime: '22:00', type: 'free',     label: 'Hobbies, reading, journaling, screen wind-down' },
  { order: 19, startTime: '22:00', endTime: '23:00', type: 'break',    label: 'Night routine — hygiene, plan next day' },
  { order: 20, startTime: '23:00', endTime: '00:00', type: 'sleep',    label: 'Fall asleep (lights off by 23:00)' },
]

async function main() {
  console.log('Seeding database...')
  await prisma.subject.deleteMany()
  await prisma.phase.deleteMany()
  await prisma.timetableBlock.deleteMany()

  for (const p of phases) {
    const { subjects, ...phaseData } = p
    const phase = await prisma.phase.create({ data: phaseData })
    for (const name of subjects) {
      await prisma.subject.create({ data: { name, phaseId: phase.id } })
    }
  }

  for (const block of timetable) {
    await prisma.timetableBlock.create({ data: block })
  }
  console.log('Seeding complete.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
