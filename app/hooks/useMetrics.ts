import { useState, useEffect } from 'react';
import { metricsApi } from '../services/api';
import { APP_CONFIG } from '../constants';
import type { ModelMetrics } from '../types';

export function useMetrics(modelName: string) {
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!modelName) return;
    
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Вычисляем диапазон дат (последние 30 дней)
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - APP_CONFIG.DEFAULT_METRICS_DAYS);
        
        const dateFrom = thirtyDaysAgo.toISOString().split('T')[0];
        const dateTo = today.toISOString().split('T')[0];
        
        const data = await metricsApi.getMetrics(modelName, dateFrom, dateTo);
        setMetrics(data);
      } catch (err: any) {
        console.error('Ошибка загрузки метрик:', err);
        setError(err.message || 'Ошибка загрузки метрик');
        setMetrics(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [modelName]);

  return {
    metrics,
    loading,
    error
  };
} 