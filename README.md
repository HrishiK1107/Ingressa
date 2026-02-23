# Ingressa

## Cloud Attack Surface Discovery & Detection Engineering Platform

Ingressa is a cloud security detection engine designed to model cloud attack surface exposure, evaluate AWS misconfigurations, and enforce deterministic detection logic across cloud environments.

It is built with production-structured architecture, CI enforcement, layered separation of concerns, and Terraform-validated policy scenarios.

Ingressa reflects how modern Cloud Security Posture Management (CSPM) and attack surface management platforms are engineered internally.

---

## Badges

![CI](https://github.com/HrishiK1107/Ingressa/actions/workflows/ci.yml/badge.svg)
![Python](https://img.shields.io/badge/python-3.13-blue.svg)
![Postgres](https://img.shields.io/badge/postgres-16--alpine-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

---

# Core Design Principles

Ingressa is built around three engineering priorities:

## 1. Detection Engineering

- Registry-based policy system
- Centralized `PolicyRunner`
- Deterministic evaluation
- Lifecycle state management
- CI-enforced detection correctness
- Drift reconciliation preventing duplicate alerts

Findings are uniquely enforced by:

```

policy_id + resource_id

````

Lifecycle states:

- CREATED
- UPDATED
- RESOLVED

Duplicate alerts are prevented through reconciliation logic inside the scan pipeline.

---

## 2. Cloud Misconfiguration Modeling

Ingressa models real-world AWS security failures across:

- Public EC2 exposure (SSH / RDP)
- Security Groups allowing all traffic
- S3 public read
- S3 public write ACL
- Missing S3 encryption
- IAM admin without MFA
- IAM wildcard policies
- Privilege escalation permissions
- Old IAM access keys
- CloudTrail disabled

Policies are implemented as isolated detection modules, not inline condition checks.

---

## 3. Platform Architecture Design

Ingressa enforces strict layer separation:

- Collector abstraction
- Normalization layer
- Asset graph modeling
- Policy execution engine
- Deterministic risk scoring
- Remediation generation
- Persistence layer
- Drift reconciliation
- Event timeline tracking

This separation mirrors production security platform design.

---

## High-Level Architecture


```mermaid
flowchart LR

    AWS[AWS Accounts]
    RES[EC2 / IAM / S3 / CloudTrail]

    C[AWS Collector]
    MC[Mock Collector]

    N[Normalizer Engine]
    G[Asset Graph Engine]

    PR[Policy Registry]
    RUN[Policy Runner]
    SCORE[Deterministic Risk Engine]
    REM[Remediation Engine]

    DB[(PostgreSQL)]
    DRIFT[Drift Reconciliation]
    EVT[Finding Events Timeline]

    AWS --> RES
    RES --> C
    C --> N
    MC --> N
    N --> G
    G --> RUN
    PR --> RUN
    RUN --> SCORE
    SCORE --> REM
    REM --> DB
    DB --> DRIFT
    DRIFT --> EVT

````

---


---

## Execution Flow

```mermaid
sequenceDiagram

    participant Client
    participant API
    participant ScanRunner
    participant Collector
    participant Modeling
    participant DetectionCore
    participant StateEngine

    Client->>API: Initiate Scan
    API->>ScanRunner: Create Scan Run (RUNNING)

    ScanRunner->>Collector: Collect Inventory
    Collector-->>ScanRunner: Raw Cloud State

    ScanRunner->>Modeling: Normalize + Build Graph
    Modeling-->>ScanRunner: Structured Asset Graph

    ScanRunner->>DetectionCore: Evaluate Policies
    DetectionCore-->>ScanRunner: Violations (Unscored)

    ScanRunner->>DetectionCore: Apply Risk Engine
    DetectionCore-->>ScanRunner: Scored Findings

    ScanRunner->>StateEngine: Persist Findings
    ScanRunner->>StateEngine: Reconcile Drift

    StateEngine-->>ScanRunner: Updated Lifecycle States
    ScanRunner->>API: Mark Scan (SUCCESS)

    API-->>Client: Scan Summary Response
```

---

# Deterministic Risk Scoring

Ingressa uses a centralized `RiskScorer`:

* Policies do not assign severity directly
* Scoring is bucket-based
* Risk breakdown is explainable
* CI validates scoring behavior

This prevents severity inflation and ensures consistent prioritization.

---

# Terraform-Backed Validation

Infrastructure validation scenarios are included under:

```
infra/terraform/scenerios/
```

Validated policies include:

* Public SSH (EC2)
* Public all-traffic Security Group
* Public S3 bucket
* Public S3 write ACL

These scenarios were deployed in controlled AWS environments to validate:

* Detection accuracy
* Drift reconciliation
* Resolution lifecycle correctness

---

# Scan Modes

Ingressa supports two execution modes.

## Mock Mode (Default)

Deterministic local validation using fixture state.

```
SCAN_MODE=mock
```

Used for:

* CI validation
* Local development
* Deterministic testing

---

## AWS Mode (Live Environment)

To enable live AWS scanning, update `.env`:

```
SCAN_MODE=aws
AWS_AUTH_MODE=keys
AWS_REGION_DEFAULT=ap-south-1
AWS_ACCESS_KEY_ID=<your_access_key>
AWS_SECRET_ACCESS_KEY=<your_secret_key>
```

Restart backend after updating environment variables.

AWS credentials are not stored in the repository.
Users must supply their own IAM credentials (read-only recommended).

If credentials are not configured, the system defaults to mock mode.

---

# Screenshots

## Landing Page

<img width="1920" height="936" alt="2026-02-23 12 37 13" src="https://github.com/user-attachments/assets/e5a24242-96df-4e48-aa32-d41d42e71547" />

## Dashboard

<img width="1920" height="936" alt="2026-02-23 12 37 25" src="https://github.com/user-attachments/assets/79ec190e-92b6-48da-a7c9-7fc2d52176c7" />


## Findings Page

<img width="1920" height="936" alt="image" src="https://github.com/user-attachments/assets/8e3f751c-2641-49a5-911b-7d6bb4e78c94" />


## Finding Drawer 

<img width="1920" height="936" alt="2026-02-23 12 38 24" src="https://github.com/user-attachments/assets/4b476d02-f7c1-4d13-a630-fdd42d059c9f" />

<img width="1920" height="936" alt="2026-02-17 19 42 37" src="https://github.com/user-attachments/assets/eb7f82b7-7a21-453d-bdad-44fb364ac3f9" />


## Assets Page

<img width="1920" height="936" alt="2026-02-23 12 39 03" src="https://github.com/user-attachments/assets/85a16572-f8c6-4186-aacd-c9cdfb579cac" />


## Asset Drawer

<img width="1920" height="936" alt="2026-02-23 12 38 51" src="https://github.com/user-attachments/assets/f0852ba1-1722-4641-98fe-f813dcc791b7" />


## Scans Page

<img width="1920" height="936" alt="2026-02-23 12 39 28" src="https://github.com/user-attachments/assets/e978baf4-47a5-4fbf-b21d-d914dc097cb9" />


## Scan Execution Drawer

<img width="1920" height="936" alt="2026-02-23 12 39 34" src="https://github.com/user-attachments/assets/e9f0cd65-3e07-427d-897f-d21f1269ce93" />

---

# Technology Stack

## Backend

* Python 3.13 (CI enforced)
* FastAPI
* SQLAlchemy
* PostgreSQL 16 (alpine)
* Alembic migrations
* Pytest
* Ruff / Black / isort
* Docker

## Frontend

* Vite
* React
* TypeScript
* TailwindCSS
* Structured console layout

## Infrastructure

* Docker Compose
* Terraform (validation scenarios)

---

# Running Locally

## Clone Repository

```
git clone https://github.com/HrishiK1107/Ingressa.git
cd Ingressa
```

## Start Services

```
docker-compose up --build
```
Frontend:
http://localhost:5173

Backend:
http://localhost:8000/docs


---

# Running Tests

From the backend directory:

```
pytest
```

CI enforces:

* Policy correctness
* Risk scoring determinism
* Graph modeling integrity
* Scan runner lifecycle validation
* Mock collector behavior

---

# Environment Configuration

`.env` (Docker runtime)

```
DATABASE_URL=postgresql+psycopg://postgres:postgres@db:5432/ingressa
SCAN_MODE=mock
AWS_REGION_DEFAULT=ap-south-1
AWS_AUTH_MODE=keys

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

`.env.example`

```
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/ingressa
AWS_REGION_DEFAULT=ap-south-1
SCAN_MODE=mock
AWS_AUTH_MODE=keys

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_SESSION_TOKEN=
AWS_ASSUME_ROLE_ARN=
```

---

# Engineering Decisions

* Centralized risk scoring to prevent severity drift.
* Registry-driven policies for scalability.
* Drift reconciliation to reduce alert fatigue.
* Mock deterministic mode to guarantee CI stability.
* Terraform-backed validation to verify detection accuracy in live AWS environments.

---

# How This Maps to Real CSPM Platforms

Ingressa models the internal structure of modern cloud security platforms:

* Layered collection → normalization → evaluation
* Policy abstraction
* Graph-based modeling
* Lifecycle tracking
* Deterministic prioritization
* Infrastructure validation

It demonstrates practical detection engineering and architectural design rather than UI-driven prototypes.

---

# License

MIT

---

# Summary

Ingressa is a structured cloud security detection engine that demonstrates:

* Detection engineering discipline
* Cloud misconfiguration modeling
* Platform architecture design
* CI-enforced correctness
* Terraform-validated AWS scenarios

This project reflects production-aligned cloud security engineering practices.

```
Ingressa
├── backend
│ ├── alembic
│ │ ├── env.py
│ │ ├── script.py.mako
│ │ └── versions
│ │ └── 45f883d34191_initial_schema.py
│ ├── app
│ │ ├── ai
│ │ │ ├── advisor.py
│ │ │ ├── prompts.py
│ │ │ ├── schemas.py
│ │ │ └── init.py
│ │ ├── api
│ │ │ ├── deps.py
│ │ │ └── routes
│ │ │ ├── advisor.py
│ │ │ ├── ai.py
│ │ │ ├── assets.py
│ │ │ ├── findings.py
│ │ │ ├── finding_events.py
│ │ │ ├── health.py
│ │ │ ├── reports.py
│ │ │ └── scans.py
│ │ ├── collectors
│ │ │ ├── aws_collector.py
│ │ │ ├── aws_session.py
│ │ │ ├── base.py
│ │ │ ├── mock_aws_collector.py
│ │ │ └── types.py
│ │ ├── core
│ │ │ ├── constants.py
│ │ │ └── logging.py
│ │ ├── db
│ │ │ ├── base.py
│ │ │ ├── init_db.py
│ │ │ ├── models.py
│ │ │ ├── session.py
│ │ │ └── init.py
│ │ ├── engine
│ │ │ ├── asset_mapper.py
│ │ │ ├── graph.py
│ │ │ ├── persist.py
│ │ │ ├── policy_runner.py
│ │ │ ├── remediation.py
│ │ │ ├── scan_runner.py
│ │ │ ├── scoring.py
│ │ │ └── types.py
│ │ ├── normalizer
│ │ │ ├── base.py
│ │ │ ├── mock_aws_normalizer.py
│ │ │ └── types.py
│ │ ├── policies
│ │ │ ├── base.py
│ │ │ ├── default_registry.py
│ │ │ ├── registry.py
│ │ │ ├── pol001_ec2_public_ssh.py
│ │ │ ├── pol002_ec2_public_rdp.py
│ │ │ ├── pol003_dangerous_ports.py
│ │ │ ├── pol004_sg_all_traffic_public.py
│ │ │ ├── pol005_s3_public_read.py
│ │ │ ├── pol006_s3_public_write.py
│ │ │ ├── pol007_s3_encryption_pab.py
│ │ │ ├── pol008_admin_no_mfa.py
│ │ │ ├── pol009_old_access_keys.py
│ │ │ ├── pol010_wildcard_policies.py
│ │ │ ├── pol011_priv_esc_perms.py
│ │ │ └── pol012_cloudtrail_disabled.py
│ │ ├── schemas
│ │ │ ├── assets.py
│ │ │ ├── common.py
│ │ │ ├── findings.py
│ │ │ ├── finding_events.py
│ │ │ └── scans.py
│ │ ├── storage
│ │ │ ├── asset_store.py
│ │ │ ├── finding_store.py
│ │ │ └── scan_store.py
│ │ ├── config.py
│ │ └── main.py
│ ├── tests
│ │ ├── fixtures
│ │ │ └── aws
│ │ │ ├── mock_state.json
│ │ │ └── normalized_snapshot.json
│ │ ├── test_asset_graph.py
│ │ ├── test_asset_mapper.py
│ │ ├── test_aws_session_factory.py
│ │ ├── test_graph_helpers.py
│ │ ├── test_health.py
│ │ ├── test_mock_collector.py
│ │ ├── test_mock_normalizer.py
│ │ ├── test_policies_iam.py
│ │ ├── test_policies_logging.py
│ │ ├── test_policies_mock.py
│ │ ├── test_policies_network.py
│ │ ├── test_policies_storage.py
│ │ ├── test_policy_runner.py
│ │ ├── test_risk_scoring.py
│ │ └── test_scan_runner.py
│ ├── Dockerfile
│ ├── pyproject.toml
│ ├── pytest.ini
│ ├── requirements.txt
│ └── requirements-lock.txt
├── frontend
│ ├── public
│ ├── src
│ │ ├── api
│ │ ├── components
│ │ │ ├── common
│ │ │ └── layout
│ │ ├── hooks
│ │ ├── pages
│ │ ├── router
│ │ └── styles
│ ├── Dockerfile
│ ├── package.json
│ ├── tailwind.config.js
│ └── vite.config.ts
├── infra
│ └── terraform
│ ├── provider.tf
│ ├── variables.tf
│ ├── outputs.tf
│ └── scenarios
│ ├── pol_001_public_ssh
│ ├── pol_004_all_traffic_sg
│ ├── pol_005_public_s3
│ └── pol_006_s3_public_write_acl
├── docker-compose.yml
├── Makefile
├── CONTRIBUTING.md
├── LICENSE
└── README.md

```
