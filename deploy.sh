#!/bin/bash
# Путь: /path/to/your/repository/deploy.sh

# Docker Compose скрипт деплоя
# Настройте переменные под ваш проект

# Настройки
PROJECT_NAME="gimtec"
COMPOSE_FILE="./docker-compose.yml"
BACKUP_DIR="/var/backups/${PROJECT_NAME}"

echo "Начинаем Docker Compose деплой ${PROJECT_NAME}..."

# Проверка наличия Docker и Docker Compose
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен!"
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose не установлен!"
    exit 1
fi

# Проверка наличия docker-compose.yml
if [ ! -f "$COMPOSE_FILE" ]; then
    echo "❌ Файл docker-compose.yml не найден!"
    exit 1
fi

# Создание бэкапа образов (опционально)
echo "Создание бэкапа текущих образов..."
mkdir -p "$BACKUP_DIR"
BACKUP_FILE="${BACKUP_DIR}/images-backup-$(date +%Y%m%d_%H%M%S).txt"
docker images --format "table {{.Repository}}:{{.Tag}}\t{{.ID}}\t{{.CreatedAt}}" > "$BACKUP_FILE"

# Остановка текущих контейнеров
echo "Остановка текущих контейнеров..."
docker-compose -f "$COMPOSE_FILE" down 2>/dev/null || docker compose -f "$COMPOSE_FILE" down 2>/dev/null || echo "Контейнеры уже остановлены"

# Очистка старых образов (опционально, раскомментируйте если нужно)
# echo "Очистка неиспользуемых образов..."
# docker image prune -f

# Сборка и запуск контейнеров
echo "Сборка и запуск контейнеров..."
if command -v docker-compose &> /dev/null; then
    # Используем docker-compose (старая версия)
    docker-compose -f "$COMPOSE_FILE" up --build -d
    COMPOSE_EXIT_CODE=$?
else
    # Используем docker compose (новая версия)
    docker compose -f "$COMPOSE_FILE" up --build -d
    COMPOSE_EXIT_CODE=$?
fi

# Проверка результата
if [ $COMPOSE_EXIT_CODE -eq 0 ]; then
    echo "✅ Docker Compose запущен успешно!"

    # Показать статус контейнеров
    echo "Статус контейнеров:"
    if command -v docker-compose &> /dev/null; then
        docker-compose -f "$COMPOSE_FILE" ps
    else
        docker compose -f "$COMPOSE_FILE" ps
    fi

    # Показать логи (последние 20 строк)
    echo "Последние логи:"
    if command -v docker-compose &> /dev/null; then
        docker-compose -f "$COMPOSE_FILE" logs --tail=20
    else
        docker compose -f "$COMPOSE_FILE" logs --tail=20
    fi
else
    echo "❌ Ошибка при запуске Docker Compose!"

    # Показать логи ошибок
    echo "Логи ошибок:"
    if command -v docker-compose &> /dev/null; then
        docker-compose -f "$COMPOSE_FILE" logs --tail=50
    else
        docker compose -f "$COMPOSE_FILE" logs --tail=50
    fi

    exit 1
fi

# Проверка здоровья контейнеров (через 30 секунд)
echo "Ожидание запуска сервисов (30 секунд)..."
sleep 30

echo "Финальная проверка состояния контейнеров:"
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$COMPOSE_FILE" ps

    # Проверка, что все контейнеры работают
    RUNNING_CONTAINERS=$(docker-compose -f "$COMPOSE_FILE" ps -q | wc -l)
    HEALTHY_CONTAINERS=$(docker-compose -f "$COMPOSE_FILE" ps | grep -c "Up")
else
    docker compose -f "$COMPOSE_FILE" ps

    # Проверка, что все контейнеры работают
    RUNNING_CONTAINERS=$(docker compose -f "$COMPOSE_FILE" ps -q | wc -l)
    HEALTHY_CONTAINERS=$(docker compose -f "$COMPOSE_FILE" ps | grep -c "Up")
fi

if [ "$HEALTHY_CONTAINERS" -gt 0 ]; then
    echo "✅ Деплой завершен успешно!"
    echo "Запущено контейнеров: $HEALTHY_CONTAINERS"
else
    echo "❌ Не все контейнеры запущены корректно!"
    exit 1
fi

# Уведомление (опционально)
# curl -X POST "YOUR_WEBHOOK_URL" -d "Docker деплой $PROJECT_NAME завершен"