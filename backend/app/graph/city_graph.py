"""
City Graph Engine - Weighted Graph Representation of Urban Road Networks.

Provides nodes (Intersections, Hospitals, Stations, Locations) and weighted edges (Roads)
using an Adjacency List representation. Supports dynamic road traffic adjustments, closures,
and edge weight recalculations.
"""

from typing import Dict, List, Optional, Any
from enum import Enum


class NodeType(str, Enum):
    INTERSECTION = "INTERSECTION"
    HOSPITAL = "HOSPITAL"
    FIRE_STATION = "FIRE_STATION"
    POLICE_STATION = "POLICE_STATION"
    RESIDENTIAL = "RESIDENTIAL"
    COMMERCIAL = "COMMERCIAL"
    ACCIDENT_PRONE = "ACCIDENT_PRONE"


class RoadStatus(str, Enum):
    OPEN = "OPEN"
    CLOSED = "CLOSED"
    UNDER_REPAIR = "UNDER_REPAIR"


class TrafficLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    SEVERE = "SEVERE"


# Traffic multipliers for travel time computation
TRAFFIC_MULTIPLIERS: Dict[TrafficLevel, float] = {
    TrafficLevel.LOW: 1.0,
    TrafficLevel.MEDIUM: 1.3,
    TrafficLevel.HIGH: 1.8,
    TrafficLevel.SEVERE: 2.5
}


class Node:
    def __init__(
        self,
        node_id: str,
        name: str,
        node_type: NodeType = NodeType.INTERSECTION,
        lat: float = 0.0,
        lng: float = 0.0,
        metadata: Optional[Dict[str, Any]] = None
    ):
        self.id = node_id
        self.name = name
        self.type = NodeType(node_type)
        self.lat = lat
        self.lng = lng
        self.metadata = metadata or {}

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "type": self.type.value,
            "lat": self.lat,
            "lng": self.lng,
            "metadata": self.metadata
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Node':
        return cls(
            node_id=data["id"],
            name=data["name"],
            node_type=NodeType(data.get("type", NodeType.INTERSECTION)),
            lat=data.get("lat", 0.0),
            lng=data.get("lng", 0.0),
            metadata=data.get("metadata", {})
        )

    def __repr__(self):
        return f"Node(id='{self.id}', name='{self.name}', type='{self.type.value}')"


class Road:
    def __init__(
        self,
        road_id: str,
        source: str,
        destination: str,
        distance: float,  # in km
        speed_limit: float = 50.0,  # in km/h
        traffic_level: TrafficLevel = TrafficLevel.LOW,
        status: RoadStatus = RoadStatus.OPEN,
        name: Optional[str] = None
    ):
        self.id = road_id
        self.source = source
        self.destination = destination
        self.distance = distance
        self.speed_limit = speed_limit
        self.traffic_level = TrafficLevel(traffic_level)
        self.status = RoadStatus(status)
        self.name = name or f"Road {source}->{destination}"

    @property
    def base_travel_time(self) -> float:
        """Base travel time in minutes without traffic slowdown."""
        if self.speed_limit <= 0:
            return float('inf')
        return (self.distance / self.speed_limit) * 60.0

    @property
    def current_travel_time(self) -> float:
        """Effective travel time in minutes accounting for traffic and closures."""
        if self.status != RoadStatus.OPEN:
            return float('inf')
        multiplier = TRAFFIC_MULTIPLIERS.get(self.traffic_level, 1.0)
        return self.base_travel_time * multiplier

    def update_traffic(self, new_level: TrafficLevel) -> None:
        self.traffic_level = TrafficLevel(new_level)

    def update_status(self, new_status: RoadStatus) -> None:
        self.status = RoadStatus(new_status)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "source": self.source,
            "destination": self.destination,
            "distance": self.distance,
            "speed_limit": self.speed_limit,
            "traffic_level": self.traffic_level.value,
            "status": self.status.value,
            "name": self.name,
            "base_travel_time": round(self.base_travel_time, 2),
            "current_travel_time": round(self.current_travel_time, 2) if self.status == RoadStatus.OPEN else None
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Road':
        return cls(
            road_id=data["id"],
            source=data["source"],
            destination=data["destination"],
            distance=float(data["distance"]),
            speed_limit=float(data.get("speed_limit", 50.0)),
            traffic_level=TrafficLevel(data.get("traffic_level", TrafficLevel.LOW)),
            status=RoadStatus(data.get("status", RoadStatus.OPEN)),
            name=data.get("name")
        )

    def __repr__(self):
        return f"Road(id='{self.id}', {self.source}->{self.destination}, dist={self.distance}km, traffic={self.traffic_level.value})"


class CityGraph:
    """
    Weighted Directed/Bidirectional City Graph built with Adjacency Lists.
    """

    def __init__(self):
        self.nodes: Dict[str, Node] = {}
        self.roads: Dict[str, Road] = {}
        self.adjacency_list: Dict[str, List[Road]] = {}

    def add_node(self, node: Node) -> None:
        self.nodes[node.id] = node
        if node.id not in self.adjacency_list:
            self.adjacency_list[node.id] = []

    def remove_node(self, node_id: str) -> None:
        if node_id in self.nodes:
            del self.nodes[node_id]
        if node_id in self.adjacency_list:
            del self.adjacency_list[node_id]

        # Remove connected roads
        roads_to_remove = [r_id for r_id, road in self.roads.items()
                           if road.source == node_id or road.destination == node_id]
        for r_id in roads_to_remove:
            self.remove_road(r_id)

    def add_road(self, road: Road, bidirectional: bool = True) -> None:
        # Ensure source and destination nodes exist or are registered
        if road.source not in self.adjacency_list:
            self.adjacency_list[road.source] = []
        if road.destination not in self.adjacency_list:
            self.adjacency_list[road.destination] = []

        self.roads[road.id] = road
        self.adjacency_list[road.source].append(road)

        if bidirectional:
            reverse_id = f"{road.id}_rev"
            reverse_road = Road(
                road_id=reverse_id,
                source=road.destination,
                destination=road.source,
                distance=road.distance,
                speed_limit=road.speed_limit,
                traffic_level=road.traffic_level,
                status=road.status,
                name=f"{road.name} (Rev)"
            )
            self.roads[reverse_id] = reverse_road
            self.adjacency_list[road.destination].append(reverse_road)

    def remove_road(self, road_id: str) -> None:
        if road_id in self.roads:
            road = self.roads[road_id]
            del self.roads[road_id]
            if road.source in self.adjacency_list:
                self.adjacency_list[road.source] = [r for r in self.adjacency_list[road.source] if r.id != road_id]

    def update_road_traffic(self, road_id: str, traffic_level: TrafficLevel) -> None:
        if road_id in self.roads:
            self.roads[road_id].update_traffic(traffic_level)
            # If there's a reverse road, sync its traffic level
            reverse_id = f"{road_id}_rev" if not road_id.endswith("_rev") else road_id[:-4]
            if reverse_id in self.roads:
                self.roads[reverse_id].update_traffic(traffic_level)

    def update_road_status(self, road_id: str, status: RoadStatus) -> None:
        if road_id in self.roads:
            self.roads[road_id].update_status(status)
            reverse_id = f"{road_id}_rev" if not road_id.endswith("_rev") else road_id[:-4]
            if reverse_id in self.roads:
                self.roads[reverse_id].update_status(status)

    def get_neighbors(self, node_id: str) -> List[Road]:
        return self.adjacency_list.get(node_id, [])

    def get_road(self, source: str, destination: str) -> Optional[Road]:
        for road in self.adjacency_list.get(source, []):
            if road.destination == destination:
                return road
        return None

    def get_road_by_id(self, road_id: str) -> Optional[Road]:
        return self.roads.get(road_id)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "nodes": [node.to_dict() for node in self.nodes.values()],
            "roads": [road.to_dict() for road in self.roads.values() if not road.id.endswith("_rev")]
        }

    def clear(self) -> None:
        self.nodes.clear()
        self.roads.clear()
        self.adjacency_list.clear()
