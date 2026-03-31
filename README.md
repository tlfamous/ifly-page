# iFLY Local Page

Local recreation of the hosted iFLY page at:

`https://storage.googleapis.com/c7o-yagi5wlved-cdn/ifly/bot/obbcg68itx/test.html`

## Run locally

From `/Users/tod.famous/Documents/iFLY/app`:

```bash
python3 -m http.server 4173
```

Then open:

`http://localhost:4173`

## Notes

- The tall background image is stored locally in `./public/hero-bg.png`.
- The bot widget is still loaded from the hosted `@enegelai/bot-widget` package so the page behaves like the source.
- The local version adds a best-effort clear action that removes likely widget conversation keys from browser storage before reloading.
