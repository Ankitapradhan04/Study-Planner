# StudyOS — 4-Month Software Engineering Study Planner

A full-stack study planner built with **Next.js 14**, **Prisma**, and **PostgreSQL**.

## Features
- **Dashboard** — overall progress, phase cards, daily mood log
- **Timetable** — full 24-hour schedule (sleep 23:00–06:00, meals at 07:30/12:30/19:30)
- **Phases** — 4-phase curriculum with editable subjects, tick-off progress
- **API** — REST endpoints for subjects and daily logs
- **Database** — PostgreSQL via Prisma ORM

---

## Local Setup

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/study-planner.git
cd study-planner
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment
```bash
cp .env.example .env
# Edit .env and set your DATABASE_URL
```

### 4. Set up the database
```bash
npm run db:push   # push schema to your DB
npm run db:seed   # seed phases, subjects, timetable
```

### 5. Run development server
```bash
npm run dev
# Open http://localhost:3000
```

---


## Project Structure
```
study-planner/
├── app/
│   ├── page.tsx              # Dashboard
│   ├── timetable/page.tsx    # Timetable view
│   ├── phases/page.tsx       # Phase editor
│   ├── api/
│   │   ├── subjects/route.ts         # POST create subject
│   │   ├── subjects/[id]/route.ts    # PATCH / DELETE subject
│   │   └── log/route.ts              # POST / GET daily log
│   └── globals.css
├── components/
│   ├── Navbar.tsx
│   ├── PhaseEditor.tsx       # Client-side phase & subject CRUD
│   └── DailyLogForm.tsx      # Mood + note logger
├── lib/
│   └── prisma.ts             # Prisma client singleton
├── prisma/
│   ├── schema.prisma         # DB schema
│   └── seed.js               # Seed data
└── .env.example
```

## Tech Stack
| Layer    | Technology        |
|----------|-------------------|
| Frontend | Next.js 14 (App Router) |
| Styling  | Tailwind CSS + custom CSS |
| Backend  | Next.js API Routes |
| ORM      | Prisma |
| Database | PostgreSQL (Neon for prod) |
| Deploy   | Vercel |
