// Типы для работы с API согласно ТЗ

export interface Model {
  code: string;
  name: string;
  description?: string;
}

// Тип для GIM прогноза (как возвращает API)
export interface GIMForecast {
  id: number;
  model_code: string;
  forecast_start_date: string;
  forecast_end_date: string;
}

export interface Forecast {
  id: string;
  datetime: string; // ISO строка даты
  model_code: string;
}

export interface ModelMetrics {
  model_code: string;
  mae: number[];
  mape: number[];
  rmse: number[];
  dates: string[]; // ISO строки дат для оси X
}

// Тип для ответа API models
export type ModelsResponse = Model[];

// Тип для ответа API get_forecasts/{model_code}
export type ForecastsResponse = Forecast[];

// Тип для ответа GIM API get_forecasts/{model_code}
export type GIMForecastsResponse = GIMForecast[];

// Тип для ответа API get_model_metrics/{model_code}
export type MetricsResponse = ModelMetrics;

// Локальные типы для состояния приложения
export interface AppState {
  selectedModel: Model | null;
  availableModels: Model[];
  availableForecasts: Forecast[];
  selectedForecast: Forecast | null;
  mapNumber: number;
  modelMetrics: ModelMetrics | null;
  isLoading: boolean;
  error: string | null;
} 