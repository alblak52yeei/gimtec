import { API_ENDPOINTS } from '../constants';
import type { GIMForecast, Model, ModelMetrics } from '../types';

// Базовый класс для API-запросов
class BaseApi {
  protected async fetchData<T>(url: string): Promise<T> {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }
    
    return response.json();
  }
}

// API для работы с моделями
class ModelsApi extends BaseApi {
  async getModels(): Promise<Model[]> {
    return this.fetchData<Model[]>(API_ENDPOINTS.MODELS);
  }
}

// API для работы с прогнозами
class ForecastsApi extends BaseApi {
  async getForecasts(modelCode: string): Promise<GIMForecast[]> {
    return this.fetchData<GIMForecast[]>(API_ENDPOINTS.FORECASTS(modelCode));
  }
}

// API для работы с метриками
class MetricsApi extends BaseApi {
  async getMetrics(modelName: string, dateFrom: string, dateTo: string): Promise<ModelMetrics> {
    return this.fetchData<ModelMetrics>(API_ENDPOINTS.METRICS(modelName, dateFrom, dateTo));
  }
}

// Экспортируем экземпляры API
export const modelsApi = new ModelsApi();
export const forecastsApi = new ForecastsApi();
export const metricsApi = new MetricsApi(); 