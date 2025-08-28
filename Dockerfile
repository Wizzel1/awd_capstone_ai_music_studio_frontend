# frontend/Dockerfile
FROM node:22-alpine AS base

# install system dependencies
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Development stage
FROM base AS development
ENV NODE_ENV=development
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Dependencies stage
FROM base AS deps
RUN npm ci --only=production && npm cache clean --force

# Builder stage
FROM base AS builder
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci
COPY . .

# Build application
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Production stage
FROM node:22-alpine AS production

RUN apk add --no-cache dumb-init
WORKDIR /app

# Create user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

CMD ["dumb-init", "node", "server.js"]