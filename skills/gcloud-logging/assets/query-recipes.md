# Query Recipes — Google Cloud Logging

Ready-to-use filter templates. Copy, replace placeholders (`PROJECT_ID`, `SERVICE`, etc.), and pass to `gcloud logging read '...' --project PROJECT_ID --format=json`.

---

## Cloud Run (service)

### All logs for a service (last hour)

```logql
resource.type="cloud_run_revision"
resource.labels.service_name="SERVICE"
resource.labels.location="REGION"
timestamp>="YYYY-MM-DDTHH:MM:SSZ"
```

### Errors only

```logql
resource.type="cloud_run_revision"
resource.labels.service_name="SERVICE"
severity>=ERROR
```

### Request logs (HTTP)

```logql
resource.type="cloud_run_revision"
resource.labels.service_name="SERVICE"
logName="projects/PROJECT_ID/logs/run.googleapis.com%2Frequests"
```

### Slow requests (status 5xx)

```logql
resource.type="cloud_run_revision"
resource.labels.service_name="SERVICE"
httpRequest.status>=500
```

### Match structured log field (regex)

```logql
resource.type="cloud_run_revision"
resource.labels.service_name="SERVICE"
jsonPayload.message=~"timeout|connection refused"
```

### Text search (SEARCH — fast, case-insensitive)

```logql
resource.type="cloud_run_revision"
resource.labels.service_name="SERVICE"
SEARCH("OutOfMemory")
```

### Exact phrase search

```logql
resource.type="cloud_run_revision"
resource.labels.service_name="SERVICE"
SEARCH("`connection reset by peer`")
```

### Specific revision

```logql
resource.type="cloud_run_revision"
resource.labels.service_name="SERVICE"
resource.labels.revision_name="SERVICE-00042-abc"
```

---

## Cloud Run (job)

### Job execution logs

```logql
resource.type="cloud_run_job"
resource.labels.job_name="JOB_NAME"
resource.labels.location="REGION"
```

### Errors in a job

```logql
resource.type="cloud_run_job"
resource.labels.job_name="JOB_NAME"
severity>=ERROR
```

---

## Firebase Functions (1st gen)

### All logs for a function

```logql
resource.type="cloud_function"
resource.labels.function_name="FUNCTION_NAME"
resource.labels.region="REGION"
```

### Errors only

```logql
resource.type="cloud_function"
resource.labels.function_name="FUNCTION_NAME"
resource.labels.region="REGION"
severity>=ERROR
```

### Match message field

```logql
resource.type="cloud_function"
resource.labels.function_name="FUNCTION_NAME"
jsonPayload.message=~"LoggerMiddleware"
```

### Time-windowed (deterministic)

```logql
resource.type="cloud_function"
resource.labels.function_name="FUNCTION_NAME"
resource.labels.region="REGION"
timestamp>="2026-02-26T15:00:00Z"
timestamp<="2026-02-26T16:00:00Z"
```

---

## GKE

### Container logs

```logql
resource.type="k8s_container"
resource.labels.cluster_name="CLUSTER"
resource.labels.namespace_name="NAMESPACE"
resource.labels.container_name="CONTAINER"
```

### Pod errors

```logql
resource.type="k8s_container"
resource.labels.cluster_name="CLUSTER"
resource.labels.namespace_name="NAMESPACE"
severity>=ERROR
```

### Node-level logs

```logql
resource.type="k8s_node"
resource.labels.cluster_name="CLUSTER"
resource.labels.node_name="NODE"
```

---

## Compute Engine

### Instance logs

```logql
resource.type="gce_instance"
resource.labels.instance_id="INSTANCE_ID"
resource.labels.zone="ZONE"
```

### Errors excluding noise

```logql
resource.type="gce_instance"
severity>=ERROR
NOT textPayload:"health_check"
```

---

## Audit Logs

### Admin activity

```logql
log_id("cloudaudit.googleapis.com/activity")
severity>=NOTICE
```

### Data access for a specific service

```logql
log_id("cloudaudit.googleapis.com/data_access")
resource.type="cloud_run_revision"
resource.labels.service_name="SERVICE"
```

---

## Cross-cutting patterns

### OR with parentheses (required syntax)

```logql
resource.type="cloud_run_revision"
(severity="ERROR" OR severity="CRITICAL")
resource.labels.service_name="SERVICE"
```

### Exclude specific log names

```logql
resource.type="cloud_run_revision"
resource.labels.service_name="SERVICE"
-logName="projects/PROJECT_ID/logs/run.googleapis.com%2Frequests"
```

### Trace correlation

```logql
trace="projects/PROJECT_ID/traces/TRACE_ID"
```

### IP subnet filter

```logql
resource.type="cloud_run_revision"
ip_in_net(httpRequest.remoteIp, "10.0.0.0/8")
```

### Sample 1% of entries (deterministic)

```logql
resource.type="cloud_run_revision"
resource.labels.service_name="SERVICE"
sample(insertId, 0.01)
```

### Extract numeric field for comparison

```logql
resource.type="cloud_run_revision"
CAST(REGEXP_EXTRACT(jsonPayload.latency, "([0-9.]+)"), FLOAT64) > 5.0
```
