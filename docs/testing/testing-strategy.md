# 🧪 Стратегия тестирования

## Обзор

Комплексная стратегия тестирования, охватывающая все уровни приложения - от unit тестов до end-to-end тестирования. Стратегия обеспечивает высокое качество кода, надежность системы и соответствие медицинским стандартам.

## Пирамида тестирования

```mermaid
graph TD
    A[E2E Tests<br/>10%] --> B[Integration Tests<br/>20%]
    B --> C[Unit Tests<br/>70%]
    
    A1[Playwright/Cypress<br/>Критические пользовательские сценарии] --> A
    B1[API Tests<br/>Сервисная интеграция] --> B
    B2[Database Tests<br/>Миграции и данные] --> B
    C1[Component Tests<br/>React компоненты] --> C
    C2[Service Tests<br/>Бизнес логика] --> C
    C3[Utility Tests<br/>Вспомогательные функции] --> C
```

## Типы тестов

### 1. Unit Tests (70%)
**Цель**: Тестирование отдельных функций, методов и компонентов в изоляции.

#### Backend Unit Tests
```typescript
// tests/unit/auth.service.test.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/auth/auth.service';
import { UsersService } from '../../src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('login', () => {
    it('should return tokens for valid credentials', async () => {
      const user = {
        id: '1',
        email: 'test@test.com',
        password_hash: 'hashed_password',
        role: 'patient',
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(user);
      jest.spyOn(service, 'validateUser').mockResolvedValue(user);
      jest.spyOn(jwtService, 'sign').mockReturnValue('mock_token');

      const result = await service.login({
        email: 'test@test.com',
        password: 'password',
      });

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
      expect(result.user.email).toBe('test@test.com');
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      await expect(
        service.login({
          email: 'test@test.com',
          password: 'wrong_password',
        })
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should create new user and return tokens', async () => {
      const userData = {
        email: 'new@test.com',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
        role: 'patient',
      };

      const createdUser = { id: '2', ...userData, password_hash: 'hashed' };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(usersService, 'create').mockResolvedValue(createdUser);
      jest.spyOn(jwtService, 'sign').mockReturnValue('mock_token');

      const result = await service.register(userData);

      expect(usersService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: userData.email,
          password: expect.any(String), // hashed password
        })
      );
      expect(result).toHaveProperty('access_token');
    });
  });
});
```

#### Frontend Unit Tests
```typescript
// tests/unit/components/HealthDiaryForm.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import HealthDiaryForm from '../../src/components/HealthDiaryForm';
import healthSlice from '../../src/store/health.slice';

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      health: healthSlice,
    },
    preloadedState: {
      health: {
        isLoading: false,
        diaryEntries: [],
        ...initialState,
      },
    },
  });
};

describe('HealthDiaryForm', () => {
  it('renders form fields correctly', () => {
    const store = createMockStore();
    
    render(
      <Provider store={store}>
        <HealthDiaryForm onSubmit={jest.fn()} />
      </Provider>
    );

    expect(screen.getByLabelText(/настроение/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/давление/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/пульс/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /сохранить/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const store = createMockStore();
    const mockSubmit = jest.fn();
    
    render(
      <Provider store={store}>
        <HealthDiaryForm onSubmit={mockSubmit} />
      </Provider>
    );

    const submitButton = screen.getByRole('button', { name: /сохранить/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/поле обязательно/i)).toBeInTheDocument();
    });

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    const store = createMockStore();
    const mockSubmit = jest.fn();
    
    render(
      <Provider store={store}>
        <HealthDiaryForm onSubmit={mockSubmit} />
      </Provider>
    );

    // Заполнение формы
    fireEvent.change(screen.getByLabelText(/настроение/i), {
      target: { value: 'good' }
    });
    fireEvent.change(screen.getByLabelText(/пульс/i), {
      target: { value: '72' }
    });

    const submitButton = screen.getByRole('button', { name: /сохранить/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        mood: 'good',
        heart_rate: 72,
        // ... другие поля
      });
    });
  });
});
```

### 2. Integration Tests (20%)
**Цель**: Тестирование взаимодействия между модулями и внешними системами.

#### API Integration Tests
```typescript
// tests/integration/auth.integration.test.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { User } from '../../src/users/entities/user.entity';

describe('Auth Integration (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User],
          synchronize: true,
        }),
        JwtModule.register({
          secret: 'test_secret',
          signOptions: { expiresIn: '1h' },
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    userRepository = moduleFixture.get('UserRepository');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await userRepository.clear();
  });

  describe('/auth/register (POST)', () => {
    it('should register new user', () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
        role: 'patient',
      };

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(userData)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body).toHaveProperty('user');
          expect(res.body.user.email).toBe(userData.email);
        });
    });

    it('should not register user with existing email', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
        role: 'patient',
      };

      // Создаем пользователя
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(userData);

      // Пытаемся создать еще одного с тем же email
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(userData)
        .expect(409)
        .expect((res) => {
          expect(res.body.error.message).toContain('уже существует');
        });
    });
  });

  describe('/auth/login (POST)', () => {
    beforeEach(async () => {
      // Создаем тестового пользователя
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          first_name: 'John',
          last_name: 'Doe',
          role: 'patient',
        });
    });

    it('should login with valid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body).toHaveProperty('user');
        });
    });

    it('should not login with invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrong_password',
        })
        .expect(401);
    });
  });
});
```

#### Database Integration Tests
```typescript
// tests/integration/database.integration.test.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { HealthDiary } from '../../src/health/entities/health-diary.entity';
import { User } from '../../src/users/entities/user.entity';

describe('Database Integration', () => {
  let dataSource: DataSource;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.TEST_DB_HOST || 'localhost',
          port: parseInt(process.env.TEST_DB_PORT) || 5432,
          username: process.env.TEST_DB_USER || 'test_user',
          password: process.env.TEST_DB_PASSWORD || 'test_password',
          database: process.env.TEST_DB_NAME || 'test_stroke_platform',
          entities: [User, HealthDiary],
          synchronize: true,
        }),
      ],
    }).compile();

    dataSource = module.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await module.close();
  });

  beforeEach(async () => {
    // Очистка таблиц перед каждым тестом
    await dataSource.query('TRUNCATE TABLE health_diary CASCADE');
    await dataSource.query('TRUNCATE TABLE users CASCADE');
  });

  describe('Health Diary Operations', () => {
    it('should create and retrieve health diary entry', async () => {
      // Создаем пользователя
      const user = await dataSource.getRepository(User).save({
        email: 'test@example.com',
        password_hash: 'hashed_password',
        role: 'patient',
      });

      // Создаем запись в дневнике
      const diaryEntry = await dataSource.getRepository(HealthDiary).save({
        user_id: user.id,
        entry_date: new Date('2023-09-14'),
        mood: 'good',
        heart_rate: 72,
        notes: 'Feeling good today',
      });

      // Проверяем, что запись создана
      expect(diaryEntry.id).toBeDefined();
      expect(diaryEntry.user_id).toBe(user.id);

      // Получаем запись из базы
      const retrievedEntry = await dataSource
        .getRepository(HealthDiary)
        .findOne({
          where: { id: diaryEntry.id },
          relations: ['user'],
        });

      expect(retrievedEntry).toBeDefined();
      expect(retrievedEntry?.mood).toBe('good');
      expect(retrievedEntry?.user.email).toBe('test@example.com');
    });

    it('should handle foreign key constraints', async () => {
      // Пытаемся создать запись с несуществующим user_id
      await expect(
        dataSource.getRepository(HealthDiary).save({
          user_id: 'non-existent-id',
          entry_date: new Date(),
          mood: 'good',
        })
      ).rejects.toThrow();
    });
  });
});
```

### 3. End-to-End Tests (10%)
**Цель**: Тестирование полных пользовательских сценариев.

#### E2E Tests с Playwright
```typescript
// tests/e2e/auth.e2e.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should register new user', async ({ page }) => {
    // Переход на страницу регистрации
    await page.click('text=Регистрация');
    await expect(page).toHaveURL('/register');

    // Заполнение формы регистрации
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.fill('[data-testid="first-name-input"]', 'John');
    await page.fill('[data-testid="last-name-input"]', 'Doe');
    await page.selectOption('[data-testid="role-select"]', 'patient');

    // Отправка формы
    await page.click('[data-testid="register-button"]');

    // Проверка успешной регистрации
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Добро пожаловать, John!')).toBeVisible();
  });

  test('should login existing user', async ({ page }) => {
    // Переход на страницу входа
    await page.click('text=Войти');
    await expect(page).toHaveURL('/login');

    // Заполнение формы входа
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');

    // Отправка формы
    await page.click('[data-testid="login-button"]');

    // Проверка успешного входа
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Добро пожаловать!')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.click('text=Войти');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'wrong_password');
    await page.click('[data-testid="login-button"]');

    // Проверка отображения ошибки
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Неверные учетные данные');
  });
});

test.describe('Health Diary Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Логин пользователя
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/dashboard');
  });

  test('should add health diary entry', async ({ page }) => {
    // Переход в раздел здоровья
    await page.click('[data-testid="health-tab"]');
    await expect(page).toHaveURL('/health');

    // Добавление записи в дневник
    await page.click('[data-testid="add-diary-entry-button"]');
    
    // Заполнение формы
    await page.selectOption('[data-testid="mood-select"]', 'good');
    await page.fill('[data-testid="heart-rate-input"]', '72');
    await page.fill('[data-testid="medications-input"]', 'Аспирин, Аторвастатин');
    await page.fill('[data-testid="notes-textarea"]', 'Чувствую себя хорошо');

    // Сохранение записи
    await page.click('[data-testid="save-diary-entry-button"]');

    // Проверка, что запись добавлена
    await expect(page.locator('[data-testid="diary-entry"]')).toBeVisible();
    await expect(page.locator('text=Чувствую себя хорошо')).toBeVisible();
  });
});

test.describe('SOS Emergency Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Логин пользователя
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/dashboard');
  });

  test('should send SOS signal', async ({ page }) => {
    // Переход к SOS кнопке
    await page.click('[data-testid="sos-button"]');

    // Подтверждение отправки SOS
    await page.click('text=Отправить SOS');

    // Проверка уведомления об отправке
    await expect(page.locator('text=SOS сигнал отправлен')).toBeVisible();

    // Проверка, что уведомления отправлены (мок)
    await expect(page.locator('text=Ваши близкие уведомлены')).toBeVisible();
  });
});
```

## Конфигурация тестирования

### Jest Configuration
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/main.ts',
    '!src/**/*.module.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testTimeout: 10000,
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
```

### Playwright Configuration
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run start:test',
    url: 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
  },
});
```

## CI/CD Pipeline для тестирования

### GitHub Actions
```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_stroke_platform
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run unit tests
      run: npm run test:unit
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_stroke_platform
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info

  integration-tests:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_stroke_platform
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run integration tests
      run: npm run test:integration
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_stroke_platform

  e2e-tests:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Install Playwright
      run: npx playwright install --with-deps
    
    - name: Build application
      run: npm run build
    
    - name: Run E2E tests
      run: npm run test:e2e
    
    - name: Upload test results
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
```

## Медицинские стандарты тестирования

### HIPAA Compliance Tests
```typescript
// tests/compliance/hipaa.test.ts
describe('HIPAA Compliance', () => {
  it('should encrypt sensitive health data', async () => {
    const healthData = {
      user_id: 'user123',
      medical_condition: 'stroke',
      medications: ['Aspirin', 'Atorvastatin'],
    };

    const encrypted = await encryptHealthData(healthData);
    expect(encrypted).not.toContain('stroke');
    expect(encrypted).not.toContain('Aspirin');
  });

  it('should audit all health data access', async () => {
    const userId = 'user123';
    
    // Симуляция доступа к данным
    await healthService.getHealthData(userId);
    
    // Проверка записи в аудит
    const auditLog = await auditService.getAuditLog(userId);
    expect(auditLog).toHaveLength(1);
    expect(auditLog[0].action).toBe('HEALTH_DATA_ACCESS');
    expect(auditLog[0].timestamp).toBeDefined();
  });

  it('should enforce data retention policies', async () => {
    const oldData = await healthService.getOldHealthData();
    expect(oldData).toHaveLength(0); // Старые данные должны быть удалены
  });
});
```

## Метрики качества

### Code Coverage
- **Unit Tests**: Минимум 80% покрытие
- **Integration Tests**: Минимум 60% покрытие
- **Critical Paths**: 100% покрытие (SOS, аутентификация)

### Performance Tests
```typescript
// tests/performance/api.performance.test.ts
import { performance } from 'perf_hooks';

describe('API Performance', () => {
  it('should respond to health check within 100ms', async () => {
    const start = performance.now();
    const response = await request(app.getHttpServer())
      .get('/health');
    const end = performance.now();
    
    expect(response.status).toBe(200);
    expect(end - start).toBeLessThan(100);
  });

  it('should handle 100 concurrent SOS requests', async () => {
    const requests = Array(100).fill(null).map(() =>
      request(app.getHttpServer())
        .post('/emergency/sos')
        .send({ location: { lat: 0, lng: 0 }, severity: 'high' })
    );

    const start = performance.now();
    const responses = await Promise.all(requests);
    const end = performance.now();

    expect(responses.every(r => r.status === 201)).toBe(true);
    expect(end - start).toBeLessThan(5000); // 5 секунд максимум
  });
});
```

## Скрипты для запуска тестов

### package.json scripts
```json
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest --testPathPattern=unit",
    "test:integration": "jest --testPathPattern=integration",
    "test:e2e": "playwright test",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch",
    "test:ci": "jest --ci --coverage --watchAll=false",
    "test:performance": "jest --testPathPattern=performance"
  }
}
```

---
*Последнее обновление: 14.09.2025*
