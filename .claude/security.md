# Security Guidelines — Pocket Pal

## Secrets & Config Files — NEVER COMMIT

```
google-services.json          # Android Firebase config
GoogleService-Info.plist      # iOS Firebase config
service-account.json          # Firebase Admin SDK key
.env                          # Local environment variables
*.keystore                    # Android signing key
```

All are in `.gitignore`. If asked to read or modify these files, do so only locally — never output their contents in responses.

## Authentication

- All auth flows go through `AuthService` (`src/infrastructure/firebase/auth/auth.service.ts`)
- Passwords are never stored — Firebase Auth handles credentials
- Session tokens managed by Firebase SDK (not manually)
- Biometric auth via `expo-local-authentication` — token stored in `expo-secure-store` (device keychain)

## Data Access Rules

- Every Firestore read/write MUST go through repositories in `src/infrastructure/firebase/`
- Never construct Firestore queries directly in components or screens
- User data is scoped by UID at the collection level: `users/{uid}/transactions`
- Firebase security rules (`firestore.rules`) enforce this server-side

## Sensitive Data Storage

| Data Type         | Storage                | Notes                |
| ----------------- | ---------------------- | -------------------- |
| Auth tokens       | Firebase SDK (managed) | Never touch manually |
| Biometric token   | `expo-secure-store`    | Device keychain      |
| User preferences  | MMKV `app-storage`     | Non-sensitive        |
| Transaction cache | MMKV `cache-storage`   | Local only           |
| Encryption key    | `expo-secure-store`    | Device keychain      |

## Input Validation

- All user input validated with Zod schemas before use
- Firebase rules provide a second layer of validation server-side
- Amount fields: always parse with `normalizeAmount()`, never trust raw strings
- Never use `eval()` or dynamic code execution

## SMS Data

- SMS content is processed locally on-device only
- Only the extracted transaction fields (amount, merchant, date) are stored in Firestore
- Raw SMS body (`rawSmsBody`) stored only for deduplication — treat as sensitive
- No raw SMS is ever sent to any external API

## API Keys

- Firebase config: loaded from `app.config.ts` via `process.env` — set as EAS secrets for builds
- OpenAI key (fallback classification): EAS secret only, never in code
- Never hardcode any API key

## When Generating Code

- Never build SQL queries with string concatenation (no SQL injection surface, but apply the principle)
- Always use parameterized Firestore queries
- Sanitize merchant names and descriptions before display (no XSS in WebView contexts)
- Rate-limit sensitive operations (password reset uses Firebase's built-in rate limiting)
