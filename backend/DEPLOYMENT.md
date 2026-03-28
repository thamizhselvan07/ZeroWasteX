# FoodBridge Deployment Guide

Complete guide to deploying FoodBridge to production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Deployment](#backend-deployment)
3. [Frontend Deployment](#frontend-deployment)
4. [Environment Setup](#environment-setup)
5. [Database Migration](#database-migration)
6. [Monitoring & Maintenance](#monitoring--maintenance)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Services
- MongoDB Atlas account (for persistent storage)
- Git repository (GitHub, GitLab, etc.)
- Hosting platform (Render, Railway, Heroku, or your server)
- Frontend hosting (Vercel, Netlify, or S3 + CloudFront)

### Estimated Time
- First deployment: 30-45 minutes
- Subsequent updates: 5-10 minutes

### Security Checklist
- [ ] Generate strong `SECRET_KEY` (minimum 32 characters)
- [ ] Update `CORS_ORIGINS` with production domain
- [ ] Enable HTTPS for all endpoints
- [ ] Use environment variables for all secrets
- [ ] Never commit `.env` files to git
- [ ] Add `.env` to `.gitignore`

## Backend Deployment

### Option 1: Render.com (Recommended)

**Time: ~10 minutes**

1. **Connect Repository**
   - Go to https://render.com
   - Sign up and create new Web Service
   - Connect your GitHub account
   - Select the foodbridge repository

2. **Configure Service**
   ```
   Name: foodbridge-api
   Environment: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: gunicorn -w 4 -b 0.0.0.0:5000 app:app
   Root Directory: backend/
   ```

3. **Set Environment Variables**
   Click "Advanced" and add:
   ```
   USE_MEMORY_STORAGE = false
   MONGO_URI = mongodb+srv://user:pass@cluster.mongodb.net/foodbridge?retryWrites=true&w=majority
   SECRET_KEY = <generate-strong-key>
   FLASK_ENV = production
   CORS_ORIGINS = https://your-frontend-domain.com
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy
   - Your backend will be available at `https://your-service.onrender.com`

### Option 2: Railway.app

**Time: ~8 minutes**

1. **Connect GitHub**
   - Go to https://railway.app
   - Sign up and import project
   - Select foodbridge repository

2. **Configure**
   - Railway auto-detects Python
   - Add environment variables via dashboard
   - Set start command: `gunicorn -w 4 app:app`

3. **Deploy**
   - Auto-deploys on git push
   - Monitor in Railway dashboard

### Option 3: Traditional Server (VPS/EC2)

**Time: ~20 minutes**

1. **SSH into Server**
   ```bash
   ssh user@your-server.com
   ```

2. **Install Dependencies**
   ```bash
   sudo apt update
   sudo apt install python3 python3-pip python3-venv nginx
   ```

3. **Clone Repository**
   ```bash
   cd /var/www
   git clone https://github.com/yourusername/foodbridge.git
   cd foodbridge/backend
   ```

4. **Setup Virtual Environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   pip install gunicorn
   ```

5. **Create Systemd Service**
   ```bash
   sudo nano /etc/systemd/system/foodbridge.service
   ```
   
   Add:
   ```ini
   [Unit]
   Description=FoodBridge API
   After=network.target
   
   [Service]
   User=www-data
   WorkingDirectory=/var/www/foodbridge/backend
   Environment="PATH=/var/www/foodbridge/backend/venv/bin"
   ExecStart=/var/www/foodbridge/backend/venv/bin/gunicorn -w 4 -b 127.0.0.1:5000 app:app
   Restart=always
   
   [Install]
   WantedBy=multi-user.target
   ```

6. **Start Service**
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl start foodbridge
   sudo systemctl enable foodbridge
   ```

7. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/foodbridge
   ```
   
   Add:
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;
   
       location / {
           proxy_pass http://127.0.0.1:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```
   
   Enable:
   ```bash
   sudo ln -s /etc/nginx/sites-available/foodbridge /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

8. **Setup SSL (Let's Encrypt)**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d api.yourdomain.com
   ```

## Frontend Deployment

### Option 1: Vercel (Recommended for Next.js-like projects)

**Time: ~5 minutes**

1. **Connect to Vercel**
   - Go to https://vercel.com
   - Import your GitHub repository
   - Select the `frontend` directory as root

2. **Environment Variables**
   ```
   VITE_API_BASE_URL = https://api.yourdomain.com
   ```

3. **Deploy**
   - Vercel auto-detects Vite
   - Click Deploy
   - Your site goes live immediately

### Option 2: Netlify

**Time: ~5 minutes**

1. **Connect Repository**
   - Go to https://netlify.com
   - Sign in with GitHub
   - Select and authorize repository

2. **Configure Build**
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/dist
   ```

3. **Environment Variables**
   ```
   VITE_API_BASE_URL = https://api.yourdomain.com
   ```

4. **Deploy**
   - Click Deploy
   - Netlify builds and deploys automatically

### Option 3: Amazon S3 + CloudFront

**Time: ~15 minutes**

1. **Build Application**
   ```bash
   cd frontend
   npm run build
   ```

2. **Create S3 Bucket**
   - AWS Console → S3
   - Create bucket: `foodbridge-web`
   - Enable static website hosting
   - Upload contents of `dist/` folder

3. **Setup CloudFront**
   - Create distribution
   - Point to S3 bucket
   - Add CNAME: `app.yourdomain.com`

4. **Configure Environment**
   - Set `VITE_API_BASE_URL` in build

## Environment Setup

### MongoDB Atlas Setup

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up free account

2. **Create Cluster**
   - Choose "M0" (free tier)
   - Select region close to your users
   - Wait for cluster to deploy (~10 minutes)

3. **Create Database User**
   - Go to Database Access
   - Add new user
   - Set strong password
   - Grant "readWriteAnyDatabase" role

4. **Get Connection String**
   - Go to Clusters
   - Click "Connect"
   - Choose "Connect your application"
   - Copy URI: `mongodb+srv://user:password@cluster.mongodb.net/?retryWrites=true&w=majority`

5. **Add IP Whitelist**
   - Add your production server IP
   - Or allow all IPs (0.0.0.0/0) - less secure

### Securing Environment Variables

**Never commit secrets to git!**

1. **Create `.gitignore`**
   ```
   # Environment
   .env
   .env.local
   .env.*.local
   
   # Dependencies
   node_modules/
   venv/
   __pycache__/
   
   # Build
   dist/
   build/
   
   # Logs
   *.log
   ```

2. **Use Platform Secrets**
   - Each platform (Render, Railway, Vercel) has secure secret management
   - Never share secrets in logs or error messages
   - Rotate secrets periodically

## Database Migration

### Moving from Development (Memory Storage) to Production (MongoDB)

1. **Ensure MongoDB is Ready**
   ```bash
   # Test connection
   mongosh "mongodb+srv://user:password@cluster.mongodb.net/test"
   ```

2. **Update Backend Configuration**
   ```bash
   USE_MEMORY_STORAGE=false
   MONGO_URI=<your-connection-string>
   ```

3. **Seed Initial Data**
   - Sample 25 food records auto-load on first connection
   - Or manually import data:
   ```bash
   cd backend
   python
   >>> from services.mongo_service import get_food_collection
   >>> from services.sample_data import SAMPLE_FOODS
   >>> collection = get_food_collection()
   >>> collection.insert_many(SAMPLE_FOODS)
   ```

4. **Verify Data**
   ```bash
   curl https://api.yourdomain.com/foods/all
   ```

## Monitoring & Maintenance

### Health Checks

Monitor API availability:

```bash
# Simple health check
curl https://api.yourdomain.com/

# Detailed system check
curl https://api.yourdomain.com/health/

# Database check (loads sample data if needed)
curl https://api.yourdomain.com/foods/all | grep -o '"id"' | wc -l
# Output should be: 25
```

### Logging

1. **Backend Logs**
   - Render/Railway: View in dashboard
   - Traditional Server: 
   ```bash
   tail -f /var/log/syslog | grep foodbridge
   ```

2. **Frontend Errors**
   - Check Sentry, LogRocket, or similar service
   - Monitor browser console errors

### Performance Monitoring

Add to your deployment:

```bash
# Monitor response times
curl -w "@curl-format.txt" -o /dev/null -s https://api.yourdomain.com/

# Check error rate
curl https://api.yourdomain.com/login -d '{"email":"test@test.com"}' 2>/dev/null | grep -o '"success"'
```

### Regular Maintenance

- **Weekly**: Check error logs
- **Monthly**: Review database size (MongoDB Atlas dashboard)
- **Quarterly**: Update dependencies (`pip install --upgrade -r requirements.txt`)
- **Annually**: Rotate secrets and update security settings

## Troubleshooting

### Backend Issues

**Cannot connect to MongoDB**
```bash
# Verify connection string
# Check IP whitelist on MongoDB Atlas
# Ensure firewall allows outbound connections

# Fallback to memory storage for testing
USE_MEMORY_STORAGE=true
```

**Gunicorn timeout errors**
```bash
# Increase timeout
gunicorn --timeout 120 app:app
```

**Out of memory on Render free tier**
```bash
# Reduce worker count
gunicorn -w 2 app:app
# Or upgrade to paid plan
```

### Frontend Issues

**API calls failing from production**
```bash
# Verify CORS_ORIGINS includes your domain
# Check that API URL is correct in .env
# Ensure HTTPS is enabled

VITE_API_BASE_URL = https://api.yourdomain.com  # HTTPS required
```

**Static assets not loading**
```bash
# Verify build command runs correctly
npm run build

# Check that dist/ folder has all files
# Ensure publish directory points to dist/
```

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| 502 Bad Gateway | Backend down or not responding | Check backend logs, restart service |
| 404 Not Found | API endpoint not found | Verify API URL and endpoint path |
| 401 Unauthorized | Missing/invalid token | Ensure token is sent in headers |
| CORS error | Frontend origin not in CORS_ORIGINS | Add frontend URL to backend config |
| MongoDB connection timeout | Network/firewall issue | Check MongoDB Atlas IP whitelist |

### Getting Help

1. Check project README
2. Review deployment platform docs
3. Check environment variables are set correctly
4. Test endpoints with `curl` or Postman
5. Check server logs for detailed errors

---

**Questions? Check the main README.md or project documentation.**
