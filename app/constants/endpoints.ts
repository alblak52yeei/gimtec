export const API_ENDPOINTS = {
  MODELS: '/api/models',
  FORECASTS: (modelCode: string) => `/api/forecasts/${modelCode}`,
  FORECAST_IMAGE: (forecastId: string, mapNumber: number) => `/api/forecasts/image/${forecastId}/${mapNumber}`,
  METRICS: (modelName: string, dateFrom: string, dateTo: string) => 
    `/api/metrics/${modelName}?date_from=${dateFrom}&date_to=${dateTo}`
}; 