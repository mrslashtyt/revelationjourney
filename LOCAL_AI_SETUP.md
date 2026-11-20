# Revelation Journey — local Ask AI setup

The Ask AI backend is a Cloudflare Pages Function. Vite's plain development server does not execute Pages Functions, so use Wrangler for local testing.

## 1. Install the project dependencies

```bash
npm install
```

## 2. Add your local OpenRouter secret

Copy `.dev.vars.example` to `.dev.vars`, then replace the placeholder with your OpenRouter API key:

```dotenv
OPENROUTER_API_KEY=your_key_here
```

Keep `.dev.vars` private. It is ignored by Git and must never be committed, pasted into chat, or placed in a `VITE_` variable.

## 3. Start the local Cloudflare Pages server

```bash
npm run dev:pages
```

This builds the Vite site into `dist`, then runs `wrangler pages dev dist`. Open the local URL printed by Wrangler (usually `http://localhost:8788`). Do not use the Vite-only `npm run dev` command to test `/api/chat`, because that server does not run Pages Functions.

If you change frontend source files, stop the server and run `npm run dev:pages` again so the `dist` folder is rebuilt.

## 4. Production configuration

In the existing Cloudflare Pages project, add `OPENROUTER_API_KEY` as an encrypted environment variable for the Production environment (and Preview if you use previews). Redeploy after saving it. Do not add the key to frontend variables or the repository.

## AI model and cost behavior

The function pins exactly one model: `google/gemma-4-31b-it:free`. It sends no paid fallback model and does not retry with another model. OpenRouter currently lists this model as free, but free endpoints can be rate-limited or temporarily unavailable. A provider error is shown to the user instead of switching to a paid model.

## Notes

- Chat messages are saved in `sessionStorage` for the current browser tab/session and are not stored in a database.
- The in-memory per-IP request limiter is best-effort per Cloudflare isolate, not a globally coordinated quota.
- The backend accepts up to 12 recent messages and limits individual message length and request size.
