# 🔐 API для ролевой модели

## 🎯 Обзор

REST API для управления ролями, разрешениями и доступом пользователей в многоуровневой системе.

## 👥 Типы пользователей

### 1. 🏥 Пациент
**Роль**: `patient`
**Основные права**: Просмотр личных данных, ведение дневника, доступ к образовательному контенту

### 2. 👨‍⚕️ Врач
**Роль**: `doctor`
**Основные права**: Просмотр пациентов, назначение планов реабилитации, мониторинг данных

### 3. 🤝 Волонтер
**Роль**: `volunteer`
**Основные права**: Доступ к нуждающимся, отметки о помощи, расписание визитов

### 4. 🤝 Партнер
**Роль**: `partner`
**Основные права**: Размещение товаров/услуг, управление заказами, аналитика

### 5. ⚙️ Администратор
**Роль**: `admin`
**Основные права**: Управление пользователями, модерация контента, системная аналитика

## 🔑 Аутентификация и авторизация

### JWT токен
```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "roles": ["patient"],
  "permissions": [
    "read:own_health_data",
    "write:own_diary",
    "read:educational_content"
  ],
  "iat": 1694700000,
  "exp": 1694786400
}
```

### Заголовки запросов
```http
Authorization: Bearer <jwt_token>
X-User-Role: patient
X-Request-ID: uuid
```

## 📋 Управление ролями

### Получение списка ролей
```http
GET /api/v1/roles
Authorization: Bearer <admin_token>

Response 200:
{
  "roles": [
    {
      "id": 1,
      "name": "patient",
      "display_name": "Пациент",
      "description": "Пользователь, перенесший инсульт",
      "permissions": [
        "read:own_health_data",
        "write:own_diary",
        "read:educational_content"
      ],
      "created_at": "2024-09-14T10:00:00Z"
    }
  ]
}
```

### Создание роли
```http
POST /api/v1/roles
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "volunteer",
  "display_name": "Волонтер",
  "description": "Добровольный помощник",
  "permissions": [
    "read:mentees_list",
    "write:help_records",
    "read:schedule"
  ]
}

Response 201:
{
  "id": 2,
  "name": "volunteer",
  "display_name": "Волонтер",
  "description": "Добровольный помощник",
  "permissions": [...],
  "created_at": "2024-09-14T10:00:00Z"
}
```

### Назначение роли пользователю
```http
POST /api/v1/users/{user_id}/roles
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "role_id": 2,
  "assigned_by": 1,
  "expires_at": "2024-12-31T23:59:59Z"
}

Response 201:
{
  "user_id": 123,
  "role_id": 2,
  "assigned_by": 1,
  "assigned_at": "2024-09-14T10:00:00Z",
  "expires_at": "2024-12-31T23:59:59Z",
  "is_active": true
}
```

## 🔐 Проверка разрешений

### Получение разрешений пользователя
```http
GET /api/v1/auth/permissions
Authorization: Bearer <user_token>

Response 200:
{
  "user_id": 123,
  "roles": ["patient"],
  "permissions": [
    "read:own_health_data",
    "write:own_diary",
    "read:educational_content"
  ],
  "context_permissions": {
    "own_data": true,
    "family_data": false,
    "patient_data": false
  }
}
```

### Проверка конкретного разрешения
```http
POST /api/v1/auth/check-permission
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "permission": "read:patient_data",
  "resource_id": 456,
  "context": {
    "patient_id": 456,
    "doctor_id": 123
  }
}

Response 200:
{
  "has_permission": true,
  "reason": "doctor_has_access_to_patient",
  "restrictions": []
}
```

## 👤 API для пациентов

### Получение личных данных
```http
GET /api/v1/patients/me
Authorization: Bearer <patient_token>

Response 200:
{
  "id": 123,
  "name": "Иванов И.И.",
  "email": "ivanov@example.com",
  "role": "patient",
  "health_data": {
    "last_checkup": "2024-09-10",
    "current_medications": [...],
    "rehabilitation_plan": {...}
  },
  "family_members": [...],
  "doctors": [...]
}
```

### Ведение дневника
```http
POST /api/v1/patients/me/diary
Authorization: Bearer <patient_token>
Content-Type: application/json

{
  "date": "2024-09-14",
  "mood": "good",
  "symptoms": [
    {
      "type": "headache",
      "intensity": 3,
      "duration": "2 hours"
    }
  ],
  "medications_taken": [...],
  "activities": [...],
  "notes": "Чувствую себя лучше"
}

Response 201:
{
  "id": 789,
  "date": "2024-09-14",
  "created_at": "2024-09-14T15:30:00Z"
}
```

## 👨‍⚕️ API для врачей

### Получение списка пациентов
```http
GET /api/v1/doctors/me/patients
Authorization: Bearer <doctor_token>
Query params: ?status=active&page=1&limit=20

Response 200:
{
  "patients": [
    {
      "id": 456,
      "name": "Петров П.П.",
      "last_visit": "2024-09-10",
      "status": "recovering",
      "alerts": [
        "пропуск лекарств",
        "высокое давление"
      ],
      "next_appointment": "2024-09-20"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45
  }
}
```

### Просмотр данных пациента
```http
GET /api/v1/doctors/me/patients/{patient_id}
Authorization: Bearer <doctor_token>

Response 200:
{
  "patient": {
    "id": 456,
    "name": "Петров П.П.",
    "medical_history": {...},
    "current_medications": [...],
    "rehabilitation_plan": {...},
    "wearable_data": {
      "heart_rate": [...],
      "blood_pressure": [...],
      "activity": [...]
    },
    "diary_entries": [...],
    "appointments": [...]
  }
}
```

### Назначение плана реабилитации
```http
POST /api/v1/doctors/me/patients/{patient_id}/rehabilitation-plan
Authorization: Bearer <doctor_token>
Content-Type: application/json

{
  "goals": [
    {
      "title": "Восстановить ходьбу",
      "target_date": "2024-12-01",
      "description": "Самостоятельная ходьба без поддержки"
    }
  ],
  "activities": [
    {
      "type": "physical_therapy",
      "frequency": "3 times per week",
      "duration": "45 minutes",
      "description": "Упражнения для ног"
    }
  ],
  "medications": [...],
  "recommendations": "Избегать переутомления"
}

Response 201:
{
  "plan_id": 789,
  "patient_id": 456,
  "created_at": "2024-09-14T10:00:00Z",
  "status": "active"
}
```

## 🤝 API для волонтеров

### Получение списка подопечных
```http
GET /api/v1/volunteers/me/mentees
Authorization: Bearer <volunteer_token>
Query params: ?status=active&priority=high

Response 200:
{
  "mentees": [
    {
      "id": 789,
      "name": "Сидорова С.С.",
      "needs": ["покупки", "общение", "транспорт"],
      "last_contact": "2024-09-12",
      "priority": "high",
      "location": {
        "address": "ул. Ленина, 123",
        "distance": "2.5 km"
      }
    }
  ]
}
```

### Отметка о предоставленной помощи
```http
POST /api/v1/volunteers/me/help-records
Authorization: Bearer <volunteer_token>
Content-Type: application/json

{
  "mentee_id": 789,
  "help_type": "shopping",
  "description": "Купил продукты и лекарства",
  "duration_minutes": 120,
  "location": "Магнит, ул. Пушкина, 45",
  "satisfaction_rating": 5
}

Response 201:
{
  "id": 101,
  "mentee_id": 789,
  "volunteer_id": 123,
  "help_type": "shopping",
  "created_at": "2024-09-14T15:30:00Z"
}
```

### Расписание визитов
```http
GET /api/v1/volunteers/me/schedule
Authorization: Bearer <volunteer_token>
Query params: ?date=2024-09-14

Response 200:
{
  "visits": [
    {
      "id": 201,
      "mentee_id": 789,
      "mentee_name": "Сидорова С.С.",
      "scheduled_time": "2024-09-14T14:00:00Z",
      "duration_minutes": 60,
      "help_type": "conversation",
      "status": "scheduled",
      "location": "ул. Ленина, 123"
    }
  ]
}
```

## 🤝 API для партнеров

### Управление товарами
```http
GET /api/v1/partners/me/products
Authorization: Bearer <partner_token>
Query params: ?status=active&category=equipment

Response 200:
{
  "products": [
    {
      "id": 301,
      "name": "Реабилитационный тренажер",
      "category": "equipment",
      "price": 50000,
      "status": "active",
      "orders_count": 15,
      "rating": 4.8
    }
  ]
}
```

### Создание товара
```http
POST /api/v1/partners/me/products
Authorization: Bearer <partner_token>
Content-Type: application/json

{
  "name": "Специальная ложка",
  "category": "equipment",
  "description": "Удобная ложка с утолщенной ручкой",
  "price": 1500,
  "images": ["image1.jpg", "image2.jpg"],
  "specifications": {
    "material": "пластик",
    "weight": "50g",
    "color": "синий"
  },
  "availability": "in_stock"
}

Response 201:
{
  "id": 302,
  "name": "Специальная ложка",
  "status": "pending_approval",
  "created_at": "2024-09-14T10:00:00Z"
}
```

### Управление заказами
```http
GET /api/v1/partners/me/orders
Authorization: Bearer <partner_token>
Query params: ?status=pending&page=1

Response 200:
{
  "orders": [
    {
      "id": 401,
      "customer_name": "Иванов И.И.",
      "product_name": "Специальная ложка",
      "quantity": 2,
      "total_price": 3000,
      "status": "pending",
      "created_at": "2024-09-14T09:00:00Z"
    }
  ]
}
```

## ⚙️ API для администраторов

### Управление пользователями
```http
GET /api/v1/admin/users
Authorization: Bearer <admin_token>
Query params: ?role=patient&status=active&page=1

Response 200:
{
  "users": [
    {
      "id": 123,
      "name": "Иванов И.И.",
      "email": "ivanov@example.com",
      "role": "patient",
      "status": "active",
      "created_at": "2024-09-01T10:00:00Z",
      "last_login": "2024-09-14T08:30:00Z"
    }
  ]
}
```

### Модерация контента
```http
GET /api/v1/admin/content/moderation
Authorization: Bearer <admin_token>
Query params: ?status=pending&type=post

Response 200:
{
  "content": [
    {
      "id": 501,
      "type": "post",
      "author_id": 123,
      "author_name": "Иванов И.И.",
      "content": "Поделитесь опытом восстановления...",
      "status": "pending",
      "reported_count": 0,
      "created_at": "2024-09-14T12:00:00Z"
    }
  ]
}
```

### Системная аналитика
```http
GET /api/v1/admin/analytics
Authorization: Bearer <admin_token>
Query params: ?period=30d&metric=users

Response 200:
{
  "metrics": {
    "total_users": 1250,
    "active_users_30d": 890,
    "new_users_30d": 45,
    "user_roles": {
      "patients": 800,
      "doctors": 50,
      "volunteers": 200,
      "partners": 150,
      "admins": 5
    },
    "content_stats": {
      "posts_30d": 1200,
      "comments_30d": 3500,
      "reports_30d": 25
    }
  }
}
```

## 🔒 Безопасность

### Rate Limiting
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1694786400
```

### Валидация разрешений
- **Проверка роли** на каждом запросе
- **Контекстная авторизация** (доступ только к своим данным)
- **Аудит действий** для критических операций
- **IP whitelist** для административных функций

### Обработка ошибок
```http
# Недостаточно прав
Response 403:
{
  "error": "insufficient_permissions",
  "message": "У вас нет прав для выполнения этого действия",
  "required_permission": "read:patient_data",
  "user_role": "patient"
}

# Неверная роль
Response 403:
{
  "error": "invalid_role",
  "message": "Доступ запрещен для вашей роли",
  "user_role": "patient",
  "required_role": "doctor"
}
```

## 📊 Мониторинг и логирование

### Логи авторизации
```json
{
  "timestamp": "2024-09-14T10:00:00Z",
  "user_id": 123,
  "role": "patient",
  "action": "read_health_data",
  "resource_id": 456,
  "ip_address": "192.168.1.100",
  "user_agent": "Mozilla/5.0...",
  "success": true
}
```

### Метрики безопасности
- **Количество попыток входа** по ролям
- **Отклоненные запросы** по причине недостатка прав
- **Подозрительная активность** (множественные неудачные попытки)
- **Использование API** по ролям и эндпоинтам

## 🔗 Связанные документы

- [Ролевая модель и интерфейсы](../ux-ui/user-roles-and-interfaces.md)
- [REST API](rest-api.md)
- [Безопасность](../security/security-policy.md)
- [Системная архитектура](../architecture/system-architecture.md)

---

*Последнее обновление: 14.09.2025*
