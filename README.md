# NEAR.org

A marketing website + CMS for NEAR Protocol built with **Next.js 16**, **TipTap** rich text editor, **PostgreSQL**, and **TypeScript**.

- **Public Site**: Home, About, Founders, Developers, Technology, Community, Cloud, Private Chat, Ecosystem, Blog
- **CMS Admin**: Full-featured blog management, media library, user roles, audit logging, sitemap control
- **Deployment**: Auto-apply migrations on deploy via Dokploy (Railpack)
- **Package Manager**: pnpm (faster installs, smaller lock files)

---

## Tech Stack

| Layer | Stack |
|-------|-------|
| **Framework** | Next.js 16 (App Router, TypeScript) |
| **Styling** | Tailwind CSS v4 + TweakCN dark theme (NEAR green primary) |
| **Database** | PostgreSQL 16 + Prisma ORM |
| **Auth** | NextAuth.js v5 (JWT + HTTP-only cookies) |
| **Editor** | TipTap v3 (blocks, slash commands, drag-handles, tables, code, images, columns, raw HTML) |
| **UI Components** | shadcn/ui (new-york style) |
| **Media Storage** | Cloudflare R2 (S3-compatible) |
| **Email** | Resend |
| **Package Manager** | pnpm |

---

## Features

### 🌍 Public Site
- **Pages**: Home, About, Founders, Developers, Technology, Community, Cloud, Private Chat  
- **Blog**: Dynamic pages with ISR (60s revalidation), table of contents, reading time, related posts, share buttons  
- **Content**: Ecosystem partners from Airtable (live sync), SEO metadata, OG images  
- **SEO**: `/feed.xml` (RSS), `/sitemap.xml` (with admin toggle for post inclusion), `/robots.txt` (admin-editable)  
- **Animations**: 3D Beams, Threads, and Plasma effects on homepage and blog  

### 🖥️ CMS Admin
- **Authentication**: Email + password with forgot/reset password flow (Resend)  
- **Posts**: Create, edit, publish, archive, duplicate, share password-protected preview links, edit locks (90s)  
- **Bulk Actions**: Publish, archive, or delete multiple posts in one action  
- **Media Library**: Drag-and-drop upload to Cloudflare R2, search, MIME type validation  
- **Taxonomy**: Categories and tags with auto-generated slugs (admin-only)  
- **Users**: Role-based access (ADMIN, EDITOR, VIEWER), invite users by email  
- **Audit Log**: Full history of create/update/delete actions with user email and timestamp  
- **Sitemap Manager**: Toggle per-post inclusion in XML sitemap  
- **Robots.txt Viewer**: Read-only view (editable via code)  
- **Dashboard**: Stats (post count, user count, media count) + recent audit activity  
- **Settings**: Change password, theme toggle (dark/light mode)  
- **Advanced Settings** (collapsible submenu): Sitemap, Robots.txt, Audit Log  

### 🔒 Security
- **Password Hashing**: bcryptjs (cost 13) for users and preview passwords  
- **JWT Sessions**: 30-day expiration, HTTP-only cookies  
- **Role-Based Access**: ADMIN (full), EDITOR (own posts + all reads), VIEWER (own posts read-only)  
- **Rate Limiting**: Forgot-password (1/min), preview verify (5/min), upload (20/min)  
- **Input Validation**: Zod schemas on all API routes  
- **HTML Sanitization**: DOMPurify in editor and public renderer (forbids event handlers, script tags, dangerous protocols)  
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-XSS-Protection  
- **Image Domains**: Restricted to configured R2/S3 endpoints (no wildcard)  
- **Demo Credentials**: Shown only in development mode  

---

## Getting Started

### Prerequisites
- **Node.js 18+**
- **pnpm** (or npm if you prefer, but pnpm is recommended)
- **Docker Desktop** (for PostgreSQL) or local PostgreSQL 16+

### 1. Clone & Install

```bash
git clone https://github.com/near-org/near.org.git
cd near.org
pnpm install
```

### 2. Start Database

#### Option A: Docker (Recommended)

**macOS & Windows (WSL2):**
```bash
docker compose up -d
```

This starts PostgreSQL 16 on `localhost:5432` with credentials:
- User: `user`
- Password: `password`
- Database: `near_org`

To stop: `docker compose down`  
To view logs: `docker compose logs -f db`

#### Option B: Local PostgreSQL

**macOS (Homebrew):**
```bash
brew install postgresql@16
brew services start postgresql@16
createdb near_org
```

### 3. Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with:
```env
# Database (use defaults from Docker above)
DATABASE_URL="postgresql://user:password@localhost:5432/near_org"

# NextAuth
AUTH_SECRET="openssl rand -hex 32"  # Generate a random secret
NEXTAUTH_URL="http://localhost:3000"

# Optional: Cloudflare R2 (for file uploads)
S3_ENDPOINT="https://your-account.r2.cloudflarecontent.com"
S3_REGION="auto"
S3_BUCKET="your-bucket-name"
S3_ACCESS_KEY_ID="your-access-key"
S3_SECRET_ACCESS_KEY="your-secret-key"
R2_PUBLIC_URL="https://your-public-url.com"

# Optional: Airtable (for Ecosystem page)
AIRTABLE_API_KEY="your-airtable-key"
AIRTABLE_BASE_ID="your-base-id"
AIRTABLE_ECOSYSTEM_TABLE="your-table-id"

# Optional: Resend (for password reset emails)
RESEND_API_KEY="your-resend-key"
```

### 4. Setup Database

```bash
pnpm prisma:migrate    # Create tables from schema
pnpm prisma:seed       # Seed admin user
```

### 5. Run Dev Server

```bash
pnpm dev
```

Open:
- **Public Site**: http://localhost:3000
- **CMS Admin**: http://localhost:3000/admin/login
- **Credentials**: `admin@example.com` / `password`

---

## Local Development with Portless (Optional)

For HTTPS without port management or cross-device testing:

### Install Portless

```bash
npm install -g portless
portless trust  # Install local CA into system trust store
```

### Run with Portless

```bash
portless run next dev
```

Then access via:
- **HTTPS Public Site**: https://near-org.localhost
- **HTTPS CMS**: https://near-org.localhost/admin/login

**Benefits:**
- Real HTTPS locally (no "insecure connection" warnings)
- HTTP/2 support (better performance than HTTP/1.1)
- No port juggling — stable URL `https://near-org.localhost`
- **LAN mode** — test on other devices on your network:
  ```bash
  portless proxy start --lan
  # Access as https://near-org.local from any device
  ```

---

## Common Commands

```bash
# Development
pnpm dev                      # Start dev server on http://localhost:3000
pnpm build                    # Production build
pnpm start                    # Start production server (runs migrations first)

# Database
pnpm prisma:migrate           # Create new migration
pnpm prisma:seed              # Seed demo data
pnpm prisma:studio            # Database GUI on http://localhost:5555

# Linting
pnpm lint                      # ESLint check

# Package management
pnpm install                  # Install dependencies
pnpm update                   # Update packages (note: uses pnpm-lock.yaml, not package-lock.json)
```

---

## Database Schema

| Model | Purpose |
|-------|---------|
| **User** | Auth — email, bcrypt password, role (ADMIN/EDITOR/VIEWER) |
| **Post** | Blog posts — title, slug, content (JSON), status, SEO, preview token, edit lock |
| **Page** | CMS pages (model exists, UI stub for future expansion) |
| **Media** | File metadata — url, filename, mimeType, size |
| **Category / Tag** | Post taxonomy with auto-slugs |
| **PasswordResetToken** | 1-hour reset tokens for password recovery |
| **InvitationToken** | Email-based user invitations with roles |
| **AuditLog** | Full history — action (CREATE/UPDATE/DELETE), user, timestamp, entity |

---

## API Routes

### Auth
- `POST /api/auth/[...nextauth]` — Login, logout, session
- `POST /api/auth/forgot-password` — Send reset email
- `POST /api/auth/reset-password` — Reset password with token
- `POST /api/auth/accept-invite` — Accept user invitation

### Posts
- `GET/POST /api/posts` — List & create posts
- `GET/PUT/DELETE /api/posts/[id]` — Get, update, delete
- `POST /api/posts/[id]/duplicate` — Duplicate a post
- `GET/POST/DELETE /api/posts/[id]/lock` — Edit lock management
- `GET/POST /api/posts/[id]/preview-link` — Generate password-protected preview
- `POST /api/posts/bulk` — Bulk actions (publish, archive, delete)

### Media & Files
- `GET/POST /api/media` — List & save media
- `GET/DELETE /api/media/[id]` — Get or delete item
- `POST /api/upload` — Upload to Cloudflare R2 (rate-limited: 20/min)

### Categories & Tags
- `GET/POST /api/categories` — List & create
- `GET/PUT/DELETE /api/categories/[id]` — Manage
- `GET/POST /api/tags` — List & create
- `GET/PUT/DELETE /api/tags/[id]` — Manage

### Users
- `GET/POST /api/users` — List & create (admin-only)
- `GET/PUT/DELETE /api/users/[id]` — Manage user
- `POST /api/users/invite` — Invite by email
- `GET/PUT /api/profile` — Current user profile

### Other
- `GET /api/cron/publish-scheduled` — Auto-publish scheduled posts (1/min via Vercel cron)
- `POST /api/preview/[token]/verify` — Verify preview password

---

## Deployment

### Dokploy (Recommended)

1. **Connect GitHub repo** to Dokploy project
2. **Add Environment Variables**:
   - `DATABASE_URL` — PostgreSQL connection string
   - `AUTH_SECRET` — `openssl rand -hex 32`
   - `NEXTAUTH_URL` — Your production URL
   - R2 credentials (if using Cloudflare)
   - Resend, Airtable keys (if needed)

3. **Auto-Migration on Deploy**:
   The `start` script includes `prisma migrate deploy`, which automatically applies pending migrations before Next.js starts. No manual setup needed.

4. **Builder**: Dokploy auto-detects Railpack (Next.js builder). pnpm is auto-detected from `pnpm-lock.yaml`.

---

## Roles & Permissions

| Role | Can Do |
|------|--------|
| **ADMIN** | Everything — create/edit/delete posts, manage users, view audit log, edit settings |
| **EDITOR** | Create/edit own posts, read all posts, upload media, view audit log (filter own actions) |
| **VIEWER** | Read own posts only (read-only access) |

---

## Project Status

✅ **Phase 1** — Auth, DB, blog CRUD, admin scaffold  
✅ **Phase 2** — TipTap editor, media upload, dark mode, shadcn/ui  
✅ **Phase 3** — Preview links, edit locks, bulk actions, audit log, RSS/sitemap, security hardening, sitemap exclusion toggle, robots.txt viewer  
✅ **Phase 4 (partial)** — Auto-migration on deploy, pnpm adoption  
⏳ **Future** — Page management UI (stub exists), public site content expansion, notification emails, post scheduling UI

---

## Documentation

- **[DOCS.md](DOCS.md)** — Architecture deep-dive, implementation patterns, troubleshooting
- **[CLAUDE.md](CLAUDE.md)** — Claude Code context, quick commands, common gotchas
- **[BUGS.md](BUGS.md)** — Known issues and security audit

---

## Troubleshooting

**"Error: connect ECONNREFUSED"**  
PostgreSQL not running. Start Docker (`docker compose up -d`) or PostgreSQL service.

**"NextAuth login not working"**  
Clear browser cookies and check `AUTH_SECRET` in `.env.local`. Regenerate if needed: `openssl rand -hex 32`

**"Port 3000 already in use"**  
Run on a different port: `pnpm dev -- -p 3001`

**"Module not found / Prisma errors"**  
Regenerate Prisma client: `pnpm prisma:generate`

**"Database migration fails"**  
Try `pnpm prisma:migrate` again or check PostgreSQL is running and `DATABASE_URL` is correct.

**"Images not loading"**  
Check `R2_PUBLIC_URL` or `S3_ENDPOINT` env vars are set. Image domains are restricted to these for security.

---

Built with ❤️ for NEAR Protocol  
