import type { RawSms, SmsParseResult, Transaction } from '@/types';

import { ALL_PARSERS } from '../parsers';
import { normalizeTransaction } from './normalizer';
import { parserRegistry } from './parser-registry';

// Bootstrap registry once
ALL_PARSERS.forEach((p) => parserRegistry.register(p));

export interface SmsEngineResult {
  parsed: SmsParseResult[];
  successful: SmsParseResult[];
  failed: SmsParseResult[];
  skipped: SmsParseResult[];
  duplicates: string[];
}

export class SmsEngine {
  private processedIds = new Set<string>();

  processSmsList(smsList: RawSms[], existingRefIds: Set<string> = new Set()): SmsEngineResult {
    const parsed: SmsParseResult[] = [];
    const successful: SmsParseResult[] = [];
    const failed: SmsParseResult[] = [];
    const skipped: SmsParseResult[] = [];
    const duplicates: string[] = [];

    for (const sms of smsList) {
      if (this.processedIds.has(sms.id)) {
        skipped.push({ success: false, error: 'already_processed', rawSms: sms });
        continue;
      }

      const result = parserRegistry.parse(sms);

      if (result.success && result.transaction) {
        result.transaction = normalizeTransaction(result.transaction);

        if (result.transaction.referenceId && existingRefIds.has(result.transaction.referenceId)) {
          duplicates.push(result.transaction.referenceId);
          skipped.push({ ...result, error: 'duplicate_reference' });
          continue;
        }

        this.processedIds.add(sms.id);
        successful.push(result);
      } else {
        failed.push(result);
      }

      parsed.push(result);
    }

    return { parsed, successful, failed, skipped, duplicates };
  }

  resultToTransaction(
    result: SmsParseResult,
    userId: string,
  ): Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'> | null {
    if (!result.success || !result.transaction) return null;

    const tx = result.transaction;

    return {
      userId,
      amount: tx.amount,
      type: tx.type,
      status: 'completed',
      categoryId: tx.categoryId ?? 'other',
      merchantName: tx.merchantName,
      source: 'sms',
      paymentMethod: tx.paymentMethod,
      bankAccount: {
        bankName: tx.bankName,
        bankCode: tx.bankCode,
        maskedNumber: tx.accountMasked ?? tx.cardMasked,
        upiId: tx.upiId,
      },
      referenceId: tx.referenceId,
      balance: tx.balance,
      smsId: result.rawSms.id,
      rawSmsBody: tx.rawBody,
      date: tx.date ?? new Date(result.rawSms.date),
      syncedAt: new Date(),
    };
  }

  clearProcessed(): void {
    this.processedIds.clear();
  }
}

export const smsEngine = new SmsEngine();
