from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    APP_NAME: str = "EchoWall API"
    APP_ENV: str = "development"
    DATABASE_URL: str = "sqlite:///./echowall.db"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
