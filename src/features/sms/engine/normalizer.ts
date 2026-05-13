import type { ParsedTransaction } from '@/types';
import type { CategoryId } from '@/types/transaction';

const MERCHANT_ALIASES: Record<string, string> = {
  SWIGGY: 'Swiggy',
  ZOMATO: 'Zomato',
  AMAZON: 'Amazon',
  FLIPKART: 'Flipkart',
  NETFLIX: 'Netflix',
  SPOTIFY: 'Spotify',
  UBER: 'Uber',
  OLA: 'Ola',
  RAPIDO: 'Rapido',
  MYNTRA: 'Myntra',
  NYKAA: 'Nykaa',
  BLINKIT: 'Blinkit',
  ZEPTO: 'Zepto',
  INSTAMART: 'Swiggy Instamart',
  BIGBASKET: 'BigBasket',
  DUNZO: 'Dunzo',
  PHONEPE: 'PhonePe',
  PAYTM: 'Paytm',
  GPAY: 'Google Pay',
  GOOGLEPAY: 'Google Pay',
  BHIM: 'BHIM UPI',
  CRED: 'CRED',
  GROWW: 'Groww',
  ZERODHA: 'Zerodha',
  UPSTOX: 'Upstox',
  RAZORPAY: 'Razorpay',
  JIOMART: 'JioMart',
  RELIANCE: 'Reliance',
  DMART: 'D-Mart',
  IRCTC: 'IRCTC',
  MAKEMYTRIP: 'MakeMyTrip',
  CLEARTRIP: 'Cleartrip',
  GOIBIBO: 'Goibibo',
  AIRTEL: 'Airtel',
  JIO: 'Jio',
  VODAFONE: 'Vodafone',
  BSNL: 'BSNL',
  ZEEQ: 'ZEE5',
  HOTSTAR: 'Disney+ Hotstar',
  PRIMEVIDEO: 'Amazon Prime Video',
  YOUTUBE: 'YouTube Premium',
};

const CATEGORY_KEYWORDS: Record<CategoryId, string[]> = {
  food_dining: [
    'swiggy',
    'zomato',
    'restaurant',
    'cafe',
    'food',
    'pizza',
    'burger',
    'kfc',
    'mcdonalds',
    'subway',
    'dominos',
    'starbucks',
    'chai',
    'dhaba',
    'hotel',
  ],
  grocery: [
    'bigbasket',
    'blinkit',
    'zepto',
    'instamart',
    'dmart',
    'grocery',
    'supermarket',
    'reliance fresh',
    'more retail',
    'spencer',
  ],
  shopping: [
    'amazon',
    'flipkart',
    'myntra',
    'nykaa',
    'ajio',
    'meesho',
    'snapdeal',
    'mall',
    'store',
    'boutique',
    'fashion',
  ],
  transport: [
    'uber',
    'ola',
    'rapido',
    'metro',
    'bus',
    'auto',
    'cab',
    'taxi',
    'ola money',
    'yulu',
    'bounce',
  ],
  fuel: [
    'petrol',
    'diesel',
    'cng',
    'hp',
    'indian oil',
    'bharat petroleum',
    'shell',
    'fuel',
    'iocl',
    'hpcl',
    'bpcl',
  ],
  entertainment: [
    'netflix',
    'spotify',
    'prime video',
    'hotstar',
    'zee5',
    'youtube',
    'pvr',
    'inox',
    'cinema',
    'movies',
    'concert',
    'bookmyshow',
  ],
  bills_utilities: [
    'electricity',
    'water',
    'gas',
    'wifi',
    'internet',
    'broadband',
    'dth',
    'tata sky',
    'airtel xstream',
    'dish',
    'postpaid',
    'landline',
  ],
  subscriptions: [
    'netflix',
    'spotify',
    'prime',
    'hotstar',
    'icloud',
    'google one',
    'dropbox',
    'office',
    'adobe',
    'subscription',
  ],
  health_medical: [
    'pharmacy',
    'medplus',
    'netmeds',
    '1mg',
    'apollo',
    'hospital',
    'clinic',
    'doctor',
    'medicine',
    'medical',
    'health',
    'chemist',
  ],
  education: [
    'udemy',
    'coursera',
    'byju',
    'unacademy',
    'vedantu',
    'tuition',
    'school',
    'college',
    'course',
    'coaching',
  ],
  travel: [
    'irctc',
    'makemytrip',
    'cleartrip',
    'goibibo',
    'yatra',
    'hotels',
    'airline',
    'indigo',
    'air india',
    'flight',
    'train',
    'bus booking',
  ],
  housing_rent: [
    'rent',
    'housing',
    'society',
    'maintenance',
    'nobroker',
    'magicbricks',
    'nestaway',
  ],
  investments: [
    'groww',
    'zerodha',
    'upstox',
    'mutual fund',
    'sip',
    'mf',
    'stock',
    'equity',
    'ipo',
    'ppf',
    'nps',
  ],
  insurance: [
    'lic',
    'hdfc life',
    'icici pru',
    'sbi life',
    'bajaj allianz',
    'star health',
    'insurance',
    'premium',
  ],
  personal_care: ['salon', 'spa', 'barber', 'beauty', 'grooming', 'parlour'],
  gifts_donations: ['donation', 'charity', 'temple', 'gift', 'present', 'church', 'mosque'],
  salary: ['salary', 'sal credit', 'payroll', 'wages', 'stipend'],
  freelance: ['freelance', 'consulting', 'payment received', 'invoice paid'],
  business: ['business', 'vendor', 'client payment', 'b2b'],
  refund: ['refund', 'reversal', 'cashback refund', 'return'],
  cashback: ['cashback', 'rewards', 'bonus'],
  transfer_in: ['received from', 'transfer from', 'money received', 'credit from'],
  transfer_out: ['transferred to', 'transfer to', 'sent to', 'paid to'],
  other: [],
};

export function normalizeMerchantName(raw: string): string {
  if (!raw) return 'Unknown';

  const upper = raw
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, '')
    .trim();

  for (const [alias, normalized] of Object.entries(MERCHANT_ALIASES)) {
    if (upper.includes(alias)) return normalized;
  }

  return raw
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\s+/g, ' ')
    .trim();
}

export function inferCategory(merchantName: string, description?: string): CategoryId {
  const text = `${merchantName} ${description ?? ''}`.toLowerCase();

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => text.includes(kw))) {
      return category as CategoryId;
    }
  }

  return 'other';
}

export function normalizeAmount(raw: string): number {
  return parseFloat(raw.replace(/[^0-9.]/g, '')) || 0;
}

export function normalizeTransaction(parsed: ParsedTransaction): ParsedTransaction {
  return {
    ...parsed,
    merchantName: normalizeMerchantName(parsed.merchantName),
    categoryId: parsed.categoryId ?? inferCategory(parsed.merchantName),
    amount: Math.abs(parsed.amount),
    confidence: Math.min(1, Math.max(0, parsed.confidence)),
  };
}
