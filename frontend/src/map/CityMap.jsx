import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from 'react-leaflet';
import L from 'leaflet';

// Fix default Leaflet icon paths in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icon Creator
function createCustomIcon(color, symbol) {
  return L.divIcon({
    className: 'custom-map-icon',
    html: `<div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px; shadow: 0 4px 6px -1px rgba(0,0,0,0.5);">${symbol}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14]
  });
}

const nodeIcons = {
  HOSPITAL: createCustomIcon('#ef4444', '🏥'),
  FIRE_STATION: createCustomIcon('#f97316', '🚒'),
  POLICE_STATION: createCustomIcon('#3b82f6', '🚓'),
  INTERSECTION: createCustomIcon('#64748b', '🚦'),
  RESIDENTIAL: createCustomIcon('#10b981', '🏡'),
  COMMERCIAL: createCustomIcon('#8b5cf6', '🏢'),
  ACCIDENT_PRONE: createCustomIcon('#dc2626', '⚠️')
};

const vehicleIcons = {
  AMBULANCE: createCustomIcon('#ef4444', '🚑'),
  FIRE_TRUCK: createCustomIcon('#f97316', '🚒'),
  POLICE: createCustomIcon('#3b82f6', '🚓')
};

const trafficColors = {
  LOW: '#22c55e',
  MEDIUM: '#eab308',
  HIGH: '#f97316',
  SEVERE: '#ef4444'
};

export default function CityMap({ locations, roads, activeRoute, alternativeRoutes, vehicles, signals, onSelectNode }) {
  // Center map around city coordinates (default San Francisco sample coords)
  const center = [37.7720, -122.4150];

  // Map nodes to lookup dictionary
  const nodeMap = React.useMemo(() => {
    const map = {};
    locations.forEach(loc => { map[loc.id] = loc; });
    return map;
  }, [locations]);

  // Convert active route node IDs to lat/lng coordinates
  const activeRouteCoords = React.useMemo(() => {
    if (!activeRoute || !activeRoute.route) return [];
    return activeRoute.route
      .map(nodeId => nodeMap[nodeId])
      .filter(Boolean)
      .map(node => [node.lat, node.lng]);
  }, [activeRoute, nodeMap]);

  return (
    <div className="w-full h-full min-h-[500px] relative rounded-xl overflow-hidden shadow-2xl border border-slate-700">
      <MapContainer center={center} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* Render Road Network Polylines */}
        {roads.map(road => {
          const src = nodeMap[road.source];
          const dst = nodeMap[road.destination];
          if (!src || !dst) return null;

          const isClosed = road.status !== 'OPEN';
          const color = isClosed ? '#475569' : (trafficColors[road.traffic_level] || '#22c55e');

          return (
            <Polyline
              key={road.id}
              positions={[[src.lat, src.lng], [dst.lat, dst.lng]]}
              pathOptions={{
                color: color,
                weight: isClosed ? 3 : (road.traffic_level === 'SEVERE' ? 7 : 5),
                opacity: isClosed ? 0.4 : 0.85,
                dashArray: isClosed ? '6, 8' : undefined
              }}
            >
              <Popup>
                <div className="text-slate-800 text-sm">
                  <div className="font-bold text-base">{road.name || road.id}</div>
                  <div>Distance: <span className="font-semibold">{road.distance} km</span></div>
                  <div>Speed Limit: <span className="font-semibold">{road.speed_limit} km/h</span></div>
                  <div>Traffic: <span className="font-bold uppercase" style={{ color }}>{road.traffic_level}</span></div>
                  <div>Status: <span className="font-semibold">{road.status}</span></div>
                  <div>Travel Time: <span className="font-semibold">{road.current_travel_time || 'N/A'} mins</span></div>
                </div>
              </Popup>
            </Polyline>
          );
        })}

        {/* Render Alternative Routes */}
        {alternativeRoutes && alternativeRoutes.map((alt, idx) => {
          const altCoords = alt.route.map(id => nodeMap[id]).filter(Boolean).map(n => [n.lat, n.lng]);
          return (
            <Polyline
              key={`alt-${idx}`}
              positions={altCoords}
              pathOptions={{ color: '#a855f7', weight: 4, opacity: 0.7, dashArray: '8, 8' }}
            />
          );
        })}

        {/* Render Active Emergency Route Polyline */}
        {activeRouteCoords.length > 1 && (
          <Polyline
            positions={activeRouteCoords}
            pathOptions={{ color: '#06b6d4', weight: 8, opacity: 0.9 }}
          />
        )}

        {/* Render City Locations/Nodes */}
        {locations.map(node => (
          <Marker
            key={node.id}
            position={[node.lat, node.lng]}
            icon={nodeIcons[node.type] || nodeIcons.INTERSECTION}
            eventHandlers={{ click: () => onSelectNode && onSelectNode(node) }}
          >
            <Popup>
              <div className="text-slate-800 text-sm">
                <div className="font-bold text-base">{node.name}</div>
                <div className="text-xs text-slate-500 font-mono">ID: {node.id}</div>
                <div className="mt-1 inline-block px-2 py-0.5 rounded text-xs font-semibold bg-slate-200 text-slate-700">
                  {node.type}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Render Traffic Signal Indicators */}
        {signals && signals.map(sig => {
          const node = nodeMap[sig.node_id];
          if (!node) return null;

          const sigColor = sig.state === 'GREEN' ? '#22c55e' : (sig.state === 'YELLOW' ? '#eab308' : '#ef4444');
          return (
            <CircleMarker
              key={`sig-${sig.node_id}`}
              center={[node.lat + 0.0008, node.lng + 0.0008]}
              radius={sig.is_emergency_priority ? 7 : 5}
              pathOptions={{
                fillColor: sigColor,
                fillOpacity: 1,
                color: sig.is_emergency_priority ? '#06b6d4' : '#ffffff',
                weight: sig.is_emergency_priority ? 3 : 1
              }}
            />
          );
        })}

        {/* Render Moving Emergency Vehicles */}
        {vehicles && vehicles.map(v => {
          if (!v.lat || !v.lng) return null;
          return (
            <Marker
              key={`veh-${v.id}`}
              position={[v.lat, v.lng]}
              icon={vehicleIcons[v.vehicle_type] || vehicleIcons.AMBULANCE}
            >
              <Popup>
                <div className="text-slate-800 text-sm">
                  <div className="font-bold text-red-600">🚨 DISPATCHED EMERGENCY VEHICLE</div>
                  <div>ID: <span className="font-mono">{v.id}</span></div>
                  <div>Type: <span className="font-semibold">{v.vehicle_type}</span></div>
                  <div>Priority: <span className="font-bold text-red-600">P{v.priority}</span></div>
                  <div>Progress: <span className="font-semibold">{Math.round(v.progress * 100)}%</span></div>
                  <div>Target: <span className="font-semibold">{v.destination}</span></div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
