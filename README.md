
---

# 💻 **Backend (Node.js + Express + Socket.IO) – README.md**

```md
# Twalky Meet (Backend)

This backend provides the **signaling server** for the Twalky Meet application, enabling WebRTC peer connections between users.  
It handles **session creation**, **participant management**, and **real-time signaling** using **Socket.IO**.

---

## 🚀 Features

Real-time WebSocket signaling via Socket.IO  
Session creation & validation endpoints  
P2P offer/answer exchange  
ICE candidate forwarding  
Handles join/leave events gracefully  
MongoDB storage for active sessions  
CORS & JSON middleware enabled  
Graceful shutdown handling  

---

## 🧩 Tech Stack

- Node.js + Express
- Socket.IO
- MongoDB + Mongoose
- dotenv
---

## ⚙️ Installation

1. Clone this repository
   ```bash
   git clone https://github.com/your-username/twalky-meet-backend.git
   cd twalky-meet-backend

