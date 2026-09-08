import React, { useState } from 'react';
import { Sliders, Dices, Trash2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function TrafficControl({ roads, onUpdateTraffic, onRandomize, onClearCache }) {
  const [selectedRoad, setSelectedRoad] = useState('');
  const [trafficLevel, setTrafficLevel] = useState('HIGH');
  const [status, setStatus] = useState('OPEN');

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!selectedRoad) return;
    onUpdateTraffic(selectedRoad, trafficLevel, status);
  };

  return (
    <div className="glass-panel p-5 rounded-xl border border-slate-700 shadow-xl flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold text-slate-100">Dynamic Traffic & Road Control</h2>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="space-y-4 mb-6">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Select Target Road Segment</label>
          <select
            value={selectedRoad}
            onChange={(e) => setSelectedRoad(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            required
          >
            <option value="">Select Road...</option>
            {roads.map((road) => (
              <option key={road.id} value={road.id}>
                {road.name || road.id} ({road.source} ➔ {road.destination}) [{road.traffic_level}]
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Congestion Level</label>
            <select
              value={trafficLevel}
              onChange={(e) => setTrafficLevel(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="LOW">LOW (1.0x Base)</option>
              <option value="MEDIUM">MEDIUM (1.3x Base)</option>
              <option value="HIGH">HIGH (1.8x Base)</option>
              <option value="SEVERE">SEVERE (2.5x Base)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Road Operational Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="OPEN">OPEN</option>
              <option value="CLOSED">CLOSED (Blocked)</option>
              <option value="UNDER_REPAIR">UNDER REPAIR</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all"
        >
          <AlertTriangle className="w-4 h-4" />
          Apply Traffic & Status Update
        </button>
      </form>

      <div className="pt-4 border-t border-slate-700 space-y-2 mt-auto">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Simulation Tools</h3>

        <button
          onClick={onRandomize}
          className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all"
        >
          <Dices className="w-4 h-4 text-purple-400" />
          Inject Random Traffic Fluctuations
        </button>

        <button
          onClick={onClearCache}
          className="w-full py-2 px-3 bg-slate-800 hover:bg-rose-950/60 border border-rose-800/60 text-rose-300 hover:text-rose-200 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all"
        >
          <Trash2 className="w-4 h-4 text-rose-400" />
          Flush Route Cache Memory
        </button>
      </div>
    </div>
  );
}
