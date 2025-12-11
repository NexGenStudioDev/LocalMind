# ============================================
# Stage 1: Build Frontend
# ============================================
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY LocalMind-Frontend/package*.json ./
COPY LocalMind-Frontend/pnpm-lock.yaml* ./

# Install pnpm and dependencies
RUN npm install -g pnpm && \
    pnpm install --frozen-lockfile

# Copy frontend source code
COPY LocalMind-Frontend/ ./

# Build frontend for production
RUN pnpm run build

# ============================================
# Stage 2: Build Backend
# ============================================
FROM node:20-alpine AS backend-builder

WORKDIR /app/backend

# Copy backend package files
COPY LocalMind-Backend/package*.json ./
COPY LocalMind-Backend/pnpm-lock.yaml* ./

# Install pnpm and dependencies
RUN npm install -g pnpm && \
    pnpm install --frozen-lockfile

# Copy backend source code
COPY LocalMind-Backend/ ./

# Build backend (compile TypeScript)
RUN pnpm run build

# ============================================
# Stage 3: Production Image
# ============================================
FROM node:20-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user for security
RUN addgroup -g 1001 -S localmind && \
    adduser -S localmind -u 1001

WORKDIR /app

# Copy backend dependencies and built files
COPY --from=backend-builder /app/backend/package*.json ./
COPY --from=backend-builder /app/backend/pnpm-lock.yaml* ./
COPY --from=backend-builder /app/backend/node_modules ./node_modules
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=backend-builder /app/backend/types ./types

# Copy built frontend files to serve statically
COPY --from=frontend-builder /app/frontend/dist ./public

# Create directories for uploads and data
RUN mkdir -p /app/uploads /app/data && \
    chown -R localmind:localmind /app

# Switch to non-root user
USER localmind

# Expose application port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/index.js"]