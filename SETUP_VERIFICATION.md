# Setup Verification Checklist

Use this checklist to verify your NEAR.org installation is working correctly.

## ✅ Pre-Setup Verification

- [ ] Node.js 18+ installed (`node --version` should show 18+)
- [ ] npm 10+ installed (`npm --version` should show 10+)
- [ ] PostgreSQL 12+ available or Docker installed
- [ ] .env file created with DATABASE_URL
- [ ] NEXTAUTH_SECRET generated and added to .env

## ✅ Installation Verification

```bash
# Check Node.js version
node --version
# Expected: v18.20.8 or higher

# Check npm version
npm --version
# Expected: 10.0.0 or higher

# Verify packages installed
ls node_modules/@tiptap 2>/dev/null && echo "✅ TipTap installed"
ls node_modules/prisma 2>/dev/null && echo "✅ Prisma installed"
ls node_modules/next-auth 2>/dev/null && echo "✅ NextAuth installed"
```

## ✅ Database Setup Verification

```bash
# 1. Verify DATABASE_URL in .env
grep DATABASE_URL .env
# Should output: DATABASE_URL="postgresql://..."

# 2. Create database schema
npm run prisma:migrate
# Expected: Tables created successfully

# 3. Seed demo data
npm run prisma:seed
# Expected: Admin user, editor user, categories, tags created

# 4. Open database admin
npm run prisma:studio
# Expected: Browser opens to http://localhost:5555
# Should show User table with admin@example.com
```

## ✅ Development Server Verification

```bash
# Start dev server
npm run dev

# Expected output:
# ▲ Next.js 16.1.6
# ▲ Local:        http://localhost:3000
# ✓ Ready in 2.5s

# Test public site (in another terminal)
curl http://localhost:3000
# Should return HTML with "NEAR Protocol"

# Test API
curl http://localhost:3000/api/posts
# Should return JSON array of posts

# Kill server with Ctrl+C
```

## ✅ Public Site Verification

Open http://localhost:3000 in a browser and check:

- [ ] Home page loads with hero section
- [ ] Navigation bar visible with links
- [ ] All nav links work: About, Founders, Developers, Tech, Community, Blog
- [ ] Footer visible with links
- [ ] /blog page loads (shows "No posts yet" is OK)
- [ ] Responsive on mobile (test with F12 DevTools)

## ✅ Admin Panel Verification

Navigate to http://localhost:3000/admin/login

**Before login:**
- [ ] Login page displays
- [ ] Email input works
- [ ] Password input works
- [ ] "Sign In" button present

**Login with demo credentials:**
```
Email: admin@example.com
Password: password
```

- [ ] Login successful (redirects to /admin/dashboard)
- [ ] No console errors

**On dashboard:**
- [ ] Dashboard page loads
- [ ] Welcome message shows
- [ ] Statistics show (should be 0 posts, 0 pages, 2 users)
- [ ] "New Post" button present

## ✅ Admin Features Verification

### Blog Posts Management
Navigate to /admin/posts

- [ ] Posts page loads
- [ ] "New Post" button present
- [ ] Can click "+ New Post"

On /admin/posts/new:
- [ ] Form loads with fields:
  - [ ] Title input
  - [ ] Slug input
  - [ ] Excerpt textarea
  - [ ] Status dropdown (Draft/Published)
  - [ ] SEO fields (Title, Description)
  - [ ] Submit button
- [ ] Fill form and click "Create Post"
- [ ] Redirects to edit page for new post

### User Management
Navigate to /admin/users

- [ ] Users page loads (admin-only)
- [ ] Shows table with users
- [ ] admin@example.com listed as ADMIN
- [ ] editor@example.com listed as EDITOR

### Sidebar Navigation
- [ ] All menu items visible
- [ ] Links highlight current page
- [ ] Sign Out button present

## ✅ API Verification

Test API endpoints with curl or Postman:

```bash
# Get all posts
curl http://localhost:3000/api/posts

# Get authentication endpoints (should 404 on GET, OK on POST)
curl http://localhost:3000/api/auth/signin
```

Expected responses:
- [ ] POST /api/auth/[...nextauth] - 307 redirect
- [ ] GET /api/posts - 200 JSON array
- [ ] POST /api/posts - 401 (requires auth)

## ✅ Database Verification

Open Prisma Studio with `npm run prisma:studio`

Check each table:

**User table**
- [ ] admin@example.com exists
- [ ] editor@example.com exists
- [ ] Passwords are bcrypt hashes (start with $2)
- [ ] Roles set correctly (ADMIN, EDITOR)

**Post table**
- [ ] Empty (0 rows) - OK if no posts created yet

**Category table**
- [ ] Announcements exists
- [ ] Tutorials exists

**Tag table**
- [ ] Web3 exists
- [ ] Blockchain exists

## ✅ TypeScript Compilation

```bash
# Check TypeScript compiles without errors
npx tsc --noEmit

# Expected: No errors shown
```

## ✅ Build Verification

```bash
# Test production build
npm run build

# Expected output:
# ✓ Compiled successfully
# ✓ Database check passed
# Should generate .next folder
```

## ✅ Code Quality

```bash
# Run linter
npm run lint

# Expected: No errors or warnings (or only non-critical ones)
```

## 🐛 Troubleshooting

### ❌ "Error: connect ECONNREFUSED"
**Cause:** PostgreSQL not running
**Fix:**
```bash
# Docker
docker run --name postgres-near -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15

# Or check PostgreSQL service is running
sudo service postgresql status
```

### ❌ "prisma:seed failed"
**Cause:** Database tables not created
**Fix:** Run migrations first
```bash
npm run prisma:migrate
```

### ❌ "Module not found" errors
**Cause:** Dependencies not installed
**Fix:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### ❌ "NextAuth secret missing"
**Cause:** NEXTAUTH_SECRET not in .env
**Fix:**
```bash
# Generate and add to .env
openssl rand -hex 32 | xargs -I {} sed -i 's/NEXTAUTH_SECRET=.*/NEXTAUTH_SECRET={}/' .env
```

### ❌ "Login not working"
**Cause:** Session not created
**Fix:**
- [ ] Clear browser cookies
- [ ] Try incognito window
- [ ] Check NEXTAUTH_SECRET is set
- [ ] Verify email/password in seed script

## ✅ Ready to Proceed?

If all checks pass, you're ready to:

1. Read GETTING_STARTED.md
2. Proceed with Phase 2 implementation
3. Start building the TipTap editor

## 📝 Final Checklist

- [ ] All pre-setup items verified
- [ ] Database created and seeded
- [ ] Dev server running smoothly
- [ ] Public site loads correctly
- [ ] Admin login works
- [ ] All admin pages accessible
- [ ] API endpoints responding
- [ ] Database tables populated
- [ ] No console errors
- [ ] Build compiles successfully

**If all items are checked, your NEAR.org CMS is ready for Phase 2!** 🚀

---

## 💬 If Something Fails

1. Check the error message carefully
2. Google the error (usually helps!)
3. Check IMPLEMENTATION_GUIDE.md → Troubleshooting
4. Check ARCHITECTURE.md for system overview
5. Review PHASE2_CHECKLIST.md for next steps

**Common solutions:**
- `npm install` - Reinstall dependencies
- `npm run prisma:generate` - Regenerate Prisma types
- Clear `.next` folder - `rm -rf .next`
- Clear browser cache - Ctrl+Shift+Del
