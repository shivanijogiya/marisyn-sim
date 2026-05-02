# MARISYN – Autonomous Hadal-Zone Exploration Simulator

A scientific simulation demonstrating autonomous deep-ocean pod systems operating in the hadal zone under extreme pressure (>1000 atm). Built for the GeoRift ideathon.

## Overview

MARISYN (Marine Autonomous Research & Investigation SYstem Network) is an interactive systems-behavior demonstrator that visualizes how autonomous pods can explore the deepest parts of our oceans without GPS, tethers, or constant surface communication. The simulation models energy-autonomous pods that use bio-optical scanning to study microbes in extreme environments.

## Core Scientific Principles

### Autonomous Operation Constraints

The simulation adheres to realistic deep-ocean constraints:

- **No GPS**: Positioning systems don't work at hadal depths
- **No Tethers or Anchors**: Completely free-floating autonomous operation
- **No Constant Surface Communication**: Pods operate independently
- **Extreme Pressure Tolerance**: Functional at >1000 atmospheres (6000-11000m depth)
- **Energy Autonomy**: Harvest energy from water currents
- **Non-Invasive Detection**: Bio-optical scanning without physical capture

### Why These Constraints?

1. **No GPS**: Radio signals cannot penetrate deep water. Traditional positioning systems are ineffective beyond a few hundred meters.

2. **No Tethers**: Cables create drag, limit range, and become structurally unreliable at extreme depths. Autonomous operation is essential for true exploration.

3. **Autonomous Energy**: Solar power is unavailable at hadal depths. The system harvests kinetic energy from deep-ocean currents, which are slow but persistent.

4. **Pressure Adaptation**: At 11,000m depth, pressure exceeds 1,100 atmospheres. The system must maintain structural integrity and electronic functionality under these conditions.

## System Components

### Mother Shell (Central Station)

The Mother Shell serves as:
- Energy storage and distribution hub
- Data collection center
- Pod docking station
- Pressure-stable central hub

Located at approximately 6,500m depth, it maintains a stable position through passive buoyancy control and minimal propulsion.

### Autonomous Pods

Each pod is equipped with:
- **Energy Management System**: Harvests energy from water currents, monitors consumption
- **Navigation System**: Inertial guidance using pressure gradients, chemical gradients, and current direction
- **Sensor Suite**: Bio-optical scanners for detecting bioluminescence and fluorescent biosignatures
- **State Machine**: Event-driven behavior to conserve energy
- **Communication Module**: Short-range data transfer with Mother Shell during docking

## Simulation Logic

### Energy System

**Energy Sources:**
- Water current strength determines energy harvest rate
- Stronger currents = faster charging
- Passive energy collection even during idle states

**Energy Consumption:**
- Movement: 0.3 units/second
- Bio-optical scanning: 0.5 units/second
- Idle monitoring: 0.1 units/second

**Energy Conservation:**
- Pods enter passive listening mode when energy drops below 20%
- Return to shell automatically when energy is critically low
- Recharge to 100% when docked

### Pressure Model

Pressure increases linearly with depth:
- 6,000m = 600 atm
- 7,000m = 700 atm
- 8,000m = 800 atm
- 9,000m = 900 atm
- 10,000m = 1,000 atm
- 11,000m = 1,100 atm

All pods and the Mother Shell are designed to function across this entire pressure range.

### Event-Driven Behavior

Pods remain in **idle mode** by default to conserve energy. They activate scanning mode only when detecting:

1. **Chemical Spikes**: Sudden changes in chemical composition
2. **Microbial Blooms**: Increased biological activity
3. **Pressure Gradients**: Rapid pressure changes indicating geological events
4. **Turbidity Events**: Sediment disturbances

This event-driven approach mimics how real deep-sea systems must operate efficiently with limited energy resources.

### Autonomous Navigation

Without GPS or external references, pods navigate using:

1. **Inertial Movement**: Dead reckoning with drift compensation
2. **Pressure Gradients**: Depth sensing for vertical positioning
3. **Chemical Gradients**: Following or avoiding chemical signatures
4. **Current Direction**: Using water flow patterns for orientation
5. **Acoustic Ranging**: Short-range positioning relative to Mother Shell

### Bio-Optical Light Scanning

Pods emit low-intensity, targeted light beams to trigger biological responses:

**Detection Methods:**
- **Bioluminescence**: Many deep-sea organisms produce light when disturbed
- **Fluorescent Biosignatures**: UV-sensitive compounds in cell walls glow under specific wavelengths
- **Reflectance Patterns**: Microbe colonies reflect light differently than water

**Non-Invasive Principle:**
Light scanning allows biological detection and characterization without physical sampling. This preserves the ecosystem and allows repeated observations.

### Microbial Study Parameters

Each detected microbe is characterized by:
- **Depth & Pressure**: Where it was found and pressure tolerance
- **Cell Membrane Flexibility**: Adaptation to extreme pressure
- **Metal Interaction**: Ability to metabolize or interact with minerals
- **Bioluminescent Properties**: Light production capability

This data helps scientists understand how life adapts to extreme environments.

## How This Maps to Real Deep-Sea Systems

### Current Technology Analogues

1. **Autonomous Underwater Vehicles (AUVs)**: Similar to MARISYN pods but typically tethered or pre-programmed
2. **Seagliders**: Energy-harvesting underwater drones (but operate at shallower depths)
3. **Benthic Landers**: Stationary observation stations (like Mother Shell concept)

### MARISYN's Innovation

MARISYN demonstrates a **distributed autonomous network** where:
- Multiple pods operate independently
- Energy is harvested continuously
- Event-driven behavior maximizes efficiency
- Bio-optical scanning enables non-invasive study
- No external infrastructure required

This approach could enable long-term, large-scale hadal zone exploration.

## Using the Simulator

### Controls

**Pod Operations:**
- **Release Pod**: Deploy a docked pod into the environment
- **Recall Pod**: Command an active pod to return to Mother Shell

**Environment:**
- **Increase Depth**: Extend maximum operational depth
- **Increase Current**: Strengthen water currents (increases energy harvest)

**Trigger Events:**
- **Chemical Spike**: Creates a chemical anomaly to attract pods
- **Microbial Bloom**: Spawns new microbes in a region
- **Pressure Gradient**: Simulates geological pressure changes
- **Turbidity**: Creates sediment disturbance

**Simulation:**
- **Pause/Resume**: Control simulation time

### Observing the Simulation

**Visual Elements:**
- **Pressure Layers**: Horizontal lines showing depth and pressure
- **Water Currents**: Animated arrows indicating current direction and strength
- **Mother Shell**: Large central structure with docking capability
- **Pods**: Colored spheres with energy indicators
  - Gray: Docked
  - Blue: Idle
  - Green: Scanning
  - Orange: Returning
- **Light Beams**: Blue halos when bio-optical scanning is active
- **Microbes**: Small dots that glow when illuminated
- **Events**: Colored zones showing environmental disturbances

**Metrics Panel:**
Watch real-time data including:
- Pod energy levels and states
- Current depth and pressure
- Detected microbe counts
- Environmental conditions

### Simulation Workflow

1. **Start**: Two pods are docked at the Mother Shell
2. **Release**: Deploy a pod to begin exploration
3. **Trigger Event**: Create a chemical spike or microbial bloom
4. **Observe**: Watch the pod detect the event and activate scanning
5. **Energy Management**: Monitor energy levels as the pod works
6. **Return**: Pod automatically returns when energy is low
7. **Repeat**: Release multiple pods to explore different regions

## Technical Implementation

### Architecture

```
marisyn-sim/
├── src/
│   ├── types/
│   │   └── simulation.ts          # Core types and interfaces
│   ├── simulation/
│   │   └── engine.ts               # Simulation logic and physics
│   ├── components/
│   │   ├── OceanView.tsx           # Canvas-based visualization
│   │   ├── ControlPanel.tsx        # User controls
│   │   └── MetricsPanel.tsx        # Live metrics display
│   ├── App.tsx                     # Main application
│   └── main.tsx                    # Entry point
```

### Simulation Engine

The core simulation runs at 20Hz (50ms intervals) and updates:
- Pod positions and velocities
- Energy levels based on activity
- Microbe bioluminescence in response to light
- Event propagation and effects
- Current flow patterns

### State Management

React hooks manage simulation state with:
- Immutable state updates
- Deterministic physics calculations
- Event-driven state transitions
- Real-time rendering

## Installation and Running

```bash
npm install
npm run dev
```

Build for production:
```bash
npm run build
```

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Rendering**: HTML5 Canvas (60fps target)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite

## Scientific Accuracy vs. Simplification

### Accurate Representations

✓ Pressure increases with depth
✓ Energy limitations drive behavior
✓ Autonomous navigation without external infrastructure
✓ Bio-optical detection methods exist
✓ Event-driven systems conserve power

### Simplified for Demonstration

⚠ Real ocean currents are more complex and variable
⚠ Actual energy harvesting rates would be much slower
⚠ Navigation algorithms simplified from real inertial systems
⚠ Microbe detection ranges compressed for visibility
⚠ Communication protocols abstracted

## Educational Value

MARISYN demonstrates:

1. **Systems Thinking**: How interconnected components create emergent behavior
2. **Energy Economics**: Why deep-sea systems must be incredibly efficient
3. **Autonomous Operation**: Decision-making without human intervention
4. **Scientific Methodology**: Non-invasive observation techniques
5. **Extreme Environment Engineering**: Design constraints for hadal zone technology

## Future Extensions

Potential additions to enhance realism:

- Acoustic communication simulation
- Thermal gradient effects
- Geological event modeling (earthquakes, vents)
- Multi-pod coordination behaviors
- Data compression and transmission delays
- Pod damage and repair requirements
- Swarm intelligence algorithms

## Credits

Built for the GeoRift ideathon as a demonstration of autonomous deep-ocean exploration concepts.

## License

MIT License - Educational and research purposes
