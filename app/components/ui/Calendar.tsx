'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { clsx } from 'clsx';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

interface CalendarProps {
  label: string;
  availableDates: string[]; // ISO строки дат
  selectedDate?: string;
  onDateSelect: (date: string) => void;
  className?: string;
}

export function Calendar({
  label,
  availableDates,
  selectedDate,
  onDateSelect,
  className
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Преобразуем доступные даты в объекты Date для удобства
  const availableDateObjects = useMemo(() => 
    availableDates.map(dateStr => new Date(dateStr)), 
    [availableDates]
  );

  // Если есть доступные даты, автоматически переключаемся на месяц с доступными датами
  useEffect(() => {
    if (availableDateObjects.length > 0) {
      // Устанавливаем текущий месяц на месяц первой доступной даты
      setCurrentDate(new Date(availableDateObjects[0]));
    }
  }, [availableDateObjects]);

  // Генерируем дни для отображения в календаре
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Неделя начинается с понедельника
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  // Проверяем, доступна ли дата для выбора
  const isDateAvailable = (date: Date) => {
    return availableDateObjects.some(availableDate => 
      isSameDay(date, availableDate)
    );
  };

  // Обработчики навигации по месяцам
  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  // Обработчик выбора даты
  const handleDateClick = (date: Date) => {
    if (isDateAvailable(date)) {
      // Ищем точное соответствие в исходном массиве ISO строк
      const matchingDateString = availableDates.find(dateStr => 
        isSameDay(new Date(dateStr), date)
      );
      
      if (matchingDateString) {
        onDateSelect(matchingDateString);
      } else {
        // Запасной вариант, если точное соответствие не найдено
        onDateSelect(date.toISOString());
      }
    }
  };

  const selectedDateObject = selectedDate ? parseISO(selectedDate) : null;

  return (
    <div className={clsx('flex flex-col gap-2', className)}>
      {/* Лейбл */}
      <label className="text-xl text-primary-800/60 font-normal">
        {label}
      </label>

      {/* Календарь */}
      <div className="w-63 bg-white rounded">
        {/* Заголовок с навигацией */}
        <div className="flex items-center justify-between h-8 px-0">
          <button
            onClick={goToPreviousMonth}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-primary-800/80" />
          </button>

          <span className="text-sm font-bold text-primary-800">
            {format(currentDate, 'LLLL yyyy', { locale: ru })}
          </span>

          <button
            onClick={goToNextMonth}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-primary-800/80" />
          </button>
        </div>

        {/* Дни недели */}
        <div className="grid grid-cols-7 gap-0 mt-3">
          {['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'].map((day) => (
            <div key={day} className="w-9 h-9 flex items-center justify-center">
              <span className="text-xs text-primary-800/30 uppercase">
                {day}
              </span>
            </div>
          ))}
        </div>

        {/* Дни месяца */}
        <div className="grid grid-cols-7 gap-0">
          {calendarDays.map((date, index) => {
            const isCurrentMonth = isSameMonth(date, currentDate);
            const isAvailable = isDateAvailable(date);
            const isSelected = selectedDateObject && isSameDay(date, selectedDateObject);
            const isTodayDate = isToday(date);

            return (
              <div key={index} className="w-9 h-9 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => handleDateClick(date)}
                  disabled={!isAvailable}
                  className={clsx(
                    'w-8 h-8 flex items-center justify-center text-sm rounded-full transition-colors',
                    // Основные состояния
                    isCurrentMonth ? 'text-primary-800' : 'text-primary-800/26',
                    // Доступная дата - зеленый фон для доступных дат
                    isAvailable && 'bg-green-500 text-white hover:bg-green-600',
                    // Сегодняшняя дата
                    isTodayDate && !isAvailable && 'border border-primary-500',
                    // Выбранная дата
                    isSelected && 'ring-2 ring-primary-500 ring-offset-1',
                    // Недоступная дата
                    !isAvailable && isCurrentMonth && 'text-gray-400',
                    !isAvailable && !isCurrentMonth && 'text-gray-300 cursor-not-allowed'
                  )}
                >
                  {format(date, 'd')}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 