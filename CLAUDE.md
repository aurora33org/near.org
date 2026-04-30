# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo Structure

This is a **pnpm monorepo** with Turborepo. There are 3 apps sharing 1 CMS core package.

```
/
├── packages/
│   └── cms-core/          ← Shared CMS engine (@near/cms-core)
│       ├── components/admin/  — Admin UI (BlockEditor, sidebar, etc.)
│       ├── components/ui/     — shadcn/ui primitives
│       ├── lib/               — auth, prisma, email, utils, tiptap-renderer
│       ├── pages/admin/       — Admin page implementations (re-exported by apps)
│       ├── routes/api/        — API route handlers (re-exported by apps)
│       ├── prisma/            — Schema + migrations (shared DB schema)
│       ├── styles/            — admin.css (TipTap + dark mode editor styles)
│       └── types/             — next-auth.d.ts type extensions
│
└── apps/
    ├── near-demo/         → near-demo.localhost (port 3000) — NEAR demo/org site
    ├── near-ai/           → near-ai.localhost (port 3001)   — NEAR AI site
    └── near-com/          → near-com.localhost (port 3002)  — NEAR .com site
```

Each app has:
- Its own `app/(site)/` — public pages (home, blog, etc.) — site-specific design
- `app/admin/` — 1-line re-exports pointing to `cms-core/pages/admin/`
- `app/api/` — 1-line re-exports pointing to `cms-core/routes/api/`
- Its own `proxy.ts` — auth protection for `/admin/*`
- Its own database via `DATABASE_URL` env var

## Quick Commands

```bash
# Run a specific app (from repo root)
pnpm --filter @near/near-demo run dev   # near-demo.localhost:3000
pnpm --filter @near/near-ai run dev     # near-ai.localhost:3001
pnpm --filter @near/near-com run dev    # near-com.localhost:3002

# Run all apps simultaneously
pnpm turbo run dev

# With portless (from app directory)
cd apps/near-demo && portless run next dev
cd apps/near-ai && portless run next dev

# Build
pnpm turbo run build
pnpm turbo run build --filter=@near/near-demo   # single app

# Database (Prisma lives in cms-core)
pnpm --filter @near/cms-core run prisma:migrate  # create/apply migrations
pnpm --filter @near/cms-core run prisma:seed     # seed demo users
pnpm --filter @near/cms-core run prisma:studio   # Prisma Studio
```

**Dev credentials:** `admin@example.com` / `password`

## Key Technologies

| Layer | Stack |
|-------|-------|
| Framework | Next.js 16 (App Router, TypeScript) |
| Monorepo | pnpm workspaces + Turborepo |
| Styling | Tailwind CSS v4 + shadcn/ui (new-york style) |
| Database | PostgreSQL + Prisma ORM (schema in `packages/cms-core/prisma/`) |
| Auth | NextAuth.js v5 (JWT + Credentials) |
| Editor | TipTap v3 (block-based, slash commands, drag handles) |
| Media | Cloudflare R2 via `@aws-sdk/client-s3` |
| Email | Resend (`packages/cms-core/lib/email.ts`) |

## Environment Variables

Each app needs its own `.env.local` in its directory (e.g. `apps/near-demo/.env.local`):

```bash
DATABASE_URL=           NEXTAUTH_URL=           AUTH_SECRET=
S3_ENDPOINT=            S3_REGION=auto          S3_BUCKET=
S3_ACCESS_KEY_ID=       S3_SECRET_ACCESS_KEY=   R2_PUBLIC_URL=
RESEND_API_KEY=
AIRTABLE_API_KEY=       AIRTABLE_BASE_ID=       AIRTABLE_ECOSYSTEM_TABLE=
```

Each app has its own `DATABASE_URL` pointing to its own PostgreSQL instance.

## Important Patterns

**Route protection** — `proxy.ts` in each app guards `/admin/*` via `req.auth`. API routes call `await auth()` and return 401 if no session. (Note: previously `middleware.ts`, renamed to `proxy.ts` in Next.js 16.)

**Database** — Always use the singleton from cms-core: `import { prisma } from '@near/cms-core/lib/prisma'`

**Imports in apps** — Use `@near/cms-core/*` for shared code, `@/*` for app-local code:
```typescript
import { auth } from "@near/cms-core/lib/auth";           // shared
import { prisma } from "@near/cms-core/lib/prisma";        // shared
import { renderBlocks } from "@near/cms-core/lib/tiptap-renderer"; // shared
import MyComponent from "@/components/site/MyComponent";   // app-local
```

**Imports in cms-core** — Use `@cms/*` alias (maps to cms-core root):
```typescript
import { prisma } from "@cms/lib/prisma";
import { auth } from "@cms/lib/auth";
```

**Styling** — Public site: plain Tailwind light mode. Admin: dark mode via `.dark` class applied by `AdminThemeProvider`. Use semantic tokens (`bg-background`, `text-foreground`, etc.). Shared admin styles in `packages/cms-core/styles/admin.css`.

**Tailwind @source** — Each app's `globals.css` must include `@source` pointing to cms-core so Tailwind scans shared components:
```css
@source "../../../packages/cms-core/components/**/*.tsx";
@source "../../../packages/cms-core/pages/**/*.tsx";
@source "../../../packages/cms-core/routes/**/*.tsx";
```

**Editor** — TipTap stores content as JSON. `packages/cms-core/components/admin/editor/BlockEditor.tsx` handles editing. `packages/cms-core/lib/tiptap-renderer.tsx` renders on public site (accepts `ImageComponent` and `CarouselComponent` via dependency injection).

**ISR** — Blog index and post pages revalidate every 60s. On publish/update, `revalidatePath()` triggers immediately.

**Re-export pattern** — Admin pages and API routes in each app are 1-line re-exports:
```typescript
// apps/near-ai/app/admin/dashboard/page.tsx
export { default } from "@near/cms-core/pages/admin/dashboard/page";

// apps/near-ai/app/api/posts/route.ts
export { GET, POST } from "@near/cms-core/routes/api/posts/route";
```
Fix a bug in cms-core once → all 3 apps get it automatically.

## Database Schema (key models)

**User** — id, email, password (bcrypt), name, role (ADMIN|EDITOR|VIEWER)

**Post** — id, title, slug, content (JSON/TipTap), excerpt, coverImage, heroBgColor, heroBgImage, status (DRAFT|PUBLISHED|ARCHIVED), seoTitle, seoDesc, ogImage, previewToken, previewPassword, lockedBy/lockedAt (90s edit lock), authorId, publishedAt

**Media** — id, url, filename, mimeType, size, alt

**Category / Tag** — id, name, slug

**AuditLog** — userId, userEmail, action, entityType, entityId, entityTitle

## Auth & Roles

JWT strategy, 30-day sessions. Roles: **ADMIN** (full access) · **EDITOR** (own posts + all reads) · **VIEWER** (own posts read-only).

## Incomplete Features

- **Page Management** — DB model exists, admin UI is a stub
- **near-demo public pages** — Most static stubs (Founders, Developers, Tech, etc.)
- **Notification emails** — Only password reset email exists

---

*Last updated: Phase 4 (Monorepo migration — pnpm workspaces + Turborepo + cms-core shared package)*
