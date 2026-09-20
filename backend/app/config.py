from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DB_HOST: str = "localhost"
    DB_PORT: str = "3306"
    DB_USER: str = "root"
    DB_PASSWORD: str = ""
    DB_NAME: str = "tailorpos"
    
    JWT_SECRET: str = "change_this_secret"
    JWT_EXPIRE_MINUTES: int = 1440
    PORT: int = 8000

    class Config:
        env_file = ".env"

settings = Settings()

