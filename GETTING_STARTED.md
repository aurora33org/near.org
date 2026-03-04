# 🚀 Getting Started with NEAR.org CMS

Welcome! You now have a fully-scaffolded Next.js 15 marketing website and CMS for NEAR Protocol. This guide will get you up and running in 10 minutes.

## ✨ What You Have

**27 files created** across:
- **22** Page routes and API endpoints (Next.js App Router)
- **3** Utility libraries (auth, database, helpers)
- **2** Database files (schema + seed script)
- **5** Configuration files (Next.js, TypeScript, Tailwind, etc.)
- **4** Documentation files (this guide, architecture, implementation guide, and phase 2 checklist)

## 📚 Quick Overview

### Public Website
- **Home page** with hero section
- **Section pages** (About, Founders, Developers, Tech Stack, Community)
- **Blog system** with ISR (Incremental Static Regeneration)
- **Responsive design** with Tailwind CSS

### CMS Admin Panel
- **User authentication** (email + password)
- **Blog post management** (create, edit, publish, delete)
- **Role-based access control** (Admin, Editor, Viewer roles)
- **Media management** (coming in Phase 2)
- **User management** (admin-only)

### Technology Stack
- Next.js 15 with App Router
- PostgreSQL + Prisma ORM
- NextAuth.js v5 for authentication
- TipTap editor (configured, ready to implement)
- Uploadthing for media storage
- Tailwind CSS for styling

## ⚡ Quick Start (5 minutes)

### Step 1: Database Setup

**Choose one:**

**Option A: Docker (Easiest)**
```bash
docker run --name postgres-near \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=near_org \
  -p 5432:5432 \
  -d postgres:15
```

**Option B: Local PostgreSQL**
```bash
# macOS
brew install postgresql@15
brew services start postgresql@15

# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start

# Then create database:
createdb near_org
```

**Option C: Railway.app (Cloud)**
1. Sign up at https://railway.app
2. Create PostgreSQL database
3. Copy connection string

### Step 2: Configure Environment

```bash
# Copy the example file
cp .env.example .env

# Update .env with your database:
# DATABASE_URL="postgresql://user:password@localhost:5432/near_org"

# Generate a secure random string:
# NEXTAUTH_SECRET=$(openssl rand -hex 32)
```

### Step 3: Initialize Database

```bash
# Create tables from Prisma schema
npm run prisma:migrate

# Seed with demo data and users
npm run prisma:seed
```

### Step 4: Start Development Server

```bash
npm run dev
```

Visit:
- **Public site**: http://localhost:3000
- **CMS**: http://localhost:3000/admin/login

### Step 5: Login

Use the demo credentials:
```
Email: admin@example.com
Password: password
```

## 🎯 What You Can Do Right Now

✅ **View the website** at http://localhost:3000
✅ **Login to CMS** with admin credentials
✅ **Create blog posts** (without editor yet - coming Phase 2)
✅ **Manage users** (admin-only)
✅ **See dashboard** with statistics

## 📖 Documentation

Read these in order to understand the project:

1. **IMPLEMENTATION_GUIDE.md** - Step-by-step setup + common issues
2. **ARCHITECTURE.md** - System design, data flows, database schema
3. **PHASE2_CHECKLIST.md** - What to implement next (TipTap editor, etc.)
4. **README.md** - Project overview and features

## 🔧 Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run start            # Run production build

# Database
npm run prisma:migrate   # Create/run migrations
npm run prisma:seed      # Populate with demo data
npm run prisma:studio    # Open database admin UI

# Code quality
npm run lint             # Run ESLint
```

## 🎨 Project Structure at a Glance

```
/root/near/org/
├── app/
│   ├── (site)/          # Public website
│   │   ├── page.tsx     # Home
│   │   ├── blog/        # Blog system
│   │   └── ...sections
│   ├── (admin)/         # CMS Admin
│   │   ├── login/       # Auth
│   │   ├── dashboard/   # Stats
│   │   └── posts/       # Post management
│   ├── api/             # API endpoints
│   └── layout.tsx       # Root layout
├── lib/
│   ├── auth.ts          # Authentication setup
│   ├── prisma.ts        # Database client
│   └── utils.ts         # Helper functions
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Demo data
└── components/          # Reusable React components
```

## 🚦 Your Next Steps

### Immediate (This Week)
1. ✅ Get the dev server running locally
2. ✅ Login to the admin panel
3. ✅ Create a test blog post
4. ✅ Explore the database with Prisma Studio (`npm run prisma:studio`)

### This Sprint (Phase 2)
1. Implement TipTap block editor
2. Setup Uploadthing for media uploads
3. Complete the post creation workflow
4. Implement draft preview system

**Read PHASE2_CHECKLIST.md for detailed task breakdown**

### Future Phases
- Phase 3: Page management system
- Phase 4: Blog rendering + SEO enhancements
- Phase 5: Complex hardcoded pages (Founders, Developers, etc.)
- Phase 6: Production deployment + optimization

## 🆘 Troubleshooting

### "Error: connect ECONNREFUSED"
PostgreSQL isn't running. Start it or use Docker.

### "Database error during migration"
Try: `npx prisma db push` or check DATABASE_URL in `.env`

### "NextAuth login not working"
- Check NEXTAUTH_SECRET is set
- Clear browser cookies
- Try incognito mode

### "Module not found" errors
```bash
npm install
npm run prisma:generate
```

### "Port 3000 already in use"
```bash
npm run dev -- -p 3001
```

## 📊 Admin Credentials

Created by the seed script:

| Email | Password | Role | Use Case |
|-------|----------|------|----------|
| admin@example.com | password | ADMIN | Full access, user management |
| editor@example.com | password | EDITOR | Create/edit content |

Change these to real credentials in production!

## 🔐 Security Notes

⚠️ **Before Production:**
1. Change demo user passwords
2. Generate new NEXTAUTH_SECRET (`openssl rand -hex 32`)
3. Set NEXTAUTH_URL to your domain
4. Enable HTTPS
5. Add email authentication (instead of just password)
6. Setup proper user registration/invitation flow

## 🚀 Deployment to Railway

1. Push code to GitHub
2. Connect repository to Railway.app
3. Add environment variables in Railway dashboard
4. Deploy!

**Required env vars for Railway:**
```
DATABASE_URL=          # Railway PostgreSQL URL
NEXTAUTH_SECRET=       # Your secure secret
NEXTAUTH_URL=          # Your domain (https://yourapp.railway.app)
```

## 🤔 FAQ

**Q: Can I use a different database?**
A: Yes! Prisma supports MySQL, PostgreSQL, MongoDB, etc. Update `prisma/schema.prisma` datasource.

**Q: How do I add more admin users?**
A: Use the `/admin/users` page, or manually seed with `prisma/seed.ts`.

**Q: When should I implement TipTap editor?**
A: Phase 2! See PHASE2_CHECKLIST.md for detailed tasks.

**Q: How do I deploy to production?**
A: Railway.app recommended. See IMPLEMENTATION_GUIDE.md → Deployment section.

**Q: Can I export blog posts as RSS feed?**
A: Yes! We have `feed` and `rss` packages installed. Create `/app/api/feed.xml/route.ts`.

## 📞 Next Steps

1. **Follow the 5-minute quick start above**
2. **Read IMPLEMENTATION_GUIDE.md for detailed setup**
3. **Check ARCHITECTURE.md to understand the system**
4. **Use PHASE2_CHECKLIST.md to plan Phase 2 work**

---

**You're all set!** Start with the Quick Start section above, then explore the CMS. The foundation is solid and ready for the team to build upon.

Good luck! 🎉
