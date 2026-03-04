# NEAR.org Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Next.js 15 (App Router)                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────────────────────────────┐    ┌──────────────────────────────┐
│  │   PUBLIC SITE (site)       │    │   CMS ADMIN (admin)          │
│  ├────────────────────────────┤    ├──────────────────────────────┤
│  │ /                          │    │ /admin/login                 │
│  │ /about                     │    │ /admin/dashboard             │
│  │ /founders                  │    │ /admin/posts                 │
│  │ /developers                │    │ /admin/posts/[id]/edit       │
│  │ /tech                      │    │ /admin/pages                 │
│  │ /community                 │    │ /admin/media                 │
│  │ /blog                      │    │ /admin/users                 │
│  │ /blog/[slug]               │    │                              │
│  │                            │    │ Layout: Sidebar + Content    │
│  │ Layout: Nav + Footer       │    │ Auth: NextAuth.js v5         │
│  │ Static + ISR rendering     │    │ Protected by middleware      │
│  └────────────────────────────┘    └──────────────────────────────┘
│
│  ┌────────────────────────────────────────────────────────────────┐
│  │                       API Routes (/api)                        │
│  ├────────────────────────────────────────────────────────────────┤
│  │ POST   /api/auth/[...nextauth]    NextAuth endpoints           │
│  │ GET    /api/posts                 List posts                   │
│  │ POST   /api/posts                 Create post                  │
│  │ GET    /api/posts/[id]            Get single post              │
│  │ PUT    /api/posts/[id]            Update post                  │
│  │ DELETE /api/posts/[id]            Delete post                  │
│  └────────────────────────────────────────────────────────────────┘
│
└─────────────────────────────────────────────────────────────────────┘
          │                                              │
          │                                              │
          ▼                                              ▼
     ┌─────────────────────┐                  ┌──────────────────┐
     │   Middleware.ts     │                  │ NextAuth Config  │
     │ (Route Protection)  │                  │   (Auth Logic)   │
     └─────────────────────┘                  └──────────────────┘
          │                                              │
          └──────────────────────┬───────────────────────┘
                                 │
                                 ▼
                    ┌───────────────────────┐
                    │   JWT Session Store   │
                    │   (Encrypted Token)   │
                    └───────────────────────┘
                                 │
                                 ▼
                    ┌───────────────────────────────────┐
                    │   PostgreSQL + Prisma ORM         │
                    ├───────────────────────────────────┤
                    │ Tables:                           │
                    │ - User                            │
                    │ - Post                            │
                    │ - Page                            │
                    │ - Media                           │
                    │ - Category                        │
                    │ - Tag                             │
                    │ - Account (NextAuth)              │
                    │ - Session (NextAuth)              │
                    │ - VerificationToken (NextAuth)    │
                    └───────────────────────────────────┘
```

## Data Flow

### Public Site User Journey

```
User visits NEAR.org
        │
        ▼
   Load Home Page
        │
        ├─→ /page.tsx (Static)
        │
        ▼
   Navigation Menu
   (Hardcoded Links)
        │
        ├─→ /about/page.tsx (Static)
        ├─→ /founders/page.tsx (Static)
        ├─→ /developers/page.tsx (Static)
        ├─→ /tech/page.tsx (Static)
        └─→ /blog/page.tsx (ISR)
              │
              ▼
         Fetch published posts
              │
              ▼
         Display blog index
              │
              User clicks post
              │
              ▼
         /blog/[slug]/page.tsx (ISR)
              │
              ▼
         Fetch post from DB
         (If not in cache)
              │
              ▼
         Render post content
         + SEO metadata
```

### CMS Admin Flow

```
Admin visits /admin/login
        │
        ▼
   NextAuth Login Form
        │
   Enter credentials
        │
        ▼
   POST /api/auth/callback/credentials
        │
        ▼
   Prisma: Find user by email
   Compare password hash
        │
        ├─→ Invalid? Show error
        │
        ├─→ Valid? Create session
        │
        ▼
   Store JWT in session
        │
        ▼
   Redirect to /admin/dashboard
        │
        ▼
   Middleware checks session
   (If missing, redirect to login)
        │
        ▼
   Admin Dashboard
   (Shows stats from DB)
        │
   User clicks "Posts"
        │
        ▼
   GET /admin/posts
        │
        ▼
   GET /api/posts (fetch from DB)
        │
        ▼
   Display posts table
        │
   User clicks "Edit"
        │
        ▼
   /admin/posts/[id]/edit
        │
   User updates content
        │
        ▼
   PUT /api/posts/[id]
        │
        ▼
   Update in PostgreSQL
        │
        ▼
   ISR revalidates blog pages
   (automatically in bg)
```

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      NextAuth.js v5 Flow                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. User submits login form                                    │
│     └─→ POST /api/auth/callback/credentials                    │
│                                                                 │
│  2. Prisma finds user by email                                 │
│     └─→ db.user.findUnique({ where: { email } })              │
│                                                                 │
│  3. Compare password (bcryptjs)                                │
│     └─→ bcrypt.compare(inputPassword, storedHash)              │
│                                                                 │
│  4. If valid → Create JWT token                                │
│     ├─→ {                                                       │
│     │    id: user.id,                                           │
│     │    email: user.email,                                     │
│     │    role: user.role                                        │
│     │  }                                                         │
│     │                                                            │
│     └─→ Sign with NEXTAUTH_SECRET                              │
│                                                                 │
│  5. Store token in secure HTTP-only cookie                     │
│     └─→ Browser can't access (XSS safe)                        │
│                                                                 │
│  6. Middleware intercepts protected routes                      │
│     └─→ /admin/* requires valid session                        │
│         /admin/users requires ADMIN role                       │
│                                                                 │
│  7. Session callback enriches with user data                   │
│     └─→ session.user.id & role added to token                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Database Schema

```
User
├─ id (String, PK)
├─ email (String, UNIQUE)
├─ password (String, bcrypt hash)
├─ name (String)
├─ role (ADMIN | EDITOR | VIEWER)
├─ createdAt (DateTime)
├─ updatedAt (DateTime)
└─ Relations:
   ├─ posts: Post[] (one-to-many)
   └─ pages: Page[] (one-to-many)

Post
├─ id (String, PK)
├─ title (String)
├─ slug (String, UNIQUE)
├─ content (Json, TipTap blocks)
├─ excerpt (String?)
├─ coverImage (String?, URL)
├─ status (DRAFT | PUBLISHED | ARCHIVED)
├─ seoTitle (String?)
├─ seoDesc (String?)
├─ ogImage (String?, URL)
├─ publishedAt (DateTime?)
├─ createdAt (DateTime)
├─ updatedAt (DateTime)
├─ authorId (String, FK→User)
└─ Relations:
   ├─ author: User
   ├─ categories: Category[]
   └─ tags: Tag[]

Page
├─ id (String, PK)
├─ title (String)
├─ slug (String, UNIQUE)
├─ content (Json, TipTap blocks)
├─ status (DRAFT | PUBLISHED | ARCHIVED)
├─ seoTitle (String?)
├─ seoDesc (String?)
├─ ogImage (String?)
├─ createdAt (DateTime)
├─ updatedAt (DateTime)
├─ authorId (String, FK→User)
└─ author: User

Media
├─ id (String, PK)
├─ url (String, Uploadthing/R2)
├─ filename (String)
├─ mimeType (String)
├─ size (Int)
├─ alt (String?)
└─ createdAt (DateTime)

Category
├─ id (String, PK)
├─ name (String, UNIQUE)
├─ slug (String, UNIQUE)
└─ posts: Post[]

Tag
├─ id (String, PK)
├─ name (String, UNIQUE)
├─ slug (String, UNIQUE)
└─ posts: Post[]
```

## Rendering Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                    Rendering Strategy by Route                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  STATIC (Build-time only)                                      │
│  ├─ Home page /                                                │
│  ├─ About /about                                               │
│  ├─ Founders /founders                                         │
│  ├─ Developers /developers                                     │
│  ├─ Tech Stack /tech                                           │
│  └─ Reason: Hardcoded content, never changes                   │
│                                                                 │
│  ISR (Incremental Static Regeneration)                         │
│  ├─ Blog index /blog                                           │
│  │  ├─ Revalidate: 60 seconds                                  │
│  │  └─ Reason: List of posts changes                           │
│  │                                                              │
│  └─ Blog post /blog/[slug]                                     │
│     ├─ Revalidate: 60 seconds                                  │
│     ├─ Fallback: blocking                                      │
│     └─ Reason: Content editable, fresh SEO important           │
│                                                                 │
│  SERVER-RENDERED (Real-time)                                   │
│  ├─ All /admin/* routes                                        │
│  ├─ No caching                                                 │
│  ├─ Requires authentication                                    │
│  └─ Reason: Admin needs latest data always                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Security Features

```
✅ Password Security
   └─ bcryptjs hashing (salt rounds: 12)

✅ Session Security
   └─ JWT tokens signed with NEXTAUTH_SECRET
   └─ HTTP-only secure cookies
   └─ CSRF protection built-in

✅ Route Protection
   └─ Middleware.ts protects /admin/*
   └─ Role-based access control
   └─ POST endpoints check session & ownership

✅ Input Validation
   └─ Zod schema validation on all API routes
   └─ TypeScript strict mode

✅ Environment Secrets
   └─ .env not committed to git
   └─ NEXTAUTH_SECRET required
   └─ DATABASE_URL kept private

✅ Permissions
   ├─ ADMIN: All access
   ├─ EDITOR: Create/edit content
   └─ VIEWER: Read-only access
```

## Performance Optimizations

```
📊 Caching Strategy
│
├─ Static pages cached at build time
├─ ISR pages cached + revalidate every 60s
├─ Blog index refreshes when posts change
│
🗄️ Database Optimizations
│
├─ Prisma provides connection pooling
├─ Select only needed fields
├─ Eager load related data
│
🚀 Frontend Performance
│
├─ Code splitting via Next.js
├─ Image optimization with next/image
├─ CSS minimization with Tailwind
│
🔐 Security at Scale
│
├─ Middleware runs on edge (Railway)
├─ No sensitive data exposed in client
└─ Environment-based configuration
```

---

**Note**: This architecture supports scaling from MVP to enterprise with optional upgrades:
- Replace Uploadthing with Cloudflare R2 for large media volumes
- Add Redis caching layer
- Migrate to serverless functions
- Add CDN for static assets
