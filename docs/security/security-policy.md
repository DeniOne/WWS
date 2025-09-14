# 🔒 Политика безопасности

## Обзор

Комплексная политика безопасности для платформы поддержки инсультников, обеспечивающая защиту персональных данных, медицинской информации и соответствие международным стандартам безопасности.

## Принципы безопасности

### 1. Defense in Depth (Защита в глубину)
- Многоуровневая защита на всех уровнях системы
- Независимые механизмы безопасности
- Принцип "не доверяй, проверяй" (Zero Trust)

### 2. Privacy by Design
- Защита конфиденциальности с самого начала разработки
- Минимизация сбора данных
- Прозрачность обработки данных

### 3. Compliance First
- Соответствие HIPAA, GDPR, ФЗ-152
- Регулярные аудиты безопасности
- Документирование всех процессов

## Классификация данных

### Уровень 1: Публичные данные
- **Примеры**: Общая информация о платформе, публичные посты
- **Требования**: Базовая защита, HTTPS
- **Доступ**: Открытый

### Уровень 2: Внутренние данные
- **Примеры**: Логи приложения, метрики производительности
- **Требования**: Аутентификация, логирование доступа
- **Доступ**: Только для администраторов

### Уровень 3: Конфиденциальные данные
- **Примеры**: Персональная информация пользователей, контакты
- **Требования**: Шифрование, строгий контроль доступа
- **Доступ**: Только авторизованные пользователи

### Уровень 4: Медицинские данные
- **Примеры**: Дневник здоровья, SOS события, медицинские записи
- **Требования**: Максимальная защита, аудит всех операций
- **Доступ**: Только владелец данных и авторизованные врачи

## Аутентификация и авторизация

### Многофакторная аутентификация (MFA)
```typescript
// Пример реализации MFA
export class MFAService {
  async enableMFA(userId: string): Promise<{ secret: string; qrCode: string }> {
    const secret = speakeasy.generateSecret({
      name: `Stroke Support (${userId})`,
      issuer: 'Stroke Support Platform',
    });

    await this.userRepository.update(userId, {
      mfa_secret: secret.base32,
      mfa_enabled: true,
    });

    return {
      secret: secret.base32,
      qrCode: secret.otpauth_url,
    };
  }

  async verifyMFA(userId: string, token: string): Promise<boolean> {
    const user = await this.userRepository.findById(userId);
    if (!user?.mfa_secret) return false;

    return speakeasy.totp.verify({
      secret: user.mfa_secret,
      encoding: 'base32',
      token,
      window: 2, // Допуск в 2 периода (60 секунд)
    });
  }
}
```

### Роли и права доступа
```typescript
// Система ролей
export enum UserRole {
  PATIENT = 'patient',
  RELATIVE = 'relative', 
  DOCTOR = 'doctor',
  ADMIN = 'admin',
  SUPPORT = 'support'
}

// Права доступа
export enum Permission {
  // Общие права
  READ_PROFILE = 'read:profile',
  UPDATE_PROFILE = 'update:profile',
  
  // Права пациента
  READ_HEALTH_DATA = 'read:health_data',
  WRITE_HEALTH_DATA = 'write:health_data',
  SEND_SOS = 'send:sos',
  
  // Права врача
  READ_PATIENT_DATA = 'read:patient_data',
  WRITE_MEDICAL_NOTES = 'write:medical_notes',
  
  // Административные права
  MANAGE_USERS = 'manage:users',
  VIEW_ANALYTICS = 'view:analytics',
  MANAGE_SYSTEM = 'manage:system'
}

// Матрица ролей и прав
export const ROLE_PERMISSIONS = {
  [UserRole.PATIENT]: [
    Permission.READ_PROFILE,
    Permission.UPDATE_PROFILE,
    Permission.READ_HEALTH_DATA,
    Permission.WRITE_HEALTH_DATA,
    Permission.SEND_SOS,
  ],
  [UserRole.RELATIVE]: [
    Permission.READ_PROFILE,
    Permission.UPDATE_PROFILE,
    Permission.READ_HEALTH_DATA, // Только для связанных пациентов
  ],
  [UserRole.DOCTOR]: [
    Permission.READ_PROFILE,
    Permission.UPDATE_PROFILE,
    Permission.READ_PATIENT_DATA,
    Permission.WRITE_MEDICAL_NOTES,
  ],
  [UserRole.ADMIN]: [
    ...Object.values(Permission)
  ],
};
```

### JWT Token Security
```typescript
// Безопасная конфигурация JWT
export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET, // Минимум 256 бит
  expiresIn: '1h', // Короткое время жизни
  refreshExpiresIn: '7d', // Refresh токены
  algorithm: 'HS256',
  issuer: 'stroke-support-platform',
  audience: 'stroke-support-users',
};

// Валидация токенов
export class TokenValidationService {
  async validateToken(token: string): Promise<boolean> {
    try {
      const decoded = jwt.verify(token, JWT_CONFIG.secret, {
        issuer: JWT_CONFIG.issuer,
        audience: JWT_CONFIG.audience,
      });

      // Проверка, что токен не в черном списке
      const isBlacklisted = await this.redisService.get(`blacklist:${token}`);
      if (isBlacklisted) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  async blacklistToken(token: string): Promise<void> {
    const decoded = jwt.decode(token) as any;
    const exp = decoded.exp;
    const ttl = exp - Math.floor(Date.now() / 1000);
    
    if (ttl > 0) {
      await this.redisService.setex(`blacklist:${token}`, ttl, 'true');
    }
  }
}
```

## Шифрование данных

### Шифрование в покое (At Rest)
```typescript
// Шифрование чувствительных данных в базе
export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly key = crypto.scryptSync(process.env.ENCRYPTION_KEY, 'salt', 32);

  encrypt(text: string): { encrypted: string; iv: string; tag: string } {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(this.algorithm, this.key);
    cipher.setAAD(Buffer.from('stroke-support', 'utf8'));

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: tag.toString('hex'),
    };
  }

  decrypt(encryptedData: { encrypted: string; iv: string; tag: string }): string {
    const decipher = crypto.createDecipher(
      this.algorithm, 
      this.key
    );
    decipher.setAAD(Buffer.from('stroke-support', 'utf8'));
    decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));

    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}

// Entity с шифрованием
@Entity('health_diary')
export class HealthDiary {
  @Column('text')
  @Transform(
    (value) => encryptionService.encrypt(value),
    { toClassOnly: true }
  )
  @Transform(
    (value) => encryptionService.decrypt(value),
    { toPlainOnly: true }
  )
  notes: string;
}
```

### Шифрование в движении (In Transit)
```typescript
// HTTPS конфигурация
export const HTTPS_CONFIG = {
  minVersion: 'TLSv1.2',
  ciphers: [
    'ECDHE-RSA-AES256-GCM-SHA384',
    'ECDHE-RSA-AES128-GCM-SHA256',
    'ECDHE-RSA-AES256-SHA384',
    'ECDHE-RSA-AES128-SHA256',
  ].join(':'),
  honorCipherOrder: true,
  secureProtocol: 'TLSv1_2_method',
};

// HSTS заголовки
app.use((req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});
```

## Защита от атак

### Rate Limiting
```typescript
// Защита от брутфорса
export class RateLimitService {
  private readonly limits = {
    login: { requests: 5, window: 15 * 60 * 1000 }, // 5 попыток за 15 минут
    sos: { requests: 3, window: 60 * 1000 }, // 3 SOS за минуту
    api: { requests: 100, window: 60 * 1000 }, // 100 запросов в минуту
  };

  async checkLimit(key: string, type: keyof typeof this.limits): Promise<boolean> {
    const limit = this.limits[type];
    const current = await this.redisService.incr(`${type}:${key}`);
    
    if (current === 1) {
      await this.redisService.expire(`${type}:${key}`, limit.window / 1000);
    }

    return current <= limit.requests;
  }
}

// Middleware для rate limiting
@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private readonly rateLimitService: RateLimitService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip;
    const endpoint = request.route?.path;

    let limitType: keyof typeof this.rateLimitService['limits'];
    
    if (endpoint?.includes('/auth/login')) {
      limitType = 'login';
    } else if (endpoint?.includes('/emergency/sos')) {
      limitType = 'sos';
    } else {
      limitType = 'api';
    }

    const allowed = await this.rateLimitService.checkLimit(ip, limitType);
    
    if (!allowed) {
      throw new TooManyRequestsException('Превышен лимит запросов');
    }

    return true;
  }
}
```

### Защита от SQL Injection
```typescript
// Использование параметризованных запросов
export class SecureUserService {
  async findByEmail(email: string): Promise<User | null> {
    // ✅ Безопасно - параметризованный запрос
    return this.userRepository.findOne({
      where: { email },
    });
  }

  // ❌ Опасно - прямая конкатенация
  async findByEmailUnsafe(email: string): Promise<User | null> {
    return this.dataSource.query(
      `SELECT * FROM users WHERE email = '${email}'`
    );
  }
}
```

### Защита от XSS
```typescript
// Санитизация пользовательского ввода
import DOMPurify from 'isomorphic-dompurify';

export class SanitizationService {
  sanitizeHtml(html: string): string {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
      ALLOWED_ATTR: [],
    });
  }

  sanitizeText(text: string): string {
    return text
      .replace(/[<>]/g, '') // Удаление HTML тегов
      .replace(/javascript:/gi, '') // Удаление javascript: ссылок
      .trim();
  }
}

// Валидация и санитизация DTO
export class CreatePostDto {
  @IsString()
  @Transform(({ value }) => sanitizationService.sanitizeText(value))
  @Length(1, 200)
  title: string;

  @IsString()
  @Transform(({ value }) => sanitizationService.sanitizeHtml(value))
  @Length(1, 5000)
  content: string;
}
```

### CSRF Protection
```typescript
// CSRF токены
import csrf from 'csurf';

const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  },
});

// Middleware для CSRF
app.use(csrfProtection);

// Получение CSRF токена
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});
```

## Аудит и мониторинг

### Система аудита
```typescript
// Аудит всех операций с медицинскими данными
export class AuditService {
  async logAccess(userId: string, resource: string, action: string, metadata?: any): Promise<void> {
    const auditLog = {
      id: uuidv4(),
      user_id: userId,
      resource,
      action,
      timestamp: new Date(),
      ip_address: this.getClientIP(),
      user_agent: this.getUserAgent(),
      metadata: metadata || {},
    };

    // Сохранение в защищенную базу аудита
    await this.auditRepository.save(auditLog);

    // Отправка в систему мониторинга
    await this.monitoringService.trackEvent('data_access', auditLog);
  }

  async getAuditTrail(userId: string, startDate?: Date, endDate?: Date): Promise<AuditLog[]> {
    return this.auditRepository.find({
      where: {
        user_id: userId,
        timestamp: Between(startDate || new Date(0), endDate || new Date()),
      },
      order: { timestamp: 'DESC' },
    });
  }
}

// Декоратор для автоматического аудита
export function Auditable(resource: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const result = await method.apply(this, args);
      
      // Логирование доступа
      await this.auditService.logAccess(
        this.getCurrentUserId(),
        resource,
        propertyName,
        { args: this.sanitizeArgs(args) }
      );

      return result;
    };
  };
}

// Использование декоратора
export class HealthService {
  @Auditable('health_diary')
  async getHealthData(userId: string): Promise<HealthData[]> {
    return this.healthRepository.find({ where: { user_id: userId } });
  }
}
```

### Мониторинг безопасности
```typescript
// Система мониторинга угроз
export class SecurityMonitoringService {
  async detectAnomalies(userId: string, action: string, metadata: any): Promise<void> {
    // Анализ подозрительной активности
    const anomalies = await this.analyzeBehavior(userId, action, metadata);
    
    if (anomalies.length > 0) {
      await this.alertSecurityTeam(anomalies);
      await this.logSecurityEvent('anomaly_detected', { userId, anomalies });
    }
  }

  private async analyzeBehavior(userId: string, action: string, metadata: any): Promise<Anomaly[]> {
    const anomalies: Anomaly[] = [];

    // Проверка на множественные неудачные попытки входа
    if (action === 'login_failed') {
      const failedAttempts = await this.getFailedLoginAttempts(userId, 15); // 15 минут
      if (failedAttempts >= 5) {
        anomalies.push({
          type: 'brute_force_attempt',
          severity: 'high',
          description: 'Multiple failed login attempts',
        });
      }
    }

    // Проверка на подозрительную геолокацию
    if (action === 'sos_sent' && metadata.location) {
      const lastLocation = await this.getLastKnownLocation(userId);
      const distance = this.calculateDistance(lastLocation, metadata.location);
      
      if (distance > 1000) { // Более 1км за короткое время
        anomalies.push({
          type: 'suspicious_location',
          severity: 'medium',
          description: 'SOS sent from unusual location',
        });
      }
    }

    return anomalies;
  }
}
```

## Соответствие стандартам

### HIPAA Compliance
```typescript
// HIPAA требования
export class HIPAAComplianceService {
  // Минимально необходимая информация
  async minimizeDataCollection(userData: any): Promise<any> {
    return {
      id: userData.id,
      email: userData.email,
      role: userData.role,
      // Только необходимые поля
    };
  }

  // Право на забвение
  async deleteUserData(userId: string): Promise<void> {
    // Анонимизация вместо удаления
    await this.userRepository.update(userId, {
      email: `deleted_${userId}@anonymized.com`,
      first_name: 'Deleted',
      last_name: 'User',
      medical_info: null,
    });

    // Удаление связанных данных
    await this.healthRepository.delete({ user_id: userId });
    await this.sosRepository.delete({ user_id: userId });
  }

  // Уведомление о нарушениях
  async reportBreach(breachData: BreachData): Promise<void> {
    // Уведомление в течение 60 дней
    await this.notificationService.sendBreachNotification(breachData);
    
    // Логирование для аудита
    await this.auditService.logSecurityEvent('data_breach', breachData);
  }
}
```

### GDPR Compliance
```typescript
// GDPR требования
export class GDPRComplianceService {
  // Право на доступ к данным
  async exportUserData(userId: string): Promise<UserDataExport> {
    const user = await this.userService.findById(userId);
    const healthData = await this.healthService.getHealthData(userId);
    const sosEvents = await this.emergencyService.getSosEvents(userId);

    return {
      personal_data: user,
      health_data: healthData,
      emergency_data: sosEvents,
      export_date: new Date(),
      format: 'JSON',
    };
  }

  // Право на исправление
  async updateUserData(userId: string, updates: Partial<UserData>): Promise<void> {
    // Валидация изменений
    await this.validateDataUpdates(updates);
    
    // Обновление данных
    await this.userService.updateProfile(userId, updates);
    
    // Логирование изменений
    await this.auditService.logDataModification(userId, updates);
  }

  // Право на переносимость данных
  async exportDataPortable(userId: string): Promise<PortableData> {
    const data = await this.exportUserData(userId);
    
    return {
      ...data,
      format: 'machine_readable',
      schema: 'https://schema.org/MedicalEntity',
    };
  }
}
```

## План реагирования на инциденты

### Классификация инцидентов
1. **Критический** - Утечка медицинских данных, компрометация системы
2. **Высокий** - Несанкционированный доступ, подозрительная активность
3. **Средний** - Нарушения политики безопасности
4. **Низкий** - Предупреждения системы мониторинга

### Процедуры реагирования
```typescript
// Автоматическое реагирование на инциденты
export class IncidentResponseService {
  async handleSecurityIncident(incident: SecurityIncident): Promise<void> {
    switch (incident.severity) {
      case 'critical':
        await this.handleCriticalIncident(incident);
        break;
      case 'high':
        await this.handleHighSeverityIncident(incident);
        break;
      case 'medium':
        await this.handleMediumSeverityIncident(incident);
        break;
      default:
        await this.logIncident(incident);
    }
  }

  private async handleCriticalIncident(incident: SecurityIncident): Promise<void> {
    // 1. Немедленное уведомление команды безопасности
    await this.notifySecurityTeam(incident);
    
    // 2. Блокировка подозрительных аккаунтов
    if (incident.userId) {
      await this.blockUser(incident.userId);
    }
    
    // 3. Изоляция затронутых систем
    await this.isolateAffectedSystems(incident);
    
    // 4. Уведомление регуляторов (если требуется)
    await this.notifyRegulators(incident);
  }
}
```

## Обучение и осведомленность

### Программа обучения команды
1. **Базовый курс безопасности** - Для всех разработчиков
2. **HIPAA/GDPR обучение** - Для команды, работающей с данными
3. **Пентестинг** - Регулярные тесты на проникновение
4. **Обновления угроз** - Еженедельные брифинги по новым угрозам

### Документация и процедуры
- [Процедуры аутентификации](auth-procedures.md)
- [План восстановления после сбоев](disaster-recovery.md)
- [Политика управления паролями](password-policy.md)
- [Процедуры аудита](audit-procedures.md)

---
*Последнее обновление: 14.09.2025*
