---
name: cold-campaign
description: Run outreach campaigns to get links, mentions, and partnerships. Usage: /cold-campaign
user_invokable: true
agent: outreach
---

# Cold Campaign

You've been invoked to **run a cold outreach campaign** to get links, mentions, and partnerships.

**Workflow:** Cold Campaign (from Outreach agent)

---

## Campaign Types

| Type | Target | Goal |
|------|--------|------|
| **Link building** | Aviation bloggers, content sites | Backlinks to our pages |
| **Guest posts** | Aviation publications | Exposure + links |
| **Partnerships** | Airlines, aviation museums | Mutual promotion |
| **Press** | Travel/aviation journalists | Coverage + credibility |
| **Community engagement** | Reddit (r/aviation), forums | Traffic + awareness |

---

## Workflow

### 1. Define Goal

Before starting, clarify:

- **What do we want?** Links? Press coverage? Partnerships?
- **What can we offer?** Aircraft data, exposure, reciprocal links, content?
- **What's the hook?** Why should they care about Airplane Directory?

### 2. Identify Targets

**For link building:**
```
Search queries:
- "aviation blog"
- "airplane spotting blog"
- "commercial aircraft guide"
- "airline fleet information"
```

**For partnerships:**
```bash
# Find manufacturers with multiple aircraft
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT manufacturer, COUNT(*) as count FROM aircraft GROUP BY manufacturer ORDER BY count DESC;"
```
Then search: "[manufacturer] enthusiast community"

**For press:**
```
- Aviation Week
- Flight Global
- Simple Flying
- The Points Guy (travel)
- View from the Wing
```

### 3. Research Each Target

Before reaching out, understand them:

- What have they covered before?
- What's their audience?
- Do they accept guest posts?
- What's their contact preference?

**Create a tracking list:**
```markdown
| Target | Type | Contact | Status | Notes |
|--------|------|---------|--------|-------|
| [Name] | blog | email@... | researched | Covers aircraft news, accepts guest posts |
```

### 4. Craft Personalized Pitch

**Template structure (customize for each):**

```
Subject: [Specific, relevant hook]

Hi [Name],

[1 sentence showing you know their work]

[What we have that's relevant to them]

[Clear ask — what do you want?]

[What's in it for them?]

[Call to action]

[Your name]
Airplane Directory
```

**Example pitches:**

**Link building:**
```
Subject: Aircraft data for your fleet comparison article

Hi [Name],

Loved your piece on the A350 vs 787 comparison. The spec breakdown was really helpful.

We just compiled detailed specs and history for 43 commercial aircraft at Airplane Directory.
Might be useful for future comparison articles or as a resource for your readers.

Happy to share our data or answer any questions about aircraft specs.

[Name]
airplane-directory.pages.dev
```

**Partnership:**
```
Subject: Partnership idea — Aviation enthusiast resource

Hi [Name],

I run Airplane Directory — we have 43 commercial aircraft with detailed specs,
history, and images. We're building the go-to resource for aviation enthusiasts.

Would you be interested in cross-promotion? We'd feature your content
in exchange for a mention or link on your site.

Let me know if you'd like to chat.

[Name]
```

### 5. Send Outreach

- Send personalized emails (not templates)
- Track who you contacted and when
- Don't spam — quality over quantity
- Use their preferred contact method

**Update tracking:**
```markdown
| Target | Type | Contact | Status | Notes |
|--------|------|---------|--------|-------|
| [Name] | blog | email@... | sent 1/25 | Pitched aircraft comparison angle |
```

### 6. Follow Up

**One follow-up after 1 week if no response:**

```
Subject: Re: [Original subject]

Hi [Name],

Just wanted to follow up on my note below. Let me know if you have any questions
or if this isn't a good fit right now.

[Name]
```

**After second email, move on.** No more follow-ups.

### 7. Track Results

Update tracking with outcomes:

```markdown
| Target | Type | Status | Result |
|--------|------|--------|--------|
| [Name] | blog | replied | Link added to their aircraft guide |
| [Name] | partner | no response | - |
| [Name] | press | replied | Writing article about aircraft directories |
```

**Measure:**
- Links acquired (check with `site:[domain] airplane-directory`)
- Referral traffic (if we have analytics)
- Partnerships established
- Coverage/mentions

### 8. Update Documentation

- **CHANGELOG.md** — "Added: [Campaign name] outreach campaign"
- **CONTEXT.md** — Campaign learnings, what worked, what didn't

---

## Rules

- **Be genuine** — No spam, no bought links
- **Provide value** — Give them something useful (our aircraft data)
- **Personalize everything** — No copy-paste templates
- **Respect no** — One follow-up max, then move on
- **Track everything** — Know what's working

---

## Remember

- This is a research + outreach workflow, no code involved
- Quality of pitch matters more than quantity
- Partnerships are better than one-off links
- Update CHANGELOG.md and CONTEXT.md when done
