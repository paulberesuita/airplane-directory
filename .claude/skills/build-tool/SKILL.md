---
name: build-tool
description: Build fun, interactive mini-tools. Usage: /build-tool
user_invokable: true
agent: mini-apps
---

# Build Tool

You've been invoked to **build a fun, interactive mini-tool** related to aviation.

**Workflow:** Build Tool (from Mini-Apps agent)

---

## Tool Philosophy

Great tools are:
- **Useful** — Solve a real problem aviation enthusiasts have
- **Shareable** — Results worth showing others
- **Embeddable** — Easy to link to or share on social
- **Fast** — Instant results, no friction

---

## Tool Ideas for Airplane Directory

| Tool | What it does | Traffic driver |
|------|--------------|----------------|
| **Flight range calculator** | Enter two cities, see which aircraft can make the trip | Practical utility |
| **Aircraft quiz** | "Which aircraft are you?" personality quiz | Viral quiz potential |
| **Seat comparison** | Compare cabin configs between aircraft | Decision helper |
| **Fleet builder** | Build your dream airline fleet | Fun + shareable |
| **Aircraft spotter** | Quiz on identifying aircraft silhouettes | Aviation enthusiast appeal |
| **Route planner** | Find aircraft that can fly a specific route | Practical utility |

---

## Workflow

### 1. Validate Idea

Before building, answer:

- [ ] **Is it useful?** — Does it solve a real problem or satisfy aviation curiosity?
- [ ] **Will people share it?** — Is the output interesting to show others?
- [ ] **Is it searchable?** — What queries would lead here?
- [ ] **Can we build it?** — Do we have the aircraft data needed?

### 2. Define Input/Output

```markdown
## [Tool Name]

**Input:** [What the user provides]
**Output:** [What they get back]
**Share hooks:** [How they share results]

Example:
- User enters: "New York to London"
- Tool returns: "5 aircraft can make this trip: 777-300ER, A350-900..."
- Share: Twitter card with result, shareable link
```

### 3. Write Spec

Create `specs/tool-[name].md`:

```markdown
# [Tool Name]

## Purpose
[What problem it solves, why aviation enthusiasts will use it]

## User Flow
1. [Step 1]
2. [Step 2]
3. [Result]

## Data Required
[SQL queries or external APIs needed]

## Share Mechanics
- Twitter card: [what it shows]
- URL structure: [/tools/name?param=value]

## SEO
- Title: [title tag]
- Description: [meta description]
```

### 4. Load Design Standards

**Read before building:**
- `/design-system` — Colors, components, typography
- `/coding-standards` — API patterns, D1/R2 usage

### 5. Build the Tool

**Structure:**
```
functions/tools/[name].js           # Server-rendered or API
— or —
public/tools/[name]/index.html      # Client-side
```

**For client-side tools:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>[Tool Name] | Airplane Directory</title>
  <meta name="description" content="[Description]">

  <!-- Share cards -->
  <meta property="og:title" content="[Tool Name]">
  <meta property="og:description" content="[Description]">
  <meta name="twitter:card" content="summary_large_image">

  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-background text-slate-800 min-h-screen font-sans">
  <main class="max-w-2xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold font-display mb-6">[Tool Name]</h1>
    <form id="tool-form">
      <!-- Input fields -->
    </form>
    <div id="results"></div>
  </main>

  <!-- SEO content -->
  <article class="max-w-2xl mx-auto px-4 py-8">
    <h2 class="text-xl font-semibold font-display mb-4">About this tool</h2>
    <p class="text-muted">[SEO content explaining the tool]</p>
  </article>

  <script>
    // Tool logic - fetch aircraft data from /api/aircraft
  </script>
</body>
</html>
```

### 6. Add Share Hooks

**Twitter/X sharing:**
```javascript
function shareOnTwitter(result) {
  const text = encodeURIComponent(`My result: ${result.value}`);
  const url = encodeURIComponent(`https://airplane-directory.pages.dev/tools/[name]?${result.params}`);
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`);
}
```

**Shareable URL with state:**
```javascript
// Update URL as user interacts
function updateShareableUrl(params) {
  const url = new URL(window.location);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  history.replaceState({}, '', url);
}

// Read state from URL on load
const params = new URLSearchParams(window.location.search);
if (params.get('input')) {
  runTool(params.get('input'));
}
```

### 7. Deploy

```bash
wrangler pages deploy ./public --project-name=airplane-directory
```

### 8. Verify

- [ ] Tool works end-to-end
- [ ] Results are accurate
- [ ] Share button works
- [ ] Shareable URL works (copy link, open in incognito)
- [ ] Mobile-friendly
- [ ] No JavaScript errors

### 9. Update Documentation

- **CHANGELOG.md** — "Added: [tool name] tool"
- **CONTEXT.md** — Why this tool, expected traffic sources

---

## Remember

- Keep tools simple and focused — one clear purpose
- Share mechanics are critical — make results easy to share
- Read `/design-system` before building UI
- Test share links in incognito/fresh browser
- Update CHANGELOG.md and CONTEXT.md when done
