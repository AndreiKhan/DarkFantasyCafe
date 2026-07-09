#!/bin/sh
set -e

echo "Applying database migrations..."
npx prisma migrate deploy

echo "Seeding database (skipped automatically if data already exists)..."
npx tsx prisma/seed.ts

echo "Starting server..."
exec npx tsx src/server.ts
