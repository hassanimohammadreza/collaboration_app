# Realtime Collaboration Task Manager

A realtime, event-driven task management backend built with Django and WebSockets.

This project is designed as a foundation for a collaborative task management system
where multiple users can interact with shared tasks in real-time without page refresh.

---

## 🎯 Vision

The goal of this project is to build a scalable realtime collaboration engine
that can power:

- Shared task boards
- Live status updates
- Multi-user interaction
- Event-driven UI updates
- Future SaaS-ready architecture

This repository currently contains the core realtime infrastructure layer.

---

## 🧠 Core Architecture

The project is built around ASGI and WebSocket-based communication.

### Backend Stack

- Django (application core)
- Django Channels (ASGI & WebSocket support)
- Redis (channel layer backend)
- Uvicorn / Daphne (ASGI servers)

### Communication Flow

Client → WebSocket → Channels Consumer → Channel Layer → Broadcast → Clients

This architecture allows:

- Real-time updates across multiple browser tabs
- Scalable event broadcasting
- Async message handling
- Clean separation between HTTP and WebSocket protocols

---

## 🔌 Realtime Layer

The current implementation includes:

- ASGI configuration with `ProtocolTypeRouter`
- WebSocket routing
- Async consumer handling
- Group-based broadcasting
- Persistent message storage
- Static file integration under ASGI

This establishes a production-ready realtime foundation.

---

## 🏗 Current State

✅ WebSocket connection established (101 Switching Protocols)  
✅ Realtime message broadcasting  
✅ Redis-backed channel layer  
✅ Static file handling under ASGI  
✅ Modular project structure  

The system is now ready to evolve into a full task management engine.

---

## 🚀 Next Development Phases

Planned evolution:

- Task model design
- Event-based task operations (create / update / delete)
- Role-based access logic
- Multi-room / multi-board support
- Frontend state synchronization
- Production deployment architecture

---

## 📌 Project Philosophy

This project is being developed with:

- Clean architecture principles
- Scalable realtime patterns
- Git-based structured workflow
- Incremental feature development

It is not just a demo — it is intended to grow into a structured, scalable backend system.

---

## 🛠 Development Status

Active development.
Initial realtime core completed.

---

## 🚀 Tech Stack

- Django 6
- Django Channels 4
- Redis
- Uvicorn (ASGI)
- Daphne (optional ASGI server)