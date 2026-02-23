# Detection Design

## 1. Philosophy

Ingressa implements detection engineering with the following principles:

1. Detection logic must be isolated from severity logic.
2. Detection must be deterministic.
3. Policies must be modular and registry-driven.
4. Findings must be idempotent across scans.
5. Detection must operate on structured resource models, not raw provider payloads.

The system is intentionally designed to resemble production cloud security detection pipelines.

---

## 2. Policy Architecture

### 2.1 Registry-Driven Model

Policies are registered through a centralized registry.

Responsibilities of the registry:

- Maintain authoritative list of enabled policies
- Provide uniform execution interface
- Prevent implicit policy coupling
- Support future enable/disable control

Policies are not discovered dynamically.
They are explicitly registered.

This prevents accidental execution of experimental logic.

---

### 2.2 Policy Contract

Each policy:

- Accepts normalized graph input
- Evaluates specific misconfiguration conditions
- Emits structured violations
- Does not persist state
- Does not assign severity

Policies are pure detection modules.

Example categories:

- Network exposure
- Storage exposure
- IAM privilege escalation
- Logging visibility gaps

---

## 3. Detection Categories

Ingressa detection policies are organized around practical attack surface classes.

### 3.1 Network Exposure

Focus:
- Public SSH (port 22)
- Public RDP (port 3389)
- All-traffic security groups
- Dangerous open ports

Modeling approach:
- Evaluate Security Group rules
- Correlate with attached EC2 instances
- Confirm public ingress (0.0.0.0/0)

Detection requires relational context, not isolated rule checks.

---

### 3.2 Storage Exposure

Focus:
- Public S3 read
- Public S3 write
- Missing encryption enforcement

Modeling approach:
- Inspect bucket policy
- Inspect ACL configuration
- Evaluate Public Access Block
- Validate encryption settings

---

### 3.3 IAM Privilege Escalation

Focus:
- Admin without MFA
- Wildcard permissions
- Escalation-prone actions
- Stale access keys

Modeling approach:
- Parse attached policies
- Inspect action wildcards
- Evaluate privilege escalation patterns
- Inspect credential age

These checks are not superficial string matches.
They are structured permission evaluations.

---

### 3.4 Logging Blind Spots

Focus:
- CloudTrail disabled

Detection evaluates account-level logging coverage to identify monitoring gaps.

---

## 4. Deterministic Enforcement

### 4.1 Separation of Detection and Scoring

Policies emit violations without severity.

Severity assignment is performed exclusively by the centralized Risk Engine.

This prevents:

- Policy-level severity inflation
- Inconsistent prioritization
- Hard-coded risk classification

All scoring is applied after detection completes.

---

### 4.2 Idempotency Guarantee

Each finding is uniquely identified by:

``` id="9gnqet"
policy_id + resource_id
