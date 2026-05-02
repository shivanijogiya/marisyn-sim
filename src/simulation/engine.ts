import {
  Pod,
  Shell,
  Microbe,
  WaterCurrent,
  EnvironmentalEvent,
  SimulationState,
  HADAL_ZONE,
  POD_CONFIG,
  SIMULATION_CONFIG,
} from '../types/simulation';

export const calculatePressure = (depth: number): number => {
  const ratio = (depth - HADAL_ZONE.MIN_DEPTH) / (HADAL_ZONE.MAX_DEPTH - HADAL_ZONE.MIN_DEPTH);
  return HADAL_ZONE.PRESSURE_AT_6000M + ratio * (HADAL_ZONE.PRESSURE_AT_11000M - HADAL_ZONE.PRESSURE_AT_6000M);
};

export const depthToY = (depth: number): number => {
  const ratio = (depth - HADAL_ZONE.MIN_DEPTH) / (HADAL_ZONE.MAX_DEPTH - HADAL_ZONE.MIN_DEPTH);
  return ratio * SIMULATION_CONFIG.HEIGHT;
};

export const yToDepth = (y: number): number => {
  const ratio = y / SIMULATION_CONFIG.HEIGHT;
  return HADAL_ZONE.MIN_DEPTH + ratio * (HADAL_ZONE.MAX_DEPTH - HADAL_ZONE.MIN_DEPTH);
};

export const createInitialState = (): SimulationState => {
  const shellY = depthToY(SIMULATION_CONFIG.SHELL_DEPTH);

  const shell: Shell = {
    x: SIMULATION_CONFIG.WIDTH / 2,
    y: shellY,
    depth: SIMULATION_CONFIG.SHELL_DEPTH,
    dockedPods: ['pod-1', 'pod-2'],
    energyStorage: 500,
    dataStorage: [],
  };

  const pods: Pod[] = [
    {
      id: 'pod-1',
      x: shell.x - 30,
      y: shell.y,
      depth: shell.depth,
      energy: POD_CONFIG.MAX_ENERGY,
      maxEnergy: POD_CONFIG.MAX_ENERGY,
      state: 'docked',
      velocityX: 0,
      velocityY: 0,
      detectedMicrobes: [],
      scanningRadius: POD_CONFIG.SCAN_RADIUS,
      lightBeamActive: false,
    },
    {
      id: 'pod-2',
      x: shell.x + 30,
      y: shell.y,
      depth: shell.depth,
      energy: POD_CONFIG.MAX_ENERGY,
      maxEnergy: POD_CONFIG.MAX_ENERGY,
      state: 'docked',
      velocityX: 0,
      velocityY: 0,
      detectedMicrobes: [],
      scanningRadius: POD_CONFIG.SCAN_RADIUS,
      lightBeamActive: false,
    },
  ];

  const microbes: Microbe[] = generateMicrobes(15);
  const currents: WaterCurrent[] = generateCurrents();

  return {
    shell,
    pods,
    microbes,
    currents,
    events: [],
    isPaused: false,
    time: 0,
    maxDepth: HADAL_ZONE.MAX_DEPTH,
    currentStrength: 1,
  };
};

const generateMicrobes = (count: number): Microbe[] => {
  const microbes: Microbe[] = [];
  for (let i = 0; i < count; i++) {
    const depth = HADAL_ZONE.MIN_DEPTH + Math.random() * (HADAL_ZONE.MAX_DEPTH - HADAL_ZONE.MIN_DEPTH);
    microbes.push({
      id: `microbe-${i}`,
      x: Math.random() * SIMULATION_CONFIG.WIDTH,
      y: depthToY(depth),
      depth,
      pressureTolerance: 800 + Math.random() * 400,
      cellMembraneFlexibility: Math.random(),
      metalInteraction: Math.random() > 0.7,
      bioluminescent: Math.random() > 0.5,
      glowIntensity: 0,
    });
  }
  return microbes;
};

const generateCurrents = (): WaterCurrent[] => {
  const currents: WaterCurrent[] = [];
  for (let i = 0; i < 5; i++) {
    const y = (i / 5) * SIMULATION_CONFIG.HEIGHT;
    currents.push({
      x: 0,
      y,
      width: SIMULATION_CONFIG.WIDTH,
      height: SIMULATION_CONFIG.HEIGHT / 5,
      velocityX: (Math.random() - 0.5) * 2,
      velocityY: (Math.random() - 0.5) * 0.5,
      strength: Math.random() * 2,
    });
  }
  return currents;
};

export const updateSimulation = (state: SimulationState, deltaTime: number): SimulationState => {
  if (state.isPaused) return state;

  const newState = { ...state, time: state.time + deltaTime };

  newState.pods = newState.pods.map(pod => updatePod(pod, newState, deltaTime));
  newState.microbes = newState.microbes.map(microbe => updateMicrobe(microbe, newState));
  newState.events = newState.events.filter(event => event.active);

  return newState;
};

const updatePod = (pod: Pod, state: SimulationState, deltaTime: number): Pod => {
  const newPod = { ...pod };

  if (newPod.state === 'docked') {
    if (newPod.energy < newPod.maxEnergy) {
      newPod.energy = Math.min(newPod.maxEnergy, newPod.energy + 0.5);
    }
    return newPod;
  }

  const current = getCurrentAtPosition(newPod.x, newPod.y, state.currents);

  if (current) {
    newPod.energy = Math.min(
      newPod.maxEnergy,
      newPod.energy + current.strength * POD_CONFIG.ENERGY_HARVEST_RATE * state.currentStrength * (deltaTime / 1000)
    );
  }

  if (newPod.state === 'idle') {
    newPod.energy = Math.max(0, newPod.energy - POD_CONFIG.ENERGY_CONSUMPTION_RATE * (deltaTime / 1000));

    const nearbyEvent = checkNearbyEvents(newPod, state.events);
    if (nearbyEvent && newPod.energy > POD_CONFIG.PASSIVE_THRESHOLD) {
      newPod.state = 'scanning';
      newPod.lightBeamActive = true;
    }

    if (newPod.energy < POD_CONFIG.PASSIVE_THRESHOLD) {
      newPod.state = 'returning';
    }
  } else if (newPod.state === 'scanning') {
    newPod.energy = Math.max(0, newPod.energy - POD_CONFIG.ENERGY_SCAN_RATE * (deltaTime / 1000));
    newPod.lightBeamActive = true;

    const detectedMicrobes = detectMicrobes(newPod, state.microbes);
    newPod.detectedMicrobes = detectedMicrobes;

    if (newPod.energy < POD_CONFIG.PASSIVE_THRESHOLD || detectedMicrobes.length === 0) {
      newPod.state = 'idle';
      newPod.lightBeamActive = false;
    }
  } else if (newPod.state === 'moving' || newPod.state === 'returning') {
    newPod.energy = Math.max(0, newPod.energy - POD_CONFIG.ENERGY_MOVE_RATE * (deltaTime / 1000));

    if (current) {
      newPod.velocityX += current.velocityX * 0.1;
      newPod.velocityY += current.velocityY * 0.1;
    }

    if (newPod.state === 'returning') {
      const dx = state.shell.x - newPod.x;
      const dy = state.shell.y - newPod.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 40) {
        newPod.state = 'docked';
        newPod.x = state.shell.x + (Math.random() - 0.5) * 60;
        newPod.y = state.shell.y;
        newPod.velocityX = 0;
        newPod.velocityY = 0;
        newPod.lightBeamActive = false;
      } else {
        newPod.velocityX += (dx / distance) * 0.2;
        newPod.velocityY += (dy / distance) * 0.2;
      }
    }

    const speed = Math.sqrt(newPod.velocityX ** 2 + newPod.velocityY ** 2);
    if (speed > POD_CONFIG.MAX_SPEED) {
      newPod.velocityX = (newPod.velocityX / speed) * POD_CONFIG.MAX_SPEED;
      newPod.velocityY = (newPod.velocityY / speed) * POD_CONFIG.MAX_SPEED;
    }

    newPod.velocityX *= 0.98;
    newPod.velocityY *= 0.98;

    newPod.x += newPod.velocityX;
    newPod.y += newPod.velocityY;

    newPod.x = Math.max(20, Math.min(SIMULATION_CONFIG.WIDTH - 20, newPod.x));
    newPod.y = Math.max(20, Math.min(SIMULATION_CONFIG.HEIGHT - 20, newPod.y));
    newPod.depth = yToDepth(newPod.y);
  }

  return newPod;
};

const updateMicrobe = (microbe: Microbe, state: SimulationState): Microbe => {
  const newMicrobe = { ...microbe };

  const nearbyPods = state.pods.filter(pod => {
    if (!pod.lightBeamActive) return false;
    const dx = pod.x - microbe.x;
    const dy = pod.y - microbe.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < pod.scanningRadius;
  });

  if (nearbyPods.length > 0 && microbe.bioluminescent) {
    newMicrobe.glowIntensity = Math.min(1, newMicrobe.glowIntensity + 0.1);
  } else {
    newMicrobe.glowIntensity = Math.max(0, newMicrobe.glowIntensity - 0.05);
  }

  const current = getCurrentAtPosition(microbe.x, microbe.y, state.currents);
  if (current) {
    newMicrobe.x += current.velocityX * 0.5;
    newMicrobe.y += current.velocityY * 0.5;
    newMicrobe.x = Math.max(0, Math.min(SIMULATION_CONFIG.WIDTH, newMicrobe.x));
    newMicrobe.y = Math.max(0, Math.min(SIMULATION_CONFIG.HEIGHT, newMicrobe.y));
    newMicrobe.depth = yToDepth(newMicrobe.y);
  }

  return newMicrobe;
};

const getCurrentAtPosition = (x: number, y: number, currents: WaterCurrent[]): WaterCurrent | null => {
  for (const current of currents) {
    if (y >= current.y && y < current.y + current.height) {
      return current;
    }
  }
  return null;
};

const checkNearbyEvents = (pod: Pod, events: EnvironmentalEvent[]): EnvironmentalEvent | null => {
  for (const event of events) {
    if (!event.active) continue;
    const dx = pod.x - event.x;
    const dy = pod.y - event.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < event.radius) {
      return event;
    }
  }
  return null;
};

const detectMicrobes = (pod: Pod, microbes: Microbe[]): Microbe[] => {
  return microbes.filter(microbe => {
    const dx = pod.x - microbe.x;
    const dy = pod.y - microbe.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < pod.scanningRadius;
  });
};

export const releasePod = (state: SimulationState, podId: string): SimulationState => {
  const newState = { ...state };
  const podIndex = newState.pods.findIndex(p => p.id === podId);

  if (podIndex !== -1 && newState.pods[podIndex].state === 'docked') {
    newState.pods[podIndex] = {
      ...newState.pods[podIndex],
      state: 'idle',
      velocityY: 1,
    };
    newState.shell.dockedPods = newState.shell.dockedPods.filter(id => id !== podId);
  }

  return newState;
};

export const recallPod = (state: SimulationState, podId: string): SimulationState => {
  const newState = { ...state };
  const podIndex = newState.pods.findIndex(p => p.id === podId);

  if (podIndex !== -1 && newState.pods[podIndex].state !== 'docked') {
    newState.pods[podIndex] = {
      ...newState.pods[podIndex],
      state: 'returning',
      lightBeamActive: false,
    };
  }

  return newState;
};

export const triggerEvent = (
  state: SimulationState,
  type: EnvironmentalEvent['type']
): SimulationState => {
  const newState = { ...state };
  const x = Math.random() * SIMULATION_CONFIG.WIDTH;
  const y = Math.random() * SIMULATION_CONFIG.HEIGHT;

  newState.events.push({
    type,
    x,
    y,
    radius: 150,
    intensity: 1,
    active: true,
  });

  if (type === 'microbial_bloom') {
    const newMicrobes = generateMicrobes(5).map(m => ({
      ...m,
      x: x + (Math.random() - 0.5) * 100,
      y: y + (Math.random() - 0.5) * 100,
    }));
    newState.microbes.push(...newMicrobes);
  }

  return newState;
};

export const increaseDepth = (state: SimulationState): SimulationState => {
  return {
    ...state,
    maxDepth: Math.min(HADAL_ZONE.MAX_DEPTH + 1000, state.maxDepth + 500),
  };
};

export const increaseCurrentStrength = (state: SimulationState): SimulationState => {
  return {
    ...state,
    currentStrength: Math.min(3, state.currentStrength + 0.5),
  };
};
