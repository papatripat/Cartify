# 🛒 Cartify — E-Commerce Platform

A full-stack e-commerce platform built with **React, Node.js, MongoDB, and Stripe**. Features real-time inventory tracking, secure payment integration, and a comprehensive admin dashboard.

> Built as a portfolio demonstration project.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-Payment-635BFF?logo=stripe&logoColor=white)

## ✨ Features

- **🔐 Stripe Payment Integration** — Secure checkout with Stripe Elements (test mode)
- **📡 Real-Time Inventory Tracking** — Live stock updates via Socket.IO WebSocket
- **👨‍💼 Admin Dashboard** — Revenue stats, product CRUD, order management, inventory monitoring
- **🔍 Product Search & Filters** — Category filters, search, and sorting
- **🛒 Shopping Cart** — Persistent cart with localStorage
- **🔑 JWT Authentication** — Register, login, role-based access control

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Stripe account (test mode)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/cartify.git
cd cartify

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Environment Setup

Copy the example env file and fill in your values:

```bash
cd server
cp .env.example .env
```

Edit `.env` with your MongoDB URI, Stripe keys, and JWT secret.

### Seed Database

```bash
cd server
npm run seed
```

This creates:
- 12 demo products across 5 categories
- Admin account: `admin@cartify.com` / `admin123`
- User account: `john@example.com` / `user123`

### Run the App

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## 🧪 Test Payment

Use Stripe test card: `4242 4242 4242 4242` with any future date and CVC.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router, Vite |
| Styling | Vanilla CSS (custom design system) |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Payment | Stripe (PaymentIntent API) |
| Real-time | Socket.IO |
| Auth | JWT, bcrypt |

## 📁 Project Structure

```
├── server/              # Node.js backend
│   ├── config/          # Database connection
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API endpoints
│   ├── middleware/       # Auth middleware
│   ├── seed.js          # Demo data seeder
│   └── server.js        # Entry point
└── client/              # React frontend
    └── src/
        ├── components/  # Reusable UI components
        ├── context/     # React Context providers
        └── pages/       # Route pages + admin dashboard
```

## 📄 License

This project is for portfolio/demonstration purposes.
