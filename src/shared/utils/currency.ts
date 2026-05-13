export function formatCurrency(
  amount: number,
  currency = 'INR',
  locale = 'en-IN',
  compact = false,
): string {
  if (compact && Math.abs(amount) >= 100000) {
    const inLakhs = amount / 100000;
    return `₹${inLakhs.toFixed(inLakhs % 1 === 0 ? 0 : 1)}L`;
  }
  if (compact && Math.abs(amount) >= 1000) {
    const inThousands = amount / 1000;
    return `₹${inThousands.toFixed(inThousands % 1 === 0 ? 0 : 1)}K`;
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatAmount(amount: number, opts?: { compact?: boolean }): string {
  return formatCurrency(amount, 'INR', 'en-IN', opts?.compact ?? false);
}

export function parseCurrencyInput(input: string): number {
  const cleaned = input.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}
