"""
Dijkstra's Shortest Path Algorithm & Alternative Route Generator.

Uses the custom MinHeap Priority Queue to compute optimal paths through the CityGraph.
Time Complexity: O((V + E) log V)
Space Complexity: O(V + E)
"""

import time
from typing import Dict, List, Optional, Tuple, Any
from app.graph.city_graph import CityGraph, RoadStatus
from app.graph.min_heap import MinHeap


class RouteResult:
    def __init__(
        self,
        route: List[str],
        road_ids: List[str],
        total_distance: float,
        estimated_travel_time: float,
        visited_nodes_count: int,
        calculation_time_ms: float,
        success: bool = True,
        message: str = "Route calculated successfully",
        from_cache: bool = False
    ):
        self.route = route
        self.road_ids = road_ids
        self.total_distance = round(total_distance, 2)
        self.estimated_travel_time = round(estimated_travel_time, 2)
        self.visited_nodes_count = visited_nodes_count
        self.calculation_time_ms = round(calculation_time_ms, 3)
        self.success = success
        self.message = message
        self.from_cache = from_cache

    def to_dict(self) -> Dict[str, Any]:
        return {
            "route": self.route,
            "road_ids": self.road_ids,
            "total_distance": self.total_distance,
            "estimated_travel_time": self.estimated_travel_time,
            "visited_nodes_count": self.visited_nodes_count,
            "calculation_time_ms": self.calculation_time_ms,
            "success": self.success,
            "message": self.message,
            "from_cache": self.from_cache
        }


class DijkstraRouter:
    """
    Dijkstra Shortest Path Router with custom MinHeap priority queue.
    Supports finding shortest time routes and alternative fallback routes.
    """

    @staticmethod
    def calculate_route(
        graph: CityGraph,
        source: str,
        destination: str,
        penalized_roads: Optional[Dict[str, float]] = None
    ) -> RouteResult:
        """
        Calculates the shortest travel-time path between source and destination.
        
        Args:
            graph: The CityGraph instance.
            source: Source node ID.
            destination: Destination node ID.
            penalized_roads: Optional dictionary mapping road IDs to penalty multiplier (for alternative routing).
        """
        start_time = time.perf_counter()

        if source not in graph.nodes:
            return RouteResult([], [], 0.0, 0.0, 0, 0.0, success=False, message=f"Source node '{source}' not found")
        if destination not in graph.nodes:
            return RouteResult([], [], 0.0, 0.0, 0, 0.0, success=False, message=f"Destination node '{destination}' not found")

        if source == destination:
            elapsed = (time.perf_counter() - start_time) * 1000.0
            return RouteResult([source], [], 0.0, 0.0, 1, elapsed, success=True, message="Source and destination are identical")

        # Distance table: maps node_id -> float travel time in minutes
        distances: Dict[str, float] = {node_id: float('inf') for node_id in graph.nodes}
        distances[source] = 0.0

        # Predecessor mapping: maps node_id -> (previous_node_id, road_id, edge_distance)
        predecessors: Dict[str, Tuple[Optional[str], Optional[str], float]] = {
            node_id: (None, None, 0.0) for node_id in graph.nodes
        }

        min_heap = MinHeap[str]()
        min_heap.insert(source, 0.0)

        visited = set()

        while not min_heap.is_empty():
            extracted = min_heap.extract_min()
            if extracted is None:
                break
            current_node, current_dist = extracted

            if current_node in visited:
                continue
            visited.add(current_node)

            if current_node == destination:
                break

            for road in graph.get_neighbors(current_node):
                if road.status != RoadStatus.OPEN:
                    continue  # Skip closed/under-repair roads

                neighbor = road.destination
                if neighbor in visited:
                    continue

                travel_time = road.current_travel_time
                if travel_time == float('inf'):
                    continue

                # Apply edge penalty if computing alternative routes
                if penalized_roads and road.id in penalized_roads:
                    travel_time *= penalized_roads[road.id]

                new_dist = current_dist + travel_time

                if new_dist < distances[neighbor]:
                    distances[neighbor] = new_dist
                    predecessors[neighbor] = (current_node, road.id, road.distance)
                    if min_heap.contains(neighbor):
                        min_heap.decrease_key(neighbor, new_dist)
                    else:
                        min_heap.insert(neighbor, new_dist)

        elapsed_ms = (time.perf_counter() - start_time) * 1000.0

        # Reconstruct path
        if distances[destination] == float('inf'):
            return RouteResult([], [], 0.0, 0.0, len(visited), elapsed_ms, success=False, message=f"No open route found from '{source}' to '{destination}'")

        path = []
        road_path = []
        total_km = 0.0
        curr = destination

        while curr is not None:
            path.append(curr)
            prev, road_id, dist = predecessors[curr]
            if prev is not None:
                if road_id:
                    road_path.append(road_id)
                total_km += dist
            curr = prev

        path.reverse()
        road_path.reverse()

        return RouteResult(
            route=path,
            road_ids=road_path,
            total_distance=total_km,
            estimated_travel_time=distances[destination],
            visited_nodes_count=len(visited),
            calculation_time_ms=elapsed_ms,
            success=True
        )

    @classmethod
    def get_alternative_routes(
        cls,
        graph: CityGraph,
        source: str,
        destination: str,
        k: int = 2
    ) -> List[RouteResult]:
        """
        Generates up to k distinct alternative routes by penalizing edges of previously calculated paths.
        """
        primary_route = cls.calculate_route(graph, source, destination)
        if not primary_route.success:
            return [primary_route]

        routes = [primary_route]
        penalized_roads: Dict[str, float] = {}

        for _ in range(1, k):
            # Penalize all roads used in the last route by a 2.5x penalty factor
            last_route = routes[-1]
            for road_id in last_route.road_ids:
                penalized_roads[road_id] = penalized_roads.get(road_id, 1.0) * 2.5

            alt_route = cls.calculate_route(graph, source, destination, penalized_roads)
            
            # Add alternative route if it found a path and differs from existing routes
            if alt_route.success and alt_route.route not in [r.route for r in routes]:
                routes.append(alt_route)
            else:
                break

        return routes
