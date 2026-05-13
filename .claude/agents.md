# Agent Guidelines — Pocket Pal

## When to Spawn Sub-Agents

### Use `Explore` agent for:

- Finding all files that import a specific module
- Locating where a type is defined across the codebase
- Searching for all usages of a pattern (e.g., all `useQuery` calls)

### Use `Plan` agent for:

- Designing new feature modules before coding
- Planning database schema changes
- Figuring out the right abstraction for a complex feature

### Do NOT spawn agents for:

- Single file reads or edits
- Simple grep/glob operations
- Tasks completable in < 3 tool calls

## Agent Context to Pass

When spawning an agent for this project, always include:

1. Path aliases: `@/ = src/, @features/ = src/features/, @shared/ = src/shared/, @theme/ = src/theme/, @infra/ = src/infrastructure/`
2. Tech stack: Expo 55, React 19, RN 0.83, Firebase, Zustand v5, TanStack Query v5, Reanimated 4
3. The specific file path and function to modify

## Firebase Agent Reminders

- All reads go through repositories, not raw `db.collection()` calls in components
- Cloud Functions are in `functions/src/` — separate Node.js project
- Never call Cloud Functions directly — use `fbFunctions.httpsCallable()`

## SMS Parser Agent Reminders

When adding a new bank parser:

1. Create `src/features/sms/parsers/{bankcode}.parser.ts`
2. Implement `BankParser` interface from `src/types/sms.ts`
3. Export from `src/features/sms/parsers/index.ts`
4. Add to `ALL_PARSERS` array in same file
5. Test with real SMS samples from that bank
