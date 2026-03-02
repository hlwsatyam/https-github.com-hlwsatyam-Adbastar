# Lumina Academy - Premium Course Selling Platform

A full-stack course selling platform with a modern glassmorphism design, secure video streaming, and Razorpay integration.

## Features
- **Admin Panel**: Manage students, courses, and view revenue stats.
- **Student Panel**: Browse courses, purchase via Razorpay, and access unlocked videos.
- **Authentication**: JWT-based auth with role-based access control.
- **Modern UI**: Glassmorphism, smooth animations, and dark theme.

## Setup Instructions

1. **Environment Variables**:
   Update the `.env` file with your credentials:
   - `MONGODB_URI`: Your MongoDB connection string.
   - `JWT_SECRET`: A secure random string for JWT.
   - `RAZORPAY_KEY_ID`: Your Razorpay test/live key ID.
   - `RAZORPAY_KEY_SECRET`: Your Razorpay test/live secret.

2. **Seed Admin User**:
   Run the following command to create an initial admin user:
   ```bash
   npm run seed
   ```
   **Default Admin Credentials**:
   - Email: `admin@lumina.com`
   - Password: `adminpassword123`

3. **Run the App**:
   ```bash
   npm run dev
   ```

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Motion, Lucide Icons.
- **Backend**: Node.js, Express, MongoDB (Mongoose), Multer, JWT.
- **Payments**: Razorpay Gateway.
