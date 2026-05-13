import { startOfMonth, endOfMonth, format } from 'date-fns';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const db = admin.firestore();

// Triggered on every transaction write — update running totals
export const onTransactionWritten = functions.firestore
  .document('users/{userId}/transactions/{txId}')
  .onWrite(async (change, context) => {
    const { userId } = context.params;
    const beforeData = change.before.data();
    const afterData = change.after.data();

    const now = new Date();
    const monthKey = format(now, 'yyyy-MM');
    const analyticsRef = db.collection('users').doc(userId).collection('analytics').doc(monthKey);

    const batch = db.batch();

    // Reverse previous transaction if it existed
    if (beforeData) {
      const delta = beforeData.type === 'credit' ? -beforeData.amount : beforeData.amount;
      batch.set(
        analyticsRef,
        {
          [beforeData.type === 'credit' ? 'totalIncome' : 'totalExpense']:
            admin.firestore.FieldValue.increment(-Math.abs(beforeData.amount)),
          transactionCount: admin.firestore.FieldValue.increment(-1),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
    }

    // Apply new transaction
    if (afterData) {
      batch.set(
        analyticsRef,
        {
          [afterData.type === 'credit' ? 'totalIncome' : 'totalExpense']:
            admin.firestore.FieldValue.increment(Math.abs(afterData.amount)),
          transactionCount: admin.firestore.FieldValue.increment(1),
          month: monthKey,
          userId,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
    }

    return batch.commit();
  });

// Scheduled full monthly analytics computation — runs 1st of every month at 00:05
export const scheduledAnalytics = functions.pubsub
  .schedule('5 0 1 * *')
  .timeZone('Asia/Kolkata')
  .onRun(async () => {
    const usersSnap = await db.collection('users').get();
    const computations = usersSnap.docs.map((userDoc) =>
      computeMonthlyAnalytics({ userId: userDoc.id }),
    );
    await Promise.allSettled(computations);
    functions.logger.info('Monthly analytics computed for all users');
  });

// Callable function — compute analytics for a specific month on demand
export const computeMonthlyAnalytics = functions.https.onCall(
  async (data: { userId?: string; year?: number; month?: number }, context) => {
    const userId = data.userId ?? context.auth?.uid;
    if (!userId) throw new functions.https.HttpsError('unauthenticated', 'Not authenticated');

    const now = new Date();
    const year = data.year ?? now.getFullYear();
    const month = data.month ?? now.getMonth() + 1;

    const start = startOfMonth(new Date(year, month - 1));
    const end = endOfMonth(new Date(year, month - 1));

    const txSnapshot = await db
      .collection('users')
      .doc(userId)
      .collection('transactions')
      .where('date', '>=', start)
      .where('date', '<=', end)
      .get();

    let totalIncome = 0;
    let totalExpense = 0;
    const categoryTotals: Record<string, number> = {};
    const merchantTotals: Record<string, number> = {};

    for (const doc of txSnapshot.docs) {
      const tx = doc.data();
      const amount = Number(tx.amount) || 0;

      if (tx.type === 'credit') {
        totalIncome += amount;
      } else if (tx.type === 'debit') {
        totalExpense += amount;
        categoryTotals[tx.categoryId] = (categoryTotals[tx.categoryId] || 0) + amount;
        const merchantKey = tx.merchantName?.toLowerCase() ?? 'unknown';
        merchantTotals[merchantKey] = (merchantTotals[merchantKey] || 0) + amount;
      }
    }

    const monthKey = format(start, 'yyyy-MM');
    const analyticsData = {
      userId,
      month: monthKey,
      year,
      monthNumber: month,
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
      savingsRate: totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0,
      transactionCount: txSnapshot.size,
      categoryBreakdown: categoryTotals,
      topMerchants: merchantTotals,
      computedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db
      .collection('users')
      .doc(userId)
      .collection('analytics')
      .doc(monthKey)
      .set(analyticsData, { merge: true });

    return analyticsData;
  },
);
