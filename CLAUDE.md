# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Commands

```bash
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Production build
npm run lint             # Run ESLint
npm run prisma:migrate   # Create/apply database migrations
npm run prisma:seed      # Seed database with demo users
npm run prisma:studio    # Launch Prisma Studio (http://localhost:5555)
```

**Dev credentials:** `admin@example.com` / `password` → `http://localhost:3000/admin/login`

## Architecture

Marketing website + CMS for NEAR Protocol. Next.js 16 App Router + TypeScript.

- **Public site** `app/(site)/` — Home, About, Blog (ISR 60s), Ecosystem (Airtable), sitemap, RSS, robots.txt
- **Admin CMS** `app/admin/` — Dashboard, Posts, Media, Categories/Tags, Users, Audit Log, Settings. All routes JWT-protected via `middleware.ts`
- **API** `app/api/` — posts CRUD, bulk actions, preview links, edit locks, duplicate, upload, users, categories, tags, audit log, auth (forgot/reset password)
- **Core** — `lib/auth.ts` (NextAuth v5), `lib/prisma.ts`, `lib/airtable.ts`, `lib/email.ts` (Resend), `lib/tiptap-renderer.tsx`

## Key Technologies

| Layer | Stack |
|-------|-------|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 + TweakCN (NEAR green primary) |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth.js v5 (JWT + Credentials) |
| Editor | TipTap v3 (block-based, slash commands, drag handles) |
| UI Kit | shadcn/ui (new-york style) |
| Media | Cloudflare R2 via `@aws-sdk/client-s3` |
| Email | Resend (`lib/email.ts`) |

## Environment Variables (`.env.local`)

```bash
DATABASE_URL=           NEXTAUTH_URL=           AUTH_SECRET=
S3_ENDPOINT=            S3_REGION=auto          S3_BUCKET=
S3_ACCESS_KEY_ID=       S3_SECRET_ACCESS_KEY=   R2_PUBLIC_URL=
RESEND_API_KEY=
AIRTABLE_API_KEY=       AIRTABLE_BASE_ID=       AIRTABLE_ECOSYSTEM_TABLE=
```

## Important Patterns

**Route protection** — `middleware.ts` guards `/admin/*` via `req.auth`. API routes call `await auth()` and return 401 if no session.

**Database** — Always use the singleton: `import { prisma } from '@/lib/prisma'`

**Styling** — Public site: plain Tailwind light mode. Admin: TweakCN dark mode via `.dark` class on wrapper. Use semantic tokens (`bg-background`, `text-foreground`, etc.)

**Editor** — TipTap stores content as JSON. `components/admin/BlockEditor.tsx` handles editing; `lib/tiptap-renderer.tsx` renders on public site (uses DOMPurify for sanitization).

**ISR** — Blog index and post pages revalidate every 60s. On publish/update, `revalidatePath()` triggers immediately.

**Rate limiting** — In-memory per-endpoint: upload (20/min), forgot-password (1/min), preview verify (5/min).

**Security headers** — Defined in `next.config.ts` (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`). Image `remotePatterns` read from `R2_PUBLIC_URL` / `S3_ENDPOINT` env vars — no wildcard.

## Database Schema (key models)

**User** — id, email, password (bcrypt cost 13), name, role (ADMIN|EDITOR|VIEWER)

**Post** — id, title, slug, content (JSON), excerpt, coverImage, heroBgColor, heroBgImage, status (DRAFT|PUBLISHED|ARCHIVED), seoTitle, seoDesc, ogImage, previewToken, previewPassword (bcrypt-hashed), lockedBy/lockedByEmail/lockedAt (90s edit lock), authorId, lastEditedById, publishedAt

**Media** — id, url, filename, mimeType, size, alt

**Category / Tag** — id, name, slug

**PasswordResetToken** — token, email, expiresAt (1h)

**AuditLog** — userId, userEmail, action (CREATE|UPDATE|DELETE), entityType (POST|MEDIA|USER), entityId, entityTitle

## Auth & Roles

JWT strategy, 30-day sessions. Roles: **ADMIN** (full access) · **EDITOR** (own posts + all reads) · **VIEWER** (own posts read-only).

## Incomplete Features

- **Page Management** — DB model exists, admin UI is a stub (`app/admin/pages/`)
- **Public site pages** — Most are static stubs (Founders, Developers, Tech, etc.)
- **Dark mode on public site** — Not implemented
- **Notification emails** — Only password reset email exists

---

*Last updated: Phase 3 (Security audit, preview links, edit locks, bulk actions, audit log, RSS, SEO)*
