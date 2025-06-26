import { useState, useEffect } from 'react';
import { metricsApi } from '../services/api';
import { APP_CONFIG } from '../constants';
import type { ModelMetrics, GIMForecast } from '../types';

export function useMetrics(modelName: string, selectedForecast: number | null, forecasts: GIMForecast[]) {
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!modelName || !selectedForecast || !forecasts.length) return;
    
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Находим выбранный прогноз
        const forecast = forecasts.find(f => f.id === selectedForecast);
        if (!forecast) {
          setError('Выбранный прогноз не найден');
          return;
        }
        
        // Используем дату выбранного прогноза как опорную точку
        const forecastDate = new Date(forecast.forecast_start_date);
        
        // Вычисляем диапазон дат вокруг выбранной даты 
        // Показываем 15 дней назад и 15 дней вперед от выбранной даты
        const daysBack = Math.floor(APP_CONFIG.DEFAULT_METRICS_DAYS / 2);
        const daysForward = Math.ceil(APP_CONFIG.DEFAULT_METRICS_DAYS / 2);
        
        const dateFrom = new Date(forecastDate);
        dateFrom.setDate(forecastDate.getDate() - daysBack);
        
        const dateTo = new Date(forecastDate);
        dateTo.setDate(forecastDate.getDate() + daysForward);
        
        const dateFromStr = dateFrom.toISOString().split('T')[0];
        const dateToStr = dateTo.toISOString().split('T')[0];
        
        console.log(`Загружаем метрики для ${modelName} от ${dateFromStr} до ${dateToStr} (центр: ${forecast.forecast_start_date})`);
        
        const data = await metricsApi.getMetrics(modelName, dateFromStr, dateToStr);
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
  }, [modelName, selectedForecast, forecasts]);

  return {
    metrics,
    loading,
    error
  };
} 