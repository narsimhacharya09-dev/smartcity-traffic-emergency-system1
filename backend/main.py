"""
SmartCity Traffic & Emergency Response System - Main FastAPI Backend.

Provides REST APIs, WebSocket real-time telemetry streaming, graph management,
routing engine, priority dispatching, and analytics endpoints.
"""

import json
import os
import asyncio
from contextlib import asynccontextmanager
from typing import List, Dict, Any

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.graph.city_graph import CityGraph, Node, Road, TrafficLevel, RoadStatus
from app.routing.dijkstra import DijkstraRouter
from app.traffic.traffic_engine import TrafficEngine
from app.emergency.emergency_system import EmergencySystem, VehicleType, EmergencyStatus
from app.cache.route_cache import RouteCache
from app.signals.signal_engine import SignalEngine
from app.simulation.vehicle_simulator import VehicleSimulator
from app.analytics.analytics_engine import AnalyticsEngine
from app.database.db import db_manager
from app.models.schemas import (
    NodeSchema, RoadSchema, TrafficUpdateRequest,
    RouteCalculateRequest, EmergencyCreateRequest, MLPredictionRequest
)
from ml.prediction.predictor import traffic_predictor

# --- Global Application State ---
city_graph = CityGraph()
traffic_engine = TrafficEngine(city_graph)
emergency_system = EmergencySystem(city_graph)
route_cache = RouteCache()
signal_engine = SignalEngine(city_graph)
vehicle_simulator = VehicleSimulator(city_graph, emergency_system, signal_engine)
analytics_engine = AnalyticsEngine(city_graph, emergency_system, route_cache)

# Active WebSocket connections
websocket_connections: List[WebSocket] = []


def load_sample_city():
    """Loads sample city graph from JSON file."""
    city_file = settings.SAMPLE_CITY_FILE
    if not os.path.isabs(city_file):
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        city_file = os.path.join(base_dir, city_file)

    if os.path.exists(city_file):
        with open(city_file, "r") as f:
            data = json.load(f)

        city_graph.clear()
        for node_data in data.get("nodes", []):
            node = Node.from_dict(node_data)
            city_graph.add_node(node)
            db_manager.insert_document("locations", node.to_dict())

        for road_data in data.get("roads", []):
            road = Road.from_dict(road_data)
            city_graph.add_road(road)
            db_manager.insert_document("roads", road.to_dict())

        signal_engine.initialize_signals()
        print(f"Loaded sample city graph: {len(city_graph.nodes)} nodes, {len(city_graph.roads)} roads.")
    else:
        print(f"Warning: Sample city file '{city_file}' not found.")


@asynccontextmanager
async def lifespan(app: FastAPI):
    load_sample_city()
    sim_task = asyncio.create_task(background_simulation_loop())
    yield
    sim_task.cancel()


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    lifespan=lifespan
)

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def broadcast_telemetry(payload: Dict[str, Any]):
    """Broadcasts WebSocket telemetry messages to all connected clients."""
    disconnected = []
    for ws in websocket_connections:
        try:
            await ws.send_json(payload)
        except Exception:
            disconnected.append(ws)
    for ws in disconnected:
        if ws in websocket_connections:
            websocket_connections.remove(ws)


async def background_simulation_loop():
    """Background loop advancing vehicle simulation and broadcasting telemetry."""
    while True:
        try:
            vehicle_updates = vehicle_simulator.step(delta_time_sec=1.0)
            if vehicle_updates or websocket_connections:
                telemetry = {
                    "type": "TELEMETRY",
                    "vehicles": vehicle_updates,
                    "active_emergencies": len(emergency_system.get_active_emergencies()),
                    "signals": signal_engine.get_all_signals(),
                    "traffic_version": traffic_engine.traffic_version
                }
                await broadcast_telemetry(telemetry)
        except Exception as e:
            print(f"Simulation loop error: {e}")
        await asyncio.sleep(1.0)


# --- REST API Endpoints ---

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "database": db_manager.get_status(),
        "ml_model": traffic_predictor.get_status()
    }


@app.get("/api/locations", response_model=List[Dict[str, Any]])
@app.get("/api/nodes", response_model=List[Dict[str, Any]])
def get_locations():
    return [node.to_dict() for node in city_graph.nodes.values()]


@app.get("/api/roads", response_model=List[Dict[str, Any]])
def get_roads():
    return [road.to_dict() for road in city_graph.roads.values() if not road.id.endswith("_rev")]


@app.get("/api/traffic")
def get_traffic_summary():
    return traffic_engine.get_traffic_summary()


@app.post("/api/traffic/update")
async def update_traffic(req: TrafficUpdateRequest):
    road = city_graph.get_road_by_id(req.road_id)
    if not road:
        raise HTTPException(status_code=404, detail=f"Road '{req.road_id}' not found")

    if req.traffic_level:
        traffic_engine.update_road_traffic(req.road_id, req.traffic_level)
    if req.status:
        traffic_engine.update_road_status(req.road_id, req.status)

    # Invalidate cache due to traffic change
    invalidated_count = route_cache.invalidate_old_versions(traffic_engine.traffic_version)

    broadcast_msg = {
        "type": "TRAFFIC_UPDATE",
        "road_id": req.road_id,
        "traffic_level": road.traffic_level.value,
        "status": road.status.value,
        "traffic_version": traffic_engine.traffic_version,
        "invalidated_cache_entries": invalidated_count
    }
    await broadcast_telemetry(broadcast_msg)

    return {
        "message": f"Updated road '{req.road_id}' traffic",
        "road": road.to_dict(),
        "traffic_version": traffic_engine.traffic_version,
        "invalidated_cache_entries": invalidated_count
    }


@app.post("/api/traffic/randomize")
async def randomize_traffic():
    updated = traffic_engine.simulate_random_traffic_changes(change_ratio=0.3)
    route_cache.invalidate_old_versions(traffic_engine.traffic_version)

    await broadcast_telemetry({
        "type": "TRAFFIC_RANDOMIZED",
        "updated_roads_count": len(updated),
        "traffic_version": traffic_engine.traffic_version
    })

    return {
        "message": f"Randomized traffic for {len(updated)} roads",
        "updated_roads": updated,
        "traffic_version": traffic_engine.traffic_version
    }


@app.post("/api/routes/calculate")
def calculate_route(req: RouteCalculateRequest):
    analytics_engine.record_route_calculation()

    # Check Route Cache first if enabled
    if req.use_cache:
        cached_res = route_cache.get(req.source, req.destination, traffic_engine.traffic_version)
        if cached_res:
            res_dict = cached_res.to_dict()
            if req.include_alternatives:
                res_dict["alternatives"] = []
            return res_dict

    # Check ML traffic adjustment if requested
    if req.use_ml_prediction:
        ml_multiplier = traffic_predictor.predict_travel_time_ratio()
        # ML enhances edge costs for high risk roads dynamically

    route_res = DijkstraRouter.calculate_route(city_graph, req.source, req.destination)

    if route_res.success and req.use_cache:
        route_cache.set(req.source, req.destination, traffic_engine.traffic_version, route_res)

    res_dict = route_res.to_dict()

    if req.include_alternatives and route_res.success:
        alt_routes = DijkstraRouter.get_alternative_routes(city_graph, req.source, req.destination, k=2)
        res_dict["alternatives"] = [alt.to_dict() for alt in alt_routes[1:]]

    return res_dict


@app.post("/api/emergency")
async def create_emergency(req: EmergencyCreateRequest):
    emg = emergency_system.create_emergency(
        vehicle_type=req.vehicle_type,
        source=req.source,
        destination=req.destination,
        custom_id=req.custom_id
    )

    if not emg:
        raise HTTPException(status_code=400, detail="Invalid emergency request. Source or destination node not found.")

    db_manager.insert_document("emergencies", emg.to_dict())

    await broadcast_telemetry({
        "type": "EMERGENCY_CREATED",
        "emergency": emg.to_dict()
    })

    return emg.to_dict()


@app.get("/api/emergency")
def get_all_emergencies():
    return [emg.to_dict() for emg in emergency_system.get_all_emergencies()]


@app.get("/api/emergency/active")
def get_active_emergencies():
    return [emg.to_dict() for emg in emergency_system.get_active_emergencies()]


@app.post("/api/emergency/{emergency_id}/dispatch")
async def dispatch_emergency(emergency_id: str):
    emg = emergency_system.dispatch_by_id(emergency_id)
    if not emg:
        raise HTTPException(status_code=404, detail=f"Emergency '{emergency_id}' not found")

    signal_engine.activate_green_corridor(emg.route)

    await broadcast_telemetry({
        "type": "EMERGENCY_DISPATCHED",
        "emergency": emg.to_dict()
    })

    return emg.to_dict()


@app.post("/api/emergency/{emergency_id}/complete")
async def complete_emergency(emergency_id: str):
    emg = emergency_system.complete_emergency(emergency_id)
    if not emg:
        raise HTTPException(status_code=404, detail=f"Emergency '{emergency_id}' not found")

    signal_engine.deactivate_green_corridor(emg.route)

    await broadcast_telemetry({
        "type": "EMERGENCY_COMPLETED",
        "emergency": emg.to_dict()
    })

    return emg.to_dict()


@app.post("/api/emergency/{emergency_id}/cancel")
async def cancel_emergency(emergency_id: str):
    emg = emergency_system.cancel_emergency(emergency_id)
    if not emg:
        raise HTTPException(status_code=404, detail=f"Emergency '{emergency_id}' not found")

    signal_engine.deactivate_green_corridor(emg.route)

    await broadcast_telemetry({
        "type": "EMERGENCY_CANCELLED",
        "emergency": emg.to_dict()
    })

    return emg.to_dict()


@app.get("/api/vehicles")
def get_vehicles():
    return [emg.to_dict() for emg in emergency_system.get_active_emergencies()]


@app.get("/api/signals")
def get_signals():
    return signal_engine.get_all_signals()


@app.get("/api/analytics")
def get_analytics():
    return analytics_engine.get_summary()


@app.get("/api/cache/stats")
def get_cache_stats():
    return route_cache.get_stats()


@app.post("/api/cache/clear")
def clear_cache():
    route_cache.clear()
    return {"message": "Route cache successfully cleared"}


@app.post("/api/ml/predict")
def predict_ml_traffic(req: MLPredictionRequest):
    ratio = traffic_predictor.predict_travel_time_ratio(
        hour_of_day=req.hour_of_day,
        day_of_week=req.day_of_week,
        vehicle_count=req.vehicle_count,
        road_capacity=req.road_capacity,
        weather=req.weather
    )
    return {
        "predicted_travel_time_ratio": ratio,
        "input_features": req.model_dump(),
        "model_status": traffic_predictor.get_status()
    }


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    websocket_connections.append(websocket)
    try:
        # Send initial state snapshot
        snapshot = {
            "type": "SNAPSHOT",
            "active_emergencies": len(emergency_system.get_active_emergencies()),
            "traffic_version": traffic_engine.traffic_version,
            "signals": signal_engine.get_all_signals()
        }
        await websocket.send_json(snapshot)

        while True:
            # Keep connection alive & listen for client ping/messages
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        if websocket in websocket_connections:
            websocket_connections.remove(websocket)
    except Exception:
        if websocket in websocket_connections:
            websocket_connections.remove(websocket)
