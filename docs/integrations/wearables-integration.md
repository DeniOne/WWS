# ⌚ Интеграция с носимыми устройствами

## 🎯 Краткая цель

Собирать данные о состоянии пользователя (шаги, пульс, давление, сон, ЭКГ, падения и т.д.) из популярных wearables (Apple Watch, Wear OS, Fitbit, Garmin, Xiaomi/Huawei и др.), нормализовать, хранить в ЛК и использовать для профилактики, алертов и аналитики.

## 🏗️ Архитектурная идея (в 3 предложениях)

**Клиент** (мобильное приложение) связывается с платформами wearables через их SDK/API и получает/подписывается на данные.

**Backend** принимает данные через защищённые эндпоинты, нормализует и кладёт в Time-series хранилище + PostgreSQL для метаданных.

**На основе нормализованных данных** работают правила (thresholds), ML-модуль предиктивной аналитики и SOS-логика.

## 📊 Какие данные мы будем поддерживать (приоритет)

### Высокий приоритет
- **Пульс** (resting, real-time)
- **Частота сердечных сокращений** в покое/активности + вариабельность (HRV)
- **Шаги, активность, калории**
- **Сон** (фазы, общая длительность)
- **Датчики падения/активации** (инциденты)

### Средний приоритет
- **Давление** (если поддерживается устройством)
- **ЭКГ** (при наличии) — важный клинически формат
- **SpO2** (кровяной кислород)
- **Температура тела** (если есть)

### Низкий приоритет
- **GPS/треки** (если пользователь разрешил)

## 🔗 С кем интегрироваться (основные каналы)

### iOS экосистема
- **Apple Health / HealthKit** (iOS / Apple Watch) — основная цель для iOS-пользователей

### Android экосистема
- **Google Fit / Health Connect** (Android / Wear OS) — для Android
- **Samsung Health** — SDK/permissions (ограниченно доступен)

### Облачные провайдеры
- **Fitbit Web API** — OAuth2, подробные данные сна/HR/ECG (частично)
- **Garmin Health API** — продвинутые метрики активности и сон

### Азиатские бренды
- **Huawei Health / Huawei Mobile Services** — для Huawei-устройств
- **Xiaomi / Mi Band** — часто через сторонние SDK или BLE (локально)

### Прямые подключения
- **BLE (Bluetooth Low Energy)** — когда устройство не имеет облака/SDK (например локальные китайские браслеты)

## 🔐 Модели авторизации и передачи

### OAuth 2.0
- **Облачные API** (Fitbit, Garmin, Google)
- **Apple Sign-in/HealthKit** требует локальной интеграции через iPhone

### SDK на клиенте
- **Apple HealthKit / Google Health Connect** — данные считываются локально и отправляются в наш бэкенд по HTTPS
- **Пользователь предоставляет явные consent**

### Webhooks
- **Realtime-уведомления** (если провайдер их поддерживает)

### BLE pairing
- **Дешёвые браслеты** или прямое соединение, реализуем на мобильном клиенте

## ⚡ Стратегии синхронизации данных

### Push (webhooks / SDK подписка)
- **Идеальный режим**: данные приходят по событиям

### Периодический pull
- **Резервный способ** (cron-jobs) для облачных API с rate limits

### Edge buffering
- **Если связь пропадает**, мобильное приложение кеширует данные и шлёт при восстановлении

### Первичная фильтрация на клиенте
- **Минимизируем трафик**: отправляем только дельты/события

## 🗄️ Нормализация и модель данных

### Сохраняем сырой payload + нормализованную запись

```sql
-- Таблица users (существует)
-- Таблица device_accounts
CREATE TABLE device_accounts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    provider VARCHAR(50) NOT NULL, -- apple/fitbit/garmin
    provider_user_id VARCHAR(255),
    access_token_hash VARCHAR(255), -- не хранить plain
    refresh_token_hash VARCHAR(255),
    expires_at TIMESTAMP,
    scope TEXT,
    last_sync_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Таблица metrics_time_series
CREATE TABLE metrics_time_series (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    metric_type VARCHAR(50) NOT NULL, -- heart_rate, steps, sleep, ecg, bp, spo2
    value JSONB, -- json/float
    unit VARCHAR(20),
    timestamp TIMESTAMP NOT NULL,
    source VARCHAR(50), -- provider
    raw_payload_link TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Таблица alerts
CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    metric_type VARCHAR(50),
    severity VARCHAR(20), -- low/medium/high/critical
    created_at TIMESTAMP DEFAULT NOW(),
    resolved_at TIMESTAMP,
    meta JSONB
);

-- Дополнительно
CREATE TABLE activity_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    session_type VARCHAR(50),
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    duration_seconds INTEGER,
    calories_burned INTEGER,
    data JSONB
);

CREATE TABLE sleep_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    sleep_date DATE,
    bedtime TIMESTAMP,
    wake_time TIMESTAMP,
    total_sleep_minutes INTEGER,
    deep_sleep_minutes INTEGER,
    rem_sleep_minutes INTEGER,
    light_sleep_minutes INTEGER,
    data JSONB
);

CREATE TABLE ecg_records (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    record_date TIMESTAMP,
    duration_seconds INTEGER,
    data_blob_url TEXT, -- ссылка на S3 или blob storage
    analysis_result JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## ⚙️ Обработка реального времени и правила

### Pipeline
```
Ingest → Validate → Normalize → Store → Rules Engine → Notifier
```

### Rules Engine
- **Пороги** (настройки пользователя)
- **Сложные триггеры** (напр., резкое падение HR + падение акселерометра → сигнал тревоги)

### Notifier
- **Push/SMS/call/SOS**

## 📱 UI/UX: Личный кабинет

### Дашборд
- **Последние измерения**, тренды за 24ч / 7д / 30д

### История
- **Детальный таймлайн** показателей

### События
- **Список инцидентов** (падения, тревоги)

### Устройства
- **Список подключённых устройств**, sync status, возможность переподключить

### Конфиденциальность
- **Экран согласий** (какие данные мы собираем, как и зачем)

### Настройки алертов
- **Пороги, контактные лица**, правила эскалации

### Экспорт данных
- **Для врача**, удаление данных, перенос

### UX для инсультников
- **Крупные кнопки**, голосовые подсказки, экран упрощённого режима

## 🔒 Безопасность и приватность

### Согласие пользователя
- **Явное согласие** (Granular consent) при подключении каждого провайдера

### Шифрование
- **TLS in transit**, AES-256 at rest

### Токены
- **Минимизация хранимых токенов**: хранить только хэши и использовать безопасный токен-вендор

### Аудит
- **Логирование** sync/alert событий

### Политика хранения
- **Удалить raw** после X лет по умолчанию, возможность "архива" по запросу

### Соответствие
- **GDPR, местные законы** о мед. данных

## 📈 Мониторинг и масштабирование

### Ingest queue
- **Kafka / RabbitMQ** для устойчивости

### Time-series DB
- **InfluxDB / Timescale** (Postgres extension) для метрик, быстрых запросов и агрегатов

### Batch ETL для ML
- **Airflow**

### Метрики системы
- **Latency sync**, error rates, success sync per provider, alerts per user

## 🧪 Тестирование и QA

### Unit + Integration tests
- **Для каждого провайдера** (мокать API)

### E2E тесты
- **С реальными устройствами** (Apple Watch, Android watch, Mi Band, Fitbit)

### Load тесты
- **Для масштабирования** (симуляция миллиона пользователей)

### UX тестирование
- **С инсультниками** (включая афазию) — критично

## 🛠️ Работа с конкретными провайдерами

### Apple (iOS)
- **Использовать HealthKit**
- **Пользователь даёт разрешение** в iOS
- **Данные читаем локально** в приложении, затем отправляем на бэкенд по HTTPS
- **Для ECG** доступны записи в HealthKit (пользователь должен экспортировать/разрешить)
- **Документация**: HealthKit + HealthKit permissions

### Google (Android)
- **Health Connect / Google Fit**
- **Используем SDK и OAuth**
- **Аналогично** — читаем локально и синхронизируем

### Fitbit / Garmin
- **OAuth2, облачные API, webhooks**
- **Реализуем OAuth flow** в мобильном приложении или на вебе
- **Храним refresh tokens**, подписываемся на вебхуки в настройках приложения

### Samsung / Huawei / Xiaomi
- **SDKs и локальные интеграции** или проприетарные облачные API
- **Часто требует переговоров/партнёрств**

### BLE устройства без облака
- **Имплементируем BLE менеджер** в мобильном приложении
- **Читаем характеристики GATT** и отправляем данные
- **Сложнее** (множество моделей, разные GATT профили), но даёт охват дешёвых рынков

## 📋 Data governance и согласие

### При регистрации
- **Показываем**: какие данные собираем, с кем делимся (клиники, исследователи), срок хранения
- **Кнопки** «поделиться анонимно для исследований»

### Логирование согласий
- **Возможность полного удаления** данных («право на забвение»)

### Анонимизация
- **Опциональная анонимизация** перед передачей в исследования

## 🎯 Приоритеты для MVP интеграции

### Что делать первым
1. **HealthKit (iOS)** — большой охват Apple Watch
2. **Google Fit / Health Connect (Android)**
3. **Basic BLE** for cheap bands (если целевой рынок — Вьетнам/Юго-Восточная Азия)
4. **Fitbit + Garmin** (через OAuth)

**Это покроет ~80% нужд пользователей**

## ⏱️ Оценочный план работ

### Этапы
1. **Анализ и дизайн интеграций** — 1–2 недели
2. **Реализация HealthKit** (мобилка) + backend ingest — 2–3 недели
3. **Реализация Google Fit/Health Connect** — 2–3 недели
4. **Настройка storage/time-series** + rules engine — 2–4 недели
5. **FitBit / Garmin OAuth** + webhooks — 3–4 недели
6. **BLE baseline integration** (один тип браслета) — 3–4 недели

**Итого для полноценной базовой интеграции: 2–3 месяца командой из 2 моби-девов + 1 бэкэнд**

## 🔌 Примеры API эндпоинтов

```http
# OAuth callback
POST /api/v1/devices/oauth/callback
Content-Type: application/json
{
  "provider": "fitbit",
  "code": "oauth_code",
  "state": "user_state"
}

# Синхронизация данных
POST /api/v1/devices/sync
Authorization: Bearer <user_token>
Content-Type: application/json
{
  "user_id": 123,
  "device_id": "apple_watch_001",
  "metrics": [
    {
      "type": "heart_rate",
      "value": 75,
      "unit": "bpm",
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ],
  "signature": "hmac_signature"
}

# Получение временного ряда
GET /api/v1/metrics?user_id=123&from=2024-01-01&to=2024-01-31&type=heart_rate

# Создание алерта
POST /api/v1/alerts
Authorization: Bearer <user_token>
Content-Type: application/json
{
  "user_id": 123,
  "metric_type": "heart_rate",
  "severity": "high",
  "threshold": 100,
  "message": "Высокий пульс обнаружен"
}

# BLE pairing
POST /api/v1/devices/ble/pair
Authorization: Bearer <user_token>
Content-Type: application/json
{
  "device_name": "Mi Band 7",
  "mac_address": "AA:BB:CC:DD:EE:FF"
}
```

## ✅ Чек-лист для разработки интеграции

### Планирование
- [ ] Определить список поддерживаемых метрик и приоритет провайдеров
- [ ] Реализовать consent flow в приложении для каждого провайдера

### Backend
- [ ] Реализовать ingestion API + валидацию данных
- [ ] Настроить Time-series DB и схемы
- [ ] Реализовать Rules Engine для тревог

### Frontend
- [ ] UI: Личный кабинет, список устройств, настройки оповещений

### Операции
- [ ] Мониторинг и алерты на сбои синка
- [ ] Тестирование на реальных устройствах
- [ ] Политика безопасности и хранение токенов
- [ ] Документация для пользователей — как подключить устройство (шаг-за-шагом)

## 💡 Финальные советы

### Начни с основ
- **HealthKit + Health Connect** — это даёт быстрый охват с минимальным количеством сложных интеграций

### Нормализация данных
- **Делай нормализацию данных сразу** — в противном случае через 6 месяцев у тебя будет свалка разноформатных метрик

### Гибкость правил
- **Держи правила алертов гибкими** и настраиваемыми пользователем — разные люди переносят пульс/падения по-разному

### Юридические аспекты
- **Юридически оформляй доступ к данным** для исследований отдельно — это золотая жила для партнёрств с нейрокомпаниями, но требует прозрачности

## 🔗 Связанные документы

- [Системная архитектура](../architecture/system-architecture.md)
- [Стратегия сбора данных](../research/data-collection-strategy.md)
- [Партнёрства с нейротехнологиями](../research/research-partnerships.md)
- [REST API](../api/rest-api.md)
- [PostgreSQL схема](../database/postgresql-schema.md)

---

*Последнее обновление: 14.09.2025*
