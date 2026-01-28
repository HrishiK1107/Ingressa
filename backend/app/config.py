from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # DB
    DATABASE_URL: str

    # AWS
    AWS_REGION_DEFAULT: str = "ap-south-1"

    # scan
    SCAN_MODE: str = "mock"  # mock | aws

    # auth
    AWS_AUTH_MODE: str = "keys"  # keys | assume_role

    # keys mode
    AWS_ACCESS_KEY_ID: str | None = None
    AWS_SECRET_ACCESS_KEY: str | None = None
    AWS_SESSION_TOKEN: str | None = None

    # assume role mode
    AWS_ASSUME_ROLE_ARN: str | None = None


settings = Settings()
