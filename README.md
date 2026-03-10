# Resume ATS API + MCP Tool

Production-ready project for ATS resume scoring, bullet rewriting, and cover letter generation.

## Features
- HTTP API for RapidAPI monetization
- MCP server over stdio for MCP-compatible clients
- Swagger UI docs at `/docs`

## HTTP Endpoints
- `POST /api/score` (does not require OpenAI)
- `POST /api/rewrite-bullets` (requires `OPENAI_API_KEY`)
- `POST /api/cover-letter` (requires `OPENAI_API_KEY`)

## MCP Tools
- `ats_score_resume`
- `ats_rewrite_bullets`
- `ats_generate_cover_letter`

## Setup
```bash
npm install
copy .env.example .env
```

Then set your key in `.env`:
```env
OPENAI_API_KEY=your_key_here
```

## Run API
```bash
npm run dev
```

Base URL: `http://localhost:3000`

## Swagger Docs
After starting the server, open:
- `http://localhost:3000/docs`

## Run MCP Server
```bash
npm run mcp:start
```

## Quick API Test
```bash
curl -X POST http://localhost:3000/api/score ^
  -H "Content-Type: application/json" ^
  -d "{\"resume_text\":\"...\",\"job_description\":\"...\"}"
```

## Testing
```bash
npm test
```

## Deploy + Monetize on RapidAPI
1. Deploy app to Render/Railway/Fly using `npm start`.
2. Use your deployment URL as RapidAPI base URL.
3. Add these endpoints:
   - `POST /api/score`
   - `POST /api/rewrite-bullets`
   - `POST /api/cover-letter`
4. Publish plans (example):
   - Free: 30 requests/month
   - Pro: 1,000 requests/month
   - Ultra: 10,000 requests/month

## Recommended Pricing Strategy
- Keep `/api/score` in low-cost or free tier for high usage.
- Keep LLM-based endpoints in paid tiers to protect margin.
