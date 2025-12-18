frontend/
├─ public/  
│ └─ # Static assets served directly (images, icons, fonts)
│
├─ src/
│ ├─ app/  
│ │ └─ # Next.js App Router: pages, layouts, routes, server components
│ │
│ ├─ components/  
│ │ └─ # Reusable UI components (buttons, inputs, layout components)
│ │
│ ├─ features/  
│ │ └─ # Domain-specific modules (UI + Context, not services/types)
│ │
│ ├─ lib/  
│ │ └─ # Core utilities (http client, configs, constants)
│ │
│ ├─ services/  
│ │ └─ # API service layer - organized by domain subfolder
│ │
│ ├─ store/  
│ │ └─ # Global state (optional, if needed beyond Context)
│ │
│ ├─ styles/  
│ └─ # Global styles, Tailwind config overrides, theme
│
│ ├─ types/  
│ └─ # Global TypeScript types - organized by domain subfolder
│
│ ├─ hooks/  
│ └─ # App-wide hooks (not feature-specific hooks)
│
│ └─ utils/  
│ └─ # Helper functions shared across project
│
├─ .env.local # Environment variables (API URL, secrets)
├─ next.config.js # Next.js configuration
├─ package.json # Project dependencies and scripts
├─ tsconfig.json # TypeScript configuration
└─ README.md # Project documentation

Detailed Explanation:
GOPASS/
└─ frontend/
├─ .next/ # build output (gitignored)
├─ node_modules/
├─ public/ # static assets (images, svgs, favicon)
│ ├─ favicon.ico
│ └─ images/
├─ src/
│ ├─ app/ # Next.js App Router (routes + layouts)
│ │ ├─ layout.tsx # root layout (providers + global UI)
│ │ ├─ head.tsx # <head> meta
│ │ ├─ page.tsx # app root page (dashboard or landing)
│ │ ├─ loading.tsx
│ │ ├─ error.tsx
│ │ ├─ (auth)/ # route group hidden from URL (auth layout)
│ │ │ ├─ layout.tsx
│ │ │ └─ login/page.tsx
│ │ ├─ dashboard/
│ │ │ └─ page.tsx
│ │ ├─ classes/
│ │ │ ├─ page.tsx
│ │ │ └─ [id]/page.tsx
│ │ ├─ exams/
│ │ │ ├─ page.tsx
│ │ │ └─ [id]/page.tsx
│ │ ├─ submissions/
│ │ │ ├─ page.tsx
│ │ │ └─ [id]/page.tsx
│ │ ├─ grading/
│ │ │ └─ [submissionId]/page.tsx
│ │ ├─ contest/
│ │ │ ├─ page.tsx
│ │ │ └─ [id]/page.tsx
│ │ └─ admin/
│ │ └─ page.tsx
│ │
│ ├─ components/ # UI primitives & layout pieces
│ │ ├─ ui/ # tiny, reusable primitives
│ │ │ ├─ Button.tsx
│ │ │ ├─ Input.tsx
│ │ │ ├─ Modal.tsx
│ │ │ ├─ Table.tsx
│ │ │ └─ Pagination.tsx
│ │ ├─ layout/ # header, footer, sidebar
│ │ │ ├─ Header.tsx
│ │ │ ├─ Sidebar.tsx
│ │ │ └─ AppShell.tsx
│ │ └─ feature/ # commonly shared larger components
│ │ ├─ ClassCard.tsx
│ │ └─ ExamCard.tsx
│ │
│ ├─ features/ # domain folders (colocate UI components + context)
│ │ ├─ auth/
│ │ │ ├─ components/ # LoginForm, RegisterForm, AuthLayout
│ │ │ ├─ context/ # AuthContext.tsx (provides useAuth hook)
│ │ │ ├─ hooks.ts # (optional) feature-specific hooks
│ │ │ └─ index.ts # barrel exports
│ │ ├─ dashboard/
│ │ │ ├─ components/ # dashboard UI components
│ │ │ ├─ context/ # DashboardContext.tsx
│ │ │ └─ types/ # dashboard-specific types
│ │ ├─ user/
│ │ ├─ class/
│ │ ├─ exam/
│ │ ├─ submission/
│ │ ├─ grading/
│ │ ├─ contest/
│ │ └─ questionbank/
│ │
│ ├─ lib/ # low-level shared helpers
│ │ ├─ api.ts # (future) central http client (axios/fetch wrapper)
│ │ ├─ http/ # (future) infra & error handling
│ │ │ ├─ httpClient.ts
│ │ │ ├─ apiConfig.ts
│ │ │ └─ errorHandler.ts
│ │ └─ jwt.ts # (future) token helpers (parse/refresh)
│ │
│ ├─ services/ # API service layer - organized by domain (subfolder approach)
│ │ ├─ auth/
│ │ │ ├─ authService.ts # Auth API calls (login/logout/register/me)
│ │ │ ├─ constants.ts # API endpoints & storage keys
│ │ │ └─ index.ts # barrel export
│ │ ├─ class/ # (future) Class-related API calls
│ │ │ ├─ classService.ts
│ │ │ └─ index.ts
│ │ ├─ exam/ # (future) Exam-related API calls
│ │ ├─ submission/
│ │ ├─ grading/
│ │ ├─ contest/
│ │ └─ questionbank/
│ │
│ ├─ store/ # (optional) global state (Zustand/Redux) - if needed beyond Context
│ │ └─ index.ts # Note: Auth uses Context, not store
│ │
│ ├─ hooks/ # app-wide custom hooks (not feature-specific)
│ │ ├─ useFetch.ts # (future) generic data fetching
│ │ └─ useDebounce.ts # (future) debounce utility
│ │ # Note: useAuth is in features/auth/context, not here
│ │
│ ├─ styles/ # global css / tailwind or css modules
│ │ ├─ globals.css
│ │ └─ tailwind.css
│ │
│ ├─ types/ # shared TypeScript types - organized by domain (subfolder approach)
│ │ ├─ auth/
│ │ │ └─ index.ts # User, LoginCredentials, RegisterData, AuthResponse
│ │ ├─ class/ # (future) Class, ClassMember types
│ │ ├─ exam/ # (future) Exam types
│ │ └─ api.ts # (future) generic API response types
│ │
│ ├─ constants/ # route names, roles, status codes, etc.
│ │ └─ routes.ts
│ │
│ ├─ utils/ # pure helper functions (formatters)
│ │ └─ date.ts
│ │
│ └─ tests/ # unit / integration tests
│ └─ **mocks**/
│
├─ .env.example
├─ .env.local # NEXT_PUBLIC_API_BASE_URL=...
├─ next.config.js
├─ tsconfig.json
├─ package.json
├─ README.md
└─ .eslintrc.js

---

## Architecture Design Decisions

### **1. Subfolder Organization for Services & Types**

```
✅ CURRENT APPROACH (Scalable):
services/
  ├─ auth/
  │   ├─ authService.ts
  │   ├─ constants.ts
  │   └─ index.ts
  └─ class/
      ├─ classService.ts
      └─ index.ts

❌ FLAT APPROACH (Gets messy):
services/
  ├─ auth.api.ts
  ├─ class.api.ts
  ├─ exam.api.ts
  └─ ...20 more files
```

**Why**: Subfolder approach scales better as the app grows. Each domain gets its own namespace.

### **2. Context Over Store for Authentication**

```
✅ CURRENT: features/auth/context/AuthContext.tsx
❌ ALTERNATIVE: store/authStore.ts (Zustand/Redux)
```

**Why**: React Context is sufficient for auth state. No need for external state management library. Simpler, fewer dependencies.

### **3. useAuth Hook Location**

```
✅ CURRENT: Exported from features/auth/context/AuthContext.tsx
❌ ALTERNATIVE: Separate file in src/hooks/useAuth.ts
```

**Why**: The hook is tightly coupled to AuthContext. Keeping them together is more maintainable.

### **4. Features = UI + Context (Not Services/Types)**

```
features/auth/
  ├─ components/      # UI components
  ├─ context/         # React Context providers
  └─ index.ts         # Barrel exports

Services & Types are in top-level folders for reusability across features.
```

### **5. Import Pattern Examples**

**✅ Recommended Imports:**

```typescript
// Types (shared, domain-organized)
import type { User, LoginCredentials } from "@/types/auth";

// Services (shared, domain-organized)
import { authService } from "@/services/auth";

// Features (UI + Context)
import { useAuth, LoginForm } from "@/features/auth";

// App-wide utilities
import { useFetch } from "@/hooks/useFetch";
import { formatDate } from "@/utils/date";
```

**❌ Avoid These Patterns:**

```typescript
// Don't import directly from nested paths
import { authService } from "@/services/auth/authService";

// Don't import from old flat structure
import { User } from "@/features/auth/types";
```

### **6. When to Use Each Folder**

| Folder        | Purpose                      | Example                                    |
| ------------- | ---------------------------- | ------------------------------------------ |
| `features/`   | Domain UI + Context          | LoginForm, useAuth, DashboardContext       |
| `services/`   | API calls to backend         | authService.login(), classService.getAll() |
| `types/`      | Shared TypeScript interfaces | User, Class, Exam                          |
| `components/` | Generic UI components        | Button, Modal, Table                       |
| `lib/`        | Low-level infrastructure     | httpClient, apiConfig                      |
| `hooks/`      | App-wide hooks               | useFetch, useDebounce                      |
| `store/`      | Global state (if needed)     | Zustand/Redux stores                       |
| `utils/`      | Pure helper functions        | formatDate, parseJSON                      |
