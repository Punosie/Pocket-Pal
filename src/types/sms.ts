import type { CategoryId, PaymentMethod, TransactionType } from './transaction';

export interface RawSms {
  id: string;
  address: string;
  body: string;
  date: number;
  type: number;
}

export interface ParsedTransaction {
  amount: number;
  type: TransactionType;
  merchantName: string;
  bankName?: string;
  bankCode?: string;
  accountMasked?: string;
  cardMasked?: string;
  upiId?: string;
  referenceId?: string;
  balance?: number;
  paymentMethod?: PaymentMethod;
  categoryId?: CategoryId;
  date?: Date;
  rawBody: string;
  parserName: string;
  confidence: number;
}

export interface SmsParseResult {
  success: boolean;
  transaction?: ParsedTransaction;
  error?: string;
  rawSms: RawSms;
}

export interface BankParser {
  name: string;
  bankCode: string;
  bankName: string;
  senderPatterns: RegExp[];
  parse(sms: RawSms): ParsedTransaction | null;
}

export interface ParserRegistry {
  register(parser: BankParser): void;
  findParser(sender: string): BankParser | null;
  parseAll(smsList: RawSms[]): SmsParseResult[];
}

export type SmsProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'skipped';

export interface SmsProcessingRecord {
  smsId: string;
  status: SmsProcessingStatus;
  transactionId?: string;
  error?: string;
  processedAt?: Date;
}
