# Developer Notes for NEAR.org Project

## 📝 Overview for Developers

This document provides guidance for developers joining the NEAR.org project. Start here to understand the project structure and conventions.

## 🎯 Project Vision

Build a large-scale SaaS marketing website for NEAR Protocol with:
- ~8 main pages + ~4 subpages each
- A blog with dynamic posts
- A CMS for marketing team to manage content without dev intervention
- Hardcoded pages for complex content (Home, Tech, Founders, Developers)
- CMS-driven pages for simple, frequently-changing content

## 📚 Documentation Reading Order

**For onboarding (essential):**
1. GETTING_STARTED.md - Get the dev environment running (15 min)
2. IMPLEMENTATION_GUIDE.md - Understand the setup (30 min)
3. ARCHITECTURE.md - Learn the system design (30 min)

**For Phase 2 work:**
4. PHASE2_CHECKLIST.md - Detailed task breakdown (read when starting Phase 2)

**For reference:**
5. SETUP_VERIFICATION.md - Verify your installation (if having issues)
6. IMPLEMENTATION_SUMMARY.md - See what was built (overview only)

## 🏗️ Project Structure

```
app/
├── (site)/              # Public pages
│   ├── page.tsx        # Home
│   ├── about/          # Simple pages (add more content later)
│   ├── blog/           # Blog system
│   └── layout.tsx      # Site layout with Nav/Footer
│
├── (admin)/            # CMS Admin
│   ├── login/          # Auth
│   ├── dashboard/      # Dashboard
│   ├── posts/          # Blog management
│   └── layout.tsx      # Admin sidebar layout
│
├── api/                # API routes
│   ├── auth/           # NextAuth endpoints
│   └── posts/          # Post CRUD
│
└── layout.tsx          # Root layout

lib/
├── auth.ts             # NextAuth configuration
├── prisma.ts           # Database client singleton
└── utils.ts            # Helper functions

prisma/
├── schema.prisma       # Database schema
└── seed.ts             # Demo data

components/            # Empty - ready for Phase 2
```

## 🔄 Common Development Tasks

### Add a New Page to Public Site

1. Create directory: `app/(site)/[section]/page.tsx`
2. Create React component with your content
3. Update nav in `app/(site)/layout.tsx` if main section
4. Add metadata:
```tsx
export const metadata: Metadata = {
  title: "Your Page Title",
  description: "Meta description"
};
```

### Create a New API Endpoint

1. Create file: `app/api/[route]/route.ts`
2. Define handler functions:
```tsx
export async function GET(req: NextRequest) {
  // Your code
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  // Your code
  return NextResponse.json(data, { status: 201 });
}
```
3. Add authentication check if needed:
```tsx
const session = await auth();
if (!session?.user?.id) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

### Add a Database Model

1. Edit `prisma/schema.prisma`
2. Add new model or update existing
3. Run migration:
```bash
npm run prisma:migrate
# Will prompt for migration name, then create migration file
```
4. Use in code with Prisma client:
```tsx
import { prisma } from "@/lib/prisma";

const items = await prisma.yourModel.findMany();
```

### Create a New Admin Page

1. Create: `app/(admin)/[section]/page.tsx`
2. Add to sidebar in `app/(admin)/layout.tsx`
3. Page is automatically protected by middleware
4. Fetch data from API:
```tsx
"use client";
const [data, setData] = useState([]);

useEffect(() => {
  fetch("/api/endpoint").then(r => r.json()).then(setData);
}, []);
```

## 🛠️ Development Workflow

### Starting Your Day

```bash
# Start dev server
npm run dev

# In another terminal, open Prisma Studio to check DB
npm run prisma:studio

# Open browser to http://localhost:3000
```

### After Pulling Latest Code

```bash
# Update dependencies
npm install

# Ensure database is up to date
npm run prisma:migrate

# Start dev server
npm run dev
```

### Before Committing Code

```bash
# Run linter
npm run lint

# Build to catch any errors
npm run build

# If errors, fix them and rebuild
```

### Deploying Changes

1. Commit to GitHub (CI/CD runs tests)
2. Push to main branch
3. Railway automatically deploys (if connected)

## 📋 Coding Standards

### File Naming
- Components: PascalCase (Button.tsx)
- Pages: lowercase (page.tsx, layout.tsx)
- Utilities: camelCase (utils.ts, auth.ts)
- Directories: kebab-case (admin-panel, blog-posts)

### TypeScript
- Always use TypeScript (no .js files)
- Enable strict mode
- Type function parameters and returns
- Use `interface` or `type` for models

### React Components
- Use function components (no class components)
- Use hooks for state (useState, useEffect, etc)
- Memoize expensive components: `React.memo(Component)`
- Client-only components: `"use client"` directive at top

### Styling
- Use Tailwind CSS classes
- Don't create CSS files (use tailwind instead)
- Use cn() utility for conditional classes:
```tsx
import { cn } from "@/lib/utils";

<div className={cn("base", isActive && "active")}>
```

### API Routes
- Always validate input with Zod
- Always check authentication
- Return proper status codes (200, 201, 400, 401, 404, 500)
- Use NextResponse.json()

### Database
- Use Prisma for all queries
- Select only needed fields:
```tsx
await prisma.post.findMany({
  select: { id: true, title: true, slug: true }
});
```
- Use `include` for relations, not multiple queries:
```tsx
await prisma.post.findUnique({
  where: { id },
  include: { author: true, tags: true }
});
```

## 🔒 Security Checklist

When adding features, ensure:
- [ ] User input is validated with Zod
- [ ] Sensitive operations check auth with `await auth()`
- [ ] RBAC checks for sensitive operations:
```tsx
if ((session.user as any).role !== "ADMIN") {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
```
- [ ] Database queries use parameterized/prepared statements (Prisma does this)
- [ ] No secrets in client-side code
- [ ] Environment variables start with NEXT_PUBLIC_ only if public
- [ ] Passwords hashed with bcryptjs (12+ rounds)

## 🧪 Testing

Currently no automated tests (add in future phases).

For now, manual testing:
1. Use `/admin` to test new features
2. Test with different roles (admin, editor)
3. Check browser console for errors
4. Test on mobile viewport (F12 DevTools)

## 🐛 Debugging Tips

### Check Database
```bash
npm run prisma:studio
# Opens visual database editor
```

### Inspect API Responses
```tsx
// In browser DevTools, Network tab
// See API responses and headers
```

### Server-side Debug
```tsx
// Add console.log
console.log("Debug:", variable);

// Check terminal output when making requests
```

### Database Query Debug
```tsx
// In prisma client operations
const result = await prisma.post.findMany();
console.log(result);
```

## 📦 Adding Dependencies

Before adding a new package:
1. Check if we already have it
2. Search for similar functionality in existing packages
3. Verify package is maintained and has good docs
4. Run: `npm install package-name`
5. Update package.json commit

**Do NOT add:**
- Duplicate UI libraries (we use shadcn/ui + Radix)
- Styling libraries (we use Tailwind)
- Form libraries (we use react-hook-form + Zod)

## 🎯 Phase 2 Priority Tasks

When starting Phase 2, implement in this order:

1. **TipTap Block Editor** (3-4 days)
   - Create `components/admin/BlockEditor.tsx`
   - Configure all block types
   - Integrate with post editor

2. **Uploadthing Media** (2-3 days)
   - Create `lib/media.ts`
   - Create `components/admin/MediaPicker.tsx`
   - Update `/admin/media` page

3. **Draft Preview** (1-2 days)
   - Create `/api/preview/route.ts`
   - Add preview button to editor
   - Update blog post page for draft mode

4. **Blog Renderer** (1-2 days)
   - Create `components/site/TipTapRenderer.tsx`
   - Update blog post page to render blocks

5. **Tags & Categories** (2-3 days)
   - Create admin pages for management
   - Update post editor with selectors
   - Create filter pages

## 🚀 Performance Tips

- Use `npm run build` to check bundle size
- Use dynamic imports for heavy components:
```tsx
const Editor = dynamic(() => import("@/components/Editor"), {
  loading: () => <div>Loading...</div>
});
```
- Lazy load images with Next.js Image:
```tsx
import Image from "next/image";
<Image src={url} alt="" width={400} height={300} />
```
- Cache API responses when appropriate

## 📞 Getting Help

1. Check ARCHITECTURE.md for system design questions
2. Search similar code in the codebase
3. Check NextAuth.js / Prisma docs
4. Ask in team chat with context

## ✅ Ready to Contribute?

1. Run SETUP_VERIFICATION.md checklist
2. Read ARCHITECTURE.md to understand system
3. Pick a task from PHASE2_CHECKLIST.md
4. Start coding!

**Happy developing!** 🚀
