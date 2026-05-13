# Pocket Pal — Claude Code Instructions

## Project Overview

Production-grade AI expense tracking app — Expo SDK 55, React 19, React Native 0.83, Firebase.

## Critical Rules

### Never Do

- Add MVP shortcuts or temporary hacks
- Use `any` types — always be explicit
- Skip haptic feedback on interactive elements
- Create files outside the established architecture
- Add inline styles when NativeWind classes exist
- Commit secrets or Firebase config files
- Use `console.log` — use `console.warn`/`console.error` only

### Always Do

- Follow feature-driven architecture: `src/features/{feature}/`
- Use the theme system (`src/theme/`) for all colors, spacing, typography
- Add `React.memo()` to all list-item components
- Use `accessibilityRole` and `accessibilityLabel` on all interactive elements
- Add haptic feedback (`expo-haptics`) on all button presses
- Use `useCallback` for all handlers passed as props
- Run `npm run typecheck` before reporting a task complete

## Architecture

```
src/
├── app/               # Expo Router screens (file-based routing)
├── features/          # Feature modules (auth, transactions, sms, analytics, budget)
│   └── {feature}/
│       ├── store/     # Zustand stores
│       ├── hooks/     # React Query hooks
│       ├── components/
│       └── services/
├── shared/            # Cross-feature reusable code
│   ├── components/ui/ # Design system primitives
│   ├── hooks/
│   ├── utils/
│   └── constants/
├── infrastructure/    # External service integrations
│   ├── firebase/      # Firestore repos + auth service
│   ├── storage/       # MMKV + SecureStore wrappers
│   └── query/         # TanStack Query client + key factory
├── theme/             # Design tokens (colors, typography, spacing, animations)
└── types/             # Shared TypeScript types
```

## Tech Stack Versions (SDK 55)

- Expo: ^55.0.0
- React: 19.2.0
- React Native: 0.83.6
- React Native Reanimated: 4.2.1
- Zustand: ^5.0.5 — import from `zustand/react` not `zustand`
- NativeWind: ^4.1.23
- TanStack Query: ^5.80.0

## Key Conventions

### State Management

```ts
// Always import from zustand/react in SDK 55
import { create } from 'zustand/react';
```

### Animations (Reanimated 4)

```ts
// Easing is now from react-native, not react-native-reanimated
import { Easing } from 'react-native';
import { useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
```

### Firestore Queries

- Always paginate — never `.get()` an unbounded collection
- Use `transactionConverter.fromFirestore()` for type safety
- Batch writes when creating >1 document

### Path Aliases

```
@/          → src/
@features/  → src/features/
@shared/    → src/shared/
@theme/     → src/theme/
@infra/     → src/infrastructure/
@assets/    → assets/
```

### Component Pattern

```tsx
export const MyComponent = React.memo<Props>(({ ... }) => {
  // hooks first
  // handlers with useCallback
  // derived state
  // render
});
MyComponent.displayName = 'MyComponent';
```

### Query Keys

Always use the factory in `src/infrastructure/query/query-client.ts`:

```ts
queryKeys.transactions.list(filter);
queryKeys.analytics.report(period);
queryKeys.budgets.list();
```

## Design System

- Background: `darkTheme.background.primary` (#0A0A0F)
- Brand: `darkTheme.brand.primary` (#6C5CE7)
- Text: `darkTheme.text.primary` / `.secondary` / `.tertiary`
- Cards: `<GlassCard>` component with glassmorphism styling
- Amounts: `<AmountDisplay>` with JetBrains Mono font
- Loading: `<Skeleton>` with shimmer animation

## Running Commands

```bash
npm start          # Start Expo dev server
npm run typecheck  # TypeScript check (run before completing tasks)
npm run lint       # ESLint
npm test           # Jest tests
npx expo-doctor    # Check SDK compatibility
```

## Firebase

- Rules: `firestore.rules` — enforces user isolation at DB level
- Never read/write without going through repositories in `src/infrastructure/firebase/`
- Indexes: `firestore.indexes.json` — update when adding new queries

## SMS Parsing

- Add new bank parsers to `src/features/sms/parsers/`
- Implement `BankParser` interface
- Export from `src/features/sms/parsers/index.ts`
- Register in `ALL_PARSERS` array
