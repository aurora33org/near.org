# NEAR.org Implementation Guide

## ✅ Completed: Phase 1 - Foundation

This document outlines what has been implemented and the next steps to get your NEAR.org marketing website running.

### What's Been Set Up

#### 1. **Project Structure**
- Next.js 15 with App Router (TypeScript)
- Tailwind CSS for styling
- Full TypeScript support with strict mode
- ESLint configuration

#### 2. **Public Website (`/app/(site)/*`)**
- **Layout**: Navigation bar with links to all sections + Footer
- **Pages**:
  - Home page (hardcoded hero + features)
  - About NEAR (stub)
  - For Founders (stub)
  - For Developers (stub)
  - Tech Stack (stub)
  - Community (stub)
  - Blog (with ISR)
- **Blog System**:
  - `/blog` - Index of published posts (ISR, 60s revalidate)
  - `/blog/[slug]` - Individual post pages (ISR, 60s revalidate)
  - Full SEO support with metadata generation

#### 3. **CMS Admin Panel (`/app/(admin)/*`)**
- **Authentication**: Email + password login with NextAuth.js v5
- **Routes**:
  - `/admin/login` - Public login page
  - `/admin/dashboard` - Welcome dashboard with stats
  - `/admin/posts` - Blog posts list & management
  - `/admin/posts/new` - Create new post form
  - `/admin/posts/[id]/edit` - Edit post form
  - `/admin/pages` - Pages management (stub)
  - `/admin/media` - Media library (stub)
  - `/admin/users` - User management (admin-only)
- **Features**:
  - Role-based access control (ADMIN, EDITOR, VIEWER)
  - Middleware-protected routes
  - Responsive admin layout with sidebar

#### 4. **Database (PostgreSQL + Prisma)**
- **Schema includes**:
  - `User` - Authentication & user management
  - `Post` - Blog posts with SEO fields
  - `Page` - Editable content pages
  - `Media` - Media library metadata
  - `Category` & `Tag` - Post taxonomy
- **Features**:
  - Timestamps on all records
  - Role-based permissions
  - Post status workflow (DRAFT → PUBLISHED → ARCHIVED)

#### 5. **API Routes**
- `POST /api/auth/[...nextauth]` - NextAuth endpoints
- `GET /api/posts` - List all posts
- `POST /api/posts` - Create new post
- `GET /api/posts/[id]` - Get single post
- `PUT /api/posts/[id]` - Update post
- `DELETE /api/posts/[id]` - Delete post

#### 6. **Authentication**
- NextAuth.js v5 with Credentials provider
- JWT session strategy
- Prisma adapter for database sessions
- Role-based access control (RBAC)

### 🚀 Getting Started

#### Prerequisites
- Node.js 18+ (you have v18.20.8)
- PostgreSQL 12+ (local or remote)

#### Step 1: Set Up Environment Variables
Create a `.env` file with:
```bash
# Database - IMPORTANT: Update with your PostgreSQL URL
DATABASE_URL="postgresql://user:password@localhost:5432/near_org"

# Generate a secure random string with: openssl rand -hex 32
NEXTAUTH_SECRET="your-32-char-hex-string-here"

# For local development
NEXTAUTH_URL="http://localhost:3000"
```

#### Step 2: Set Up PostgreSQL
You have three options:

**Option A: Local PostgreSQL**
```bash
# macOS (if using Homebrew)
brew install postgresql
brew services start postgresql

# Linux (Ubuntu/Debian)
sudo apt-get install postgresql
sudo service postgresql start

# Windows - Download from postgresql.org
```

**Option B: Docker (Easiest)**
```bash
docker run --name postgres-near \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=near_org \
  -p 5432:5432 \
  -d postgres:15

# Then use: postgresql://postgres:password@localhost:5432/near_org
```

**Option C: Railway.app (Production-Ready)**
- Sign up at railway.app
- Create PostgreSQL database
- Copy connection string to `.env`

#### Step 3: Initialize Database
```bash
# Create all tables from schema
npm run prisma:migrate

# Seed with demo data and users
npm run prisma:seed
```

#### Step 4: Start Development Server
```bash
npm run dev
```

Visit:
- **Public Site**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login

#### Step 5: Login with Demo Credentials
```
Email: admin@example.com
Password: password
```

### 📝 Next Steps (Phase 2 - CMS Core)

#### 1. **Implement TipTap Block Editor**
The foundation is ready for the TipTap editor. Create:
- `components/admin/BlockEditor.tsx` - TipTap wrapper
- Support blocks: heading, paragraph, image, code, quote, video, CTA, divider
- Store content as JSON in `Post.content` field

#### 2. **Implement Uploadthing Integration**
- Create `lib/media.ts` - Uploadthing upload helpers
- Create `components/admin/MediaPicker.tsx` - File picker UI
- Update `/admin/media` page to show media library
- Add upload endpoint at `/api/media/upload`

#### 3. **Complete Post Editor**
- Update `/admin/posts/new` to include TipTap editor
- Update `/admin/posts/[id]/edit` with full editor
- Add cover image picker
- Add categories & tags selection

#### 4. **Implement Blog Post Rendering**
- Update `/app/(site)/blog/[slug]/page.tsx` to render TipTap JSON
- Create TipTap to HTML renderer component

### 🔄 Project Workflow

**Creating a Blog Post:**
1. Go to `/admin/posts`
2. Click "+ New Post"
3. Fill in title, slug (auto-generated), excerpt
4. Add content with TipTap editor
5. Add cover image, SEO fields
6. Save as DRAFT or PUBLISHED
7. View live at `/blog/[slug]`

**Creating an Editable Page:**
1. Go to `/admin/pages`
2. Create page with TipTap editor
3. Publish and it appears on public site
4. Used for Community, About, etc.

### 🔐 User Roles & Permissions

| Action | Admin | Editor | Viewer |
|--------|-------|--------|--------|
| Create posts | ✅ | ✅ | ❌ |
| Edit own posts | ✅ | ✅ | ❌ |
| Delete posts | ✅ | Only own | ❌ |
| Publish posts | ✅ | ✅ | ❌ |
| Edit pages | ✅ | ✅ | ❌ |
| View media | ✅ | ✅ | ✅ |
| Manage users | ✅ | ❌ | ❌ |

### 📊 Database Seeding

The `prisma/seed.ts` creates:
- **Users**:
  - admin@example.com (ADMIN)
  - editor@example.com (EDITOR)
- **Categories**: Announcements, Tutorials
- **Tags**: Web3, Blockchain

Add more in `seed.ts` as needed.

### 🛠 Useful Commands

```bash
# Development
npm run dev                 # Start dev server
npm run build              # Production build
npm run start              # Start prod server

# Database
npm run prisma:migrate     # Create/apply migrations
npm run prisma:seed        # Run seed script
npm run prisma:studio      # Open Prisma admin UI
npx prisma db push         # Sync schema to DB

# Linting
npm run lint               # Run ESLint
```

### 🐛 Common Issues & Solutions

**"Error: connect ECONNREFUSED"**
- PostgreSQL isn't running
- Check DATABASE_URL in .env
- Start PostgreSQL service

**"NextAuth secret missing"**
- Generate: `openssl rand -hex 32`
- Add to `.env` as NEXTAUTH_SECRET

**"Post creation fails with 401"**
- Log in first
- Check NextAuth session

**"Slug already exists"**
- Slug must be unique
- Try different slug or rename post

### 📚 Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js Docs](https://next-auth.js.org)
- [TipTap Docs](https://www.tiptap.dev)
- [Uploadthing Docs](https://docs.uploadthing.com)

### 🚀 Deployment to Railway

1. Push code to GitHub
2. Connect GitHub repo to Railway.app
3. Add environment variables in Railway dashboard
4. Railway auto-deploys on push

Required Railway env vars:
- `DATABASE_URL` - Railway PostgreSQL URL
- `NEXTAUTH_SECRET` - Your secret
- `NEXTAUTH_URL` - Your domain (e.g., https://yourapp.railway.app)

### 📝 File Structure Cheat Sheet

```
app/
├── (site)/               # Public website
│   ├── layout.tsx       # Nav + Footer
│   ├── page.tsx         # Home
│   └── blog/            # Blog system
│
├── (admin)/             # CMS Dashboard
│   ├── login/           # Auth
│   ├── dashboard/       # Stats
│   └── posts/           # Blog management
│
└── api/                 # API endpoints
    ├── auth/            # NextAuth
    └── posts/           # CRUD

lib/
├── auth.ts             # NextAuth config
├── prisma.ts           # DB client
└── utils.ts            # Helpers

prisma/
├── schema.prisma       # DB schema
└── seed.ts             # Demo data
```

---

**You're all set!** Follow Step 1-5 above to get your development environment running. Then proceed with Phase 2 to implement the TipTap editor and complete the CMS.
