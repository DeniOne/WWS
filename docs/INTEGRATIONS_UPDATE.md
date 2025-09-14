# 🔗 Обновление: Интеграция с носимыми устройствами

## 📋 Что добавлено

### 1. Новая документация
- **[Интеграция с носимыми устройствами](integrations/wearables-integration.md)** - полная техническая документация по интеграции с Apple Watch, Fitbit, Garmin и другими устройствами

### 2. Обновления архитектуры
- **Wearables Integration Service** - новый микросервис для работы с носимыми устройствами
- **Time-series Database** - InfluxDB для хранения метрик с устройств
- **Расширенные Health APIs** - детализация интеграций с различными провайдерами

### 3. Ключевые возможности

#### Сбор данных
- **Пульс** (resting, real-time, HRV)
- **Активность** (шаги, калории, упражнения)
- **Сон** (фазы, длительность, качество)
- **ЭКГ** (при наличии устройства)
- **Давление и SpO2** (если поддерживается)
- **Датчики падения** (инциденты и тревоги)

#### Поддерживаемые устройства
- **Apple Watch** (HealthKit)
- **Android/Wear OS** (Google Health Connect)
- **Fitbit** (OAuth2 API)
- **Garmin** (Health API)
- **Samsung Health** (SDK)
- **Huawei Health** (API)
- **Xiaomi Mi Band** (BLE)
- **Другие BLE устройства**

#### Архитектурные решения
- **OAuth 2.0** для облачных API
- **SDK интеграции** для локального считывания
- **BLE подключения** для дешёвых устройств
- **Нормализация данных** от разных провайдеров
- **Real-time мониторинг** и алерты

### 4. Техническая реализация

#### База данных
```sql
-- Устройства пользователей
CREATE TABLE device_accounts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    provider VARCHAR(50) NOT NULL,
    provider_user_id VARCHAR(255),
    access_token_hash VARCHAR(255),
    refresh_token_hash VARCHAR(255),
    expires_at TIMESTAMP,
    scope TEXT,
    last_sync_at TIMESTAMP
);

-- Временные ряды метрик
CREATE TABLE metrics_time_series (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    metric_type VARCHAR(50) NOT NULL,
    value JSONB,
    unit VARCHAR(20),
    timestamp TIMESTAMP NOT NULL,
    source VARCHAR(50),
    raw_payload_link TEXT
);
```

#### API эндпоинты
```http
POST /api/v1/devices/oauth/callback    # OAuth callback
POST /api/v1/devices/sync              # Синхронизация данных
GET  /api/v1/metrics                   # Получение временного ряда
POST /api/v1/alerts                    # Создание алертов
POST /api/v1/devices/ble/pair          # BLE подключение
```

### 5. План разработки

#### MVP (2-3 месяца)
1. **HealthKit (iOS)** - 2-3 недели
2. **Google Health Connect (Android)** - 2-3 недели
3. **Time-series DB + Rules Engine** - 2-4 недели
4. **Fitbit/Garmin OAuth** - 3-4 недели
5. **BLE baseline** - 3-4 недели

#### Команда
- **2 мобильных разработчика**
- **1 backend разработчик**

### 6. Безопасность и приватность

#### Согласие пользователя
- **Granular consent** для каждого провайдера
- **Прозрачная политика** сбора данных
- **Возможность удаления** данных

#### Шифрование
- **TLS in transit**
- **AES-256 at rest**
- **Безопасное хранение токенов**

#### Соответствие
- **GDPR/HIPAA** compliance
- **Аудит и логирование**
- **Политика хранения данных**

### 7. Мониторинг и масштабирование

#### Инфраструктура
- **Kafka/RabbitMQ** для ingest queue
- **InfluxDB/TimescaleDB** для time-series
- **Airflow** для batch ETL

#### Метрики
- **Latency sync**
- **Error rates**
- **Success sync per provider**
- **Alerts per user**

## 🎯 Следующие шаги

1. **Детализация API** - создать полную спецификацию REST API
2. **Схема базы данных** - детализировать PostgreSQL схему
3. **Мобильная интеграция** - документация по React Native
4. **Тестирование** - стратегия тестирования с реальными устройствами
5. **Безопасность** - детальная политика безопасности

## 📚 Связанные документы

- [Системная архитектура](architecture/system-architecture.md)
- [Стратегия сбора данных](research/data-collection-strategy.md)
- [REST API](api/rest-api.md)
- [PostgreSQL схема](database/postgresql-schema.md)

---

*Обновление: 14.09.2025*
