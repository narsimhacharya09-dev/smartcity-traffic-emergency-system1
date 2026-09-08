"""
Real-Time Vehicle Movement Simulation Engine.

Simulates physical motion of dispatched emergency vehicles along city graph routes,
interpolating lat/lng coordinates and updating progress in real time.
"""

from typing import Dict, List, Any
from app.graph.city_graph import CityGraph
from app.emergency.emergency_system import EmergencySystem, EmergencyStatus, EmergencyRequest
from app.signals.signal_engine import SignalEngine


class VehicleSimulator:
    """
    Simulates real-time spatial movement for dispatched emergency vehicles.
    """

    def __init__(self, graph: CityGraph, emergency_system: EmergencySystem, signal_engine: SignalEngine):
        self.graph = graph
        self.emergency_system = emergency_system
        self.signal_engine = signal_engine
        self.is_running: bool = True
        self.simulation_speed_multiplier: float = 5.0  # Speed up for demonstration

    def step(self, delta_time_sec: float = 1.0) -> List[Dict[str, Any]]:
        """
        Advances position of all active in-transit emergency vehicles.
        Returns list of updated vehicle states with lat/lng coordinates.
        """
        if not self.is_running:
            return []

        active_vehicles = self.emergency_system.get_active_emergencies()
        updates = []

        for emg in active_vehicles:
            if emg.status != EmergencyStatus.IN_TRANSIT or not emg.route or len(emg.route) < 2:
                continue

            # Ensure green corridor along active emergency route
            self.signal_engine.activate_green_corridor(emg.route)

            # Check dynamic rerouting if severe traffic appeared
            rerouted, _ = self.emergency_system.reroute_emergency_if_needed(emg.id)
            if rerouted:
                self.signal_engine.activate_green_corridor(emg.route)

            # Advance vehicle progress along route nodes
            # Each step advances progress based on delta_time and average speed (60 km/h)
            speed_kmh = 70.0  # Emergency vehicle speed
            distance_traveled_km = (speed_kmh / 3600.0) * delta_time_sec * self.simulation_speed_multiplier

            # Estimate node-to-node movement
            total_route_distance = max(0.1, emg.total_distance)
            progress_delta = distance_traveled_km / total_route_distance
            emg.progress = min(1.0, emg.progress + progress_delta)

            # Calculate current node index based on progress
            route_len = len(emg.route)
            target_index = int(emg.progress * (route_len - 1))
            target_index = min(target_index, route_len - 1)

            current_node_id = emg.route[target_index]
            emg.current_location = current_node_id

            # Compute interpolated lat/lng for map display
            curr_node = self.graph.nodes.get(current_node_id)
            next_node_id = emg.route[min(target_index + 1, route_len - 1)]
            next_node = self.graph.nodes.get(next_node_id)

            lat = curr_node.lat if curr_node else 0.0
            lng = curr_node.lng if curr_node else 0.0

            if curr_node and next_node and current_node_id != next_node_id:
                # Segment sub-progress
                segment_progress = (emg.progress * (route_len - 1)) - target_index
                lat = curr_node.lat + (next_node.lat - curr_node.lat) * segment_progress
                lng = curr_node.lng + (next_node.lng - curr_node.lng) * segment_progress

            # If vehicle reached destination (progress >= 1.0)
            if emg.progress >= 1.0 or current_node_id == emg.destination:
                self.emergency_system.complete_emergency(emg.id)
                self.signal_engine.deactivate_green_corridor(emg.route)

            vehicle_state = emg.to_dict()
            vehicle_state["lat"] = round(lat, 6)
            vehicle_state["lng"] = round(lng, 6)
            updates.append(vehicle_state)

        return updates
