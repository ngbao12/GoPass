<div align="center">

# 🎓 GoPass

### Full-Stack Learning Management System

A modern, feature-rich Learning Management System designed for teachers and students to manage classes, assignments, and exams seamlessly.

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Demo](#-demo-accounts)

</div>

---

## ✨ Features

### 👨‍🏫 For Teachers
- 📚 **Class Management** - Create and manage multiple classes
- 📝 **Exam Builder** - Create exams with multiple question types (Multiple Choice, True/False, Essay)
- 📊 **Auto-Grading** - Automatic grading for objective questions
- 📈 **Analytics Dashboard** - Track student performance and engagement
- 👥 **Student Management** - View and manage class rosters

### 👨‍🎓 For Students
- 📖 **Class Enrollment** - Join classes using unique class codes
- ✍️ **Take Exams** - Complete assignments with time tracking
- 🎯 **Instant Feedback** - View grades and feedback immediately
- 📊 **Performance Tracking** - Monitor your progress over time
- 🔔 **Notifications** - Stay updated on new assignments

### 🔐 For Admins
- 👥 **User Management** - Manage teachers and students
- 📊 **System Analytics** - Overall platform statistics
- ⚙️ **Configuration** - System-wide settings and controls

## 🛠️ Tech Stack

**Frontend:**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- React Context API
- Axios

**Backend:**
- Node.js & Express
- MongoDB & Mongoose
- JWT Authentication
- Bcrypt for password hashing
- Nodemailer for emails

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **MongoDB** v5 or higher ([Download](https://www.mongodb.com/try/download/community))
- **npm** or **yarn** (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

## 🚀 Quick Start

### 1️⃣ Clone & Install

```bash
# Clone the repository
git clone <repository-url>
cd GoPass

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2️⃣ Environment Setup

**Backend** - Create `backend/.env`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/gopass

# JWT Secrets (Change these in production!)
JWT_ACCESS_SECRET=your-super-secret-access-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Email Configuration (Optional for development)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password
MAIL_FROM=noreply@gopass.com

# Frontend URL
CLIENT_URL=http://localhost:3000
```

**Frontend** - Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3️⃣ Database Setup

```bash
# Start MongoDB
brew services start mongodb-community@7.0  # macOS
# or
docker run -d -p 27017:27017 --name mongodb mongo:latest  # Docker

# Seed sample data
cd backend
npm run seed
```

### 4️⃣ Start Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev
# 🚀 Backend running at http://localhost:5000

# Terminal 2 - Frontend
cd frontend
npm run dev
# 🚀 Frontend running at http://localhost:3000
```

### 5️⃣ Access the Application

Open [http://localhost:3000](http://localhost:3000) and login with test accounts below.

## 🧪 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| 👨‍💼 Admin | admin@gopass.vn | 123456 |
| 👨‍🏫 Teacher | teacher1@gopass.vn | 123456 |
| 👨‍🏫 Teacher | teacher2@gopass.vn | 123456 |
| 👨‍🎓 Student | student1@gopass.vn | 123456 |
| 👨‍🎓 Student | student2@gopass.vn | 123456 |

## 🧰 Alternative: JSON Server (No MongoDB)

Perfect for frontend development without setting up MongoDB.

```bash
# Install JSON Server globally
npm install -g json-server

# Start mock backend
cd frontend/mock
json-server --watch db.json --port 5000

# Update frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:5000

# Start frontend
cd frontend
npm run dev
```

**Note:** Authentication is bypassed. Navigate directly to `/dashboard`. Change user role in `frontend/src/features/dashboard/context/DashboardContext.tsx` (line 37):

```typescript
const userRole = (user?.role as UserRole) || "student"; // Change to "teacher" or "admin"
```

## 📁 Project Structure

```
GoPass/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Custom middleware
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   └── utils/           # Helper functions
│   ├── .env                 # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js App Router
│   │   ├── components/      # Reusable components
│   │   ├── features/        # Feature modules
│   │   │   ├── auth/        # Authentication
│   │   │   ├── dashboard/   # Dashboard views
│   │   │   ├── classes/     # Class management
│   │   │   └── exams/       # Exam system
│   │   ├── lib/             # Utilities & API client
│   │   └── types/           # TypeScript types
│   ├── mock/                # JSON Server mock data
│   ├── .env.local           # Environment variables
│   └── package.json
│
└── README.md
```

## 🔌 API Endpoints

### Authentication
```http
POST   /api/auth/register      # Register new user
POST   /api/auth/login         # Login
POST   /api/auth/logout        # Logout
GET    /api/auth/me            # Get current user
```

### Classes
```http
GET    /api/classes            # Get all classes
POST   /api/classes            # Create class (Teacher)
GET    /api/classes/:id        # Get class details
PUT    /api/classes/:id        # Update class
DELETE /api/classes/:id        # Delete class
POST   /api/classes/join       # Join class by code (Student)
```

### Exams
```http
GET    /api/exams              # Get all exams
POST   /api/exams              # Create exam (Teacher)
GET    /api/exams/:id          # Get exam details
PUT    /api/exams/:id          # Update exam
DELETE /api/exams/:id          # Delete exam
POST   /api/exams/:id/assign   # Assign to class
```

### Submissions
```http
POST   /api/submissions/:assignmentId/start    # Start exam
POST   /api/submissions/:id/submit             # Submit exam
GET    /api/submissions/:id                    # Get submission
GET    /api/submissions/assignment/:id         # Get all submissions
```

📖 See [API_ENDPOINTS.md](./docs/API_ENDPOINTS.md) for complete documentation.

## 🐛 Troubleshooting

<details>
<summary><strong>Port 3000/5000 already in use</strong></summary>

```bash
# Find and kill process on port
lsof -ti:3000 | xargs kill -9
lsof -ti:5000 | xargs kill -9
```
</details>

<details>
<summary><strong>MongoDB connection failed</strong></summary>

- Ensure MongoDB is running: `brew services list` or `docker ps`
- Check MONGODB_URI in `.env`
- Verify MongoDB is listening on port 27017
</details>

<details>
<summary><strong>CORS errors</strong></summary>

- Verify CLIENT_URL in backend `.env` matches frontend URL
- Check NEXT_PUBLIC_API_URL in frontend `.env.local`
</details>

<details>
<summary><strong>Frontend build errors</strong></summary>

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```
</details>