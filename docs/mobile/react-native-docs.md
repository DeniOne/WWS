# 📱 Mobile - React Native Документация

## Обзор

Мобильное приложение построено на **React Native** с использованием **TypeScript** и **Expo** для быстрой разработки и кроссплатформенности. Приложение поддерживает iOS и Android с единой кодовой базой.

## Структура проекта

```
mobile/
├── src/
│   ├── components/          # Переиспользуемые компоненты
│   │   ├── common/         # Общие компоненты
│   │   ├── forms/          # Формы
│   │   ├── cards/          # Карточки
│   │   └── modals/         # Модальные окна
│   ├── screens/            # Экраны приложения
│   │   ├── auth/           # Авторизация
│   │   ├── profile/        # Профиль
│   │   ├── health/         # Здоровье
│   │   ├── emergency/      # SOS
│   │   ├── community/      # Сообщество
│   │   └── marketplace/    # Маркетплейс
│   ├── navigation/         # Навигация
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── TabNavigator.tsx
│   ├── services/           # API сервисы
│   │   ├── api.ts
│   │   ├── auth.service.ts
│   │   ├── health.service.ts
│   │   └── emergency.service.ts
│   ├── store/              # State management
│   │   ├── index.ts
│   │   ├── auth.slice.ts
│   │   ├── health.slice.ts
│   │   └── community.slice.ts
│   ├── utils/              # Утилиты
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   └── validators.ts
│   ├── types/              # TypeScript типы
│   │   ├── api.types.ts
│   │   ├── user.types.ts
│   │   └── health.types.ts
│   ├── hooks/              # Кастомные хуки
│   │   ├── useAuth.ts
│   │   ├── useHealth.ts
│   │   └── useLocation.ts
│   └── assets/             # Ресурсы
│       ├── images/
│       ├── icons/
│       └── fonts/
├── android/                # Android специфичные файлы
├── ios/                    # iOS специфичные файлы
├── app.json               # Expo конфигурация
├── package.json
├── tsconfig.json
└── babel.config.js
```

## Установка и запуск

### Предварительные требования
- Node.js 18+
- npm или yarn
- Expo CLI
- Android Studio (для Android)
- Xcode (для iOS)

### Установка
```bash
# Клонирование репозитория
git clone <repository-url>
cd mobile

# Установка зависимостей
npm install

# Установка Expo CLI
npm install -g @expo/cli

# Запуск в режиме разработки
npm start

# Запуск на Android
npm run android

# Запуск на iOS
npm run ios
```

### Конфигурация
```json
// app.json
{
  "expo": {
    "name": "Stroke Support",
    "slug": "stroke-support-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "platforms": ["ios", "android"],
    "ios": {
      "bundleIdentifier": "com.strokesupport.app",
      "buildNumber": "1.0.0"
    },
    "android": {
      "package": "com.strokesupport.app",
      "versionCode": 1
    },
    "plugins": [
      "expo-location",
      "expo-notifications",
      "expo-camera",
      "expo-contacts"
    ]
  }
}
```

## Основные компоненты

### 1. Навигация

#### AppNavigator
```typescript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';

import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import { RootState } from '../store';

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={TabNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
```

#### TabNavigator
```typescript
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HealthScreen from '../screens/health/HealthScreen';
import CommunityScreen from '../screens/community/CommunityScreen';
import MarketplaceScreen from '../screens/marketplace/MarketplaceScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import EmergencyButton from '../components/emergency/EmergencyButton';

const Tab = createBottomTabNavigator();

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Health':
              iconName = focused ? 'heart' : 'heart-outline';
              break;
            case 'Community':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'Marketplace':
              iconName = focused ? 'storefront' : 'storefront-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Health" 
        component={HealthScreen}
        options={{ title: 'Здоровье' }}
      />
      <Tab.Screen 
        name="Community" 
        component={CommunityScreen}
        options={{ title: 'Сообщество' }}
      />
      <Tab.Screen 
        name="Marketplace" 
        component={MarketplaceScreen}
        options={{ title: 'Маркетплейс' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Профиль' }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
```

### 2. State Management (Redux Toolkit)

#### Auth Slice
```typescript
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../../services/auth.service';
import { User, LoginCredentials, RegisterData } from '../../types/user.types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка входа');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка регистрации');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
```

### 3. API Services

#### Auth Service
```typescript
import { api } from './api';
import { LoginCredentials, RegisterData, AuthResponse } from '../types/user.types';

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', userData);
    return response.data;
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await api.post('/auth/refresh', { refresh_token: refreshToken });
    return response.data;
  }

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  }
}

export const authService = new AuthService();
```

#### API Configuration
```typescript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/v1' 
  : 'https://api.stroke-support.com/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor для добавления токена
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await api.post('/auth/refresh', { refresh_token: refreshToken });
          const { access_token } = response.data;
          
          await AsyncStorage.setItem('access_token', access_token);
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
        // Navigate to login screen
      }
    }

    return Promise.reject(error);
  }
);
```

### 4. SOS Emergency Screen

```typescript
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Vibration,
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as Location from 'expo-location';
import { emergencyService } from '../../services/emergency.service';
import { RootState } from '../../store';

const { width, height } = Dimensions.get('window');

const EmergencyScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Ошибка', 'Разрешение на геолокацию не предоставлено');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    } catch (error) {
      console.error('Ошибка получения геолокации:', error);
    }
  };

  const handleSOS = async () => {
    if (!location) {
      Alert.alert('Ошибка', 'Не удалось получить ваше местоположение');
      return;
    }

    Alert.alert(
      'SOS',
      'Вы уверены, что хотите отправить сигнал SOS?',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Отправить', onPress: sendSOS, style: 'destructive' },
      ]
    );
  };

  const sendSOS = async () => {
    setIsSending(true);
    
    try {
      // Вибрация для подтверждения
      Vibration.vibrate([0, 500, 200, 500]);

      const sosData = {
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          address: 'Определяется...', // Можно использовать reverse geocoding
        },
        message: 'SOS! Нужна помощь!',
        severity: 'high',
      };

      await emergencyService.createSosEvent(sosData);
      
      Alert.alert(
        'SOS отправлен',
        'Ваш сигнал SOS отправлен близким и экстренным службам',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось отправить SOS сигнал');
      console.error('SOS Error:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Экстренная помощь</Text>
      
      <View style={styles.sosContainer}>
        <TouchableOpacity
          style={[styles.sosButton, isSending && styles.sosButtonDisabled]}
          onPress={handleSOS}
          disabled={isSending}
        >
          <Text style={styles.sosText}>
            {isSending ? 'Отправка...' : 'SOS'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Нажмите кнопку SOS в случае экстренной ситуации
        </Text>
        <Text style={styles.infoText}>
          Ваши близкие и экстренные службы будут уведомлены
        </Text>
      </View>

      {location && (
        <View style={styles.locationContainer}>
          <Text style={styles.locationText}>
            Местоположение: {location.coords.latitude.toFixed(4)}, {location.coords.longitude.toFixed(4)}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  sosContainer: {
    marginBottom: 40,
  },
  sosButton: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  sosButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sosText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  locationContainer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: '#999',
  },
});

export default EmergencyScreen;
```

### 5. Health Diary Screen

```typescript
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Picker } from '@react-native-picker/picker';
import { healthService } from '../../services/health.service';
import { RootState } from '../../store';

const HealthScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { diaryEntries, isLoading } = useSelector((state: RootState) => state.health);

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    mood: 'good',
    blood_pressure_systolic: '',
    blood_pressure_diastolic: '',
    heart_rate: '',
    medications: '',
    symptoms: '',
    notes: '',
  });

  useEffect(() => {
    loadDiaryEntries();
  }, []);

  const loadDiaryEntries = async () => {
    try {
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      await dispatch(loadHealthDiary({
        startDate: weekAgo.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0],
      }));
    } catch (error) {
      console.error('Ошибка загрузки дневника:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const diaryData = {
        entry_date: new Date().toISOString().split('T')[0],
        mood: formData.mood,
        blood_pressure: formData.blood_pressure_systolic && formData.blood_pressure_diastolic
          ? {
              systolic: parseInt(formData.blood_pressure_systolic),
              diastolic: parseInt(formData.blood_pressure_diastolic),
            }
          : undefined,
        heart_rate: formData.heart_rate ? parseInt(formData.heart_rate) : undefined,
        medications_taken: formData.medications ? formData.medications.split(',').map(m => m.trim()) : [],
        symptoms: formData.symptoms ? formData.symptoms.split(',').map(s => s.trim()) : [],
        notes: formData.notes,
      };

      await dispatch(addDiaryEntry(diaryData));
      
      setShowAddForm(false);
      setFormData({
        mood: 'good',
        blood_pressure_systolic: '',
        blood_pressure_diastolic: '',
        heart_rate: '',
        medications: '',
        symptoms: '',
        notes: '',
      });
      
      Alert.alert('Успех', 'Запись добавлена в дневник');
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось добавить запись');
    }
  };

  const getMoodEmoji = (mood: string) => {
    const moodEmojis = {
      excellent: '😊',
      good: '🙂',
      fair: '😐',
      poor: '😔',
      terrible: '😢',
    };
    return moodEmojis[mood] || '😐';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Дневник здоровья</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddForm(!showAddForm)}
        >
          <Text style={styles.addButtonText}>
            {showAddForm ? 'Отмена' : 'Добавить запись'}
          </Text>
        </TouchableOpacity>
      </View>

      {showAddForm && (
        <View style={styles.form}>
          <Text style={styles.formTitle}>Новая запись</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Настроение</Text>
            <Picker
              selectedValue={formData.mood}
              onValueChange={(value) => setFormData({ ...formData, mood: value })}
              style={styles.picker}
            >
              <Picker.Item label="Отлично 😊" value="excellent" />
              <Picker.Item label="Хорошо 🙂" value="good" />
              <Picker.Item label="Нормально 😐" value="fair" />
              <Picker.Item label="Плохо 😔" value="poor" />
              <Picker.Item label="Ужасно 😢" value="terrible" />
            </Picker>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Давление</Text>
            <View style={styles.bloodPressureContainer}>
              <TextInput
                style={[styles.input, styles.bloodPressureInput]}
                placeholder="Систолическое"
                value={formData.blood_pressure_systolic}
                onChangeText={(text) => setFormData({ ...formData, blood_pressure_systolic: text })}
                keyboardType="numeric"
              />
              <Text style={styles.slash}>/</Text>
              <TextInput
                style={[styles.input, styles.bloodPressureInput]}
                placeholder="Диастолическое"
                value={formData.blood_pressure_diastolic}
                onChangeText={(text) => setFormData({ ...formData, blood_pressure_diastolic: text })}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Пульс (уд/мин)</Text>
            <TextInput
              style={styles.input}
              placeholder="72"
              value={formData.heart_rate}
              onChangeText={(text) => setFormData({ ...formData, heart_rate: text })}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Принятые лекарства</Text>
            <TextInput
              style={styles.input}
              placeholder="Аспирин, Аторвастатин"
              value={formData.medications}
              onChangeText={(text) => setFormData({ ...formData, medications: text })}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Симптомы</Text>
            <TextInput
              style={styles.input}
              placeholder="головная боль, тошнота"
              value={formData.symptoms}
              onChangeText={(text) => setFormData({ ...formData, symptoms: text })}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Заметки</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Дополнительные заметки..."
              value={formData.notes}
              onChangeText={(text) => setFormData({ ...formData, notes: text })}
              multiline
              numberOfLines={3}
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Сохранить</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.entries}>
        <Text style={styles.entriesTitle}>Последние записи</Text>
        {diaryEntries.map((entry, index) => (
          <View key={index} style={styles.entry}>
            <View style={styles.entryHeader}>
              <Text style={styles.entryDate}>
                {new Date(entry.entry_date).toLocaleDateString('ru-RU')}
              </Text>
              <Text style={styles.entryMood}>
                {getMoodEmoji(entry.mood)}
              </Text>
            </View>
            
            {entry.blood_pressure && (
              <Text style={styles.entryText}>
                Давление: {entry.blood_pressure.systolic}/{entry.blood_pressure.diastolic}
              </Text>
            )}
            
            {entry.heart_rate && (
              <Text style={styles.entryText}>
                Пульс: {entry.heart_rate} уд/мин
              </Text>
            )}
            
            {entry.medications_taken && entry.medications_taken.length > 0 && (
              <Text style={styles.entryText}>
                Лекарства: {entry.medications_taken.join(', ')}
              </Text>
            )}
            
            {entry.symptoms && entry.symptoms.length > 0 && (
              <Text style={styles.entryText}>
                Симптомы: {entry.symptoms.join(', ')}
              </Text>
            )}
            
            {entry.notes && (
              <Text style={styles.entryNotes}>{entry.notes}</Text>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  form: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  picker: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  bloodPressureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bloodPressureInput: {
    flex: 1,
  },
  slash: {
    marginHorizontal: 8,
    fontSize: 18,
    fontWeight: 'bold',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  entries: {
    padding: 20,
  },
  entriesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  entry: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  entryDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  entryMood: {
    fontSize: 20,
  },
  entryText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  entryNotes: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
  },
});

export default HealthScreen;
```

## Push уведомления

### Notification Service
```typescript
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

class NotificationService {
  async registerForPushNotifications() {
    if (!Device.isDevice) {
      console.log('Push notifications work only on physical devices');
      return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Push token:', token);

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  }

  async scheduleHealthReminder() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Напоминание о здоровье',
        body: 'Не забудьте записать данные в дневник здоровья',
        sound: true,
      },
      trigger: {
        hour: 20,
        minute: 0,
        repeats: true,
      },
    });
  }
}

export const notificationService = new NotificationService();
```

## Офлайн режим

### Offline Storage
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

class OfflineService {
  private isOnline = true;

  constructor() {
    NetInfo.addEventListener(state => {
      this.isOnline = state.isConnected;
    });
  }

  async saveOfflineData(key: string, data: any) {
    try {
      const offlineData = await AsyncStorage.getItem('offline_data');
      const parsedData = offlineData ? JSON.parse(offlineData) : {};
      parsedData[key] = data;
      await AsyncStorage.setItem('offline_data', JSON.stringify(parsedData));
    } catch (error) {
      console.error('Ошибка сохранения офлайн данных:', error);
    }
  }

  async getOfflineData(key: string) {
    try {
      const offlineData = await AsyncStorage.getItem('offline_data');
      const parsedData = offlineData ? JSON.parse(offlineData) : {};
      return parsedData[key];
    } catch (error) {
      console.error('Ошибка получения офлайн данных:', error);
      return null;
    }
  }

  async syncOfflineData() {
    if (!this.isOnline) return;

    try {
      const offlineData = await AsyncStorage.getItem('offline_data');
      if (!offlineData) return;

      const parsedData = JSON.parse(offlineData);
      
      // Синхронизация с сервером
      for (const [key, data] of Object.entries(parsedData)) {
        // Отправка данных на сервер
        // await api.post(`/sync/${key}`, data);
      }

      // Очистка офлайн данных после синхронизации
      await AsyncStorage.removeItem('offline_data');
    } catch (error) {
      console.error('Ошибка синхронизации:', error);
    }
  }
}

export const offlineService = new OfflineService();
```

---
*Последнее обновление: 14.09.2025*
