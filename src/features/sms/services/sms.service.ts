import { Platform } from 'react-native';

import type { RawSms } from '@/types';
import { TransactionsRepository } from '@infra/firebase/firestore/transactions.repository';
import { storage, StorageKeys } from '@infra/storage/mmkv';

import { smsEngine } from '../engine/sms-engine';

interface SmsReadResult {
  totalRead: number;
  parsed: number;
  created: number;
  duplicates: number;
  errors: number;
}

export class SmsService {
  async readAndProcessSms(userId: string): Promise<SmsReadResult> {
    if (Platform.OS !== 'android') {
      return { totalRead: 0, parsed: 0, created: 0, duplicates: 0, errors: 0 };
    }

    const NativeSmsModule = await this.getNativeSmsModule();
    if (!NativeSmsModule) {
      return { totalRead: 0, parsed: 0, created: 0, duplicates: 0, errors: 0 };
    }

    const lastProcessedId = storage.getString(StorageKeys.LAST_SMS_PROCESSED_ID);
    const smsList: RawSms[] = await NativeSmsModule.getSmsMessages({
      maxCount: 500,
      afterId: lastProcessedId ?? undefined,
    });

    if (!smsList.length) {
      return { totalRead: 0, parsed: 0, created: 0, duplicates: 0, errors: 0 };
    }

    const repo = new TransactionsRepository(userId);

    // Get existing reference IDs to avoid duplicates
    const result = smsEngine.processSmsList(smsList);
    const created: string[] = [];
    let errors = 0;

    for (const parseResult of result.successful) {
      const txData = smsEngine.resultToTransaction(parseResult, userId);
      if (!txData) continue;

      try {
        // Check for duplicate by reference ID
        if (txData.referenceId) {
          const isDuplicate = await repo.checkDuplicate(txData.referenceId);
          if (isDuplicate) continue;
        }

        const tx = await repo.create(txData);
        created.push(tx.id);
      } catch {
        errors++;
      }
    }

    // Save last processed SMS ID
    if (smsList[0]) {
      storage.setString(StorageKeys.LAST_SMS_PROCESSED_ID, smsList[0].id);
    }

    return {
      totalRead: smsList.length,
      parsed: result.successful.length,
      created: created.length,
      duplicates: result.duplicates.length,
      errors,
    };
  }

  private async getNativeSmsModule() {
    try {
      // Dynamically import to avoid crashing on iOS
      // eslint-disable-next-line import/no-unresolved
      const module = await import('@/native/SmsReader');
      return module.default;
    } catch {
      return null;
    }
  }
}

export const smsService = new SmsService();
