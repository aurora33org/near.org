# NEAR.org Documentation

Complete guide for developers working on the NEAR.org CMS project.

## Table of Contents
1. Getting Started
2. Architecture
3. Implementation Guide
4. Feature Checklist
5. Development Workflow
6. Troubleshooting

---

## 1. Getting Started

### Database Setup (Choose One)

**Docker**
```bash
docker run --name postgres-near -e POSTGRES_PASSWORD=password -e POSTGRES_DB=near_org -p 5432:5432 -d postgres:15
```

**Local PostgreSQL (macOS)**
```bash
brew install postgresql@15 && brew services start postgresql@15
```

**Railway.app** — Sign up, create a PostgreSQL database, copy the connection string.

### Environment Setup

```bash
cp .env.example .env.local
```

Minimum required variables:
```
DATABASE_URL="postgresql://user:password@localhost:5432/near_org"
AUTH_SECRET="<openssl rand -hex 32>"
NEXTAUTH_URL="http://localhost:3000"
```

Full variable list in `CLAUDE.md`.

### Database Initialization

```bash
npm run prisma:migrate   # Create tables
npm run prisma:seed      # Add demo admin user
npm run dev              # Start server
```

Login at `/admin/login` → `admin@example.com` / `password`

---

## 2. Architecture

### System Overview

```
Next.js 16 (App Router + TypeScript)
├── PUBLIC SITE (app/(site)/)
│   ├── Home, About, Founders, Developers, Tech, Community, Cloud, Private Chat
│   ├── Ecosystem (Airtable ISR 60s)
│   ├── Blog index + [slug] (ISR 60s, static params)
│   ├── feed.xml, sitemap.xml, robots.txt
│   └── Navigation + Footer (app/(site)/layout.tsx)
│
├── CMS ADMIN (app/admin/)
│   ├── Login, Forgot/Reset Password
│   ├── Dashboard (stats + recent audit activity)
│   ├── Posts (CRUD, bulk actions, preview links, edit locks, duplicate)
│   ├── Media (R2 upload, library, search)
│   ├── Categories + Tags
│   ├── Users (admin-only)
│   ├── Audit Log (admin-only)
│   └── Settings (change password)
│
└── API ROUTES (app/api/)
    ├── auth/ — NextAuth, forgot-password, reset-password
    ├── posts/ — CRUD + bulk + lock + duplicate + preview-link
    ├── preview/[token]/verify — password-protected draft access
    ├── upload/ — Cloudflare R2 file upload
    ├── media/ — media library CRUD
    ├── categories/ + tags/ — taxonomy CRUD
    ├── users/ + profile/ — user management
    └── audit-log/ — action history

lib/
├── auth.ts          NextAuth v5 config (JWT + CredentialsProvider)
├── prisma.ts        Prisma singleton client
├── airtable.ts      getEcosystemPartners() — Airtable API
├── email.ts         sendPasswordResetEmail() — Resend API
└── tiptap-renderer.tsx  Renders TipTap JSON to React (DOMPurify sanitized)

Middleware → JWT session check → PostgreSQL (Prisma ORM)
```

### Database Schema

```
User
├─ id, email (UNIQUE), password (bcrypt cost 13), name
├─ role (ADMIN|EDITOR|VIEWER)
└─ createdAt, updatedAt

Post
├─ id, title, slug (UNIQUE), content (JSON - TipTap blocks)
├─ excerpt, coverImage, heroBgColor, heroBgImage
├─ status (DRAFT|PUBLISHED|ARCHIVED)
├─ seoTitle, seoDesc, ogImage
├─ authorId (FK→User), lastEditedById (FK→User)
├─ previewToken (UNIQUE), previewPassword (bcrypt-hashed)
├─ lockedBy (userId), lockedByEmail, lockedAt (90s TTL)
└─ publishedAt, createdAt, updatedAt

Page (same structure as Post — UI stub, not yet implemented)

Media
├─ id, url, filename, mimeType, size, alt
└─ createdAt

Category / Tag
└─ id, name (UNIQUE), slug (UNIQUE)

PasswordResetToken
└─ token (UNIQUE), email, expiresAt (1h), createdAt

AuditLog
└─ userId, userEmail, action (CREATE|UPDATE|DELETE),
   entityType (POST|MEDIA|USER), entityId, entityTitle, createdAt
```

### Authentication

NextAuth.js v5, JWT strategy:
1. User submits email/password at `/admin/login`
2. CredentialsProvider finds user, bcryptjs compares hash
3. JWT created with `{ id, email, role }` — stored in HTTP-only cookie
4. `middleware.ts` checks `req.auth` on all `/admin/*` routes
5. API routes call `await auth()` and return 401 if no session
6. Session expires after 30 days

### Security

| Feature | Implementation |
|---------|---------------|
| Password hashing | bcryptjs, cost 13 (users + preview passwords) |
| JWT signing | `AUTH_SECRET` env var |
| HTTP-only cookies | NextAuth default |
| Admin route protection | `middleware.ts` |
| API auth | `await auth()` check in every protected route |
| Input validation | Zod schemas on all API routes |
| HTML sanitization | DOMPurify in editor (`RawHtmlBlockView.tsx`) and renderer (`tiptap-renderer.tsx`) |
| Rate limiting | In-memory: forgot-password (1/min), preview verify (5/min), upload (20/min) |
| Security headers | `next.config.ts`: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-XSS-Protection |
| Image domains | `remotePatterns` dynamically built from `R2_PUBLIC_URL`/`S3_ENDPOINT` — no wildcard |
| Demo credentials | Shown only when `NODE_ENV === "development"` |
| Zod error details | Returned only when `NODE_ENV === "development"` |

---

## 3. Implementation Guide

### Adding a New Public Page

```bash
mkdir -p app/\(site\)/[section]
# Create page.tsx with React component
# Update navigation in app/(site)/layout.tsx
```

### Creating an API Endpoint

```tsx
// app/api/[route]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const data = await req.json();
  // Zod validation, prisma operation...
  return NextResponse.json(result, { status: 201 });
}
```

### Database Migrations

```bash
npx prisma migrate dev --name descriptive_name   # New migration
npx prisma db push                                # Sync schema (dev only)
npx prisma migrate reset                          # Reset (deletes data!)
npm run prisma:studio                             # GUI at localhost:5555
```

### Deploying to Railway

1. Push to GitHub
2. Connect repo to Railway.app
3. Add env vars: `DATABASE_URL`, `AUTH_SECRET`, `NEXTAUTH_URL`, R2 credentials, `RESEND_API_KEY`
4. Auto-deploys on git push

---

## 4. Feature Checklist

### Foundation ✅
- [x] NextAuth.js v5 (JWT + Credentials)
- [x] PostgreSQL + Prisma ORM
- [x] Admin scaffold with sidebar and middleware protection
- [x] Role-based access (ADMIN / EDITOR / VIEWER)

### CMS Core ✅
- [x] TipTap block editor (slash commands, drag handles, tables, code, images, columns, raw HTML)
- [x] Blog CRUD (create, edit, publish, archive, delete)
- [x] Tailwind v4 + TweakCN dark mode admin
- [x] shadcn/ui component library
- [x] Media library with Cloudflare R2 upload
- [x] Categories and tags CRUD

### Blog & Public Site ✅
- [x] ISR blog index and dynamic post pages (60s revalidation)
- [x] Table of contents (floating sidebar)
- [x] Reading time calculation
- [x] Related posts by category
- [x] OG image + SEO fields per post
- [x] RSS feed (`/feed.xml`)
- [x] XML sitemap (`/sitemap.xml`)
- [x] robots.txt

### Advanced CMS ✅
- [x] Password-protected preview links for draft sharing
- [x] Edit locks (90s TTL, warns on conflict)
- [x] Duplicate posts
- [x] Bulk actions (publish / archive / delete)
- [x] Forgot password + email reset (Resend)
- [x] Audit log with admin UI
- [x] Dashboard with stats and recent activity
- [x] Airtable integration for Ecosystem page

### Security Hardening ✅
- [x] bcrypt preview passwords (was plaintext)
- [x] Rate limiting on forgot-password, preview verify, upload
- [x] Security HTTP headers in next.config.ts
- [x] DOMPurify sanitization in editor and renderer
- [x] Restricted image remotePatterns (no wildcard)
- [x] Dev-only demo credentials and Zod error details

### Pending ⏳
- [ ] Page management UI (`app/admin/pages/` is a stub)
- [ ] Public site content pages (most are static stubs)
- [ ] Dark mode on public site
- [ ] Notification emails (post publish, new user welcome)
- [ ] Post scheduling (field exists, no scheduler)

---

## 5. Development Workflow

### Creating a Blog Post

1. Login at `/admin/login`
2. Go to "Blog Posts" → "+ New Post"
3. Fill title (auto-generates slug), content, excerpt, cover image
4. Add SEO fields under the SEO tab
5. Set status (DRAFT or PUBLISHED) and save
6. Published posts appear at `/blog/[slug]`

### Sharing a Draft Preview

1. Open the post in edit mode
2. Click "Share Preview" → set a password → generate link
3. Share the link — recipient enters the password to view the draft

### Managing Users

1. Admin goes to `/admin/users`
2. Create users with ADMIN / EDITOR / VIEWER roles
3. Delete or edit as needed (cannot delete yourself)

### Debugging

```bash
npm run prisma:studio   # View/edit database records
npm run build           # Check for TypeScript/build errors
rm -rf .next && npm run dev  # Clear Next.js cache
```

---

## 6. Troubleshooting

**"Error: connect ECONNREFUSED"** → PostgreSQL not running. Start it or use Docker.

**"NextAuth login not working"** → Check `AUTH_SECRET` in `.env.local`, clear browser cookies.

**"Port 3000 already in use"** → `npm run dev -- -p 3001`

**"Module not found"** → `npm install && npx prisma generate`

**"Database error during migration"** → `npx prisma db push` or `npx prisma migrate reset`

**"Images not loading"** → Check `R2_PUBLIC_URL` is set — `remotePatterns` is built from this env var.

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `lib/auth.ts` | NextAuth v5 config |
| `lib/prisma.ts` | Prisma singleton |
| `lib/email.ts` | Resend email helper |
| `lib/tiptap-renderer.tsx` | TipTap JSON → React (public) |
| `middleware.ts` | Admin route protection |
| `components/admin/BlockEditor.tsx` | TipTap editor |
| `app/admin/layout.tsx` | Admin sidebar + ThemeProvider |
| `prisma/schema.prisma` | Full database schema |
| `next.config.ts` | Image domains + security headers |

---

*Last updated: Phase 3 — Security hardening, preview links, edit locks, bulk actions, audit log, RSS/SEO*
