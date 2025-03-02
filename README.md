# Full-Stack Authentication System

A full-stack authentication system built with TypeScript, React, Zustand, and Sass on the frontend, paired with Node.js, Express, and MongoDB on the backend.

## Features

- User authentication
- JWT-based authentication with secure HTTP-only cookies
- State management using Zustand
- Responsive UI styled with Sass
- Password hashing with bcrypt
- Protected routes on both frontend and backend
- MongoDB database integration with Mongoose
- Express.js route endpoints for handling authentication

## Tech Stack
  
### Frontend:

- Typescript
- React
- Zustand
- Sass

### Backend:

- Typescript
- Node.js
- Express.js
- MongoDb
- JSON Web Tokens

## API Endpoints

### Authentication Routes

| Method | Endpoint           | Description          |
| ------ | ------------------ | -------------------  |
| POST   | /api/auth/register | Register a new user  |
| POST   | /api/auth/login    | Login user           |
| GET    | /api/auth/logout   | Logout user          |
| GET    | /api/auth/refresh  | Refresh access token |

## Environment Variables

Create a `.env` file in the `backend` directory and add the following keys:

```env
NODE_ENV=...
DEV_CLIENT_URL=...
PROD_CLIENT_URL=...
PROD_DOMAIN=...
DEV_DOMAIN=...
ACCESS_TOKEN_SECRET=...
REFRESH_TOKEN_SECRET=...
MONGO_URI=...
MONGODB_DB=...
```
## License

This project is licensed under the MIT License.

## Contact

For any inquiries, feel free to reach out!
