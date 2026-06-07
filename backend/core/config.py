from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DB_HOST: str = "localhost"
    DB_PORT: int = 3306
    DB_NAME: str = "webin"
    DB_USER: str = "root"
    DB_PASSWORD: str = "123456"

    SECRET_KEY: str = "change-this-secret"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440   # 24 hours

    class Config:
        env_file = ".env"
        extra = "ignore"   # silently ignore unknown keys like app_env


settings = Settings()
