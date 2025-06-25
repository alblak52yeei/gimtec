import { NextResponse } from 'next/server';

// Тип для GIM модели
interface GIMModel {
  code: string;
  name: string;
  description?: string;
}

export async function GET() {
  try {
    const response = await fetch('https://services.simurg.space/gim-tec-forecast/models', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error(`API ошибка: ${response.status} ${response.statusText}`);
    }
    
    const modelCodes: string[] = await response.json();
    console.log('Models received:', modelCodes.length);
    
    // Преобразуем коды моделей в нужный формат
    const models: GIMModel[] = modelCodes.map(code => {
      const parts = code.split('-');
      const architecture = parts[1] || '';
      const inputData = parts[2] || '';
      const horizon = parts[3] || '';
      
      return {
        code,
        name: `${architecture} (${inputData}, ${horizon} дней)`,
        description: `Архитектура: ${architecture}, Входные данные: ${inputData}, Горизонт прогноза: ${horizon} дней`
      };
    });
    
    
    return NextResponse.json(models);
    
  } catch (error: any) {
    console.error('Ошибка при получении моделей:', error.message);
    // Возвращаем только мок модель при ошибке
    return NextResponse.json({error: "Ошибка при получении моделей"});
  }
} 