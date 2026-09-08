"""
Route Cache Module for SmartCity Routing Engine.

Provides fast O(1) lookups for calculated shortest path routes indexed by (source, destination, traffic_version).
Tracks cache statistics (hits, misses, hit rate) and automatically ignores stale entries when traffic_version advances.
Designed with clean abstraction so Redis backend can easily replace or wrap in-memory dictionary.
"""

from typing import Dict, Tuple, Optional, Any
import copy
from app.routing.dijkstra import RouteResult


class RouteCache:
    """
    In-Memory Cache for calculated routes indexed by source, destination, and traffic version.
    """

    def __init__(self):
        self._cache: Dict[Tuple[str, str, int], RouteResult] = {}
        self.hits: int = 0
        self.misses: int = 0

    def _make_key(self, source: str, destination: str, traffic_version: int) -> Tuple[str, str, int]:
        return (source, destination, traffic_version)

    def get(self, source: str, destination: str, traffic_version: int) -> Optional[RouteResult]:
        key = self._make_key(source, destination, traffic_version)
        if key in self._cache:
            self.hits += 1
            res = copy.deepcopy(self._cache[key])
            res.from_cache = True
            return res

        self.misses += 1
        return None

    def set(self, source: str, destination: str, traffic_version: int, route_result: RouteResult) -> None:
        if not route_result.success:
            return
        key = self._make_key(source, destination, traffic_version)
        # Store deepcopy to protect cache immutability
        cached_copy = copy.deepcopy(route_result)
        cached_copy.from_cache = True
        self._cache[key] = cached_copy

    def invalidate_old_versions(self, current_traffic_version: int) -> int:
        """Removes entries whose traffic_version is older than current_traffic_version."""
        keys_to_remove = [k for k in self._cache.keys() if k[2] < current_traffic_version]
        for k in keys_to_remove:
            del self._cache[k]
        return len(keys_to_remove)

    def clear(self) -> None:
        self._cache.clear()
        self.hits = 0
        self.misses = 0

    def get_stats(self) -> Dict[str, Any]:
        total_requests = self.hits + self.misses
        hit_rate = (self.hits / total_requests * 100.0) if total_requests > 0 else 0.0
        return {
            "hits": self.hits,
            "misses": self.misses,
            "total_requests": total_requests,
            "hit_rate_percentage": round(hit_rate, 2),
            "cached_entries_count": len(self._cache)
        }
