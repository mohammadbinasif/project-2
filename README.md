# Project 2: Backend API Development

A simple backend REST API built with Node.js and Express to handle user data with full CRUD operations and data validation.

## Setup

```bash
# Install dependencies
npm install

# Start the server
npm start
```

The server runs on `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Welcome message with available endpoints |
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get a single user by ID |
| POST | `/api/users` | Create a new user |
| PUT | `/api/users/:id` | Update an existing user |
| DELETE | `/api/users/:id` | Delete a user |

## Example Request (POST)

```json
POST /api/users
Content-Type: application/json

{
  "name": "Diana Prince",
  "email": "diana@example.com",
  "age": 28
}
```

## Validation Rules

- **Name**: Required, minimum 2 characters
- **Email**: Required, must be valid format
- **Age**: Required, must be a number between 0 and 150

## Testing with curl

```bash
# Get all users
curl http://localhost:3000/api/users

# Create a user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","age":25}'
```
