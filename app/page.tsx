'use client';

import { useState } from 'react';
import { API_ENDPOINTS, DEFAULT_MAP_NUMBER } from './constants';
import { useModels, useForecasts, useMetrics } from './hooks';
import { ForecastControls, MetricsSection, ErrorDisplay, LoadingSpinner, PageHeader } from './components';
import { ForecastImage } from './components/ui/ForecastImage';
import { ERROR_MESSAGES } from './constants';

export default function HomePage() {
  // Хуки и состояние для работы с моделями
  const { models, selectedModel, setSelectedModel, loading, error } = useModels();
  
  // Хук для работы с прогнозами на основе выбранной модели
  const { 
    forecasts, 
    selectedForecast, 
    selectForecastByDate 
  } = useForecasts(selectedModel);
  
  // Хук для работы с метриками на основе выбранной модели и даты
  const { metrics } = useMetrics(selectedModel, selectedForecast, forecasts);
  
  // Локальное состояние для номера карты
  const [mapNumber, setMapNumber] = useState<number>(DEFAULT_MAP_NUMBER);

  // Функция скачивания NPZ файла
  const downloadNpzFile = async () => {
    if (selectedForecast && selectedModel) {
      try {
        const url = API_ENDPOINTS.GET_FORECAST_OBJECT(selectedForecast.toString());
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `forecast_${selectedModel}.npz`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);
      } catch (error) {
        console.error('Ошибка при скачивании файла:', error);
      }
    }
  };

  // Отображение загрузки
  if (loading) {
    return <LoadingSpinner />;
  }

  // Отображение ошибки
  if (error) {
    return <ErrorDisplay error={error} />;
  }

  return (
    <div className="h-screen bg-gray-50 overflow-x-hidden">
      <div className="container mx-auto h-full p-4 flex flex-col">
        {/* Заголовок */}
        <PageHeader />

        {/* Основной контент */}
        <div className="gap-2">
          {/* Верхняя часть: Управление + Изображение рядом */}
          <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
            {/* Левая область: Элементы управления */}
            <div className="flex-1">
              <ForecastControls
                models={models}
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
                forecasts={forecasts}
                selectedForecast={selectedForecast}
                onForecastDateSelect={selectForecastByDate}
                mapNumber={mapNumber}
                onMapNumberChange={setMapNumber}
                onDownloadClick={downloadNpzFile}
              />
            </div>

            {/* Правая область: Изображение прогноза */}
            <div className="flex-1 max-w-[785px] max-h-[785px]">
              {selectedForecast ? (
                <ForecastImage
                  forecastId={selectedForecast.toString()}
                  mapNumber={mapNumber}
                />
              ) : (
                <div className="text-gray-400 text-center">
                  <p>{ERROR_MESSAGES.SELECT_FORECAST}</p>
                </div>
              )}
            </div>
          </div>

          {/* Нижняя часть: Метрики */}
          <MetricsSection 
            metrics={metrics} 
            selectedForecastDate={
              selectedForecast && forecasts.length > 0 
                ? forecasts.find(f => f.id === selectedForecast)?.forecast_start_date 
                : undefined
            } 
          />
        </div>
      </div>
    </div>
  );
} 