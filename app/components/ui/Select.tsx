'use client';

import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  placeholder: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  caption?: string;
  disabled?: boolean;
  className?: string;
}

export function Select({
  label,
  placeholder,
  options,
  value,
  onChange,
  caption,
  disabled = false,
  className
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  // Закрытие при клике вне компонента
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(option => option.value === value);

  return (
    <div className={clsx('flex flex-col gap-2', className)} ref={selectRef}>
      {/* Лейбл */}
      <label className="text-xl text-primary-800/60 font-normal">
        {label}
      </label>

      {/* Основное поле выбора */}
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={clsx(
            'w-full h-12 px-3 pr-12 bg-white border border-primary-600/28 rounded text-xl text-left',
            'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
            'transition-colors',
            disabled && 'opacity-50 cursor-not-allowed',
            !disabled && 'hover:border-primary-600/40'
          )}
        >
          <span className={clsx(
            selectedOption ? 'text-gray-900' : 'text-primary-800/35'
          )}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </button>

        {/* Иконка стрелки */}
        <div className="absolute right-0 top-0 h-12 w-12 flex items-center justify-center border-l border-primary-600/28">
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className="p-3 hover:bg-gray-50 rounded transition-colors"
          >
            <ChevronDown 
              className={clsx(
                'w-6 h-6 text-primary-800/35 transition-transform',
                isOpen && 'transform rotate-180'
              )} 
            />
          </button>
        </div>

        {/* Выпадающий список */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-primary-600/28 rounded shadow-lg z-50 max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={clsx(
                  'w-full px-3 py-3 text-left text-xl hover:bg-gray-50 transition-colors',
                  value === option.value && 'bg-primary-50 text-primary-600'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Подпись (caption) */}
      {caption && (
        <p className="text-sm text-primary-800/30 px-2">
          {caption}
        </p>
      )}
    </div>
  );
} 