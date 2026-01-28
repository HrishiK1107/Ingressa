.PHONY: help up down api api-dev test fmt lint scan-mock scan-aws validate-pol001 validate-all

help:
	@echo "Ingressa Commands:"
	@echo "  make up              - start docker services"
	@echo "  make down            - stop docker services"
	@echo "  make api             - run backend api"
	@echo "  make api-dev         - run backend api with reload"
	@echo "  make test            - run all tests"
	@echo "  make fmt             - format and lint code"
	@echo "  make lint            - lint only"
	@echo "  make scan-mock       - run a mock scan (later)"
	@echo "  make scan-aws        - run a real aws scan (later)"
	@echo "  make validate-pol001 - run terraform validation for pol001 (later)"
	@echo "  make validate-all    - run all terraform validations (later)"

up:
	docker compose up -d

down:
	docker compose down

api:
	cd backend && .\.venv\Scripts\python -m uvicorn app.main:app --host 127.0.0.1 --port 8000

api-dev:
	cd backend && .\.venv\Scripts\python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

test:
	cd backend && .\.venv\Scripts\python -m pytest -q

fmt:
	cd backend && .\.venv\Scripts\python -m ruff check . --fix
	cd backend && .\.venv\Scripts\python -m black .
	cd backend && .\.venv\Scripts\python -m isort .

lint:
	cd backend && .\.venv\Scripts\python -m ruff check .
	cd backend && .\.venv\Scripts\python -m black --check .
	cd backend && .\.venv\Scripts\python -m isort --check-only .

scan-mock:
	@echo "scan-mock will be implemented in Phase B11 (scan runner)"
	@exit 1

scan-aws:
	@echo "scan-aws will be implemented in Phase B11 (scan runner)"
	@exit 1

validate-pol001:
	@echo "validate-pol001 will be implemented in Phase B13 (terraform validation)"
	@exit 1

validate-all:
	@echo "validate-all will be implemented in Phase B13 (terraform validation)"
	@exit 1
