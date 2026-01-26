---
name: design-system
description: Load UI guidance - colors, typography, components. Usage: /design-system
user_invokable: true
---

# Design System

Tailwind CSS foundation with custom colors. No gradients (except hero overlays for text readability).

---

## Brand Personality

| Aspect | Value |
|--------|-------|
| **Mood** | Clean & Professional with Aviation Enthusiasm |
| **Adjectives** | Approachable, Curious, Credible |
| **Avoid** | Overly technical jargon, Cluttered layouts, Generic stock imagery |

---

## Setup

Add to `<head>` in every SSR function:

```html
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = {
    theme: {
      extend: {
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif'],
          display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        },
        colors: {
          // Primary colors - Sky Blue
          'primary': '#0EA5E9',
          'primary-hover': '#0284C7',
          // Background colors
          'background': '#F8FAFC',
          'card': '#FFFFFF',
          'border': '#E2E8F0',
          // Text colors
          'muted': '#64748B',
          // Accent
          'accent': '#F87171',
          // Feedback colors
          'error': '#dc2626',
          'error-bg': '#fef2f2',
          'success': '#16a34a',
          'success-bg': '#f0fdf4',
        }
      }
    }
  }
</script>
```

---

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#0EA5E9` | Primary actions, links, highlights (Sky Blue) |
| `primary-hover` | `#0284C7` | Hover state for primary |
| `background` | `#F8FAFC` | Page background (Slate-50) |
| `card` | `#FFFFFF` | Card/section backgrounds |
| `border` | `#E2E8F0` | Borders, dividers (Slate-200) |
| `muted` | `#64748B` | Secondary text, labels (Slate-500) |
| `accent` | `#F87171` | Accent color, badges (Coral) |
| `error` | `#dc2626` | Error states |
| `success` | `#16a34a` | Success states |

---

## Typography

| Element | Classes | Font |
|---------|---------|------|
| H1 (hero) | `text-3xl md:text-5xl font-bold tracking-tight font-display` | Plus Jakarta Sans |
| H2 | `text-2xl font-semibold tracking-tight font-display` | Plus Jakarta Sans |
| H3 | `text-xl font-semibold font-display` | Plus Jakarta Sans |
| Body | `text-base` | Inter |
| Helper | `text-sm text-muted` | Inter |

---

## Page Layout

```html
<body class="bg-background text-slate-800 min-h-screen font-sans">
  <!-- Header -->
  <header class="border-b border-border bg-card">
    <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
      <a href="/" class="text-xl font-bold font-display text-primary">Airplane Directory</a>
      <nav class="flex gap-6 text-sm text-muted">
        <a href="/aircraft" class="hover:text-slate-800 transition-colors">Aircraft</a>
        <a href="/about" class="hover:text-slate-800 transition-colors">About</a>
      </nav>
    </div>
  </header>

  <!-- Content -->
  <main class="max-w-7xl mx-auto px-4 py-8">
    ...
  </main>
</body>
```

---

## Components

### Button

```html
<!-- Primary -->
<button class="bg-primary hover:bg-primary-hover text-white font-medium px-4 py-2 rounded-lg transition-all">
  Button
</button>

<!-- Secondary -->
<button class="border border-border hover:border-slate-400 text-slate-700 font-medium px-4 py-2 rounded-lg transition-all">
  Button
</button>

<!-- Loading -->
<button class="bg-primary text-white font-medium px-4 py-2 rounded-lg opacity-75 cursor-wait" disabled>
  Loading...
</button>
```

### Aircraft Card

```html
<a href="/aircraft/[slug]" class="group block bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300">
  <!-- Image -->
  <div class="aspect-[4/3] overflow-hidden">
    <img src="/images/aircraft/[slug].jpg" alt="[name]"
      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
  </div>
  <!-- Info -->
  <div class="p-4">
    <h3 class="font-semibold font-display group-hover:text-primary transition-colors">[Name]</h3>
    <p class="text-sm text-muted mt-1">[Manufacturer] · [Passengers] passengers</p>
  </div>
</a>
```

### Input

```html
<div class="flex flex-col gap-1.5">
  <label class="text-sm font-medium">Label</label>
  <input type="text" placeholder="Search aircraft..."
    class="border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
  <span class="text-sm text-muted">Helper text</span>
</div>
```

### Alert

```html
<!-- Error -->
<div class="p-4 bg-error-bg border border-error/20 rounded-lg">
  <p class="font-medium text-error">Something went wrong</p>
</div>

<!-- Success -->
<div class="p-4 bg-success-bg border border-success/20 rounded-lg">
  <p class="font-medium text-success">Saved successfully</p>
</div>
```

### Empty State

```html
<div class="flex flex-col items-center justify-center py-16 text-center">
  <span class="text-4xl opacity-30 mb-4">✈️</span>
  <h3 class="text-lg font-semibold mb-1">No aircraft found</h3>
  <p class="text-muted mb-6">Try adjusting your search or filters.</p>
</div>
```

### Image Placeholder (no image)

```html
<div class="aspect-[4/3] bg-slate-100 flex items-center justify-center">
  <span class="text-4xl opacity-30">✈️</span>
</div>
```

---

## Images

- Served from R2 via `/images/aircraft/[slug].jpg`
- Cards use `aspect-[4/3]` with `object-cover`
- Lazy loading: `loading="lazy"` on card images
- Error handling: hide broken images gracefully

---

## Rules

1. **Use custom color tokens** — `primary`, `muted`, `card`, `border`, etc.
2. **No gradients** — Solid colors only (except overlays for text readability)
3. **Every list needs an empty state** — Show a placeholder when no aircraft
4. **Every form needs error handling** — Display validation errors
5. **Every async action needs loading state** — Show loading indicator
6. **Mobile-first** — Base is mobile, `md:` for desktop
7. **SSR everything** — All content in HTML, no client-side skeleton loaders
8. **Images first** — Sort lists to show aircraft with images before those without
