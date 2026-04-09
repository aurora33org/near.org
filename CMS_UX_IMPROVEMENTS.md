# CMS UX/UI Feature Improvements

> **Audience:** Internal team (admins, editors). None of these features affect the public site unless noted.
> **Note on scope:** Features are split into two groups — those that require no DB schema changes (safer, ship first) and those that do. The first group should be prioritized as they carry the least risk of breaking existing data.

---

## Group A — No Database Changes Required

These can be implemented purely in the frontend and/or API layer without touching `schema.prisma` or running migrations.

---

### A-1. Timezone Label on All Admin Date/Time Fields

**Problem:** The `datetime-local` input in the post editor uses the browser's local timezone silently. An editor in UTC+8 scheduling "09:00" and an editor in EST will have completely different expectations. There is no indication of what timezone the CMS operates in.

**Scope:** Admin only — does not affect the public site.

**What to build:**
- Decide on a fixed CMS timezone (recommended: `UTC`). Store it as a constant or env var `CMS_TIMEZONE=UTC`.
- In the **Post Settings tab** (`EditPostClient.tsx` + `NewPostClient.tsx`), next to the `publishedAt` `datetime-local` input, add a static label: `"Times are in UTC"` and a helper line showing the UTC equivalent of the selected time in real time (update on input change).
- In the **posts list** (`PostsBulkTable.tsx`), the "SCHEDULED" badge tooltip should include the UTC time.
- In the **dashboard** recent activity, **audit log**, and **users table**, replace bare `toLocaleDateString()` / `toLocaleString()` calls with a consistent formatter that appends the UTC offset: e.g. `Apr 9, 2026 · 10:00 UTC`. Use a shared utility function `formatAdminDate(dateString: string): string` in `lib/utils.ts` (or similar) to centralize this.

**Files to touch:**
- `components/admin/EditPostClient.tsx`
- `components/admin/NewPostClient.tsx`
- `app/admin/posts/PostsBulkTable.tsx`
- `app/admin/dashboard/page.tsx`
- `app/admin/audit-log/page.tsx`
- `app/admin/users/UsersClient.tsx`
- `lib/utils.ts` (add `formatAdminDate` helper)

---

### A-2. Unsaved Changes Warning

**Problem:** Clicking the sidebar, browser back, or any link while the post editor has unsaved changes silently discards all work.

**What to build:**
- Track a `isDirty` boolean in the editor component: set `true` on any content/metadata change, reset to `false` after a successful save.
- On `beforeunload`: call `event.preventDefault()` + set `event.returnValue = ""` when `isDirty` is true (triggers the native browser dialog).
- Intercept Next.js client-side navigation: listen for sidebar link clicks and wrap with a Radix `AlertDialog` ("You have unsaved changes. Leave anyway?" → Cancel / Leave).
- Show a small dot indicator in the header save button when `isDirty` is true (e.g. amber dot).

**Files to touch:**
- `components/admin/EditPostClient.tsx`
- `components/admin/NewPostClient.tsx`
- `components/admin/AdminSidebar.tsx` (may need to pass a `onNavigate` callback from the editor)

---

### A-3. Autosave to localStorage / Draft Recovery

**Problem:** The editor has no autosave. If the browser crashes, the tab is closed, or the user navigates away, all unsaved work is gone.

**What to build:**
- Every 30 seconds, if `isDirty` is true, serialize `{ title, content, metadata, savedAt }` and write it to `localStorage`:
  - Key for editing: `cms_draft_{postId}`
  - Key for new posts: `cms_draft_new`
- On editor mount, check if a stored draft exists and if its `savedAt` is newer than the post's `updatedAt` (for edit) or if any draft exists (for new).
- If a newer draft is found, show a dismissible amber banner at the top of the editor: `"Draft recovered from {savedAt}. [Restore] [Discard]"`.
- Show a subtle `"Autosaved at 10:32 AM UTC"` label in the editor header. Clear the localStorage entry on successful manual save.

**Files to touch:**
- `components/admin/EditPostClient.tsx`
- `components/admin/NewPostClient.tsx`
- `components/admin/editor/BlockEditor.tsx` (add footer bar for autosave status)

---

### A-4. Cmd+S / Ctrl+S Save Shortcut

**Problem:** There is no keyboard shortcut to save. Users must reach for the mouse every time.

**What to build:**
- In both `EditPostClient` and `NewPostClient`, add a `useEffect` that attaches a `keydown` listener on `document`.
- When `Cmd+S` (macOS) or `Ctrl+S` (Windows/Linux) is detected: call `preventDefault()` and trigger the same save function used by the Save button.
- On success, fire `toast.success("Saved")`.

**Files to touch:**
- `components/admin/EditPostClient.tsx`
- `components/admin/NewPostClient.tsx`

---

### A-5. Character Counters on SEO Fields

**Problem:** The SEO tab has placeholder text saying "160 chars" for meta description and "60 chars" for SEO title, but there is no live feedback. Editors frequently over-shoot these limits unknowingly.

**What to build:**
- Below each field, show a live counter: e.g. `47 / 60` for SEO title, `123 / 160` for meta description.
- Color the counter: gray (safe) → amber (within 10 chars of limit) → red (over limit).
- For Excerpt: show word count instead (e.g. `32 words`).
- No new component needed — inline `useState` per field is sufficient.

**Files to touch:**
- `components/admin/EditPostClient.tsx`
- `components/admin/NewPostClient.tsx`

---

### A-6. Fix: `window.alert()` in User Invite → Toast

**Problem:** `UsersClient.tsx` line ~147 calls `alert("Invitation sent successfully!")` — a raw browser dialog that is visually jarring and completely inconsistent with the `sonner` toast system used everywhere else.

**What to build:**
- Replace `alert(...)` with `toast.success("Invitation sent to {email}")`.
- Ensure `import { toast } from "sonner"` is present in the file.

**Files to touch:**
- `app/admin/users/UsersClient.tsx`

---

### A-7. Fix: Sitemap Page Hardcoded `excludeFromSitemap: false`

**Problem:** `app/admin/sitemap/page.tsx` line ~42 passes `excludeFromSitemap: false` as a Prisma filter instead of reading the actual value. Every post always appears as "included" in the sitemap UI, making the per-post toggle useless.

**What to build:**
- Remove the `excludeFromSitemap: false` filter from the Prisma query so all posts are fetched.
- The existing `BlogPostsTable` toggle should then correctly reflect the real DB value.
- Verify the toggle's `PATCH` call properly saves the value and the page re-fetches after toggling.

**Files to touch:**
- `app/admin/sitemap/page.tsx`

---

### A-8. Search Inside Media Picker Modal

**Problem:** The media picker embedded in the post editor (`MediaPickerModal.tsx`) has no search. Editors with large media libraries must paginate manually to find an image.

**What to build:**
- Add a search `<input>` at the top of the library panel inside `MediaPickerModal`.
- Wire it to the existing `/api/media` endpoint with a `search=` query param (same as the standalone media page uses).
- Debounce the input at 300ms (same pattern already used in the standalone media page).

**Files to touch:**
- `components/admin/MediaPickerModal.tsx`

---

### A-9. Bulk Publish/Archive: Add Confirmation + Success Toast

**Problem:** Bulk publishing or archiving many posts fires immediately on a single click with no confirmation and no feedback when done. Only bulk delete has a confirmation dialog.

**What to build:**
- Before executing bulk publish or archive, open a Radix `AlertDialog`: `"Publish 5 posts? They will become immediately visible on the site."` with Cancel and Confirm.
- On success, fire `toast.success("5 posts published")` / `toast.success("5 posts archived")`.

**Files to touch:**
- `app/admin/posts/PostsBulkTable.tsx`

---

### A-10. Lock-Cleared Notification

**Problem:** When a blocked editor is waiting for a lock to expire, the auto-retry loop silently re-renders the editor. The user has no idea the lock has been released unless they are watching the screen.

**What to build:**
- When the auto-retry loop returns HTTP 200 (lock acquired), fire `toast.success("Post is now available — you can start editing.")` before clearing the blocked state.
- Optionally play a subtle browser notification sound (check `Notification` API availability first; skip if permission not granted).

**Files to touch:**
- `components/admin/EditPostClient.tsx`

---

### A-11. Dashboard Stat Cards Link to Filtered Views

**Problem:** Clicking a stat card (e.g. "42 Published Posts") navigates to `/admin/posts` with no filter applied. The editor must manually re-filter.

**What to build:**
- Wrap each stat card in a `<Link>` pointing to the filtered URL:
  - Published Posts → `/admin/posts?status=PUBLISHED`
  - Draft Posts → `/admin/posts?status=DRAFT`
  - Archived Posts → `/admin/posts?status=ARCHIVED`
- Verify the posts page already reads `status` from the URL (it does via `searchParams`).

**Files to touch:**
- `app/admin/dashboard/page.tsx`

---

### A-12. Word Count + Reading Time in Editor

**Problem:** There is no way for an editor to know the length of the post they are writing without copy-pasting it elsewhere.

**What to build:**
- Add a footer bar below the `BlockEditor` that shows `X words · ~Y min read` (Y = Math.ceil(words / 200)).
- Update on every editor `update` event via TipTap's `onUpdate` callback.
- Keep it subtle — small gray text, does not compete with the content.

**Files to touch:**
- `components/admin/editor/BlockEditor.tsx`
- `components/admin/EditPostClient.tsx` / `NewPostClient.tsx` (if word count needs to bubble up)

---

### A-13. Category/Tag Delete Confirmation

**Problem:** Deleting a category or tag is instant and irreversible. There is no confirmation, even if the taxonomy item is used by many posts.

**What to build:**
- Before deleting, open a simple Radix `AlertDialog`: `"Delete 'Ecosystem'? This category is used by 3 posts. Their categorization will be removed."`.
- The post count per item is already displayed (as a badge) — use that count in the warning copy.

**Files to touch:**
- `app/admin/categories/CategoriesClient.tsx`

---

### A-14. Remove Dead Code: Legacy `BlockEditor.tsx`

**Problem:** `/components/admin/BlockEditor.tsx` (the root-level file) is an old toolbar-based editor that is no longer imported anywhere. It causes confusion when reading the codebase.

**What to build:**
- Delete the file `/components/admin/BlockEditor.tsx`.
- Verify no import in the project references it (run `grep -r "admin/BlockEditor" --include="*.tsx" .`).

**Files to touch:**
- `components/admin/BlockEditor.tsx` (delete)

---

### A-15. Login Page Design Consistency

**Problem:** The login page uses hardcoded `bg-white` / `bg-gray-900` Tailwind classes and does not use the admin design system. It ignores dark mode.

**What to build:**
- Wrap the login page content with the `.dark` class (or use `AdminThemeProvider`) so dark mode is respected.
- Replace hardcoded color classes with semantic tokens: `bg-background`, `text-foreground`, `border-border`, etc.

**Files to touch:**
- `app/admin/login/page.tsx`

---

### A-16. Audit Log: Clickable Entity Links

**Problem:** The "Entity" column in the audit log shows a truncated title string but does not link to the affected resource. Admins must manually navigate to find the post or user that was changed.

**What to build:**
- For `entityType === "POST"`: render the entity title as a `<Link href="/admin/posts/{entityId}/edit">`.
- For `entityType === "USER"`: no direct link page exists — skip or open a read-only modal.
- For `entityType === "MEDIA"`: link to `/admin/media` (no direct item page).
- Add a visual `↗` icon next to the link.

**Files to touch:**
- `app/admin/audit-log/page.tsx`

---

## Group B — Requires Database Migration

These features require adding or modifying columns in `schema.prisma` and running `prisma migrate`. Treat them as a second phase to avoid unnecessary risk in production.

---

### B-1. User Last Login Timestamp

**Problem:** There is no way to see when a user last logged in. Helpful for identifying inactive accounts.

**DB change:** Add `lastLoginAt DateTime?` to the `User` model in `schema.prisma`.

**What to build:**
- On successful sign-in in `lib/auth.ts` (NextAuth `signIn` callback or `jwt` callback), update `user.lastLoginAt = new Date()` via a Prisma `update`.
- Add a "Last Login" column to the users table in `app/admin/users/UsersClient.tsx`.
- Use the shared `formatAdminDate` utility (from A-1) to display it.

**Files to touch:**
- `prisma/schema.prisma`
- `lib/auth.ts`
- `app/admin/users/UsersClient.tsx`

---

### B-2. Settings Page: Profile Editing (Name + Email)

**Problem:** The settings page only allows changing password. Editors cannot update their own name or email without asking an admin.

**DB change:** No new columns needed (name and email already exist on `User`). However, changing email requires a verification step — consider adding `pendingEmail String?` and `emailVerifyToken String?` to handle the verification flow safely.

**What to build:**
- Add a "Profile" section above the password section in `app/admin/settings/page.tsx`.
- Name field: editable inline, saves via `PATCH /api/users/me`.
- Email field: changing it sends a verification email to the new address. Until verified, show a `"Pending: {email}"` badge.
- Add `pendingEmail` and `emailVerifyToken` to `schema.prisma` if verification flow is desired; otherwise allow direct update (simpler but less secure).

**Files to touch:**
- `prisma/schema.prisma` (if adding verification fields)
- `app/admin/settings/page.tsx`
- `app/api/users/me/route.ts` (create if it doesn't exist)
- `lib/email.ts` (add email verification template if needed)

---

### B-3. Bulk Delete for Media

**Problem:** Cleaning up old media files requires deleting them one by one. There is no multi-select or bulk delete.

**DB change:** None — but verify that the `Media` model has no required relations that would block deletion. Currently `Post` references media via plain URL strings (not a FK relation), so bulk delete should be safe.

**What to build:**
- Add checkboxes to each media grid item in `app/admin/media/page.tsx`.
- Show a sticky bulk-action bar at the bottom (same pattern as the posts table) when any items are selected.
- Bulk delete: single-step confirmation (`AlertDialog`), then `DELETE /api/media/bulk` with an array of IDs. Delete S3 objects + DB records.
- Create `app/api/media/bulk/route.ts` (new API route).

**Files to touch:**
- `app/admin/media/page.tsx`
- `app/api/media/bulk/route.ts` (new)

---

### B-4. True WYSIWYG Preview (Matches Public Template)

**Problem:** The admin preview (`/admin/posts/[id]/preview`) renders with its own standalone layout, not the actual public blog template. What the editor sees in preview is not what the public sees.

**DB change:** None.

**What to build:**
- Refactor the public blog post page (`app/(site)/blog/[slug]/page.tsx`) to extract the rendering logic into a shared server component, e.g. `components/blog/PostPage.tsx`.
- Reuse `PostPage` in both the public route and the admin preview route.
- The admin preview wrapper adds the yellow "DRAFT PREVIEW" banner and the "← Back to editor" link, but the content below is identical to the public page.

**Files to touch:**
- `app/(site)/blog/[slug]/page.tsx`
- `app/admin/posts/[id]/preview/page.tsx`
- `components/blog/PostPage.tsx` (new shared component)

---

### B-5. Audit Log: Date Range Filter + CSV Export

**Problem:** The audit log can only be filtered by action type, entity type, and user email. There is no way to filter by time period or export the data.

**DB change:** None — data already has timestamps.

**What to build:**
- Add two `<input type="date">` fields (From / To) to the filter bar. Pass them as query params and add `gte`/`lte` conditions to the Prisma query.
- Add an "Export CSV" button that triggers a `GET /api/audit-log/export?{filters}` endpoint returning a CSV file download with appropriate headers.
- Create `app/api/audit-log/export/route.ts` (new route).

**Files to touch:**
- `app/admin/audit-log/page.tsx`
- `app/api/audit-log/export/route.ts` (new)

---

### B-6. Admin "Take Over" Edit Lock

**Problem:** If an ADMIN needs to urgently edit a post that another user has locked, they have no choice but to wait 90 seconds for the lock to expire.

**DB change:** None — the lock fields already exist (`lockedBy`, `lockedAt`).

**What to build:**
- On the lock-blocked screen, if the current user's role is `ADMIN`, show an additional "Take Over Editing" button.
- This button calls `DELETE /api/posts/{id}/lock` (force release) and then re-acquires the lock via `POST /api/posts/{id}/lock`.
- Show a warning before confirming: `"This will interrupt {email}'s editing session. Any unsaved changes they have will be lost."`.
- The API `DELETE /api/posts/{id}/lock` should be updated to allow ADMIN role to force-release any lock (currently it may only allow the lock owner to release it).

**Files to touch:**
- `components/admin/EditPostClient.tsx`
- `app/api/posts/[id]/lock/route.ts`

---

## Summary Table

| # | Feature | Priority | Effort | Group |
|---|---------|----------|--------|-------|
| 1 | Timezone display on dates | 🔴 High | S | A |
| 2 | Unsaved changes warning | 🔴 High | M | A |
| 3 | Autosave / draft recovery | 🔴 High | M | A |
| 4 | Cmd+S save shortcut | 🔴 High | XS | A |
| 5 | SEO field character counters | 🔴 High | S | A |
| 6 | Fix alert() → toast in invite | 🔴 High | XS | A |
| 7 | Fix sitemap excludeFromSitemap bug | 🔴 High | XS | A |
| 8 | Search in media picker modal | 🟡 Medium | S | A |
| 9 | Bulk action success toasts | 🟡 Medium | XS | A |
| 10 | Bulk publish/archive confirmation | 🟡 Medium | S | A |
| 11 | Lock-cleared notification | 🟡 Medium | XS | A |
| 12 | Dashboard stat cards → filtered links | 🟡 Medium | S | A |
| 13 | Word count / reading time in editor | 🟡 Medium | S | A |
| 14 | Category/tag delete confirmation | 🟡 Medium | S | A |
| 15 | Remove dead BlockEditor.tsx | 🟢 Polish | XS | A |
| 16 | Audit log clickable entity links | 🟢 Polish | S | A |
| 17 | Login page design consistency | 🟢 Polish | S | A |
| 18 | User last login timestamp | 🟡 Medium | M | B |
| 19 | Settings: profile editing | 🟡 Medium | M | B |
| 20 | Bulk delete for media | 🟡 Medium | M | B |
| 21 | Preview matches public template | 🟡 Medium | M | B |
| 22 | Audit log date range + export | 🟢 Polish | M | B |
| 23 | Admin take-over lock | 🟢 Polish | M | B |

**Effort key:** XS = <30min · S = 1–3h · M = half-day

---

## Verification Checklist

Before marking any feature done:
1. `pnpm run lint` — zero new ESLint errors.
2. `pnpm run build` — zero TypeScript errors.
3. Manual test in `pnpm run dev` at `http://localhost:3000/admin`.
4. For Group B items: run `pnpm run prisma:migrate` in a local dev environment and verify the migration applies cleanly before merging.

**Specific test cases:**
- **A-1 Timezone:** Schedule a post and confirm the UTC label updates as you change the datetime input. Check the audit log and dashboard timestamps show UTC offset.
- **A-2 Unsaved changes:** Edit a post, do not save, click a sidebar link — confirm the warning dialog appears.
- **A-3 Autosave:** Edit a post, wait 30s, force-close the tab, reopen — confirm recovery banner appears.
- **A-7 Sitemap fix:** Mark a post as "Exclude from sitemap", reload the sitemap admin page, confirm the toggle reflects the correct state.
- **B-1 Last login:** Log in as an editor, navigate to Users as admin, confirm "Last Login" shows a recent timestamp.
