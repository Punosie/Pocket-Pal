import type { BankParser, ParsedTransaction, RawSms } from '@/types';

import { normalizeAmount, normalizeMerchantName } from '../engine/normalizer';

export class IciciParser implements BankParser {
  name = 'ICICI Bank';
  bankCode = 'ICICI';
  bankName = 'ICICI Bank';
  senderPatterns = [/^ICICIB/, /^ICICI/, /^AD-ICICI/, /^BW-ICICI/];

  parse(sms: RawSms): ParsedTransaction | null {
    const body = sms.body;

    const debitMatch =
      /(?:Rs\.?|INR)\s*([\d,]+\.?\d*)\s*(?:debited|spent|withdrawn)/i.exec(body) ??
      /(?:debited|charged)\s+(?:for\s+)?(?:Rs\.?|INR)\s*([\d,]+\.?\d*)/i.exec(body);

    const creditMatch =
      /(?:Rs\.?|INR)\s*([\d,]+\.?\d*)\s*(?:credited|received)/i.exec(body) ??
      /(?:credited|deposited)\s+(?:with\s+)?(?:Rs\.?|INR)\s*([\d,]+\.?\d*)/i.exec(body);

    if (!debitMatch && !creditMatch) return null;

    const isDebit = !!debitMatch;
    const amountRaw = isDebit ? debitMatch![1] : creditMatch![1];
    const amount = normalizeAmount(amountRaw);

    if (!amount || amount <= 0) return null;

    // ICICI format: "ICICI Bank Acct XX1234: Rs.500 debited on 12-May-24; info: SWIGGY INDIA"
    const merchantMatch =
      /(?:info|Info|INFO|at|to|for)\s*:\s*([A-Za-z0-9\s&.-]+?)(?:\s*;|\.|$|\n)/i.exec(body);
    const merchantName = merchantMatch?.[1]
      ? normalizeMerchantName(merchantMatch[1].trim())
      : 'ICICI Bank';

    const accountMatch = /(?:Acct|A\/c|account)\s*(?:XX|x{2,})?(\d{4})/i.exec(body);
    const accountMasked = accountMatch ? `XXXX${accountMatch[1]}` : undefined;

    const cardMatch = /(?:Card|card)\s*(?:XX|x{2,})?(\d{4})/i.exec(body);
    const cardMasked = cardMatch ? `XXXX${cardMatch[1]}` : undefined;

    const refMatch = /(?:Ref\.?\s*No\.?|Transaction\s*ID)\s*[:.-]?\s*([A-Z0-9]{6,20})/i.exec(body);
    const referenceId = refMatch?.[1];

    const upiMatch = /UPI\s*:?\s*([a-zA-Z0-9._-]+@[a-zA-Z]+)/i.exec(body);
    const upiId = upiMatch?.[1];

    const balanceMatch =
      /(?:Avl\s*Bal|Avail|Available\s*Bal)\.?\s*(?:Rs\.?|INR)?\s*([\d,]+\.?\d*)/i.exec(body);
    const balance = balanceMatch ? normalizeAmount(balanceMatch[1]) : undefined;

    let paymentMethod: ParsedTransaction['paymentMethod'] = 'net_banking';
    if (upiId) paymentMethod = 'upi';
    else if (cardMasked) {
      paymentMethod = body.toLowerCase().includes('credit') ? 'card_credit' : 'card_debit';
    }

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
      confidence: 0.9,
    };
  }
}

export const iciciParser = new IciciParser();
