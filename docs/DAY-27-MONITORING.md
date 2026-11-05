# Day 27 – AWS CloudWatch Monitoring

## 1. Overview

Configured AWS CloudWatch monitoring for the Intelligent Task Management System hosted on Amazon EC2.

- AWS Region: Asia Pacific (Mumbai) – `ap-south-1`
- EC2 instance: `intelligent-task-management-server`
- Monitoring service: Amazon CloudWatch
- Custom metrics namespace: `CWAgent`

## 2. CPU Monitoring

Configured EC2 CPU monitoring using:

- Namespace: `AWS/EC2`
- Metric: `CPUUtilization`
- Statistic: Average
- Period: 5 minutes
- Target alarm threshold: Greater than 70%
- Evaluation: 2 out of 2 datapoints
- Alarm name: `intelligent-task-management-cpu-high`

Verify the alarm state and configuration in the CloudWatch Alarms console.

## 3. SNS Email Notifications

Configured an existing SNS topic:

`Default_CloudWatch_Alarms_Topic`

- Alarm notification trigger: In alarm
- Email subscription: Confirmed

The topic sends email notifications when the configured CPU alarm enters the ALARM state.

## 4. EC2 Status Checks

EC2 provides two primary status checks:

- System status check
- Instance status check

Expected healthy result: `2/2 checks passed`.

Check the EC2 Instances console to verify the current status.

## 5. RAM, Swap and Disk Monitoring

Installed and configured the Amazon CloudWatch Agent on EC2.

- Agent status: Running
- Configuration status: Configured
- Collection interval: 60 seconds
- Custom namespace: `CWAgent`

Configured metrics:

- `mem_used_percent` – RAM utilization
- `swap_used_percent` – Swap utilization
- `disk_used_percent` – Disk utilization

Disk metric delivery was observed in CloudWatch. Verify RAM and swap metric delivery in the CloudWatch console.

## 6. CloudWatch Agent Verification

Run on the EC2 Ubuntu server:

```bash
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a status
```

Expected status:

- `status`: running
- `configstatus`: configured

## 7. Application Health Verification

Check production containers:

```bash
docker compose -f docker-compose.prod.yml ps
```

Check backend logs:

```bash
docker compose -f docker-compose.prod.yml logs --tail=50 backend
```

Check API health:

```bash
curl -i http://localhost:8080/api/health
```

Expected HTTP response: `200 OK`.

Expected JSON response:

```json
{
  "success": true,
  "message": "Intelligent Task Management API is running"
}
```

## 8. Monitoring Benefits

- Detect high EC2 CPU utilization.
- Receive email notifications for CPU alarm events.
- Monitor RAM and swap utilization.
- Track disk utilization.
- Check EC2 system and instance health.
- Verify application availability and Docker container status.

## 9. Security Notes

- Do not commit AWS credentials or private keys.
- Do not publish environment variables or database passwords.
- Use an EC2 IAM role for CloudWatch Agent permissions.
- Keep SNS subscriptions and notification recipients protected.
- Avoid deleting Docker rollback images that may be required for recovery.

## 10. Day 27 Verification Checklist

- [x] CloudWatch dashboard opened.
- [x] EC2 CPU metric inspected.
- [x] SNS email subscription confirmed.
- [x] CloudWatch Agent installed and configured.
- [x] CloudWatch Agent running.
- [x] Disk metric observed in CWAgent.
- [x] Docker containers verified running.
- [x] Production API health returned HTTP 200.
- [ ] RAM and swap metrics verified in CloudWatch.
- [ ] CPU alarm final saved configuration verified.
- [ ] EC2 status checks verified as 2/2 passed.

---

Project: Intelligent Task Management System  
Platform: AWS EC2  
Monitoring: Amazon CloudWatch and CloudWatch Agent  
Notifications: Amazon SNS  