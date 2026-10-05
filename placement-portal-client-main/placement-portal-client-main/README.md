<div align="center">

# 🚀 PlaceMentor Frontend

### AI-Powered Placement Tracker & Interview Preparation Platform

Modern and responsive frontend built using **React**, **Vite**, **Tailwind CSS**, and **Recharts** for visualizing placement analytics and interacting with the PlaceMentor backend.

[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=white)]()
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)]()
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?logo=tailwindcss&logoColor=white)]()
[![Axios](https://img.shields.io/badge/API-Axios-5A29E4)]()
[![Render](https://img.shields.io/badge/Backend-Render-5A67D8)]()
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)]()

## 🌐 Live Demo

🚀 **[Try PlaceMentor](https://placement-portal-client-two.vercel.app/)**

AI-powered placement tracking and interview preparation portal.

</div>

---

# 📖 Overview

PlaceMentor Frontend provides an intuitive interface for managing the complete placement journey.

Users can track job applications, monitor interview progress, generate AI-powered interview preparation, upload resumes, and analyze placement statistics through an interactive dashboard.

The frontend communicates with the PlaceMentor Backend via secure REST APIs protected using JWT authentication.

---

# ✨ Features

## 🔐 Authentication

- User Registration
- User Login
- Protected Routes
- Persistent Authentication
- Profile Management

---

## 📋 Application Management

- View Applications
- Create New Applications
- Edit Existing Applications
- Delete Applications
- Track Interview Stages
- Schedule Upcoming Events

---

## 🤖 AI Preparation

Generate company-specific preparation including:

- Study Roadmap
- Online Assessment Preparation
- Technical Interview Questions
- HR Interview Questions
- AI Interview Strategies

Supports

- Cached AI Responses
- Force Regeneration
- Resume-based Preparation

---

## 📊 Dashboard & Analytics

Interactive dashboard displaying:

- Total Applications
- Current Pipeline
- Upcoming Interviews
- Offer Statistics
- Application Source Distribution
- Stage-wise Analytics

---

# 🎨 UI Highlights

- Responsive Layout
- Modern Glassmorphism Design
- Interactive Dashboard
- Loading Animations
- Toast Notifications
- Responsive Cards
- Dark Theme
- Mobile Friendly

---

# ⚙️ Tech Stack

| Category | Technology |
|-----------|------------|
| Framework | React |
| Build Tool | Vite |
| Routing | React Router |
| Styling | Tailwind CSS |
| Charts | Recharts |
| HTTP Client | Axios |
| Icons | Lucide React |
| Deployment | Vercel |

---

# 📂 Project Structure

```
src
│
├── components
│
├── context
│   └── AuthContext.jsx
│
├── pages
│   ├── Dashboard
│   ├── Applications
│   ├── AIPreparation
│   ├── Analytics
│   ├── Profile
│   └── Auth
│
├── services
│   ├── api.js
│   ├── authService.js
│   ├── applicationService.js
│   └── aiService.js
│
├── App.jsx
└── main.jsx
```

---

# 🔄 Application Flow

```
User

↓

Login/Register

↓

Dashboard

↓

Manage Applications

↓

Generate AI Preparation

↓

Backend API

↓

Gemini AI

↓

Display AI Content
```

---

# 🔐 Authentication

The frontend uses JWT authentication.

Workflow:

```
Login

↓

Receive JWT

↓

Store Token

↓

Attach Authorization Header

↓

Access Protected APIs
```

Axios interceptors automatically:

- Attach JWT tokens
- Handle Unauthorized (401) responses
- Redirect users to Login when the session expires

---

# 🌍 Environment Variables

Create a `.env.local`

```env
VITE_API_URL=http://localhost:5000/api
```

For Production

```env
VITE_API_URL=https://your-render-backend.onrender.com/api
```

---

# 💻 Local Setup

Clone Repository

```bash
git clone https://github.com/placement-portal-team/placement-portal-client.git
```

Navigate

```bash
cd placement-portal-client
```

Install Dependencies

```bash
npm install
```

Run Development Server

```bash
npm run dev
```

Application runs at

```
http://localhost:5173
```

---

# 🚀 Deployment

The frontend is deployed using **Vercel**.

Production communicates with the backend deployed on **Render**.

---

# 📸 Screenshots

Add screenshots here after deployment.

Suggested screenshots:

- Login Page
- Dashboard
- Applications
- AI Preparation
- Analytics
- Profile

---

# 🔮 Future Improvements

- Calendar Integration
- Push Notifications
- Interview Reminder Emails
- Theme Customization
- Progressive Web App (PWA)
- Offline Support
- AI Mock Interview UI
- Real-time Notifications

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/feature-name
```

3. Commit changes

```bash
git commit -m "Add feature"
```

4. Push

```bash
git push origin feature/feature-name
```

5. Open a Pull Request

---

# 👨‍💻 Team

**Project:** PlaceMentor

Developed as part of a Full Stack MERN Internship Project.

Backend and Frontend are maintained in separate repositories.

---

# ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub.

---

<div align="center">

### Built with ❤️ using React • Vite • Tailwind CSS • Axios • Recharts • Vercel

</div>
