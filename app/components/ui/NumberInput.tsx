'use client';

import { Plus, Minus } from 'lucide-react';
import { clsx } from 'clsx';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  disabled?: boolean;
  className?: string;
}

export function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
  disabled = false,
  className
}: NumberInputProps) {
  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <div className={clsx('flex flex-col gap-2', className)}>
      {/* Лейбл */}
      <label className="text-xl text-primary-800/60 font-normal">
        {label}
      </label>

      {/* Поле ввода с кнопками */}
      <div className="flex h-12">
        {/* Инпут */}
        <input
          type="number"
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
          disabled={disabled}
          className={clsx(
            'flex-1 px-3 bg-white border border-primary-600/28 rounded-l text-xl text-center',
            'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
            'transition-colors opacity-30',
            disabled && 'cursor-not-allowed'
          )}
        />

        {/* Кнопки управления */}
        <div className="flex flex-col border-l border-primary-600/28">
          {/* Кнопка плюс */}
          <button
            type="button"
            onClick={handleIncrement}
            disabled={disabled || value >= max}
            className={clsx(
              'w-6 h-6 flex items-center justify-center bg-white border-b border-primary-600/28 rounded-tr',
              'hover:bg-gray-50 transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            <Plus className="w-3 h-3 text-primary-800/80" />
          </button>

          {/* Кнопка минус */}
          <button
            type="button"
            onClick={handleDecrement}
            disabled={disabled || value <= min}
            className={clsx(
              'w-6 h-6 flex items-center justify-center bg-white rounded-br',
              'hover:bg-gray-50 transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            <Minus className="w-3 h-3 text-primary-800/80" />
          </button>
        </div>
      </div>
    </div>
  );
} 