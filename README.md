# GoPass – Full Stack Learning Management System

A comprehensive learning management system built with Next.js (Frontend) and Node.js / Express / MongoDB (Backend).

## 📋 Table of Contents
- Prerequisites
- Installation
- Running the Application
- Testing with JSON Server
- Project Structure
- Test Accounts
- Troubleshooting

## 🔧 Prerequisites
Before you begin, ensure you have installed:
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (v5 or higher) – for production backend
- Git

## 📥 Installation

### 1. Clone the Repository
git clone <repository-url>
cd GoPass

### 2. Backend Setup
cd backend
npm install

Create a .env file in the backend directory:

# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/gopass

# JWT
JWT_ACCESS_SECRET=your-access-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Email (optional for development)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password
MAIL_FROM=noreply@gopass.com

# Frontend URL
CLIENT_URL=http://localhost:3000

### 3. Frontend Setup
cd ../frontend
npm install

Create a .env.local file in the frontend directory:
NEXT_PUBLIC_API_URL=http://localhost:5000/api

## 🚀 Running the Application

### Option A: With MongoDB (Full Backend)

#### 1. Start MongoDB
macOS (Homebrew):
brew services start mongodb-community@7.0

Docker:
docker run -d -p 27017:27017 --name mongodb mongo:latest

#### 2. Seed the Database
This creates sample data including:
- 1 Admin, 2 Teachers, 3 Students
- 4 Classes
- Sample Questions and Exams

cd backend
npm run seed

#### 3. Start Backend Server
cd backend
npm run dev

Backend will run at: http://localhost:5000

#### 4. Start Frontend Server
cd frontend
npm run dev

Frontend will run at: http://localhost:3000

#### 5. Login
Use these test accounts (password: 123456):

Role | Email
Admin | admin@gopass.com
Teacher | teacher1@gopass.com
Teacher | teacher2@gopass.com
Student | student1@gopass.com
Student | student2@gopass.com

### Option B: With JSON Server (No MongoDB Required)

Note: Since the MongoDB database is private, you can test the application using JSON Server as a mock backend. This is ideal for frontend development and testing.

#### 1. Start JSON Server
cd frontend/mock
npm install -g json-server
json-server --watch db.json --port 5000

JSON Server will run at: http://localhost:5000

#### 2. Update Frontend API URL
Edit frontend/.env.local:
NEXT_PUBLIC_API_URL=http://localhost:5000

#### 3. Start Frontend Server
cd frontend
npm run dev

Frontend will run at: http://localhost:3000

#### 4. Important
For JSON Server you cannot perform login and register. You need to change the URL manually to test each page.

#### 5. Access the Application
Navigate to:
http://localhost:3000/dashboard

Authentication will be bypassed.

To test different roles, change the fallback role in:
frontend/src/features/dashboard/context/DashboardContext.tsx

Line 37:
const userRole = (user?.role as UserRole) || "student";

role: "student" – Student Dashboard
role: "teacher" – Teacher Dashboard
role: "admin" – Admin Dashboard

## 📁 Project Structure
(See repository for details)

## 👤 Test Accounts
When using MongoDB backend (after npm run seed):

Role | Email | Password
Admin | admin@gopass.com | 123456
Teacher | teacher1@gopass.com | 123456
Teacher | teacher2@gopass.com | 123456
Student | student1@gopass.com | 123456
Student | student2@gopass.com | 123456
Student | student3@gopass.com | 123456

## 🔍 API Endpoints

### Authentication
POST /api/auth/register – Register new account
POST /api/auth/login – Login
POST /api/auth/logout – Logout

### Classes
GET /api/classes – Get all classes
POST /api/classes – Create class (Teacher)
GET /api/classes/:classId – Get class details
POST /api/classes/join-by-code – Join class (Student)

### Exams
GET /api/exams/:examId – Get exam details
POST /api/exams – Create exam (Teacher)
POST /api/exams/:examId/assign-to-class – Assign exam

### Submissions
POST /api/submissions/assignments/:assignmentId/start – Start exam
POST /api/submissions/:submissionId/submit – Submit exam

See API_ENDPOINTS.md for complete API documentation.

## 🐛 Troubleshooting
- Port already in use
- MongoDB connection error
- Frontend build errors
- JSON Server not found
- CORS errors

Ensure correct ports:
Backend: http://localhost:5000
Frontend: http://localhost:3000

## 📚 Additional Documentation
- Frontend Structure Guide
- Backend API Documentation
- Database Schema
- Exam System Guide
- Dashboard Developer Guide

## 🤝 Contributing
Fork the repository
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request

## 📄 License
This project is licensed under the MIT License.

Last Updated: December 2025
Built with: Next.js 15, Express, MongoDB, TypeScript, Tailwind CSS
