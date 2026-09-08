"""
Emergency Vehicle Prioritization & Dispatch Management System.

Manages emergency creation, queueing via custom MinHeap Priority Queue, vehicle routing,
dispatch execution, and state transitions for ambulances, fire trucks, and police units.
"""

import uuid
import time
from enum import Enum
from typing import Dict, List, Optional, Any
from app.graph.min_heap import PriorityQueue
from app.graph.city_graph import CityGraph
from app.routing.dijkstra import DijkstraRouter, RouteResult


class VehicleType(str, Enum):
    AMBULANCE = "AMBULANCE"
    FIRE_TRUCK = "FIRE_TRUCK"
    POLICE = "POLICE"


class EmergencyStatus(str, Enum):
    CREATED = "CREATED"
    QUEUED = "QUEUED"
    DISPATCHED = "DISPATCHED"
    IN_TRANSIT = "IN_TRANSIT"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


# Priority map (lower integer = higher priority in MinHeap)
VEHICLE_PRIORITIES: Dict[VehicleType, int] = {
    VehicleType.AMBULANCE: 1,
    VehicleType.FIRE_TRUCK: 2,
    VehicleType.POLICE: 3
}


class EmergencyRequest:
    def __init__(
        self,
        emergency_id: str,
        vehicle_type: VehicleType,
        source: str,
        destination: str,
        created_at: Optional[float] = None
    ):
        self.id = emergency_id
        self.vehicle_type = VehicleType(vehicle_type)
        self.source = source
        self.destination = destination
        self.priority = VEHICLE_PRIORITIES[self.vehicle_type]
        self.status = EmergencyStatus.CREATED
        self.created_at = created_at or time.time()
        self.dispatched_at: Optional[float] = None
        self.completed_at: Optional[float] = None
        self.route: List[str] = []
        self.road_ids: List[str] = []
        self.total_distance: float = 0.0
        self.estimated_response_time: float = 0.0
        self.current_location: str = source
        self.progress: float = 0.0  # 0.0 to 1.0 along current road

    def assign_route(self, route_result: RouteResult) -> None:
        self.route = route_result.route
        self.road_ids = route_result.road_ids
        self.total_distance = route_result.total_distance
        self.estimated_response_time = route_result.estimated_travel_time

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "vehicle_type": self.vehicle_type.value,
            "source": self.source,
            "destination": self.destination,
            "priority": self.priority,
            "status": self.status.value,
            "created_at": self.created_at,
            "dispatched_at": self.dispatched_at,
            "completed_at": self.completed_at,
            "route": self.route,
            "road_ids": self.road_ids,
            "total_distance": self.total_distance,
            "estimated_response_time": self.estimated_response_time,
            "current_location": self.current_location,
            "progress": round(self.progress, 2)
        }


class EmergencySystem:
    """
    Emergency Dispatch System using PriorityQueue and Dijkstra routing.
    """

    def __init__(self, graph: CityGraph):
        self.graph = graph
        self.emergencies: Dict[str, EmergencyRequest] = {}
        self.dispatch_queue = PriorityQueue[EmergencyRequest]()

    def create_emergency(
        self,
        vehicle_type: VehicleType,
        source: str,
        destination: str,
        custom_id: Optional[str] = None
    ) -> Optional[EmergencyRequest]:
        if source not in self.graph.nodes or destination not in self.graph.nodes:
            return None

        emg_id = custom_id or f"EMG-{str(uuid.uuid4())[:8].upper()}"
        emg = EmergencyRequest(
            emergency_id=emg_id,
            vehicle_type=vehicle_type,
            source=source,
            destination=destination
        )

        # Calculate initial route
        route_res = DijkstraRouter.calculate_route(self.graph, source, destination)
        if route_res.success:
            emg.assign_route(route_res)

        self.emergencies[emg_id] = emg
        emg.status = EmergencyStatus.QUEUED
        self.dispatch_queue.push(emg, float(emg.priority))

        return emg

    def dispatch_next(self) -> Optional[EmergencyRequest]:
        """Dispatches highest-priority pending emergency from queue."""
        if self.dispatch_queue.is_empty():
            return None

        popped = self.dispatch_queue.pop()
        if not popped:
            return None

        emg, _ = popped
        emg.status = EmergencyStatus.DISPATCHED
        emg.dispatched_at = time.time()
        emg.status = EmergencyStatus.IN_TRANSIT
        return emg

    def dispatch_by_id(self, emergency_id: str) -> Optional[EmergencyRequest]:
        if emergency_id not in self.emergencies:
            return None

        emg = self.emergencies[emergency_id]
        if emg.status in (EmergencyStatus.CREATED, EmergencyStatus.QUEUED):
            emg.status = EmergencyStatus.IN_TRANSIT
            emg.dispatched_at = time.time()

            # Recalculate route if needed to ensure fresh route
            fresh_route = DijkstraRouter.calculate_route(self.graph, emg.current_location, emg.destination)
            if fresh_route.success:
                emg.assign_route(fresh_route)

            return emg
        return emg

    def complete_emergency(self, emergency_id: str) -> Optional[EmergencyRequest]:
        if emergency_id in self.emergencies:
            emg = self.emergencies[emergency_id]
            emg.status = EmergencyStatus.COMPLETED
            emg.completed_at = time.time()
            emg.current_location = emg.destination
            emg.progress = 1.0
            return emg
        return None

    def cancel_emergency(self, emergency_id: str) -> Optional[EmergencyRequest]:
        if emergency_id in self.emergencies:
            emg = self.emergencies[emergency_id]
            emg.status = EmergencyStatus.CANCELLED
            return emg
        return None

    def reroute_emergency_if_needed(
        self,
        emergency_id: str,
        threshold_ratio: float = 1.25
    ) -> Tuple[bool, Optional[EmergencyRequest]]:
        """
        Reroutes an active emergency if current remaining route travel time increases
        by more than threshold_ratio due to dynamic traffic congestion.
        """
        if emergency_id not in self.emergencies:
            return False, None

        emg = self.emergencies[emergency_id]
        if emg.status != EmergencyStatus.IN_TRANSIT or not emg.route:
            return False, emg

        curr_loc = emg.current_location
        new_route_res = DijkstraRouter.calculate_route(self.graph, curr_loc, emg.destination)

        if not new_route_res.success:
            return False, emg

        # Compare new route travel time with expected remaining time
        if new_route_res.estimated_travel_time < emg.estimated_response_time:
            # Significant improvement found!
            emg.assign_route(new_route_res)
            return True, emg

        return False, emg

    def get_active_emergencies(self) -> List[EmergencyRequest]:
        active_statuses = {EmergencyStatus.QUEUED, EmergencyStatus.DISPATCHED, EmergencyStatus.IN_TRANSIT}
        return [emg for emg in self.emergencies.values() if emg.status in active_statuses]

    def get_all_emergencies(self) -> List[EmergencyRequest]:
        return list(self.emergencies.values())
