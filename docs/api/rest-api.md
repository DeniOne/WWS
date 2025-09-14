# 🔌 REST API Спецификация

## Базовый URL
```
Production: https://api.stroke-support.com/v1
Staging: https://staging-api.stroke-support.com/v1
Development: http://localhost:3000/v1
```

## Аутентификация

### JWT Token
```http
Authorization: Bearer <jwt_token>
```

### Получение токена
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Ответ:**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 3600,
    "user": {
      "id": "123",
      "email": "user@example.com",
      "role": "patient",
      "profile": {
        "first_name": "Иван",
        "last_name": "Петров",
        "phone": "+7-999-123-45-67"
      }
    }
  }
}
```

## Пользователи

### Получить профиль пользователя
```http
GET /users/profile
Authorization: Bearer <token>
```

### Обновить профиль
```http
PUT /users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "first_name": "Иван",
  "last_name": "Петров",
  "phone": "+7-999-123-45-67",
  "birth_date": "1980-01-01",
  "medical_info": {
    "stroke_date": "2023-06-15",
    "stroke_type": "ischemic",
    "medications": ["Аспирин", "Аторвастатин"],
    "allergies": ["Пенициллин"]
  }
}
```

### Зарегистрировать пользователя
```http
POST /users/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "role": "patient",
  "profile": {
    "first_name": "Иван",
    "last_name": "Петров",
    "phone": "+7-999-123-45-67"
  }
}
```

## SOS и экстренная помощь

### Отправить SOS сигнал
```http
POST /emergency/sos
Authorization: Bearer <token>
Content-Type: application/json

{
  "location": {
    "latitude": 55.7558,
    "longitude": 37.6176,
    "address": "Москва, Красная площадь, 1"
  },
  "message": "Помогите! Плохо себя чувствую",
  "severity": "high"
}
```

### Получить историю SOS
```http
GET /emergency/sos/history
Authorization: Bearer <token>
```

### Добавить контакт для экстренных случаев
```http
POST /emergency/contacts
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Мария Петрова",
  "phone": "+7-999-123-45-67",
  "relationship": "wife",
  "is_primary": true
}
```

## Дневник здоровья

### Добавить запись в дневник
```http
POST /health/diary
Authorization: Bearer <token>
Content-Type: application/json

{
  "date": "2023-09-14",
  "mood": "good",
  "blood_pressure": {
    "systolic": 120,
    "diastolic": 80
  },
  "heart_rate": 72,
  "medications_taken": ["Аспирин", "Аторвастатин"],
  "symptoms": ["головная боль"],
  "notes": "Чувствую себя хорошо"
}
```

### Получить записи дневника
```http
GET /health/diary?start_date=2023-09-01&end_date=2023-09-30
Authorization: Bearer <token>
```

### Получить статистику здоровья
```http
GET /health/statistics?period=month
Authorization: Bearer <token>
```

## Сообщество

### Получить посты
```http
GET /community/posts?page=1&limit=20&category=rehabilitation
Authorization: Bearer <token>
```

### Создать пост
```http
POST /community/posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Мой опыт реабилитации",
  "content": "Хочу поделиться своим опытом...",
  "category": "rehabilitation",
  "tags": ["упражнения", "прогресс"],
  "is_anonymous": false
}
```

### Добавить комментарий
```http
POST /community/posts/{post_id}/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Отличный пост! Спасибо за советы"
}
```

### Лайкнуть пост
```http
POST /community/posts/{post_id}/like
Authorization: Bearer <token>
```

## Маркетплейс

### Получить товары
```http
GET /marketplace/products?category=medical_equipment&page=1&limit=20
Authorization: Bearer <token>
```

### Получить услуги
```http
GET /marketplace/services?category=rehabilitation&location=moscow
Authorization: Bearer <token>
```

### Создать заказ
```http
POST /marketplace/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "type": "product",
      "id": "123",
      "quantity": 1
    }
  ],
  "shipping_address": {
    "street": "ул. Ленина, 1",
    "city": "Москва",
    "postal_code": "101000"
  },
  "payment_method": "card"
}
```

## Уведомления

### Получить уведомления
```http
GET /notifications?page=1&limit=20
Authorization: Bearer <token>
```

### Отметить уведомление как прочитанное
```http
PUT /notifications/{notification_id}/read
Authorization: Bearer <token>
```

### Настроить уведомления
```http
PUT /notifications/settings
Authorization: Bearer <token>
Content-Type: application/json

{
  "push_enabled": true,
  "email_enabled": true,
  "sms_enabled": false,
  "categories": {
    "emergency": true,
    "health_reminders": true,
    "community": false,
    "marketplace": true
  }
}
```

## AI Ассистент

### Отправить сообщение ассистенту
```http
POST /ai/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Как правильно делать упражнения для руки?",
  "context": {
    "user_condition": "post_stroke",
    "affected_side": "left"
  }
}
```

### Получить рекомендации
```http
GET /ai/recommendations?type=exercises&user_condition=post_stroke
Authorization: Bearer <token>
```

## Ошибки

### Стандартный формат ошибки
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Неверные данные",
    "details": {
      "field": "email",
      "reason": "Неверный формат email"
    }
  }
}
```

### Коды ошибок
- `400` - Bad Request (неверные данные)
- `401` - Unauthorized (не авторизован)
- `403` - Forbidden (нет прав)
- `404` - Not Found (ресурс не найден)
- `409` - Conflict (конфликт данных)
- `422` - Validation Error (ошибка валидации)
- `500` - Internal Server Error (внутренняя ошибка)

## Пагинация

### Параметры
- `page` - номер страницы (начиная с 1)
- `limit` - количество элементов на странице (максимум 100)

### Формат ответа с пагинацией
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8,
    "has_next": true,
    "has_prev": false
  }
}
```

## Rate Limiting

### Лимиты
- **Общие запросы**: 1000 запросов в час
- **SOS запросы**: 10 запросов в час
- **Регистрация**: 5 запросов в час
- **AI чат**: 50 запросов в час

### Headers
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1694707200
```

---
*Последнее обновление: 14.09.2025*
