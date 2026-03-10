# Resume ATS API + MCP Tool

Production-ready project for resume ATS scoring, bullet rewriting, and cover letter generation.

## What is included
- HTTP API (ideal for RapidAPI monetization)
- MCP server over stdio (ideal for MCP clients like Claude Desktop/Codex)

## Endpoints (HTTP)
- `POST /api/score` (no LLM key required)
- `POST /api/rewrite-bullets` (requires `OPENAI_API_KEY`)
- `POST /api/cover-letter` (requires `OPENAI_API_KEY`)

## MCP Tools (stdio)
- `ats_score_resume`
- `ats_rewrite_bullets`
- `ats_generate_cover_letter`

## Quick Start
```bash
npm install
cp .env.example .env
npm run dev
```

## Start MCP Server
```bash
npm run mcp:start
```

## Example Request: Score Resume
```bash
curl -X POST http://localhost:3000/api/score \
  -H "Content-Type: application/json" \
  -d "{\"resume_text\":\"...\",\"job_description\":\"...\"}"
```

## Deploy + Monetize on RapidAPI
1. Deploy this app to Render/Railway/Fly (`npm start`).
2. Copy your public base URL (example: `https://your-app.onrender.com`).
3. In RapidAPI Provider Dashboard, create API and connect that base URL.
4. Add these paths in RapidAPI:
   - `POST /api/score`
   - `POST /api/rewrite-bullets`
   - `POST /api/cover-letter`
5. Publish plans (example):
   - Free: 30 requests/month
   - Pro: 1,000 requests/month
   - Ultra: 10,000 requests/month

## Suggested Product Strategy
- Use `/api/score` as low-cost/high-volume tier.
- Keep LLM endpoints in paid tiers due token cost.
- Add logging + per-endpoint analytics after launch.
