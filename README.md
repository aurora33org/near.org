# NEAR.org CMS

A comprehensive marketing website & CMS for NEAR Protocol built with Next.js 15, Tailwind CSS v4 (TweakCN theme), PostgreSQL, and TipTap editor.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 12+ (or Docker)

### Setup (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Update DATABASE_URL and generate NEXTAUTH_SECRET with: openssl rand -hex 32

# 3. Initialize database
npm run prisma:migrate
npm run prisma:seed

# 4. Start dev server
npm run dev
```

Visit `http://localhost:3000` (site) or `http://localhost:3000/admin` (CMS)

### Default Credentials
- Email: `admin@example.com`
- Password: `password`

## 📁 Project Structure

```
app/
├── (site)/          # Public website (home, about, blog, etc.)
├── (admin)/         # CMS admin (dashboard, posts, users)
└── api/             # API endpoints (auth, CRUD)

lib/
├── auth.ts         # NextAuth v5 configuration
├── prisma.ts       # Database client
└── utils.ts        # Utilities

prisma/
├── schema.prisma   # Database schema
└── seed.ts         # Demo data

components/
├── admin/          # Admin UI (BlockEditor, ThemeProvider)
└── ui/             # shadcn/ui components
```

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 + TweakCN theme (NEAR green primary) |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth.js v5 (JWT + Credentials) |
| Editor | TipTap v3 (block-based rich text) |
| UI Components | shadcn/ui |
| Media | Uploadthing (configured) |

## ✨ Features

### Public Site
- 📄 Multiple landing pages (Home, About, Founders, Developers, Tech, Community)
- 📝 Blog with ISR (60s revalidate)
- 🎨 Responsive design with TweakCN theme
- 🌙 Dark mode support
- 📊 SEO optimized

### CMS Admin
- 🔐 Email + password authentication with role-based access
- ✍️ TipTap block editor for rich content
- 📸 Media library with Uploadthing
- 📋 Blog & page management (create, edit, publish, delete)
- 👥 User management (admin-only)
- 🎨 Dark/light mode toggle

## 🔑 Commands

```bash
npm run dev              # Start dev server
npm run build           # Production build
npm run start           # Run production
npm run prisma:migrate  # Database migrations
npm run prisma:seed     # Seed demo data
npm run prisma:studio   # Database admin UI
```

## 📚 Documentation

- **DOCS.md** - Complete architecture, implementation guide, Phase 2 checklist
- **[Prisma](https://prisma.io)** - Database ORM
- **[NextAuth.js](https://next-auth.js.org)** - Authentication
- **[TipTap](https://tiptap.dev)** - Rich text editor

## 🚀 Deployment

Push to GitHub and deploy to Railway.app:
1. Set `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` in Railway
2. Auto-deploys on git push

## 📊 Database Schema

**User** - Authentication (email, password hash, role)
**Post** - Blog posts (title, slug, content, status, SEO fields)
**Page** - CMS pages (similar to Post)
**Media** - File metadata (url, filename, mimeType)
**Category & Tag** - Post taxonomy

## 🔐 Roles

| Role | Permissions |
|------|------------|
| ADMIN | Full access, user management |
| EDITOR | Create/edit content |
| VIEWER | Read-only |

## 🎨 Current Phase

✅ **Phase 1**: Foundation (Auth, DB, Blog, Admin scaffold)
✅ **Phase 2**: CMS Core (TipTap editor, Media, Dark mode, shadcn/ui)
⏳ **Phase 3**: Page management system
⏳ **Phase 4**: SEO & blog rendering enhancements

## 📖 Next Steps

See **DOCS.md** for detailed Phase 2 checklist and architecture overview.

---

Built with ❤️ for NEAR Protocol | [GitHub](https://github.com/aurora33org/near.org)
