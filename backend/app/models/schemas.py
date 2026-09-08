"""
Pydantic API Request/Response Schemas.
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from app.graph.city_graph import TrafficLevel, RoadStatus, NodeType
from app.emergency.emergency_system import VehicleType


class NodeSchema(BaseModel):
    id: str
    name: str
    type: NodeType
    lat: float
    lng: float
    metadata: Optional[Dict[str, Any]] = None


class RoadSchema(BaseModel):
    id: str
    source: str
    destination: str
    distance: float
    speed_limit: float = 50.0
    traffic_level: TrafficLevel = TrafficLevel.LOW
    status: RoadStatus = RoadStatus.OPEN
    name: Optional[str] = None
    base_travel_time: Optional[float] = None
    current_travel_time: Optional[float] = None


class TrafficUpdateRequest(BaseModel):
    road_id: str
    traffic_level: Optional[TrafficLevel] = None
    status: Optional[RoadStatus] = None


class RouteCalculateRequest(BaseModel):
    source: str
    destination: str
    use_cache: bool = True
    include_alternatives: bool = False
    use_ml_prediction: bool = False


class EmergencyCreateRequest(BaseModel):
    vehicle_type: VehicleType
    source: str
    destination: str
    custom_id: Optional[str] = None


class MLPredictionRequest(BaseModel):
    hour_of_day: int = Field(8, ge=0, le=23)
    day_of_week: int = Field(1, ge=0, le=6)
    vehicle_count: int = Field(1200, ge=0)
    road_capacity: int = Field(1500, gt=0)
    weather: str = Field("CLEAR")
