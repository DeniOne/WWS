# 🐳 Docker Конфигурация

## Обзор

Проект использует Docker для контейнеризации всех сервисов, что обеспечивает консистентность окружения, простоту развертывания и масштабируемость.

## Структура Docker файлов

```
docker/
├── docker-compose.yml          # Основной compose файл
├── docker-compose.prod.yml     # Production конфигурация
├── docker-compose.dev.yml      # Development конфигурация
├── backend/
│   └── Dockerfile              # Backend контейнер
├── frontend/
│   └── Dockerfile              # Frontend контейнер
├── mobile/
│   └── Dockerfile              # Mobile build контейнер
├── nginx/
│   ├── nginx.conf              # Nginx конфигурация
│   └── ssl/                    # SSL сертификаты
└── postgres/
    ├── init.sql                # Инициализация БД
    └── postgresql.conf         # PostgreSQL конфигурация
```

## Основной docker-compose.yml

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:14-alpine
    container_name: stroke_postgres
    environment:
      POSTGRES_DB: stroke_platform
      POSTGRES_USER: stroke_user
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./postgres/init.sql:/docker-entrypoint-initdb.d/init.sql
      - ./postgres/postgresql.conf:/etc/postgresql/postgresql.conf
    ports:
      - "5432:5432"
    networks:
      - stroke_network
    restart: unless-stopped

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: stroke_redis
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    networks:
      - stroke_network
    restart: unless-stopped

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: stroke_backend
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://stroke_user:${POSTGRES_PASSWORD}@postgres:5432/stroke_platform
      - REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379
      - JWT_SECRET=${JWT_SECRET}
      - FIREBASE_API_KEY=${FIREBASE_API_KEY}
      - TWILIO_ACCOUNT_SID=${TWILIO_ACCOUNT_SID}
      - TWILIO_AUTH_TOKEN=${TWILIO_AUTH_TOKEN}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    ports:
      - "3000:3000"
    depends_on:
      - postgres
      - redis
    networks:
      - stroke_network
    restart: unless-stopped
    volumes:
      - ./backend/logs:/app/logs

  # Frontend Web App
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: stroke_frontend
    environment:
      - REACT_APP_API_URL=http://localhost:3000/v1
      - REACT_APP_ENV=production
    ports:
      - "3001:80"
    depends_on:
      - backend
    networks:
      - stroke_network
    restart: unless-stopped

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: stroke_nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
      - frontend_build:/usr/share/nginx/html
    depends_on:
      - frontend
      - backend
    networks:
      - stroke_network
    restart: unless-stopped

  # Monitoring - Prometheus
  prometheus:
    image: prom/prometheus:latest
    container_name: stroke_prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=200h'
      - '--web.enable-lifecycle'
    networks:
      - stroke_network
    restart: unless-stopped

  # Monitoring - Grafana
  grafana:
    image: grafana/grafana:latest
    container_name: stroke_grafana
    ports:
      - "3002:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
    volumes:
      - grafana_data:/var/lib/grafana
      - ./monitoring/grafana/dashboards:/etc/grafana/provisioning/dashboards
      - ./monitoring/grafana/datasources:/etc/grafana/provisioning/datasources
    depends_on:
      - prometheus
    networks:
      - stroke_network
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
  prometheus_data:
  grafana_data:
  frontend_build:

networks:
  stroke_network:
    driver: bridge
```

## Backend Dockerfile

```dockerfile
# Multi-stage build для оптимизации размера
FROM node:18-alpine AS builder

WORKDIR /app

# Копирование package files
COPY package*.json ./
COPY tsconfig*.json ./

# Установка зависимостей
RUN npm ci --only=production && npm cache clean --force

# Копирование исходного кода
COPY src/ ./src/

# Сборка приложения
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Создание пользователя для безопасности
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

WORKDIR /app

# Копирование package files
COPY package*.json ./

# Установка только production зависимостей
RUN npm ci --only=production && npm cache clean --force

# Копирование собранного приложения
COPY --from=builder /app/dist ./dist

# Создание директории для логов
RUN mkdir -p /app/logs && chown -R nestjs:nodejs /app

# Переключение на пользователя nestjs
USER nestjs

# Открытие порта
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Запуск приложения
CMD ["node", "dist/main.js"]
```

## Frontend Dockerfile

```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder

WORKDIR /app

# Копирование package files
COPY package*.json ./

# Установка зависимостей
RUN npm ci

# Копирование исходного кода
COPY . .

# Сборка приложения
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Копирование собранного приложения
COPY --from=builder /app/build /usr/share/nginx/html

# Копирование nginx конфигурации
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открытие порта
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Запуск nginx
CMD ["nginx", "-g", "daemon off;"]
```

## Nginx конфигурация

```nginx
# nginx/nginx.conf
upstream backend {
    server backend:3000;
}

upstream frontend {
    server frontend:80;
}

# Rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;

server {
    listen 80;
    server_name localhost;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # API routes
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # CORS headers
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
        add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization";
        
        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin *;
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
            add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization";
            add_header Access-Control-Max-Age 1728000;
            add_header Content-Type 'text/plain; charset=utf-8';
            add_header Content-Length 0;
            return 204;
        }
    }

    # Login endpoint with stricter rate limiting
    location /api/auth/login {
        limit_req zone=login burst=5 nodelay;
        
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend routes
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        proxy_pass http://frontend;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}

# SSL configuration (for production)
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Same configuration as HTTP server
    # ... (copy from above)
}
```

## Production docker-compose.prod.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    container_name: stroke_postgres_prod
    environment:
      POSTGRES_DB: stroke_platform
      POSTGRES_USER: stroke_user
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./postgres/postgresql.conf:/etc/postgresql/postgresql.conf
    networks:
      - stroke_network
    restart: always
    deploy:
      resources:
        limits:
          memory: 1G
        reservations:
          memory: 512M

  redis:
    image: redis:7-alpine
    container_name: stroke_redis_prod
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    networks:
      - stroke_network
    restart: always
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: stroke_backend_prod
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://stroke_user:${POSTGRES_PASSWORD}@postgres:5432/stroke_platform
      - REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379
      - JWT_SECRET=${JWT_SECRET}
      - FIREBASE_API_KEY=${FIREBASE_API_KEY}
      - TWILIO_ACCOUNT_SID=${TWILIO_ACCOUNT_SID}
      - TWILIO_AUTH_TOKEN=${TWILIO_AUTH_TOKEN}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    depends_on:
      - postgres
      - redis
    networks:
      - stroke_network
    restart: always
    deploy:
      replicas: 2
      resources:
        limits:
          memory: 1G
        reservations:
          memory: 512M
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: stroke_frontend_prod
    environment:
      - REACT_APP_API_URL=https://api.stroke-support.com/v1
      - REACT_APP_ENV=production
    depends_on:
      - backend
    networks:
      - stroke_network
    restart: always
    deploy:
      replicas: 2
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M

  nginx:
    image: nginx:alpine
    container_name: stroke_nginx_prod
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    networks:
      - stroke_network
    restart: always
    deploy:
      resources:
        limits:
          memory: 256M
        reservations:
          memory: 128M

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local

networks:
  stroke_network:
    driver: bridge
```

## Development docker-compose.dev.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    container_name: stroke_postgres_dev
    environment:
      POSTGRES_DB: stroke_platform_dev
      POSTGRES_USER: stroke_user
      POSTGRES_PASSWORD: dev_password
    volumes:
      - postgres_dev_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - stroke_network

  redis:
    image: redis:7-alpine
    container_name: stroke_redis_dev
    ports:
      - "6379:6379"
    networks:
      - stroke_network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    container_name: stroke_backend_dev
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://stroke_user:dev_password@postgres:5432/stroke_platform_dev
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=dev_jwt_secret
    ports:
      - "3000:3000"
    volumes:
      - ./backend:/app
      - /app/node_modules
    depends_on:
      - postgres
      - redis
    networks:
      - stroke_network
    command: npm run start:dev

volumes:
  postgres_dev_data:

networks:
  stroke_network:
    driver: bridge
```

## Backend Dockerfile для разработки

```dockerfile
# Dockerfile.dev
FROM node:18-alpine

WORKDIR /app

# Установка зависимостей
COPY package*.json ./
RUN npm install

# Копирование исходного кода
COPY . .

# Установка nodemon для hot reload
RUN npm install -g nodemon

# Открытие порта
EXPOSE 3000

# Запуск в режиме разработки
CMD ["npm", "run", "start:dev"]
```

## Скрипты для управления

### start.sh
```bash
#!/bin/bash

# Запуск development окружения
echo "Запуск development окружения..."
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

echo "Ожидание запуска сервисов..."
sleep 10

echo "Выполнение миграций..."
docker-compose exec backend npm run migration:run

echo "Development окружение запущено!"
echo "Backend: http://localhost:3000"
echo "Frontend: http://localhost:3001"
echo "PostgreSQL: localhost:5432"
echo "Redis: localhost:6379"
```

### deploy.sh
```bash
#!/bin/bash

# Production деплой
echo "Запуск production деплоя..."

# Остановка существующих контейнеров
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down

# Сборка новых образов
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Запуск сервисов
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

echo "Выполнение миграций..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec backend npm run migration:run

echo "Production деплой завершен!"
```

### backup.sh
```bash
#!/bin/bash

# Backup базы данных
echo "Создание backup базы данных..."

BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="stroke_platform_${DATE}.sql"

mkdir -p $BACKUP_DIR

docker-compose exec postgres pg_dump -U stroke_user stroke_platform > "${BACKUP_DIR}/${BACKUP_FILE}"

echo "Backup создан: ${BACKUP_DIR}/${BACKUP_FILE}"
```

## Мониторинг и логи

### Логирование
```yaml
# Добавить в docker-compose.yml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

### Health checks
```yaml
# Пример health check для backend
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

## Переменные окружения

### .env.example
```env
# Database
POSTGRES_PASSWORD=your_secure_password
REDIS_PASSWORD=your_redis_password

# JWT
JWT_SECRET=your_super_secret_jwt_key

# External APIs
FIREBASE_API_KEY=your_firebase_key
FIREBASE_PROJECT_ID=your_project_id
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
OPENAI_API_KEY=your_openai_key

# Monitoring
GRAFANA_PASSWORD=your_grafana_password

# SSL (for production)
SSL_CERT_PATH=/etc/nginx/ssl/cert.pem
SSL_KEY_PATH=/etc/nginx/ssl/key.pem
```

---
*Последнее обновление: 14.09.2025*
