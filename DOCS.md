# NEAR.org Documentation

Complete guide for developers working on the NEAR.org CMS project.

## 📖 Table of Contents
1. Getting Started
2. Architecture
3. Implementation Guide
4. Phase 2 Checklist
5. Development Workflow

---

## 1. Getting Started

### Database Setup (Choose One)

**Docker (Easiest)**
```bash
docker run --name postgres-near -e POSTGRES_PASSWORD=password -e POSTGRES_DB=near_org -p 5432:5432 -d postgres:15
```

**Local PostgreSQL**
```bash
# macOS
brew install postgresql@15 && brew services start postgresql@15

# Ubuntu/Debian
sudo apt-get install postgresql && sudo service postgresql start
```

**Railway.app** - Sign up and create PostgreSQL database, copy connection string

### Environment Setup

```bash
cp .env.example .env
```

Update `.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/near_org"
NEXTAUTH_SECRET=$(openssl rand -hex 32)
NEXTAUTH_URL="http://localhost:3000"
```

### Database Initialization

```bash
npm run prisma:migrate   # Create tables
npm run prisma:seed      # Add demo data
npm run dev              # Start server
```

Login at `/admin/login` with:
- Email: `admin@example.com`
- Password: `password`

---

## 2. Architecture

### System Overview

```
Next.js 15 (App Router + TypeScript)
├── PUBLIC SITE (/app/(site)/)
│   ├── Home, About, Founders, Developers, Tech, Community
│   ├── Blog (ISR 60s revalidate)
│   └── Navigation + Footer
│
├── CMS ADMIN (/app/(admin)/)
│   ├── Login, Dashboard
│   ├── Posts/Pages management
│   ├── Media library
│   └── User management (admin-only)
│
└── API ROUTES (/app/api/)
    ├── Auth endpoints (NextAuth)
    └── CRUD for posts/pages/media

Middleware → JWT Session → PostgreSQL (Prisma ORM)
```

### Data Flow

**Public Site**
- User visits URL → Static/ISR cached page → Renders content

**CMS Admin**
- User logs in → NextAuth JWT → Middleware protects routes → Dashboard/Editor loaded

**Blog Post Creation**
1. Editor fills form in `/admin/posts/new`
2. TipTap editor saves JSON content
3. POST `/api/posts` → Prisma saves to DB
4. ISR revalidates blog pages automatically

### Database Schema

```
User
├─ id, email (UNIQUE), password (bcrypt), name
├─ role (ADMIN|EDITOR|VIEWER)
└─ createdAt, updatedAt

Post
├─ id, title, slug (UNIQUE), content (JSON - TipTap)
├─ excerpt, coverImage, ogImage
├─ status (DRAFT|PUBLISHED|ARCHIVED)
├─ seoTitle, seoDesc
├─ authorId (FK→User)
└─ publishedAt, createdAt, updatedAt

Page (similar to Post for CMS-driven pages)

Media
├─ id, url, filename, mimeType, size, alt
└─ createdAt

Category & Tag (post taxonomy)
```

### Authentication

NextAuth.js v5 with JWT strategy:
1. User submits email/password at `/admin/login`
2. Credentials provider finds user by email
3. bcryptjs compares password hash
4. JWT token created with user data (id, email, role)
5. Token stored in secure HTTP-only cookie
6. Middleware checks session on protected routes (`/admin/*`)
7. Role-based access control enforced

### Security Features

✅ bcryptjs password hashing (12 rounds)
✅ JWT tokens signed with NEXTAUTH_SECRET
✅ HTTP-only secure cookies (XSS protection)
✅ Middleware protects admin routes
✅ Zod schema validation on all API routes
✅ TypeScript strict mode
✅ Role-based permissions (ADMIN/EDITOR/VIEWER)

---

## 3. Implementation Guide

### Adding a New Public Page

```bash
# 1. Create page directory
mkdir -p app/\(site\)/[section]

# 2. Add page.tsx with React component
# 3. Update navigation in app/(site)/layout.tsx
```

### Creating an API Endpoint

```tsx
// app/api/[route]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await req.json();
  // Process data...
  return NextResponse.json(data, { status: 201 });
}
```

### Database Migrations

```bash
# Create new migration
npx prisma migrate dev --name descriptive_name

# Reset database (deletes data!)
npx prisma migrate reset

# Sync schema to DB
npx prisma db push

# View database
npm run prisma:studio
```

### Deploying to Railway

1. Push code to GitHub
2. Connect repo to Railway.app
3. Add environment variables:
   - `DATABASE_URL` → Railway PostgreSQL
   - `NEXTAUTH_SECRET` → Secure random string
   - `NEXTAUTH_URL` → Your domain

---

## 4. Phase 2 Checklist

### TipTap Block Editor ✅ DONE
- [x] Install TipTap dependencies
- [x] Create `components/admin/BlockEditor.tsx`
- [x] Configure toolbar (H1-H3, Bold, Italic, Lists, Code, Link, HR)
- [x] Support syntax highlighting with lowlight
- [x] Integrate into post editor

### Tailwind v4 + TweakCN Theme ✅ DONE
- [x] Migrate from Tailwind v3 → v4
- [x] Apply TweakCN design system (OKLch colors, 1.4rem radius)
- [x] Set NEAR green as primary color
- [x] Add Google Fonts (Plus Jakarta Sans, Lora, IBM Plex Mono)
- [x] Implement dark mode in admin

### shadcn/ui Components ✅ DONE
- [x] Initialize shadcn with `new-york` style
- [x] Install: button, card, badge, input, label, textarea, separator, skeleton
- [x] Refactor admin pages with semantic components
- [x] Update BlockEditor styling for dark mode

### Media Upload (TODO - Phase 2b)
- [ ] Setup Uploadthing account & credentials
- [ ] Create `lib/media.ts` helpers
- [ ] Create `app/api/media/route.ts` endpoint
- [ ] Build `components/admin/MediaPicker.tsx`
- [ ] Integrate into post editor for image uploads

### Draft Preview (TODO - Phase 2b)
- [ ] Create preview mode route
- [ ] Render TipTap JSON to HTML
- [ ] Show preview in modal before publish

---

## 5. Development Workflow

### Creating a Blog Post

1. Login at `/admin/login`
2. Navigate to "Blog Posts"
3. Click "+ New Post"
4. Fill title, content (TipTap editor), excerpt, cover image
5. Add SEO fields (title, description, OG image)
6. Choose status (DRAFT or PUBLISHED)
7. Save and view at `/blog/[slug]`

### Creating a CMS Page

1. Go to `/admin/pages`
2. Same workflow as blog post
3. Page appears on public site when published

### Editing Users

1. Admin goes to `/admin/users`
2. Create/edit user roles (ADMIN, EDITOR, VIEWER)
3. Permissions enforced by middleware

### Debugging

```bash
# View database GUI
npm run prisma:studio

# Check build for errors
npm run build

# Clear cache if stuck
rm -rf .next && npm run dev
```

---

## 🔗 Key Files Reference

- `lib/auth.ts` - NextAuth.js v5 config
- `lib/prisma.ts` - Database client singleton
- `middleware.ts` - Route protection
- `components/admin/BlockEditor.tsx` - TipTap editor
- `app/(admin)/layout.tsx` - Admin sidebar + ThemeProvider
- `prisma/schema.prisma` - Database schema

---

## 📚 External Resources

- [Next.js 16 Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js Docs](https://next-auth.js.org)
- [TipTap Docs](https://www.tiptap.dev)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

---

## 🆘 Troubleshooting

**"Error: connect ECONNREFUSED"**
→ PostgreSQL not running. Start it or use Docker.

**"NextAuth login not working"**
→ Check NEXTAUTH_SECRET in `.env`, clear browser cookies.

**"Port 3000 already in use"**
→ `npm run dev -- -p 3001`

**"Module not found"**
→ `npm install && npx prisma generate`

**"Database error during migration"**
→ `npx prisma db push` or `npx prisma migrate reset`

---

**Last Updated**: Phase 2 (Tailwind v4 + TweakCN + shadcn/ui + Dark Mode)
**Next Phase**: Media upload, draft preview, SEO enhancements
