# AthletIQ Deployment Guide

## Prerequisites

### System Requirements
- Node.js 16+ and npm
- MongoDB 5.0+
- Redis (optional, for caching)
- AWS Account (for file storage)
- SSL Certificate for HTTPS

### Development Tools
- Git
- Docker (optional)
- PM2 (for production deployment)

## Environment Setup

### 1. Clone Repository
```bash
git clone https://github.com/sai/athletiq.git
cd athletiq
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### 3. Mobile App Setup
```bash
cd mobile-app
npm install
# For Android
npm run android
# For iOS
npm run ios
```

### 4. Admin Dashboard Setup
```bash
cd admin-dashboard
npm install
npm start
```

## Production Deployment

### Backend Deployment (AWS EC2)

#### 1. Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### 2. Application Deployment
```bash
# Clone and setup application
git clone https://github.com/sai/athletiq.git
cd athletiq/backend
npm install --production

# Setup environment
cp .env.example .env
# Edit .env with production values

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### 3. Nginx Configuration
```nginx
server {
    listen 80;
    server_name api.athletiq.sai.gov.in;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.athletiq.sai.gov.in;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Mobile App Deployment

#### Android (Google Play Store)
```bash
cd mobile-app
# Build release APK
expo build:android --type=apk

# Or build AAB for Play Store
expo build:android --type=app-bundle
```

#### iOS (App Store)
```bash
cd mobile-app
# Build for iOS
expo build:ios --type=archive
```

### Admin Dashboard Deployment

#### Build and Deploy
```bash
cd admin-dashboard
npm run build

# Deploy to AWS S3 + CloudFront
aws s3 sync build/ s3://athletiq-admin-dashboard
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## Database Setup

### MongoDB Configuration
```javascript
// /etc/mongod.conf
security:
  authorization: enabled

net:
  port: 27017
  bindIp: 127.0.0.1

storage:
  dbPath: /var/lib/mongodb
  journal:
    enabled: true
```

### Create Database User
```javascript
use athletiq
db.createUser({
  user: "athletiq_user",
  pwd: "secure_password",
  roles: [
    { role: "readWrite", db: "athletiq" }
  ]
})
```

### Indexes for Performance
```javascript
// User indexes
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "stats.rank": 1 })
db.users.createIndex({ "location.state": 1, "location.district": 1 })

// Assessment indexes
db.assessments.createIndex({ "userId": 1, "createdAt": -1 })
db.assessments.createIndex({ "testType": 1 })
db.assessments.createIndex({ "status": 1 })
db.assessments.createIndex({ "submittedToSAI": 1 })
```

## AWS Services Configuration

### S3 Bucket Setup
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::athletiq-videos/*"
    }
  ]
}
```

### CloudFront Distribution
```json
{
  "Origins": [
    {
      "DomainName": "athletiq-videos.s3.amazonaws.com",
      "Id": "S3-athletiq-videos",
      "S3OriginConfig": {
        "OriginAccessIdentity": ""
      }
    }
  ],
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-athletiq-videos",
    "ViewerProtocolPolicy": "redirect-to-https",
    "CachePolicyId": "4135ea2d-6df8-44a3-9df3-4b5a84be39ad"
  }
}
```

## Security Configuration

### SSL/TLS Setup
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d api.athletiq.sai.gov.in
```

### Firewall Configuration
```bash
# UFW setup
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### Environment Variables Security
```bash
# Secure .env file
chmod 600 .env
chown app:app .env
```

## Monitoring and Logging

### PM2 Monitoring
```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs

# Restart application
pm2 restart all
```

### Log Rotation
```bash
# Setup logrotate
sudo nano /etc/logrotate.d/athletiq

/var/log/athletiq/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 app app
    postrotate
        pm2 reloadLogs
    endscript
}
```

## Backup Strategy

### Database Backup
```bash
#!/bin/bash
# backup-db.sh
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --db athletiq --out /backups/mongodb_$DATE
tar -czf /backups/mongodb_$DATE.tar.gz /backups/mongodb_$DATE
rm -rf /backups/mongodb_$DATE

# Keep only last 7 days
find /backups -name "mongodb_*.tar.gz" -mtime +7 -delete
```

### File Backup
```bash
# S3 Cross-region replication
aws s3api put-bucket-replication --bucket athletiq-videos --replication-configuration file://replication.json
```

## Performance Optimization

### Database Optimization
- Enable MongoDB sharding for large datasets
- Use read replicas for analytics queries
- Implement proper indexing strategy

### CDN Configuration
- Use CloudFront for video delivery
- Enable gzip compression
- Set appropriate cache headers

### Application Optimization
- Implement Redis caching
- Use connection pooling
- Enable compression middleware

## Health Checks

### Application Health Check
```javascript
// health-check.js
const express = require('express');
const mongoose = require('mongoose');

app.get('/health', (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  };
  
  res.status(200).json(health);
});
```

### Monitoring Setup
```bash
# Install monitoring tools
npm install -g clinic
npm install newrelic

# Setup alerts
# Configure CloudWatch alarms for EC2, RDS, S3
```

## Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check MongoDB status
sudo systemctl status mongod

# Check logs
sudo tail -f /var/log/mongodb/mongod.log
```

#### Application Crashes
```bash
# Check PM2 logs
pm2 logs --lines 100

# Restart application
pm2 restart all
```

#### High Memory Usage
```bash
# Monitor memory
free -h
htop

# Optimize Node.js memory
node --max-old-space-size=4096 server.js
```

## Scaling Considerations

### Horizontal Scaling
- Use load balancer (ALB/ELB)
- Implement session clustering
- Database sharding strategy

### Vertical Scaling
- Monitor resource usage
- Upgrade instance types as needed
- Optimize database queries

### Auto Scaling
```json
{
  "AutoScalingGroupName": "athletiq-backend-asg",
  "MinSize": 2,
  "MaxSize": 10,
  "DesiredCapacity": 3,
  "TargetGroupARNs": ["arn:aws:elasticloadbalancing:..."],
  "HealthCheckType": "ELB",
  "HealthCheckGracePeriod": 300
}
```