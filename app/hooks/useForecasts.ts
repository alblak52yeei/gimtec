import { useState, useEffect } from 'react';
import { forecastsApi } from '../services/api';
import type { GIMForecast } from '../types';

export function useForecasts(modelCode: string) {
  const [forecasts, setForecasts] = useState<GIMForecast[]>([]);
  const [selectedForecast, setSelectedForecast] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!modelCode) return;
    
    const fetchForecasts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await forecastsApi.getForecasts(modelCode);
        setForecasts(data);
        
        // Автовыбор первого доступного прогноза
        if (data.length > 0) {
          setSelectedForecast(data[0].id);
        } else {
          setSelectedForecast(null);
        }
      } catch (err: any) {
        console.error('Ошибка загрузки прогнозов:', err);
        setError(err.message || 'Ошибка загрузки прогнозов');
        setForecasts([]);
        setSelectedForecast(null);
      } finally {
        setLoading(false);
      }
    };

    fetchForecasts();
  }, [modelCode]);

  // Обработчик выбора прогноза по дате
  const selectForecastByDate = (dateString: string) => {
    const forecast = forecasts.find(f => f.forecast_start_date === dateString);
    if (forecast) {
      setSelectedForecast(forecast.id);
    }
  };

  return {
    forecasts,
    selectedForecast,
    setSelectedForecast,
    selectForecastByDate,
    loading,
    error
  };
} 