# 🚦 SmartCity Traffic & Emergency Response System

Portfolio-quality, full-stack educational Smart City application built from first principles. Simulates real-time urban traffic dynamics, prioritizes emergency vehicle dispatching (Ambulances, Fire Trucks, Police Units), creates dynamic signal Green Corridors, and optimizes routing using custom Data Structures & Algorithms (**Weighted Graph**, **Min-Heap**, **Priority Queue**, **Dijkstra Shortest Path**), **Route Caching**, **Machine Learning**, **FastAPI**, **MongoDB**, and an interactive **React + Leaflet Dashboard**.

---

## 🌟 Key Features

- **🌐 Weighted City Graph Engine**: Built using an Adjacency List supporting dynamic traffic multipliers, speed limits, road closures, and real-time travel time adjustments.
- **⚡ Custom Min-Heap & Priority Queue**: Zero-dependency Python Min-Heap providing $O(\log N)$ priority operations for Dijkstra routing and Emergency Vehicle dispatching.
- **🚨 Emergency Priority System**: Prioritizes dispatches based on unit urgency (`AMBULANCE` P1 > `FIRE_TRUCK` P2 > `POLICE` P3).
- **🟢 Smart Signals & Green Corridors**: Automatically overrides traffic light cycles along active emergency transit paths to clear intersections.
- **🚀 Versioned Route Cache**: Implements fast $O(1)$ route lookups indexed by `(source, destination, traffic_version)`. Automatically invalidates stale cached paths when traffic conditions change.
- **🧠 AI/ML Traffic Predictor**: Trains scikit-learn `RandomForestRegressor` models on historical rush hour, capacity, and weather features to dynamically adjust Dijkstra edge weights.
- **📡 Real-Time WebSockets Telemetry**: Streams moving emergency vehicle lat/lng coordinates and signal states live to connected clients.
- **🛡️ Resilient Database Architecture**: Connects to MongoDB with an automatic in-memory fallback repository, guaranteeing zero crashes if MongoDB is unavailable.
- **🗺️ Interactive React Dashboard**: Built with Vite, Leaflet GIS maps, custom icons, live vehicle tracking, traffic polyline overlays, Recharts analytics, and an automated 10-Step Demo Runner.

---

## 🏗️ System Architecture

```
                          ┌──────────────────────────────────────────┐
                          │         React Dashboard (Vite)           │
                          │  - Interactive Leaflet GIS Map           │
                          │  - Emergency Control Panel & Signals     │
                          │  - Recharts Analytics & Demo Runner      │
                          └───────────────────┬──────────────────────┘
                                              │ HTTP / WebSockets
                                              ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                FastAPI Backend Service                                 │
│                                                                                        │
│  ┌───────────────────────┐   ┌───────────────────────┐   ┌──────────────────────────┐ │
│  │   City Graph Engine   │   │ Min-Heap & Dijkstra   │   │ Dynamic Traffic Engine   │ │
│  │   (Adjacency List)    │   │ (Shortest & Alt Path) │   │ (Speed & Level Multi)    │ │
│  └───────────┬───────────┘   └───────────┬───────────┘   └───────────┬──────────────┘ │
│              │                           │                           │                │
│              ▼                           ▼                           ▼                │
│  ┌───────────────────────┐   ┌───────────────────────┐   ┌──────────────────────────┐ │
│  │ Emergency System & PQ │   │ Smart Signals Engine  │   │  Route Cache & Analytics │ │
│  │ (Ambulance/Fire/Police│   │ (Green Corridors)     │   │ (Invalidation & Stats)   │ │
│  └───────────┬───────────┘   └───────────┬───────────┘   └───────────┬──────────────┘ │
│              │                           │                           │                │
│              └───────────────────────────┼───────────────────────────┘                │
│                                          ▼                                            │
│                              ┌───────────────────────┐                                │
│                              │   AI/ML Traffic Mod   │                                │
│                              │ (scikit-learn Predict)│                                │
│                              └───────────┬───────────┘                                │
└──────────────────────────────────────────┼────────────────────────────────────────────┘
                                           │
                                 ┌─────────┴─────────┐
                                 ▼                   ▼
                     ┌───────────────────────┐ ┌───────────────┐
                     │   MongoDB Database    │ │ In-Memory     │
                     │  (Motor / PyMongo)    │ │ Fallback Repo │
                     └───────────────────────┘ └───────────────┘
```

---

## 🧮 Algorithms & Complexity

| Algorithm / Component | Implementation | Time Complexity | Space Complexity |
| :--- | :--- | :--- | :--- |
| **City Graph** | Adjacency List (`Dict[str, List[Road]]`) | $O(V + E)$ | $O(V + E)$ |
| **Min-Heap** | Binary Array with Hash Map Position Lookup | $O(\log N)$ Insert/Extract | $O(N)$ |
| **Dijkstra Routing** | Shortest Path with Min-Heap | $O((V + E) \log V)$ | $O(V + E)$ |
| **Emergency Priority Queue** | Priority Queue over Min-Heap | $O(\log N)$ Push/Pop | $O(N)$ |
| **Route Cache** | Hash Key `(src, dst, version)` | $O(1)$ Lookup / Store | $O(K)$ |

---

## 📁 Repository Structure

```
.
├── backend/
│   ├── app/
│   │   ├── api/            # FastAPI REST & WebSocket routers
│   │   ├── graph/          # CityGraph, Node, Road & MinHeap implementation
│   │   ├── routing/        # Dijkstra algorithm & Alternative path generator
│   │   ├── emergency/      # Priority Emergency Dispatch System
│   │   ├── traffic/        # Dynamic Traffic & Road Control Engine
│   │   ├── cache/          # Versioned Route Cache with stats
│   │   ├── signals/        # Smart Traffic Light Signals & Green Corridors
│   │   ├── simulation/     # Vehicle position motion simulator
│   │   ├── analytics/      # Analytics Engine
│   │   ├── database/       # MongoDB Motor connector & In-Memory fallback
│   │   └── models/         # Pydantic schemas
│   ├── tests/              # Pytest test suite
│   ├── requirements.txt
│   └── main.py             # Server entrypoint
├── frontend/
│   ├── src/
│   │   ├── components/     # Navbar, DashboardCards, EmergencyPanel, RouteCalculator, TrafficControl, AnalyticsPanel, DemoPanel
│   │   ├── map/            # CityMap Leaflet GIS component
│   │   └── services/       # REST API & WebSocket client
│   ├── package.json
│   └── vite.config.js
├── ml/
│   ├── datasets/           # Synthetic traffic dataset generator
│   ├── training/           # scikit-learn model training pipeline
│   └── prediction/         # Inference engine wrapper
├── data/
│   └── city/               # Sample city JSON dataset (17 nodes, 25 roads)
├── docs/                   # Full documentation (architecture, algorithms, api, development)
├── docker-compose.yml
├── Dockerfile
├── README.md
└── LICENSE
```

---

## 🚀 Quick Start Instructions

### Option 1: Local Development

#### 1. Backend Setup & Run
```bash
# Navigate to backend
cd backend

# Install Python requirements
pip install -r requirements.txt

# Run FastAPI Server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
Swagger OpenAPI docs will be available at `http://localhost:8000/docs`.

#### 2. Train AI/ML Traffic Model
```bash
python ml/training/train_model.py
```

#### 3. Frontend Setup & Run
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
Open `http://localhost:5173` in your browser.

---

### Option 2: Docker Compose
```bash
docker-compose up --build
```

---

## 🧪 Running Automated Tests

```bash
python -m pytest backend/tests
```

---

## 🎬 Automated 10-Step Demo Scenarios

The interactive dashboard includes a **10-Step Automated Demo Runner**:
1. **Demo 1**: Normal Route Calculation (Metro Hospital ➔ Downtown Plaza)
2. **Demo 2**: Dynamic Traffic Surge (Inject SEVERE traffic on Civic Center Blvd)
3. **Demo 3**: Alternative Route Calculation (Computes faster bypass path)
4. **Demo 4**: Create Ambulance Emergency (Dispatches P1 Ambulance)
5. **Demo 5**: Ambulance Priority Dispatch (MinHeap priority ordering)
6. **Demo 6**: Smart Signal Green Corridor (Overrides signals along route to GREEN)
7. **Demo 7**: Traffic Spike During Journey (Inject mid-transit road closure)
8. **Demo 8**: Dynamic Rerouting (Vehicle reroutes around closed road)
9. **Demo 9**: Route Cache HIT/MISS Demo ($O(1)$ cache lookup & version invalidation)
10. **Demo 10**: Analytics & Intelligence (Renders response time metrics)

---

## 📜 License

MIT License. Free for educational and commercial use.
