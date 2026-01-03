# ============================================
# Multi-stage Dockerfile for LocalMind Backend
# ============================================

# Stage 1: Build stage
FROM node:20-alpine AS builder

# Install pnpm (faster package manager)
RUN npm install -g pnpm

# Set working directory
WORKDIR /app/LocalMind-Backend

# Copy package files
COPY LocalMind-Backend/package.json LocalMind-Backend/pnpm-lock.yaml* LocalMind-Backend/package-lock.json* ./

# Install dependencies (including dev dependencies for build)
RUN if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; else npm ci; fi

# Copy source code and TypeScript config
COPY LocalMind-Backend/tsconfig.json ./
COPY LocalMind-Backend/src ./src
COPY LocalMind-Backend/types ./types

# Build TypeScript to JavaScript
RUN npm run build

# Stage 2: Production stage
FROM node:20-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user for security
RUN addgroup -g 1001 -S localmind && \
    adduser -S localmind -u 1001

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY LocalMind-Backend/package.json LocalMind-Backend/pnpm-lock.yaml* LocalMind-Backend/package-lock.json* ./

# Install only production dependencies
RUN if [ -f pnpm-lock.yaml ]; then pnpm install --prod --frozen-lockfile; else npm ci --only=production; fi

# Copy built application from builder stage
COPY --from=builder /app/LocalMind-Backend/dist ./dist
COPY --from=builder /app/LocalMind-Backend/types ./types

# Create directories for uploads and data
RUN mkdir -p /app/uploads /app/data && \
    chown -R localmind:localmind /app

# Switch to non-root user
USER localmind

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/server.js"]
