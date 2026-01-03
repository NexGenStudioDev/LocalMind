# ============================================
# Dockerfile for LocalMind Backend
# Production-ready Node.js/TypeScript backend
# ============================================

# ============================================
# Stage 1: Build
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm@latest

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build TypeScript to JavaScript
RUN pnpm run build

# ============================================
# Stage 2: Production
# ============================================
FROM node:20-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user for security
RUN addgroup -g 1001 -S localmind && \
    adduser -S localmind -u 1001

WORKDIR /app

# Copy package files and install production dependencies only
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm@latest && \
    pnpm install --frozen-lockfile --prod && \
    npm uninstall -g pnpm

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/types ./types

# Create directories for uploads and data
RUN mkdir -p /app/uploads /app/data && \
    chown -R localmind:localmind /app

# Switch to non-root user
USER localmind

# Expose application port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/server.js"]

