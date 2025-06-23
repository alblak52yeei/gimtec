#!/bin/bash

# Скрипт для запуска Docker Compose в разных режимах

MODE=${1:-prod}

if [ "$MODE" = "dev" ]; then
    echo "Запуск в режиме разработки..."
    docker-compose --profile dev up gim-frontend-dev
elif [ "$MODE" = "prod" ]; then
    echo "Запуск в продакшн-режиме..."
    docker-compose up -d gim-frontend --build
else
    echo "Неизвестный режим: $MODE"
    echo "Используйте 'dev' для разработки или 'prod' для продакшн сборки"
    exit 1
fi 