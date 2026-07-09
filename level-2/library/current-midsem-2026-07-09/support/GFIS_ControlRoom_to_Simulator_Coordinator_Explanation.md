# GFIS Control Room to Industrial Simulator Coordinator

## What Was Added

The GFIS Model Control Room and Industrial 48-hour Simulation Engine now use a shared scenario handoff.

The control room publishes the current process-variable state:

```text
temperature, pH, OLR, HRT, TS, VS, C/N ratio, ambient temperature, moisture
```

The industrial simulator imports that state and uses it to modify:

- VFA/ALK soft-sensor pressure,
- methane yield trajectory,
- methane quality,
- warning/critical alarm behavior,
- 48-hour simulated process response.

## Operator Workflow

1. Open the Model Control Room.
2. Adjust process variables such as OLR, pH, temperature, HRT, TS or VS.
3. Run prediction or OLR sweep.
4. Click **Send to Industrial Simulator**.
5. The simulator opens with the same process state.
6. Run the 48-hour simulation and observe how the plant behavior changes.

## Why This Matters

Earlier, the simulator mainly showed accelerated process behavior over time. Now it also responds to operator-set process variables. This makes the demonstration closer to a digital-twin workflow:

```text
operator input -> process-state package -> simulation response -> stability interpretation
```

## What Changes In The Simulation

High-risk conditions increase VFA/ALK pressure:

- high OLR,
- low pH,
- low HRT,
- high solids,
- temperature deviation from mesophilic optimum.

The simulator then modifies methane output and warning behavior. This lets the evaluator see what changes when process variables are changed, instead of only watching a fixed animation.

## Digital Twin Positioning

This is still not a full industrial digital twin, because it is not continuously connected to a physical plant through IoT/SCADA. The correct phrase is:

> GFIS now demonstrates a digital-twin-ready coordination pattern, where control-room decisions are transferred into an industrial process simulator and reflected in the 48-hour simulated plant response.

## Viva Explanation

Use this:

> The model control room is the decision layer, and the industrial simulator is the virtual plant response layer. When I change OLR, pH or temperature in the control room, that state is handed to the simulator. The simulator recalculates VFA/ALK pressure and methane behavior during the 48-hour horizon. This demonstrates the digital-twin workflow we will later connect to real IoT or SCADA data.

