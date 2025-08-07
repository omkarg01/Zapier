# Hooks Package

This package provides webhook endpoints for handling zap-related operations.

## Features

- `GET /hooks/catch/:userId/:zapId` - Retrieves a specific zap by its ID for a given user
- `POST /hooks/catch/:userId/:zapId` - Creates a new zap run and outbox entry

## Development

### Installation

```bash
npm install
```

### Running the Server

```bash
npm run dev
```

The server will start on http://localhost:3000 by default, or the port specified in the PORT environment variable.

### Building

```bash
npm run build
```

### Running Tests

```bash
npm test
```

## Testing

The package uses Jest and Supertest for testing. Tests are located in `src/index.test.ts`.

### Test Coverage

The tests cover:

1. GET endpoint for retrieving zaps
   - When a zap exists
   - When a zap does not exist

2. POST endpoint for creating zap runs
   - Creating a zapRun and zapRunOutBox in a transaction

## API Documentation

### GET /hooks/catch/:userId/:zapId

Retrieves a specific zap by its ID for a given user.

**Parameters:**
- `userId` - The ID of the user who owns the zap
- `zapId` - The unique identifier of the zap to retrieve

**Response:**
```json
{
  "zap": {
    "id": "zap123",
    "userId": 42,
    "name": "Test Zap",
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-02T00:00:00Z"
  }
}
```

### POST /hooks/catch/:userId/:zapId

Creates a new zap run and outbox entry.

**Parameters:**
- `userId` - The ID of the user who owns the zap
- `zapId` - The unique identifier of the zap

**Request Body:**
Any JSON object that will be stored as metadata.

**Response:**
```json
{
  "message": "Webhook recieved"
}
```