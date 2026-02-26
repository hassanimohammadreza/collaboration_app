# Realtime Collaboration Task Manager

A realtime, event-driven task management system built with Django, WebSockets, and Redis.

This project is evolving into a scalable, SaaS-ready collaboration engine where multiple users can interact with tasks in real-time without page refresh.

It is not a demo — it is being structured as a production-grade foundation.

---

## 📸 Screenshots

### Light Theme
![Light Theme](assets/images/board-light.png)

### Dark Theme
![Dark Theme](assets/images/board-dark.png)

---

## 🎯 Vision

The goal is to build a scalable realtime collaboration platform capable of powering:

- Multi-user task boards
- Live state synchronization
- Event-driven UI updates
- Persistent Kanban workflows
- Future SaaS-ready architecture

The system is being developed incrementally with clean architecture principles.

---

## 🧠 Core Architecture

Built on ASGI and WebSocket-based communication.

### Backend Stack

- Django 6
- Django Channels 4
- Redis (channel layer backend)
- Uvicorn (ASGI server)
- Daphne (optional ASGI server)
- Docker (service orchestration)

---

### Communication Flow

Client  
→ WebSocket  
→ Channels Consumer  
→ Redis Channel Layer  
→ Group Broadcast  
→ Connected Clients  

This enables:

- Real-time multi-tab synchronization
- Async event processing
- Horizontal scalability readiness
- Separation of HTTP and WebSocket layers

---

## 🔌 Realtime Engine (Implemented)

- ASGI configuration with `ProtocolTypeRouter`
- WebSocket routing
- Async consumer handling
- Group-based broadcasting
- Redis-backed channel layer
- Static file handling under ASGI
- Dockerized Redis service

---

## 🎨 Frontend System (Implemented)

- Modular CSS architecture
- Light / Dark theme (persistent via localStorage)
- Drag & Drop task movement
- Clean DOM structure
- Scalable UI component styling
- Realtime UI synchronization

---

## 🏗 Current System State

- ✅ WebSocket connection (101 Switching Protocols)
- ✅ Realtime broadcasting
- ✅ Redis-backed channel layer
- ✅ Docker service integration
- ✅ Modular CSS architecture
- ✅ Light / Dark theme system
- ✅ Drag & Drop task movement
- ✅ Clean Git workflow

The system is now transitioning from infrastructure phase to product evolution phase.

---

# 🚀 Next Development Phases (Roadmap)

## Phase 1 — Multi-User Foundation

- Django authentication system
- Login / Logout flow
- User-based task ownership
- WebSocket authentication enforcement
- Group-per-user architecture
- Multi-user ready channel isolation

---

## Phase 2 — Realtime Resilience

- Auto WebSocket reconnect mechanism
- Connection state indicator (Connected / Reconnecting / Offline)
- Graceful handling of Redis / server restarts

---

## Phase 3 — UX System Upgrade

- Toast notification system
- Event-based feedback UI
- User action confirmations
- Visual system feedback layer

---

## Phase 4 — Kanban Persistence

- Order index per task
- Drag reorder persistence in database
- Realtime reorder sync
- Backend order normalization

---

## Phase 5 — UI Polish Layer

- FLIP animation for smooth reorder
- Micro-interactions
- Transition system optimization

---

## 📐 Architectural Direction

The system is being structured with:

- Event-driven design
- Separation of concerns
- Scalable channel grouping
- Modular frontend architecture
- Incremental feature layering
- Clean Git-based workflow

---

## 🛠 Development Status

Active development.

Realtime infrastructure completed.  
Transitioning into multi-user and product-layer expansion.

---

## 🔮 Long-Term Direction

Future possibilities:

- Team-based boards
- Role-based permissions
- Invite system
- Board-level isolation
- SaaS deployment architecture
- Horizontal scaling strategy