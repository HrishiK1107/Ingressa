# Terraform-Based Detection Validation

## 1. Purpose

Ingressa detection logic is not validated solely through unit tests.

It is validated against real AWS infrastructure using Terraform-defined scenarios.

This ensures:

- Detection correctness in live environments
- Reproducible misconfiguration states
- Controlled attack surface simulation
- Confidence in lifecycle reconciliation

Validation mirrors production security platform QA practices.

---

## 2. Why Infrastructure Validation Matters

Unit tests validate logic.
Infrastructure validation validates behavior.

Cloud security detection engines must account for:

- IAM policy parsing edge cases
- Security group rule combinations
- ACL and bucket policy interactions
- Provider-specific behavior
- State drift over time

Terraform scenarios provide deterministic infrastructure states.

---

## 3. Validation Architecture

Terraform scenarios are located under:

```
infra/terraform/scenarios/
```

Each scenario:

- Creates specific misconfiguration
- Isolated to single policy validation
- Deployable in controlled AWS account
- Destroyable after validation

**Workflow:**

1. Deploy Terraform scenario
2. Run Ingressa in AWS mode
3. Validate detection output
4. Modify or destroy misconfiguration
5. Re-run scan
6. Validate lifecycle transition (RESOLVED)

---

## 4. Validated Policies

The following policies were validated against live AWS infrastructure.

### 4.1 Public SSH Exposure (POL-001)

**Terraform provisions:**

- EC2 instance
- Security group allowing `0.0.0.0/0` on port 22

**Expected detection:**

- EC2 flagged as publicly exposed

**Resolution validation:**

- Remove ingress rule
- Re-run scan
- Finding transitions to RESOLVED

---

### 4.2 Public All-Traffic Security Group (POL-004)

**Terraform provisions:**

- Security group allowing all protocols from `0.0.0.0/0`

**Expected detection:**

- High severity network exposure finding

**Resolution validation:**

- Restrict ingress
- Validate lifecycle update

---

### 4.3 Public S3 Bucket (POL-005)

**Terraform provisions:**

- S3 bucket
- Public read policy

**Expected detection:**

- Public read exposure

**Resolution validation:**

- Remove public access
- Confirm RESOLVED transition

---

### 4.4 Public S3 Write ACL (POL-006)

**Terraform provisions:**

- Bucket with write-enabled ACL

**Expected detection:**

- Write exposure finding

**Resolution validation:**

- Remove write permission
- Validate resolution

---

## 5. Lifecycle Validation

Terraform validation also tests drift reconciliation.

**Scenario:**

1. Deploy misconfiguration
2. Run scan → CREATED
3. Re-run scan without change → UPDATED
4. Destroy misconfiguration
5. Run scan → RESOLVED

This confirms:

- No duplicate findings
- Proper idempotency
- Correct state transition logic

---

## 6. Deterministic Mock vs Live Validation

Ingressa supports:

- Mock mode (deterministic CI testing)
- AWS mode (live validation)

**Mock mode ensures:**

- Stable regression testing
- CI reproducibility

**Terraform validation ensures:**

- Real provider behavior correctness
- Configuration interaction accuracy
- Practical attack surface modeling

Both are required for production-grade confidence.

---

## 7. Reproducibility

Terraform scenarios provide:

- Declarative infrastructure
- Version-controlled misconfigurations
- Destroyable environments
- Controlled blast radius

This allows detection behavior to be reproduced across:

- Environments
- Accounts
- Validation cycles

---

## 8. Design Tradeoffs

### Why Not Validate Manually?

Manual validation:

- Is non-reproducible
- Is error-prone
- Cannot scale
- Cannot be version-controlled

Infrastructure-as-Code validation ensures:

- Determinism
- Repeatability
- Auditability

---

## 9. Extensibility

Terraform validation framework allows:

- Expansion of policy coverage
- Multi-account validation
- Cross-region testing
- CI-integrated infrastructure testing
- Automated drift simulation

Future extension may include:

- Automated scenario pipelines
- Multi-cloud scenario support
- Privilege escalation chain validation

---

## 10. Summary

Terraform-backed validation demonstrates:

- Detection correctness in real AWS
- Drift lifecycle reliability
- Controlled attack surface modeling
- Infrastructure-level reproducibility

This transforms Ingressa from a logic prototype into a validated cloud detection engine.
