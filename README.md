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

# copy .env.example and configure it connect the the mysql database

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

#### dockerize and docker-compose

Prerequisites
- Docker and docker-compose installed

Quick start (from project root)

```bash
docker-compose up -d --build
```

Stop and remove containers

```bash
docker-compose down
```

View backend logs

```bash
docker-compose logs --tail=200 backend
```

Environment
- The compose file exposes a default MySQL configuration. To change credentials or DB name,
  set environment variables (in your shell or a project `.env`) before running compose:

  - `MYSQL_ROOT_PASSWORD`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`, `MYSQL_PORT`
  - `BACKEND_PORT` (optional)

- `DATABASE_URL` for the backend is assembled in `docker-compose.yml` and points to the `mysql`
  service by default. If you run a separate DB, set `DATABASE_URL` accordingly (MySQL URI):

  `mysql://user:password@host:3306/database`

Migrations
- I applied an initial migration inside the container during startup. To re-apply migrations
  (production-style) run:

```bash
docker-compose exec backend npx prisma migrate deploy
```

- For local development you can create migrations on your host:

```bash
cd backend
npx prisma migrate dev --name <name>
```

Endpoints
- tRPC endpoint: http://localhost:3000/api/trpc
- Swagger UI:    http://localhost:3000/api/docs

Troubleshooting
- If Prisma complains about OpenSSL or the query engine, ensure the backend image uses a
  non-Alpine base (this project uses Debian-slim). Rebuild images after changes to the
  Dockerfile or `prisma` folder:

```bash
docker-compose up -d --build
```

- To start with a fresh MySQL volume (destructive), run:

```bash
docker-compose down -v
docker-compose up -d --build
```


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

✅ **UI/UX**
- Mobile-responsive design (iPhone 14 Plus)
- Clean, modern interface matching the provided design
- Status badges for card states
- Interactive buttons and selectors

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

## Development

### Backend Commands
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with sample data

### Frontend Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

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
