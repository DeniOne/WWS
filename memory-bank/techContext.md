# ⚙️ Технический контекст проекта

## 🏗️ Технологический стек

### Frontend
- **React 18+** - основная библиотека для UI
- **Next.js 14+** - фреймворк для SSR и статической генерации
- **TypeScript** - типизированный JavaScript
- **Tailwind CSS** - utility-first CSS фреймворк
- **Framer Motion** - анимации и переходы
- **React Query** - управление состоянием сервера

### Mobile
- **React Native 0.72+** - кроссплатформенная разработка
- **Expo** - инструменты и сервисы для React Native
- **React Navigation** - навигация в мобильном приложении
- **React Native Reanimated** - производительные анимации
- **React Native Gesture Handler** - обработка жестов

### Backend
- **Node.js 18+** - JavaScript runtime
- **NestJS** - фреймворк для Node.js с TypeScript
- **Express.js** - веб-фреймворк для Node.js
- **Python 3.9+** - для AI/ML компонентов
- **FastAPI** - современный веб-фреймворк для Python
- **Django REST Framework** - альтернативный Python фреймворк

### Базы данных
- **PostgreSQL 14+** - основная реляционная БД
- **Redis 6+** - кэш и сессии
- **MongoDB 6+** - документная БД для логов
- **InfluxDB 2.0** - time-series БД для метрик
- **TimescaleDB** - расширение PostgreSQL для временных рядов

### Облако и DevOps
- **AWS/GCP/Azure** - облачные провайдеры
- **Docker** - контейнеризация
- **Kubernetes** - оркестрация контейнеров
- **Terraform** - Infrastructure as Code
- **GitHub Actions** - CI/CD пайплайны
- **Prometheus + Grafana** - мониторинг

## 🔌 Интеграции

### Носимые устройства
- **Apple HealthKit** - iOS устройства и Apple Watch
- **Google Health Connect** - Android устройства и Wear OS
- **Fitbit Web API** - OAuth2, данные сна/HR/ECG
- **Garmin Health API** - продвинутые метрики активности
- **Samsung Health SDK** - Samsung устройства
- **Huawei Health API** - Huawei устройства
- **Xiaomi Mi Band** - BLE подключения

### Мессенджеры
- **Telegram Bot API** - основной канал связи
- **WhatsApp Business API** - для семейного общения
- **Zalo Official Account** - для вьетнамского рынка
- **Facebook Messenger Platform** - для глобальной аудитории

### Внешние сервисы
- **Firebase** - push уведомления, аналитика, crash reporting
- **Twilio** - SMS, email, голосовые вызовы
- **SendGrid** - email маркетинг
- **Stripe/PayPal** - платежная система
- **OpenAI API** - AI ассистент и чат-бот
- **Google Maps API** - геолокация и карты

### Нейротехнологии (будущие)
- **Neuralink API** - прямые нейроинтерфейсы
- **Synchron API** - Stentrode устройства
- **Kernel API** - неинвазивные нейротехнологии

## 🏛️ Архитектурные решения

### Микросервисная архитектура
- **Auth Service** - аутентификация и авторизация
- **Health Service** - медицинские данные
- **Wearables Service** - интеграция с устройствами
- **Emergency Service** - экстренная помощь
- **Community Service** - социальные функции
- **Marketplace Service** - товары и услуги
- **AI Service** - искусственный интеллект
- **Research Service** - научные данные

### API Gateway
- **Kong/Nginx** - единая точка входа
- **Rate Limiting** - ограничение запросов
- **Load Balancing** - распределение нагрузки
- **SSL Termination** - завершение SSL
- **Authentication** - проверка токенов

### Message Queue
- **Apache Kafka** - обработка событий
- **RabbitMQ** - надежная доставка сообщений
- **Redis Pub/Sub** - простые уведомления
- **AWS SQS** - управляемая очередь сообщений

## 🔐 Безопасность

### Аутентификация и авторизация
- **JWT токены** - stateless аутентификация
- **OAuth 2.0** - интеграция с внешними сервисами
- **RBAC** - ролевая модель доступа
- **2FA** - двухфакторная аутентификация
- **SSO** - единый вход для корпоративных пользователей

### Шифрование
- **TLS 1.3** - шифрование трафика
- **AES-256** - шифрование данных
- **RSA 4096** - асимметричное шифрование
- **PBKDF2** - хеширование паролей
- **Key Rotation** - регулярная смена ключей

### Соответствие стандартам
- **GDPR** - защита персональных данных в ЕС
- **HIPAA** - стандарты медицинских данных в США
- **SOC 2** - безопасность и доступность
- **ISO 27001** - управление информационной безопасностью

## 📊 Мониторинг и аналитика

### Логирование
- **ELK Stack** - Elasticsearch, Logstash, Kibana
- **Fluentd** - сбор логов
- **Winston** - логирование в Node.js
- **Structured Logging** - структурированные логи в JSON

### Метрики
- **Prometheus** - сбор метрик
- **Grafana** - визуализация метрик
- **Jaeger** - трейсинг запросов
- **New Relic** - APM мониторинг

### Алерты
- **PagerDuty** - уведомления о критических событиях
- **Slack** - уведомления команды
- **Email** - email уведомления
- **SMS** - SMS для критических алертов

## 🧪 Тестирование

### Unit Testing
- **Jest** - тестирование JavaScript/TypeScript
- **Pytest** - тестирование Python
- **React Testing Library** - тестирование React компонентов
- **Enzyme** - дополнительное тестирование React

### Integration Testing
- **Supertest** - тестирование HTTP API
- **Testcontainers** - тестирование с реальными БД
- **Cypress** - E2E тестирование веб-приложений
- **Detox** - E2E тестирование мобильных приложений

### Performance Testing
- **Artillery** - нагрузочное тестирование
- **K6** - современное нагрузочное тестирование
- **Lighthouse** - аудит производительности веб-страниц
- **React DevTools Profiler** - профилирование React

## 🚀 Развертывание

### Контейнеризация
- **Docker** - контейнеризация приложений
- **Docker Compose** - локальная разработка
- **Multi-stage builds** - оптимизация образов
- **Health checks** - проверка состояния контейнеров

### Оркестрация
- **Kubernetes** - управление контейнерами
- **Helm** - пакетный менеджер для Kubernetes
- **Istio** - service mesh
- **ArgoCD** - GitOps развертывание

### CI/CD
- **GitHub Actions** - автоматизация сборки и развертывания
- **GitLab CI** - альтернативная CI/CD платформа
- **Jenkins** - традиционная CI/CD система
- **Spinnaker** - продвинутая CD платформа

## 📱 Мобильная разработка

### React Native
- **Expo** - инструменты и сервисы
- **React Navigation** - навигация
- **React Native Reanimated** - анимации
- **React Native Gesture Handler** - жесты
- **React Native Paper** - Material Design компоненты

### Нативные модули
- **HealthKit** - интеграция с Apple Health
- **Google Fit** - интеграция с Google Health
- **Bluetooth** - подключение к носимым устройствам
- **Camera** - сканирование QR кодов
- **Push Notifications** - уведомления

### Платформы
- **iOS** - App Store
- **Android** - Google Play
- **Huawei AppGallery** - для китайского рынка
- **Samsung Galaxy Store** - для Samsung устройств

## 🌐 Веб-разработка

### React/Next.js
- **Server-Side Rendering** - SSR для SEO
- **Static Site Generation** - SSG для производительности
- **API Routes** - серверные API
- **Middleware** - промежуточное ПО
- **Image Optimization** - оптимизация изображений

### Стилизация
- **Tailwind CSS** - utility-first CSS
- **Styled Components** - CSS-in-JS
- **CSS Modules** - модульные стили
- **Sass/SCSS** - препроцессор CSS

### Оптимизация
- **Code Splitting** - разделение кода
- **Lazy Loading** - ленивая загрузка
- **Tree Shaking** - удаление неиспользуемого кода
- **Bundle Analysis** - анализ размера бандла

## 🤖 AI/ML компоненты

### Machine Learning
- **TensorFlow** - фреймворк для ML
- **PyTorch** - альтернативный ML фреймворк
- **Scikit-learn** - классические ML алгоритмы
- **Pandas** - анализ данных
- **NumPy** - численные вычисления

### Natural Language Processing
- **OpenAI GPT** - языковые модели
- **Hugging Face Transformers** - предобученные модели
- **spaCy** - обработка естественного языка
- **NLTK** - инструменты для NLP

### Computer Vision
- **OpenCV** - компьютерное зрение
- **PIL/Pillow** - обработка изображений
- **scikit-image** - обработка изображений
- **YOLO** - детекция объектов

## 🔗 Связанные документы

- [Краткое описание проекта](projectbrief.md)
- [Активный контекст](activeContext.md)
- [Системные паттерны](systemPatterns.md)
- [Техническая архитектура](../docs/architecture/system-architecture.md)

---

*Последнее обновление: 14.09.2025*
