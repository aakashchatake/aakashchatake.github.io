# GFIS Level 2 Blueprint

## Decision

Yes, GFIS Level 2 should be built on top of the existing GFIS domain, but it should not replace the existing public site.

The correct architecture is:

```text
Public GFIS website
  gfis.chatakeinnoworks.com
  Purpose: public-facing brand, overview, non-sensitive pages

GFIS Level 2
  level2.gfis.chatakeinnoworks.com
  Purpose: protected research workbench, documents, engine console, live readings

GFIS API
  api.gfis.chatakeinnoworks.com or internal private service
  Purpose: FastAPI endpoints for predictions, simulations, readings, reports, notes
```

## Why This Is The Right Direction

Level 2 gives the dissertation a professional project backbone. BITS expects evidence of continuous work across 16 weeks, not only a final report. A protected Level 2 workbench can show:

- The running model, not just screenshots
- The plant simulation and stability engine
- Research chronology and diary
- Evaluation reports and scenario experiments
- Architecture and deployment maturity
- Live or simulated sensor reading flow

This also separates public presentation from private research execution.

## Functional Areas

### 1. Engine Console

Connects to the GFIS FastAPI service:

- `/predict`
- `/simulate`
- `/plant-run`
- `/soft-sensor`
- `/optimize`
- `/evaluate`
- `/research/stress-tests`

The console should expose:

- Methane yield prediction
- Stability state
- Physics violation count
- VFA/ALK soft sensor
- What-if scenario controls
- 48 hour industrial simulation playback

### 2. Research Library

Central document index:

- BITS abstract and project outline
- Final abstract
- Dissertation research report
- Presentation PDF
- Evaluation report
- Demo evidence
- Scenario experiment logs
- Literature foundation
- 16 week execution plan

Each item should have:

- Title
- Type
- Version/date
- Status
- Download link
- Source path or deployed asset path

### 3. Notes

Private notes for:

- Supervisor discussion points
- Implementation decisions
- Literature notes
- Model design changes
- Data assumptions

MVP storage can be Markdown files. Production storage should be SQLite/PostgreSQL with authentication.

### 4. Research Diary

Daily entries should capture:

- Date
- Work completed
- Evidence generated
- Technical blocker
- Next action
- Report section affected

This becomes defensible evidence for a 16 week dissertation timeline.

### 5. Live Readings

Level 2 should ingest readings from:

- Synthetic sensor simulator
- CSV uploads
- Manual readings
- Future IoT gateway

Minimum reading fields:

- timestamp
- plant_id
- temperature
- pH
- OLR
- HRT
- TS
- VS
- VFA/ALK
- gas_flow
- methane_percent
- methane_yield
- stability_label

### 6. Deployment View

Show the project deployment pipeline:

- Local development on macOS
- Ubuntu VM environment
- Docker Compose services
- FastAPI backend
- Static Level 2 portal
- Future PostgreSQL migration
- ROS2/Gazebo simulation link

## Recommended Technical Design

```text
Browser
  Level 2 static portal or React app
      |
      v
FastAPI Gateway
  /level2/library
  /level2/notes
  /level2/diary
  /level2/readings
  /level2/reports
  /predict
  /simulate
  /plant-run
      |
      v
SQLite now, PostgreSQL later
      |
      v
Reports, model artifacts, simulation outputs
```

## Deployment Approach

Phase 1: Local protected prototype

- Keep this folder as a separate portal
- Link local research files through a manifest
- Serve as static HTML for review

Phase 2: Server deployment

- Deploy static portal to Nginx
- Reverse proxy API to FastAPI
- Protect with Cloudflare Access or Nginx auth
- Copy only approved reports/documents into the public server artifact directory

Phase 3: Full workbench

- Add login
- Add editable notes and diary
- Add database-backed live readings
- Add downloadable report bundles
- Add live model evaluation dashboard

## Do Not Do

- Do not overwrite the current GFIS website.
- Do not expose private dissertation files without authentication.
- Do not publish raw credentials or `.env` files.
- Do not make Level 2 only a marketing page. It must show the working system.

