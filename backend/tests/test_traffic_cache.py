"""
Unit Tests for Traffic Engine, Route Cache, and Emergency System.
"""

import pytest
from app.graph.city_graph import CityGraph, Node, Road, TrafficLevel, RoadStatus
from app.traffic.traffic_engine import TrafficEngine
from app.cache.route_cache import RouteCache
from app.routing.dijkstra import DijkstraRouter, RouteResult
from app.emergency.emergency_system import EmergencySystem, VehicleType


def test_traffic_engine_and_cache_invalidation():
    graph = CityGraph()
    n1 = Node("A", "Node A")
    n2 = Node("B", "Node B")
    graph.add_node(n1)
    graph.add_node(n2)

    r1 = Road("R1", "A", "B", distance=5.0, traffic_level=TrafficLevel.LOW)
    graph.add_road(r1)

    traffic_engine = TrafficEngine(graph)
    cache = RouteCache()

    res1 = DijkstraRouter.calculate_route(graph, "A", "B")
    cache.set("A", "B", traffic_engine.traffic_version, res1)

    cached_res = cache.get("A", "B", traffic_engine.traffic_version)
    assert cached_res is not None
    assert cached_res.from_cache is True
    assert cache.get_stats()["hits"] == 1

    # Update traffic -> advances version
    traffic_engine.update_road_traffic("R1", TrafficLevel.SEVERE)

    # Looking up with new traffic_version must miss
    stale_res = cache.get("A", "B", traffic_engine.traffic_version)
    assert stale_res is None
    assert cache.get_stats()["misses"] == 1


def test_emergency_priority_queue_dispatch():
    graph = CityGraph()
    n1 = Node("HOSP", "Hospital")
    n2 = Node("ACC", "Accident Spot")
    graph.add_node(n1)
    graph.add_node(n2)
    graph.add_road(Road("R1", "HOSP", "ACC", distance=2.0))

    emg_sys = EmergencySystem(graph)

    emg_police = emg_sys.create_emergency(VehicleType.POLICE, "HOSP", "ACC", custom_id="EMG-POLICE")
    emg_amb = emg_sys.create_emergency(VehicleType.AMBULANCE, "HOSP", "ACC", custom_id="EMG-AMB")
    emg_fire = emg_sys.create_emergency(VehicleType.FIRE_TRUCK, "HOSP", "ACC", custom_id="EMG-FIRE")

    # Queue should pop Ambulance first (priority 1), Fire (priority 2), Police (priority 3)
    first = emg_sys.dispatch_next()
    assert first is not None
    assert first.id == "EMG-AMB"

    second = emg_sys.dispatch_next()
    assert second is not None
    assert second.id == "EMG-FIRE"

    third = emg_sys.dispatch_next()
    assert third is not None
    assert third.id == "EMG-POLICE"
