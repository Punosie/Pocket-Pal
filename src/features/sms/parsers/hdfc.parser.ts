import type { BankParser, ParsedTransaction, RawSms } from '@/types';

import { normalizeAmount, normalizeMerchantName } from '../engine/normalizer';

const DEBIT_PATTERN =
  /(?:Rs\.?|INR)\s*([\d,]+\.?\d*)\s*(?:debited|deducted|spent|paid|withdrawn)\s*(?:from|via|on)?\s*(?:A\/c|Acct|account)?\s*(?:XX|x{2,})?(\d{4})?/i;

const CREDIT_PATTERN =
  /(?:Rs\.?|INR)\s*([\d,]+\.?\d*)\s*(?:credited|received|deposited)\s*(?:to|in)?/i;

const MERCHANT_PATTERNS = [
  /(?:at|to|for)\s+([A-Za-z0-9\s&.-]+?)(?:\s+on|\s+Ref|\s+UPI|\s+Txn|\.)/i,
  /Info:\s*([A-Za-z0-9\s&.-]+?)(?:\s+\d|\.|$)/i,
];

const BALANCE_PATTERN =
  /(?:Avl\.?\s*Bal(?:ance)?|Available\s+balance)[\s:]*(?:Rs\.?|INR)?\s*([\d,]+\.?\d*)/i;
const REFERENCE_PATTERN =
  /(?:Ref(?:\.?\s*(?:No\.?)?|erence(?:\s+No\.?)?))\s*[:.-]?\s*([A-Z0-9]{6,20})/i;
const UPI_PATTERN = /(?:UPI|VPA)\s*:?\s*([a-zA-Z0-9._-]+@[a-zA-Z]+)/i;

export class HdfcParser implements BankParser {
  name = 'HDFC Bank';
  bankCode = 'HDFC';
  bankName = 'HDFC Bank';
  senderPatterns = [/^HDFC/, /HDFCBK/, /^AD-HDFC/, /^BW-HDFC/, /^VM-HDFC/];

  parse(sms: RawSms): ParsedTransaction | null {
    const body = sms.body;

    const debitMatch = DEBIT_PATTERN.exec(body);
    const creditMatch = CREDIT_PATTERN.exec(body);

    if (!debitMatch && !creditMatch) return null;

    const isDebit = !!debitMatch;
    const amountRaw = isDebit ? debitMatch![1] : creditMatch![1];
    const amount = normalizeAmount(amountRaw);

    if (!amount || amount <= 0) return null;

    // Extract merchant
    let merchantName = 'HDFC Bank';
    for (const pattern of MERCHANT_PATTERNS) {
      const match = pattern.exec(body);
      if (match?.[1]) {
        merchantName = normalizeMerchantName(match[1].trim());
        break;
      }
    }

    // Extract masked account
    const accountMatch = /(?:A\/c|Acct|account)\s*(?:XX|x{2,})?(\d{4})/i.exec(body);
    const accountMasked = accountMatch ? `XXXX${accountMatch[1]}` : undefined;

    // Extract card if credit card
    const cardMatch = /(?:Card|card)\s*(?:XX|x{2,})?(\d{4})/i.exec(body);
    const cardMasked = cardMatch ? `XXXX${cardMatch[1]}` : undefined;

    // Extract balance
    const balanceMatch = BALANCE_PATTERN.exec(body);
    const balance = balanceMatch ? normalizeAmount(balanceMatch[1]) : undefined;

    // Extract reference
    const refMatch = REFERENCE_PATTERN.exec(body);
    const referenceId = refMatch?.[1];

    // Extract UPI
    const upiMatch = UPI_PATTERN.exec(body);
    const upiId = upiMatch?.[1];

    // Determine payment method
    let paymentMethod: ParsedTransaction['paymentMethod'] = 'net_banking';
    if (upiId) paymentMethod = 'upi';
    else if (cardMasked)
      paymentMethod = body.toLowerCase().includes('credit') ? 'card_credit' : 'card_debit';

    return {
      amount,
      type: isDebit ? 'debit' : 'credit',
      merchantName,
      bankName: this.bankName,
      bankCode: this.bankCode,
      accountMasked,
      cardMasked,
      upiId,
      referenceId,
      balance,
      paymentMethod,
      date: new Date(sms.date),
      rawBody: body,
      parserName: this.name,
      confidence: 0.92,
    };
  }
}

export const hdfcParser = new HdfcParser();
