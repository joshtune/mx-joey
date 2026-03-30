# Come Follow Me — Teachers Quorum Companion

## Problem Statement

Preparing a meaningful Teachers Quorum lesson each Sunday takes time. The 1st Counselor in the Bishopric needs a quick way to get AI-generated discussion ideas, activities, and talking points aligned to each week's Come Follow Me lesson — something he can pull up on his phone Sunday evening to prep, and reference again during class.

## Key Hypothesis

If a teacher can open a simple app on Sunday evening and instantly see tailored discussion ideas, questions, and activity suggestions for next week's Come Follow Me lesson, they'll spend less time scrambling for ideas and more time connecting with the young men.

## Users

- **Primary user:** Josh — 1st Counselor in Bishopric, teaches/oversees Teachers Quorum (young men ages 14-15)
- **JTBD:** "When I sit down Sunday evening, I want to quickly see fresh lesson ideas for next week so I can walk into class prepared and confident."
- **Non-users:** The young men themselves don't use the app. Other ward members are not in scope.

## Solution

A local SvelteKit app backed by the shared Supabase instance that:

1. Embeds the full 2026 Come Follow Me (Old Testament) weekly schedule
2. Automatically shows next Sunday's lesson based on today's date
3. Uses the `claude` CLI (Claude Code subscription) to generate lesson content on demand
4. Stores generated content in Supabase so it persists and is instant on reload
5. Mobile-friendly design for phone use during class

### MVP Scope

| Priority | Feature | Description |
|----------|---------|-------------|
| **Must** | Embedded CFM schedule | All 52 weeks of the 2026 Old Testament schedule with scripture blocks and topics |
| **Must** | Auto-detect current week | Landing page shows next Sunday's lesson automatically |
| **Must** | AI content generation | `npm run generate` command uses `claude` CLI to create lesson ideas for a given week |
| **Must** | Display generated content | Show discussion questions, teaching ideas, activities, and key themes |
| **Must** | Browse weeks | Navigate to any week (past or upcoming) |
| **Must** | Mobile-friendly | Responsive layout usable on a phone |
| **Should** | Regenerate content | Ability to re-run generation for a week to get fresh ideas |
| **Should** | Generation status | Visual indicator of whether a week has generated content |
| **Won't** | Individual notes on quorum members | Future feature, not MVP |
| **Won't** | Authentication/login | Single user, local only |
| **Won't** | Cloud deployment | Local dev server only for now |
| **Won't** | Push notifications/reminders | Out of scope |

## Architecture

### Data Flow

```
sunday evening:
  user runs `npm run generate`
    → script finds next sunday's lesson from schedule
    → constructs prompt (scripture block + Teachers Quorum context)
    → runs `claude -p "prompt"` locally
    → parses response → saves to joey_content table in Supabase

user opens app:
  → SvelteKit loads next sunday's lesson + stored content from Supabase
  → displays ideas, questions, activities on a clean mobile page
```

### Tech Stack

- **Frontend:** SvelteKit 5, Tailwind CSS 4, TypeScript
- **Database:** Shared mx-supabase instance (port 54721, `joey_*` table prefix)
- **AI generation:** `claude` CLI (Claude Code subscription, no API key)
- **Package manager:** pnpm

### Database Schema

**`joey_lessons`** — the embedded CFM schedule
| Column | Type | Description |
|--------|------|-------------|
| id | serial PK | |
| week_number | int | 1–52 |
| date_start | date | Monday of the week |
| date_end | date | Sunday of the week |
| title | text | Lesson title |
| scripture_block | text | e.g. "Genesis 42–50" |
| book | text | e.g. "Genesis" |

**`joey_content`** — AI-generated lesson content
| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | |
| lesson_id | int FK → joey_lessons.id | |
| generated_at | timestamptz | When content was generated |
| discussion_questions | jsonb | Array of questions for the quorum |
| teaching_ideas | jsonb | Key themes and talking points |
| activities | jsonb | Interactive activity suggestions |
| raw_response | text | Full AI response for reference |

### Pages

| Route | Purpose |
|-------|---------|
| `/` | Redirects to next Sunday's week |
| `/week/[number]` | Displays a specific week's lesson + generated content |

## Success Metrics

- Teacher can go from "I have no idea what to teach" to "I have 3-5 solid ideas" in under 2 minutes
- Content generation takes < 30 seconds via CLI
- App loads instantly on phone (static content from DB)

## Open Questions

1. Should the generation script generate for just next week or allow generating multiple weeks ahead?
   - **Decision:** MVP generates one week at a time, specified by week number or "next" (default)
2. Exact 2026 CFM schedule may differ slightly from 2022 — we'll embed best-known schedule and allow manual edits later

## Implementation Phases

1. **Phase 1:** Scaffold SvelteKit app, set up Supabase tables, embed CFM schedule data
2. **Phase 2:** Build the week view page with responsive layout
3. **Phase 3:** Create the `claude` CLI generation script
4. **Phase 4:** Wire generation output to Supabase and display in the app

## Suggested Tickets

1. Scaffold SvelteKit 5 project with Tailwind 4 and Supabase client
2. Create Supabase migration for `joey_lessons` and `joey_content` tables
3. Seed `joey_lessons` with 2026 CFM schedule
4. Build `/week/[number]` page with lesson display and generated content
5. Build landing page with auto-redirect to current week
6. Create `generate.ts` script using `claude` CLI for lesson content generation
7. Wire generation script output into `joey_content` table
