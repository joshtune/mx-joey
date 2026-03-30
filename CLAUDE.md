# mx-joey — Come Follow Me Companion

A weekly Come Follow Me lesson companion for Teachers Quorum (young men 14-15). Generates AI-powered discussion ideas, teaching insights, and activity suggestions.

## Stack

- SvelteKit 5 (Svelte 5, runes)
- Tailwind CSS 4
- TypeScript (strict)
- JSON file storage (no database)
- Claude CLI for AI content generation
- pnpm

## Project Structure

```
src/
  lib/
    data/schedule.ts    # 2026 Old Testament CFM schedule (52 weeks)
    data/content.ts     # Reads generated content from data/content/
    types.ts            # Lesson, GeneratedContent interfaces
    utils.ts            # Date/week calculation helpers
  routes/
    +page.server.ts     # Redirects to current week
    week/[number]/      # Week view with lesson + generated content
data/
  content/              # Generated JSON files (week-01.json, etc.)
scripts/
  generate.ts           # Claude CLI generation script
```

## Commands

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start dev server (port 5176) |
| `pnpm build` | Build for production |
| `pnpm check` | Run svelte-check |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format with Prettier |
| `pnpm test` | Run vitest |
| `pnpm generate` | Generate content for next Sunday |
| `pnpm generate -- --week N` | Generate content for a specific week |

## Data Model

- **Schedule**: Static TypeScript array in `src/lib/data/schedule.ts`
- **Generated content**: JSON files in `data/content/week-NN.json`
- **No database** — all data is local files

## Conventions

- Conventional commits
- Tabs, single quotes, 100-char lines
- Flat ESLint config
- Dev server: port 5176, preview: port 4176
