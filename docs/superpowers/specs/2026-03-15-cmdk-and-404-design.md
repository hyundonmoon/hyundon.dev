# cmd+k Command Palette & 404 Page Design

**Date:** 2026-03-15
**Status:** Approved

---

## 1. cmd+k Command Palette

### Overview

A keyboard-triggered command palette for quick navigation to any page or note on the site. Opens with `cmd+k` (Mac) / `ctrl+k` (Windows/Linux). Searches pages and notes by title using client-side substring matching on build-time embedded data.

### Component

**File:** `src/components/CommandPalette.astro`

Single Astro component containing template, scoped styles, and a client-side `<script>`. Included in `BaseLayout.astro` so it is available on every page.

### Data

At build time, Astro renders all searchable items into a JSON array embedded in the component. The component's frontmatter imports the `notes` content collection (via `getCollection("notes")`) and maps each note's `pubDate` to an ISO date string using `formatDate()` from `@lib/notes.ts`. Pages are hardcoded.

The data is passed to the client-side script by rendering a `<script is:inline>` tag containing `JSON.stringify(items)` assigned to a global variable (e.g., `window.__SEARCH_ITEMS__`). This avoids `define:vars` serialization quirks.

```ts
type SearchItem = {
  title: string;
  href: string;
  type: "page" | "note";
  date?: string; // formatted from pubDate via formatDate(), notes only
};
```

### Behavior

| Action | Trigger |
|--------|---------|
| Open | `cmd+k` (Mac) / `ctrl+k` (other). Suppressed when focus is on an `<input>` or `<textarea>`. |
| Close | `Escape` key or click backdrop |
| Filter | Type to filter results — case-insensitive substring match on title |
| Navigate results | `↑` / `↓` arrow keys |
| Open result | `Enter` key |

- On open with no query: shows all pages, then all notes
- Results are grouped under **Pages** and **Notes** section headers
- Empty groups are hidden
- If no results match: "No results found" message
- First result is highlighted by default; arrow keys move the highlight
- Navigating to a result uses `window.location` assignment

### Visual Design

- **Backdrop:** Semi-transparent black overlay (`rgba(0,0,0,0.6)`) with subtle `backdrop-filter: blur(2px)`. Clicking it closes the palette. `z-index: 1000` (above the existing scanline overlay at `z-index: 999`).
- **Modal:** Centered horizontally, positioned near top of viewport (~20% from top). Max-width ~500px. Background `terminal-bg`, border `terminal-border` (not green), rounded corners, drop shadow.
- **Search input:** Top of modal with `⌘K` label in green. The blinking cursor animation (`blink` keyframes) is defined inline in the component's scoped styles (the existing one in `index.astro` is page-scoped).
- **Results list:** Scrollable area with max-height. Each result row shows title on the left. Notes show date on the right; pages show the path. Highlighted row uses `terminal-surface` background.
- **Section headers:** Uppercase, small, `terminal-faint` color — same style as sidebar section labels.
- **Footer:** Keyboard hints — `↑↓ navigate`, `↵ open`, `esc close` in `terminal-faint`.

### Accessibility

- Focus is trapped inside the modal while open — a `keydown` listener on Tab redirects focus back to the search input when it would leave the modal
- `aria-modal="true"` and `role="dialog"` on the modal container
- Search input is auto-focused on open
- Results are navigable via keyboard

---

## 2. 404 Page

### Overview

A playful "command not found" page styled as a fake terminal session output. Replaces the existing minimal 404 page.

### File

`src/pages/404.astro` (replaces existing)

### Layout

Uses `BaseLayout.astro` — sidebar is visible, consistent with all other pages.

### Content Structure

The page renders a fake shell session with the following lines:

1. **Command line:** `visitor@hyundon.dev:~$ find . -name "page"`
2. **Error message (amber):** `Error 404: page vanished into the void`
3. **Stats block** (dimmed text, left border accent):
   - `search completed in 0.042s`
   - `directories scanned: 1,337`
   - `results found: 0`
   - `coffee consumed: 3 cups`
4. **Suggestion text:** `Try one of these instead:`
5. **Links** (tilde-prefixed, matching sidebar social link style):
   - `~ home` → `/`
   - `~ notes` → `/notes/`
   - `~ about` → `/about/`

### Visual Design

- All text in JetBrains Mono (inherited from site)
- Username in green (`terminal-green`), path in purple (`terminal-purple`) — purple is defined in the Tailwind config and used intentionally here for the terminal path aesthetic
- Error line in amber (`terminal-amber`)
- Stats block: `terminal-dim` text, `terminal-border` left border
- Links: `terminal-faint` default, `terminal-green` on hover with green glow (matching sidebar social links)
- Each line animates in with staggered `fadeUp` animation (reuses the existing `fadeUp` keyframes from `base.css`, 0.3s ease, 0.05s delay between lines)

### No Interactivity

No input fields or interactive elements. Just styled content and standard `<a>` links. No JS needed.

---

## Technical Notes

- No new dependencies required
- Both features use only vanilla JS and existing Astro/Tailwind patterns
- The command palette passes collection data to the client via `<script is:inline>` with `JSON.stringify`, not `define:vars`
- The 404 page is purely template changes
