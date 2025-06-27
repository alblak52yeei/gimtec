import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { forecast_id: string } }
) {
  try {
    const { forecast_id } = params;
    
    console.log(`Запрос NPZ данных для прогноза ${forecast_id}`);
    
    if (!forecast_id) {
      return NextResponse.json(
        { error: 'ID прогноза обязателен' },
        { status: 400 }
      );
    }
    
    // Сначала получаем информацию о прогнозе для извлечения даты
    let forecastDate = '';
    let modelCode = '';
    try {
      const forecastInfoUrl = `https://services.simurg.space/gim-tec-forecast/get_forecasts`;
      const forecastResponse = await fetch(forecastInfoUrl, {
        method: 'GET',
        cache: 'no-store',
      });
      
      if (forecastResponse.ok) {
        const forecasts = await forecastResponse.json();
        const forecast = forecasts.find((f: any) => f.id.toString() === forecast_id);
        if (forecast) {
          if (forecast.forecast_start_date) {
            const date = new Date(forecast.forecast_start_date);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            forecastDate = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
          }
          if (forecast.model_code) {
            modelCode = forecast.model_code;
          }
        }
      }
    } catch (error) {
      console.warn('Не удалось получить информацию о прогнозе для имени файла:', error);
    }
    
    // Правильный URL для получения NPZ данных согласно документации
    const apiUrl = `https://services.simurg.space/gim-tec-forecast/get_forecast_npz/${forecast_id}`;
    const response = await fetch(apiUrl, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`API ошибка: ${response.status} ${response.statusText}`);
    }
    
    const dataBuffer = await response.arrayBuffer();
    console.log(`Получен NPZ файл размером: ${dataBuffer.byteLength} байт`);

    // Формируем имя файла в старом формате с моделью и датой/временем
    let fileName = `forecast_${forecast_id}.npz`;
    if (modelCode && forecastDate) {
      fileName = `forecast_${modelCode}_${forecastDate}.npz`;
    } else if (modelCode) {
      fileName = `forecast_${modelCode}.npz`;
    } else if (forecastDate) {
      fileName = `forecast_${forecast_id}_${forecastDate}.npz`;
    }
    
    return new NextResponse(dataBuffer, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': dataBuffer.byteLength.toString(),
      },
    });
    
  } catch (error: any) {
    console.error('Ошибка при получении NPZ данных:', error.message);
    return NextResponse.json(
      { error: `Не удалось получить NPZ данные: ${error.message}` },
      { status: 500 }
    );
  }
} 