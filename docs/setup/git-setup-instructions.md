# 🔧 Инструкция по настройке Git для проекта WWS

## 📥 Установка Git

### Вариант 1: Скачать с официального сайта (Рекомендуется)
1. Перейди на [git-scm.com](https://git-scm.com/download/win)
2. Скачай Git for Windows
3. Запусти установщик с правами администратора
4. Выбери все опции по умолчанию
5. Перезапусти PowerShell после установки

### Вариант 2: Через winget (если работает)
```powershell
# Открой PowerShell как администратор
winget install --id Git.Git -e --source winget
```

### Вариант 3: Через Chocolatey (если есть права)
```powershell
# Открой PowerShell как администратор
choco install git
```

## ⚙️ Настройка Git

### 1. Настройка пользователя
```bash
git config --global user.name "Denis Govako"
git config --global user.email "denis@withoutwordsstroke.com"
```

### 2. Настройка редактора
```bash
git config --global core.editor "code --wait"
```

### 3. Настройка окончаний строк
```bash
git config --global core.autocrlf true
```

## 🚀 Подключение к репозиторию WWS

### 1. Инициализация локального репозитория
```bash
cd "E:\Google Drive\ИНСУЛЬТ"
git init
```

### 2. Добавление удаленного репозитория
```bash
git remote add origin https://github.com/DeniOne/WWS.git
```

### 3. Создание .gitignore
```bash
# Создай файл .gitignore в корне проекта
echo "# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
build/
dist/
.next/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Database
*.db
*.sqlite

# Temporary files
tmp/
temp/
" > .gitignore
```

### 4. Первый коммит
```bash
# Добавить все файлы
git add .

# Создать первый коммит
git commit -m "Initial commit: Without Words Stroke project setup"

# Отправить в GitHub
git push -u origin main
```

## 📁 Структура репозитория

```
WWS/
├── README.md                    # Главный README проекта
├── .gitignore                   # Исключения для Git
├── docs/                        # Документация
│   ├── README.md               # Документация проекта
│   ├── architecture/           # Архитектурные решения
│   ├── api/                    # API спецификации
│   ├── services/               # Спецификации сервисов
│   ├── ux-ui/                  # UX/UI документация
│   ├── design/                 # Дизайн и промпты
│   ├── development/            # Планы разработки
│   ├── research/               # Научные исследования
│   ├── testing/                # Тестирование
│   ├── security/               # Безопасность
│   ├── deployment/             # Развертывание
│   └── setup/                  # Инструкции по настройке
├── memory-bank/                 # База знаний проекта
│   ├── README.md
│   ├── projectbrief.md
│   ├── activeContext.md
│   ├── systemPatterns.md
│   ├── techContext.md
│   └── progress.md
├── marketing/                   # Маркетинговая документация
│   ├── README.md
│   ├── marketing-roadmap.md
│   ├── branding-and-domains.md
│   └── content-strategy.md
└── src/                        # Исходный код (будет добавлен)
    ├── frontend/               # React/Next.js приложение
    ├── backend/                # Node.js API
    ├── mobile/                 # React Native приложение
    └── shared/                 # Общие компоненты
```

## 🔄 Ежедневный workflow

### 1. Получение изменений
```bash
git pull origin main
```

### 2. Создание новой ветки для задачи
```bash
git checkout -b feature/new-feature
# или
git checkout -b fix/bug-description
```

### 3. Работа с файлами
```bash
# Добавить файлы
git add .
# или конкретный файл
git add docs/design/ai-designer-prompt.md

# Проверить статус
git status

# Создать коммит
git commit -m "Add: AI designer prompt for Loveble"
```

### 4. Отправка изменений
```bash
# Отправить ветку
git push origin feature/new-feature

# Создать Pull Request на GitHub
# Затем слить в main
git checkout main
git pull origin main
git merge feature/new-feature
git push origin main
```

## 🏷️ Соглашения по коммитам

### Формат сообщений
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Типы коммитов
- **feat**: новая функция
- **fix**: исправление бага
- **docs**: изменения в документации
- **style**: форматирование, отсутствующие точки с запятой и т.д.
- **refactor**: рефакторинг кода
- **test**: добавление тестов
- **chore**: обновление задач сборки, конфигурации и т.д.

### Примеры
```bash
git commit -m "feat(design): add AI designer prompt for Loveble"
git commit -m "docs(architecture): update system architecture with new services"
git commit -m "fix(api): resolve authentication issue in user service"
```

## 🔐 Настройка SSH ключей (опционально)

### 1. Генерация SSH ключа
```bash
ssh-keygen -t ed25519 -C "denis@withoutwordsstroke.com"
```

### 2. Добавление в SSH агент
```bash
ssh-add ~/.ssh/id_ed25519
```

### 3. Добавление в GitHub
1. Скопируй содержимое `~/.ssh/id_ed25519.pub`
2. Перейди в GitHub Settings > SSH and GPG keys
3. Нажми "New SSH key"
4. Вставь ключ и сохрани

### 4. Изменение URL репозитория на SSH
```bash
git remote set-url origin git@github.com:DeniOne/WWS.git
```

## 🚨 Решение проблем

### Проблема: "git is not recognized"
**Решение**: Перезапусти PowerShell после установки Git

### Проблема: "Permission denied"
**Решение**: Убедись, что используешь правильный токен доступа

### Проблема: "Merge conflicts"
**Решение**: 
```bash
git status
# Реши конфликты в файлах
git add .
git commit -m "Resolve merge conflicts"
```

## 📚 Полезные команды

```bash
# Просмотр истории
git log --oneline

# Просмотр изменений
git diff

# Отмена изменений
git checkout -- <file>

# Создание тега
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# Просмотр веток
git branch -a

# Удаление ветки
git branch -d feature/old-feature
git push origin --delete feature/old-feature
```

---

*Инструкция по настройке Git для проекта "Without Words Stroke" - последнее обновление: 14.09.2025*
