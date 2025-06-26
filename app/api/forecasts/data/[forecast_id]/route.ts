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
    
    // Правильный URL для получения NPZ данных согласно документации
    const apiUrl = `https://services.simurg.space/gim-tec-forecast/get_forecast_npz/${forecast_id}`;
    console.log(`Отправляем запрос на: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      cache: 'no-store',
    });
    
    console.log(`Ответ от GIM API: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      throw new Error(`API ошибка: ${response.status} ${response.statusText}`);
    }
    
    const dataBuffer = await response.arrayBuffer();
    console.log(`Получен NPZ файл размером: ${dataBuffer.byteLength} байт`);
    
    return new NextResponse(dataBuffer, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="forecast_${forecast_id}.npz"`,
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