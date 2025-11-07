# Environment Variables Reference

## Backend Environment Variables (server/.env)

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Node environment | `production` or `development` |
| `PORT` | Server port | `5000` (dev) or `10000` (Render) |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secret key for JWT tokens (min 32 chars) | Generate with: `openssl rand -base64 32` |
| `CORS_ORIGIN` | Allowed frontend origin(s) | `https://your-app.vercel.app` or comma-separated list |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | Cloudinary API key | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | From Cloudinary dashboard |

### Optional Variables (with defaults)

| Variable | Default | Description |
|----------|---------|-------------|
| `JWT_EXPIRES_IN` | `1d` | JWT token expiration time |
| `COOKIE_NAME` | `sh_jwt` | JWT cookie name |
| `CSRF_COOKIE_NAME` | `sh_csrf` | CSRF token cookie name |
| `UPLOAD_DIR` | `uploads` | Local upload directory |
| `MAX_UPLOAD_MB` | `5` | Maximum upload size in MB |

## Frontend Environment Variables (.env)

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://your-api.onrender.com` |

## Generating Secure Secrets

### JWT Secret
```bash
# Generate a secure random string
openssl rand -base64 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### MongoDB Connection String
1. Go to MongoDB Atlas
2. Create a cluster
3. Create a database user
4. Whitelist IP addresses (use `0.0.0.0/0` for Render)
5. Get connection string from "Connect" → "Connect your application"

### Cloudinary Credentials
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard
3. Copy Cloud Name, API Key, and API Secret

## Security Best Practices

1. **Never commit `.env` files to Git**
2. **Use strong, unique secrets for production**
3. **Rotate secrets periodically**
4. **Use different secrets for development and production**
5. **Limit CORS origins to specific domains**
6. **Use environment-specific configurations**

## Example .env Files

### Backend (server/.env)
```env
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/sunshine-hotel
JWT_SECRET=your-generated-secret-key-here-min-32-chars
CORS_ORIGIN=https://your-app.vercel.app
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Frontend (.env)
```env
VITE_API_URL=https://your-api.onrender.com
```

