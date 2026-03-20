# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Commands

```bash
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Production build
npm run start            # Start production server
npm run lint             # Run ESLint
npm run prisma:migrate   # Create/apply database migrations
npm run prisma:seed      # Seed database with demo users
npm run prisma:studio    # Launch Prisma Studio (database GUI)
```

**Default credentials for local development:**
- Email: `admin@example.com`
- Password: `password`
- Login at: `http://localhost:3000/admin/login`

## Architecture Overview

This is a **marketing website + CMS** for NEAR Protocol split into two main sections:

```
Next.js 16 (App Router, TypeScript)
├── PUBLIC SITE: /app/(site)/
│   ├── Home, About, Founders, Developers, Tech, Community pages
│   ├── Blog index & dynamic post pages (ISR 60s revalidate)
│   ├── Navigation & Footer (in app/(site)/layout.tsx)
│   └── Static/ISR pages → Fast public URLs
│
├── CMS ADMIN: /app/admin/
│   ├── Login → JWT session check
│   ├── Dashboard, Blog/Page management, Media, Users
│   ├── All routes protected by middleware (auth required)
│   └── Dark mode toggle (ThemeProvider context)
│
├── API ROUTES: /app/api/
│   ├── /auth/[...nextauth] - NextAuth.js endpoints
│   └── /posts - Blog CRUD endpoints
│
└── CORE SYSTEMS
    ├── lib/auth.ts - NextAuth.js v5 config (JWT + credentials)
    ├── lib/prisma.ts - Prisma singleton client
    ├── lib/airtable.ts - Airtable client for ecosystem partners
    ├── middleware.ts - Route protection for /admin/*
    └── prisma/schema.prisma - Database schema
```

### Data Flow

**Authentication:**
1. User logs in at `/admin/login`
2. Credentials → bcryptjs password check
3. JWT token created (contains id, email, role)
4. Token stored in HTTP-only cookie
5. Middleware checks `req.auth` on `/admin/*` routes
6. Unauthorized → redirects to `/admin/login`

**Blog Post Creation:**
1. Editor fills form in `/admin/posts/new`
2. TipTap editor content → JSON blocks
3. POST `/api/posts` with title, content, slug, metadata
4. Prisma saves to database
5. Page renders at `/blog/[slug]` (ISR revalidates)

## Key Technologies

| Layer | Stack |
|-------|-------|
| **Framework** | Next.js 16 (App Router, TypeScript) |
| **Styling** | Tailwind CSS v4 + TweakCN theme (NEAR green primary) |
| **Database** | PostgreSQL + Prisma ORM |
| **Auth** | NextAuth.js v5 (JWT + Credentials) |
| **Editor** | TipTap v3 (block-based with syntax highlighting) |
| **UI Kit** | shadcn/ui (new-york style) |
| **Media Upload** | Cloudflare R2 (S3-compatible, via `@aws-sdk/client-s3`) |

## Project Structure

```
app/
├── (site)/                      # Public website routes
│   ├── page.tsx                 # Home page
│   ├── layout.tsx               # Navbar, footer
│   ├── about, founders, developers, tech, community, ecosystem/
│   │   └── ecosystem/ fetches partners from Airtable via lib/airtable.ts (ISR 60s)
│   └── blog/
│       ├── page.tsx             # Blog index
│       └── [slug]/page.tsx       # Dynamic post (ISR)
│
├── admin/                       # CMS admin routes (all protected)
│   ├── login/page.tsx           # Login form
│   ├── layout.tsx               # Sidebar, ThemeProvider
│   ├── dashboard/page.tsx
│   ├── posts/
│   │   ├── page.tsx             # Blog list
│   │   ├── new/page.tsx         # Create post (split-panel editor)
│   │   └── [id]/edit/page.tsx   # Edit post
│   ├── pages/page.tsx           # CMS pages (stub)
│   ├── media/page.tsx           # Media library (stub)
│   └── users/page.tsx           # User management (admin-only)
│
└── api/
    ├── auth/[...nextauth]/      # NextAuth.js endpoints
    ├── posts/route.ts           # GET/POST posts
    └── posts/[id]/route.ts      # GET/PUT/DELETE single post

lib/
├── auth.ts                      # NextAuth config with CredentialsProvider
├── prisma.ts                    # Prisma singleton client
├── airtable.ts                  # getEcosystemPartners() — fetches from Airtable API
└── utils.ts                     # Utilities

components/
├── admin/
│   ├── BlockEditor.tsx          # TipTap editor with toolbar
│   ├── ThemeProvider.tsx        # Dark mode context
│   └── ThemeToggle.tsx          # Dark/light toggle button
└── ui/                          # shadcn/ui components

prisma/
├── schema.prisma                # Database schema (User, Post, Page, Media, Category, Tag)
└── seed.ts                      # Demo data seeding

types/                           # Custom TypeScript types
```

## Environment Variables

Required in `.env.local`:

```bash
DATABASE_URL=           # PostgreSQL connection string
AUTH_SECRET=            # NextAuth.js secret (random string)
NEXTAUTH_URL=           # e.g. http://localhost:3000

# Cloudflare R2 (media uploads)
S3_ENDPOINT=            # https://<account_id>.r2.cloudflarestorage.com
S3_REGION=auto
S3_BUCKET=              # R2 bucket name
S3_ACCESS_KEY_ID=       # R2 API token Access Key ID
S3_SECRET_ACCESS_KEY=   # R2 API token Secret Access Key
R2_PUBLIC_URL=          # https://pub-<hash>.r2.dev (or custom domain)

# Airtable (ecosystem page — page renders empty if unset, no crash)
AIRTABLE_API_KEY=
AIRTABLE_BASE_ID=
AIRTABLE_ECOSYSTEM_TABLE=
```

## Important Patterns

### Route Protection

All `/admin/*` routes are protected by `middleware.ts`:
- Checks for valid JWT session via `req.auth`
- Unauthenticated users redirected to `/admin/login`
- Login page is NOT protected

### API Authentication

All API routes check for session:
```typescript
const session = await auth();
if (!session?.user?.id) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

### Database Access

Always use the Prisma singleton:
```typescript
import { prisma } from '@/lib/prisma';
const user = await prisma.user.findUnique({ where: { email } });
```

### Styling

- **Public site**: Uses default Tailwind (light mode)
- **Admin**: Uses TweakCN theme with dark mode toggle
- Dark mode applied via `.dark` class on wrapper div (only affects admin)
- Semantic color tokens: `bg-background`, `text-foreground`, `border-border`, etc.

### Content Editing

TipTap editor stores content as JSON (not HTML):
- `/components/admin/BlockEditor.tsx` handles all editing
- `onChange` callback provides JSON object for saving
- Props: `content` (TipTap JSON), `onChange` (callback)
- Integrated into post create/edit pages

## Development Workflows

### Creating a Blog Post

1. Login: `/admin/login` with admin@example.com / password
2. Click "Blog Posts" in sidebar
3. Click "+ New Post"
4. Fill in:
   - **Title** (auto-generates slug)
   - **Content** (TipTap editor with toolbar)
   - **Excerpt** (optional)
   - **SEO section** (title, description, OG image)
5. Choose status: DRAFT or PUBLISHED
6. Click "Publish" or "Save Draft"
7. View at `/blog/[slug]` (published) or `/admin/posts/[id]/edit` (draft)

### Creating a Database Migration

```bash
# After updating prisma/schema.prisma:
npm run prisma:migrate
# Select "Create migration"
# Enter migration name
# Prisma applies to database
```

### Debugging

```bash
npm run prisma:studio      # GUI for database (http://localhost:5555)
npm run build              # Check for build errors
rm -rf .next && npm run dev # Clear Next.js cache
```

## Database Schema

**User**
- id, email (unique), password (bcrypt), name, role (ADMIN|EDITOR|VIEWER)

**Post**
- id, title, slug (unique), content (JSON), excerpt, coverImage
- status (DRAFT|PUBLISHED|ARCHIVED), seoTitle, seoDesc, ogImage
- authorId (FK to User), categories, tags
- publishedAt, createdAt, updatedAt

**Page** (similar to Post, for CMS-driven pages)

**Media**
- id, url, filename, mimeType, size, alt
- Uploads go to Cloudflare R2 via `app/api/upload/route.ts`

**Category, Tag**
- Taxonomy for posts (not yet implemented in UI)

## Authentication Details

**NextAuth.js v5 Configuration** (`lib/auth.ts`):
- Strategy: JWT (stateless, scales well)
- Provider: Credentials (email/password)
- Password verification: bcryptjs.compare()
- JWT payload includes: id, email, role
- Session expiry: 30 days (default)

**User Roles:**
- **ADMIN**: Full access to all features, user management
- **EDITOR**: Create, edit, publish content
- **VIEWER**: Read-only access (not yet fully implemented)

## Common Tasks

### Add a New Public Page

1. Create directory: `app/(site)/[page-name]/`
2. Create `page.tsx` with React component
3. Update nav links in `app/(site)/layout.tsx`

### Add a New API Endpoint

```typescript
// app/api/[route]/route.ts
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await req.json();
  // Zod validation, database operations, etc.
  return Response.json(result, { status: 201 });
}
```

### Modify the Admin Sidebar

Edit `app/admin/layout.tsx` - the nav links and structure are there.

### Change the Theme

TweakCN theme is defined via Tailwind CSS v4's `@config` directive. To customize:
- Primary color (NEAR green): Modify Tailwind `theme.colors.primary` or use TweakCN configurator
- Fonts: Change `next/font/google` imports in `app/layout.tsx`
- Dark mode classes: Managed by `AdminThemeProvider` context

## Next Steps (Incomplete Features)

- [x] **Media Upload**: Cloudflare R2 via `app/api/upload/route.ts` (S3-compatible)
- [ ] **Draft Preview**: Preview posts before publishing
- [ ] **Page Management**: CRUD for CMS pages
- [ ] **Categories & Tags**: UI for taxonomy management
- [ ] **RSS Feed**: /feed.xml generation (`feed` and `rss` packages already installed)
- [ ] **SEO**: Sitemap, robots.txt, Open Graph

See `DOCS.md` for detailed Phase 2 checklist and architecture deep-dive.

## Useful References

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js v5](https://next-auth.js.org)
- [TipTap Docs](https://www.tiptap.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)

---

**Last Updated**: Phase 2 (TipTap, Tailwind v4, TweakCN, Dark Mode, Airtable ecosystem)
