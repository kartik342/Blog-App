# Full-Stack Blog Application
A backend-driven blog application that allows users to register, authenticate, create posts, and interact with content securely. The project demonstrates core backend development concepts such as authentication, authorization, database relationships, and file uploads.

## Project Overview
This Blog Application is built using Node.js, Express, and MongoDB, with EJS used for server-side rendering. It supports user authentication, post management, profile handling, and interactive features like liking posts, making it a complete real-world backend project.

## Screenshots
SignUP/Login Page : ![SignUp Page](https://github.com/kartik342/Blog-App/blob/main/Screenshots/Screenshot%202026-01-30%20101907.png)
                    ![Login Page](https://github.com/kartik342/Blog-App/blob/main/Screenshots/Screenshot%202026-01-30%20101917.png)
Home Page : ![Home Page](https://github.com/kartik342/Blog-App/blob/main/Screenshots/Screenshot%202026-01-30%20102003.png)

## Features
User registration and login with JWT-based authentication
Secure session handling using HTTP cookies
Create, edit, and delete blog posts
Like and unlike posts
User-specific authorization (users can edit/delete only their own posts)
Profile page with user posts
Profile picture upload using Multer
Server-side rendering using EJS templates

## Tech Stack
Backend: Node.js, Express.js
Database: MongoDB, Mongoose
Authentication: JWT (JSON Web Tokens), bcrypt
Templating Engine: EJS
File Uploads: Multer
Middleware: Cookie-parser, Express middleware
Version Control: Git & GitHub

## Project Structure
├── app.js
├── models/
│   ├── user.js
│   └── post.js
├── config/
│   └── multerconfig.js
├── views/
│   ├── index.ejs
│   ├── login.ejs
│   ├── profile.ejs
│   ├── edit.ejs
│   └── profileupload.ejs
├── public/
│   └── uploads/
└── package.json

## Authentication Flow
User registers with email and password
Password is securely hashed using bcrypt
JWT token is generated and stored in cookies
Protected routes are accessed using a custom middleware (isLoggedIn)

## How to Run Locally

### 1. Clone the repository
---
git clone https://github.com/yourusername/blog-app.git
cd blog-app
---

### 2. Install dependencies
---
npm install
---

### 3. Start MongoDB
---
Make sure MongoDB is running locally or connected via MongoDB Atlas.
---

### 4. Run the server
---
node app.js
OR
npx nodemon app.js
---

### 5. Open in browser
---
http://localhost:3000
---

## Key Learning Outcomes
Implemented secure authentication and authorization using JWT
Designed MongoDB schemas with relationships between users and posts
Built RESTful routes with Express
Handled file uploads and static assets
Gained hands-on experience with backend application architecture

## Future Improvements
Add comments functionality
Implement pagination for posts
Improve UI styling
Add environment variable configuration using .env
Deploy application to a cloud platform

