# Unified GFIS Deployment

## Target

Deploy this folder as the public root of:

```text
gfis.chatakeinnoworks.com
```

## Routing

```text
/          Unified GFIS front page
/level-1/  Existing GFIS website
/level-2/  New Level 2 research workbench
```

## Security

Level 2 is now publicly reachable at the shell/dashboard level. Documentation, Library, Diary, Notes, and Admin are gated by the custom GFIS login UI. For production-grade private documents, prefer backend sessions, Cognito, signed CloudFront URLs, or Cloudflare Access on only the private document routes rather than browser Basic Auth on the whole `/level-2/` path.

## Nginx Sketch

```nginx
server {
    server_name gfis.chatakeinnoworks.com;
    root /var/www/gfis-unified;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /level-2/ {
        try_files $uri $uri/ /level-2/index.html;
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
