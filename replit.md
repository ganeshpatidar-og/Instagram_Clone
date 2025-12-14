# Instagram Clone

A simplified Instagram-style social media application built with Flask (backend) and React (frontend).

## Project Structure

```
├── backend/           # Flask API server
│   ├── app.py         # Main Flask application
│   ├── models.py      # SQLAlchemy database models
│   └── routes/        # API route blueprints
│       ├── auth.py    # Authentication endpoints
│       ├── posts.py   # Posts, likes, comments endpoints
│       └── users.py   # User profile, follow endpoints
├── frontend/          # React application (Vite)
│   ├── src/
│   │   ├── api.js     # API client with axios
│   │   ├── App.jsx    # Main app component with routing
│   │   ├── components/# Reusable components
│   │   └── pages/     # Page components
│   └── vite.config.js # Vite configuration
```

## Tech Stack

- **Backend**: Flask, Flask-SQLAlchemy, Flask-JWT-Extended, Flask-CORS
- **Database**: PostgreSQL
- **Frontend**: React, React Router, Axios, Vite

## Features

- User registration and login with JWT authentication
- Create posts with image URLs and captions
- Like/unlike posts
- Comment on posts
- Follow/unfollow users
- Personalized feed (all posts or following only)
- User profiles with posts grid

## Database Models

- **User**: id, username, email, password_hash, created_at
- **Post**: id, user_id, image_url, caption, created_at
- **Like**: user_id, post_id (composite primary key)
- **Comment**: id, user_id, post_id, content, created_at
- **Followers**: follower_id, following_id (many-to-many through table)

## API Endpoints

### Auth
- POST /api/auth/signup - Register new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user

### Posts
- POST /api/posts - Create post
- GET /api/posts/feed - Get posts from followed users
- GET /api/posts/all - Get all posts
- GET /api/posts/:id - Get single post
- POST /api/posts/:id/like - Like post
- POST /api/posts/:id/unlike - Unlike post
- GET /api/posts/:id/comments - Get comments
- POST /api/posts/:id/comments - Add comment

### Users
- GET /api/users/:id - Get user profile
- GET /api/users/:id/posts - Get user's posts
- POST /api/users/:id/follow - Follow user
- POST /api/users/:id/unfollow - Unfollow user
- GET /api/users/search?q= - Search users

## Running the App

The app runs with two workflows:
1. Backend: Flask API on port 5001
2. Frontend: React dev server on port 5000 (proxies /api to backend)

The frontend is accessible via the webview.
