"""
Application Configuration Settings.
"""

import os


class Settings:
    PROJECT_NAME: str = "SmartCity Traffic & Emergency Response System"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    MONGODB_DB_NAME: str = os.getenv("MONGODB_DB_NAME", "smartcity_db")
    SAMPLE_CITY_FILE: str = os.getenv("SAMPLE_CITY_FILE", "data/city/sample_city.json")


settings = Settings()
