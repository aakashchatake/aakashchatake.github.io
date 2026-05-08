# GFIS Unified Website

This package keeps GFIS under one domain and one identity.

Recommended public structure:

```text
https://gfis.chatakeinnoworks.com/
  Unified GFIS front page

https://gfis.chatakeinnoworks.com/level-1/
  Existing GFIS website preserved as Level 1

https://gfis.chatakeinnoworks.com/level-2/
  New dissertation, research, simulation, documents, notes, and live readings workbench
```

## Local Preview

```bash
cd /Users/akashchatake/Downloads/Chatake-Innoworks-Organization/Projects_legacy/CI_Greenworks/GFIS_V2/GFIS_UNIFIED_SITE
python3 -m http.server 8093
```

Then open:

```text
http://127.0.0.1:8093/
```

## Notes

- Level 1 is a copied preservation of the old GFIS static page.
- Level 2 is the new workbench.
- The front page explains scope, necessity, Chatake Innoworks work, DIPEX success, and provides the Level selector.
- Private dissertation files and diary/notes should not be deployed publicly without authentication.

