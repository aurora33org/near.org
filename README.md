# NEAR.org CMS

A marketing website + CMS for NEAR Protocol built with Next.js 16, Tailwind CSS v4, PostgreSQL, and TipTap editor.

## Quick Start

```bash
npm install
cp .env.example .env.local   # fill in DATABASE_URL, AUTH_SECRET, NEXTAUTH_URL
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Visit `http://localhost:3000` (site) or `http://localhost:3000/admin` (CMS)

**Default credentials:** `admin@example.com` / `password`

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 + TweakCN theme (NEAR green primary) |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth.js v5 (JWT + Credentials) |
| Editor | TipTap v3 (block-based rich text) |
| UI Components | shadcn/ui (new-york style) |
| Media | Cloudflare R2 (S3-compatible) |
| Email | Resend |

## Features

### Public Site
- Landing pages (Home, About, Founders, Developers, Tech, Community, Cloud, Private Chat)
- Blog with ISR revalidation (60s), table of contents, reading time, related posts
- Ecosystem partners page (live from Airtable)
- RSS feed (`/feed.xml`), XML sitemap (`/sitemap.xml`), robots.txt
- 3D animations (Beams, Threads, Plasma) on homepage and blog

### CMS Admin
- Email + password auth with forgot/reset password flow
- TipTap block editor — headings, lists, tables, code blocks, images, columns, raw HTML, slash commands, drag & drop
- Media library with Cloudflare R2 upload (drag & drop, 10MB, image types)
- Full blog post management: create, edit, publish, archive, duplicate, bulk actions
- Password-protected preview links for sharing drafts
- Edit locks — warns when two people edit the same post simultaneously
- Categories and tags CRUD (admin-only)
- User management with roles (admin-only)
- Audit log — full history of create/update/delete actions
- Dark/light mode toggle

### Security
- bcrypt password hashing (cost 13) for users and preview passwords
- Rate limiting on sensitive endpoints (forgot-password, preview verify, upload)
- Security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
- DOMPurify sanitization in editor and public renderer
- Demo credentials shown only in development mode

## Commands

```bash
npm run dev              # Start dev server
npm run build            # Production build
npm run lint             # ESLint
npm run prisma:migrate   # Database migrations
npm run prisma:seed      # Seed demo data
npm run prisma:studio    # Database admin UI (http://localhost:5555)
```

## Database Schema

| Model | Purpose |
|-------|---------|
| User | Auth — email, bcrypt password, role |
| Post | Blog posts — content (JSON), status, SEO fields, preview token, edit lock |
| Page | CMS pages (model ready, UI stub) |
| Media | File metadata — url, filename, mimeType |
| Category / Tag | Post taxonomy |
| PasswordResetToken | 1-hour reset tokens |
| AuditLog | Action history (CREATE/UPDATE/DELETE) |

## Roles

| Role | Permissions |
|------|------------|
| ADMIN | Full access, user management, categories/tags |
| EDITOR | Create and edit own posts, read all |
| VIEWER | Read own posts only |

## Current Status

✅ **Phase 1** — Auth, DB, Blog, Admin scaffold  
✅ **Phase 2** — TipTap editor, Media upload, Dark mode, shadcn/ui  
✅ **Phase 3** — Preview links, edit locks, bulk actions, audit log, RSS, SEO, security hardening  
⏳ **Phase 4** — Page management UI, public site content, notification emails

## Documentation

See **DOCS.md** for architecture deep-dive, implementation guide, and deployment instructions.

---

Built for NEAR Protocol
