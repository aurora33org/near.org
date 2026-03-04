# NEAR.org Website

A comprehensive marketing website and CMS for NEAR Protocol built with Next.js 15, Tailwind CSS, and PostgreSQL.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 12+

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
Copy `.env.example` to `.env` and update with your configuration:
```bash
cp .env.example .env
```

Update the following in `.env`:
- `DATABASE_URL`: Your PostgreSQL connection string
- `NEXTAUTH_SECRET`: Generate with `openssl rand -hex 32`

3. **Set up the database:**
```bash
npm run prisma:migrate
npm run prisma:seed
```

This will:
- Create all tables in PostgreSQL
- Seed the database with demo admin and editor users
- Create demo categories and tags

4. **Start the development server:**
```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## 📝 Default Credentials

For local development, the seed script creates:

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | password | Admin |
| editor@example.com | password | Editor |

Access the CMS at `http://localhost:3000/admin`

## 📁 Project Structure

```
near/org/
├── app/
│   ├── (site)/              # Public website
│   │   ├── page.tsx         # Home page
│   │   ├── about/           # About section
│   │   ├── founders/        # For Founders section
│   │   ├── developers/      # For Developers section
│   │   ├── tech/            # Tech Stack section
│   │   ├── community/       # Community section
│   │   ├── blog/            # Blog
│   │   └── layout.tsx       # Site layout with Nav & Footer
│   │
│   ├── (admin)/             # CMS Admin
│   │   ├── login/           # Login page
│   │   ├── dashboard/       # Admin dashboard
│   │   ├── posts/           # Blog posts management
│   │   ├── pages/           # Pages management
│   │   ├── media/           # Media library
│   │   ├── users/           # User management (Admin only)
│   │   └── layout.tsx       # Admin layout
│   │
│   ├── api/                 # API Routes
│   │   ├── auth/            # NextAuth endpoints
│   │   └── posts/           # Post CRUD endpoints
│   │
│   └── globals.css          # Global styles
│
├── lib/
│   ├── auth.ts              # NextAuth configuration
│   ├── prisma.ts            # Prisma client singleton
│   └── utils.ts             # Utility functions
│
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Database seeding script
│
└── components/              # Reusable React components
```

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Database | PostgreSQL + Prisma ORM |
| UI Framework | Tailwind CSS |
| Authentication | NextAuth.js v5 |
| Form Validation | Zod + react-hook-form |
| Rich Text Editing | TipTap (coming soon) |
| Media Storage | Uploadthing (coming soon) |

## 📚 Features

### Public Site
- **Home Page**: Landing page with hero section
- **Blog**: Blog index and individual post pages with ISR (Incremental Static Regeneration)
- **Multiple Sections**: About, Founders, Developers, Tech Stack, Community
- **Responsive Design**: Mobile-friendly layout
- **SEO**: Meta tags, Open Graph, sitemap generation

### CMS (Admin)
- **Authentication**: Email + password login with NextAuth
- **Blog Management**: Create, edit, publish blog posts
- **Page Management**: Create editable content pages
- **SEO Fields**: Title, description, OG image per post/page
- **Role-Based Access**: Admin, Editor, Viewer roles
- **User Management**: Admin can create and manage users

## 🔑 Key Features to Implement

### Phase 2 - CMS Core (In Progress)
- [ ] TipTap block editor integration
- [ ] Uploadthing media library
- [ ] Draft preview system
- [ ] Content scheduling
- [ ] Media upload and storage

### Phase 3 - CMS Pages
- [ ] Editable pages CRUD
- [ ] Page hierarchy
- [ ] Dynamic page rendering

### Phase 4 - Public Site Enhancement
- [ ] Blog post rendering with TipTap
- [ ] SEO improvements
- [ ] Analytics integration
- [ ] Performance optimization

### Phase 5 - Complex Pages
- [ ] For Founders (detailed page)
- [ ] For Developers (detailed page)
- [ ] Tech Stack (detailed page)
- [ ] About NEAR (detailed page)

## 📦 Database Schema

### Users
- `id`: UUID
- `email`: Unique email
- `password`: bcrypt hash
- `name`: Display name
- `role`: ADMIN | EDITOR | VIEWER
- `createdAt`, `updatedAt`: Timestamps

### Posts
- `id`: UUID
- `title`: Post title
- `slug`: Unique URL slug
- `content`: TipTap JSON blocks
- `excerpt`: Short summary
- `status`: DRAFT | PUBLISHED | ARCHIVED
- `author`: Reference to User
- `publishedAt`: Publication timestamp
- `seoTitle`, `seoDesc`, `ogImage`: SEO fields

### Pages
- Similar to Posts, but for editable content pages
- Used for community pages and other marketing content

## 🔐 Authentication

Uses NextAuth.js v5 with:
- Credentials provider (email + password)
- Prisma adapter for database session storage
- JWT session strategy
- Role-based access control (RBAC)

## 🚀 Deployment

### Railway Setup

1. Push code to GitHub
2. Connect repository to Railway
3. Set environment variables:
   - `DATABASE_URL`: Railway PostgreSQL connection
   - `NEXTAUTH_SECRET`: Secure random string
   - `NEXTAUTH_URL`: Production domain

4. Deploy!

## 📖 Development

### Create a New Blog Post
1. Login at `/admin/login`
2. Go to "Blog Posts"
3. Click "+ New Post"
4. Fill in title, content, and SEO fields
5. Save and publish

### Add a New Page Section
1. Create new directory in `app/(site)/[section]/`
2. Add `page.tsx` with your content
3. Update navigation in `app/(site)/layout.tsx`

### Database Migrations
```bash
# Create new migration
npx prisma migrate dev --name migration_name

# Reset database (deletes data!)
npx prisma migrate reset

# View database with Prisma Studio
npm run prisma:studio
```

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- Run `npx prisma db push` to sync schema

### NextAuth Login Not Working
- Verify `NEXTAUTH_SECRET` is set
- Check email/password are correct
- Clear browser cookies

### Build Errors
- Clear `.next` directory: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Run Prisma code generation: `npx prisma generate`

## 📞 Support

For issues and feature requests, please open an issue on GitHub.

---

Built with ❤️ for NEAR Protocol
