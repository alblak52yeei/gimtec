'use client';

import { useState, useEffect } from 'react';
import { clsx } from 'clsx';

interface ForecastImageProps {
  forecastId: string;
  mapNumber: number;
  className?: string;
}

export function ForecastImage({ forecastId, mapNumber, className }: ForecastImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const imageUrl = `https://services.simurg.space/gim-tec-forecast/get_forecast_image/${forecastId}?shift=${mapNumber - 1}`;

  // Сброс состояний при изменении пропсов
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [forecastId, mapNumber]);

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className={clsx('relative bg-white rounded', className)}>
      {/* Заголовок области изображения */}
      <div className="mb-4">
        <h3 className="text-xl text-primary-800/60 font-normal">
          Изображение прогноза карты #{mapNumber}
        </h3>
      </div>

      {/* Контейнер изображения с увеличенными размерами */}
      <div className="relative w-full bg-gray-100 rounded overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-500">Загрузка изображения...</span>
            </div>
          </div>
        )}

        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-center p-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-500 text-xl">📷</span>
              </div>
              <span className="text-sm text-gray-500">
                Не удалось загрузить изображение
              </span>
              <span className="text-xs text-gray-400">
                Прогноз ID: {forecastId}, Карта: {mapNumber}
              </span>
            </div>
          </div>
        )}

        {/* Само изображение с ключом для принудительного обновления */}
        <img
          key={`${forecastId}-${mapNumber}`}
          src={imageUrl}
          alt={`Прогноз карты ${mapNumber} для ID ${forecastId}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={clsx(
            'w-full h-full object-contain transition-opacity duration-300',
            isLoading || hasError ? 'opacity-0' : 'opacity-100'
          )}
        />
      </div>

      {/* Информация о карте */}
      <div className="mt-3 text-xs text-gray-500">
        <p>Номер карты: {mapNumber} из 24</p>
      </div>
    </div>
  );
} 