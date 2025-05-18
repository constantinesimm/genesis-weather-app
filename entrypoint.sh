#!/usr/bin/env sh
set -e

echo "⏳ Чекаємо на Postgres…"
until nc -z "$DB_HOST" "$DB_PORT"; do
  sleep 2
done

echo "🚀 Запускаємо міграції"
node dist/migrations-runner.js

echo "🏃‍♂️ Стартуємо додаток"
node dist/main.js