# SOUL AI

SOUL AI is an AI-powered conversational platform built as a full-stack application. It provides real-time AI chat, authentication, feedback collection, rate limiting, session management, and an AI inference layer.

The project is currently structured as a monorepo containing an independent Next.js frontend and a TypeScript/Node.js backend.

---

## Project Structure

```text
soul-ai-data-platform/
│
├── backend/
│   ├── docker/
│   │   ├── Dockerfile
│   │   └── nginx/
│   │       └── nginx.conf
│   │
│   ├── packages/
│   │   └── common/
│   │       ├── config/
│   │       ├── middlewares/
│   │       ├── prompts/
│   │       ├── redis/
│   │       ├── server/
│   │       ├── socket/
│   │       ├── tests/
│   │       ├── types/
│   │       └── utils/
│   │
│   ├── services/
│   │   ├── chat-service/
│   │   ├── feedback-service/
│   │   └── user-service/
│   │
│   ├── server.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── docker-compose.yml
│
├── frontend/
│   ├── docker/
│   │   └── Dockerfile
│   │
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── config/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── services/
│   │   ├── stores/
│   │   └── types/
│   │
│   ├── package.json
│   └── tsconfig.json
│
├── docker-compose.yml
└── README.md
```

---

## Architecture

```text
                         ┌──────────────────┐
                         │      Browser     │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │  Next.js Client  │
                         │    Frontend      │
                         └────────┬─────────┘
                                  │
                         HTTP / Socket.IO
                                  │
                                  ▼
                         ┌──────────────────┐
                         │      Nginx       │
                         │ Reverse Proxy    │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │   Node.js API    │
                         │    Backend       │
                         └──────┬─┬─┬───────┘
                                │ │ │
                    ┌───────────┘ │ └──────────────┐
                    ▼             ▼                ▼
               MongoDB          Redis           Ollama
                                                  │
                                                  ▼
                                             AI Model
```

---

## Frontend

The frontend is built with:

* Next.js
* React
* TypeScript
* Tailwind CSS
* Redux-based state management
* Socket.IO client

The frontend contains:

```text
src/
├── app/
│   ├── chat/
│   ├── feedback/
│   ├── login/
│   ├── register/
│   └── verify/
│
├── components/
│   ├── auth/
│   ├── chat/
│   ├── feedback/
│   ├── landing/
│   └── ui/
│
├── hooks/
├── lib/
├── services/
├── stores/
└── types/
```

### Main frontend areas

**Authentication**

Handles registration, login, OTP verification, and user authentication state.

**Chat**

Provides the real-time AI conversation interface, message rendering, streaming responses, chat state, and Socket.IO communication.

**Feedback**

Allows users to rate their AI and application experience and submit problems, comments, and feature suggestions.

**UI**

Contains reusable components such as buttons, page transitions, Soul Bubble components, and authentication layouts.

---

## Backend

The backend is a TypeScript/Node.js application.

The backend contains shared infrastructure under `packages/common` and separates major application functionality into services.

```text
services/
├── chat-service/
├── feedback-service/
└── user-service/
```

### Chat Service

Responsible for:

* Conversations
* Messages
* AI responses
* Chat rate limits
* Chat memory
* LLM communication
* Chat Socket.IO events

### User Service

Responsible for:

* User creation
* Authentication
* Sessions
* Email verification
* OTP generation and verification
* User information

### Feedback Service

Responsible for:

* Feedback submission
* Feedback validation
* Feedback ratings
* Feedback problems
* Feature suggestions
* Feedback rate limiting

---

## Shared Backend Infrastructure

The `packages/common` directory contains functionality shared across backend services.

```text
packages/common/
├── config/
├── middlewares/
├── prompts/
├── redis/
├── server/
├── socket/
├── types/
└── utils/
```

Important shared components include:

* Environment configuration
* MongoDB connection
* Redis connection
* Authentication middleware
* Identity middleware
* Rate limiting
* Validation
* Redis protection services
* Socket.IO initialization
* API errors and responses
* Async request handling
* Logging
* Health checks
* Graceful shutdown

---

## Authentication Flow

The current authentication flow uses email verification.

```text
Register
   │
   ▼
Create User
   │
   ▼
Generate OTP
   │
   ▼
Send Verification Email
   │
   ▼
Verify OTP
   │
   ▼
Create Session
   │
   ▼
Authenticated User
```

Sessions are maintained using secure HTTP cookies.

---

## Chat Flow

```text
User
 │
 ▼
Frontend Chat UI
 │
 ▼
Socket.IO
 │
 ▼
Backend Chat Service
 │
 ├── Identity
 ├── Rate Limit
 ├── Memory
 └── LLM Service
        │
        ▼
      Ollama
        │
        ▼
     AI Model
        │
        ▼
 Streaming Response
        │
        ▼
Frontend
```

The application supports streaming AI responses through the real-time communication layer.

---

## AI / LLM Layer

SOUL currently uses Ollama as the local inference server.

Example configuration:

```env
OLLAMA_HOST=http://localhost:11434
LLM_MODEL=qwen3:1.7b
LLM_TIMEOUT=50000
```

For remote backend testing, Ollama can also be exposed through a Cloudflare Tunnel:

```env
OLLAMA_HOST=https://your-tunnel-url
LLM_MODEL=qwen3:1.7b
LLM_TIMEOUT=50000
```

The exact model and host are controlled through environment variables.

---

## Database

SOUL uses MongoDB for persistent application data.

The backend stores application data such as:

* Users
* Conversations
* Messages
* Feedback

MongoDB connection details are configured through environment variables.

---

## Redis

Redis is used for temporary and protection-related data.

Current uses include:

* Sessions
* OTP storage
* OTP protection
* Rate limiting
* Chat quotas
* Feedback protection
* User caching

---

## API

The backend API is versioned under:

```text
/api/v1
```

The application also provides a health endpoint:

```text
GET /health
```

Example:

```bash
curl http://localhost/health
```

A healthy application reports the status of:

* Node.js
* MongoDB
* Redis
* LLM

---

## Socket.IO

Real-time chat communication uses Socket.IO.

The reverse proxy is configured to support WebSocket upgrades for:

```text
/socket.io/
```

Nginx forwards Socket.IO traffic to the backend service.

---

## Docker

The project supports Docker-based local deployment.

The root Compose configuration runs:

```text
soul-frontend
soul-backend
soul-nginx
```

The architecture is:

```text
Frontend :3000
     │
     ▼
Nginx :80
     │
     ▼
Backend :8000
```

The backend communicates with MongoDB, Redis, and the configured LLM host.

### Start the complete application

From the project root:

```bash
docker compose up --build
```

Run in detached mode:

```bash
docker compose up -d
```

Check services:

```bash
docker compose ps
```

View logs:

```bash
docker compose logs -f
```

Stop the application:

```bash
docker compose down
```

---

## Environment Variables

Environment files should **not** be committed to Git.

Example backend configuration:

```env
OLLAMA_HOST=...
LLM_MODEL=...
LLM_TIMEOUT=...

MONGODB_URI=...
REDIS_URL=...

JWT_SECRET=...

SMTP_HOST=...
SMTP_PORT=...
SMTP_USER=...
SMTP_PASSWORD=...
```

The actual environment variables required by the backend should be configured through the deployment platform or local `.env` file.

---

## Local Development

### Backend

```bash
cd backend
npm install
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The development frontend normally runs on:

```text
http://localhost:3000
```

The backend normally runs on:

```text
http://localhost:8000
```

---

## Production Deployment

The project is designed so the frontend and backend can be deployed independently while remaining in the same Git repository.

```text
GitHub Repository
        │
        ├──────────────┐
        ▼              ▼
   Backend Service   Frontend Service
      Render            Render
        │
        ▼
   MongoDB / Redis
        │
        ▼
      Ollama
```

The backend should be deployed as a dynamic web service.

The frontend should be deployed separately as a Next.js service.

---

## Current Development Status

### Completed

* Next.js frontend
* TypeScript backend
* Authentication flow
* Email OTP verification
* Session handling
* MongoDB integration
* Redis integration
* Chat service
* Real-time Socket.IO communication
* AI/LLM integration
* Streaming responses
* Chat rate limiting
* Feedback system
* Feedback ratings
* Feedback protection
* Health monitoring
* Dockerized frontend
* Dockerized backend
* Nginx reverse proxy
* Local full-stack Docker Compose setup

### Deployment

Current deployment work focuses on:

* Backend deployment
* Frontend deployment
* Stable public API endpoint
* Stable LLM connectivity
* Production configuration
* Security hardening

---

## Repository Philosophy

SOUL is being developed as a modular full-stack AI platform rather than a single tightly coupled application.

The goal is to keep:

* UI components reusable
* Frontend services separated from UI
* Backend services modular
* Shared infrastructure centralized
* AI communication isolated
* Authentication independent
* Feedback independent
* Infrastructure deployable independently

This structure is intended to make the system easier to maintain, test, scale, and evolve as SOUL develops.

---

## License

License information will be added when the project is ready for public release.
