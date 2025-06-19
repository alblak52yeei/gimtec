import { APP_CONFIG } from '../constants';

export function getDateRange(daysBack: number = APP_CONFIG.DEFAULT_METRICS_DAYS) {
  const today = new Date();
  const pastDate = new Date();
  pastDate.setDate(today.getDate() - daysBack);
  
  const dateFrom = pastDate.toISOString().split('T')[0];
  const dateTo = today.toISOString().split('T')[0];
  
  return { dateFrom, dateTo };
}