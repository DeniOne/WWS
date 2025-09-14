# 📚 Документация проекта "Without Words Stroke"

## 🎯 Обзор проекта
**Without Words Stroke** (WWS) - комплексная экосистема для людей, перенесших инсульт, их семей и медицинских специалистов. Платформа объединяет профилактику, экстренную помощь, социальную поддержку, маркетплейс услуг и долгосрочную интеграцию с нейротехнологиями.

## 🏷️ Название проекта
- **Полное название**: Without Words Stroke
- **Короткая версия**: WWS
- **Домены**: withoutwordsstroke.com, wws.health, wws.care, wws.life

## 📁 Структура документации

### 🏗️ Архитектура
- [Системная архитектура](architecture/system-architecture.md)
- [Микросервисная архитектура](architecture/microservices.md)
- [API Gateway](architecture/api-gateway.md)
- [Схема базы данных](architecture/database-schema.md)

### 🔗 Интеграции
- [Носимые устройства](integrations/wearables-integration.md) - интеграция с Apple Watch, Fitbit, Garmin и другими устройствами

### 🧠 Исследования и нейротехнологии
- [Стратегия сбора данных](research/data-collection-strategy.md)
- [Партнерства с нейротехнологиями](research/research-partnerships.md)
- [Платформа клинических испытаний](research/clinical-trial-platform.md)
- [Интеграция с нейротехнологиями](research/neurotechnology-integration.md)

### 🔌 API
- [REST API спецификация](api/rest-api.md)
- [API для ролевой модели](api/role-based-api.md) - управление ролями и разрешениями
- [GraphQL схема](api/graphql-schema.md)
- [WebSocket API](api/websocket-api.md)

### ⚙️ Сервисы
- [Education Service](services/education-service.md) - Stroke Academy, вебинары, курсы
- [Registry Service](services/registry-service.md) - Реестр клиник, бенчмаркинг
- [Интеграции с внешними сервисами](api/external-integrations.md)

### 🗄️ База данных
- [Схема PostgreSQL](database/postgresql-schema.md)
- [Миграции](database/migrations.md)
- [Индексы и оптимизация](database/optimization.md)
- [Backup и восстановление](database/backup.md)

### 💻 Frontend
- [React/Next.js документация](frontend/react-docs.md)
- [Компоненты UI](frontend/ui-components.md)
- [Состояние приложения](frontend/state-management.md)
- [Роутинг](frontend/routing.md)

### 🎨 UX/UI
- [Структура интерфейса портала](ux-ui/portal-interface-structure.md) - тематические группы и навигация
- [Компоненты интерфейса](ux-ui/interface-components.md) - детальные UI компоненты для каждой тематической группы

### 🎨 Дизайн
- [AI Designer Prompt](design/ai-designer-prompt.md) - детальный промпт для Loveble AI
- [Ролевая модель и интерфейсы](ux-ui/user-roles-and-interfaces.md) - многоуровневая система ролей и ЛК

### 📱 Mobile
- [React Native документация](mobile/react-native-docs.md)
- [Нативные модули](mobile/native-modules.md)
- [Push уведомления](mobile/push-notifications.md)
- [Офлайн режим](mobile/offline-mode.md)

### ⚙️ Backend
- [Node.js/NestJS документация](backend/nodejs-docs.md)
- [Микросервисы](backend/microservices.md)
- [Аутентификация и авторизация](backend/auth.md)
- [Логирование и мониторинг](backend/logging.md)

### 🚀 Развертывание
- [Docker конфигурация](deployment/docker.md)
- [Kubernetes манифесты](deployment/kubernetes.md)
- [CI/CD пайплайн](deployment/cicd.md)
- [Мониторинг и алерты](deployment/monitoring.md)

### 🚀 Разработка
- [План разработки MVP](development/mvp-development-plan.md) - детальный план создания MVP
- [Web-First стратегия](development/web-first-strategy.md) - подход "сначала web-портал, потом приложение"

### ⚙️ Настройка
- [Инструкция по настройке Git](setup/git-setup-instructions.md) - подключение к GitHub репозиторию

### 🧪 Тестирование
- [Стратегия тестирования](testing/testing-strategy.md)
- [Unit тесты](testing/unit-tests.md)
- [Integration тесты](testing/integration-tests.md)
- [E2E тесты](testing/e2e-tests.md)

### 🔒 Безопасность
- [Политика безопасности](security/security-policy.md)
- [GDPR/HIPAA compliance](security/compliance.md)
- [Шифрование данных](security/encryption.md)
- [Аудит безопасности](security/security-audit.md)

## 🚀 Быстрый старт

### Предварительные требования
- Node.js 18+
- Python 3.9+
- PostgreSQL 14+
- Redis 6+
- Docker & Docker Compose

### Установка
```bash
# Клонирование репозитория
git clone <repository-url>
cd stroke-support-platform

# Установка зависимостей
npm install
pip install -r requirements.txt

# Настройка базы данных
docker-compose up -d postgres redis

# Запуск миграций
npm run db:migrate

# Запуск приложения
npm run dev
```

### Переменные окружения
Скопируйте `.env.example` в `.env` и настройте:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/stroke_platform
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
FIREBASE_API_KEY=your-firebase-key
```

## 📋 Roadmap

### MVP (6-8 месяцев)
- [x] Планирование архитектуры
- [ ] Backend API (авторизация, SOS, форум)
- [ ] Мобильное приложение (базовый функционал)
- [ ] Web-портал (регистрация + просмотр)
- [ ] База данных и миграции

### Расширение (12-18 месяцев)
- [ ] Интеграция с носимыми устройствами
- [ ] Маркетплейс товаров и услуг
- [ ] Buddy-система и семейный кабинет
- [ ] Геймификация

### Экосистема (24+ месяца)
- [ ] AI-ассистент
- [ ] Телемедицина
- [ ] Предиктивная аналитика
- [ ] VR/AR реабилитация

## 🤝 Участие в разработке

### Команда
- **Product Owner**: Denis Govako
- **Tech Lead**: TBD
- **Backend Developer**: TBD
- **Frontend Developer**: TBD
- **Mobile Developer**: TBD
- **DevOps Engineer**: TBD
- **QA Engineer**: TBD

### Процесс разработки
1. Создание feature branch из `develop`
2. Разработка с тестами
3. Code review
4. Merge в `develop`
5. Деплой на staging
6. Тестирование
7. Merge в `main`
8. Деплой на production

## 📞 Контакты
- **Email**: denis@stroke-support.com
- **Telegram**: @denisgovako
- **GitHub**: @denisgovako

---
*Последнее обновление: 14.09.2025*
