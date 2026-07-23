# TaskFlow

> Master your productivity with TaskFlow, a beautiful and robust mobile application built for modern task management.

TaskFlow is a production-ready mobile application designed to help users organize their daily tasks efficiently. Developed using React Native CLI and a powerful Node.js/Express backend with MongoDB, TaskFlow features strict Clean Architecture principles, full TypeScript enforcement, and a heavily optimized UI loaded with fluid animations.

---

## 📱 Features

- **Robust Authentication**: Secure JSON Web Token (JWT) based authentication with BCrypt password hashing.
- **Advanced Task Management**: Full CRUD operations for daily tasks.
- **Intelligent Dashboard**: At-a-glance analytics including Completion Progress, Pending, Overdue, and Due Today statistics.
- **Categorization & Sorting**: Seamlessly filter by category (Work, Personal, Health, etc.), priority, and completion status.
- **Beautiful UI/UX**: Built with `react-native-paper` and `react-native-reanimated` for smooth 60fps cascading animations and interactive skeleton loaders.
- **Dark Mode Support**: Persisted dark mode toggle via Redux and AsyncStorage.
- **Global Snackbars**: Centralized, context-aware notification system.

---

## 🏗 Architecture & Tech Stack

### Frontend (Mobile App)
- **Framework**: React Native CLI
- **Language**: TypeScript (Strict Mode)
- **State Management**: Redux Toolkit & React-Redux
- **Navigation**: React Navigation (Native Stack)
- **UI Toolkit**: React Native Paper (Material Design 3)
- **Animations**: React Native Reanimated v3
- **Form Handling**: React Hook Form
- **Network Request**: Axios

### Backend (REST API)
- **Environment**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB Atlas via Mongoose
- **Security**: Helmet, CORS, BCryptjs
- **Auth**: JWT (JSON Web Tokens)

---

## 📁 Folder Structure

### Backend
```text
backend/
├── src/
│   ├── config/      # Database & Env configurations
│   ├── controllers/ # Request handlers
│   ├── middleware/  # Auth, Error handling
│   ├── models/      # Mongoose Schemas (User, Task)
│   ├── routes/      # API Routing
│   ├── types/       # Global TypeScript Interfaces
│   └── index.ts     # Express Server Entry Point
```

### Frontend
```text
frontend/
├── src/
│   ├── assets/      # App Icons, Images
│   ├── components/  # Reusable UI (TaskCard, SkeletonCard)
│   ├── constants/   # API URLs, Route Names
│   ├── navigation/  # React Navigation Root
│   ├── redux/       # Store setup and Slices (Auth, Tasks, UI)
│   ├── screens/     # Dashboard, Login, Add Task, Profile
│   ├── services/    # Axios API Integrations
│   ├── types/       # Global TypeScript Interfaces
│   └── utils/       # Token managers, helper functions
└── App.tsx          # Application Entry Point
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account (or local MongoDB)
- React Native CLI Environment Setup (Android Studio / Xcode)

### 1. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
```
Start the backend:
```bash
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
API_URL=http://YOUR_LOCAL_IP:5000/api
```
Run the application (Ensure Metro cache is cleared due to Reanimated):
```bash
npm start -- --reset-cache
npm run android # or npm run ios
```

---

## 📚 API Documentation

### Authentication Endpoints
| Method | Endpoint | Description | Body Requirements |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | `email`, `password` |
| POST | `/api/auth/login` | Authenticate user | `email`, `password` |
| GET | `/api/auth/me` | Get current user | *Requires Bearer Token* |

### Task Endpoints (Requires Bearer Token)
| Method | Endpoint | Description | Query/Body Params |
|---|---|---|---|
| GET | `/api/tasks` | Fetch tasks | Query: `search`, `category`, `sortBy`, `order`, `priority`, `completed` |
| POST | `/api/tasks` | Create a task | Body: `title`, `description`, `dateTime`, `deadline`, `priority`, `category` |
| PUT | `/api/tasks/:id` | Update a task | Body: Same as POST |
| PATCH | `/api/tasks/:id/toggle` | Toggle completion | None |
| DELETE | `/api/tasks/:id` | Delete a task | None |

---

## 📸 Screenshots

| Splash Screen | Login | Dashboard |
| --- | --- | --- |
| *(Add Screenshot)* | *(Add Screenshot)* | *(Add Screenshot)* |

| Task Details | Add Task | Dark Mode |
| --- | --- | --- |
| *(Add Screenshot)* | *(Add Screenshot)* | *(Add Screenshot)* |

---

## 🚀 Future Improvements (Scope)
- **Offline First**: Implement WatermelonDB or Realm for robust offline sync capabilities.
- **Push Notifications**: Integrate Firebase Cloud Messaging (FCM) to warn users about impending deadlines.
- **Calendar View**: Build a monthly calendar interface for visual workload distribution.

---

## 📜 License
This project is licensed under the MIT License.
