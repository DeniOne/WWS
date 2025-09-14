# 🧩 Компоненты интерфейса

## 🎯 Обзор

Детальное описание UI компонентов для тематических групп портала с учетом особенностей пользователей после инсульта.

## 🏥 Физические последствия инсульта

### Компонент: Карточка симптома
```jsx
<SymptomCard
  title="Паралич и слабость конечностей"
  severity="high"
  icon="arm-icon"
  description="Проблемы с движением рук и ног"
  actions={[
    { label: "Упражнения", type: "primary" },
    { label: "Устройства", type: "secondary" },
    { label: "Специалисты", type: "outline" }
  ]}
  progress={65}
  lastUpdate="2 дня назад"
/>
```

### Компонент: Трекер прогресса
```jsx
<ProgressTracker
  metric="Сила руки"
  currentValue={65}
  targetValue={80}
  unit="%"
  trend="up"
  history={[45, 52, 58, 65]}
  milestones={[
    { value: 50, label: "Базовая функция" },
    { value: 70, label: "Самообслуживание" },
    { value: 90, label: "Полное восстановление" }
  ]}
/>
```

### Компонент: Видео-инструкция
```jsx
<VideoInstruction
  title="Упражнения для восстановления моторики"
  duration="15 мин"
  difficulty="beginner"
  equipment={["резинка", "мяч"]}
  steps={[
    { time: "0:00", action: "Разминка" },
    { time: "3:00", action: "Упражнения для рук" },
    { time: "10:00", action: "Упражнения для ног" }
  ]}
  accessibility={{
    subtitles: true,
    audioDescription: true,
    slowMotion: true
  }}
/>
```

## 🧠 Когнитивные нарушения

### Компонент: Игра на память
```jsx
<MemoryGame
  type="cards"
  difficulty="medium"
  theme="повседневные предметы"
  instructions="Найдите пары одинаковых карточек"
  timeLimit={300}
  hints={3}
  onComplete={(score, time) => {
    // Сохранение результатов
  }}
  accessibility={{
    voiceInstructions: true,
    largeCards: true,
    highContrast: true
  }}
/>
```

### Компонент: Дневник когнитивных функций
```jsx
<CognitiveDiary
  date="2024-09-14"
  metrics={[
    { name: "Концентрация", value: 7, max: 10 },
    { name: "Память", value: 6, max: 10 },
    { name: "Речь", value: 8, max: 10 }
  ]}
  notes="Сегодня лучше концентрировался на чтении"
  mood="good"
  activities={["чтение", "кроссворды", "общение"]}
  onSave={(data) => {
    // Сохранение в базу данных
  }}
/>
```

### Компонент: Голосовой ассистент
```jsx
<VoiceAssistant
  language="ru"
  voice="female"
  commands={[
    "Повтори упражнение",
    "Покажи следующий шаг",
    "Сколько времени прошло?",
    "Помоги с речью"
  ]}
  onCommand={(command) => {
    // Обработка голосовых команд
  }}
  accessibility={{
    slowSpeech: true,
    clearPronunciation: true,
    visualFeedback: true
  }}
/>
```

## 💭 Психологические проблемы

### Компонент: Трекер настроения
```jsx
<MoodTracker
  date="2024-09-14"
  currentMood="anxious"
  intensity={6}
  factors={[
    { name: "Боль", impact: "negative" },
    { name: "Общение", impact: "positive" },
    { name: "Прогресс", impact: "positive" }
  ]}
  notes="Беспокоит боль в руке"
  suggestions={[
    "Попробуйте дыхательные упражнения",
    "Свяжитесь с психологом",
    "Послушайте музыку"
  ]}
  onSave={(moodData) => {
    // Сохранение данных о настроении
  }}
/>
```

### Компонент: Медитативное упражнение
```jsx
<MeditationExercise
  title="Дыхательная техника"
  duration={300}
  type="breathing"
  instructions={[
    "Сядьте удобно",
    "Закройте глаза",
    "Дышите медленно и глубоко"
  ]}
  audioGuide={true}
  visualGuide={true}
  onComplete={() => {
    // Отметка о выполнении
  }}
/>
```

## 🏠 Повседневные трудности

### Компонент: Планировщик задач
```jsx
<TaskPlanner
  date="2024-09-14"
  tasks={[
    { 
      id: 1, 
      title: "Принять лекарства", 
      time: "09:00",
      completed: true,
      category: "медицина"
    },
    { 
      id: 2, 
      title: "Упражнения для рук", 
      time: "10:00",
      completed: false,
      category: "реабилитация"
    }
  ]}
  categories={["медицина", "реабилитация", "быт", "общение"]}
  reminders={true}
  onTaskComplete={(taskId) => {
    // Отметка о выполнении задачи
  }}
/>
```

### Компонент: Адаптивное устройство
```jsx
<AdaptiveDevice
  name="Специальная ложка"
  category="питание"
  description="Удобная ложка с утолщенной ручкой"
  image="/images/devices/spoon.jpg"
  price="1500 руб"
  features={[
    "Утолщенная ручка",
    "Угол наклона 45°",
    "Нескользящее покрытие"
  ]}
  availability="в наличии"
  onOrder={() => {
    // Добавление в корзину
  }}
/>
```

## 🔄 Реабилитация

### Компонент: План реабилитации
```jsx
<RehabilitationPlan
  patientId="123"
  startDate="2024-09-01"
  endDate="2024-12-01"
  goals={[
    { 
      id: 1, 
      title: "Восстановить ходьбу", 
      progress: 60,
      deadline: "2024-10-15"
    },
    { 
      id: 2, 
      title: "Улучшить речь", 
      progress: 40,
      deadline: "2024-11-01"
    }
  ]}
  activities={[
    { 
      name: "Физиотерапия", 
      frequency: "3 раза в неделю",
      duration: "45 мин"
    },
    { 
      name: "Логопедия", 
      frequency: "2 раза в неделю",
      duration: "30 мин"
    }
  ]}
  onUpdateProgress={(goalId, progress) => {
    // Обновление прогресса
  }}
/>
```

### Компонент: Календарь занятий
```jsx
<SessionCalendar
  month="2024-09"
  sessions={[
    {
      id: 1,
      date: "2024-09-15",
      time: "10:00",
      type: "физиотерапия",
      specialist: "Иванов И.И.",
      status: "scheduled"
    }
  ]}
  onScheduleSession={(date, time, type) => {
    // Запись на занятие
  }}
  onCancelSession={(sessionId) => {
    // Отмена занятия
  }}
/>
```

## 🛡️ Профилактика

### Компонент: Монитор здоровья
```jsx
<HealthMonitor
  metrics={[
    {
      name: "Артериальное давление",
      value: "120/80",
      unit: "мм рт.ст.",
      status: "normal",
      trend: "stable"
    },
    {
      name: "Пульс",
      value: 72,
      unit: "уд/мин",
      status: "normal",
      trend: "down"
    }
  ]}
  alerts={[
    {
      type: "warning",
      message: "Пропущен прием лекарства",
      time: "2 часа назад"
    }
  ]}
  onSetReminder={(metric, value) => {
    // Установка напоминания
  }}
/>
```

### Компонент: Планировщик питания
```jsx
<NutritionPlanner
  date="2024-09-14"
  meals={[
    {
      name: "Завтрак",
      time: "08:00",
      items: [
        { name: "Овсянка", calories: 300 },
        { name: "Фрукты", calories: 100 }
      ]
    }
  ]}
  recommendations={[
    "Ограничить соль",
    "Больше овощей",
    "Достаточно воды"
  ]}
  onAddMeal={(meal) => {
    // Добавление приема пищи
  }}
/>
```

## 🤝 Социальная поддержка

### Компонент: Группа поддержки
```jsx
<SupportGroup
  name="Восстановление после инсульта"
  members={45}
  nextMeeting="2024-09-20 18:00"
  topics={[
    "Преодоление депрессии",
    "Возвращение к работе",
    "Семейные отношения"
  ]}
  recentPosts={[
    {
      author: "Анна К.",
      time: "2 часа назад",
      content: "Поделитесь опытом восстановления речи",
      likes: 12,
      comments: 5
    }
  ]}
  onJoinGroup={() => {
    // Присоединение к группе
  }}
  onCreatePost={(content) => {
    // Создание поста
  }}
/>
```

### Компонент: Чат с семьей
```jsx
<FamilyChat
  members={[
    { name: "Мария", role: "дочь", online: true },
    { name: "Петр", role: "муж", online: false }
  ]}
  messages={[
    {
      id: 1,
      author: "Мария",
      time: "14:30",
      content: "Как дела с упражнениями?",
      type: "text"
    }
  ]}
  onSendMessage={(message) => {
    // Отправка сообщения
  }}
  onStartVideoCall={() => {
    // Начало видеозвонка
  }}
/>
```

## ♿ Доступность

### Компонент: Настройки доступности
```jsx
<AccessibilitySettings
  visual={{
    fontSize: "large",
    contrast: "high",
    colorBlind: "protanopia"
  }}
  audio={{
    voiceSpeed: "slow",
    voiceGender: "female",
    soundEffects: true
  }}
  motor={{
    largeButtons: true,
    gestureControl: false,
    voiceControl: true
  }}
  cognitive={{
    simpleLanguage: true,
    stepByStep: true,
    reminders: true
  }}
  onSave={(settings) => {
    // Сохранение настроек
  }}
/>
```

## 📱 Адаптивность

### Мобильные устройства
- **Упрощенные компоненты**: Крупные кнопки, простые формы
- **Голосовое управление**: Для всех основных функций
- **Офлайн режим**: Критически важные функции доступны без интернета

### Планшеты
- **Двухколоночная верстка**: Контент + навигация
- **Интерактивные элементы**: Удобные для касания
- **Мультимедиа**: Видео, аудио, интерактивные схемы

### Десктоп
- **Полная функциональность**: Все возможности портала
- **Многозадачность**: Несколько открытых разделов
- **Расширенная навигация**: Боковая панель, быстрые ссылки

## 🔗 Связанные документы

- [Структура интерфейса портала](portal-interface-structure.md)
- [Системная архитектура](../architecture/system-architecture.md)
- [React Native документация](../mobile/react-native-docs.md)
- [REST API](../api/rest-api.md)

---

*Последнее обновление: 14.09.2025*
