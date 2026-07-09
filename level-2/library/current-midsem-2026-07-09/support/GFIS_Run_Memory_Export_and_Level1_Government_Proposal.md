# GFIS Run Memory, Export System and Level 1 Government Proposal Workbench

## What Was Added

GFIS now has local experiment memory in the control room and industrial simulator.

This solves an important research issue: if the simulator runs but does not store data, it is only a visual demo. With memory and export, each run becomes evidence that can be used for reports, model analysis and viva explanation.

## Control Room Memory

The Model Control Room now records:

- prediction runs,
- parameter changes,
- OLR sweep runs,
- 48-hour plant traces,
- optimizer changes,
- handoff events sent to the industrial simulator.

It stores:

```text
timestamp, action, temperature, pH, OLR, HRT, TS, VS,
methane_yield, VFA_ALK_ratio, stability_label, parameter effect
```

Export options:

- CSV,
- JSON,
- Markdown report,
- reset memory after export.

## Industrial Simulator Memory

The industrial simulator now records:

- simulation start and pause,
- process-variable application,
- periodic 48-hour simulation samples,
- VFA/ALK pressure,
- methane yield,
- methane quality,
- current process state.

Export options:

- CSV,
- Markdown report,
- reset simulator memory after export.

## Why This Matters For LSTM and XGBoost

The exported logs can become training and validation data for later modelling.

For XGBoost:

- each row can act as a tabular sample,
- features are process variables,
- targets are methane yield, VFA/ALK and stability label.

For LSTM:

- exported time-ordered simulator records can form sequence windows,
- reactor behavior over the 48-hour horizon can be treated as temporal data,
- future IoT records can replace the simulated records.

## Level 1 Government Proposal Workbench

A new Level 1 local page was added:

```text
http://127.0.0.1:8561/GFIS_Level1_Government_Proposal_Local/
```

It explains GFIS as a government-scale planning system:

- national plant distribution,
- district hub-and-spoke planning,
- village/taluka suitability scoring,
- K-Means style cluster planning,
- XGBoost/LSTM methane prediction,
- IoT monitoring,
- copyright/IP positioning.

## Level 1 to Level 2 Story

Use this explanation:

> Level 1 answers where biogas plants should be installed. It uses GIS, feedstock availability, infrastructure access and economic suitability for plant distribution planning. Level 2 answers how each plant should be monitored and optimized after installation. It uses PIML, XGBoost, LSTM, VFA/ALK soft sensing and 48-hour simulation for plant operation.

## Copyright/IP Reference

The presentation pack now includes:

- GFIS Level 1 DIPEX report,
- GFIS copyright application,
- GFIS copyright acknowledgement slip,
- author NOC.

Folder:

```text
07_Level1_and_IP_Reference/
```

Use careful wording:

> GFIS is being treated as protected software/IP. The available copyright application and acknowledgement documents are included as evidence. Final legal claims should be reviewed by legal counsel before government or commercial submission.

## New Screenshots

Screenshots added:

- `08_control_room_memory_export_panel.png`
- `09_industrial_simulator_memory_panel.png`
- `10_level1_government_planner_localhost.png`

