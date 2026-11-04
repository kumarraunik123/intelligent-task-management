
# Intelligent Task Management System – Deployment Guide

## 1. Project Overview

The Intelligent Task Management System is a full-stack application deployed on AWS EC2 using Docker and Docker Compose.

Production URL: https://taskcompleted.duckdns.org

## 2. Application Architecture

- Frontend: React and Vite
- Web Server: Nginx
- Backend: Node.js and Express.js
- Database: MongoDB Atlas
- Containerization: Docker
- Orchestration: Docker Compose
- Cloud Hosting: AWS EC2
- CI/CD: GitHub Actions with a self-hosted runner

### Application Request Flow

User Browser → Nginx Frontend → Express Backend → MongoDB Atlas

The frontend is publicly accessible through port 8080. Nginx forwards API requests to the backend running internally on port 5000.

## 3. Production Docker Configuration

Production Compose file:

`docker-compose.prod.yml`

Services:

- backend: Express API on internal port 5000
- frontend: Nginx serving the frontend on port 80, mapped to EC2 port 8080

Start the production application:

```bash
docker compose -f docker-compose.prod.yml up -d
```

Check running containers:

```bash
docker compose -f docker-compose.prod.yml ps
```

View backend logs:

```bash
docker compose -f docker-compose.prod.yml logs --tail=30 backend
```

Stop the application:

```bash
docker compose -f docker-compose.prod.yml down
```

## 4. CI/CD Pipeline

GitHub repository:

https://github.com/kumarraunik123/intelligent-task-management

Workflow file:

`.github/workflows/deploy.yml`

The pipeline contains two jobs:

### Job 1 – Backend Tests

1. Checkout repository.
2. Set up Node.js 22.
3. Install dependencies using npm ci.
4. Run automated tests using npm test.

### Job 2 – Deploy on EC2

This job runs only after backend tests pass.

1. Fetch latest GitHub changes.
2. Update the EC2 project.
3. Validate production Docker Compose configuration.
4. Save backup Docker image tags.
5. Build and deploy the application.
6. Check frontend homepage availability.
7. Check backend API health response.
8. Tag successful Docker images with the Git commit SHA.
9. Display production container status.

## 5. Health Checks

### Frontend Homepage

```bash
curl -I http://localhost:8080/
```

### Backend API Through Nginx

```bash
curl -i http://localhost:8080/api/health
```

Expected API response:

```json
{
  "success": true,
  "message": "Intelligent Task Management API is running"
}
```

The deployment workflow retries health checks before declaring deployment successful.

## 6. Docker Image Versioning and Rollback

Docker images:

- intelligent-task-management-backend
- intelligent-task-management-frontend

List available images:

```bash
docker images
```

Inspect running container images:

```bash
docker inspect -f '{{.Name}} {{.Image}}' intelligent-task-management-backend-1 intelligent-task-management-frontend-1
```

The deployment workflow creates rollback backup tags before deploying a new version.

If deployment or health checks fail, the workflow restores the previous image tags and recreates the containers.

**Important:** Do not delete rollback images while they may be needed for recovery.

## 7. EC2 Monitoring

Check Docker containers:

```bash
docker compose -f docker-compose.prod.yml ps
```

Check Docker disk usage:

```bash
docker system df
```

Check server disk space:

```bash
df -h
```

Check memory:

```bash
free -h
```

Check CPU load:

```bash
uptime
```

Check CPU core count:

```bash
nproc
```

Check backend logs:

```bash
docker compose -f docker-compose.prod.yml logs --tail=50 backend
```

## 8. Git Deployment Workflow

From the local project folder:

```bash
git add <specific-file>
git commit -m "Describe your change"
git push origin master
```

Pushing to the master branch automatically triggers the GitHub Actions workflow.

Always review your Git changes before committing.

## 9. Security Notes

- Never commit `.env` files.
- Never publish passwords, database credentials, API keys, or GitHub runner tokens.
- Never upload private PEM keys to GitHub.
- Keep MongoDB credentials in the server environment configuration.
- Use restricted AWS Security Group rules.
- Do not delete Docker rollback images without confirming they are no longer required.

## 10. Production Verification Checklist

- [ ] Frontend homepage loads.
- [ ] User registration works.
- [ ] User login works.
- [ ] Task creation works.
- [ ] Task update works.
- [ ] Task deletion works.
- [ ] Backend API health check returns HTTP 200.
- [ ] MongoDB Atlas connection works.
- [ ] Docker containers are running.
- [ ] GitHub Actions tests pass.
- [ ] GitHub Actions deployment passes.
- [ ] Rollback procedure is documented.

---

**Project:** Intelligent Task Management System

**Deployment Platform:** AWS EC2

**CI/CD Platform:** GitHub Actions

**Container Platform:** Docker and Docker Compose  
