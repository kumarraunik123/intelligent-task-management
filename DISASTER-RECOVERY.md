# Disaster Recovery Plan

## 1. Project Information

- Project: Intelligent Task Management System
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB Atlas
- Deployment: AWS EC2 with Docker Compose
- AWS Region: ap-south-1 (Mumbai)

## 2. Recovery Objectives

- Target RPO: 24 hours
- Target RTO: 4 hours

These are project recovery targets, not guaranteed recovery times.

## 3. AWS Infrastructure Backup

- Backup type: AWS EBS snapshot
- Snapshot ID: snap-030fc0eed9da0fd7e
- Volume ID: vol-0d211ba1f275b5f35
- Snapshot status: Completed
- Volume size: 8 GiB

## 4. Database Recovery

The application uses MongoDB Atlas.

Database: inteligent-system

Collections:
- users
- tasks

Recovery procedure:
1. Confirm MongoDB Atlas cluster availability.
2. Locate a verified database backup.
3. Restore using MongoDB Database Tools.
4. Verify users and tasks collections.
5. Test application login and task operations.

Current status: MongoDB backup creation is pending.

## 5. Application Recovery

1. Verify EC2 instance availability.
2. Restore or provision the required EC2 infrastructure.
3. Install Docker and Docker Compose if needed.
4. Clone the project repository.
5. Configure environment variables securely.
6. Build and start services using Docker Compose.
7. Verify frontend, backend and MongoDB connectivity.

## 6. Docker Storage

- Named Docker volumes: Not configured.
- Backend persistent mounts: None.
- Frontend persistent mounts: None.
- Main database storage: MongoDB Atlas.

Container-local data and logs may be lost when containers are replaced.

## 7. Recovery Verification

- Verify application health endpoint.
- Verify frontend access.
- Test user login.
- Test task creation, update and deletion.
- Verify MongoDB Atlas connectivity.

## 8. Backup Status

| Backup | Status |
|---|---|
| AWS EBS snapshot | Completed |
| MongoDB database backup | Pending |
| Database restore test | Pending |
| Disaster recovery documentation | In progress |

## 9. Security

- Never commit secrets or passwords.
- Restrict access to backup files.
- Keep database credentials in secure environment variables.
- Verify backups before performing recovery. 