"""
Analytics & System Intelligence Engine.

Aggregates operational metrics, average emergency response times, route calculation benchmarks,
traffic distribution, and cache efficiency metrics for dashboard visualization.
"""

from typing import Dict, Any, List
import time
from app.graph.city_graph import CityGraph, TrafficLevel, RoadStatus
from app.emergency.emergency_system import EmergencySystem, EmergencyStatus, VehicleType
from app.cache.route_cache import RouteCache


class AnalyticsEngine:
    """
    Analytics Aggregator for SmartCity metrics.
    """

    def __init__(self, graph: CityGraph, emergency_system: EmergencySystem, route_cache: RouteCache):
        self.graph = graph
        self.emergency_system = emergency_system
        self.route_cache = route_cache
        self.total_route_calculations: int = 0
        self.total_reroutes: int = 0

    def record_route_calculation(self) -> None:
        self.total_route_calculations += 1

    def record_reroute_event(self) -> None:
        self.total_reroutes += 1

    def get_summary(self) -> Dict[str, Any]:
        all_emg = self.emergency_system.get_all_emergencies()
        completed_emgs = [e for e in all_emg if e.status == EmergencyStatus.COMPLETED]

        # Calculate average response time for completed emergencies
        total_resp_time = sum(e.estimated_response_time for e in completed_emgs)
        avg_response_time = (total_resp_time / len(completed_emgs)) if completed_emgs else 0.0

        # Type distribution
        type_counts = {v.value: 0 for v in VehicleType}
        status_counts = {s.value: 0 for s in EmergencyStatus}

        for e in all_emg:
            type_counts[e.vehicle_type.value] += 1
            status_counts[e.status.value] += 1

        # Traffic distribution & congested roads
        roads = [r for r in self.graph.roads.values() if not r.id.endswith("_rev")]
        traffic_dist = {level.value: 0 for level in TrafficLevel}
        congested_roads = []

        for r in roads:
            traffic_dist[r.traffic_level.value] += 1
            if r.traffic_level in [TrafficLevel.HIGH, TrafficLevel.SEVERE] or r.status != RoadStatus.OPEN:
                congested_roads.append({
                    "id": r.id,
                    "name": r.name,
                    "traffic_level": r.traffic_level.value,
                    "status": r.status.value,
                    "current_travel_time": r.current_travel_time
                })

        cache_stats = self.route_cache.get_stats()

        return {
            "total_emergencies": len(all_emg),
            "completed_emergencies": len(completed_emgs),
            "active_emergencies": len(self.emergency_system.get_active_emergencies()),
            "average_response_time_minutes": round(avg_response_time, 2),
            "emergency_type_distribution": type_counts,
            "emergency_status_distribution": status_counts,
            "total_roads": len(roads),
            "congested_roads_count": len(congested_roads),
            "congested_roads_list": congested_roads,
            "traffic_distribution": traffic_dist,
            "total_route_calculations": self.total_route_calculations,
            "total_rerouting_events": self.total_reroutes,
            "cache_stats": cache_stats
        }
