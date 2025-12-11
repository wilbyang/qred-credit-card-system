# Qred Credit Card Management System

A full-stack application built with tRPC, TypeScript, React, and Prisma for managing credit cards, companies, and transactions.

## Project Structure

```
qred_credit_card_project2/
├── backend/              # tRPC backend server
│   ├── prisma/          # Database schema
│   ├── src/             # Source code
│   │   ├── routers/     # tRPC routers
│   │   ├── index.ts     # Server entry point
│   │   ├── router.ts    # Main router
│   │   ├── trpc.ts      # tRPC configuration
│   │   ├── db.ts        # Prisma client
│   │   └── seed.ts      # Database seeding
│   └── package.json
│
└── frontend/            # React frontend
    ├── src/
    │   ├── utils/       # tRPC client
    │   ├── App.tsx      # Main application
    │   ├── AppProvider.tsx
    │   ├── main.tsx
    │   └── index.css
    └── package.json
```

## Tech Stack

### Backend
- **tRPC** - End-to-end typesafe APIs
- **Express** - Web server
- **Prisma** - ORM with SQLite
- **TypeScript** - Type safety
- **Zod** - Runtime validation
- **MySQL** - Relational database Storage

### Frontend
- **React** - UI framework
- **Vite** - Build tool
- **TanStack Query** - Data fetching
- **TypeScript** - Type safety

## Setup Instructions

### 1. Install Backend Dependencies

```
cd backend
npm install
```

### 2. Setup Database

# copy .env.example and configure it connect the mysql database

```
# Generate Prisma client and create database
npm run db:push

# Seed the database with sample data
npm run db:seed
```

### 3. Start Backend Server

```
npm run dev
```

The backend will start on `http://localhost:3000`

Endpoints
- tRPC endpoint: http://localhost:3000/api/trpc
- Swagger UI:    http://localhost:3000/api/docs

### Mock Data Mode

The backend can serve mock data to unblock frontend development without requiring a database setup by setting the following in .env file:

```
USE_MOCK=true
```

This allows frontend developers to work with pre-configured sample data.

### 4. Install Frontend Dependencies

Open a new terminal:

```
cd frontend
npm install
```

### 5. Start Frontend Development Server

```
npm run dev
```

The frontend will start on `http://localhost:5173`

## Features

### Implemented Features

✅ **Company Management**
- View all companies
- Select company from dropdown

✅ **Card Management**
- View cards by company
- Display card details (number, status, limit, spending)
- Activate inactive cards
- View remaining spend

✅ **Invoice Information**
- Display invoice due date and amount
- Show invoice badge when available

✅ **Transaction History**
- View latest 3 transactions
- Show total transaction count
- Pagination support (view more button)


## API Endpoints

### Companies
- `company.getAll` - Get all companies
- `company.getById` - Get company by ID

### Cards
- `card.getByCompany` - Get cards by company ID
- `card.getById` - Get card details by ID
- `card.activate` - Activate a card
- `card.getInvoice` - Get invoice for a card

### Transactions
- `transaction.getByCard` - Get transactions by card ID (with pagination)

## Database Schema

### Company
- id (UUID)
- name
- createdAt
- updatedAt

### Card
- id (UUID)
- companyId (FK)
- cardNumber
- status (active/inactive/blocked)
- limit
- currentSpend
- currency
- cardImageUrl
- createdAt
- updatedAt

### Transaction
- id (UUID)
- cardId (FK)
- description
- amount
- dataPoints
- date
- createdAt

### Invoice
- cardId (PK, FK)
- dueDate
- amount
- currency
- isPaid


## Sample Data

The seed script creates:
- 2 companies
- 3 credit cards
- 82 transactions
- 2 invoices

Default company: "Company AB" with an inactive card (limit: 10,000 kr, spent: 5,400 kr)

## Notes

- All data is type-safe end-to-end via tRPC
- Cards can be activated only once
- Transactions are paginated with a default limit of 3
## Coming Work

- **Authentication** - Implement user authentication and authorization
- **Test Coverage** - Add unit and integration tests for backend and frontend
- **CI/CD Pipeline** - Set up automated testing, linting, and deployment workflows
- **Mock Data Configuration** - Move mock data serving logic to a separate configuration file in the backend for better maintainability