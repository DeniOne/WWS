# 🎓 Education Service - Stroke Academy

## Обзор сервиса

**Education Service** отвечает за образовательную платформу "Stroke Academy", включающую вебинары, курсы, сертификаты и систему обучения для всех типов пользователей.

## Функциональность

### Основные функции
- **Планирование вебинаров** - создание, редактирование, отмена
- **Управление курсами** - создание, структурирование, публикация
- **Система записи** - автоматическая запись вебинаров
- **Прогресс обучения** - отслеживание прогресса пользователей
- **Сертификаты** - генерация и выдача сертификатов
- **Контент-менеджмент** - управление образовательными материалами

### Целевые аудитории
- **Пациенты** - базовые курсы по восстановлению
- **Семьи** - обучение уходу и поддержке
- **Врачи** - профессиональное развитие
- **Волонтеры** - подготовка к работе
- **Партнеры** - обучение продуктам/услугам

## API Endpoints

### Вебинары
```http
GET /api/v1/webinars
POST /api/v1/webinars
GET /api/v1/webinars/{id}
PUT /api/v1/webinars/{id}
DELETE /api/v1/webinars/{id}
POST /api/v1/webinars/{id}/register
POST /api/v1/webinars/{id}/unregister
GET /api/v1/webinars/{id}/participants
```

### Курсы
```http
GET /api/v1/courses
POST /api/v1/courses
GET /api/v1/courses/{id}
PUT /api/v1/courses/{id}
DELETE /api/v1/courses/{id}
POST /api/v1/courses/{id}/enroll
POST /api/v1/courses/{id}/unenroll
GET /api/v1/courses/{id}/lessons
POST /api/v1/courses/{id}/lessons
```

### Прогресс
```http
GET /api/v1/progress/{user_id}
GET /api/v1/progress/{user_id}/courses
GET /api/v1/progress/{user_id}/webinars
POST /api/v1/progress/update
GET /api/v1/progress/{user_id}/certificates
```

## База данных

### Таблица courses
```sql
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    level VARCHAR(50), -- beginner, intermediate, advanced
    language VARCHAR(10) DEFAULT 'ru',
    duration_hours INTEGER,
    is_published BOOLEAN DEFAULT FALSE,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Таблица webinars
```sql
CREATE TABLE webinars (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    speaker_name VARCHAR(100),
    speaker_bio TEXT,
    scheduled_at TIMESTAMP NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    meeting_url VARCHAR(500),
    recording_url VARCHAR(500),
    is_published BOOLEAN DEFAULT FALSE,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Таблица enrollments
```sql
CREATE TABLE enrollments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    course_id INTEGER REFERENCES courses(id),
    enrolled_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    progress_percentage INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMP,
    UNIQUE(user_id, course_id)
);
```

### Таблица webinar_registrations
```sql
CREATE TABLE webinar_registrations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    webinar_id INTEGER REFERENCES webinars(id),
    registered_at TIMESTAMP DEFAULT NOW(),
    attended_at TIMESTAMP,
    UNIQUE(user_id, webinar_id)
);
```

### Таблица certificates
```sql
CREATE TABLE certificates (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    course_id INTEGER REFERENCES courses(id),
    certificate_number VARCHAR(50) UNIQUE,
    issued_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    pdf_url VARCHAR(500),
    is_valid BOOLEAN DEFAULT TRUE
);
```

## Интеграции

### Zoom API
- **Создание встреч** - автоматическое создание Zoom комнат
- **Управление участниками** - добавление/удаление участников
- **Запись** - автоматическая запись вебинаров
- **Аналитика** - статистика участия

### YouTube API
- **Загрузка записей** - автоматическая загрузка на YouTube
- **Управление плейлистами** - организация контента
- **Метаданные** - добавление описаний и тегов
- **Приватность** - настройка доступа

### Email уведомления
- **Напоминания** - уведомления о предстоящих вебинарах
- **Сертификаты** - отправка сертификатов по email
- **Прогресс** - уведомления о достижениях
- **Новые курсы** - анонсы новых материалов

## UI/UX компоненты

### Вебинары
- **Календарь вебинаров** - отображение расписания
- **Карточка вебинара** - информация о вебинаре
- **Форма регистрации** - простая регистрация
- **Плеер записи** - просмотр записей

### Курсы
- **Каталог курсов** - поиск и фильтрация
- **Страница курса** - детальная информация
- **Плеер уроков** - воспроизведение контента
- **Прогресс-бар** - визуализация прогресса

### Сертификаты
- **Галерея сертификатов** - отображение достижений
- **PDF просмотр** - просмотр сертификата
- **Поделиться** - социальные сети
- **Печать** - печать сертификата

## Бизнес-логика

### Планирование вебинаров
1. **Создание вебинара** - заполнение базовой информации
2. **Настройка Zoom** - автоматическое создание встречи
3. **Публикация** - размещение в календаре
4. **Регистрация** - пользователи записываются
5. **Проведение** - вебинар проходит
6. **Запись** - автоматическая запись
7. **Публикация записи** - размещение на YouTube

### Система курсов
1. **Создание курса** - структурирование материала
2. **Добавление уроков** - создание контента
3. **Публикация** - курс становится доступен
4. **Запись** - пользователи записываются
5. **Изучение** - прохождение уроков
6. **Тестирование** - проверка знаний
7. **Сертификация** - выдача сертификата

### Прогресс обучения
- **Отслеживание** - автоматическое отслеживание прогресса
- **Уведомления** - напоминания о продолжении обучения
- **Мотивация** - достижения и бейджи
- **Аналитика** - статистика обучения

## Безопасность

### Доступ к контенту
- **Роли** - разные уровни доступа
- **Платежи** - платные курсы
- **География** - региональные ограничения
- **Время** - ограничения по времени

### Защита контента
- **DRM** - защита от копирования
- **Watermarking** - водяные знаки
- **Access Control** - контроль доступа
- **Audit Logs** - логирование доступа

## Мониторинг

### Метрики
- **Регистрации** - количество записей на курсы/вебинары
- **Посещаемость** - активность пользователей
- **Завершение** - процент завершения курсов
- **Удовлетворенность** - рейтинги и отзывы

### Алерты
- **Технические проблемы** - сбои в работе
- **Низкая посещаемость** - предупреждения
- **Проблемы с записью** - ошибки записи
- **Безопасность** - подозрительная активность

## Масштабирование

### Производительность
- **CDN** - доставка видео контента
- **Кэширование** - кэш часто запрашиваемых данных
- **Load Balancing** - распределение нагрузки
- **Database Optimization** - оптимизация запросов

### Доступность
- **Redundancy** - резервные серверы
- **Failover** - автоматическое переключение
- **Backup** - резервное копирование
- **Disaster Recovery** - восстановление после сбоев

---

*Education Service - Stroke Academy - последнее обновление: 14.09.2025*
