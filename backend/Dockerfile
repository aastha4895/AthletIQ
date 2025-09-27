FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy application code
COPY . .

# Create uploads directory
RUN mkdir -p uploads logs

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S athletiq -u 1001

# Change ownership of app directory
RUN chown -R athletiq:nodejs /app
USER athletiq

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Start application
CMD ["node", "server.js"]