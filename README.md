# Sunshine Hotel Website

A modern, responsive hotel website built with React, TypeScript, and Node.js.

## Features

- 🏨 Beautiful, responsive design
- 📸 Image gallery with lightbox
- ⭐ Testimonials section
- 🏠 Property showcase
- 📧 Contact form
- 🔐 Admin dashboard for content management
- 📤 Image upload with Cloudinary integration
- 🔒 Secure authentication and authorization

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express
- MongoDB (Mongoose)
- JWT Authentication
- Cloudinary (Image Storage)
- Security: Helmet, CORS, Rate Limiting, XSS Protection

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB database (local or MongoDB Atlas)
- Cloudinary account

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd supreme
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Install backend dependencies:**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Set up environment variables:**

   Create `server/.env`:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/sunshine-hotel
   JWT_SECRET=your-secret-key-here
   CORS_ORIGIN=http://localhost:5173
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

   Create `.env` in root:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

5. **Seed the database:**
   ```bash
   cd server
   npm run seed
   ```
   This creates an admin user:
   - Username: `admin`
   - Password: `Admin@123`
   - **Change this password immediately after first login!**

6. **Start the development servers:**

   Backend:
   ```bash
   cd server
   npm run dev
   ```

   Frontend (in a new terminal):
   ```bash
   npm run dev
   ```

7. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - Admin Dashboard: http://localhost:5173/admin

## Project Structure

```
supreme/
├── server/                 # Backend API
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Express middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   ├── validators/         # Input validation schemas
│   └── index.js           # Server entry point
├── src/                   # Frontend React app
│   ├── api/               # API client
│   ├── components/         # React components
│   ├── pages/              # Page components
│   ├── types/              # TypeScript types
│   └── main.tsx           # App entry point
├── vercel.json            # Vercel deployment config
├── render.yaml            # Render deployment config
└── DEPLOYMENT.md          # Deployment guide
```

## Deployment

This application is designed to be deployed on:
- **Frontend:** Vercel
- **Backend:** Render

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Security

Security measures implemented:
- JWT authentication with HTTP-only cookies
- CSRF protection
- Rate limiting
- Input validation and sanitization
- XSS protection
- MongoDB injection protection
- Secure error handling
- Environment variable management

See [SECURITY.md](./SECURITY.md) for detailed security documentation.

## Environment Variables

See [ENV_VARIABLES.md](./ENV_VARIABLES.md) for a complete list of environment variables and their descriptions.

## Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend
- `npm run dev` - Start development server (with nodemon)
- `npm start` - Start production server
- `npm run seed` - Seed database with initial data

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is proprietary and confidential.

## Support

For issues or questions, please contact the development team.

