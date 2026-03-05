# 🛍️ LocalBrand — E-Commerce Website

A full-stack e-commerce web application for a local brand, featuring product browsing, shopping cart, checkout, order management, and an admin dashboard. Built with **React**, **Material UI**, **Node.js / Express**, and **MongoDB**.

---

## ✨ Features

### Customer-Facing
- **Home Page** — Browse products with a modern, responsive UI
- **Product Details** — View detailed information for each product
- **User Authentication** — Register & login with JWT-secured sessions
- **Shopping Cart** — Add, update, and remove items
- **Checkout** — Complete purchases via Stripe integration
- **Order History** — View past orders and their status

### Admin
- **Admin Dashboard** — Manage products (CRUD), view orders, and oversee inventory
- **Auto-seeded Admin Account** — A default admin user is created on first run
- **Product Seeding Script** — Quickly populate the database with sample products

---

## 🏗️ Tech Stack

| Layer        | Technology                                                      |
| ------------ | --------------------------------------------------------------- |
| **Frontend** | React 19, Vite, TypeScript, Material UI 7, React Router 7      |
| **Backend**  | Node.js, Express 4, Mongoose 8                                  |
| **Database** | MongoDB (Atlas or local)                                        |
| **Auth**     | JWT (jsonwebtoken), bcryptjs                                    |
| **Payments** | Stripe                                                          |
| **Forms**    | Formik + Yup validation                                         |
| **HTTP**     | Axios                                                           |

---

## 📁 Project Structure

```
Local_brand-website/
├── client/                  # React frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable UI components (Navbar, etc.)
│   │   ├── contexts/        # Auth & Cart context providers
│   │   ├── pages/           # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── ProductDetails.tsx
│   │   │   ├── Cart.tsx
│   │   │   ├── Checkout.tsx
│   │   │   ├── Orders.tsx
│   │   │   └── AdminDashboard.tsx
│   │   ├── App.tsx          # Root component & routing
│   │   └── main.tsx         # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                  # Express backend
│   ├── components/          # Middleware, service registry, etc.
│   ├── models/              # Mongoose schemas (User, Product, Order)
│   ├── routes/              # API routes (auth, products, orders)
│   ├── scripts/             # Utility scripts (seed, admin creation)
│   ├── server.js            # Entry point
│   ├── .env                 # Environment variables (not committed)
│   └── package.json
│
├── .gitignore
├── LICENSE                  # MIT License
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or later — [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** — A running instance or a [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### 1. Clone the Repository

```bash
git clone https://github.com/abdallah2335/Local_brand-website.git
cd Local_brand-website
```

### 2. Set Up the Server

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` directory:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
PORT=5000
```

Start the server:

```bash
# Development (with hot-reload)
npm run dev

# Production
npm start
```

The server will start on **http://localhost:5000**.

### 3. Set Up the Client

```bash
cd client
npm install
npm run dev
```

The client will start on **http://localhost:5173** (Vite default).

### 4. Seed the Database (Optional)

Populate the database with sample products:

```bash
cd server
node scripts/seedProducts.js
```

---

## 🔑 Default Admin Credentials

On first server start, a default admin account is created automatically:

| Field    | Value               |
| -------- | ------------------- |
| Email    | `admin@example.com` |
| Password | `admin123`          |

> ⚠️ **Change these credentials immediately in a production environment.**

---

## 📡 API Endpoints

### Authentication — `/api/auth`

| Method | Endpoint    | Description           |
| ------ | ----------- | --------------------- |
| POST   | `/register` | Register a new user   |
| POST   | `/login`    | Login & receive a JWT |

### Products — `/api/products`

| Method | Endpoint | Description              |
| ------ | -------- | ------------------------ |
| GET    | `/`      | List all products        |
| GET    | `/:id`   | Get a single product     |
| POST   | `/`      | Create a product (admin) |
| PUT    | `/:id`   | Update a product (admin) |
| DELETE | `/:id`   | Delete a product (admin) |

### Orders — `/api/orders`

| Method | Endpoint | Description             |
| ------ | -------- | ----------------------- |
| GET    | `/`      | List user's orders      |
| POST   | `/`      | Create a new order      |

---

## 🛠️ Available Scripts

### Client (`/client`)

| Command           | Description                         |
| ----------------- | ----------------------------------- |
| `npm run dev`     | Start Vite dev server               |
| `npm run build`   | Build for production                |
| `npm run preview` | Preview production build locally    |
| `npm run lint`    | Run ESLint                          |

### Server (`/server`)

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start with nodemon (hot-reload)      |
| `npm start`     | Start production server              |

---

## 🤝 Contributing

Contributions are welcome! To get started:

1. **Fork** this repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a **Pull Request**

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 📬 Contact

**abdallah2335** — [GitHub Profile](https://github.com/abdallah2335)