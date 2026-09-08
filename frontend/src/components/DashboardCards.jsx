import React from 'react';
import { Navigation, Siren, AlertTriangle, Clock, Zap } from 'lucide-react';

export default function DashboardCards({ analytics, cacheStats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <div className="glass-panel p-4 rounded-xl flex items-center gap-4 border border-slate-700 shadow-md">
        <div className="p-3 bg-blue-500/20 text-blue-400 rounded-lg">
          <Navigation className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">City Network</p>
          <p className="text-2xl font-bold text-slate-100">{analytics?.total_roads || 0} <span className="text-xs text-slate-400 font-normal">roads</span></p>
        </div>
      </div>

      <div className="glass-panel p-4 rounded-xl flex items-center gap-4 border border-slate-700 shadow-md">
        <div className="p-3 bg-red-500/20 text-red-400 rounded-lg">
          <Siren className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Active Emergencies</p>
          <p className="text-2xl font-bold text-red-400">{analytics?.active_emergencies || 0}</p>
        </div>
      </div>

      <div className="glass-panel p-4 rounded-xl flex items-center gap-4 border border-slate-700 shadow-md">
        <div className="p-3 bg-amber-500/20 text-amber-400 rounded-lg">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Congested Roads</p>
          <p className="text-2xl font-bold text-amber-400">{analytics?.congested_roads_count || 0}</p>
        </div>
      </div>

      <div className="glass-panel p-4 rounded-xl flex items-center gap-4 border border-slate-700 shadow-md">
        <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-lg">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Avg Response Time</p>
          <p className="text-2xl font-bold text-emerald-400">{analytics?.average_response_time_minutes || 0.0} <span className="text-xs text-slate-400 font-normal">min</span></p>
        </div>
      </div>

      <div className="glass-panel p-4 rounded-xl flex items-center gap-4 border border-slate-700 shadow-md">
        <div className="p-3 bg-cyan-500/20 text-cyan-400 rounded-lg">
          <Zap className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Route Cache Hit Rate</p>
          <p className="text-2xl font-bold text-cyan-300">{cacheStats?.hit_rate_percentage || 0}%</p>
        </div>
      </div>
    </div>
  );
}
