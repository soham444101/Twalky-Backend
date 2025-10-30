# 🛰️ Twalky : Meet App (Backend)

This backend powers the **Twalky Meet** application — a real-time video meeting system built with **WebRTC** and **Socket.IO**.  
It manages **session creation**, **user participation**, and **peer-to-peer signaling** between connected users.

## 🚀 Features

-  Real-time WebSocket signaling using **Socket.IO**
-  Peer-to-peer WebRTC offer/answer handling
-  ICE candidate forwarding between peers
-  Session creation, validation & participant management
-  MongoDB storage for sessions
-  Express with CORS & JSON middleware
-  Graceful shutdown handling

## 🧩 Tech Stack

| Component | Technology |
|------------|-------------|
| **Backend Framework** | Node.js + Express |
| **Real-time Engine** | Socket.IO |
| **Database** | MongoDB + Mongoose |
| **Environment Variables** | dotenv |
| **API Format** | REST + WebSockets |

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/twalky-meet-backend.git
cd twalky-meet-backend
````

---

### 2️⃣ Create `.env` file

Create a `.env` file in the root directory with the following values:

```env
MONGO_URL="your_mongodb_connection_string"
PORT=5000
```

> 💡 Replace `"your_mongodb_connection_string"` with your MongoDB URI (from MongoDB Atlas or local setup).

---

### 3️⃣ Install dependencies

```bash
npm install
```

---

### 4️⃣ Run the development server

```bash
npm run dev
```

> Server will run on `http://localhost:5000`
> WebSocket will be active on the same URL.



## 🌐 API Endpoints

| Method   | Endpoint                   | Description                          |
| -------- | -------------------------- | ------------------------------------ |
| **GET**  | `/create-session`          | Create a new meeting session         |
| **GET**  | `/is-alive?sessionId=xxxx` | Check if a session exists            |

## 🔌 WebSocket Events

| Event                | Direction                  | Description                             |
| -------------------- | -------------------------- | --------------------------------------- |
| `prepare-session`    | Client → Server            | User is in Prepareing meet              |
| `session-info`       | Server → All               | Infromation about participant in room   |
| `join-session`       | Client → Server            | Join an existing session                |
| `send-offer`         | Client → Server → Receiver | Send WebRTC offer                       |
| `send-answer`        | Client → Server → Receiver | Send WebRTC answer                      |
| `send-ice-candidate` | Client → Server → Receiver | Send ICE candidates                     |
| `new-participant`    | Server → All               | Notify participants of a new user       |
| `participant-left`   | Server → All               | Notify participants when someone leaves |
| `hang-up`            | Client → Server            | Leave call gracefully                   |
| `disconnect`         | Client → Server            | Leave call gracefully                   |

---

## 🧠 Folder Structure

```
twalky-meet-backend/
│
├── controllers/
│   └── socket.js              # WebRTC signaling logic
│
├── models/
│   └── session.model.js       # MongoDB session schema
│
├── database/
│   └── index.database.js      # Database connection logic
│
├── .env                       # Environment variables
├── app.js       # Main entry point
└── package.json
```

---

## 🧪 Example Socket Flow

1. User A joins → `join-session`
2. User B joins → `new-participant` event sent to A
3. A creates offer → sends via `send-offer`
4. B receives offer → creates answer → sends `send-answer`
5. Both exchange ICE candidates via `send-ice-candidate`
6. Connection established 

---

## 🧰 Useful Commands

| Command        | Description                      |
| -------------- | -------------------------------- |
| `npm install`  | Install all dependencies         |
| `npm run dev`  | Start server in development mode |
| `npm start`    | Start server in production mode  |

---

## 🧑‍💻 Developer Notes

* Ensure **MongoDB** is running and accessible before starting the backend.
* WebRTC communication requires the frontend to exchange SDP (offer/answer) correctly.
* Keep the **Socket.IO version** consistent across frontend and backend.
---

## 📬 Contact

**👩‍💻 Author:** Soham Aswar
**📧 Email:** [sohamaswar@gmail.com](mailto:sohamaswar@gmail.com)
**🔗 LinkedIn:** [linkedin.com/in/sohamaswar](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwiu_OOsjcyQAxX0YfUHHVMJO7AQFnoECBsQAQ&url=https%3A%2F%2Fin.linkedin.com%2Fin%2Fsoham-aswar-18376b22a%3Ftrk%3Dpublic_profile_browsemap&usg=AOvVaw0ivsKXXKueS298YG0EHdQv&opi=89978449)


⭐ **If you found this project useful, give it a star on GitHub!**

