# GFIS Level 2 Deployment Notes

## Local Preview

Open:

```text
GFIS_V2/GFIS_LEVEL_2_PORTAL/index.html
```

or serve it:

```bash
python3 -m http.server 8092
```

from the `GFIS_LEVEL_2_PORTAL` directory.

## Suggested Production Layout

```text
/var/www/gfis-public/              existing website
/var/www/gfis-level2/              Level 2 portal
/opt/gfis-api/                     FastAPI service
/opt/gfis-data/                    database, reports, generated evidence
```

## Nginx Sketch

```nginx
server {
    server_name level2.gfis.chatakeinnoworks.com;

    root /var/www/gfis-level2;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8010/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Authentication is handled by the custom GFIS login screen for Documentation, Library, Diary, Notes, and Admin sections. Do not add whole-path browser Basic Auth to `/level-2/` if the public Level 2 dashboard should remain accessible.

## Document Publishing Rule

Only copy approved files into the deployed `library/` directory. Keep original working files in the dissertation workspace.
