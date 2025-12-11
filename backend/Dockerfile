# Build stage
FROM node:20-bullseye-slim AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-bullseye-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm install --production

# Copy Prisma schema
COPY prisma ./prisma/

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Generate Prisma Client for production
RUN npx prisma generate

# Create a non-root user (Debian-compatible)
RUN groupadd -g 1001 nodejs && \
  useradd -u 1001 -g nodejs -m -s /bin/sh nodejs

# Change ownership of app files
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["npm", "start"]
