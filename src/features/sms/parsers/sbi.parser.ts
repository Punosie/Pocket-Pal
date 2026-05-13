import type { BankParser, ParsedTransaction, RawSms } from '@/types';

import { normalizeAmount, normalizeMerchantName } from '../engine/normalizer';

export class SbiParser implements BankParser {
  name = 'State Bank of India';
  bankCode = 'SBI';
  bankName = 'State Bank of India';
  senderPatterns = [/^SBIINB/, /^SBISMS/, /^AD-SBI/, /^SBI/];

  parse(sms: RawSms): ParsedTransaction | null {
    const body = sms.body;

    // SBI format: "Dear UPI user A/C X1234 debited by 500.00 on date 11-05-24 trf to MERCHANT Refno 123456"
    const debitMatch =
      /(?:debited|withdrawn|spent)\s+by\s+(?:Rs\.?|INR)?\s*([\d,]+\.?\d*)/i.exec(body) ??
      /(?:Rs\.?|INR)\s*([\d,]+\.?\d*)\s*(?:debited|deducted)/i.exec(body);

    const creditMatch =
      /(?:credited|deposited|received)\s+(?:by|with|of)?\s+(?:Rs\.?|INR)?\s*([\d,]+\.?\d*)/i.exec(
        body,
      ) ?? /(?:Rs\.?|INR)\s*([\d,]+\.?\d*)\s*(?:credited|deposited)/i.exec(body);

    if (!debitMatch && !creditMatch) return null;

    const isDebit = !!debitMatch;
    const amountRaw = isDebit ? debitMatch![1] : creditMatch![1];
    const amount = normalizeAmount(amountRaw);

    if (!amount || amount <= 0) return null;

    const merchantMatch =
      /(?:trf\s+to|to|at|for)\s+([A-Za-z0-9\s&.-]+?)(?:\s+Ref|\s+on\s+\d|\.|\n|$)/i.exec(body);
    const merchantName = merchantMatch?.[1]
      ? normalizeMerchantName(merchantMatch[1].trim())
      : 'SBI';

    const accountMatch = /A\/C\s*[xX*]+(\d{4})/i.exec(body);
    const accountMasked = accountMatch ? `XXXX${accountMatch[1]}` : undefined;

    const refMatch = /Ref(?:no|\.?\s*No\.?)?\s*[:-]?\s*([0-9]{6,20})/i.exec(body);
    const referenceId = refMatch?.[1];

    const upiMatch = /UPI\s*:?\s*([a-zA-Z0-9._-]+@[a-zA-Z]+)/i.exec(body);
    const upiId = upiMatch?.[1];

    const balanceMatch =
      /(?:Avl\s+Bal|available\s+balance|bal)[\s:]*(?:Rs\.?|INR)?\s*([\d,]+\.?\d*)/i.exec(body);
    const balance = balanceMatch ? normalizeAmount(balanceMatch[1]) : undefined;

    return {
      amount,
      type: isDebit ? 'debit' : 'credit',
      merchantName,
      bankName: this.bankName,
      bankCode: this.bankCode,
      accountMasked,
      upiId,
      referenceId,
      balance,
      paymentMethod: upiId ? 'upi' : 'net_banking',
      date: new Date(sms.date),
      rawBody: body,
      parserName: this.name,
      confidence: 0.88,
    };
  }
}

export const sbiParser = new SbiParser();
