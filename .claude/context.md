# Project Context — Pocket Pal

## What This App Does

Pocket Pal reads transactional SMS messages on Android (auto-tracking) and provides:

- Automatic expense categorization
- Multi-bank unified dashboard
- Budget tracking with adaptive limits
- AI-powered insights (subscriptions, anomalies, predictions)
- Rich analytics (daily/weekly/monthly/quarterly/yearly)

iOS doesn't allow SMS access — so iOS users get manual entry, PDF import, OCR scanning.

## Target Users

Primary: Indian users (salaried professionals, 22–40 years old) who:

- Receive transactional SMS from Indian banks (HDFC, SBI, ICICI, Axis)
- Want automated expense tracking without manual entry
- Use UPI heavily (PhonePe, Google Pay, Paytm)
- Value privacy (no bank login required — SMS only)

## Indian Banking Context

- Currency: INR (₹)
- Key SMS senders: `HDFCBK`, `SBIINB`, `ICICIB`, `AXISBK`
- UPI IDs format: `name@bankcode` (e.g., `user@hdfcbank`)
- Common merchants: Swiggy, Zomato, Amazon, Flipkart, Uber, Ola
- Bank account format: masked as `XXXX1234`

## Current Development State (as of May 2026)

- ✅ Project scaffolded with Expo SDK 55, React 19, RN 0.83
- ✅ Full type system defined
- ✅ Theme system (dark glassmorphism design)
- ✅ Firebase infrastructure (auth, Firestore repos, Cloud Functions)
- ✅ SMS parsing engine (HDFC, SBI, ICICI, Axis parsers)
- ✅ Zustand stores (auth, transactions)
- ✅ TanStack Query setup with key factory
- ✅ Core UI components (Button, Text, Input, GlassCard, Skeleton, AmountDisplay, TransactionCard)
- ✅ All 5 tab screens (Dashboard, Transactions, Analytics, Budget, Settings)
- ✅ Auth screens (Login, Register)
- ✅ Firebase Cloud Functions (analytics, insights, notifications, auth hooks)
- ✅ Firestore security rules + indexes
- ✅ CI/CD (GitHub Actions, EAS workflows)
- ⏳ Add-transaction modal screen
- ⏳ Transaction detail screen
- ⏳ Onboarding flow (SMS permission request)
- ⏳ Chart components (Skia-based)
- ⏳ Budget detail screen
- ⏳ Settings sub-screens (biometrics, notifications, etc.)
- ⏳ OCR receipt scanning (iOS)
- ⏳ More bank parsers (Kotak, Yes Bank, IndusInd)

## Architecture Decisions & Why

- **Expo managed workflow** — faster iteration, EAS handles native builds
- **Firebase** over self-hosted — free tier generous, real-time sync, auth included
- **MMKV** over AsyncStorage — 30x faster, synchronous reads
- **FlashList** over FlatList — dramatically better performance for long transaction lists
- **Feature modules** over page-based folders — features encapsulate their own logic, easier to scale
- **Zustand v5** — simpler than Redux, works great with React 19, no provider needed
- **TanStack Query** — server state separate from client state, handles caching/revalidation
- **NativeWind v4** — Tailwind for RN, much faster to style than StyleSheet for layout
- **Reanimated 4** — new architecture, worklets no longer needed for most animations

## Known Constraints

- Firebase Spark plan (free): 50K reads/day, 20K writes/day — Cloud Functions require Blaze
- SMS permission on Android only — iOS users need alternative input methods
- `react-native-track-player` and `@notifee/react-native` excluded from expo install validation (they have their own peer dep management)
