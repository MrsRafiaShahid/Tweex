# 🐦 TWEEX - MERN Full Stack Social Media App

This is the frontend for **TWEEX**, built with [React](https://react.dev/) and [Vite](https://vitejs.dev/). It provides a fast development environment with hot module replacement and modern JavaScript features.

---

## Overview

Tweex is a full-stack social media web application inspired by **X (formerly Twitter)** built with the **MERN stack** (MongoDB, Express, React, Node.js), styled with **Tailwind CSS**, and powered by **TanStack Query** for efficient data fetching and caching. It allows users to sign up, log in, create posts, like, comment, repost, receive notifications, and manage their profiles — all in a smooth, modern interface with a dark-mode friendly design and playful branding.

🚀 **Live Demo**: [tweex.onrender.com](https://tweex.onrender.com/)  
📦 **GitHub Repo**: [MrsRafiaShahid/Tweex](https://github.com/MrsRafiaShahid/Tweex)

---

## 🚀 Features

- ⚡️ Fast development with Vite
- ⚛️ React for building user interfaces
- 🔥 Hot Module Replacement (HMR)
- 🧹 ESLint for code quality

- ✅ **Authentication**

  - Sign Up, Login, Logout
  - JWT-based secure auth system
  - User signup with email, username, and password
  - Secure login/logout functionality
  - JWT-based authentication with protected routes
  - Session management with cookies

- 📝 **Post Functionality**

  - Create, update, and delete posts
  - Like, comment, and repost posts
  - Create posts with text and images (stored in Cloudinary)
  - Delete/update your own posts
  - View posts from followed users and all users
  - Like/unlike posts
  - Comment on posts
  - Like/unlike comments
  - Repost content

- 🧵 **Social Features**

  - Comment threads
  - Reposts (Retweets)
  - Likes and engagement tracking

- 🔔 **Notifications**

  - Receive notifications for:
    - New followers
    - Likes on your posts
    - Comments on your posts
    - Reposts of your content
    - Likes on your comments
  - Mark notifications as read
  - Delete notifications

- 👤 **Profile Management**

  - View other user profiles
  - Edit and update your own profile (bio, avatar, etc.)
  - View user profiles with followers/following counts
  - Edit profile information (full name, bio, links)
  - Update profile and cover pictures
  - View user's posts and liked posts
  - Follow/unfollow other users

- 📱 **Responsive UI**

  - Suggested users to follow
  - Real-time updates using React Query
  - Responsive UI with Tailwind CSS
  - Error handling throughout the application
  - Image uploads to Cloudinary

---

## 🖼 UI & Branding

- 🔮 **Custom Logo** — Designed as a playful hex-maze shield with a gradient.
- 🎨 **Color Palette**:
  - `#b30753` (Primary Pink)
  - `#93ede1`, `#bff4ed`, `#ebfbf9` (Accents)
  - `#a855f7`, `#2dd4bf` (Gradients)

---

## 🛠️ Tech Stack

### Frontend

- **React** UI library
- **Vite** Build tools
- **Tailwind CSS** for Styling
- **DaisyU** for Component library
- **TanStack Query (React Query)** for Data fetching and state management
- **React Router** for Routing
- **React Icons** for Icon library

### Backend

- **Node.js** for JavaScript runtime
- **Express.js** for Web framework
- **MongoDB with Mongoose** for DataBase
- **JWT** for authentication
- **Cloudinary** for Image storage
- **Bcrypt** for Password hashing

---

## Project Structure

### Backend Structure

```
backend/
├── controllers/        # Route handlers
├── models/             # MongoDB models
├── middleware/         # Custom middleware
├── routes/             # API routes
├── database/           # DB connection
├── utils/              # Utility functions
└── index.js            # Entry point
```

### Frontend Structure

```
frontend/
├── public/
├── src/
│   ├── components/     # Reusable components
│   ├── hooks/          # Custom hooks
│   ├── pages/          # Page components
│   ├── utils/          # Utility functions
│   ├── App.jsx         # Main component
│   └── main.jsx        # Entry point
├── index.html
└── vite.config.js
```

---

## Installation

#### Prerequisites

- Node.js (v18+)
- MongoDB
- Cloudinary account (for image storage)

#### Backend Setup

- Create a .env file in the backend root with:

```
 MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=15d
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
PORT=5000
```

---

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start the development server:**

   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🚀 Getting Started (Local Setup)

1. **Clone the Repo**

```bash
git clone https://github.com/MrsRafiaShahid/Tweex.git
cd Tweex
```

---

## Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

## Backend Setup

```bash
cd ../server
npm install
npm run dev
```

---

## API Documentation

- API endpoints are documented in the `routes` directory.
- Use a tool like Postman or cURL to test API endpoints.

---

## Testing

- Run `npm run test` in the backend directory to run tests.
- Run `npm run test` in the frontend directory to run tests.

---

## Deployment

- Use a tool like Vercel or Netlify to deploy the frontend application.
- Use a tool like Heroku or AWS to deploy the backend application.
- Use a tool like Render to deploy the backend and frontend application.

---

## Contributing

- Fork the repository and create a new branch for your feature or bug fix.
- Commit changes and push to your branch.
- Open a pull request to merge your changes into the main branch.

---
## Screenshots
- <img src="/frontend/public/login.png" alt="login" width="300">
- <img src="/frontend/public/signup.png" alt="signup" width="300">
- <img src="/frontend/public/home.png" alt="signup" width="300">
- <img src="/frontend/public/profile.png" alt="signup" width="300">

### 🧑‍💻 Author

- Made with ❤️ by Rafia Shahid
- Let’s connect on <a herf="https://www.linkelin.com/in/rafia-shahid-mern">Linkedlin </a>

## License

- This project is for educational and personal portfolio use only. Not intended for commercial distribution.
