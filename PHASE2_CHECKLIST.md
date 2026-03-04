# Phase 2 - CMS Core Implementation Checklist

This document outlines all the work needed to complete Phase 2 and make the CMS fully functional.

## 📋 Overview

Phase 2 transforms the basic CMS scaffolding into a fully-featured content management system with:
- TipTap rich text editor with block support
- Media upload & management system
- Complete post editing workflow
- Draft preview system
- SEO optimization fields

## ✅ TipTap Block Editor Setup

### 1. Create BlockEditor Component
- **File**: `components/admin/BlockEditor.tsx`
- **Responsibilities**:
  - Initialize TipTap editor instance
  - Configure all supported blocks
  - Handle content save to state
  - Provide toolbar for block insertion

### Supported Blocks
```
- Text blocks:
  ├─ Paragraph
  ├─ Heading 1-4
  ├─ Quote
  └─ Code block (with syntax highlight)

- Media blocks:
  ├─ Image (with media picker)
  └─ Video (YouTube/Vimeo embed)

- Interactive blocks:
  ├─ CTA (Call-to-action button)
  ├─ Divider
  └─ Callout (info/warning/success)

- Formatting:
  ├─ Bold, Italic, Strikethrough
  ├─ Links
  ├─ Lists (ordered & unordered)
  └─ Code inline
```

### Implementation Tasks

- [ ] Install TipTap dependencies (already done)
- [ ] Create `components/admin/BlockEditor.tsx`
  - [ ] Initialize editor with useEditor hook
  - [ ] Add toolbar with block buttons
  - [ ] Configure all extensions
  - [ ] Handle onChange with onUpdate
  - [ ] Export JSON content
- [ ] Create block toolbar component
- [ ] Add keyboard shortcuts (Cmd+B for bold, etc.)
- [ ] Style editor UI with Tailwind

**Estimated Lines**: 200-300 LOC

---

## 📸 Media Management System

### 1. Uploadthing Integration
- **Files**:
  - `lib/media.ts` - Uploadthing helpers
  - `app/api/media/route.ts` - Upload endpoint
  - `components/admin/MediaPicker.tsx` - File picker UI

### Setup Uploadthing
- [ ] Sign up at https://uploadthing.com
- [ ] Create API key & secret
- [ ] Add to `.env`:
  ```
  UPLOADTHING_TOKEN=xxx
  UPLOADTHING_SECRET=xxx
  ```

### Tasks

- [ ] Create `lib/media.ts`
  - [ ] Export Uploadthing client config
  - [ ] Helper for generating upload URLs
  - [ ] Helper for parsing uploaded file data

- [ ] Create `app/api/media/route.ts`
  - [ ] POST endpoint for file uploads
  - [ ] Validate file type (images only)
  - [ ] Store metadata in Media table
  - [ ] Return signed download URL

- [ ] Create `components/admin/MediaPicker.tsx`
  - [ ] Drop zone for file upload
  - [ ] Progress bar during upload
  - [ ] Preview of uploaded file
  - [ ] Copy URL to clipboard button

- [ ] Update `/admin/media` page
  - [ ] Display uploaded files in grid
  - [ ] Show file size, upload date
  - [ ] Ability to delete files
  - [ ] Copy URL for use in posts

**Estimated Lines**: 300-400 LOC

---

## 📝 Complete Post Editor

### Tasks

- [ ] Update `/admin/posts/new/page.tsx`
  - [ ] Replace textarea with BlockEditor
  - [ ] Add image picker for coverImage
  - [ ] Add "Preview" button
  - [ ] Add categories/tags selector
  - [ ] Show word count

- [ ] Update `/admin/posts/[id]/edit/page.tsx`
  - [ ] Load post content into BlockEditor
  - [ ] Render block content in editor
  - [ ] Update endpoint to save content
  - [ ] Add "View published" link

- [ ] Update API POST `/api/posts`
  - [ ] Accept TipTap JSON in content field
  - [ ] Validate content structure
  - [ ] Save to DB

- [ ] Update API PUT `/api/posts/[id]`
  - [ ] Update content field with TipTap JSON
  - [ ] Handle status changes
  - [ ] Trigger ISR revalidation

**Files to modify**: 3
**Estimated Lines**: 200-250 LOC

---

## 🎨 TipTap to HTML Renderer

### Purpose
Convert TipTap JSON blocks to HTML for display on public blog pages.

### Tasks

- [ ] Create `components/site/TipTapRenderer.tsx`
  - [ ] Parse TipTap JSON structure
  - [ ] Render each block type:
    - [ ] Paragraph
    - [ ] Headings
    - [ ] Lists
    - [ ] Code blocks (with Highlight.js)
    - [ ] Images (with Next.js Image component)
    - [ ] Quotes
    - [ ] Callouts
    - [ ] CTAs
    - [ ] Dividers
    - [ ] Videos (iframe embeds)

- [ ] Handle formatting marks
  - [ ] Bold, italic, strikethrough
  - [ ] Links
  - [ ] Code inline

- [ ] Update `/app/(site)/blog/[slug]/page.tsx`
  - [ ] Import TipTapRenderer
  - [ ] Replace TODO comment with component
  - [ ] Pass post.content to renderer
  - [ ] Add post styling with prose classes

**Estimated Lines**: 150-200 LOC

---

## 🔍 Draft Preview System

### Purpose
Allow editors to preview unpublished drafts before publishing.

### Tasks

- [ ] Create preview token generation
  - [ ] Create `/api/preview/route.ts`
  - [ ] Generate signed JWT token
  - [ ] Token includes postId + expiry (1 hour)
  - [ ] Return token to client

- [ ] Create `/api/preview/[token]/route.ts`
  - [ ] Verify token signature
  - [ ] Extract postId
  - [ ] Check token hasn't expired
  - [ ] Activate draft mode

- [ ] Update `/admin/posts/[id]/edit/page.tsx`
  - [ ] Add "Preview" button
  - [ ] Call `/api/preview` to get token
  - [ ] Open preview link in new tab

- [ ] Update `/app/(site)/blog/[slug]/page.tsx`
  - [ ] Check for draft mode
  - [ ] If in draft mode, fetch from DB regardless of status
  - [ ] Show "DRAFT MODE" banner

**Files**: 3 new files + 2 updates
**Estimated Lines**: 150-200 LOC

---

## 🏷️ Categories & Tags

### Tasks

- [ ] Create `/admin/categories/page.tsx`
  - [ ] List existing categories
  - [ ] Create new category
  - [ ] Edit category
  - [ ] Delete category

- [ ] Create `/admin/tags/page.tsx`
  - [ ] List existing tags
  - [ ] Create new tag
  - [ ] Edit tag
  - [ ] Delete tag

- [ ] Create API routes
  - [ ] GET/POST `/api/categories`
  - [ ] GET/PUT/DELETE `/api/categories/[id]`
  - [ ] GET/POST `/api/tags`
  - [ ] GET/PUT/DELETE `/api/tags/[id]`

- [ ] Update post editor
  - [ ] Add category selector (checkbox list)
  - [ ] Add tag selector (autocomplete/multiselect)
  - [ ] Save category/tag relationships

- [ ] Update blog pages
  - [ ] Display categories/tags on post page
  - [ ] Link tags to tag filter page
  - [ ] Create `/blog/tag/[slug]` for filtered posts

**Estimated Lines**: 400-500 LOC

---

## 📱 Admin UI Polish

### Tasks

- [ ] Update admin layout
  - [ ] Add breadcrumbs navigation
  - [ ] Show current user in header
  - [ ] Add logout button (already exists)

- [ ] Improve form UX
  - [ ] Add form validation feedback
  - [ ] Show loading states
  - [ ] Success/error notifications
  - [ ] Unsaved changes warning

- [ ] Add admin utilities
  - [ ] Toast/notification system
  - [ ] Confirm dialogs for deletes
  - [ ] Loading spinners
  - [ ] Empty states

- [ ] Table enhancements
  - [ ] Sorting by column
  - [ ] Pagination (if 20+ items)
  - [ ] Bulk actions
  - [ ] Search/filter

**Estimated Lines**: 300-400 LOC

---

## 🧪 Testing & QA

### Manual Testing Checklist

**Post Creation**
- [ ] Create new post with all block types
- [ ] Upload cover image
- [ ] Add categories/tags
- [ ] Save as DRAFT
- [ ] Save as PUBLISHED
- [ ] Edit existing post
- [ ] Verify URL slug uniqueness

**Preview System**
- [ ] Preview draft before publishing
- [ ] Preview token expires after 1 hour
- [ ] Invalid token shows error

**Media**
- [ ] Upload image (test size limits)
- [ ] Copy image URL
- [ ] Insert image in post
- [ ] Delete unused media

**Blog Public**
- [ ] View published post
- [ ] Check SEO metadata
- [ ] Verify ISR revalidation (wait 60s)
- [ ] Filter by tag/category
- [ ] View post list

**Permissions**
- [ ] Admin can edit all posts
- [ ] Editor can only edit own posts
- [ ] Viewer cannot create posts
- [ ] Viewer can view media library

---

## 🚀 Completion Criteria

Phase 2 is complete when:

✅ TipTap editor fully functional
✅ Media upload & library working
✅ Post CRUD with all fields
✅ Draft preview system implemented
✅ ISR revalidation on publish
✅ Blog posts render correctly
✅ All manual tests passing
✅ No console errors
✅ Admin UI responsive on mobile

---

## 📦 Dependencies Already Installed

```json
{
  "@tiptap/react": "^3.20.0",
  "@tiptap/starter-kit": "^3.20.0",
  "@tiptap/extension-code-block-lowlight": "^3.20.0",
  "@tiptap/extension-link": "^3.20.0",
  "@tiptap/pm": "^3.20.0",
  "uploadthing": "^7.7.4",
  "lowlight": "^3.3.0"
}
```

## 🔄 Next Steps After Phase 2

Once Phase 2 is complete:
1. Proceed to Phase 3: CMS Pages (editable content pages)
2. Then Phase 4: Blog rendering enhancements
3. Finally Phase 5: Build out the complex hardcoded pages

---

**Estimated total effort for Phase 2**: 2-3 weeks for one developer
**Suggested approach**: Implement in order above (editor → media → preview → tags)
