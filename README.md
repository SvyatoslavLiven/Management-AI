# Bali Hospitality Operations MVP

Internal operations platform MVP for a hospitality management company operating villas, boutique hotels, and mixed assets.

## Stack
- Next.js App Router + TypeScript
- PostgreSQL + Prisma
- Auth.js (credentials)
- Tailwind CSS
- React Hook Form + Zod
- TanStack Table (dependency included for extension)
- Zustand (dependency included for local state extension)
- date-fns
- Docker Compose

## Architecture summary
- `prisma/`: complete data model (12 entities + auth models) and seed script
- `src/lib`: auth, RBAC, automations, DB client
- `src/server`: page-scoped data + overdue automation trigger
- `src/app`: authenticated operations pages + API routes for core workflows
- `tests/`: automation and RBAC unit tests

## Setup
```bash
docker compose up -d
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run dev
```

Open http://localhost:3000

## Demo credentials (all password: `password123`)
- central manager: `central.manager@ops.local`
- property manager UCV: `property.manager.ucv@ops.local`
- department head CCB: `ops.head.ccb@ops.local`
- line staff UCV: `line.staff.ucv@ops.local`
- finance: `finance.controller@ops.local`
- owner UCV: `owner.ucv@ops.local`

## Implemented workflows
1. Check-out event creation API auto-creates housekeeping + quality check actions, updates unit readiness.
2. Complaint event creation auto-creates guest_request/maintenance action with severity-based SLA.
3. Maintenance issue event creation updates risky unit state and creates maintenance action.
4. Line staff can complete assigned action; approval-required actions move to waiting/pending.
5. Shift pages show shift records and link unresolved work visibility through open actions.
6. Owner dashboard is read-only summary with owner-visible reports.
7. Overdue prevention marks due-passed actions as overdue when protected pages load.
8. Approval endpoint supports approve/reject and finalizes action upon approval.

## Known limitations (next iteration)
- UI tables are functional but minimal; advanced TanStack filtering/sorting UI can be expanded.
- No real-time updates/websockets.
- Approval matrix is simplified.
- Department-scope filtering is basic role + property scoping.
- E2E tests and broader route mutation tests should be added.
