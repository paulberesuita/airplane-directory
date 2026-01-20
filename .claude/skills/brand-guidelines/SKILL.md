---
name: brand-guidelines
description: Project brand guidelines for colors, typography, and visual style. Use when designing UI, creating pages, or styling components.
---

# Brand Guidelines

**Airplane Directory Brand Identity**

## Brand Personality

**Approachable • Curious • Credible**

This is for casual travelers curious about the plane they're flying on. Welcoming to non-experts, informative without being intimidating. Think Airbnb's warmth meets aviation confidence.

---

## Color Palette

### Primary Colors

**Sky Blue** — Main brand color, buttons, CTAs, links
`#0EA5E9`
Tailwind: `bg-sky-500`, `text-sky-500`, `border-sky-500`

**Slate** — Secondary brand color, headers, emphasis
`#334155`
Tailwind: `bg-slate-700`, `text-slate-700`, `border-slate-700`

### Accent Color

**Coral** — Highlights, important elements, hover states
`#F87171`
Tailwind: `bg-red-400`, `text-red-400`, `border-red-400`

### Neutral Colors

**Background** — Page backgrounds
`#F8FAFC`
Tailwind: `bg-slate-50`

**Surface** — Cards, modals, elevated elements
`#FFFFFF`
Tailwind: `bg-white`

**Text Primary** — Headings, body text
`#1E293B`
Tailwind: `text-slate-800`

**Text Secondary** — Supporting text, labels
`#64748B`
Tailwind: `text-slate-500`

**Text Muted** — Captions, metadata, placeholders
`#94A3B8`
Tailwind: `text-slate-400`

### CSS Variables

```css
:root {
  /* Primary */
  --color-sky: #0EA5E9;
  --color-slate: #334155;
  --color-coral: #F87171;

  /* Backgrounds */
  --bg-primary: #F8FAFC;
  --bg-secondary: #FFFFFF;

  /* Text */
  --text-primary: #1E293B;
  --text-secondary: #64748B;
  --text-muted: #94A3B8;

  /* Borders */
  --border: #E2E8F0;
}
```

### Color Usage Guidelines

| Element | Color | Tailwind Classes |
|---------|-------|------------------|
| Primary buttons | Sky Blue background, white text | `bg-sky-500 text-white hover:bg-sky-600` |
| Secondary buttons | Slate background, white text | `bg-slate-700 text-white hover:bg-slate-800` |
| Links | Sky Blue text | `text-sky-500 hover:text-sky-600` |
| Accent highlights | Coral | `text-red-400` or `bg-red-400` |
| Page background | Background | `bg-slate-50` |
| Cards | Surface with border | `bg-white border border-slate-200` |
| Body text | Text Primary | `text-slate-800` |
| Metadata | Text Muted | `text-slate-400` |

---

## Typography

### Font Families

**Headings:** Plus Jakarta Sans (600-700)
**Body:** Inter (400-500)

**Google Fonts Import:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@600;700&display=swap" rel="stylesheet">
```

**Tailwind Config:**
```html
<style>
  .font-heading { font-family: 'Plus Jakarta Sans', sans-serif; }
  .font-body { font-family: 'Inter', sans-serif; }
</style>
```

### Type Scale

| Element | Font | Size | Weight | Line Height | Tailwind Classes |
|---------|------|------|--------|-------------|------------------|
| **Hero Title (H1)** | Plus Jakarta Sans | 48px | 700 | 1.1 | `font-heading text-5xl font-bold leading-tight` |
| **Page Title (H2)** | Plus Jakarta Sans | 36px | 700 | 1.2 | `font-heading text-4xl font-bold leading-tight` |
| **Section Heading (H3)** | Plus Jakarta Sans | 24px | 600 | 1.3 | `font-heading text-2xl font-semibold leading-snug` |
| **Card Title (H4)** | Plus Jakarta Sans | 20px | 600 | 1.4 | `font-heading text-xl font-semibold` |
| **Subheading (H5)** | Plus Jakarta Sans | 16px | 600 | 1.5 | `font-heading text-base font-semibold` |
| **Body Large** | Inter | 18px | 400 | 1.7 | `font-body text-lg` |
| **Body** | Inter | 16px | 400 | 1.6 | `font-body text-base` |
| **Body Small** | Inter | 14px | 400 | 1.5 | `font-body text-sm` |
| **Caption** | Inter | 12px | 500 | 1.4 | `font-body text-xs font-medium` |
| **Button** | Inter | 16px | 500 | 1 | `font-body text-base font-medium` |

### Typography Guidelines

- **Headings:** Always use Plus Jakarta Sans, semibold (600) or bold (700)
- **Body text:** Always use Inter, regular (400) or medium (500)
- **Max line length:** 65-75 characters for readability
- **Paragraph spacing:** 1.5em between paragraphs

---

## Design Principles

### Spacing Scale

Use Tailwind's default spacing scale (4px increments):

| Size | Pixels | Tailwind | Usage |
|------|--------|----------|--------|
| **xs** | 4px | `1` | Tight spacing, badges |
| **sm** | 8px | `2` | Small gaps, inline elements |
| **md** | 16px | `4` | Default spacing, cards |
| **lg** | 24px | `6` | Section spacing |
| **xl** | 32px | `8` | Component spacing |
| **2xl** | 48px | `12` | Major sections |
| **3xl** | 64px | `16` | Page sections |

**Common Patterns:**
- **Card padding:** `p-6` (24px)
- **Section spacing:** `space-y-12` (48px between sections)
- **Component margin:** `mb-8` (32px)
- **Grid gaps:** `gap-6` (24px)

### Border Radius

| Element | Radius | Tailwind |
|---------|--------|----------|
| Buttons | 8px | `rounded-lg` |
| Cards | 12px | `rounded-xl` |
| Images | 8px | `rounded-lg` |
| Badges | 9999px | `rounded-full` |
| Inputs | 8px | `rounded-lg` |

### Shadows

| Element | Shadow | Tailwind |
|---------|--------|----------|
| Cards (default) | Subtle | `shadow-sm` |
| Cards (hover) | Medium | `shadow-md` |
| Modals | Large | `shadow-xl` |
| Dropdowns | Medium | `shadow-lg` |

---

## Component Guidelines

### Buttons

**Primary Button:**
```html
<button class="bg-sky-500 text-white font-body font-medium px-6 py-3 rounded-lg hover:bg-sky-600 transition-colors">
  Button Text
</button>
```

**Secondary Button:**
```html
<button class="bg-slate-700 text-white font-body font-medium px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors">
  Button Text
</button>
```

**Outline Button:**
```html
<button class="border-2 border-sky-500 text-sky-500 font-body font-medium px-6 py-3 rounded-lg hover:bg-sky-50 transition-colors">
  Button Text
</button>
```

**Button States:**
- Default: Sky Blue (`bg-sky-500`)
- Hover: Darker Sky Blue (`bg-sky-600`)
- Disabled: Muted gray (`bg-slate-200 text-slate-400 cursor-not-allowed`)

### Cards

**Standard Card:**
```html
<div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
  <!-- Card content -->
</div>
```

**Featured Card (with accent):**
```html
<div class="bg-white rounded-xl shadow-sm border-l-4 border-sky-500 p-6 hover:shadow-md transition-shadow">
  <!-- Card content -->
</div>
```

**Card States:**
- Default: `shadow-sm`
- Hover: `shadow-md` (add via `hover:shadow-md`)
- Active/Selected: Add `border-sky-500` or `ring-2 ring-sky-500`

### Links

**Text Link:**
```html
<a href="#" class="text-sky-500 hover:text-sky-600 underline underline-offset-2">
  Link Text
</a>
```

**Button-style Link:**
```html
<a href="#" class="inline-block bg-sky-500 text-white font-body font-medium px-6 py-3 rounded-lg hover:bg-sky-600 transition-colors">
  Link Text
</a>
```

### Inputs

**Text Input:**
```html
<input
  type="text"
  class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent font-body"
  placeholder="Search aircraft..."
>
```

**Input States:**
- Default: `border-slate-300`
- Focus: `ring-2 ring-sky-500 border-transparent`
- Error: `border-red-400 ring-2 ring-red-400`

### Badges

**Status Badge:**
```html
<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-700">
  In Service
</span>
```

**Badge Colors:**
- Info/Default: `bg-sky-100 text-sky-700`
- Success: `bg-green-100 text-green-700`
- Warning: `bg-amber-100 text-amber-700`
- Error: `bg-red-100 text-red-700`
- Neutral: `bg-slate-100 text-slate-700`

---

## Layout Guidelines

### Container Widths

```html
<!-- Full-width container with padding -->
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <!-- Content -->
</div>

<!-- Narrow content (articles, forms) -->
<div class="max-w-3xl mx-auto px-4">
  <!-- Content -->
</div>
```

### Grid Patterns

**Card Grid:**
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- Cards -->
</div>
```

**Two-column Layout:**
```html
<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
  <div class="lg:col-span-2"><!-- Main content --></div>
  <div><!-- Sidebar --></div>
</div>
```

### Responsive Breakpoints

Use Tailwind's default breakpoints:
- **sm:** 640px (tablet portrait)
- **md:** 768px (tablet landscape)
- **lg:** 1024px (desktop)
- **xl:** 1280px (large desktop)

---

## Visual States

### Interactive States

**Hover:**
- Buttons: Darken by one shade (`bg-sky-500` → `bg-sky-600`)
- Cards: Increase shadow (`shadow-sm` → `shadow-md`)
- Links: Darken by one shade (`text-sky-500` → `text-sky-600`)

**Active/Selected:**
- Add border or ring: `ring-2 ring-sky-500`
- Or use background: `bg-sky-50 border-sky-500`

**Disabled:**
- Gray out: `bg-slate-200 text-slate-400 cursor-not-allowed`
- Remove hover states

**Focus:**
- All interactive elements: `focus:outline-none focus:ring-2 focus:ring-sky-500`

### Loading States

**Skeleton (for cards):**
```html
<div class="animate-pulse">
  <div class="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
  <div class="h-4 bg-slate-200 rounded w-1/2"></div>
</div>
```

**Spinner:**
```html
<div class="inline-block w-6 h-6 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
```

---

## Examples

### Aircraft Card

```html
<div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
  <h3 class="font-heading text-xl font-semibold text-slate-800 mb-2">
    Boeing 737-800
  </h3>
  <p class="text-slate-500 text-sm mb-4">
    Narrow-body • In Service
  </p>
  <div class="flex items-center justify-between">
    <span class="text-slate-400 text-xs">Range: 3,060 mi</span>
    <a href="#" class="text-sky-500 hover:text-sky-600 text-sm font-medium">
      View Details →
    </a>
  </div>
</div>
```

### Page Header

```html
<header class="bg-white border-b border-slate-200">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <h1 class="font-heading text-4xl font-bold text-slate-800">
      Commercial Aircraft Directory
    </h1>
    <p class="text-slate-500 text-lg mt-2">
      Learn about the planes you fly on
    </p>
  </div>
</header>
```

---

## Summary

**Core Principles:**
1. **Approachable first** — Use friendly colors, generous spacing, clear typography
2. **Aviation credible** — Sky blue, clean lines, professional feel
3. **Content-focused** — Let aircraft info shine, don't over-design
4. **Responsive** — Mobile-first, works on all devices
5. **Consistent** — Use this guide for all UI decisions

**Quick Reference:**
- Primary color: Sky Blue `#0EA5E9`
- Accent: Coral `#F87171`
- Headings: Plus Jakarta Sans
- Body: Inter
- Border radius: 8-12px
- Shadows: Subtle, increase on hover
- Spacing: 16-24px default

---

**Ready to build.** The planner and builder agents will reference these guidelines for all UI work.
