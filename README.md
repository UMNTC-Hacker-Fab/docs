# Minnesota Nanofabrication Docs

Static docs site: no build step. Pages are Markdown in `content/`, rendered in the browser.

## Run locally

```powershell
powershell -ExecutionPolicy Bypass -File serve.ps1
```

Open http://localhost:8000.

## Layout

```
index.html           site shell
assets/js/nav.js     sidebar structure: fab > process area > machine > pages
assets/js/app.js     router, markdown rendering, search, outline
assets/css/site.css  theme
content/             one .md per page; route = path without .md
  gen-one/<machine>/index.md, build.md, sop.md
  gen-two/...
  rnd/...
```

Adding a page: create the `.md` file, then add it to `assets/js/nav.js`.

## Markdown extras

- Callouts: `> [!NOTE]`, `> [!TIP]`, `> [!WARNING]`, `> [!DANGER]`
- Status pill: `> [!STATUS] In progress`
- Card grid: a fenced block with language `cards`, one `Title | description | #/route` per line
- Internal links: `[Spinner SOP](#/gen-one/spinner/sop)`
