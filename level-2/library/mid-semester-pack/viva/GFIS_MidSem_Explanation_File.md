# GFIS Mid-Semester Explanation File

## Project Identity

Green Fuel Intelligence System (GFIS) is a physics-guided hybrid AI framework for methane yield prediction, soft sensing, and digital-twin-ready simulation in anaerobic digestion. The work is positioned for the BITS Pilani M.Tech dissertation as a research-grade prototype, not as a simple web prediction page.

The abstract evaluation was accepted with an Excellent remark. The evaluator's feedback encouraged a stronger Physics-Informed Machine Learning framing, soft sensing, and digital-twin-ready simulation capability. In this pack, PIML is used in its established meaning of Physics-Informed Machine Learning while crediting the evaluator for sharpening the project direction.

## Problem Being Addressed

Anaerobic digestion is sensitive to multiple interacting variables: temperature, pH, organic loading rate, hydraulic retention time, total solids, volatile solids, C/N ratio, moisture, and prior reactor state. A black-box prediction alone is not sufficient because plant operators need stability warnings, feasible bounds, and explainable scenario behavior.

GFIS addresses this gap by combining:

- Methane yield prediction.
- VFA/ALK soft sensing.
- Stability classification.
- Physics feasibility checks based on volatile solids.
- Scenario simulation for disturbances such as overload, pH shock, low temperature, and HRT washout risk.
- API, dashboard, and portal interfaces for demonstration and documentation.

## Current Dataset Status

The present mid-semester results are preliminary and based on a synthetic/literature-inspired anaerobic digestion dataset. This dataset was prepared for controlled validation of the pipeline and model behavior. Final dissertation claims should be strengthened with public, laboratory, IoT, SCADA, or industrial plant data wherever available.

The pack contains:

- `04_Dataset_and_Evidence/synthetic_anaerobic_digestion_raw.csv`
- `04_Dataset_and_Evidence/synthetic_anaerobic_digestion_processed.csv`

## Current Model Evidence

The current evaluation reports:

| Model | R2 | RMSE | MAE |
|---|---:|---:|---:|
| LSTM | 0.2942 | 11.5712 | 9.0685 |
| XGBRegressor | 0.7556 | 6.7933 | 5.5517 |
| Validation-weighted ensemble | 0.7554 | 6.8114 | 5.5699 |
| Physics-guided ensemble | 0.7554 | 6.8114 | 5.5699 |

Physics violation count during evaluation: `0`.

Interpretation: the tabular model is currently strongest for the synthetic/literature-inspired dataset. The LSTM branch is retained because the final dissertation target includes time-series plant behavior, where temporal dependencies are expected to matter more once real sequential plant data is available.

## Demonstration Surfaces

The current implementation includes:

- FastAPI backend for prediction, simulation, soft sensor, optimization, and evaluation.
- Streamlit dashboard for model workflow and interactive inspection.
- HTML Level 2 portal for research navigation and document access.
- Industrial simulation/control-room page for plant-like telemetry and scenario behavior.
- SQLite logging for experiments, predictions, and simulations.
- Docker/AWS deployment preparation.

## What To Say In Viva

The safest technical statement is:

> GFIS is currently a digital-twin-ready simulation dashboard and research prototype. It is not yet claimed as a full industrial digital twin because it is not continuously connected to a physical biogas plant through IoT/SCADA. The present work builds the validated software, modelling, soft-sensing, and scenario-simulation foundation needed for that future extension.

## Mid-Semester Contribution

By mid-semester, the work has moved from accepted abstract to executable prototype:

- Dataset pipeline exists.
- Model training and evaluation exist.
- Physics-bound checking exists.
- VFA/ALK soft sensor exists.
- Scenario experiments exist.
- API and dashboard interfaces exist.
- Portal and documentation library exist.
- Research report and presentation are packaged.

## Remaining Work

The next phase should focus on:

- Stronger data validation and possible external/public/field data integration.
- Improved time-series experiments.
- Better uncertainty estimation.
- SHAP/explainability expansion.
- More robust deployment and user authentication.
- Dissertation-grade comparison with baseline models.
- Final report formatting, plagiarism check, and viva evidence preparation.

