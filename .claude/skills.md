# Skills & Patterns — Pocket Pal

## Adding a New Screen

```tsx
// src/app/(tabs)/my-screen.tsx  OR  src/app/my-screen.tsx (modal)
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';

import { darkTheme, spacing } from '@/theme';
import { Text } from '@shared/components/ui/Text/Text';

export default function MyScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <MotiView
        from={{ opacity: 0, translateY: -8 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'spring', damping: 24, stiffness: 300 }}
      >
        <Text variant="h2">Screen Title</Text>
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background.primary,
    paddingHorizontal: spacing[5],
  },
});
```

## Adding a Firestore Query Hook

```ts
// src/features/{feature}/hooks/use{Entity}.ts
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@infra/query/query-client';
import { useAuthStore } from '@features/auth/store/auth.store';

export function useMyEntities() {
  const uid = useAuthStore((s) => s.user?.uid);

  return useQuery({
    queryKey: queryKeys.myEntity.list(),
    queryFn: async () => {
      if (!uid) return [];
      const repo = new MyRepository(uid);
      return repo.getAll();
    },
    enabled: !!uid,
    staleTime: 1000 * 60 * 5,
  });
}
```

## Adding a New Bank Parser

```ts
// src/features/sms/parsers/kotak.parser.ts
import type { BankParser, ParsedTransaction, RawSms } from '@/types';
import { normalizeAmount, normalizeMerchantName } from '../engine/normalizer';

export class KotakParser implements BankParser {
  name = 'Kotak Mahindra Bank';
  bankCode = 'KOTAK';
  bankName = 'Kotak Mahindra Bank';
  senderPatterns = [/^KOTAKB/, /^KOTAK/, /^AD-KOTAK/];

  parse(sms: RawSms): ParsedTransaction | null {
    const body = sms.body;
    // ... regex parsing
    return null; // or ParsedTransaction
  }
}

export const kotakParser = new KotakParser();
```

## Animated List Item Pattern

```tsx
<MotiView
  from={{ opacity: 0, translateY: 8 }}
  animate={{ opacity: 1, translateY: 0 }}
  transition={{ type: 'spring', delay: index * 40, damping: 24, stiffness: 300 }}
>
  {/* item content */}
</MotiView>
```

## GlassCard Usage

```tsx
// Subtle background card
<GlassCard intensity="subtle" padding={spacing[4]}>...</GlassCard>

// Gradient card with glow
<GlassCard gradient glow glowColor={darkTheme.status.success}>...</GlassCard>

// Borderless card
<GlassCard borderless>...</GlassCard>
```

## Amount Display

```tsx
// Income (green, with + sign)
<AmountDisplay amount={85000} type="credit" variant="amountLg" />

// Expense (red, with − sign)
<AmountDisplay amount={1500} type="debit" variant="amountSm" />

// Neutral (no color, no sign)
<AmountDisplay amount={50000} type="neutral" variant="amountMd" showSign={false} />

// Compact (₹85K instead of ₹85,000)
<AmountDisplay amount={85000} type="neutral" hideCents />
```

## Skeleton Loading

```tsx
// Show while loading
{
  isLoading ? (
    Array.from({ length: 4 }).map((_, i) => (
      <Skeleton key={i} height={72} borderRadiusSize="xl" style={{ marginBottom: spacing[2] }} />
    ))
  ) : (
    <ActualContent />
  );
}
```

## Haptic Feedback

```ts
import * as Haptics from 'expo-haptics';

// Light tap (buttons, selections)
void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

// Selection change
void Haptics.selectionAsync();

// Success notification
void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
```
