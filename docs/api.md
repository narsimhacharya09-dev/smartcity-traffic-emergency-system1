# SmartCity REST & WebSocket API Documentation

## Base URL
`http://localhost:8000/api`

---

## 1. System Health
### `GET /api/health`
Returns system status, database connection, and ML predictor status.

**Response:**
```json
{
  "status": "healthy",
  "service": "SmartCity Traffic & Emergency Response System",
  "version": "1.0.0",
  "database": {
    "is_connected": false,
    "storage_mode": "In-Memory Fallback Repository"
  },
  "ml_model": {
    "is_loaded": true,
    "model_type": "RandomForestRegressor Pipeline"
  }
}
```

---

## 2. City Network Endpoints

### `GET /api/locations`
Returns all registered city nodes/locations.

### `GET /api/roads`
Returns all road segments with current travel times and congestion ratings.

### `POST /api/traffic/update`
Updates congestion level or status of a road segment.

**Request Body:**
```json
{
  "road_id": "RD_1",
  "traffic_level": "SEVERE",
  "status": "OPEN"
}
```

---

## 3. Shortest Path & Routing

### `POST /api/routes/calculate`
Calculates optimal route using custom Min-Heap Dijkstra algorithm.

**Request Body:**
```json
{
  "source": "HOSP_METRO",
  "destination": "COMM_DOWNTOWN",
  "use_cache": true,
  "include_alternatives": true,
  "use_ml_prediction": false
}
```

---

## 4. Emergency Dispatching

### `POST /api/emergency`
Creates an emergency dispatch request (AMBULANCE, FIRE_TRUCK, POLICE).

### `POST /api/emergency/{id}/dispatch`
Dispatches emergency vehicle along calculated optimal path.

---

## 5. WebSockets Real-Time Telemetry
### `WS /ws`
Establishes WebSocket stream broadcasting vehicle position updates and signal states every second.
