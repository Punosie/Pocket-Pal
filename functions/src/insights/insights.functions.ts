import { subDays, differenceInDays } from 'date-fns';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const db = admin.firestore();

// Detect recurring subscriptions from transaction history
export const detectSubscriptions = functions.https.onCall(async (data: unknown, context) => {
  const userId = context.auth?.uid;
  if (!userId) throw new functions.https.HttpsError('unauthenticated', 'Not authenticated');

  const ninetyDaysAgo = subDays(new Date(), 90);
  const txSnapshot = await db
    .collection('users')
    .doc(userId)
    .collection('transactions')
    .where('date', '>=', ninetyDaysAgo)
    .where('type', '==', 'debit')
    .orderBy('date', 'desc')
    .get();

  // Group by merchant
  const merchantGroups: Record<string, admin.firestore.DocumentData[]> = {};
  for (const doc of txSnapshot.docs) {
    const tx = doc.data();
    const key = tx.merchantName?.toLowerCase() ?? 'unknown';
    if (!merchantGroups[key]) merchantGroups[key] = [];
    merchantGroups[key].push(tx);
  }

  const subscriptions: admin.firestore.DocumentData[] = [];

  for (const [, txs] of Object.entries(merchantGroups)) {
    if (txs.length < 2) continue;

    // Check if amounts are consistent
    const amounts = txs.map((t) => Number(t.amount));
    const avgAmount = amounts.reduce((s, a) => s + a, 0) / amounts.length;
    const isConsistentAmount = amounts.every((a) => Math.abs(a - avgAmount) / avgAmount < 0.1);

    if (!isConsistentAmount) continue;

    // Check if intervals are regular
    const dates = txs.map((t) => (t.date as admin.firestore.Timestamp).toDate());
    dates.sort((a, b) => a.getTime() - b.getTime());

    const intervals: number[] = [];
    for (let i = 1; i < dates.length; i++) {
      intervals.push(differenceInDays(dates[i], dates[i - 1]));
    }

    const avgInterval = intervals.reduce((s, i) => s + i, 0) / intervals.length;
    const isRegularInterval = intervals.every((interval) => Math.abs(interval - avgInterval) <= 5);

    if (!isRegularInterval) continue;

    const frequency =
      avgInterval <= 10
        ? 'weekly'
        : avgInterval <= 35
          ? 'monthly'
          : avgInterval <= 100
            ? 'quarterly'
            : 'yearly';

    subscriptions.push({
      merchantName: txs[0].merchantName,
      amount: avgAmount,
      frequency,
      categoryId: txs[0].categoryId,
      confidence: Math.min(0.95, 0.6 + txs.length * 0.08),
      transactionIds: txs.map((t) => t.id),
      detectedAt: admin.firestore.FieldValue.serverTimestamp(),
      isActive: true,
      userId,
    });
  }

  // Upsert subscriptions
  const batch = db.batch();
  for (const sub of subscriptions) {
    const docRef = db
      .collection('users')
      .doc(userId)
      .collection('subscriptions')
      .doc(`${sub.merchantName as string}-${sub.frequency as string}`);
    batch.set(docRef, sub, { merge: true });
  }
  await batch.commit();

  return { detected: subscriptions.length, subscriptions };
});

async function generateInsightsForUser(userId: string) {
  const thirtyDaysAgo = subDays(new Date(), 30);
  const txSnapshot = await db
    .collection('users')
    .doc(userId)
    .collection('transactions')
    .where('date', '>=', thirtyDaysAgo)
    .get();

  const insights: admin.firestore.DocumentData[] = [];

  let totalExpense = 0;
  const categoryTotals: Record<string, number> = {};

  for (const doc of txSnapshot.docs) {
    const tx = doc.data();
    if (tx.type === 'debit') {
      totalExpense += Number(tx.amount) || 0;
      categoryTotals[tx.categoryId] = (categoryTotals[tx.categoryId] || 0) + Number(tx.amount);
    }
  }

  const topCategory = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a)[0];

  if (topCategory) {
    const [categoryId, amount] = topCategory;
    const percentage = (amount / totalExpense) * 100;

    if (percentage > 30) {
      insights.push({
        userId,
        type: 'recommendation',
        title: `High ${categoryId.replace('_', ' ')} spending`,
        description: `You've spent ${percentage.toFixed(0)}% of your budget on ${categoryId.replace('_', ' ')} this month. Consider setting a category budget.`,
        severity: percentage > 50 ? 'warning' : 'info',
        actionable: true,
        action: { label: 'Set Budget', route: '/add-budget', params: { categoryId } },
        isRead: false,
        isDismissed: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
  }

  const batch = db.batch();
  for (const insight of insights) {
    const docRef = db.collection('users').doc(userId).collection('insights').doc();
    batch.set(docRef, insight);
  }
  await batch.commit();

  return { generated: insights.length };
}

// Callable — generate insights for the authenticated user
export const generateInsights = functions.https.onCall(async (_data: unknown, context) => {
  const userId = context.auth?.uid;
  if (!userId) throw new functions.https.HttpsError('unauthenticated', 'Not authenticated');
  return generateInsightsForUser(userId);
});

// Run insights generation daily at 9 AM IST
export const scheduledInsights = functions.pubsub
  .schedule('0 9 * * *')
  .timeZone('Asia/Kolkata')
  .onRun(async () => {
    const usersSnap = await db.collection('users').get();
    const jobs = usersSnap.docs.map((doc) => generateInsightsForUser(doc.id));
    await Promise.allSettled(jobs);
    functions.logger.info('Insights generated for all users');
  });
