import os
import psycopg2
from dotenv import load_dotenv

# load config/.env
load_dotenv(dotenv_path=os.path.join("config", ".env"))

def get_db_conn():
    host = os.getenv("DB_HOST", "localhost")
    # Use SSL for cloud, disable for local
    sslmode = "disable" if host in ("localhost", "127.0.0.1") else "require"

    return psycopg2.connect(
        host=host,
        port=os.getenv("DB_PORT", "5432"),
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASS"),
        sslmode=sslmode,
        connect_timeout=5
    )
