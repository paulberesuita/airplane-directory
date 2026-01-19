# Design System

Tailwind CSS foundation with custom colors. No gradients.

## Setup

Add to `<head>`:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = {
    theme: {
      extend: {
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif'],
        },
        colors: {
          'accent': '#1c1917',
          'accent-hover': '#292524',
          'muted': '#78716c',
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

## Typography

| Element | Classes |
|---------|---------|
| H1 | `text-3xl font-semibold tracking-tight` |
| H2 | `text-2xl font-semibold tracking-tight` |
| H3 | `text-xl font-semibold` |
| Body | `text-base` |
| Helper | `text-sm text-muted` |

## Components

### Button

```html
<!-- Primary -->
<button class="bg-accent hover:bg-accent-hover text-white font-medium px-4 py-2 rounded-lg transition-all">
  Button
</button>

<!-- Secondary -->
<button class="border border-stone-300 hover:border-stone-400 text-stone-700 font-medium px-4 py-2 rounded-lg">
  Button
</button>

<!-- Loading -->
<button class="bg-accent text-white font-medium px-4 py-2 rounded-lg opacity-75 cursor-wait" disabled>
  Loading...
</button>
```

### Card

```html
<div class="bg-white border border-stone-200 rounded-xl p-5">
  <h3 class="font-semibold">Title</h3>
  <p class="text-muted mt-2">Content</p>
</div>
```

### Input

```html
<div class="flex flex-col gap-1.5">
  <label class="text-sm font-medium">Label</label>
  <input type="text" placeholder="Placeholder"
    class="border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent" />
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
  <h3 class="text-lg font-semibold mb-1">No items yet</h3>
  <p class="text-muted mb-6">Create your first item to get started.</p>
  <button class="bg-accent hover:bg-accent-hover text-white font-medium px-4 py-2 rounded-lg">
    Create Item
  </button>
</div>
```

## Rules

1. **Use custom colors** — `accent`, `muted`, `error`, `success`
2. **No gradients** — Solid colors only
3. **Every list needs an empty state**
4. **Every form needs error handling**
5. **Every async action needs loading state**
6. **Mobile-first** — Base is mobile, `md:` for desktop
