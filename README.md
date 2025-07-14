# 🐦 Twitter Clone - MERN Full Stack Social Media App

This is the frontend for **Twitter-clone**, built with [React](https://react.dev/) and [Vite](https://vitejs.dev/). A full-featured Twitter clone built with the **MERN stack** (MongoDB, Express, React, Node.js), styled with **Tailwind CSS**, and powered by **TanStack Query** for efficient data fetching and caching. It provides a fast development environment with hot module replacement and modern JavaScript features.

---

## Overview

This is a full-stack social media platform that allows users to sign up, log in, create posts, interact with content, and manage their profiles. The application includes features like posting, commenting, liking, reposting, notifications, and profile customization.

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

  - Create, update, and delete tweets
  - Like, comment, and repost tweets
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
## License

This project is licensed under the MIT License.
