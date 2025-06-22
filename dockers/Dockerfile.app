# Stage 1: Installer - Install dependencies and build  
FROM node:22-alpine AS installer
WORKDIR /app

# Install pnpm and turbo globally
RUN npm install -g pnpm turbo

# Copy workspace configuration
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./

# Copy all package.json files in apps directory
COPY apps/*/package.json ./apps/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

WORKDIR /app/apps/my-app
RUN pnpm run build

WORKDIR /app

# Find the actual vite app directory and create runtime structure
RUN VITE_APP_DIR=$(find /app/apps -name "dist" -type d | head -1 | xargs dirname) && \
    mkdir -p /app/runtime/vite-app && \
    cp -r $VITE_APP_DIR/dist /app/runtime/vite-app/ && \
    cp $VITE_APP_DIR/package.json /app/runtime/vite-app/ && \
    find $VITE_APP_DIR -name "vite.config.*" -exec cp {} /app/runtime/vite-app/ \; 2>/dev/null || true

# Stage 2: Runner - Production runtime with nginx
FROM nginx:alpine AS runner

# Install Node.js for potential SSR or API routes (optional)
RUN apk add --no-cache nodejs npm

# Remove default nginx config
RUN rm -rf /usr/share/nginx/html/*

# Copy built Vite app to nginx html directory
COPY --from=installer /app/runtime/vite-app/dist /usr/share/nginx/html

# Create custom nginx config for SPA
RUN echo 'server { \
    listen 3001; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    # Handle client-side routing \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    \
    # Cache static assets \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
    \
    # Security headers \
    add_header X-Frame-Options "SAMEORIGIN" always; \
    add_header X-Content-Type-Options "nosniff" always; \
    add_header X-XSS-Protection "1; mode=block" always; \
    \
    # Gzip compression \
    gzip on; \
    gzip_vary on; \
    gzip_min_length 1024; \
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json; \
}' > /etc/nginx/conf.d/default.conf

# Expose port 3001
EXPOSE 3001

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
