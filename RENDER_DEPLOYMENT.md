# Render Deployment Guide

## Quick Setup

1. **Push render.yaml to your repository**
   ```bash
   git add render.yaml
   git commit -m "Add Render deployment configuration"
   git push origin main
   ```

2. **Connect to Render**
   - Go to [render.com](https://render.com)
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` file

3. **Environment Variables**
   - Render will auto-generate secrets for:
     - `JWT_SECRET`
     - `ADMIN_JWT_SECRET` 
     - `ADMIN_SECRET`
     - MongoDB password

## Services Created

### Backend Service (`auth-backend-service`)
- **Type**: Node.js Web Service
- **Port**: 8080
- **Build**: `cd backend && npm install`
- **Start**: `cd backend && npm start`
- **Health Check**: Available at `/health`

### Database (`auth-mongodb`)
- **Type**: Docker Private Service
- **Database**: MongoDB 7.0
- **Connection**: Automatically linked to backend

### Frontend (`auth-frontend`)
- **Type**: Static Site
- **Build**: `cd frontend && npm install && npm run build`
- **Publish**: `frontend/dist`

## Important Notes

- The backend connects to MongoDB using Render's internal networking
- Frontend API URL is automatically configured to point to your backend
- All services are on the free tier by default
- Health checks are configured for monitoring

## Troubleshooting

If deployment fails:
1. Check logs in Render dashboard
2. Verify all required files exist in your repo
3. Ensure `package.json` has correct start script
4. Check MongoDB connection string format

## Customization

To modify deployment:
- Edit `render.yaml` and push changes
- Render will automatically update services
- For custom domains, upgrade to paid plan
