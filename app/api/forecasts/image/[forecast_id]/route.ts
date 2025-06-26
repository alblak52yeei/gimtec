import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { forecast_id: string } }
) {
  try {
    const { forecast_id } = params;
    const { searchParams } = new URL(request.url);
    const shift = searchParams.get('shift') || '0';
    
    if (!forecast_id) {
      return NextResponse.json(
        { error: 'ID прогноза обязателен' },
        { status: 400 }
      );
    }
    
    // Для всех остальных - проксируем к реальному API
    console.log(`Проксируем изображение для прогноза ${forecast_id} к внешнему API`);
    const response = await fetch(
      `https://services.simurg.space/gim-tec-forecast/get_forecast_image/${forecast_id}?shift=${shift}`,
      {
        method: 'GET',
        cache: 'no-store',
      }
    );
    
    if (!response.ok) {
      throw new Error(`API ошибка: ${response.status} ${response.statusText}`);
    }
    
    const imageBuffer = await response.arrayBuffer();
    
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': response.headers.get('content-type') || 'image/jpeg',
        'Content-Length': imageBuffer.byteLength.toString(),
      },
    });
    
  } catch (error: any) {
    console.error('Ошибка при получении изображения:', error.message);
    
    // При ошибке возвращаем простую заглушку
    const { forecast_id } = params;
    const { searchParams } = new URL(request.url);
    const shift = searchParams.get('shift') || '0';
    
    const errorSvg = `
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f5f5f5"/>
        <text x="200" y="140" text-anchor="middle" fill="#999" font-size="14">
          Изображение недоступно
        </text>
        <text x="200" y="160" text-anchor="middle" fill="#666" font-size="12">
          ID: ${forecast_id}, Карта: ${parseInt(shift) + 1}
        </text>
      </svg>
    `;
    
    return new NextResponse(errorSvg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Content-Length': Buffer.byteLength(errorSvg).toString(),
      },
    });
  }
} 