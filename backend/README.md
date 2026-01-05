# Auth Backend Service

A Node.js backend service for user and admin authentication with JWT tokens, built with Express.js and MongoDB.

## Features

- **Dual Authentication System**: Separate signup and login endpoints for users and admins
- **JWT Token-based Authentication**: Secure token generation and verification
- **Role-based Access Control**: Different permissions for users and admins
- **User Management**: CRUD operations for user profiles
- **Admin Dashboard**: Comprehensive user management and statistics
- **Input Validation**: Joi schema validation for all requests
- **Error Handling**: Centralized error handling with custom error codes
- **Logging**: Structured JSON logging
- **Docker Support**: Docker and Docker Compose configuration

## Quick Start

```bash
# Install dependencies
npm install

# Start Docker services
docker-compose up -d

# Run development server
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/user/signup` - User registration
- `POST /api/v1/auth/user/login` - User login
- `POST /api/v1/auth/admin/signup` - Admin registration
- `POST /api/v1/auth/admin/login` - Admin login

### User Endpoints
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile
- `DELETE /api/v1/users/profile` - Delete account

### Admin Endpoints
- `GET /api/v1/admin/users` - Get all users
- `GET /api/v1/admin/users/:userId` - Get user details
- `PUT /api/v1/admin/users/:userId` - Update user
- `DELETE /api/v1/admin/users/:userId` - Delete user
- `PATCH /api/v1/admin/users/:userId/deactivate` - Deactivate user
- `PATCH /api/v1/admin/users/:userId/activate` - Activate user
- `GET /api/v1/admin/statistics` - Get statistics

## Environment Variables

Create `.env` file from `.env.example` and configure:
- `MONGODB_URL` - MongoDB connection string
- `JWT_SECRET` - User JWT secret
- `ADMIN_JWT_SECRET` - Admin JWT secret
- `ADMIN_SECRET` - Admin signup verification secret

## License

MIT
