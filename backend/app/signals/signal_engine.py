"""
Smart Traffic Signals & Green Corridor Management Engine.

Simulates intersection signals (RED, YELLOW, GREEN) and triggers Green Corridors
to clear traffic along active emergency vehicle dispatch routes.
"""

import time
from enum import Enum
from typing import Dict, List, Optional, Any
from app.graph.city_graph import CityGraph, NodeType


class SignalState(str, Enum):
    RED = "RED"
    YELLOW = "YELLOW"
    GREEN = "GREEN"


class TrafficSignal:
    def __init__(self, node_id: str, cycle_length_sec: int = 60):
        self.node_id = node_id
        self.state = SignalState.GREEN
        self.is_emergency_priority = False
        self.cycle_length_sec = cycle_length_sec
        self.last_state_change = time.time()

    def update_cycle(self) -> None:
        """Simulates automatic state cycle if not overridden by emergency priority."""
        if self.is_emergency_priority:
            return

        now = time.time()
        elapsed = (now - self.last_state_change) % self.cycle_length_sec

        if elapsed < 25:
            self.state = SignalState.GREEN
        elif elapsed < 30:
            self.state = SignalState.YELLOW
        else:
            self.state = SignalState.RED

    def set_green_corridor(self, enable: bool = True) -> None:
        self.is_emergency_priority = enable
        if enable:
            self.state = SignalState.GREEN
        else:
            self.last_state_change = time.time()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "node_id": self.node_id,
            "state": self.state.value,
            "is_emergency_priority": self.is_emergency_priority
        }


class SignalEngine:
    """
    Manages all intersection traffic signals in the CityGraph.
    """

    def __init__(self, graph: CityGraph):
        self.graph = graph
        self.signals: Dict[str, TrafficSignal] = {}
        self.initialize_signals()

    def initialize_signals(self) -> None:
        for node in self.graph.nodes.values():
            # Create signals at intersections and key locations
            if node.type in [NodeType.INTERSECTION, NodeType.COMMERCIAL, NodeType.ACCIDENT_PRONE]:
                self.signals[node.id] = TrafficSignal(node.id)

    def update_all_signals(self) -> None:
        for signal in self.signals.values():
            signal.update_cycle()

    def activate_green_corridor(self, route_node_ids: List[str]) -> None:
        """Sets signals along an emergency route to GREEN priority."""
        for node_id in route_node_ids:
            if node_id in self.signals:
                self.signals[node_id].set_green_corridor(True)

    def deactivate_green_corridor(self, route_node_ids: List[str]) -> None:
        """Restores normal signal cycle after emergency vehicle clears."""
        for node_id in route_node_ids:
            if node_id in self.signals:
                self.signals[node_id].set_green_corridor(False)

    def get_all_signals(self) -> List[Dict[str, Any]]:
        self.update_all_signals()
        return [signal.to_dict() for signal in self.signals.values()]
