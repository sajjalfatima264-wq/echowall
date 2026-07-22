<div align="center">

#  EchoWall

### Anonymous Thoughts. Shared Together.

*A modern anonymous community platform where members create beautiful Echo Cards throughout the day that remain hidden until a scheduled reveal time.*

<br>

<img src="https://img.shields.io/badge/Frontend-React%20Native-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
<img src="https://img.shields.io/badge/Database-SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" />
<img src="https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/Language-Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />

<br><br>

> **Create anonymously. Wait together. Reveal together.**

</div>

---

# 📖 Overview

Traditional social platforms encourage instant sharing, leaving little room for anticipation or shared experiences.

**EchoWall** introduces a different approach.

Users join private communities where they anonymously create beautifully designed **Echo Cards** throughout the day. Instead of appearing instantly, every Echo remains locked until a scheduled reveal time, when the entire community experiences the reveal together.

This transforms everyday messages into a daily event rather than an endless feed.

---

# ✨ Features

## 🏘 Multi-Community System

- Create unlimited private communities
- Join communities using invite codes
- Belong to multiple communities simultaneously
- Discord-inspired community dashboard
- Community member management

---

## 🪩 Anonymous Echo Creation

Create personalized anonymous Echo Cards with:

- Rich text messages
- Multiple card themes
- Live card preview
- Character validation
- Anonymous posting
- Scheduled publishing

---

## ⏳ Time-Locked Reveal Engine

The core feature of EchoWall.

- Echoes remain hidden until reveal time
- Backend-controlled countdown
- Simultaneous reveal for every member
- Daily community gallery
- Real-time reveal status

---

## ❤️ Community Interaction

- Anonymous likes
- Beautiful gallery view
- Community statistics
- Reveal countdown
- Daily shared experience

---

## 🎨 Modern UI

- Dark Mode First
- Glassmorphism
- Smooth animations
- Gradient cards
- Responsive layouts
- Premium onboarding experience

---

# 📱 Application Flow

```text
Splash Screen
      │
      ▼
Welcome Screen
      │
      ▼
Username Setup
      │
      ▼
Dashboard
      │
 ┌────┴────┐
 │         │
 ▼         ▼
Create   Join
Community Community
 │         │
 └────┬────┘
      ▼
Community
      │
      ▼
Create Echo
      │
      ▼
Waiting Countdown
      │
      ▼
Reveal Gallery
```

---

# 🏗 Architecture

EchoWall follows a clean separation of concerns.

```text
React Native (Expo)

        │

Navigation

        │

Service Layer

        │

REST API

        │

FastAPI

        │

Business Logic

        │

SQLAlchemy ORM

        │

SQLite
```

---

# 🛠 Tech Stack

| Category | Technology |
|-----------|------------|
| Mobile | React Native |
| Framework | Expo SDK |
| Language | TypeScript |
| Backend | FastAPI |
| ORM | SQLAlchemy |
| Validation | Pydantic |
| Database | SQLite |
| Navigation | React Navigation |
| Storage | AsyncStorage |
| Styling | Expo Linear Gradient |
| Blur Effects | Expo Blur |
| Icons | Expo Vector Icons |
| Animations | React Native Reanimated |
| SVG | React Native SVG |

---

# 🗄 Database Design

```text
Users
 │
 ├───────────────┐
 │               │
 │      UserCommunities
 │               │
 └───────────────┘
         │
   Communities
         │
      Echoes
         │
       Likes
```

Relationships

- One User → Many Communities
- One Community → Many Users
- One Community → Many Echoes
- One Echo → Many Likes

---

# 🌐 API Overview

## Community

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/community/create` | Create community |
| POST | `/community/join` | Join using invite code |
| GET | `/communities` | Get joined communities |
| GET | `/community/{id}` | Community details |
| GET | `/community/{id}/members` | Community members |

---

## Echo

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/echo/create` | Create Echo |
| GET | `/community/{id}/echo/status` | Reveal status |
| POST | `/echo/{id}/like` | Like an Echo |

---

# 📂 Project Structure

```text
EchoWall
│
├── backend
│   ├── app
│   │   ├── config
│   │   ├── database
│   │   ├── models
│   │   ├── routes
│   │   ├── schemas
│   │   ├── services
│   │   └── main.py
│   │
│   └── requirements.txt
│
└── frontend
    ├── src
    │   ├── components
    │   ├── navigation
    │   ├── screens
    │   ├── services
    │   ├── utils
    │   └── assets
    │
    ├── App.tsx
    └── package.json
```

---

# 🚀 Local Setup

## Prerequisites

- Node.js
- npm
- Python 3.10+
- Expo Go

---

## Clone Repository

```bash
git clone https://github.com/sajjalfatima264-wq/EchoWall.git

cd EchoWall
```

---

## Backend

```bash
cd backend

python -m venv venv

source venv/bin/activate

# Windows
venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Backend runs on

```
http://localhost:8000
```

Swagger Documentation

```
http://localhost:8000/docs
```

---

## Frontend

```bash
cd frontend

npm install

npx expo start
```

Update your `.env` file with your local API URL.

Example

```env
EXPO_PUBLIC_API_URL=http://192.168.1.10:8000
```

Scan the QR code using **Expo Go**.

---

# 📸 Screenshots

> Add screenshots here once the application is complete.

| Splash | Dashboard | Community |
|--------|-----------|-----------|
| Image | Image | Image |

| Echo Designer | Reveal Gallery | Settings |
|---------------|----------------|----------|
| Image | Image | Image |

---

# 🎥 Demo

A demo GIF or video can be added here.

Example:

```text
docs/demo.gif
```

---

# 🚀 Future Improvements

- Voice Echoes
- Image Echoes
- Push Notifications
- Emoji Reactions
- Community Moderation
- PostgreSQL Support
- JWT Authentication
- Public Communities
- Community Discovery
- User Profiles
- Cloud Deployment

---

# 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

1. Fork the repository

2. Create a feature branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Added feature"
```

4. Push your branch

```bash
git push origin feature-name
```

5. Open a Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

<div align="center">

### ⭐ If you found this project interesting, consider giving it a star!

Made with ❤️ using React Native, FastAPI, and TypeScript.

</div>
