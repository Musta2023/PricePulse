#!/bin/sh
set -e

echo "Waiting for database to be ready..."
# npx prisma db push will create tables if they don't exist
npx prisma db push --accept-data-loss

echo "Seeding database..."
npx prisma db seed

echo "Starting application..."
node dist/index.js
