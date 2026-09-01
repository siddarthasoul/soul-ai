# SOUL AI — Frontend

The SOUL AI frontend is a Next.js application that provides the user interface for authentication, AI conversations, feedback, navigation, and the overall SOUL experience.

The frontend communicates with the SOUL backend through HTTP APIs and Socket.IO for real-time AI chat.

---

## Tech Stack

* Next.js
* React
* TypeScript
* Tailwind CSS
* Socket.IO Client
* Axios
* Redux/state stores

---

# Frontend Structure

```text
frontend/
│
├── docker/
│   └── Dockerfile
│
├── src/
│   ├── app/
│   ├── components/
│   ├── config/
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   ├── stores/
│   └── types/
│
├── next.config.ts
├── package.json
├── package-lock.json
├── tsconfig.json
└── eslint.config.mjs
```

---

# Application Structure

```text
src/
│
├── app/
├── components/
├── config/
├── hooks/
├── lib/
├── services/
├── stores/
└── types/
```

The frontend follows a separation between:

```text
UI
Components
Hooks
API Clients
Services
State
Types
Configuration
```

---

# Pages

The application currently contains pages for:

```text
/
├── Landing Page
│
├── /chat/[conversationId]
│   └── AI Chat
│
├── /feedback
│   └── Feedback
│
├── /login
│   └── Login
│
├── /login/verify
│   └── Login OTP Verification
│
├── /register
│   └── Registration
│
└── /verify
    └── Email Verification
```

---

# Components

Components are organized by application area.

```text
components/
│
├── auth/
├── chat/
├── feedback/
├── landing/
└── ui/
```

---

## Authentication Components

```text
components/auth/
```

Includes:

* AuthBubble
* AuthCard
* AuthHeader
* AuthShell
* LoginForm
* LoginVerifyForm
* OtpInput
* RegisterForm
* VerifyForm

These components provide the registration, login, and verification experience.

---

# Chat Components

```text
components/chat/
```

Includes:

* ChatComposer
* ChatHistory
* ChatMessages
* ChatMessage
* ChatPage
* ChatStatus
* MessageContent
* SoulCore
* StreamingMessage

The chat interface supports real-time communication and streaming AI responses.

---

# Feedback Components

```text
components/feedback/
```

Includes:

* FeedbackCategory
* FeedbackForm
* FeedbackPage
* FeedbackProblems
* FeedbackRating
* FeedbackSuccess

The feedback system allows users to provide ratings, problems, comments, and feature suggestions.

---

# Landing Components

```text
components/landing/
```

Includes:

* Hero
* LandingPage
* Navbar
* SoulActionBubble
* SoulBackground

These components build the main SOUL landing experience.

---

# UI Components

```text
components/ui/
```

Reusable UI components include:

* Button
* Logo
* PageTransition
* SoulBubble

The purpose of this layer is to keep common visual elements reusable throughout the application.

---

# Hooks

Custom React hooks are located at:

```text
src/hooks/
```

Current hooks include:

```text
useAuth
useChat
useChatSocket
useFeedback
useUser
```

Hooks contain reusable client-side application logic.

---

# API Layer

Frontend API clients are located at:

```text
src/lib/api/
```

Current API modules include:

```text
auth.api.ts
chat.api.ts
feedbcak.api.ts
user.api.ts
client.ts
```

These modules communicate with the backend HTTP API.

---

# Services

Application-level services are located at:

```text
src/services/
```

Current services include:

```text
auth.service.ts
chat.service.ts
feedback.service.ts
user.service.ts
```

Services provide a layer between UI/hooks and the lower-level API clients.

---

# State Management

Application state is stored under:

```text
src/stores/
```

Current stores include:

```text
app.store.ts
auth.store.ts
chat.store.ts
feedback.store.ts
user.store.ts
```

This keeps application state separate from individual UI components.

---

# Socket.IO

Real-time AI chat communication uses Socket.IO.

```text
Frontend
   │
   ▼
Socket.IO Client
   │
   ▼
Backend Socket.IO
   │
   ▼
Chat Service
   │
   ▼
LLM
```

The frontend handles:

* Socket connection
* Authentication
* Conversation joining
* AI events
* Streaming responses
* Connection state
* Chat errors

---

# Chat Flow

```text
User
 │
 ▼
ChatComposer
 │
 ▼
Chat Service
 │
 ▼
Socket.IO
 │
 ▼
Backend
 │
 ▼
LLM
 │
 ▼
Streaming AI Response
 │
 ▼
StreamingMessage
 │
 ▼
Chat UI
```

---

# Authentication Flow

```text
Register
   │
   ▼
Registration Form
   │
   ▼
Backend API
   │
   ▼
OTP
   │
   ▼
Verification Page
   │
   ▼
Authenticated Session
   │
   ▼
SOUL Application
```

The frontend communicates with the backend using the configured API client and authentication cookies.

---

# Feedback Flow

```text
User
 │
 ▼
Feedback Page
 │
 ▼
Feedback Form
 │
 ├── Category
 ├── Ratings
 ├── Problems
 ├── Comment
 └── Feature Suggestion
 │
 ▼
Feedback Service
 │
 ▼
Backend API
 │
 ▼
Success
```

The frontend also handles feedback rate-limit responses and displays the remaining retry time.

---

# Configuration

Frontend configuration is located under:

```text
src/config/
```

Current configuration files include:

```text
api.config.ts
env.ts
socket.config.ts
```

These files define frontend API and Socket.IO configuration.

---

# Environment Variables

Frontend environment variables should be configured according to the current application configuration.

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:8000
```

For production:

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain/api/v1
NEXT_PUBLIC_SOCKET_URL=https://your-backend-domain
```

Use the actual deployed backend URL when deploying.

**Never place private secrets in `NEXT_PUBLIC_*` variables.**

---

# Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:3000
```

---

# Production Build

Build the application:

```bash
npm run build
```

Start the production application:

```bash
npm start
```

---

# Docker

The frontend includes a production Dockerfile.

Build the image:

```bash
docker build -f docker/Dockerfile .
```

Run through the root Compose configuration:

```bash
docker compose up --build
```

Run in detached mode:

```bash
docker compose up -d
```

Check containers:

```bash
docker compose ps
```

View frontend logs:

```bash
docker compose logs -f frontend
```

Stop:

```bash
docker compose down
```

---

# Production Architecture

The frontend can be deployed independently from the backend.

```text
                         GitHub
                           │
                           ▼
                    Frontend Service
                         Render
                           │
                           ▼
                      Next.js App
                           │
                           │ HTTP
                           │ Socket.IO
                           ▼
                    Backend Service
                         Render
                           │
                    ┌──────┴──────┐
                    ▼             ▼
                 MongoDB        Redis
                    │
                    ▼
                   LLM
```

---

# Backend Communication

The frontend expects the backend to provide:

```text
HTTP API
Socket.IO
Authentication
Chat
Feedback
User APIs
```

The API base URL should be configured through environment variables rather than hard-coded in components.

---

# Styling

The project uses Tailwind CSS for styling.

The UI is organized around reusable components and shared visual patterns.

Major visual areas include:

* Dark application interface
* SOUL branding
* Authentication cards
* AI chat interface
* Streaming messages
* Feedback forms
* Page transitions
* Soul Bubble components

---

# Error Handling

The frontend handles errors from:

* API requests
* Authentication
* OTP verification
* Chat connection
* Socket events
* AI responses
* Rate limits
* Feedback submission

User-facing errors are displayed through the relevant UI components instead of exposing internal application details.

---

# Rate Limiting

The frontend respects rate-limit responses from the backend.

For feedback and chat operations, the UI can:

* Disable submission when limited
* Display the retry time
* Prevent repeated requests
* Restore interaction after the limit expires

The actual rate-limit enforcement is performed by the backend.

---

# Project Principles

The frontend follows a layered structure:

```text
Page
 │
 ▼
Component
 │
 ▼
Hook
 │
 ▼
Service
 │
 ▼
API / Socket
 │
 ▼
Backend
```

This keeps UI code separate from networking and business logic.

The goal is to make the frontend:

* Reusable
* Modular
* Maintainable
* Type-safe
* Easy to extend
* Independent from backend implementation details

---

# Current Frontend Status

Implemented:

* Next.js application
* TypeScript
* Responsive UI
* Landing page
* Authentication UI
* Registration
* Login
* OTP verification
* Chat interface
* Real-time Socket.IO communication
* Streaming AI responses
* Chat state management
* User state management
* Feedback system
* Feedback ratings
* Feedback problems
* Feature suggestions
* Rate-limit UI
* Reusable UI components
* Page transitions
* Docker production build

---

# Deployment

The frontend is designed to be deployed separately from the backend while both remain inside the same Git repository.

Example:

```text
GitHub Repository
       │
       ├── frontend/
       │       │
       │       ▼
       │    Render
       │
       └── backend/
               │
               ▼
            Render
```

The frontend receives the deployed backend URL through environment variables.

---

# Security Notes

Do not commit:

```text
.env
.env.local
.env.production
```

Do not expose:

* API secrets
* JWT secrets
* Database credentials
* SMTP credentials
* Redis credentials
* Private API keys

Only public frontend configuration should use `NEXT_PUBLIC_*`.

---

# Development Status

SOUL AI frontend is currently under active development.

The architecture is intentionally separated into pages, reusable components, hooks, services, API clients, stores, and types so new features can be added without tightly coupling the application.
