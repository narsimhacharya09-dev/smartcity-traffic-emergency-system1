"""
Unit Tests for Custom DSA Modules (MinHeap, PriorityQueue, CityGraph, Dijkstra).
"""

import pytest
from app.graph.min_heap import MinHeap, PriorityQueue
from app.graph.city_graph import CityGraph, Node, Road, NodeType, TrafficLevel, RoadStatus
from app.routing.dijkstra import DijkstraRouter


def test_min_heap_operations():
    heap = MinHeap[str]()
    assert heap.is_empty()
    assert heap.size() == 0

    heap.insert("A", 10.0)
    heap.insert("B", 5.0)
    heap.insert("C", 15.0)
    heap.insert("D", 2.0)

    assert heap.size() == 4
    assert heap.peek() == ("D", 2.0)

    item, prio = heap.extract_min()
    assert item == "D"
    assert prio == 2.0

    heap.decrease_key("C", 1.0)
    item2, prio2 = heap.extract_min()
    assert item2 == "C"
    assert prio2 == 1.0


def test_priority_queue_operations():
    pq = PriorityQueue[str]()
    pq.push("Ambulance", 1.0)
    pq.push("Fire Truck", 2.0)
    pq.push("Police", 3.0)

    assert pq.size() == 3
    item, prio = pq.pop()
    assert item == "Ambulance"
    assert prio == 1.0


def test_city_graph_and_dijkstra_shortest_path():
    graph = CityGraph()
    n1 = Node("A", "Node A", NodeType.HOSPITAL, 37.77, -122.41)
    n2 = Node("B", "Node B", NodeType.INTERSECTION, 37.78, -122.42)
    n3 = Node("C", "Node C", NodeType.RESIDENTIAL, 37.79, -122.43)

    graph.add_node(n1)
    graph.add_node(n2)
    graph.add_node(n3)

    r1 = Road("R1", "A", "B", distance=2.0, speed_limit=60.0, traffic_level=TrafficLevel.LOW)
    r2 = Road("R2", "B", "C", distance=3.0, speed_limit=60.0, traffic_level=TrafficLevel.LOW)
    r3 = Road("R3", "A", "C", distance=10.0, speed_limit=60.0, traffic_level=TrafficLevel.LOW)

    graph.add_road(r1, bidirectional=True)
    graph.add_road(r2, bidirectional=True)
    graph.add_road(r3, bidirectional=True)

    result = DijkstraRouter.calculate_route(graph, "A", "C")
    assert result.success
    assert result.route == ["A", "B", "C"]
    assert result.total_distance == 5.0


def test_dijkstra_closed_road_fallback():
    graph = CityGraph()
    n1 = Node("A", "Node A")
    n2 = Node("B", "Node B")
    n3 = Node("C", "Node C")

    graph.add_node(n1)
    graph.add_node(n2)
    graph.add_node(n3)

    r1 = Road("R1", "A", "B", distance=2.0, status=RoadStatus.CLOSED)
    r2 = Road("R2", "B", "C", distance=2.0, status=RoadStatus.OPEN)
    r3 = Road("R3", "A", "C", distance=10.0, status=RoadStatus.OPEN)

    graph.add_road(r1, bidirectional=True)
    graph.add_road(r2, bidirectional=True)
    graph.add_road(r3, bidirectional=True)

    result = DijkstraRouter.calculate_route(graph, "A", "C")
    assert result.success
    # Must bypass closed road R1 and take direct road R3
    assert result.route == ["A", "C"]
    assert result.total_distance == 10.0


def test_dijkstra_same_source_dest():
    graph = CityGraph()
    n1 = Node("A", "Node A")
    graph.add_node(n1)

    result = DijkstraRouter.calculate_route(graph, "A", "A")
    assert result.success
    assert result.route == ["A"]
    assert result.total_distance == 0.0
