# GFIS Research Scenario Experiments

Generated at: 2026-05-05T18:23:21.834539+00:00

Hours per case: `48`

## Purpose

These experiments evaluate GFIS under controlled anaerobic-digestion operating conditions rather than only under a nominal point prediction. Each case exercises a different dissertation-relevant behavior: methane-yield response, soft-sensor stability warning, and physics-bound feasibility checking.

## Scenario Summary

| Scenario | Mean methane yield | Max VFA/ALK | Final stability | Warning/Critical hours | Physics violation hours |
| --- | ---: | ---: | --- | ---: | ---: |
| Nominal mesophilic operation | 199.342 | 0.197 | Stable | 0 | 0 |
| Organic overload | 200.932 | 0.335 | Warning | 48 | 0 |
| pH acidification shock | 152.935 | 0.284 | Stable | 0 | 0 |
| Low-temperature disturbance | 183.397 | 0.227 | Stable | 0 | 0 |
| Reduced HRT washout risk | 194.579 | 0.278 | Stable | 0 | 0 |
| High-solids feedstock | 213.273 | 0.251 | Stable | 0 | 0 |
| Corrective recovery operation | 196.719 | 0.152 | Stable | 0 | 0 |

## Case Notes

### Nominal mesophilic operation

Research purpose: Reference condition for stable methane production.

- Point methane yield: `199.941`
- Point VFA/ALK: `0.189`
- Point stability: `Stable`
- 48h mean methane yield: `199.342`
- 48h maximum VFA/ALK: `0.197`
- Warning/Critical hours: `0`
- Physics violation hours: `0`

### Organic overload

Research purpose: Tests whether the soft sensor detects rising VFA/ALK risk under high organic loading.

- Point methane yield: `201.86`
- Point VFA/ALK: `0.331`
- Point stability: `Warning`
- 48h mean methane yield: `200.932`
- 48h maximum VFA/ALK: `0.335`
- Warning/Critical hours: `48`
- Physics violation hours: `0`

### pH acidification shock

Research purpose: Simulates acidification stress and checks whether methane prediction remains physics-bounded.

- Point methane yield: `168.845`
- Point VFA/ALK: `0.272`
- Point stability: `Stable`
- 48h mean methane yield: `152.935`
- 48h maximum VFA/ALK: `0.284`
- Warning/Critical hours: `0`
- Physics violation hours: `0`

### Low-temperature disturbance

Research purpose: Tests loss of mesophilic efficiency during a thermal disturbance.

- Point methane yield: `182.792`
- Point VFA/ALK: `0.219`
- Point stability: `Stable`
- 48h mean methane yield: `183.397`
- 48h maximum VFA/ALK: `0.227`
- Warning/Critical hours: `0`
- Physics violation hours: `0`

### Reduced HRT washout risk

Research purpose: Represents short retention time and potential biomass washout risk.

- Point methane yield: `181.19`
- Point VFA/ALK: `0.261`
- Point stability: `Stable`
- 48h mean methane yield: `194.579`
- 48h maximum VFA/ALK: `0.278`
- Warning/Critical hours: `0`
- Physics violation hours: `0`

### High-solids feedstock

Research purpose: Tests high TS/VS operation and the volatile-solids methane upper-bound layer.

- Point methane yield: `211.753`
- Point VFA/ALK: `0.236`
- Point stability: `Stable`
- 48h mean methane yield: `213.273`
- 48h maximum VFA/ALK: `0.251`
- Warning/Critical hours: `0`
- Physics violation hours: `0`

### Corrective recovery operation

Research purpose: Tests an operator intervention with lower OLR, higher HRT, and near-neutral pH.

- Point methane yield: `196.944`
- Point VFA/ALK: `0.15`
- Point stability: `Stable`
- 48h mean methane yield: `196.719`
- 48h maximum VFA/ALK: `0.152`
- Warning/Critical hours: `0`
- Physics violation hours: `0`

## Dissertation Interpretation

The experiments support the dissertation claim that GFIS is an operational decision-support digital twin. The system does not only return methane-yield estimates; it evaluates process stability, applies a physics feasibility layer, logs simulation runs, and gives a structured basis for comparing normal operation, overload, disturbance, and corrective action.

Current limitation: these runs use a synthetic anaerobic-digestion dataset. Final dissertation text should state this clearly and position the system as a deployable research prototype that can be recalibrated with plant or public experimental data.

