# SOUL AI — Backend

The SOUL AI backend is a TypeScript/Node.js API server that handles authentication, users, conversations, messages, feedback, real-time communication, rate limiting, database access, Redis services, and communication with the configured LLM.

---

## Tech Stack

* Node.js
* TypeScript
* Express
* MongoDB
* Mongoose
* Redis
* Socket.IO
* Nginx
* Ollama
* Docker

---

## Backend Structure

```text
backend/
│
├── docker/
│   ├── Dockerfile
│   └── nginx/
│       └── nginx.conf
│
├── packages/
│   └── common/
│       ├── config/
│       ├── middlewares/
│       ├── prompts/
│       ├── redis/
│       ├── server/
│       ├── socket/
│       ├── tests/
│       ├── types/
│       └── utils/
│
├── services/
│   ├── chat-service/
│   ├── feedback-service/
│   └── user-service/
│
├── logs/
├── server.ts
├── package.json
├── package-lock.json
├── tsconfig.json
└── docker-compose.yml
```

---

# Architecture

```text
                         ┌─────────────────┐
                         │     Frontend    │
                         │    Next.js      │
                         └────────┬────────┘
                                  │
                           HTTP / Socket.IO
                                  │
                                  ▼
                         ┌─────────────────┐
                         │      Nginx      │
                         │ Reverse Proxy   │
                         └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │   Node / API    │
                         │    Backend      │
                         └───────┬─┬─┬─────┘
                                 │ │ │
                  ┌──────────────┘ │ └──────────────┐
                  ▼                ▼                ▼
              MongoDB           Redis             LLM
                                                    │
                                                    ▼
                                                  Ollama
```

---

# Services

## User Service

Located at:

```text
services/user-service/
```

Responsible for:

* User creation
* Authentication
* Login
* Email verification
* OTP generation
* OTP verification
* Session management
* Current-user information

Main areas:

```text
controllers/
models/
repositories/
routes/
services/
types/
utils/
validation/
```

---

## Chat Service

Located at:

```text
services/chat-service/
```

Responsible for:

* Conversations
* Messages
* Chat sessions
* AI responses
* Chat memory
* Chat rate limiting
* LLM communication
* Socket.IO communication

Main areas:

```text
controllers/
models/
repositories/
routes/
services/
types/
validation/
```

Important services include:

```text
chat.service.ts
chat-memory.service.ts
chat-rate-limit.service.ts
llm.service.ts
```

---

## Feedback Service

Located at:

```text
services/feedback-service/
```

Responsible for:

* User feedback
* Ratings
* Problems
* Comments
* Feature suggestions
* Feedback validation
* Feedback protection/rate limiting

Main areas:

```text
controllers/
models/
repositories/
routes/
services/
types/
validation/
```

---

# Common Package

Shared backend infrastructure is located under:

```text
packages/common/
```

It contains functionality shared by the backend services.

## Configuration

```text
packages/common/config/
```

Handles:

* Environment configuration
* MongoDB
* Redis
* Email configuration
* Application connections

---

## Middleware

```text
packages/common/middlewares/
```

Includes:

* Authentication
* Identity
* Rate limiting
* Validation
* Error handling

---

## Redis

```text
packages/common/redis/
```

Redis functionality includes:

* Sessions
* OTP storage
* OTP protection
* Rate limiting
* Chat quotas
* Feedback protection
* User caching

---

## Socket.IO

```text
packages/common/socket/
```

Provides shared Socket.IO functionality and authentication middleware.

The backend supports real-time communication for the chat system.

---

## Utilities

```text
packages/common/utils/
```

Includes:

* API errors
* API responses
* Async handlers
* Guest identity
* Logging

---

# Authentication

The authentication flow uses email OTP verification.

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
Send Email
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

Sessions are stored using Redis and maintained through secure HTTP cookies.

---

# Chat Flow

```text
Client
  │
  ▼
Socket.IO
  │
  ▼
Chat Service
  │
  ├── Identity
  │
  ├── Rate Limit
  │
  ├── Memory
  │
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
       Client
```

---

# LLM

The backend communicates with an LLM through Ollama.

Example configuration:

```env
OLLAMA_HOST=http://localhost:11434
LLM_MODEL=qwen3:1.7b
LLM_TIMEOUT=50000
```

For remote testing, the Ollama server can be exposed through a Cloudflare Tunnel:

```env
OLLAMA_HOST=https://your-cloudflare-tunnel-url
LLM_MODEL=qwen3:1.7b
LLM_TIMEOUT=50000
```

The backend does not require the LLM to run inside the backend container.

---

# Database

MongoDB is used as the primary persistent database.

The backend uses MongoDB for data such as:

* Users
* Conversations
* Messages
* Feedback

MongoDB configuration is provided through environment variables.

---

# Redis

Redis provides temporary and high-speed application storage.

Current uses include:

```text
Sessions
OTP
Rate Limits
Chat Quotas
Feedback Protection
User Cache
```

---

# API

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

A healthy response checks:

```text
Node
MongoDB
Redis
LLM
```

Example:

```json
{
  "status": "ok",
  "node": {
    "status": "up"
  },
  "mongodb": {
    "status": "up"
  },
  "redis": {
    "status": "up"
  },
  "llm": {
    "status": "up"
  }
}
```

---

# Socket.IO

Real-time chat communication uses Socket.IO.

Nginx is configured to forward WebSocket traffic through:

```text
/socket.io/
```

The proxy configuration supports:

```text
Upgrade
Connection
Host
X-Real-IP
X-Forwarded-For
X-Forwarded-Proto
```

---

# Rate Limiting

The backend includes rate limiting and protection mechanisms for different application operations.

These include:

* API rate limiting
* Chat limits
* OTP request protection
* OTP attempt protection
* Feedback submission protection
* User quotas

Redis is used to maintain these limits.

---

# Docker

The backend can run inside Docker.

Build:

```bash
docker build -f docker/Dockerfile .
```

Run the backend through the project Compose configuration:

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

View logs:

```bash
docker compose logs -f backend
```

Stop:

```bash
docker compose down
```

---

# Nginx

Nginx acts as the reverse proxy in the Docker setup.

```text
Client
   │
   ▼
Nginx :80
   │
   ▼
Backend :8000
```

It also handles Socket.IO/WebSocket proxying.

---

# Environment Variables

Create a local `.env` file for development.

Example:

```env
NODE_ENV=development

PORT=8000

MONGODB_URI=...

REDIS_URL=...

OLLAMA_HOST=...

LLM_MODEL=qwen3:1.7b

LLM_TIMEOUT=50000

JWT_SECRET=...

SMTP_HOST=...
SMTP_PORT=...
SMTP_USER=...
SMTP_PASSWORD=...
```

The exact environment variables depend on the current backend configuration.

**Never commit `.env` files or secrets to GitHub.**

---

# Local Development

Install dependencies:

```bash
npm install
```

Build the backend:

```bash
npm run build
```

Start production build:

```bash
npm start
```

For development, use the development script configured in `package.json`.

---

# Health Check

After starting the backend:

```bash
curl http://localhost:8000/health
```

If Nginx is running:

```bash
curl http://localhost/health
```

The expected healthy state is:

```text
status: ok
node: up
mongodb: up
redis: up
llm: up
```

---

# Production Deployment

The backend is designed to be deployed independently from the frontend.

Example architecture:

```text
GitHub
   │
   ▼
Render Web Service
   │
   ▼
SOUL Backend
   │
   ├── MongoDB Atlas
   ├── Redis
   └── Ollama
```

The LLM can be hosted separately from the backend.

For local development/testing, Ollama can run on a local machine and be exposed securely through a tunnel.

---

# Current Backend Status

Implemented:

* TypeScript backend
* Modular services
* User service
* Authentication
* Email OTP
* Sessions
* MongoDB
* Redis
* Chat service
* Chat memory
* Chat rate limiting
* Socket.IO
* Streaming AI responses
* LLM integration
* Feedback service
* Feedback ratings
* Feedback protection
* API validation
* Error handling
* Logging
* Health checks
* Docker
* Nginx reverse proxy

---

# Development Philosophy

The backend is structured around separated services and shared infrastructure.

The goal is to keep:

* Business logic modular
* Services independent
* Shared infrastructure reusable
* AI communication isolated
* Authentication separated from chat
* Feedback separated from chat
* Infrastructure deployable independently

This structure allows SOUL to evolve into a larger AI platform without keeping all backend functionality inside a single large service.
