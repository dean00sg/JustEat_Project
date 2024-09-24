from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = 'postgresql://postgres:123456@localhost:5432/JustEat_db'
    SECRET_KEY: str = "254fg4r845FESF5A87wewa5rg51h5s4djckylhwsfzfZdsgfzc"

    class Config:
        env_file = ".env" 

settings = Settings()
