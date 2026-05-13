# 💰 Pocket Pal

> Premium AI-powered personal finance tracking — automated, intelligent, beautiful.

[![CI](https://github.com/your-org/pocket-pal/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/pocket-pal/actions)
[![EAS Build](https://img.shields.io/badge/EAS-Build-4630EB.svg?style=flat&logo=EXPO)](https://eas.expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-21-orange.svg)](https://firebase.google.com/)

---

## ✨ Features

| Feature                       | Description                                                               |
| ----------------------------- | ------------------------------------------------------------------------- |
| 📱 **Auto SMS Tracking**      | Reads transactional SMS messages and auto-creates expense entries         |
| 🤖 **AI Categorization**      | Intelligently categorizes expenses using merchant intelligence            |
| 📊 **Rich Analytics**         | Daily, weekly, monthly, quarterly, yearly analytics with beautiful charts |
| 🎯 **Smart Budgets**          | Adaptive budgets with carry-forward and spending predictions              |
| 🔔 **Proactive Alerts**       | Daily limit, suspicious activity, subscription, and bill reminders        |
| 🔄 **Subscription Detection** | Automatically identifies recurring charges from your transactions         |
| 💡 **AI Insights**            | Spending anomalies, savings opportunities, financial recommendations      |
| 🏦 **Multi-Bank Support**     | HDFC, SBI, ICICI, Axis Bank parsers (more coming)                         |
| 🔒 **Bank-Level Security**    | Biometric auth, encrypted storage, Firebase security rules                |
| 🌐 **Offline-First**          | Full offline support with background sync                                 |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Pocket Pal                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Expo Router│  │  NativeWind  │  │  Reanimated + Moti   │  │
│  │  (Navigation)│  │  (Styling)   │  │  (Animations)        │  │
│  └─────────────┘  └──────────────┘  └──────────────────────┘  │
│                                                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Zustand   │  │ TanStack     │  │  React Hook Form     │  │
│  │  (State)    │  │ Query(Cache) │  │  + Zod (Validation)  │  │
│  └─────────────┘  └──────────────┘  └──────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   Feature Modules                        │   │
│  │  Auth · Transactions · SMS · Analytics · Budget ·        │   │
│  │  Insights · Notifications · Settings                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                Infrastructure Layer                      │   │
│  │  Firebase (Auth · Firestore · Functions · Analytics ·   │   │
│  │  Crashlytics · Perf · FCM · Remote Config)              │   │
│  │  MMKV · Expo Secure Store                               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Folder Structure

```
pocket-pal/
├── src/
│   ├── app/                    # Expo Router screens
│   │   ├── (auth)/             # Login, Register, Onboarding
│   │   ├── (tabs)/             # Main tab screens
│   │   └── _layout.tsx         # Root layout + auth gate
│   │
│   ├── features/               # Feature modules
│   │   ├── auth/               # Authentication
│   │   ├── transactions/       # Transaction management
│   │   ├── sms/                # SMS parsing engine
│   │   │   ├── engine/         # Parser registry, normalizer
│   │   │   └── parsers/        # Bank-specific parsers
│   │   ├── analytics/          # Analytics engine
│   │   ├── budget/             # Budget management
│   │   ├── insights/           # AI insights
│   │   └── notifications/      # Push notifications
│   │
│   ├── shared/                 # Reusable components & hooks
│   │   ├── components/
│   │   │   ├── ui/             # Text, Button, Input, Card, etc.
│   │   │   ├── charts/         # Animated chart components
│   │   │   ├── transactions/   # TransactionCard, etc.
│   │   │   └── layouts/        # Screen layouts
│   │   └── hooks/              # Custom React hooks
│   │
│   ├── infrastructure/
│   │   ├── firebase/           # Firebase config & repositories
│   │   │   ├── auth/
│   │   │   └── firestore/
│   │   ├── storage/            # MMKV + Secure Store
│   │   └── query/              # TanStack Query client & keys
│   │
│   ├── theme/                  # Design tokens
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   ├── animations.ts
│   │   └── global.css          # NativeWind styles
│   │
│   └── types/                  # TypeScript types
│       ├── transaction.ts
│       ├── user.ts
│       ├── budget.ts
│       ├── analytics.ts
│       └── sms.ts
│
├── functions/                  # Firebase Cloud Functions
│   └── src/
│       ├── analytics/
│       ├── insights/
│       ├── auth/
│       └── notifications/
│
├── .github/workflows/          # CI/CD pipelines
├── assets/                     # Images, fonts, animations
├── firestore.rules             # Database security rules
├── firestore.indexes.json      # Query indexes
├── firebase.json
├── app.config.ts               # Expo configuration
├── eas.json                    # EAS build profiles
├── tailwind.config.js
├── SETUP.md                    # Detailed setup guide
└── README.md
```

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env
# Fill in Firebase values

# Place Firebase config files
# → google-services.json (from Firebase Console → Android app)
# → GoogleService-Info.plist (from Firebase Console → iOS app)

# Install git hooks
npm run prepare

# Start development server
npx expo start
```

See [SETUP.md](./SETUP.md) for complete configuration instructions.

---

## 📱 Supported Banks (SMS Parsing)

| Bank                | Parser            | Status         |
| ------------------- | ----------------- | -------------- |
| HDFC Bank           | `hdfc.parser.ts`  | ✅ Supported   |
| State Bank of India | `sbi.parser.ts`   | ✅ Supported   |
| ICICI Bank          | `icici.parser.ts` | ✅ Supported   |
| Axis Bank           | `axis.parser.ts`  | ✅ Supported   |
| Kotak Bank          | Coming soon       | 🔧 In Progress |
| Yes Bank            | Coming soon       | 🔧 In Progress |
| IndusInd Bank       | Coming soon       | 📋 Planned     |
| Bank of Baroda      | Coming soon       | 📋 Planned     |

---

## 🎨 Design System

- **Primary font:** Inter (UI) + Outfit (Display) + JetBrains Mono (Amounts)
- **Color palette:** Dark-first with glassmorphism surfaces
- **Theme:** Premium dark theme with purple primary accent
- **Motion:** Spring-based animations via Reanimated 3 + Moti
- **Design inspiration:** Revolut, Apple Wallet, Linear, Arc Browser

---

## 🧪 Testing

```bash
# Unit tests
npm test

# With coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

---

## 📦 Build & Deploy

```bash
# Development build (native)
eas build --profile development --platform android

# Preview (internal testing)
eas build --profile preview --platform all

# Production
eas build --profile production --platform all

# OTA update (JS changes only)
eas update --branch main --message "fix: amount display"

# Deploy Firebase
firebase deploy
```

---

## 🔐 Security

- All user data is isolated by Firebase UID at the database level
- Firestore security rules prevent cross-user data access
- Sensitive tokens stored in `expo-secure-store` (device keychain)
- App-level data in MMKV (not synced to cloud)
- Firebase rules enforce data validation server-side
- SMS data is processed locally and only transaction metadata is stored

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/add-kotak-parser`
3. Commit using conventional commits: `git commit -m "feat: add Kotak Bank SMS parser"`
4. Push and create a Pull Request

---

## 📄 License

MIT © Pocket Pal
