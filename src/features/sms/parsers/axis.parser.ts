import type { BankParser, ParsedTransaction, RawSms } from '@/types';

import { normalizeAmount, normalizeMerchantName } from '../engine/normalizer';

export class AxisParser implements BankParser {
  name = 'Axis Bank';
  bankCode = 'AXIS';
  bankName = 'Axis Bank';
  senderPatterns = [/^AXISBK/, /^AXIBNK/, /^AD-AXIS/, /^AXIS/];

  parse(sms: RawSms): ParsedTransaction | null {
    const body = sms.body;

    const debitMatch =
      /(?:Rs\.?|INR|₹)\s*([\d,]+\.?\d*)\s*(?:debited|deducted|withdrawn|spent)/i.exec(body) ??
      /(?:debited|deducted)\s+(?:Rs\.?|INR|₹)\s*([\d,]+\.?\d*)/i.exec(body);

    const creditMatch = /(?:Rs\.?|INR|₹)\s*([\d,]+\.?\d*)\s*(?:credited|deposited|received)/i.exec(
      body,
    );

    if (!debitMatch && !creditMatch) return null;

    const isDebit = !!debitMatch;
    const amountRaw = isDebit ? debitMatch![1] : creditMatch![1];
    const amount = normalizeAmount(amountRaw);

    if (!amount || amount <= 0) return null;

    const merchantMatch =
      /(?:at|to|for|towards)\s+([A-Za-z0-9\s&.-]+?)(?:\s+on\s+\d|\s+Ref|\.|$|\n)/i.exec(body);
    const merchantName = merchantMatch?.[1]
      ? normalizeMerchantName(merchantMatch[1].trim())
      : 'Axis Bank';

    const accountMatch = /(?:A\/c|Acct|Ac)[\s*]*(?:XX|x{2,}|\*+)?(\d{4})/i.exec(body);
    const accountMasked = accountMatch ? `XXXX${accountMatch[1]}` : undefined;

    const refMatch = /(?:Txn\s*ID|Ref\.?\s*No\.?)[\s:]*([A-Z0-9]{6,20})/i.exec(body);
    const referenceId = refMatch?.[1];

    const upiMatch = /([a-zA-Z0-9._-]+@[a-zA-Z]+)/i.exec(body);
    const upiId = upiMatch?.[1];

    const balanceMatch = /(?:Bal|Balance)\s*(?:Rs\.?|INR|₹)?\s*([\d,]+\.?\d*)/i.exec(body);
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
      confidence: 0.89,
    };
  }
}

export const axisParser = new AxisParser();
