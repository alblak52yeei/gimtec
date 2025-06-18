# GIM Прогноз - Веб-интерфейс

Веб-интерфейс для просмотра прогнозов глобальных ионосферных карт (GIM) на базе Next.js.

## Возможности

- 📊 Выбор модели прогнозирования из доступных
- 📅 Календарь с доступными датами прогнозов  
- 🖼️ Просмотр изображений прогнозных карт (1-24)
- 📈 Визуализация метрик модели (MAE, MAPE, RMSE)
- 💾 Скачивание NPZ файлов прогнозов

## Технологии

- **Next.js 14** - React фреймворк
- **TypeScript** - Типизация
- **Tailwind CSS** - Стилизация
- **Recharts** - Графики и диаграммы
- **Lucide React** - Иконки
- **Date-fns** - Работа с датами

## Быстрый старт

### Разработка

```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev
```

Приложение будет доступно по адресу http://localhost:3000

### Docker

```bash
# Сборка и запуск через Docker Compose
docker-compose up --build

# Или сборка отдельного образа
docker build -t gim-frontend .
docker run -p 3000:3000 gim-frontend
```

## Настройка

### Переменные окружения

Создайте файл `.env.local`:

```env
# URL бэкенд API
API_BASE_URL=https://services.simurg.space/gim-tec-forecast
NEXT_PUBLIC_API_BASE_URL=https://services.simurg.space/gim-tec-forecast
```

### API Endpoints

Приложение работает с следующими эндпоинтами:

- `GET /models` - Получение списка моделей
- `GET /get_forecasts/{model_code}` - Получение прогнозов модели
- `GET /get_model_metrics/{model_code}` - Получение метрик модели
- `GET /get_forecast_image/{forecast_id}?shift=N` - Изображение прогноза
- `GET /get_forecast_npz/{forecast_id}` - NPZ файл прогноза

## Структура проекта

```
├── app/
│   ├── api/                 # API роуты (проксирование)
│   ├── components/          # React компоненты
│   │   └── ui/             # UI компоненты
│   ├── globals.css         # Глобальные стили
│   ├── layout.tsx          # Основной layout
│   ├── page.tsx            # Главная страница
│   └── types.ts            # TypeScript типы
├── public/                 # Статические файлы
├── Dockerfile              # Docker конфигурация
├── docker-compose.yml      # Docker Compose
└── package.json           # Зависимости проекта
```

## Особенности реализации

1. **Автовыбор модели** - При загрузке автоматически выбирается первая доступная модель
2. **Календарь дат** - Отображает только доступные даты прогнозов
3. **Responsive дизайн** - Адаптивная верстка для всех устройств  
4. **Обработка ошибок** - Graceful обработка ошибок API
5. **Загрузочные состояния** - Индикаторы загрузки для лучшего UX 