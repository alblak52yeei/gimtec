export const API_ENDPOINTS = {
  MODELS: '/api/models',
  FORECASTS: (modelCode: string) => `/api/forecasts/${modelCode}`,
  FORECAST_IMAGE: (forecastId: string, mapNumber: number) => `/api/forecasts/image/${forecastId}/${mapNumber}`,
  GET_FORECAST_OBJECT: (forecastId: string) => `https://services.simurg.space/gim-tec-forecast/get_forecast_object/${forecastId}`,
  METRICS: (modelName: string, dateFrom: string, dateTo: string) => 
    `/api/metrics/${modelName}?date_from=${dateFrom}&date_to=${dateTo}`
}; 