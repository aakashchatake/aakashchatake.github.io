# GFIS Mid-Semester Presentation Script

## Opening

Good morning respected evaluator and faculty members. My dissertation project is titled Green Fuel Intelligence System, or GFIS. The work focuses on methane yield prediction, soft sensing, and digital-twin-ready simulation for anaerobic digestion using a physics-guided hybrid AI approach.

The abstract presentation was accepted with an Excellent remark. The feedback encouraged strengthening the work as a Physics-Informed Machine Learning framework with digital-twin-ready simulation capability. I have used that feedback to refine the mid-semester work from a prediction application into a research prototype with model evaluation, process constraints, soft sensing, and scenario simulation.

## Problem Statement

Anaerobic digestion is a nonlinear biological and chemical process. Methane yield is affected by temperature, pH, organic loading rate, hydraulic retention time, total solids, volatile solids, C/N ratio, moisture, and accumulated reactor state. If the model only predicts methane yield without process context, it can become a black-box tool and may not support operator decisions.

GFIS therefore tries to answer three questions:

1. What methane yield is expected under the current operating condition?
2. Is the operating condition stable, warning, or critical?
3. Does the prediction remain within a physically feasible methane bound?

## System Design

The system has four main layers.

First, the data layer generates and processes a synthetic/literature-inspired anaerobic digestion dataset. It handles process variables, missing values, normalization, lag features, rolling features, and time windows for sequential modelling.

Second, the model layer includes an XGBoost tabular model, a PyTorch LSTM branch, an ensemble prediction path, and a physics-guided ensemble check. The physics layer applies a volatile-solids-based methane upper bound and records violation counts.

Third, the soft-sensor layer estimates the VFA/ALK ratio and produces a stability label: Stable, Warning, or Critical.

Fourth, the interface layer includes FastAPI endpoints, Streamlit dashboard, HTML Level 2 portal, and an industrial simulation/control-room interface.

## Current Evidence

The current evaluation is preliminary and based on a synthetic/literature-inspired anaerobic digestion dataset. The tabular XGBoost model currently performs best, with R2 of 0.7556, RMSE of 6.7933, and MAE of 5.5517. The physics-guided ensemble reports zero physics-bound violations in the current evaluation.

The LSTM branch has weaker performance at this stage, with R2 of 0.2942. I have retained it because the final dissertation direction includes real sequential plant data, where temporal dependencies and retention-time effects can become more important.

## Scenario Experiments

Beyond one-step prediction, GFIS includes 48-hour controlled scenario experiments. These include nominal mesophilic operation, organic overload, pH acidification shock, low-temperature disturbance, reduced HRT washout risk, high-solids feedstock, and corrective recovery operation.

The important point is that the system is not only giving a number. It is showing how methane yield, VFA/ALK ratio, and stability behave under process disturbances. For example, the organic overload scenario activates the warning pathway through the soft sensor.

## Digital Twin Positioning

I am presenting the current system as a digital-twin-ready simulation dashboard, not as a complete industrial digital twin. A full industrial digital twin would require continuous connection with a physical biogas plant, IoT or SCADA data stream, and live calibration against plant behavior.

The current work builds the foundation: data pipeline, models, physics constraints, soft sensing, simulation, APIs, dashboard, and deployment structure.

## Demonstration Flow

For the live demonstration, I will show:

1. The GFIS portal and Level 2 workbench.
2. The industrial simulation/control-room interface.
3. A prediction or simulation run.
4. Stability output and VFA/ALK estimate.
5. Evidence files such as evaluation report, scenario experiments, and dataset.

If local services are running, the expected interfaces are:

- FastAPI backend: `http://127.0.0.1:8010`
- HTML portal/simulation: `http://127.0.0.1:8520`
- Streamlit dashboard: `http://127.0.0.1:8510`

## Limitations

The present version uses synthetic/literature-inspired data, so I will not claim real-plant validation yet. The system is also not continuously connected to IoT/SCADA. The final phase will focus on improving data quality, adding stronger explainability, testing uncertainty, and preparing dissertation-grade validation.

## Closing

In summary, GFIS has progressed from accepted abstract to a working mid-semester prototype. The contribution is a physics-guided hybrid AI framework that combines methane prediction, soft sensing, stability classification, simulation, and deployment-ready interfaces for anaerobic digestion research.

