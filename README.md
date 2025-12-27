# 🎫 Support Ticket System

A full-stack **PERN (PostgreSQL, Express, React, Node.js)** application for managing support tickets with secure authentication and role-based access control. Users can create and track support tickets, while admins can manage and respond to them. The system also supports email notifications using Brevo SMTP.

---

## 🔗 Live Demo

- **Frontend:** https://support-ticket-system-r1vy.onrender.com  
- **Backend API:** https://support-ticket-backend-dfd3.onrender.com  

---

## ✨ Features

- 🔐 User authentication using JWT
- 🧑‍💼 Role-based access (User / Admin)
- 🎟 Create, view, and manage support tickets
- 📧 Email notifications via Brevo SMTP
- 🗄 PostgreSQL database hosted on Neon
- 🌐 RESTful API architecture
- 🚀 Deployed on Render

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- Axios
- Modern CSS

### Backend
- Node.js
- Express.js
- JWT Authentication
- bcrypt for password hashing
- Nodemailer (Brevo SMTP)

### Database
- PostgreSQL (Neon)

### Deployment
- Render (Frontend & Backend)

---

## 📁 Project Structure

```text
support-ticket-system/
│
├── frontend/        # React frontend (Vite)
│
├── backend/         # Node.js + Express backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── config/
│   └── index.js
│
└── README.md
