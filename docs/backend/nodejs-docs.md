# ⚙️ Backend - Node.js/NestJS Документация

## Обзор

Backend построен на **NestJS** - прогрессивном Node.js фреймворке, который использует TypeScript и архитектуру, вдохновленную Angular. Фреймворк обеспечивает масштабируемость, модульность и отличную поддержку TypeScript.

## Структура проекта

```
backend/
├── src/
│   ├── auth/                 # Модуль аутентификации
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── strategies/       # JWT, Local стратегии
│   │   └── guards/          # Auth guards
│   ├── users/               # Модуль пользователей
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.module.ts
│   │   └── dto/             # Data Transfer Objects
│   ├── health/              # Модуль здоровья
│   │   ├── health.controller.ts
│   │   ├── health.service.ts
│   │   ├── health.module.ts
│   │   └── entities/        # Health entities
│   ├── emergency/           # Модуль экстренной помощи
│   ├── community/           # Модуль сообщества
│   ├── marketplace/         # Модуль маркетплейса
│   ├── ai/                  # Модуль AI ассистента
│   ├── common/              # Общие компоненты
│   │   ├── decorators/      # Кастомные декораторы
│   │   ├── filters/         # Exception filters
│   │   ├── guards/          # Global guards
│   │   ├── interceptors/    # Interceptors
│   │   └── pipes/           # Validation pipes
│   ├── config/              # Конфигурация
│   ├── database/            # Database модули
│   │   ├── entities/        # TypeORM entities
│   │   ├── migrations/      # Database migrations
│   │   └── seeds/           # Database seeds
│   └── main.ts              # Entry point
├── test/                    # Тесты
├── docs/                    # API документация
├── package.json
├── tsconfig.json
├── nest-cli.json
└── .env.example
```

## Установка и запуск

### Предварительные требования
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- npm или yarn

### Установка
```bash
# Клонирование репозитория
git clone <repository-url>
cd backend

# Установка зависимостей
npm install

# Копирование конфигурации
cp .env.example .env

# Настройка переменных окружения
# Отредактируйте .env файл

# Запуск миграций
npm run migration:run

# Запуск приложения
npm run start:dev
```

### Переменные окружения
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/stroke_platform
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=3600

# External APIs
FIREBASE_API_KEY=your-firebase-key
FIREBASE_PROJECT_ID=your-project-id
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
OPENAI_API_KEY=your-openai-key

# App
PORT=3000
NODE_ENV=development
API_PREFIX=v1
```

## Основные модули

### 1. Auth Module

#### AuthController
```typescript
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('refresh')
  async refresh(@Body() refreshDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Request() req) {
    return this.authService.logout(req.user.id);
  }
}
```

#### AuthService
```typescript
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Неверные учетные данные');
    }

    const tokens = await this.generateTokens(user);
    await this.redisService.set(`refresh:${user.id}`, tokens.refresh_token, 7 * 24 * 60 * 60); // 7 дней

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_in: 3600,
      user: this.sanitizeUser(user),
    };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    const tokens = await this.generateTokens(user);
    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_in: 3600,
      user: this.sanitizeUser(user),
    };
  }

  private async generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '1h' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }
}
```

### 2. Users Module

#### User Entity
```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column({ type: 'enum', enum: ['patient', 'relative', 'doctor', 'admin'] })
  role: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ nullable: true })
  last_login: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => UserProfile, profile => profile.user)
  profile: UserProfile;

  @OneToMany(() => HealthDiary, diary => diary.user)
  health_diary: HealthDiary[];

  @OneToMany(() => SosEvent, sos => sos.user)
  sos_events: SosEvent[];
}
```

#### UsersService
```typescript
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private readonly profileRepository: Repository<UserProfile>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ 
      where: { id },
      relations: ['profile']
    });
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<UserProfile> {
    const profile = await this.profileRepository.findOne({ where: { user_id: userId } });
    
    if (!profile) {
      const newProfile = this.profileRepository.create({
        user_id: userId,
        ...updateProfileDto,
      });
      return this.profileRepository.save(newProfile);
    }

    Object.assign(profile, updateProfileDto);
    return this.profileRepository.save(profile);
  }
}
```

### 3. Health Module

#### HealthDiary Entity
```typescript
@Entity('health_diary')
export class HealthDiary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column('date')
  entry_date: Date;

  @Column({ 
    type: 'enum', 
    enum: ['excellent', 'good', 'fair', 'poor', 'terrible'],
    nullable: true 
  })
  mood: string;

  @Column('jsonb', { nullable: true })
  blood_pressure: { systolic: number; diastolic: number };

  @Column({ nullable: true })
  heart_rate: number;

  @Column('jsonb', { nullable: true })
  medications_taken: string[];

  @Column('jsonb', { nullable: true })
  symptoms: string[];

  @Column('text', { nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, user => user.health_diary)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
```

#### HealthService
```typescript
@Injectable()
export class HealthService {
  constructor(
    @InjectRepository(HealthDiary)
    private readonly healthDiaryRepository: Repository<HealthDiary>,
  ) {}

  async createDiaryEntry(userId: string, createDiaryDto: CreateDiaryEntryDto): Promise<HealthDiary> {
    const entry = this.healthDiaryRepository.create({
      user_id: userId,
      ...createDiaryDto,
    });
    return this.healthDiaryRepository.save(entry);
  }

  async getDiaryEntries(
    userId: string, 
    startDate: Date, 
    endDate: Date
  ): Promise<HealthDiary[]> {
    return this.healthDiaryRepository.find({
      where: {
        user_id: userId,
        entry_date: Between(startDate, endDate),
      },
      order: { entry_date: 'DESC' },
    });
  }

  async getHealthStatistics(userId: string, period: string): Promise<any> {
    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case 'week':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
    }

    const entries = await this.healthDiaryRepository.find({
      where: {
        user_id: userId,
        entry_date: Between(startDate, endDate),
      },
    });

    return this.calculateStatistics(entries);
  }

  private calculateStatistics(entries: HealthDiary[]): any {
    // Логика расчета статистики
    const moodCounts = entries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {});

    const avgHeartRate = entries
      .filter(e => e.heart_rate)
      .reduce((sum, e) => sum + e.heart_rate, 0) / entries.length;

    return {
      total_entries: entries.length,
      mood_distribution: moodCounts,
      average_heart_rate: Math.round(avgHeartRate),
      // Другие метрики...
    };
  }
}
```

### 4. Emergency Module

#### SosEvent Entity
```typescript
@Entity('sos_events')
export class SosEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column('jsonb')
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };

  @Column('text', { nullable: true })
  message: string;

  @Column({ 
    type: 'enum', 
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium' 
  })
  severity: string;

  @Column({ 
    type: 'enum', 
    enum: ['pending', 'processing', 'resolved', 'cancelled'],
    default: 'pending' 
  })
  status: string;

  @Column({ nullable: true })
  resolved_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, user => user.sos_events)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
```

#### EmergencyService
```typescript
@Injectable()
export class EmergencyService {
  constructor(
    @InjectRepository(SosEvent)
    private readonly sosEventRepository: Repository<SosEvent>,
    @InjectRepository(EmergencyContact)
    private readonly emergencyContactRepository: Repository<EmergencyContact>,
    private readonly notificationService: NotificationService,
    private readonly firebaseService: FirebaseService,
  ) {}

  async createSosEvent(userId: string, createSosDto: CreateSosEventDto): Promise<SosEvent> {
    const sosEvent = this.sosEventRepository.create({
      user_id: userId,
      ...createSosDto,
    });

    const savedEvent = await this.sosEventRepository.save(sosEvent);
    
    // Отправка уведомлений
    await this.notifyEmergencyContacts(userId, savedEvent);
    await this.notifyEmergencyServices(savedEvent);

    return savedEvent;
  }

  private async notifyEmergencyContacts(userId: string, sosEvent: SosEvent): Promise<void> {
    const contacts = await this.emergencyContactRepository.find({
      where: { user_id: userId },
    });

    for (const contact of contacts) {
      await this.notificationService.sendSms(
        contact.phone,
        `SOS! ${sosEvent.user.profile?.first_name} нужна помощь. Локация: ${sosEvent.location.address}`
      );
    }
  }

  private async notifyEmergencyServices(sosEvent: SosEvent): Promise<void> {
    // Интеграция с экстренными службами
    // В реальном проекте здесь будет интеграция с API экстренных служб
    console.log(`SOS Event created: ${sosEvent.id} for user ${sosEvent.user_id}`);
  }
}
```

## Middleware и Guards

### JWT Auth Guard
```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('Не авторизован');
    }
    return user;
  }
}
```

### Role Guard
```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role?.includes(role));
  }
}
```

### Rate Limiting
```typescript
@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private readonly redisService: RedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const key = `rate_limit:${request.ip}:${request.route?.path}`;
    
    const current = await this.redisService.get(key);
    if (current && parseInt(current) >= 100) { // 100 запросов в час
      throw new TooManyRequestsException('Превышен лимит запросов');
    }

    await this.redisService.incr(key);
    await this.redisService.expire(key, 3600); // 1 час

    return true;
  }
}
```

## Валидация данных

### DTO с валидацией
```typescript
export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Пароль должен содержать минимум одну заглавную букву, одну строчную букву и одну цифру',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsPhoneNumber('RU')
  phone: string;

  @IsEnum(['patient', 'relative', 'doctor', 'admin'])
  role: string;
}

export class CreateDiaryEntryDto {
  @IsDateString()
  entry_date: string;

  @IsOptional()
  @IsEnum(['excellent', 'good', 'fair', 'poor', 'terrible'])
  mood?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => BloodPressureDto)
  blood_pressure?: BloodPressureDto;

  @IsOptional()
  @IsInt()
  @Min(30)
  @Max(250)
  heart_rate?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  medications_taken?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  symptoms?: string[];

  @IsOptional()
  @IsString()
  notes?: string;
}
```

## Обработка ошибок

### Global Exception Filter
```typescript
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Внутренняя ошибка сервера';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    } else if (exception instanceof QueryFailedError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Ошибка базы данных';
    }

    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      exception instanceof Error ? exception.stack : exception,
    );

    response.status(status).json({
      success: false,
      error: {
        code: this.getErrorCode(exception),
        message,
        timestamp: new Date().toISOString(),
        path: request.url,
      },
    });
  }

  private getErrorCode(exception: unknown): string {
    if (exception instanceof HttpException) {
      return exception.constructor.name;
    }
    return 'INTERNAL_ERROR';
  }
}
```

## Логирование

### Logger Service
```typescript
@Injectable()
export class LoggerService {
  private readonly logger = new Logger();

  log(message: string, context?: string) {
    this.logger.log(message, context);
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, trace, context);
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, context);
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, context);
  }
}
```

## Тестирование

### Unit тесты
```typescript
describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;

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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should login user with valid credentials', async () => {
    const user = { id: '1', email: 'test@test.com', password_hash: 'hashed' };
    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(user);
    jest.spyOn(service, 'validateUser').mockResolvedValue(user);

    const result = await service.login({ email: 'test@test.com', password: 'password' });

    expect(result).toHaveProperty('access_token');
    expect(result).toHaveProperty('user');
  });
});
```

## Деплой и мониторинг

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main"]
```

### Health Check
```typescript
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
    private readonly redis: RedisHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.redis.pingCheck('redis'),
    ]);
  }
}
```

---
*Последнее обновление: 14.09.2025*
