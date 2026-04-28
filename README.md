# 💬 Ripple — Real-Time Chat Application

> A modern, full-stack real-time chat application built with the MERN stack and Socket.io. Ripple lets you connect and chat with people instantly — with live typing indicators, online presence, and read receipts.

🔗 **Live Demo:** [ripple-chat-app-eight.vercel.app](https://ripple-chat-app-eight.vercel.app)  
📁 **Repository:** [github.com/Zoya-Sk/Ripple-chat-App](https://github.com/Zoya-Sk/Ripple-chat-App)

---

## ✨ Features

### 🔐 Authentication
- Secure user registration and login with **JWT-based authentication**
- Passwords hashed using **bcrypt**
- Token stored persistently so sessions survive page refreshes
- Auto-redirect to login on token expiry

### 💬 Real-Time Messaging
- Instant message delivery powered by **Socket.io**
- Messages persist across sessions and chat switches via **MongoDB**
- Auto-scroll to the latest message
- Send messages with `Enter` key or the send button

### 🟢 Online / Offline Presence
- Live green dot indicator on user avatars — updates in real time
- "Online" / "Offline" status shown under each user's name in the sidebar
- Status updates instantly when users connect or disconnect

### ✍️ Typing Indicators
- **In-chat**: Animated bouncing dots appear when the other person is typing
- **In-sidebar**: "typing..." with animated dots visible next to a user's name — even without opening their chat
- Typing events are debounced to avoid unnecessary socket traffic

### ✅ Read Receipts
- **Purple double tick (✓✓)** — message delivered
- **Green double tick (✓✓)** — message read by the receiver
- Receipt updates in real time via Socket.io

### 🔔 Unread Message Badges
- Notification badge with unread count appears on each user in the sidebar
- Badge resets automatically when you open that conversation
- Supports counts up to 99+

### 🔍 User Search
- Search bar in the sidebar to filter users by name in real time
- No extra API calls — filters from the already-fetched list

### 📱 Fully Responsive Design
- **Mobile**: Sidebar and chat are shown separately — tap a user to open chat, use the back button to return to the list
- **Desktop**: Classic split-panel layout — sidebar on the left, chat on the right
- Smooth transitions between views

### 🎨 Appealing UI Theme
- Soft purple-to-pink gradient palette throughout
- Glassmorphism-style cards and message bubbles
- Skeleton loaders while data is fetching
- Smooth hover effects and animated send button

---

## 🛠️ Tech Stack

### Frontend
| Tech | Purpose |
|---|---|
| React 19 | UI framework |
| Redux Toolkit | Global state management |
| React Router v7 | Client-side routing |
| Socket.io-client | Real-time communication |
| Axios | HTTP requests |
| Tailwind CSS | Styling |
| React Hot Toast | Notifications |
| Vite | Build tool |

### Backend
| Tech | Purpose |
|---|---|
| Node.js + Express 5 | Server framework |
| MongoDB + Mongoose | Database |
| Socket.io | WebSocket server |
| JWT | Authentication |
| bcrypt | Password hashing |
| CORS | Cross-origin handling |

---

## 📁 Project Structure

```
Ripple-chat-App/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── home/
│   │   │       ├── Sidebar.jsx      # User list, search, badges, typing
│   │   │       └── MsgContainer.jsx # Chat window, messages, input
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Layout — sidebar + chat
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── redux/
│   │   │   ├── store.js
│   │   │   └── slices/
│   │   │       ├── Auth.js
│   │   │       ├── User.js
│   │   │       └── Socket.js
│   │   ├── App.jsx                  # Routes + Socket.io connection
│   │   └── main.jsx
│   └── vercel.json                  # SPA routing fix for Vercel
│
└── server/                  # Node.js backend
    ├── controllers/
    │   ├── authController.js
    │   └── messageController.js
    ├── models/
    │   ├── userModels.js
    │   ├── conversationModels.js
    │   └── messageModels.js
    ├── routes/
    ├── middlewares/
    │   └── authMiddleware.js        # JWT verification
    ├── socket/
    │   └── socket.js                # Socket.io server + events
    └── server.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### 1. Clone the repo
```bash
git clone https://github.com/Zoya-Sk/Ripple-chat-App.git
cd Ripple-chat-App
```

### 2. Setup Backend
```bash
cd server
npm install
```

Create a `.env` file in `/server`:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

```bash
node server.js
```

### 3. Setup Frontend
```bash
cd client
npm install
```

Create a `.env` file in `/client`:
```env
VITE_BACKEND_URL=http://localhost:3000/api/v1
VITE_SOCKET_URL=http://localhost:3000
```

```bash
npm run dev
```

---

## 🌐 Deployment

| Service | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |

- Vercel auto-deploys on every push to `main`
- Render auto-deploys the backend from the `/server` folder

---

## 🔮 Future Scope

### ⚙️ Settings Page
A dedicated settings panel accessible from the home screen where users can:
- Update their profile picture
- Change display name
- Update password
- Toggle notification preferences
- Choose app theme (light / dark / system)

### 🔔 Push Notifications
Browser-level notifications for new messages even when the tab is in the background.

### 🖼️ Media Sharing
Support for sending images, videos, and files within conversations.

### 👥 Group Chats
Create group conversations with multiple participants, group admin controls, and group-level notifications.

### 🗑️ Message Actions
Delete messages for yourself or everyone, edit sent messages, and react with emojis.

### 📌 Pinned Messages
Pin important messages within a conversation for quick reference.

### 🌙 Dark Mode
Full dark theme support with a toggle in the settings page.

### 📞 Voice / Video Calls
WebRTC-based one-on-one audio and video calling directly within the app.

### 🔍 Message Search
Search through conversation history to find specific messages quickly.

---

## 👩‍💻 Author

**Zoya Shaikh**  
[GitHub](https://github.com/Zoya-Sk)

---

> *Built with ❤️ — Alhumdulillah*
```
