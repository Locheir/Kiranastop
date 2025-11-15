# Node.js Application (Express + MongoDB Atlas + Docker)

This is a Node.js backend application built using Express, EJS, Mongoose, and various middleware for authentication, sessions, file uploads, and email services.  
The app is connected to **MongoDB Atlas** and can run locally or in Docker.

## 🚀 Features
- Express.js web server
- MongoDB Atlas integration using Mongoose
- User authentication (bcrypt + JWT + sessions)
- File uploads using Multer
- Email service with Nodemailer
- TailwindCSS support
- Fully Dockerized setup

## 📁 Project Structure
controllers/
middlewares/
models/
public/
routes/
utils/
views/
.env
app.js
package.json
Dockerfile

## 🔧 Requirements
- Node.js (v16 or later)
- MongoDB Atlas account
- Docker
- npm or yarn

## ⚙️ Environment Setup
Create a `.env` file:

PORT=3001
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<databaseName>
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret

## ▶️ Running Locally
npm install
node app.js

Your app will run on:
http://localhost:3001

## 🐳 Docker Setup
Build:
docker build -t kirana-stop .

Run:
docker run -p 3001:3001 --env-file .env kirana-stop

## 📦 Dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["node", "app.js"]

## 📄 .dockerignore
node_modules
.env
npm-debug.log
