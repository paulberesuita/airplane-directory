---
name: mini-tools
description: Ideas for fun, interactive mini-tools. Usage: /mini-tools
user_invokable: true
agent: product
---

# Mini-Tools

Fun, interactive tools related to aviation. These drive traffic through shareability and utility.

---

## What Makes a Good Tool

- **Useful** — Solves a real question aviation enthusiasts have
- **Shareable** — Results worth showing others
- **Fast** — Instant results, no friction
- **Data-driven** — Uses our aircraft database as the backbone

---

## Ideas (ranked by impact)

| Tool | What it does | Why it works |
|------|--------------|--------------|
| **Flight range calculator** | Enter two cities, see which aircraft can make the trip | Practical utility, high search volume |
| **Aircraft size comparison** | Overlay aircraft silhouettes at scale | Visual, shareable, educational |
| **"What aircraft are you?" quiz** | Personality quiz matching you to an aircraft | Viral quiz potential |
| **Aircraft spotter** | Identify aircraft from silhouettes or photos | AvGeek community appeal |
| **Fleet builder** | Build your dream airline fleet with a budget | Fun + shareable results |
| **Seat comparison** | Compare cabin configs between aircraft | Decision helper for travelers |

---

## Structure

```
public/tools/[name]/index.html    # Client-side tool
  — or —
functions/tools/[name].js         # Server-rendered tool
```

---

## Before Building

Read `/tasty-design` and `/project-architecture` first.
