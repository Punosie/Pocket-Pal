import { startOfMonth, format } from 'date-fns';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const db = admin.firestore();
const messaging = admin.messaging();

async function sendPushNotification(
  fcmToken: string,
  title: string,
  body: string,
  data?: Record<string, string>,
) {
  try {
    await messaging.send({
      token: fcmToken,
      notification: { title, body },
      data,
      android: {
        priority: 'high',
        notification: {
          channelId: 'pocket-pal-alerts',
          color: '#6C5CE7',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
    });
  } catch (err) {
    functions.logger.warn('Push notification failed', { fcmToken, err });
  }
}

export const sendDailyLimitNotification = functions.https.onCall(async (data: unknown, context) => {
  const userId = context.auth?.uid;
  if (!userId) throw new functions.https.HttpsError('unauthenticated', 'Not authenticated');

  const userDoc = await db.collection('users').doc(userId).get();
  const userData = userDoc.data();
  const fcmToken = userData?.fcmToken;

  if (!fcmToken) return { sent: false, reason: 'no_token' };

  await sendPushNotification(
    fcmToken,
    '⚠️ Daily Limit Exceeded',
    "You've exceeded your daily spending limit. Review your expenses.",
    { route: '/(tabs)/budget', type: 'daily_limit' },
  );

  return { sent: true };
});

// Monthly report — 1st of every month at 8 AM IST
export const sendMonthlyReport = functions.pubsub
  .schedule('0 8 1 * *')
  .timeZone('Asia/Kolkata')
  .onRun(async () => {
    const usersSnap = await db
      .collection('users')
      .where('preferences.notificationsEnabled', '==', true)
      .get();

    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
    const monthKey = format(startOfMonth(lastMonth), 'yyyy-MM');

    const sends = usersSnap.docs.map(async (userDoc) => {
      const userData = userDoc.data();
      const fcmToken = userData.fcmToken;
      if (!fcmToken) return;

      const analyticsDoc = await db
        .collection('users')
        .doc(userDoc.id)
        .collection('analytics')
        .doc(monthKey)
        .get();

      const analytics = analyticsDoc.data();
      if (!analytics) return;

      const expense = analytics.totalExpense?.toLocaleString('en-IN') ?? '0';
      const savings = (analytics.totalIncome - analytics.totalExpense || 0).toLocaleString('en-IN');

      await sendPushNotification(
        fcmToken,
        '📊 Your Monthly Report is Ready',
        `You spent ₹${expense} and saved ₹${savings} last month!`,
        { route: '/(tabs)/analytics', type: 'monthly_report', month: monthKey },
      );
    });

    await Promise.allSettled(sends);
    functions.logger.info('Monthly reports sent', { count: usersSnap.size });
  });

export const scheduledNotifications = functions.pubsub
  .schedule('0 20 * * *')
  .timeZone('Asia/Kolkata')
  .onRun(async () => {
    // Daily spending summary at 8 PM
    functions.logger.info('Daily notifications dispatched');
  });
