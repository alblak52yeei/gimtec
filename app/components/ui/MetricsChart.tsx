'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { clsx } from 'clsx';
import type { ModelMetrics } from '@/app/types';

interface MetricsChartProps {
  metrics: ModelMetrics;
  title: string;
  className?: string;
  selectedDate?: string;
}

// Цвета для разных типов метрик согласно дизайну
const chartColors = {
  MAE: '#EC6666',    // Красный
  MAPE: '#147AD6',   // Синий  
  RMSE: '#79D2DE'    // Голубой
};

// Функция для красивого форматирования тултипа
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm text-gray-600 mb-1">{`Дата: ${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm font-semibold" style={{ color: entry.color }}>
            {`${entry.dataKey}: ${Number(entry.value).toFixed(2)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Функция для создания полного диапазона дат между минимальной и максимальной датой
const createFullDateRange = (dates: string[]) => {
  if (dates.length === 0) return [];
  
  // Очищаем даты от времени и сортируем
  const cleanDates = dates.map(date => date.split('T')[0]).sort();
  const startDate = new Date(cleanDates[0]);
  const endDate = new Date(cleanDates[cleanDates.length - 1]);
  
  const dateRange = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    dateRange.push(new Date(currentDate).toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dateRange;
};

export function MetricsChart({ metrics, title, className, selectedDate }: MetricsChartProps) {
  // Проверяем наличие данных
  if (!metrics?.dates?.length) {
    return (
      <div className={clsx('bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex-1 flex items-center justify-center', className)}>
        <p className="text-gray-500">Нет данных для отображения</p>
      </div>
    );
  }
  
  // Создаем полный диапазон дат (с пропусками)
  const fullDateRange = createFullDateRange(metrics.dates);
  
  // Создаем карту исходных данных для быстрого поиска
  const dataMap = new Map();
  metrics.dates.forEach((date, index) => {
    // Приводим дату к формату YYYY-MM-DD (убираем время если есть)
    const cleanDate = date.split('T')[0];
    dataMap.set(cleanDate, {
      mae: metrics.mae[index],
      mape: metrics.mape[index],
      rmse: metrics.rmse[index]
    });
  });
  
  // Подготавливаем данные для графика с пропусками для отсутствующих дат
  const chartData = fullDateRange.map((date) => {
    const dateObj = new Date(date);
    const isValidDate = !isNaN(dateObj.getTime());
    const formattedDate = isValidDate 
      ? dateObj.toLocaleDateString('ru', { day: '2-digit', month: 'short' })
      : 'Некорр. дата';
    
    // Проверяем, есть ли данные на эту дату
    const dataForDate = dataMap.get(date);
    
    const chartPoint = {
      date: formattedDate,
      fullDate: isValidDate 
        ? dateObj.toLocaleDateString('ru', { day: '2-digit', month: 'long', year: 'numeric' })
        : 'Некорректная дата',
      MAE: dataForDate && dataForDate.mae !== undefined && !isNaN(dataForDate.mae) 
        ? Number(dataForDate.mae.toFixed(2)) 
        : null,
      MAPE: dataForDate && dataForDate.mape !== undefined && !isNaN(dataForDate.mape) 
        ? Number(dataForDate.mape.toFixed(2)) 
        : null, 
      RMSE: dataForDate && dataForDate.rmse !== undefined && !isNaN(dataForDate.rmse) 
        ? Number(dataForDate.rmse.toFixed(2)) 
        : null
    };
    
    return chartPoint;
  });
  
  // Проверяем есть ли вообще данные для отображения
  const hasData = chartData.some(point => 
    point.MAE !== null || point.MAPE !== null || point.RMSE !== null
  );

  // Определяем диапазон дат для подзаголовка
  let startDateStr = 'Н/Д';
  let endDateStr = 'Н/Д';
  
  try {
    const sortedDates = [...metrics.dates].sort();
    const startDate = new Date(sortedDates[0]);
    const endDate = new Date(sortedDates[sortedDates.length - 1]);
    
    if (!isNaN(startDate.getTime())) {
      startDateStr = startDate.toLocaleDateString('ru', { day: 'numeric', month: 'long' });
    }
    
    if (!isNaN(endDate.getTime())) {
      endDateStr = endDate.toLocaleDateString('ru', { day: 'numeric', month: 'long' });
    }
  } catch (e) {
    console.error('Ошибка форматирования дат:', e);
  }

  return (
    <div className={clsx('bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex-1', className)}>
      {/* Заголовок графика */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-black mb-1">
          {title}
        </h3>
        <p className="text-base text-gray-600">
          {startDateStr} - {endDateStr}
        </p>
      </div>

      {/* График */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 60, // Увеличиваем отступ для подписей
            }}
          >
            {/* Сетка */}
            <CartesianGrid 
              strokeDasharray="none" 
              stroke="#D6D9DC" 
              opacity={0.4}
              horizontal={true}
              vertical={false}
            />
            
            {/* Вертикальная линия для выбранной даты */}
            {selectedDate && (
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#FF6B6B" 
                opacity={0.8}
                horizontal={false}
                vertical={true}
                verticalPoints={[
                  chartData.findIndex(point => {
                    const pointDate = new Date(point.fullDate);
                    const selected = new Date(selectedDate);
                    return pointDate.toDateString() === selected.toDateString();
                  })
                ].filter(index => index >= 0)}
              />
            )}
            
            {/* Ось X - возвращаем подписи, но делаем их реже */}
            <XAxis 
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ 
                fontSize: 12, 
                fill: '#7C828A',
                fontFamily: 'Nunito Sans, sans-serif'
              }}
              angle={-45}
              textAnchor="end"
              height={50}
              interval={Math.max(0, Math.floor(chartData.length / 8))} // Показываем максимум 8 подписей
            />
            
            {/* Ось Y - всегда начинается с 0 */}
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ 
                fontSize: 14, 
                fill: '#7C828A',
                fontFamily: 'Nunito Sans, sans-serif'
              }}
              dx={-10}
              domain={[0, 'dataMax + 1']} // Всегда начинаем с 0
              tickFormatter={(value) => value.toFixed(2)}
            />

            {/* Тултип */}
            <Tooltip content={<CustomTooltip />} />

            {/* Линии для разных метрик */}
            {title === 'MAE' && (
              <Line 
                type="monotone" 
                dataKey="MAE" 
                stroke={chartColors.MAE}
                strokeWidth={2}
                dot={{ fill: chartColors.MAE, strokeWidth: 2, stroke: '#fff', r: 6 }}
                activeDot={{ r: 8, fill: chartColors.MAE, strokeWidth: 2, stroke: '#fff' }}
                connectNulls={false} // НЕ соединяем null значения - создаем пропуски
              />
            )}
            
            {title === 'MAPE' && (
              <Line 
                type="monotone" 
                dataKey="MAPE" 
                stroke={chartColors.MAPE}
                strokeWidth={2}
                dot={{ fill: chartColors.MAPE, strokeWidth: 2, stroke: '#fff', r: 6 }}
                activeDot={{ r: 8, fill: chartColors.MAPE, strokeWidth: 2, stroke: '#fff' }}
                connectNulls={false} // НЕ соединяем null значения - создаем пропуски
              />
            )}
            
            {title === 'RMSE' && (
              <Line 
                type="monotone" 
                dataKey="RMSE" 
                stroke={chartColors.RMSE}
                strokeWidth={2}
                dot={{ fill: chartColors.RMSE, strokeWidth: 2, stroke: '#fff', r: 6 }}
                activeDot={{ r: 8, fill: chartColors.RMSE, strokeWidth: 2, stroke: '#fff' }}
                connectNulls={false} // НЕ соединяем null значения - создаем пропуски
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 