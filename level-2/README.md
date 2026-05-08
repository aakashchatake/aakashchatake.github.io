# GFIS Level 2 Portal

GFIS Level 2 is the protected research and execution layer for the BITS Pilani dissertation work on the Physics-Guided AI Digital Twin for biogas methane production.

The existing public GFIS website must remain unchanged. Level 2 should be deployed separately as either:

- `https://gfis.chatakeinnoworks.com/level-2/`
- `https://level2.gfis.chatakeinnoworks.com/`

Recommended choice: use `level2.gfis.chatakeinnoworks.com` for the workbench and keep `/level-2` on the main site as a public landing or redirect.

## Purpose

Level 2 brings the research project into one controlled workspace:

- Working GFIS engines and simulations
- Research reports and BITS submission documents
- Live sensor readings and demo telemetry
- Experiment evidence and model evaluation outputs
- Notes, diary entries, and supervisor meeting records
- Deployment documents for Ubuntu, Docker, ROS2, Gazebo, and VM workflows

## Security Rule

Do not publish unpublished dissertation drafts, personal details, supervisor contact information, internal notes, raw credentials, or patent-sensitive material on an unprotected public page.

Before deploying Level 2 online, add authentication. Acceptable first options:

- Cloudflare Access in front of the subdomain
- Nginx basic auth for the portal path
- A proper FastAPI login layer with hashed passwords and session/JWT auth

## Current Local Contents

```text
GFIS_LEVEL_2_PORTAL/
├── index.html
├── assets/
│   └── level2.css
├── data/
│   └── portal_manifest.json
├── docs/
│   ├── LEVEL_2_BLUEPRINT.md
│   └── DEPLOYMENT_NOTES.md
├── notes/
│   └── README.md
├── diary/
│   └── 2026-05-06.md
├── library/
└── reports/
```

## Integration Targets

Primary dissertation system:

`/Users/akashchatake/Downloads/MTech/Semester_4/Dissertation_Prepared_Files/04_Drafts_and_Working_Documents/05_Implementation/GFIS_Project`

Existing GFIS V2 backend:

`/Users/akashchatake/Downloads/Chatake-Innoworks-Organization/Projects_legacy/CI_Greenworks/GFIS_V2/GFIS_V2_DEV`

