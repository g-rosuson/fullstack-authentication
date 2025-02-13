Full-Stack Authentication System

A full-stack authentication system built with TypeScript, React, Zustand, and Sass on the frontend. Paired with Node.js, Express, and MongoDB on the backend.  

Features

User authentication

JWT-based authentication with secure HTTP-only cookies

State management using Zustand

Password hashing with bcrypt

Protected routes on both frontend and backend

Express.js route endpoints for handling authentication

Tech Stack

Frontend:

TypeScript

React 

Zustand

Sass

Backend:

Node.js

Express.js

MongoDB

JSON Web Tokens (JWT) for authentication

bcrypt for password hashing

Installation

Prerequisites:

Node.js installed

MongoDB instance (local or cloud)

Clone the Repository

git clone https://github.com/yourusername/fullstack-auth-system.git
cd fullstack-auth-system

Backend Setup

Create a .env file in the backend directory and add properties defined in .env.example:
cd backend
npm install
cp .env.example .env  # Update environment variables in .env
npm start

Frontend Setup

cd frontend
npm install
npm run dev

Usage

Start the backend and frontend servers.

Register a new user.

Login and receive a secure JWT token.

Access protected routes with authentication.

License

This project is licensed under the MIT License.

Contact

For any inquiries, feel free to reach out!
