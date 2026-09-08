import React, { useState } from 'react';
import { Play, CheckCircle, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';

export default function DemoPanel({ onRunDemoStep }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [log, setLog] = useState([]);

  const demoSteps = [
    { step: 1, title: 'Demo 1: Normal Route Calculation', desc: 'Calculates standard Dijkstra shortest route from Metro Hospital to Downtown Plaza.' },
    { step: 2, title: 'Demo 2: Dynamic Traffic Surge', desc: 'Injects SEVERE congestion on Civic Center Blvd along calculated route.' },
    { step: 3, title: 'Demo 3: Alternative Route Calculation', desc: 'System calculates alternative faster bypass route avoiding severe congestion.' },
    { step: 4, title: 'Demo 4: Create Ambulance Emergency', desc: 'Dispatches high-priority Ambulance (P1) from Metro Hospital to Foggy Bridge.' },
    { step: 5, title: 'Demo 5: Ambulance Priority Queue Dispatch', desc: 'Dispatches ambulance using MinHeap Priority Queue over lower priority units.' },
    { step: 6, title: 'Demo 6: Smart Signal Green Corridor', desc: 'Activates green corridor signals along active emergency path.' },
    { step: 7, title: 'Demo 7: Traffic Spike During Journey', desc: 'Injects road closure mid-journey while vehicle is in transit.' },
    { step: 8, title: 'Demo 8: Dynamic Dynamic Rerouting', desc: 'Emergency system detects slowdown and dynamically recalculates optimal path.' },
    { step: 9, title: 'Demo 9: Route Cache HIT/MISS Demo', desc: 'Demonstrates 0ms O(1) cache HIT followed by version invalidation on traffic edit.' },
    { step: 10, title: 'Demo 10: Analytics & Intelligence', desc: 'Renders response time metrics and traffic distribution overview.' }
  ];

  const handleNext = async () => {
    if (currentStep < demoSteps.length) {
      const stepObj = demoSteps[currentStep];
      const message = await onRunDemoStep(stepObj.step);
      setLog(prev => [...prev, `[Step ${stepObj.step}] ${stepObj.title}: ${message}`]);
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setLog([]);
  };

  return (
    <div className="glass-panel p-5 rounded-xl border border-slate-700 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
          <h2 className="text-lg font-bold text-slate-100">Automated 10-Step SmartCity Showcase Demo</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-cyan-300 bg-slate-800 px-2.5 py-1 rounded border border-slate-700">
            Step {currentStep} / {demoSteps.length}
          </span>
          <button
            onClick={handleReset}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
            title="Reset Demo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Step Controller */}
        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Next Showcase Action</h3>
            {currentStep < demoSteps.length ? (
              <div>
                <div className="text-base font-extrabold text-cyan-300 mb-1">{demoSteps[currentStep].title}</div>
                <p className="text-xs text-slate-300 mb-4">{demoSteps[currentStep].desc}</p>
              </div>
            ) : (
              <div className="text-sm font-bold text-emerald-400 flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5" /> Demo Showcase Completed Successfully!
              </div>
            )}
          </div>

          <button
            onClick={handleNext}
            disabled={currentStep >= demoSteps.length}
            className={`w-full py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${
              currentStep >= demoSteps.length
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            {currentStep === 0 ? 'Start Interactive Demo' : `Run Step ${currentStep + 1} (${demoSteps[currentStep]?.title})`}
          </button>
        </div>

        {/* Demo Execution Logs */}
        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 h-40 overflow-y-auto space-y-1.5">
          <div className="text-slate-500 italic mb-1">// Showcase Execution Logs:</div>
          {log.length === 0 ? (
            <div className="text-slate-600 italic">Click 'Start Interactive Demo' to execute step-by-step showcase scenarios.</div>
          ) : (
            log.map((entry, idx) => (
              <div key={idx} className="text-cyan-300 flex items-start gap-1.5">
                <ArrowRight className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>{entry}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
