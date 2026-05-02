import { useState, useEffect } from 'react';
import { OceanView } from './components/OceanView';
import { ControlPanel } from './components/ControlPanel';
import { MetricsPanel } from './components/MetricsPanel';
import {
  createInitialState,
  updateSimulation,
  releasePod,
  recallPod,
  triggerEvent,
  increaseDepth,
  increaseCurrentStrength,
} from './simulation/engine';
import { SimulationState, EnvironmentalEvent } from './types/simulation';

function App() {
  const [state, setState] = useState<SimulationState>(createInitialState());
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const deltaTime = now - lastUpdate;
      setLastUpdate(now);

      setState(prevState => updateSimulation(prevState, deltaTime));
    }, 50);

    return () => clearInterval(interval);
  }, [lastUpdate]);

  const handleReleasePod = (podId: string) => {
    setState(prevState => releasePod(prevState, podId));
  };

  const handleRecallPod = (podId: string) => {
    setState(prevState => recallPod(prevState, podId));
  };

  const handleTogglePause = () => {
    setState(prevState => ({ ...prevState, isPaused: !prevState.isPaused }));
  };

  const handleIncreaseDepth = () => {
    setState(prevState => increaseDepth(prevState));
  };

  const handleIncreaseCurrentStrength = () => {
    setState(prevState => increaseCurrentStrength(prevState));
  };

  const handleTriggerEvent = (type: EnvironmentalEvent['type']) => {
    setState(prevState => triggerEvent(prevState, type));
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            MARISYN
          </h1>
          <p className="text-gray-400 text-sm">
            Autonomous Hadal-Zone Exploration Simulator
          </p>
          <p className="text-gray-500 text-xs max-w-2xl mx-auto">
            Scientific demonstration of autonomous deep-ocean pod systems operating under extreme pressure.
            Event-driven, energy-autonomous, non-invasive biological detection at depths beyond 6000m.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <OceanView state={state} />
          </div>

          <div className="space-y-6">
            <ControlPanel
              state={state}
              onReleasePod={handleReleasePod}
              onRecallPod={handleRecallPod}
              onTogglePause={handleTogglePause}
              onIncreaseDepth={handleIncreaseDepth}
              onIncreaseCurrentStrength={handleIncreaseCurrentStrength}
              onTriggerEvent={handleTriggerEvent}
            />
          </div>
        </div>

        <div>
          <MetricsPanel state={state} />
        </div>

        <footer className="text-center text-xs text-gray-600 space-y-1">
          <p>No GPS • No Tethers • No Anchors • Autonomous Navigation</p>
          <p>Energy Harvesting • Bio-Optical Scanning • Event-Driven Behavior</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
