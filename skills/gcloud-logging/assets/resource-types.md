# GCP Monitored Resource Types — Quick Reference

Commonly queried resource types, their `resource.type` value, and available `resource.labels.*` keys.

> **Tip:** When unsure, sample 1 entry and inspect its `resource.type` + `resource.labels` keys.
> Use `scripts/explore-log-entry.sh` for this.

---

## Compute

| Service | `resource.type` | Labels | Notes |
|---------|-----------------|--------|-------|
| Cloud Run (service) | `cloud_run_revision` | `project_id`, `service_name`, `revision_name`, `location`, `configuration_name` | Most Cloud Run service logs |
| Cloud Run (job) | `cloud_run_job` | `project_id`, `job_name`, `location` | Execution/task labels often under `labels.*` |
| Cloud Run (worker pool) | `cloud_run_workerpool` | `project_id`, `workerpool_name`, `location` | May appear as `cloud_run_worker_pool` in some surfaces |
| Cloud Functions (1st gen) | `cloud_function` | `project_id`, `function_name`, `region` | Firebase Functions 1st gen uses this |
| Cloud Functions (2nd gen) | `cloud_run_revision` | Same as Cloud Run service | 2nd gen functions are Cloud Run under the hood |
| Compute Engine | `gce_instance` | `project_id`, `instance_id`, `zone` | |
| App Engine | `gae_app` | `project_id`, `module_id`, `version_id`, `zone` | |

## Kubernetes (GKE)

| Service | `resource.type` | Labels |
|---------|-----------------|--------|
| Container | `k8s_container` | `project_id`, `cluster_name`, `namespace_name`, `pod_name`, `container_name`, `location` |
| Pod | `k8s_pod` | `project_id`, `cluster_name`, `namespace_name`, `pod_name`, `location` |
| Node | `k8s_node` | `project_id`, `cluster_name`, `node_name`, `location` |
| Cluster | `k8s_cluster` | `project_id`, `cluster_name`, `location` |

## Networking

| Service | `resource.type` | Labels |
|---------|-----------------|--------|
| HTTP(S) Load Balancer | `http_load_balancer` | `project_id`, `forwarding_rule_name`, `url_map_name`, `target_proxy_name`, `backend_service_name` |
| Cloud DNS | `dns_query` | `project_id`, `target_name`, `source_type`, `location` |
| VPC Flow Logs | `gce_subnetwork` | `project_id`, `subnetwork_id`, `subnetwork_name`, `location` |

## Data & Storage

| Service | `resource.type` | Labels |
|---------|-----------------|--------|
| Cloud SQL | `cloudsql_database` | `project_id`, `database_id`, `region` |
| BigQuery | `bigquery_resource` | `project_id` |
| Cloud Storage | `gcs_bucket` | `project_id`, `bucket_name`, `location` |
| Pub/Sub (topic) | `pubsub_topic` | `project_id`, `topic_id` |
| Pub/Sub (subscription) | `pubsub_subscription` | `project_id`, `subscription_id` |

## Security & Audit

| Log type | `logName` pattern / `log_id()` |
|----------|-------------------------------|
| Admin Activity | `log_id("cloudaudit.googleapis.com/activity")` |
| Data Access | `log_id("cloudaudit.googleapis.com/data_access")` |
| System Event | `log_id("cloudaudit.googleapis.com/system_event")` |
| Policy Denied | `log_id("cloudaudit.googleapis.com/policy")` |

## Common log name patterns

| Resource | Typical `logName` suffix (URL-encoded) |
|----------|---------------------------------------|
| Cloud Run requests | `run.googleapis.com%2Frequests` |
| Cloud Run stderr | `run.googleapis.com%2Fstderr` |
| Cloud Run stdout | `run.googleapis.com%2Fstdout` |
| Cloud Functions | `cloudfunctions.googleapis.com%2Fcloud-functions` |
| GKE stderr | `stderr` |
| GKE stdout | `stdout` |
