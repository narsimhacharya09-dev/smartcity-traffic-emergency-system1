# SmartCity Data Structures & Algorithms (DSA) Specification

## 1. Graph Data Structure & Adjacency List

The urban road network is modeled as a weighted graph $G = (V, E)$, where $V$ is the set of nodes (intersections, stations, hospitals) and $E$ is the set of directed road segments.

### Adjacency List Memory Representation:
```
nodes = {
  "HOSP_METRO": Node(name="Metro General Hospital", type=HOSPITAL, lat=37.77, lng=-122.41),
  "JUNC_CENTRAL": Node(name="Central Square Junction", type=INTERSECTION, lat=37.77, lng=-122.41)
}

adjacency_list = {
  "HOSP_METRO": [ Road(id="RD_1", dest="JUNC_CENTRAL", dist=1.2km, speed=50km/h, traffic=LOW) ],
  "JUNC_CENTRAL": [ Road(id="RD_2", dest="POLICE_HQ", dist=1.5km, speed=50km/h, traffic=MEDIUM) ]
}
```

---

## 2. Min-Heap & Priority Queue

A custom binary Min-Heap implemented over a 0-indexed array with an auxiliary hash map mapping item keys to array position indices.

### Heap Invariant:
$$\text{Priority}(\text{parent}(i)) \le \text{Priority}(i) \quad \forall i > 0$$

- **Parent Index**: $\lfloor \frac{i - 1}{2} \rfloor$
- **Left Child Index**: $2i + 1$
- **Right Child Index**: $2i + 2$

### Time Complexity Guarantees:
| Operation | Time Complexity | Auxiliary Space |
| :--- | :--- | :--- |
| `insert(item, priority)` | $O(\log N)$ | $O(1)$ |
| `extract_min()` | $O(\log N)$ | $O(1)$ |
| `peek()` | $O(1)$ | $O(1)$ |
| `decrease_key(item, new_prio)` | $O(\log N)$ | $O(1)$ lookup via hash map |
| `is_empty()` | $O(1)$ | $O(1)$ |

---

## 3. Dijkstra's Shortest Path Algorithm

Computes the path with minimum total travel time between source $S$ and destination $T$.

```python
def calculate_route(graph, source, destination):
    distances = {node: infinity for node in graph.nodes}
    distances[source] = 0.0
    heap = MinHeap()
    heap.insert(source, 0.0)
    
    while not heap.is_empty():
        curr_node, curr_time = heap.extract_min()
        if curr_node == destination:
            break
            
        for road in graph.get_neighbors(curr_node):
            if road.status != OPEN:
                continue
            new_time = curr_time + road.current_travel_time
            if new_time < distances[road.destination]:
                distances[road.destination] = new_time
                heap.decrease_key_or_insert(road.destination, new_time)
```

### Complexity:
- **Time Complexity**: $O((V + E) \log V)$
- **Space Complexity**: $O(V + E)$

---

## 4. Route Cache Versioned Invalidation

Cache key is formed by tuple `(source, destination, traffic_version)`. When any road's traffic level or status changes, `traffic_version` increments, rendering old cache keys unreachable and enabling $O(1)$ cache hits without returning stale routes.
