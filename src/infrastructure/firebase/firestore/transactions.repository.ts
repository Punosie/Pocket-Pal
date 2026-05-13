import type { Transaction, TransactionFilter } from '@/types';

import { collections, db, serverTimestamp } from '../config';

import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

type DocSnapshot = FirebaseFirestoreTypes.DocumentSnapshot;
type QuerySnapshot = FirebaseFirestoreTypes.QuerySnapshot;

export const transactionConverter = {
  toFirestore(tx: Omit<Transaction, 'id'>) {
    return {
      ...tx,
      date: tx.date instanceof Date ? tx.date : new Date(tx.date),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
  },
  fromFirestore(snapshot: DocSnapshot): Transaction {
    const data = snapshot.data()!;
    return {
      ...(data as Omit<Transaction, 'id' | 'date' | 'createdAt' | 'updatedAt'>),
      id: snapshot.id,
      date: (data.date as FirebaseFirestoreTypes.Timestamp)?.toDate() ?? new Date(),
      createdAt: (data.createdAt as FirebaseFirestoreTypes.Timestamp)?.toDate() ?? new Date(),
      updatedAt: (data.updatedAt as FirebaseFirestoreTypes.Timestamp)?.toDate() ?? new Date(),
    };
  },
};

export class TransactionsRepository {
  private uid: string;

  constructor(uid: string) {
    this.uid = uid;
  }

  private get ref() {
    return collections.transactions(this.uid);
  }

  async create(
    transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>,
  ): Promise<Transaction> {
    const payload = {
      ...transaction,
      userId: this.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await this.ref.add(payload);
    const doc = await docRef.get();
    return transactionConverter.fromFirestore(doc);
  }

  async update(id: string, updates: Partial<Transaction>): Promise<void> {
    await this.ref.doc(id).update({
      ...updates,
      updatedAt: serverTimestamp(),
      isManuallyEdited: true,
    });
  }

  async delete(id: string): Promise<void> {
    await this.ref.doc(id).delete();
  }

  async getById(id: string): Promise<Transaction | null> {
    const doc = await this.ref.doc(id).get();
    if (!doc.exists) return null;
    return transactionConverter.fromFirestore(doc);
  }

  async bulkCreate(
    transactions: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[],
  ): Promise<void> {
    const BATCH_SIZE = 500;

    for (let i = 0; i < transactions.length; i += BATCH_SIZE) {
      const batch = db.batch();
      const chunk = transactions.slice(i, i + BATCH_SIZE);

      for (const tx of chunk) {
        const docRef = this.ref.doc();
        batch.set(docRef, {
          ...tx,
          userId: this.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      await batch.commit();
    }
  }

  buildQuery(filter: TransactionFilter) {
    let query: FirebaseFirestoreTypes.Query = this.ref.orderBy('date', 'desc');

    if (filter.startDate) {
      query = query.where('date', '>=', filter.startDate);
    }
    if (filter.endDate) {
      query = query.where('date', '<=', filter.endDate);
    }
    if (filter.types?.length) {
      query = query.where('type', 'in', filter.types);
    }
    if (filter.categoryIds?.length) {
      query = query.where('categoryId', 'in', filter.categoryIds);
    }
    if (filter.paymentMethods?.length) {
      query = query.where('paymentMethod', 'in', filter.paymentMethods);
    }
    if (filter.isRecurring !== undefined) {
      query = query.where('isRecurring', '==', filter.isRecurring);
    }
    if (filter.minAmount !== undefined) {
      query = query.where('amount', '>=', filter.minAmount);
    }
    if (filter.maxAmount !== undefined) {
      query = query.where('amount', '<=', filter.maxAmount);
    }

    return query;
  }

  async fetchPage(
    filter: TransactionFilter,
    pageSize: number,
    lastDoc?: DocSnapshot,
  ): Promise<{ transactions: Transaction[]; lastDoc: DocSnapshot | null; hasMore: boolean }> {
    let query = this.buildQuery(filter).limit(pageSize + 1);

    if (lastDoc) {
      query = query.startAfter(lastDoc);
    }

    const snapshot: QuerySnapshot = await query.get();
    const hasMore = snapshot.docs.length > pageSize;
    const docs = hasMore ? snapshot.docs.slice(0, pageSize) : snapshot.docs;

    return {
      transactions: docs.map((d) => transactionConverter.fromFirestore(d)),
      lastDoc: docs[docs.length - 1] ?? null,
      hasMore,
    };
  }

  subscribeToRecent(limit: number, onUpdate: (transactions: Transaction[]) => void) {
    return this.ref
      .orderBy('date', 'desc')
      .limit(limit)
      .onSnapshot((snapshot) => {
        const transactions = snapshot.docs.map((d) => transactionConverter.fromFirestore(d));
        onUpdate(transactions);
      });
  }

  async checkDuplicate(referenceId: string): Promise<boolean> {
    const snapshot = await this.ref.where('referenceId', '==', referenceId).limit(1).get();
    return !snapshot.empty;
  }

  async getMonthlySummary(year: number, month: number) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    const snapshot = await this.ref.where('date', '>=', start).where('date', '<=', end).get();

    let totalIncome = 0;
    let totalExpense = 0;

    for (const doc of snapshot.docs) {
      const data = doc.data() as Transaction;
      if (data.type === 'credit') totalIncome += data.amount;
      else if (data.type === 'debit') totalExpense += data.amount;
    }

    return { totalIncome, totalExpense, count: snapshot.size };
  }
}
