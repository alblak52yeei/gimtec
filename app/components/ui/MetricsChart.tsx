'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { clsx } from 'clsx';
import type { ModelMetrics } from '@/app/types';

interface MetricsChartProps {
  metrics: ModelMetrics;
  title: string;
  className?: string;
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

export function MetricsChart({ metrics, title, className }: MetricsChartProps) {
  // Проверяем наличие данных
  if (!metrics?.dates?.length) {
    return (
      <div className={clsx('bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex-1 flex items-center justify-center', className)}>
        <p className="text-gray-500">Нет данных для отображения</p>
      </div>
    );
  }
  
  // Подготавливаем данные для графика с правильным форматированием дат
  const chartData = metrics.dates.map((date, index) => {
    const dateObj = new Date(date);
    
    // Проверяем, является ли дата корректной
    const isValidDate = !isNaN(dateObj.getTime());
    const formattedDate = isValidDate 
      ? dateObj.toLocaleDateString('ru', { day: '2-digit', month: 'short' })
      : 'Некорр. дата';
    
    return {
      date: formattedDate,
      fullDate: isValidDate 
        ? dateObj.toLocaleDateString('ru', { day: '2-digit', month: 'long', year: 'numeric' })
        : 'Некорректная дата',
      MAE: metrics.mae[index] === undefined || isNaN(metrics.mae[index]) ? null : Number(metrics.mae[index].toFixed(2)),
      MAPE: metrics.mape[index] === undefined || isNaN(metrics.mape[index]) ? null : Number(metrics.mape[index].toFixed(2)), 
      RMSE: metrics.rmse[index] === undefined || isNaN(metrics.rmse[index]) ? null : Number(metrics.rmse[index].toFixed(2))
    };
  });

  // Определяем диапазон дат для подзаголовка, с учетом возможных некорректных дат
  let startDateStr = 'Н/Д';
  let endDateStr = 'Н/Д';
  
  try {
    const startDate = new Date(metrics.dates[0]);
    const endDate = new Date(metrics.dates[metrics.dates.length - 1]);
    
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
              bottom: 40,
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
            
            {/* Ось X */}
            <XAxis 
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ 
                fontSize: 14, 
                fill: '#7C828A',
                fontFamily: 'Nunito Sans, sans-serif'
              }}
              angle={-45}
              textAnchor="end"
              height={60}
              interval={Math.max(1, Math.ceil(chartData.length / 15))} // Увеличиваем количество меток до ~15
            />
            
            {/* Ось Y */}
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ 
                fontSize: 14, 
                fill: '#7C828A',
                fontFamily: 'Nunito Sans, sans-serif'
              }}
              dx={-10}
              domain={['dataMin - 1', 'dataMax + 1']}
              tickFormatter={(value) => value.toFixed(2)} // Округление до сотых
            />

            {/* Тултип */}
            <Tooltip content={<CustomTooltip />} />

            {/* Линии для разных метрик */}
            {title === 'MAE' && (
              <Line 
                type="monotone" 
                dataKey="MAE" 
                stroke={chartColors.MAE}
                strokeWidth={3}
                dot={{ fill: chartColors.MAE, strokeWidth: 0, r: 5 }}
                activeDot={{ r: 7, fill: chartColors.MAE, strokeWidth: 2, stroke: '#fff' }}
                connectNulls={false} // Делаем разрывы при отсутствии данных
              />
            )}
            
            {title === 'MAPE' && (
              <Line 
                type="monotone" 
                dataKey="MAPE" 
                stroke={chartColors.MAPE}
                strokeWidth={3}
                dot={{ fill: chartColors.MAPE, strokeWidth: 0, r: 5 }}
                activeDot={{ r: 7, fill: chartColors.MAPE, strokeWidth: 2, stroke: '#fff' }}
                connectNulls={false} // Делаем разрывы при отсутствии данных
              />
            )}
            
            {title === 'RMSE' && (
              <Line 
                type="monotone" 
                dataKey="RMSE" 
                stroke={chartColors.RMSE}
                strokeWidth={3}
                dot={{ fill: chartColors.RMSE, strokeWidth: 0, r: 5 }}
                activeDot={{ r: 7, fill: chartColors.RMSE, strokeWidth: 2, stroke: '#fff' }}
                connectNulls={false} // Делаем разрывы при отсутствии данных
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 