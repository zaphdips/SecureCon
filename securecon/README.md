# SecureCon

Universal AI project context builder. Define security rules, quality standards, and legal requirements — generate a system prompt any AI coding tool understands.

## Features

- **Spec Builder** — toggle security, quality, and legal requirements
- **Test Functions** — named checks AI must pass before returning code  
- **Eval Engine** — weighted live scoring of your spec coverage
- **AI Code Review** — paste code, get structured pass/fail results from Claude
- **Export/Import** — share specs as JSON or use as `AI_CONTEXT.md` anywhere

## Deploy to Vercel (2 minutes)

1. Fork or clone this repo
2. Go to [vercel.com](https://vercel.com) → New Project → import your repo
3. Add environment variable: `ANTHROPIC_API_KEY` = your key from [console.anthropic.com](https://console.anthropic.com)
4. Deploy

That's it. Your API key stays server-side. Friends can use the app without ever seeing it.

## Run locally

```bash
cp .env.example .env.local
# fill in ANTHROPIC_API_KEY in .env.local

npm install
npm run dev
# open http://localhost:3000
```

## Use the generated context

| Where | How |
|-------|-----|
| **Cursor / Windsurf** | Paste into `.cursorrules` or `AGENTS.md` at project root |
| **Claude Projects** | Paste into Project Instructions |
| **ChatGPT Custom GPT** | Paste into system instructions |
| **Any AI session** | Save as `AI_CONTEXT.md`, paste as first message |
| **CI/CD** | POST to `/api/review` with code + spec JSON |

## API

### `POST /api/review`

Review code against a spec.

```json
{
  "code": "...your code...",
  "spec": { ...ProjectSpec object... }
}
```

Returns:
```json
{
  "score": 82,
  "results": [
    { "name": "no_client_secrets", "status": "pass", "message": "No credentials found in code." }
  ],
  "blockers": [],
  "summary": "Code is well-structured with no critical security issues found."
}
```

## Security notes

- `ANTHROPIC_API_KEY` is server-side only — never sent to browser
- All spec data is stored in `localStorage` — no database, no accounts
- Rate limiting: add middleware if you open this to the public
- Input is capped at 8000 chars for API calls
