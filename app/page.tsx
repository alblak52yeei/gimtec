'use client';

import { useState, useEffect } from 'react';
import { Select } from './components/ui/Select';
import { Calendar } from './components/ui/Calendar';
import { NumberInput } from './components/ui/NumberInput';
import { ForecastImage } from './components/ui/ForecastImage';
import { MetricsChart } from './components/ui/MetricsChart';
import { Download, AlertCircle } from 'lucide-react';
import type { Model, GIMForecast, ModelMetrics } from './types';

export default function HomePage() {
  // Состояние приложения
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [forecasts, setForecasts] = useState<GIMForecast[]>([]);
  const [selectedForecast, setSelectedForecast] = useState<number | null>(null);
  const [mapNumber, setMapNumber] = useState<number>(1);
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log("FRR", forecasts);
  const fetchForecasts = async (modelCode: string) => {
    try {
      const response = await fetch(`/api/forecasts/${modelCode}`);
      const data: GIMForecast[] = await response.json();
      setForecasts(data);
      
      // Автовыбор первого доступного прогноза
      if (data.length > 0) {
        setSelectedForecast(data[0].id);
      }
    } catch (error) {
      console.error('Ошибка загрузки прогнозов:', error);
    }
  };

  const fetchMetrics = async (modelCode: string) => {
    try {
      const response = await fetch(`/api/metrics/${modelCode}`);
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Ошибка загрузки метрик:', error);
    }
  };

  // Загрузка моделей при монтировании компонента
  useEffect(() => {
    const loadModels = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log('Загружаем модели...')
        
        const response = await fetch('/api/models')
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `HTTP ${response.status}`)
        }
        
        const data: Model[] = await response.json()
        console.log('Модели загружены:', data)
        
        if (!data || data.length === 0) {
          throw new Error('Список моделей пуст')
        }
        
        setModels(data)
        
        // Автоматически выбираем первую модель
        const firstModel = data[0]
        setSelectedModel(firstModel.code)
        
        // Загружаем прогнозы для первой модели
        await fetchForecasts(firstModel.code)
        
      } catch (err: any) {
        console.error('Ошибка загрузки моделей:', err)
        setError(err.message || 'Ошибка загрузки моделей')
      } finally {
        setLoading(false)
      }
    }

    loadModels()
  }, [])

  // Загрузка прогнозов при выборе модели
  useEffect(() => {
    if (selectedModel) {
      fetchForecasts(selectedModel);
      fetchMetrics(selectedModel);
    }
  }, [selectedModel]);

  // Функция скачивания NPZ файла
  const downloadNpzFile = () => {
    if (selectedForecast) {
      const url = `/api/forecasts/data/${selectedForecast}`;
      window.open(url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Загрузка приложения...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-primary-800 mb-8">
            GIM Прогноз
          </h1>
          
          {/* Статус подключения */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-blue-800">Подключение к серверу...</span>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <div>
                <p className="text-red-800 font-medium">Ошибка подключения</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
                <p className="text-red-600 text-sm">
                  Проверьте доступность API сервера по адресу: 10.0.6.178:8088
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-primary-800 mb-2">
            GIM Прогноз
          </h1>
          <p className="text-gray-600">
            Интерфейс для просмотра прогнозов глобальных ионосферных карт
          </p>
        </header>

        {/* Основной контент */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Левая колонка: Управление */}
          <div className="space-y-6">
            {/* Выбор модели */}
            <Select
              label="Модель"
              placeholder="Выберите модель"
              options={models.map(m => ({ value: m.code, label: m.name }))}
              value={selectedModel}
              onChange={setSelectedModel}
            />

            {/* Выбор прогноза */}
            {forecasts.length > 0 && (
              <Select
                label="Дата прогноза"
                placeholder="Выберите прогноз"
                options={forecasts.map(f => ({ 
                  value: f.id.toString(), 
                  label: new Date(f.forecast_start_date).toLocaleDateString('ru', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })
                }))}
                value={selectedForecast?.toString() || ''}
                onChange={(value) => setSelectedForecast(Number(value))}
              />
            )}

            {/* Номер карты */}
            <NumberInput
              label="Номер карты"
              value={mapNumber}
              onChange={setMapNumber}
              min={1}
              max={24}
            />

            {/* Кнопка скачивания */}
            <button
              onClick={downloadNpzFile}
              disabled={!selectedForecast}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Скачать NPZ файл
            </button>
          </div>

          {/* Центральная колонка: Изображение прогноза */}
          <div>
            {selectedForecast && (
              <ForecastImage
                forecastId={selectedForecast.toString()}
                mapNumber={mapNumber}
              />
            )}
          </div>

          {/* Правая колонка: Метрики */}
          <div className="space-y-6">
            {metrics && (
              <>
                <MetricsChart metrics={metrics} title="MAE" />
                <MetricsChart metrics={metrics} title="MAPE" />
                <MetricsChart metrics={metrics} title="RMSE" />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 