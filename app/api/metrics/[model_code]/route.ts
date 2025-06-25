import { NextResponse } from 'next/server';
import { ModelMetrics, NewMetricsResponse } from '@/app/types';

export async function GET(
  request: Request,
  { params }: { params: { model_code: string } }
) {
  try {
    const forecastId = params.model_code;
    const url = new URL(request.url);
    
    // Получаем временной интервал из параметров запроса или используем последний месяц
    let dateFromStr = url.searchParams.get('date_from');
    let dateToStr = url.searchParams.get('date_to');
    
    // Если даты не указаны, используем последний месяц
    if (!dateFromStr || !dateToStr) {
      const dateTo = new Date();
      const dateFrom = new Date();
      dateFrom.setMonth(dateFrom.getMonth() - 1);
      
      dateFromStr = dateFrom.toISOString().split('T')[0];
      dateToStr = dateTo.toISOString().split('T')[0];
    }
    
    const apiBaseUrl = process.env.API_BASE_URL || 'https://services.simurg.space/gim-tec-forecast';
    console.log('Fetching metrics from:', `${apiBaseUrl}/metrics/${forecastId}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const apiUrl = `${apiBaseUrl}/get_metrics/${forecastId}?date_from=${dateFromStr}&date_to=${dateToStr}`;
    console.log('API request URL:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      cache: 'no-store',
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error('API response not ok:', response.status, response.statusText);
      throw new Error(`API ошибка: ${response.status} ${response.statusText}`);
    }
    
    const rawData: NewMetricsResponse = await response.json();
    console.log('Raw metrics received for forecast:', forecastId, rawData.length, 'entries');
    
    // Проверяем, есть ли данные
    if (rawData.length === 0) {
      return NextResponse.json({
        model_code: forecastId,
        mae: [],
        mape: [],
        rmse: [],
        dates: [],
        error: "Нет данных за указанный период"
      });
    }
    
    // Сортируем данные по дате
    const sortedData = [...rawData].sort((a, b) => {
      return new Date(a.forecast_start_date).getTime() - new Date(b.forecast_start_date).getTime();
    });
    
    // Трансформируем данные в формат для фронтенда
    const transformedData: ModelMetrics = {
      model_code: forecastId,
      mae: sortedData.map(entry => entry.mae),
      mape: sortedData.map(entry => entry.mape), 
      rmse: sortedData.map(entry => entry.rmse),
      dates: sortedData.map(entry => entry.forecast_start_date)
    };
    
    return NextResponse.json(transformedData);
    
  } catch (error: any) {
    console.error('Ошибка при получении метрик:', error.message);

    return NextResponse.json({error: "Ошибка при получении метрик"}, { status: 500 });
  }
} 