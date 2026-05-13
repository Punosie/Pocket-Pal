import * as admin from 'firebase-admin';

admin.initializeApp();

export { onUserCreated, onUserDeleted } from './auth/auth.functions';
export {
  computeMonthlyAnalytics,
  onTransactionWritten,
  scheduledAnalytics,
} from './analytics/analytics.functions';
export {
  detectSubscriptions,
  generateInsights,
  scheduledInsights,
} from './insights/insights.functions';
export {
  sendDailyLimitNotification,
  sendMonthlyReport,
  scheduledNotifications,
} from './notifications/notifications.functions';
