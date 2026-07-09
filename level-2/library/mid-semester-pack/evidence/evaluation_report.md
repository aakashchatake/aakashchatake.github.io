# GFIS Evaluation Report

## Model Comparison

| Model | R2 | RMSE | MAE |
|---|---:|---:|---:|
| LSTM | 0.2942 | 11.5712 | 9.0685 |
| XGBRegressor | 0.7556 | 6.7933 | 5.5517 |
| Validation-Weighted Ensemble | 0.7554 | 6.8114 | 5.5699 |
| Physics-Guided Ensemble | 0.7554 | 6.8114 | 5.5699 |

## Physics Consistency

- Physics violation count: `0`
- LSTM ensemble weight selected on validation data: `0.00`

## Interpretation

The tabular model currently performs strongest on the synthetic anaerobic digestion dataset. The LSTM branch is retained because the final dissertation system targets time-series plant data, where temporal dependencies and hydraulic retention effects are expected to become more significant. The physics-guided layer enforces feasible methane-yield bounds based on volatile solids and records violations for auditability.

## Feature Importance

A feature-importance artifact is generated at `reports/feature_importance.csv`. When SHAP is installed, this module can be extended to produce SHAP plots; the current build uses model-native feature importances as a reliable fallback.

## Controlled Research Scenarios

GFIS now includes controlled 48-hour stress experiments to evaluate digital-twin behavior beyond nominal prediction. The experiments cover nominal mesophilic operation, organic overload, pH shock, low-temperature disturbance, reduced HRT washout risk, high-solids feedstock, and corrective recovery operation.

| Scenario | Mean methane yield | Max VFA/ALK | Final stability | Warning/Critical hours | Physics violation hours |
|---|---:|---:|---|---:|---:|
| Nominal mesophilic operation | 199.342 | 0.197 | Stable | 0 | 0 |
| Organic overload | 200.932 | 0.335 | Warning | 48 | 0 |
| pH acidification shock | 152.935 | 0.284 | Stable | 0 | 0 |
| Low-temperature disturbance | 183.397 | 0.227 | Stable | 0 | 0 |
| Reduced HRT washout risk | 194.579 | 0.278 | Stable | 0 | 0 |
| High-solids feedstock | 213.273 | 0.251 | Stable | 0 | 0 |
| Corrective recovery operation | 196.719 | 0.152 | Stable | 0 | 0 |

The organic overload scenario demonstrates the soft-sensor warning pathway, while all scenarios remain within the volatile-solids-based physics feasibility bound. Full details are available in `reports/research_scenario_experiments.md`.
