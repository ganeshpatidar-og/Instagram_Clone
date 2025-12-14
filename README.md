📸 Instagram Clone – Full Stack Web Application

A full-stack Instagram-like social media application built using React (Vite) for the frontend and Flask (Python) for the backend, with PostgreSQL as the database.
The project supports user authentication, post creation with images, comments, and JWT-based secure APIs.

🚀 Features

🔐 User Authentication (Signup & Login using JWT)

🖼️ Create posts with image upload and captions

💬 Comment on posts

🧾 View posts and comments dynamically

🔄 RESTful API architecture

🌐 React Router for frontend navigation

🛡️ Secure backend with Flask-JWT-Extended

📦 PostgreSQL database integration

🎨 Clean, centered, Instagram-style UI

🛠️ Tech Stack
Frontend

React (Vite)

React Router DOM

Axios

HTML5 / CSS3

JavaScript (ES6+)

Backend

Python

Flask

Flask-SQLAlchemy

Flask-JWT-Extended

Flask-CORS

Database

PostgreSQL



⚙️ Backend Setup (Flask)
1️⃣ Create Virtual Environment
python -m venv venv
venv\Scripts\activate   # Windows

2️⃣ Install Dependencies
pip install -r requirements.txt

3️⃣ Configure Database

Set environment variable:

DATABASE_URL=postgresql://username:password@localhost:5432/instagram_clone

4️⃣ Run Backend Server
python app.py

Backend runs on:

http://127.0.0.1:5000

⚙️ Frontend Setup (React)
1️⃣ Install Dependencies
cd frontend
npm install

2️⃣ Start Development Server
npm run dev


Frontend runs on:

http://localhost:5173

🔗 API Endpoints
Auth
Method	Endpoint	Description
POST	/api/auth/signup	Register user
POST	/api/auth/login	Login user
Posts
Method	Endpoint	Description
POST	/api/posts	Create post
GET	/api/posts/<id>	Get single post
Comments
Method	Endpoint	Description
GET	/api/posts/<id>/comments	Get comments
POST	/api/posts/<id>/comments	Add comment
🧠 Important Architecture Notes

The Flask backend is API-only

React handles all frontend routes (/login, /post/1, etc.)

Flask only handles /api/* routes

Opening frontend routes on port 5000 will return 404 by design

