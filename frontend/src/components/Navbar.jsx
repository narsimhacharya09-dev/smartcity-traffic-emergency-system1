import React, { useState, useEffect } from 'react';
import { Activity, ShieldAlert, Cpu, Database, RefreshCw, Wifi, WifiOff } from 'lucide-react';

export default function Navbar({ health, trafficVersion, wsConnected, onRefresh }) {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="glass-panel px-6 py-4 rounded-xl flex flex-wrap items-center justify-between gap-4 mb-6 shadow-lg border border-slate-700">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg text-white shadow-md">
          <ShieldAlert className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
            SmartCity Traffic & Emergency Control
          </h1>
          <p className="text-xs text-slate-400 font-mono">Dijkstra Shortest Path & Priority Routing Engine v1.0</p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs font-medium">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">
          <Database className="w-4 h-4 text-cyan-400" />
          <span>DB: <strong className="text-slate-200">{health?.database?.storage_mode || 'Checking...'}</strong></span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">
          <Cpu className="w-4 h-4 text-purple-400" />
          <span>ML: <strong className="text-purple-300">{health?.ml_model?.is_loaded ? 'RandomForest Ready' : 'Heuristic Active'}</strong></span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">
          <Activity className="w-4 h-4 text-amber-400" />
          <span>Traffic Ver: <strong className="text-amber-300">v{trafficVersion}</strong></span>
        </div>

        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${wsConnected ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300' : 'bg-rose-950/60 border-rose-700 text-rose-300'}`}>
          {wsConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
          <span>{wsConnected ? 'Live Telemetry' : 'Disconnected'}</span>
        </div>

        <div className="text-slate-400 font-mono px-2 py-1 bg-slate-800 rounded">
          {time}
        </div>

        <button
          onClick={onRefresh}
          className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-200 transition-colors shadow"
          title="Refresh All System Data"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
