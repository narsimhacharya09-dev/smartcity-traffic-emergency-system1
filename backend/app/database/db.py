"""
Database Resilience Layer with MongoDB Motor client and In-Memory Fallback Repository.

Ensures complete system operational readiness regardless of whether a MongoDB server instance
is running locally or in Docker.
"""

import os
import logging
from typing import Dict, Any, List, Optional

logger = logging.getLogger("smartcity.database")

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "smartcity_db")

# In-Memory Storage collections as graceful fallback
IN_MEMORY_STORE: Dict[str, List[Dict[str, Any]]] = {
    "locations": [],
    "roads": [],
    "traffic": [],
    "emergencies": [],
    "vehicles": [],
    "routes": [],
    "analytics": []
}


class DatabaseManager:
    """
    Database Manager with optional Motor/PyMongo connection and seamless in-memory fallback.
    """

    def __init__(self):
        self.client = None
        self.db = None
        self.is_connected = False
        self._try_connect()

    def _try_connect(self) -> None:
        try:
            import pymongo
            self.client = pymongo.MongoClient(MONGODB_URL, serverSelectionTimeoutMS=1000)
            # Test connection
            self.client.admin.command('ping')
            self.db = self.client[MONGODB_DB_NAME]
            self.is_connected = True
            logger.info("Successfully connected to MongoDB server.")
        except Exception as e:
            self.is_connected = False
            logger.warning(f"MongoDB not available ({str(e)}). Utilizing high-performance in-memory repository fallback.")

    def insert_document(self, collection_name: str, document: Dict[str, Any]) -> bool:
        if self.is_connected and self.db is not None:
            try:
                self.db[collection_name].insert_one(document.copy())
                return True
            except Exception as e:
                logger.error(f"Error inserting into MongoDB collection {collection_name}: {e}")

        # Fallback to in-memory store
        IN_MEMORY_STORE.setdefault(collection_name, []).append(document.copy())
        return True

    def find_documents(self, collection_name: str, query: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        if self.is_connected and self.db is not None:
            try:
                cursor = self.db[collection_name].find(query or {})
                return [dict(doc) for doc in cursor]
            except Exception as e:
                logger.error(f"Error querying MongoDB collection {collection_name}: {e}")

        # Fallback to in-memory store
        docs = IN_MEMORY_STORE.get(collection_name, [])
        if not query:
            return docs

        filtered = []
        for d in docs:
            match = True
            for k, v in query.items():
                if d.get(k) != v:
                    match = False
                    break
            if match:
                filtered.append(d)
        return filtered

    def get_status(self) -> Dict[str, Any]:
        return {
            "is_connected": self.is_connected,
            "mongodb_url": MONGODB_URL,
            "database_name": MONGODB_DB_NAME,
            "storage_mode": "MongoDB Server" if self.is_connected else "In-Memory Fallback Repository"
        }


# Global database instance
db_manager = DatabaseManager()
