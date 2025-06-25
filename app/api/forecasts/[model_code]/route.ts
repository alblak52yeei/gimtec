import { NextRequest, NextResponse } from 'next/server';
import { GIMForecast } from '@/app/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { model_code: string } }
) {
  try {
    // Декодируем model_code на случай URL encoding
    const model_code = decodeURIComponent(params.model_code);
    console.log(`Запрос прогнозов для модели: ${model_code}`);
    
    if (!model_code) {
      return NextResponse.json(
        { error: 'Код модели обязателен' },
        { status: 400 }
      );
    }

    const apiUrl = `https://services.simurg.space/gim-tec-forecast/get_forecasts/${encodeURIComponent(model_code)}`;
    console.log(`Отправляем запрос на: ${apiUrl}`);
    
    // Контроллер для таймаута
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 секунд
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    console.log(`Ответ от GIM API: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Ошибка от GIM API: ${errorText}`);

      return NextResponse.json({error: "Ошибка при получении прогнозов"});
    }
    
    const forecasts: GIMForecast[] = await response.json();
    console.log(`Получено прогнозов для модели ${model_code}:`, forecasts.length);
    
    return NextResponse.json(forecasts);
    
  } catch (error: any) {
    console.error('Ошибка при получении прогнозов:', error.message);

    return NextResponse.json({error: "Ошибка при получении прогнозов"});
  }
} 