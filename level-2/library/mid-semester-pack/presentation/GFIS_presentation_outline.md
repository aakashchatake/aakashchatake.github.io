# GFIS Presentation Outline

## Slide 1: Title

Green Fuel Intelligence System (GFIS): A Physics-Informed Hybrid Deep Learning Framework for Methane Yield Prediction in Anaerobic Digestion

## Slide 2: Problem

- Biogas methane yield is nonlinear and time-dependent.
- ADM1 is scientifically strong but complex.
- Pure ML can be accurate but physically inconsistent.
- Operators need simulation and decision support.

## Slide 3: Proposed Solution

- Physics-guided AI digital twin.
- XGBoost + LSTM + ensemble.
- Volatile-solids methane feasibility constraint.
- Soft sensor for VFA/ALK and stability.

## Slide 4: System Architecture

- Data layer.
- AI engine.
- Physics layer.
- Soft sensor.
- Digital twin.
- API and dashboard.

## Slide 5: Dataset and Features

- Temperature, pH, OLR, HRT, TS, VS, C/N, ambient temperature, moisture.
- Methane yield.
- VFA/ALK ratio.
- Stability label.
- Lag and rolling features.

## Slide 6: Model Results

- LSTM R2: 0.2942.
- XGBoost R2: 0.7556.
- Physics-guided ensemble R2: 0.7554.
- Physics violations: 0.

## Slide 7: Digital Twin Demo

- HTML control-room website.
- Streamlit dashboard.
- FastAPI prediction endpoints.
- What-if OLR simulation.
- Optimization result.

## Slide 8: Industrial Deployment

- Ubuntu VM.
- Docker.
- SQLite to PostgreSQL migration.
- ROS2/Gazebo future telemetry layer.

## Slide 9: Contributions

- End-to-end AI prototype.
- Physics consistency layer.
- Stability soft sensor.
- Digital twin simulation.
- Deployment-ready project structure.

## Slide 10: Future Work

- Real SCADA data.
- SHAP plots.
- Reinforcement learning control.
- IoT/edge deployment.
- Gasification module as future waste-to-energy extension.

