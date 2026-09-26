# SmartShetkari Production-Ready Backend

Node.js, Express & TypeScript backend service for the SmartShetkari Farm Management application, powered by **Neon Serverless PostgreSQL** with **Prisma ORM**.

---

## 📁 Architecture Overview

```
backend/
├── prisma/
│   ├── schema.prisma              # PostgreSQL schema with UUIDs, indexes & foreign keys
│   └── seed.ts                    # Development database seeding script
├── src/
│   ├── config/
│   │   └── env.config.ts          # Zod-validated environment configurations
│   ├── controllers/
│   │   └── health.controller.ts   # System health and uptime controller
│   ├── middleware/
│   │   ├── error.middleware.ts    # Centralized operational error & Zod validation handler
│   │   ├── notFound.middleware.ts # 404 Route catch-all
│   │   ├── requestLogger.middleware.ts # Morgan request logger
│   │   └── validate.middleware.ts # Request body/param schema validator
│   ├── routes/
│   │   ├── api.router.ts          # API v1 aggregator
│   │   └── health.routes.ts       # Health endpoint (/api/v1/health)
│   ├── services/
│   │   └── prisma.service.ts      # Prisma Client connection singleton & graceful shutdown
│   ├── scripts/
│   │   └── test-db-connection.ts  # Live Neon DB verification test
│   ├── types/
│   │   └── index.ts               # Shared API response interfaces
│   ├── utils/
│   │   ├── apiResponse.ts         # Standardized JSON response helpers
│   │   └── logger.ts              # Color-coded structured logger
│   ├── app.ts                     # Express application factory (Cors, Helmet, Morgan, JSON)
│   └── server.ts                  # Server entry point with graceful shutdown
├── .env.example
├── .env
├── package.json
└── tsconfig.json
```

---

## 🗄️ Database Schema & Isolation

Every entity is isolated by `userId` with PostgreSQL native foreign key constraints, cascade deletes, and composite performance indexes:

| Table | Primary Key | Foreign Keys | Key Indexes | Description |
|---|---|---|---|---|
| `users` | `id` (UUID) | — | `phone`, `[district, state]` | Farmer profiles with village, land area & language |
| `crops` | `id` (UUID) | `userId` → `users.id` (Cascade) | `[userId, status]`, `[userId, season]`, `name` | Registered crops (Wheat, Cotton, Sugarcane, etc.) |
| `expenses` | `id` (UUID) | `userId`, `cropId`, `billId` | `[userId, date]`, `[userId, category]`, `cropId` | Farm costs with category, payment mode & receipt link |
| `sales` | `id` (UUID) | `userId`, `cropId` | `[userId, date]`, `cropId`, `marketName` | Mandi sales, prices, units & payment status |
| `diary_entries` | `id` (UUID) | `userId`, `cropId` | `[userId, date]`, `[userId, cropId]` | Farm logbook entries (Text & Voice recordings) |
| `bills` | `id` (UUID) | `userId` | `[userId, billDate]` | OCR scanned purchase receipts & invoices |
| `budgets` | `id` (UUID) | `userId`, `cropId` | `[userId, year]`, Unique(`userId, year, season, cropId`) | Seasonal category-wise allocated budget caps |
| `notifications` | `id` (UUID) | `userId` | `[userId, isRead]`, `[userId, createdAt]` | Weather, market rate, and advisory alerts |
| `ai_conversations` | `id` (UUID) | `userId` | `[userId, updatedAt]` | Smart AI crop advisory chat sessions |
| `ai_messages` | `id` (UUID) | `conversationId` → `ai_conversations.id` (Cascade) | `[conversationId, createdAt]` | User queries and AI agronomist responses |

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and set your **Neon PostgreSQL** database connection:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://neondb_owner:password@ep-sample.us-east-2.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET=your_super_secret_jwt_key
```

### 3. Generate Prisma Client
```bash
npm run prisma:generate
```

### 4. Push Schema to Neon PostgreSQL
```bash
npx prisma db push
```

### 5. Seed Development Data
```bash
npm run prisma:seed
```

### 6. Verify Database Connection & Records
```bash
npx tsx src/scripts/test-db-connection.ts
```

### 7. Run in Development Mode
```bash
npm run dev
```

### 8. Build for Production
```bash
npm run build
npm start
```
