#!/bin/bash
# Путь: /path/to/your/repository/deploy.sh

PROJECT_NAME="gimtec"
COMPOSE_FILE="./docker-compose.yml"

echo "🚀 Деплой ${PROJECT_NAME}"

# Проверка наличия Docker Compose
if ! command -v docker compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose не установлен!"
    exit 1
fi

# Остановка текущих контейнеров
echo "Остановка контейнеров..."
if command -v docker compose &> /dev/null; then
    docker compose -f "$COMPOSE_FILE" down
else
    docker compose -f "$COMPOSE_FILE" down
fi

# Подтягивание изменений в коде (если есть bind mount)
echo "Синхронизация файлов..."
git pull origin main 2>/dev/null || echo "Git pull пропущен"

# Запуск без пересборки
echo "Запуск контейнеров..."
if command -v docker compose &> /dev/null; then
    docker compose -f "$COMPOSE_FILE" up --build -d
    COMPOSE_EXIT_CODE=$?
else
    docker compose -f "$COMPOSE_FILE" up --build -d
    COMPOSE_EXIT_CODE=$?
fi

if [ $COMPOSE_EXIT_CODE -eq 0 ]; then
    echo "✅ Деплой завершен!"

    # Показать статус
    if command -v docker compose &> /dev/null; then
        docker compose -f "$COMPOSE_FILE" ps
    else
        docker compose -f "$COMPOSE_FILE" ps
    fi
else
    echo "❌ Ошибка деплоя!"
    exit 1
fi