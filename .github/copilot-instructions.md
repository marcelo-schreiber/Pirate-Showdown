# Pirate Showdown - AI Coding Agent Instructions

## Project Overview

This is a **3D pirate ship combat game** built with React Three Fiber, Rapier Physics, and TypeScript. Players control a pirate character on a ship with cannons, focusing on ship-to-ship combat mechanics.

## Architecture & Tech Stack

- **React Three Fiber (R3F)** - Primary 3D rendering with Three.js
- **Rapier Physics** - Physics simulation via `@react-three/rapier`
- **Zustand** - Global state management (see `useGame` hook)
- **Vite** - Build tool with custom GLSL shader support via `vite-plugin-glsl`
- **Leva** - Debug controls (enabled via `#debug` URL hash or `debug` state)

## Key Architectural Patterns

### Entity-Component Structure
- **Entities** (`/src/entities/`): Game objects with physics (`Pirate.tsx`, `Ship.tsx`)
- **Models** (`/src/models/`): Pure 3D visual components (`Sea.tsx`, `Sun.tsx`, `Ship.tsx`)
- **Components/HUD** (`/src/components/hud/`): UI overlays and controls

### Core Game Loop in `Experience.tsx`
The main scene hierarchy:
```tsx
<Canvas> → <Physics> → <KeyboardControls> → Game Entities
```
- Physics paused on load for 750ms to prevent startup jitter
- Adaptive DPR and post-processing based on GPU detection
- Environment lighting using external HDR/EXR files

### State Management via Zustand (`useGame` hook)
Critical state patterns:
- **Character/Ship refs**: Direct access to physics bodies via `characterRef`/`shipRef`
- **Joint system**: `activeJoint` manages pirate-ship attachment (cannons/rudder)
- **Animation state**: Complex animation state machine with actions like `idle()`, `walk()`, `run()`
- **Debug mode**: Toggled via URL hash `#debug` or state

## Custom Libraries & Abstractions

### Ecctrl Character Controller (`/src/libs/ecctrl/`)
**CRITICAL**: This is a heavily customized character controller, not a third-party library.
- `Ecctrl.tsx` - 2000+ lines of physics-based character movement
- Integrates keyboard + joystick controls seamlessly
- Handles ground detection, slope walking, jumping mechanics
- **Always import from local path**: `@/libs/ecctrl/Ecctrl`

### Configuration Objects
- `pirateOptions.ts` - Character animations, positions, and ship attachment points
- `shipOptions.ts` - Heightfield collision data, cannon/rudder positions (300+ lines)
- These define the precise 3D coordinate system for character-ship interactions

## Development Workflows

### Running the Game
```bash
npm run dev          # Start development server
npm run build        # Production build
npm run type-check   # TypeScript validation without emit
```

### Debug Mode
- Add `#debug` to URL or set `debug: true` in state
- Enables Rapier physics debug rendering, Leva controls, detailed performance metrics
- **Essential for debugging physics interactions**

### Shader Development
- Custom GLSL shaders in `/src/shaders/` (water effects, lighting)
- Imported directly via `vite-plugin-glsl` (no manual string loading)
- Fragment shaders use custom uniforms for water color/reflection

## Key Integration Points

### Physics-Visual Sync
- Entities extend `RigidBodyProps` and manage both physics body + visual mesh
- Use `useFrame` for continuous physics → visual state sync
- **Critical**: Always check physics body exists before accessing properties

### Character-Ship Attachment
- Joint creation/destruction via Rapier's impulse joints
- Position/rotation calculated using `localToWorld` utility
- Attachment points defined in `pirateOptions.ts` with precise Vector3 offsets

### Mobile/Touch Support
- Joystick automatically shown on touch devices
- Keyboard controls map 1:1 with joystick directional input
- Touch detection via `"ontouchstart" in window`

## Common Patterns

### State Updates with Zustand
```tsx
// Always use useShallow for multiple properties
const { debug, setDebug, shipRef } = useGame(
  useShallow((s) => ({ debug: s.debug, setDebug: s.setDebug, shipRef: s.shipRef }))
);
```

### Physics Body Access
```tsx
// Always null-check physics bodies
useFrame(() => {
  if (!shipRef.current) return;
  const position = shipRef.current.translation();
  // ... use position
});
```

### Animation Triggers
```tsx
// Use game state methods, not direct state mutation
const { idle, walk, run } = useGame();
// Call methods: idle(), walk(), run()
```

## File Path Conventions
- **Absolute imports**: Use `@/` alias (configured in vite.config.ts)
- **Models**: Pure visual components in `/src/models/`
- **Entities**: Physics + visual in `/src/entities/`
- **Custom libs**: Always in `/src/libs/` (not node_modules)

## Current Development Focus
See README.md todo list - core mechanics include:
- Cannon locking/unlocking systems
- Ship navigation and collision
- Multiplayer architecture planning
- Character selection and powerups

When working on ship combat mechanics, reference the joint system in `Pirate.tsx` and attachment configurations in `pirateOptions.ts`.