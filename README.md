# Fullstack authentication system

A fullstack authentication system offering a solid foundation for user session management.

The frontend is developed using React.js with TypeScript and styled using SCSS, leveraging tools like Zustand for state management and Orval for seamless API integration. Orval consumes an OpenAPI schema from a "/api/docs/openapi" endpoint. And generates a fully typed API client for the frontend, ensuring end-to-end type safety and reducing the risk of mismatches between client and server.

On the backend, the system is built with Node.js and Express, using TypeScript for static type safety and Zod for runtime validation. API schemas are defined using Zod, and @asteasolutions/zod-to-openapi is used to generate an OpenAPI specification directly from the Zod schemas. The OpenAPI schema is then served through a dedicated "/api/docs/openapi" endpoint. MongoDB is used for data persistence, and JWT handles secure authentication mechanisms.

## Tech Stack
  
### Frontend:
- React.js
- TypeScript
- SCSS
- Zustand
- Orval
- Eslint
- Stylelint
- Vite
- Vitest
- React testing library

### Backend:

- Node.js
- Express
- TypeScript
- Zod
- @asteasolutions/zod-to-openapi
- MongoDB
- JWT

## Features

### Backend:
- JWT access & refresh-token (HTTP-only cookie) authentication
- TypeScript static type safety
- Zod runtime schema validation
- Auto-generated OpenAPI schema served via "/api/docs/openapi" endpoint using the @asteasolutions/zod-to-openapi library
- Express.js REST API
- Password hashing with bcrypt
- MongoDB for data persistance
- Linting with Eslint

### Frontend:
- TypeScript static type safety
- State management using Zustand
- Auto generated frontend API client types using Orval
- SCSS styling
- Linting and formatting via ESLint and Stylelint
- Testing with Vitest and React Testing Library
- Vite for bundling

## API Endpoints

### Authentication routes

| Method | Endpoint           | Description          |
| ------ | ------------------ | -------------------  |
| POST   | /api/auth/register | Register a new user  |
| POST   | /api/auth/login    | Login user           |
| GET    | /api/auth/logout   | Logout user          |
| GET    | /api/auth/refresh  | Refresh access token |

### Open-api spec route

| Method | Endpoint           | Description          |
| ------ | ------------------ | -------------------  |
| GET    | /api/docs/openapi  | Get open-api spec    |

## Environment Variables

Create a `.env` file in the `backend` directory and add the following keys:

```env
NODE_ENV=...
BASE_ROUTE_PATH=...
DEV_CLIENT_URL=...
PROD_CLIENT_URL=...
PROD_DOMAIN=...
DEV_DOMAIN=...
ACCESS_TOKEN_SECRET=...
REFRESH_TOKEN_SECRET=...
MONGO_URI=...
MONGODB_DB_NAME=...
MONGO_USER_COLLECTION_NAME=...
```
## License

This project is licensed under the MIT License.

## Contact

For any inquiries, feel free to reach out!
