import os
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

class Settings:
    """
    This class holds all the configuration and secret keys for our app.
    It reads them securely from the .env file.
    """
    # Get the Meta API Key
    META_API_KEY: str = os.getenv("META_API_KEY", "")
    
    # Get the Meta API Base URL
    META_API_URL: str = os.getenv("META_API_URL", "https://api.meta.ai/v1")

# Create a settings object that we can import in other files
settings = Settings()