import { Select } from './ui/Select';
import { Calendar } from './ui/Calendar';
import { NumberInput } from './ui/NumberInput';
import { Download } from 'lucide-react';
import { MIN_MAP_NUMBER, MAX_MAP_NUMBER } from '../constants';
import type { Model, GIMForecast } from '../types';

interface ForecastControlsProps {
  models: Model[];
  selectedModel: string;
  onModelChange: (modelCode: string) => void;
  forecasts: GIMForecast[];
  selectedForecast: number | null;
  onForecastDateSelect: (date: string) => void;
  mapNumber: number;
  onMapNumberChange: (value: number) => void;
  onDownloadClick: () => void;
}

export function ForecastControls({
  models,
  selectedModel,
  onModelChange,
  forecasts,
  selectedForecast,
  onForecastDateSelect,
  mapNumber,
  onMapNumberChange,
  onDownloadClick
}: ForecastControlsProps) {
  // Находим выбранный прогноз для получения его даты
  const selectedForecastDate = forecasts.find(f => f.id === selectedForecast)?.forecast_start_date;
  
  return (
    <div className="space-y-4 bg-white rounded-lg shadow-sm p-4">
      {/* Выбор модели */}
      <Select
        label="Модель"
        placeholder="Выберите модель"
        options={models.map(m => ({ value: m.code, label: m.name }))}
        value={selectedModel}
        onChange={onModelChange}
      />

      {/* Выбор прогноза через календарь */}
      {forecasts.length > 0 && (
        <Calendar
          label="Дата прогноза"
          availableDates={forecasts.map(f => f.forecast_start_date)}
          selectedDate={selectedForecastDate}
          onDateSelect={onForecastDateSelect}
        />
      )}

      {/* Номер карты */}
      <NumberInput
        label="Номер карты"
        value={mapNumber}
        onChange={onMapNumberChange}
        min={MIN_MAP_NUMBER}
        max={MAX_MAP_NUMBER}
      />

      {/* Кнопка скачивания */}
      <button
        onClick={onDownloadClick}
        disabled={!selectedForecast}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        <Download className="w-4 h-4" />
        Скачать NPZ файл
      </button>
    </div>
  );
} 