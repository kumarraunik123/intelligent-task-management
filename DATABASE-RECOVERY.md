# Database Recovery Guide

## 1. Project Database Information

- Database: `inteligent-system`
- Database provider: MongoDB Atlas
- Backup utility: MongoDB Database Tools
- Backup commands: `mongodump` and `mongorestore`

## 2. Create a Database Backup

Before creating a backup, verify that MongoDB Atlas credentials and database permissions are working.

Run the following command in Windows CMD, replacing the placeholders with the correct local values:

```cmd
mongodump --host="<ATLAS_CLUSTER_HOST>" --username="<DATABASE_USERNAME>" --authenticationDatabase=admin --db=inteligent-system --out="C:\Users\rauni\mongodb-backups"
```

Enter the database password when prompted. Never store passwords in this documentation.

Verify that the backup folder contains the database backup files.

## 3. Restore the Database

1. Confirm that a valid backup exists.
2. Confirm that the destination MongoDB Atlas cluster is accessible.
3. Run `mongorestore` using the backup directory.

Example:

```cmd
mongorestore --host="<ATLAS_CLUSTER_HOST>" --username="<DATABASE_USERNAME>" --authenticationDatabase=admin --nsInclude="inteligent-system.*" "C:\Users\rauni\mongodb-backups\inteligent-system"
```

Enter the database password when prompted.

**Warning:** Verify the destination database before restoring. Do not overwrite production data without authorization and a recovery plan.

## 4. Verify Database Recovery

After restoration:

- Connect to MongoDB Atlas.
- Confirm that the `inteligent-system` database exists.
- Verify the `users` and `tasks` collections.
- Check that expected records are present.
- Test application login and task CRUD operations.

## 5. Backup and Recovery Status

- AWS EBS snapshot: Completed.
- Docker named volumes: Not configured.
- MongoDB Atlas backup: Pending verification.
- Database restore test: Not yet performed.

## 6. Security Recommendations

- Never commit database passwords or connection strings.
- Keep backup files in a secure location.
- Restrict access to backup files.
- Verify backups before relying on them for disaster recovery.
- Test restoration periodically.   