<div align="center">
    <img src="logo.png" alt="InvoiceFlow Logo" width="150">
    <h1>Invoice & Billing System</h1>
    <p>A modern, full-stack invoice and billing management system built with React and Node.js</p>

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)

</div>

---

## 🚀 Overview

**Invoice & Billing System** is a full-stack web application designed to simplify invoice management, billing, and payment tracking for freelancers and small businesses. Built with React 19 on the frontend and Express.js 5 on the backend, it features dynamic invoice creation with real-time calculations, PDF generation, payment recording, and a dashboard with analytics.

This project was built as a comprehensive portfolio piece to demonstrate full-stack TypeScript development skills, complex form handling, PDF generation, REST API integration, and modern UI/UX design with Tailwind CSS.

## ✨ Key Features

- **🔐 Authentication:** Secure JWT-based authentication with login and registration.
- **📊 Dashboard Analytics:** Real-time statistics displaying total income, receivables, overdue invoices, and monthly revenue with interactive charts.
- **🧾 Invoice Management:** Create invoices with dynamic line items, auto-generated invoice numbers, and real-time calculations.
- **📄 PDF Generation:** Professional invoice PDF generation and download using @react-pdf/renderer.
- **👥 Client Management:** Full CRUD operations for managing clients with contact details and tax information.
- **📦 Product Management:** Master data management for products/services with pricing, SKU, and categories.
- **💰 Payment Recording:** Record payments against invoices with multiple payment method support.
- **📈 Revenue Charts:** Interactive revenue trend visualization using Recharts.
- **⚙️ Settings:** User profile and company settings management.

---

## 📸 Screenshots

### 1. 🔐 Login Page

Secure authentication page with email and password login, featuring a clean and modern design.
![Login Page](screenshots/Login%20Page.png)

### 2. 📊 Dashboard

The central control panel showing key metrics, revenue charts, and recent invoice activity.
![Dashboard](screenshots/Dashboard.png)

### 3. 🧾 Invoices Management

Comprehensive list of all invoices with status indicators, filtering, and quick actions.
![Invoices](screenshots/Invoices.png)

### 4. 📄 Invoice Detail

Detailed invoice view with line items, totals, status management, and PDF download option.
![Invoice Detail](screenshots/Detail%20Invoice.png)

### 5. 👥 Clients Management

Manage all clients in one place with contact details, address, and tax information.
![Clients](screenshots/Clients.png)

### 6. 📦 Products Management

Product and service catalog with pricing, units, SKU, and category management.
![Products](screenshots/Products.png)

### 7. 💰 Payments

Track all payment records with payment method, reference, and linked invoice details.
![Payments](screenshots/Payments.png)

### 8. ⚙️ Settings

User profile and company settings configuration.
![Settings](screenshots/Settings.png)

---

## 🛠️ Technology Stack

| Layer              | Technologies                                                                                                                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**       | React 19, TypeScript, Vite 7, Tailwind CSS, Headless UI, Radix UI, TanStack Query, TanStack Table, React Router v7, React Hook Form, Recharts, Lucide React, Zustand, Zod, Axios, react-hot-toast |
| **Backend**        | Node.js, Express.js 5, TypeScript, Prisma ORM, @react-pdf/renderer, Zod, date-fns                                                                                                                 |
| **Database**       | PostgreSQL                                                                                                                                                                                        |
| **Authentication** | JWT (jsonwebtoken), bcryptjs                                                                                                                                                                      |

---

## 💻 Installation & Setup

If you want to run this project locally:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/abcdafin/invoice-billing-system.git
   cd invoice-billing-system
   ```

2. **Setup Backend:**

   ```bash
   cd backend
   npm install
   ```

   _Configure your `.env` file with your PostgreSQL credentials:_

   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/invoice_billing"
   JWT_SECRET=your-secret-key
   JWT_EXPIRES_IN=7d
   PORT=3000
   FRONTEND_URL=http://localhost:5173
   ```

   ```bash
   npx prisma generate
   npx prisma db push
   npm run dev
   ```

3. **Setup Frontend (in a new terminal):**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the application:**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3000/api`
   - Health Check: `http://localhost:3000/health`

---

## 📁 Project Structure

```
invoice-billing-system/
├── backend/
│   ├── src/
│   │   ├── config/          # Database & JWT configuration
│   │   ├── controllers/     # Route handlers (auth, clients, products, invoices, payments, dashboard, pdf)
│   │   ├── middleware/      # JWT authentication guard
│   │   ├── routes/          # API route definitions
│   │   ├── utils/           # PDF generator template
│   │   ├── types/           # TypeScript type definitions
│   │   └── app.ts           # Express app entry point
│   └── prisma/
│       └── schema.prisma    # Database schema
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Layout & common components
│   │   ├── pages/           # All page components
│   │   ├── hooks/           # React Query custom hooks
│   │   ├── stores/          # Zustand auth store
│   │   ├── types/           # TypeScript interfaces
│   │   ├── lib/             # Axios instance
│   │   └── App.tsx          # Main app with routing
│   └── ...config files
│
└── screenshots/             # Application screenshots
```

---

## 📋 API Endpoints

| Method         | Endpoint                    | Description                   |
| -------------- | --------------------------- | ----------------------------- |
| POST           | `/api/auth/register`        | Register new user             |
| POST           | `/api/auth/login`           | Login & get JWT token         |
| GET            | `/api/auth/me`              | Get current user profile      |
| GET/POST       | `/api/clients`              | List / Create clients         |
| GET/PUT/DELETE | `/api/clients/:id`          | Get / Update / Delete client  |
| GET/POST       | `/api/products`             | List / Create products        |
| GET/PUT/DELETE | `/api/products/:id`         | Get / Update / Delete product |
| GET/POST       | `/api/invoices`             | List / Create invoices        |
| GET            | `/api/invoices/:id`         | Get invoice detail            |
| GET            | `/api/invoices/number/next` | Get next invoice number       |
| PATCH          | `/api/invoices/:id/status`  | Update invoice status         |
| GET            | `/api/invoices/:id/pdf`     | Download invoice PDF          |
| GET/POST       | `/api/payments`             | List / Record payments        |
| GET            | `/api/dashboard/stats`      | Dashboard statistics          |

---

<div align="center">
    <i>Built by <a href="https://github.com/abcdafin">abcdafin</a></i>
</div>
