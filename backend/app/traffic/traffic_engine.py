"""
Traffic Simulation & Control Engine.

Manages dynamic road network congestion, random traffic fluctuations, road closures,
and maintains a global traffic version integer to drive cache invalidations.
"""

import random
from typing import Dict, List, Any
from app.graph.city_graph import CityGraph, TrafficLevel, RoadStatus, TRAFFIC_MULTIPLIERS


class TrafficEngine:
    """
    Traffic Control Engine that modifies graph edge travel times and tracks traffic updates.
    """

    def __init__(self, graph: CityGraph):
        self.graph = graph
        self.traffic_version: int = 1

    def update_road_traffic(self, road_id: str, traffic_level: TrafficLevel) -> bool:
        road = self.graph.get_road_by_id(road_id)
        if not road:
            return False

        self.graph.update_road_traffic(road_id, traffic_level)
        self.traffic_version += 1
        return True

    def update_road_status(self, road_id: str, status: RoadStatus) -> bool:
        road = self.graph.get_road_by_id(road_id)
        if not road:
            return False

        self.graph.update_road_status(road_id, status)
        self.traffic_version += 1
        return True

    def simulate_random_traffic_changes(self, change_ratio: float = 0.3) -> List[Dict[str, Any]]:
        """
        Randomly mutates traffic level for a proportion of roads in the city.
        Returns a list of modified road dicts.
        """
        all_roads = [r for r in self.graph.roads.values() if not r.id.endswith("_rev")]
        if not all_roads:
            return []

        count = max(1, int(len(all_roads) * change_ratio))
        roads_to_update = random.sample(all_roads, count)
        levels = list(TrafficLevel)

        updated = []
        for road in roads_to_update:
            new_level = random.choice(levels)
            if new_level != road.traffic_level:
                self.graph.update_road_traffic(road.id, new_level)
                updated.append(road.to_dict())

        if updated:
            self.traffic_version += 1

        return updated

    def get_traffic_summary(self) -> Dict[str, Any]:
        roads = [r for r in self.graph.roads.values() if not r.id.endswith("_rev")]
        total = len(roads)
        counts = {level.value: 0 for level in TrafficLevel}
        closed_count = 0

        for r in roads:
            if r.status != RoadStatus.OPEN:
                closed_count += 1
            counts[r.traffic_level.value] += 1

        congested_count = counts[TrafficLevel.HIGH.value] + counts[TrafficLevel.SEVERE.value]

        return {
            "traffic_version": self.traffic_version,
            "total_roads": total,
            "closed_roads": closed_count,
            "congested_roads": congested_count,
            "traffic_distribution": counts,
            "multipliers": {level.value: mult for level, mult in TRAFFIC_MULTIPLIERS.items()}
        }
