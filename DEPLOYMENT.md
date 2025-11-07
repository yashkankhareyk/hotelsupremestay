# Deployment Guide

This guide will help you deploy the Sunshine Hotel application to Vercel (frontend) and Render (backend).

## Prerequisites

- MongoDB database (MongoDB Atlas recommended)
- Cloudinary account for image storage
- GitHub account
- Vercel account
- Render account

## Environment Variables

### Backend (Render)

Create a `.env` file in the `server` directory or set these in Render's environment variables:

```env
NODE_ENV=production
PORT=10000

# MongoDB Connection (from MongoDB Atlas)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/sunshine-hotel?retryWrites=true&w=majority

# JWT Configuration (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
JWT_EXPIRES_IN=1d
COOKIE_NAME=sh_jwt
CSRF_COOKIE_NAME=sh_csrf

# CORS Configuration (your Vercel frontend URL)
CORS_ORIGIN=https://your-app.vercel.app

# File Upload Configuration
UPLOAD_DIR=uploads
MAX_UPLOAD_MB=5

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

### Frontend (Vercel)

Set this environment variable in Vercel:

```env
VITE_API_URL=https://your-api.onrender.com
```

## Deployment Steps

### 1. Deploy Backend to Render

1. **Create a new Web Service on Render:**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure the service:**
   - **Name:** `sunshine-hotel-api`
   - **Environment:** `Node`
   - **Build Command:** `cd server && npm install`
   - **Start Command:** `cd server && npm start`
   - **Plan:** Choose a plan (Free tier available)

3. **Set Environment Variables:**
   - Add all the backend environment variables listed above
   - Make sure `NODE_ENV=production`
   - Set `CORS_ORIGIN` to your Vercel frontend URL (you can update this after frontend deployment)

4. **Deploy:**
   - Click "Create Web Service"
   - Render will build and deploy your backend
   - Note the service URL (e.g., `https://sunshine-hotel-api.onrender.com`)

### 2. Deploy Frontend to Vercel

1. **Import your project:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Import your GitHub repository

2. **Configure the project:**
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (root)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

3. **Set Environment Variables:**
   - Add `VITE_API_URL` with your Render backend URL
   - Example: `VITE_API_URL=https://sunshine-hotel-api.onrender.com`

4. **Deploy:**
   - Click "Deploy"
   - Vercel will build and deploy your frontend
   - Note your frontend URL (e.g., `https://sunshine-hotel.vercel.app`)

5. **Update Backend CORS:**
   - Go back to Render dashboard
   - Update the `CORS_ORIGIN` environment variable to your Vercel URL
   - Redeploy the backend service

### 3. Post-Deployment

1. **Create Admin User:**
   - SSH into your Render service or use the shell
   - Run: `cd server && npm run seed`
   - This creates an admin user with:
     - Username: `admin`
     - Password: `Admin@123`
   - **IMPORTANT:** Change the admin password immediately after first login!

2. **Verify Deployment:**
   - Visit your Vercel frontend URL
   - Test the admin login at `/admin`
   - Verify image uploads work
   - Check that API calls are working

## Security Checklist

- [ ] All environment variables are set correctly
- [ ] `JWT_SECRET` is a strong random string (32+ characters)
- [ ] `MONGO_URI` uses a strong password
- [ ] `CORS_ORIGIN` is set to your production frontend URL only
- [ ] Admin password has been changed from default
- [ ] Cloudinary credentials are secure
- [ ] No sensitive data is committed to Git

## Troubleshooting

### Backend Issues

- **Database Connection Failed:**
  - Verify `MONGO_URI` is correct
  - Check MongoDB Atlas IP whitelist (add `0.0.0.0/0` for Render)
  - Verify database user has proper permissions

- **CORS Errors:**
  - Ensure `CORS_ORIGIN` matches your frontend URL exactly
  - Check for trailing slashes
  - Verify credentials are enabled

- **Image Upload Fails:**
  - Verify Cloudinary credentials
  - Check file size limits
  - Review Render logs for errors

### Frontend Issues

- **API Calls Fail:**
  - Verify `VITE_API_URL` is set correctly
  - Check browser console for CORS errors
  - Ensure backend is running and accessible

- **Build Fails:**
  - Check for TypeScript errors
  - Verify all dependencies are installed
  - Review build logs in Vercel

## Monitoring

- **Render:** Check logs in the Render dashboard
- **Vercel:** Check logs in the Vercel dashboard
- **MongoDB Atlas:** Monitor database usage and connections
- **Cloudinary:** Monitor storage and bandwidth usage

## Updates

To update your deployment:

1. Push changes to your GitHub repository
2. Render and Vercel will automatically redeploy
3. Monitor the deployment logs for any errors

## Support

For issues or questions:
- Check the logs in Render and Vercel dashboards
- Review error messages in browser console
- Verify all environment variables are set correctly

