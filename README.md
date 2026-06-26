<div align="center">

<img src="https://img.shields.io/badge/Next.js-16.x-000000?style=for-the-badge&logo=nextdotjs&logoColor=white"/>
<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
<img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
<img src="https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white"/>
<img src="https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"/>
<img src="https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white"/>

# 🏗️ Kran Montaj

### Корпоративный сайт компании по монтажу кранового оборудования

*Современный лендинг с административной панелью, галереей проектов, видеопортфолио и управлением через Supabase*

[🌐 Живое демо](https://kran-montaj-demo-design.vercel.app) • [Сообщить об ошибке](https://github.com/SayfullakhonovKomilkhon/kran-montaj-demo-design/issues)

</div>

---

## ✨ Возможности

| Функция | Описание |
|---|---|
| 🎨 **Корпоративный лендинг** | Стильный сайт-витрина с анимациями (Framer Motion + AOS) |
| 🖼️ **Галерея проектов** | Фотогалерея выполненных работ с хранением в Supabase Storage |
| 🎬 **Видеопортфолио** | Видеоматериалы проектов |
| 📱 **Карусель** | Слайдер с Swiper.js |
| 🔐 **Аутентификация** | Вход для администраторов через Supabase Auth |
| ⚙️ **Админ-панель** | Управление фото, видео и контентом сайта |
| 🗄️ **База данных** | PostgreSQL через Supabase с RLS политиками |
| 🚀 **Деплой** | Автоматический деплой на Vercel |

---

## 🚀 Быстрый старт

### Требования

- Node.js >= 18
- npm / yarn / pnpm
- Аккаунт [Supabase](https://supabase.com)

### Установка

```bash
# 1. Клонируйте репозиторий
git clone https://github.com/SayfullakhonovKomilkhon/kran-montaj-demo-design.git
cd kran-montaj-demo-design

# 2. Установите зависимости
npm install

# 3. Настройте переменные окружения
cp .env.example .env.local
# Заполните NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Настройка Supabase

```bash
# Выполните SQL-скрипты в Supabase SQL Editor в следующем порядке:
1. supabase-setup.sql            # Основные таблицы
2. supabase-complete-setup.sql   # Полная схема БД
3. supabase-admin-setup.sql      # Настройка администраторов
4. supabase-photos-setup.sql     # Storage для фото
5. supabase-videos-table.sql     # Таблица видео

# Подробнее — в SUPABASE-SETUP-GUIDE.md
```

### Запуск

```bash
# Разработка
npm run dev

# Продакшн сборка
npm run build
npm run start
```

Откройте [http://localhost:3000](http://localhost:3000)

---

## 🛠️ Технологический стек

| Категория | Технология |
|---|---|
| **Фреймворк** | Next.js 16.x (App Router) |
| **UI-библиотека** | React 19 |
| **Язык** | TypeScript 5 |
| **Стили** | Tailwind CSS 4 |
| **Backend / BaaS** | Supabase (PostgreSQL + Auth + Storage) |
| **Анимации** | Framer Motion + AOS |
| **Слайдер** | Swiper.js |
| **Иконки** | react-icons |
| **Даты** | date-fns |
| **Деплой** | Vercel |

---

## 🏗️ Структура проекта

```
app/
├── (public)/               # Публичные страницы лендинга
│   ├── page.tsx            # Главная страница
│   ├── about/              # О компании
│   ├── projects/           # Портфолио проектов
│   └── contacts/           # Контакты
├── admin/                  # Защищённая админ-панель
│   ├── photos/             # Управление фотогалереей
│   ├── videos/             # Управление видео
│   └── settings/           # Настройки сайта
└── layout.tsx

public/                     # Статические ресурсы
memory-bank/                # Документация проекта

supabase-*.sql              # SQL-скрипты настройки БД
```

---

## 🔑 Переменные окружения

| Переменная | Описание |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL вашего Supabase проекта |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Публичный anon-ключ Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Серверный ключ (только для сервера) |

---

## 🔐 Администратор

После настройки базы данных вы можете войти в панель администратора по адресу `/admin`.

```
Подробнее о настройке — в ADMIN-README.md
```

---

## 🌐 Деплой на Vercel

```bash
# Через Vercel CLI
npm install -g vercel
vercel --prod

# Или через команду проекта
npm run deploy
```

Добавьте переменные окружения в настройках Vercel проекта.

---

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте ветку: `git checkout -b feature/your-feature`
3. Сделайте коммит: `git commit -m 'feat: add your feature'`
4. Запушьте: `git push origin feature/your-feature`
5. Откройте Pull Request

---

<div align="center">

Корпоративный сайт · Powered by [Next.js](https://nextjs.org/) & [Supabase](https://supabase.com/) · Deployed on [Vercel](https://vercel.com)

</div>
