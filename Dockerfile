# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package.json for dependencies
COPY package*.json ./
RUN npm install

# Copy everything from root
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the project (assuming 'build' script handles tsc in api/ or root)
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy only production dependencies and build artifacts
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/api ./api

EXPOSE 3000

# The app is now in api/index.js, compiled in dist/
CMD ["node", "dist/index.js"]
