# Implementation Plan — Come Follow Me Companion

## Summary

Build a local SvelteKit 5 app that displays the 2026 Come Follow Me (Old Testament) schedule and AI-generated lesson content. Content is generated via `claude` CLI and stored in the shared mx-supabase instance. The app auto-navigates to the current week's lesson.

## Mandatory Reading

| File | Lines | Why |
|------|-------|-----|
| `/Users/joshtune/workspace/workbench/mx-supabase/CLAUDE.md` | all | Supabase conventions, table prefix rules |
| `/Users/joshtune/workspace/workbench/mx-supabase/supabase/config.toml` | all | Port config for shared instance |
| `/Users/joshtune/workspace/workbench/PORTS.md` | all | Port assignments across workbench |
| `/Users/joshtune/workspace/workbench/other-projects/mx-mission-guess/package.json` | all | Reference for dependency versions |
| `/Users/joshtune/workspace/workbench/other-projects/mx-mission-guess/src/lib/supabase.ts` | all | Simple Supabase client pattern (no auth) |

## Changes

### 1. Scaffold SvelteKit 5 project

Create project from scratch matching workbench conventions:
- `package.json` — SvelteKit 2, Svelte 5, Tailwind 4, Supabase JS, TypeScript
- `svelte.config.js` — adapter-auto (local dev)
- `vite.config.ts` — tailwindcss() + sveltekit() plugins, port 5175
- `tsconfig.json` — strict, extends .svelte-kit
- `.prettierrc` — tabs, single quotes, 100 chars
- `eslint.config.js` — flat config
- `.env.example` — document required vars
- `.env.local` — shared Supabase connection (port 54721)
- `CLAUDE.md` — project conventions

### 2. Supabase migration in mx-supabase

Create migration `00004_app_joey.sql` (or next number) in `/Users/joshtune/workspace/workbench/mx-supabase/supabase/migrations/`:

```sql
-- joey_lessons: 2026 Come Follow Me schedule
create table joey_lessons (
  id serial primary key,
  week_number int not null unique,
  date_start date not null,
  date_end date not null,
  title text not null,
  scripture_block text not null,
  book text not null
);

-- joey_content: AI-generated lesson content
create table joey_content (
  id uuid primary key default gen_random_uuid(),
  lesson_id int not null references joey_lessons(id),
  generated_at timestamptz not null default now(),
  discussion_questions jsonb not null default '[]',
  teaching_ideas jsonb not null default '[]',
  activities jsonb not null default '[]',
  raw_response text
);

-- RLS: allow anonymous access (local dev, no auth)
alter table joey_lessons enable row level security;
alter table joey_content enable row level security;

create policy "joey_lessons_anon_read" on joey_lessons for select using (true);
create policy "joey_content_anon_read" on joey_content for select using (true);
create policy "joey_content_anon_insert" on joey_content for insert with check (true);
create policy "joey_content_anon_update" on joey_content for update using (true);
create policy "joey_content_anon_delete" on joey_content for delete using (true);
```

### 3. Seed script — 2026 CFM schedule

Create `scripts/seed-lessons.ts` — inserts all 52 weeks of the 2026 Old Testament schedule into `joey_lessons`. Uses `node --experimental-strip-types` to run TypeScript directly.

### 4. App CSS + Layout

- `src/app.css` — Tailwind 4 import, simple warm/clean theme variables (not over-styled)
- `src/app.html` — standard SvelteKit shell with viewport meta for mobile
- `src/routes/+layout.svelte` — minimal layout with app title and nav
- `src/routes/+layout.ts` — no SSR (local SPA)

### 5. Supabase client

- `src/lib/supabase.ts` — simple singleton client (no auth, match mx-mission-guess pattern)
- `src/lib/types.ts` — interfaces for Lesson, Content

### 6. Landing page (auto-redirect)

- `src/routes/+page.ts` — load function that calculates current week number from today's date, redirects to `/week/[number]`

### 7. Week view page

- `src/routes/week/[number]/+page.ts` — loads lesson + content from Supabase
- `src/routes/week/[number]/+page.svelte` — displays:
  - Week header (number, dates, scripture block)
  - Navigation arrows (prev/next week)
  - Generated content sections: Discussion Questions, Teaching Ideas, Activities
  - "No content yet — run `npm run generate`" state when empty
  - Mobile-friendly card layout

### 8. Generation script

- `scripts/generate.ts` — the core AI generation script:
  1. Accept optional `--week N` arg (defaults to next Sunday's week)
  2. Query `joey_lessons` for the target week
  3. Build a prompt with scripture block, Teachers Quorum context, and structured output instructions
  4. Run `claude -p "prompt" --output-format text` via child_process
  5. Parse the response (ask Claude for JSON blocks)
  6. Insert into `joey_content` table
  7. Print summary

- `package.json` script: `"generate": "node --experimental-strip-types scripts/generate.ts"`

## New Files

| File | Purpose |
|------|---------|
| `package.json` | Project manifest |
| `svelte.config.js` | SvelteKit config |
| `vite.config.ts` | Vite config with Tailwind |
| `tsconfig.json` | TypeScript config |
| `.prettierrc` | Prettier config |
| `eslint.config.js` | ESLint flat config |
| `.env.example` | Environment variable template |
| `.env.local` | Local Supabase connection |
| `.gitignore` | Ignore patterns |
| `CLAUDE.md` | Project conventions |
| `src/app.html` | HTML shell |
| `src/app.css` | Tailwind + theme |
| `src/routes/+layout.svelte` | Root layout |
| `src/routes/+layout.ts` | Layout config |
| `src/routes/+page.ts` | Landing redirect |
| `src/routes/week/[number]/+page.ts` | Week data loader |
| `src/routes/week/[number]/+page.svelte` | Week view UI |
| `src/lib/supabase.ts` | Supabase client |
| `src/lib/types.ts` | TypeScript interfaces |
| `src/lib/utils.ts` | Date/week helpers |
| `scripts/seed-lessons.ts` | CFM schedule seeder |
| `scripts/generate.ts` | AI content generator |

## Tests

| Scenario | Type |
|----------|------|
| `getCurrentWeekNumber()` returns correct week for known dates | Unit (vitest) |
| Seed script inserts 52 lessons | Integration |
| Week page renders lesson data | Component |

## Order of Operations

1. Scaffold project (package.json, configs, install deps)
2. Create Supabase migration in mx-supabase
3. Create seed script and run it
4. Build Supabase client + types
5. Build utility functions (date/week calculation)
6. Build layout + landing page redirect
7. Build week view page
8. Create generation script
9. Run quality checks (lint, typecheck, svelte-check)

## Validation

- `pnpm lint` passes
- `pnpm check` passes (svelte-check)
- `pnpm dev` starts without errors
- Seed script runs and inserts 52 lessons
- Generation script runs and produces content for a week
- Week page displays generated content on mobile viewport

## Risks / Notes

- The 2026 CFM schedule is estimated from the 2022 cycle — exact dates may need manual adjustment when the official schedule is published
- `claude` CLI must be available in PATH for generation script
- Shared Supabase must be running (`cd mx-supabase && supabase start`)
- Generation script depends on `claude` CLI supporting `-p` flag for non-interactive prompts

## Confidence: 9/10

Straightforward SvelteKit app with well-established patterns from sibling projects. The only uncertainty is the exact `claude` CLI invocation syntax, which we'll validate during build.
