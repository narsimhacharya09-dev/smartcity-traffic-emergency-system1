# SmartCity Traffic & Emergency Response System - Architecture Documentation

## System Architecture Overview

The **SmartCity Traffic & Emergency Response System** is designed as an educational, high-performance, full-stack monorepo application. It combines core computer science data structures with real-time web simulation, machine learning, and interactive GIS visualization.

```
                                  ┌──────────────────────────────────────────────┐
                                  │           React Frontend (Vite)              │
                                  │  - Leaflet Map & Custom Layer Renderers      │
                                  │  - Emergency Dispatch & Traffic Controls     │
                                  │  - Recharts System Analytics & Demo Runner   │
                                  └──────────────────────┬───────────────────────┘
                                                         │ HTTP REST / WebSockets
                                                         ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                             FastAPI Backend Service                                            │
│                                                                                                                │
│  ┌─────────────────────────────┐    ┌─────────────────────────────┐    ┌────────────────────────────────────┐  │
│  │      City Graph Engine      │    │  Min-Heap & Priority Queue  │    │       Dynamic Traffic Engine       │  │
│  │ (Weighted Adjacency List)   │    │  (O(log N) Heap Operations) │    │  (Speed & Congestion Multipliers)  │  │
│  └──────────────┬──────────────┘    └──────────────┬──────────────┘    └─────────────────┬──────────────────┘  │
│                 │                                  │                                     │                     │
│                 ▼                                  ▼                                     ▼                     │
│  ┌─────────────────────────────┐    ┌─────────────────────────────┐    ┌────────────────────────────────────┐  │
│  │  Emergency Priority Queue   │    │  Dijkstra Shortest Path     │    │  Versioned Route Cache             │  │
│  │  (Ambulance > Fire > Police)│    │  (Primary & Alternatives)   │    │  (O(1) Lookups & Invalidation)     │  │
│  └──────────────┬──────────────┘    └──────────────┬──────────────┘    └─────────────────┬──────────────────┘  │
│                 │                                  │                                     │                     │
│                 └──────────────────────────────────┼─────────────────────────────────────┘                     │
│                                                    ▼                                                           │
│                                     ┌─────────────────────────────┐                                            │
│                                     │   AI/ML Traffic Predictor   │                                            │
│                                     │ (RandomForest Regressor)    │                                            │
│                                     └──────────────┬──────────────┘                                            │
└────────────────────────────────────────────────────┼───────────────────────────────────────────────────────────┘
                                                     │
                                           ┌─────────┴─────────┐
                                           ▼                   ▼
                               ┌───────────────────────┐ ┌───────────────┐
                               │   MongoDB Database    │ │ In-Memory     │
                               │  (Motor / PyMongo)    │ │ Fallback Repo │
                               └───────────────────────┘ └───────────────┘
```

---

## Core Components

### 1. City Graph Engine (`backend/app/graph/city_graph.py`)
Represents urban intersections, emergency facilities, and commercial/residential sectors as nodes. Edges represent directed road segments with parameters:
- `distance`: Physical length in km
- `speed_limit`: Max speed limit in km/h
- `traffic_level`: Congestion rating (`LOW`, `MEDIUM`, `HIGH`, `SEVERE`)
- `status`: Operational state (`OPEN`, `CLOSED`, `UNDER_REPAIR`)
- `current_travel_time`: Effective travel time computed as:
  $$\text{Current Travel Time} = \left( \frac{\text{Distance}}{\text{Speed Limit}} \times 60 \right) \times \text{Traffic Multiplier}$$

### 2. Min-Heap Priority Queue & Dijkstra Router (`backend/app/graph/min_heap.py` & `backend/app/routing/dijkstra.py`)
Provides zero-dependency heap operations with $O(1)$ position map lookups, driving Dijkstra's shortest travel-time algorithm in $O((V+E)\log V)$ time complexity.

### 3. Emergency Dispatch & Green Corridor Engine (`backend/app/emergency/` & `backend/app/signals/`)
Prioritizes dispatch requests (`AMBULANCE` P1 > `FIRE_TRUCK` P2 > `POLICE` P3). Automatically toggles traffic light signals to `GREEN` along active emergency transit paths.

### 4. Database Resilience (`backend/app/database/db.py`)
Connects to MongoDB if available; seamlessly falls back to an in-memory repository if MongoDB is offline, guaranteeing zero server crashes during demonstrations.

### 5. AI/ML Traffic Prediction (`ml/`)
Uses scikit-learn `RandomForestRegressor` trained on historical rush-hour, capacity, and weather metrics to predict future travel time multipliers and enhance Dijkstra edge weights.
