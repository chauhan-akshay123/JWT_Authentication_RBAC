# JWT-Based Authentication with Role-Based Access Control (RBAC) and Token Blacklisting

A simple Express.js REST API implementing JWT (JSON Web Token) authentication with role-based access control. This API demonstrates secure authentication flows, token management, and role-based route protection.

## Features
- JWT-based authentication
- Role-based access control (Admin/User roles)
- Token blacklisting for logout
- Protected and public routes
- Express.js middleware for role verification

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
JWT_SECRET=your_jwt_secret_here
```

4. Start the server:
```bash
node server.js
```

## API Endpoints

### Authentication Routes

#### POST /login
Authenticates a user and returns a JWT token.

**Request:**
```json
{
    "username": "eagle",
    "password": "password123"
}
```

**Response:**
```json
{
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /logout
Invalidates the current JWT token.

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
    "message": "Logged out successfully. Token revoked."
}
```

### Protected Routes

#### GET /admin
Admin-only route.

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
    "message": "Welcome, Admin!",
    "user": {
        "id": 2,
        "username": "sheldon",
        "role": "admin"
    }
}
```

#### GET /user
Route accessible to both admin and regular users.

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
    "message": "Welcome, User!",
    "user": {
        "id": 1,
        "username": "eagle",
        "role": "user"
    }
}
```

### Public Routes

#### GET /public
Publicly accessible route.

**Response:**
```json
{
    "message": "This is a public route available to everyone."
}
```

